import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types.js';

export async function generateGraphQL(config: StackConfig, backendDir: string) {
  if (config.backend === 'express') {
    await generateExpressGraphQL(config, backendDir);
  } else if (config.backend === 'nestjs') {
    await generateNestJSGraphQL(config, backendDir);
  }
}

async function generateExpressGraphQL(config: StackConfig, backendDir: string) {
  // Update package.json
  const packageJson = await fs.readJSON(path.join(backendDir, 'package.json'));
  packageJson.dependencies['graphql'] = '^16.8.1';
  packageJson.dependencies['@apollo/server'] = '^4.10.0';
  packageJson.dependencies['@graphql-tools/schema'] = '^10.0.2';
  await fs.writeJSON(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });

  // Create GraphQL directory
  const graphqlDir = path.join(backendDir, 'src', 'graphql');
  await fs.ensureDir(graphqlDir);
  await fs.ensureDir(path.join(graphqlDir, 'resolvers'));
  await fs.ensureDir(path.join(graphqlDir, 'types'));

  // Schema
  const schema = `import { gql } from 'graphql-tag';

export const typeDefs = gql\`
  type User {
    id: ID!
    email: String!
    name: String
    ${config.multiTenant ? 'tenantId: String' : ''}
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
  }

  type Mutation {
    register(email: String!, password: String!, name: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
\`;
`;
  await fs.writeFile(path.join(graphqlDir, 'schema.ts'), schema);

  // Resolvers
  const resolvers = `import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
${config.database === 'mongodb' ? "import User from '../models/User';" : "import prisma from '../lib/prisma';"}

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      
      ${config.database === 'mongodb' ? `
      return await User.findById(context.user.userId);
      ` : `
      return await prisma.user.findUnique({
        where: { id: context.user.userId },
      });
      `}
    },
    users: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      
      ${config.database === 'mongodb' ? `
      return await User.find(${config.multiTenant ? '{ tenantId: context.user.tenantId }' : '{}'});
      ` : `
      return await prisma.user.findMany(${config.multiTenant ? '{ where: { tenantId: context.user.tenantId } }' : '{}'});
      `}
    },
  },
  Mutation: {
    register: async (_: any, { email, password, name }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      ${config.database === 'mongodb' ? `
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
      });
      ` : `
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      `}
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      
      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      ${config.database === 'mongodb' ? `
      const user = await User.findOne({ email });
      ` : `
      const user = await prisma.user.findUnique({
        where: { email },
      });
      `}
      
      if (!user) throw new Error('Invalid credentials');
      
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      
      return { token, user };
    },
  },
};
`;
  await fs.writeFile(path.join(graphqlDir, 'resolvers', 'index.ts'), resolvers);

  // Apollo Server setup
  const apolloSetup = `import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import jwt from 'jsonwebtoken';

export async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  
  return expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET!);
          return { user };
        } catch (err) {
          return {};
        }
      }
      
      return {};
    },
  });
}
`;
  await fs.writeFile(path.join(graphqlDir, 'server.ts'), apolloSetup);
}

async function generateNestJSGraphQL(config: StackConfig, backendDir: string) {
  // Update package.json
  const packageJson = await fs.readJSON(path.join(backendDir, 'package.json'));
  packageJson.dependencies['@nestjs/graphql'] = '^12.0.11';
  packageJson.dependencies['@nestjs/apollo'] = '^12.0.11';
  packageJson.dependencies['@apollo/server'] = '^4.10.0';
  packageJson.dependencies['graphql'] = '^16.8.1';
  await fs.writeJSON(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });

  // GraphQL module
  const graphqlModule = `import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
  ],
})
export class GraphqlModule {}
`;
  await fs.writeFile(path.join(backendDir, 'src', 'graphql.module.ts'), graphqlModule);

  // User resolver
  const userResolver = `import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Query()
  @UseGuards(JwtAuthGuard)
  async me(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Mutation()
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name?: string,
  ) {
    return this.authService.register({ email, password, name });
  }

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login({ email, password });
  }
}
`;
  await fs.writeFile(path.join(backendDir, 'src', 'users', 'users.resolver.ts'), userResolver);
}

export async function generateTRPC(config: StackConfig, backendDir: string, frontendDir: string) {
  // Backend setup
  const packageJson = await fs.readJSON(path.join(backendDir, 'package.json'));
  packageJson.dependencies['@trpc/server'] = '^10.45.0';
  packageJson.dependencies['zod'] = '^3.22.4';

  // Add auth dependencies - tRPC auth router always uses bcryptjs/jwt
  packageJson.dependencies['bcryptjs'] = '^2.4.3';
  packageJson.dependencies['jsonwebtoken'] = '^9.0.2';
  if (!packageJson.devDependencies) packageJson.devDependencies = {};
  packageJson.devDependencies['@types/bcryptjs'] = '^2.4.6';
  packageJson.devDependencies['@types/jsonwebtoken'] = '^9.0.7';

  await fs.writeJSON(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });

  // tRPC router
  const trpcDir = path.join(backendDir, 'src', 'trpc');
  await fs.ensureDir(trpcDir);
  await fs.ensureDir(path.join(trpcDir, 'routers'));

  const trpcSetup = `import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
`;
  await fs.writeFile(path.join(trpcDir, 'trpc.ts'), trpcSetup);

  const authRouter = `import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
${config.database === 'mongodb' ? "import User from '../../models/User';" : "import prisma from '../../lib/prisma';"}

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      ${config.database === 'mongodb' ? `
      const user = await User.create({
        email: input.email,
        password: hashedPassword,
        name: input.name,
      });
      ` : `
      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });
      `}
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      
      return { token, user: { id: user.id, email: user.email, name: user.name } };
    }),
    
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      ${config.database === 'mongodb' ? `
      const user = await User.findOne({ email: input.email });
      ` : `
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      `}
      
      if (!user) throw new Error('Invalid credentials');
      
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) throw new Error('Invalid credentials');
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      
      return { token, user: { id: user.id, email: user.email, name: user.name } };
    }),
});
`;
  await fs.writeFile(path.join(trpcDir, 'routers', 'auth.ts'), authRouter);

  // Frontend tRPC client
  const frontendPackageJson = await fs.readJSON(path.join(frontendDir, 'package.json'));
  frontendPackageJson.dependencies['@trpc/client'] = '^10.45.0';
  frontendPackageJson.dependencies['@trpc/react-query'] = '^10.45.0';
  frontendPackageJson.dependencies['@tanstack/react-query'] = '^4.36.1';
  await fs.writeJSON(path.join(frontendDir, 'package.json'), frontendPackageJson, { spaces: 2 });

  const isNext = config.frontend === 'nextjs';
  const frontendLibDir = path.join(frontendDir, isNext ? 'lib' : 'src/lib');
  await fs.ensureDir(frontendLibDir);

  const relativePath = isNext ? '../../backend/src/trpc/routers' : '../../../backend/src/trpc/routers';
  const trpcClient = `import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '${relativePath}';

export const trpc = createTRPCReact<AppRouter>();
`;
  await fs.writeFile(path.join(frontendLibDir, 'trpc.ts'), trpcClient);
}
