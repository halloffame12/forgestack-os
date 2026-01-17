import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types.js';

export async function generateBackend(config: StackConfig, backendDir: string) {
  switch (config.backend) {
    case 'express':
      await generateExpress(config, backendDir);
      break;
    case 'fastify':
      await generateFastify(config, backendDir);
      break;
    case 'nestjs':
      await generateNestJS(config, backendDir);
      break;
    case 'bun-elysia':
      await generateBunElysia(config, backendDir);
      break;
    case 'go-fiber':
      await generateGoFiber(config, backendDir);
      break;
    default:
      throw new Error(`Unsupported backend: ${config.backend}`);
  }
}

async function generateExpress(config: StackConfig, backendDir: string) {
  // Package.json
  const packageJson = {
    name: `${config.projectName}-backend`,
    version: '0.1.0',
    scripts: {
      dev: 'tsx watch src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
      'db:migrate': config.database === 'postgresql' || config.database === 'mysql' || config.database === 'sqlite' ? 'prisma migrate dev' : undefined,
      'db:generate': config.database === 'postgresql' || config.database === 'mysql' || config.database === 'sqlite' ? 'prisma generate' : undefined,
    },
    dependencies: {
      express: '^5.1.0',
      cors: '^2.8.5',
      dotenv: '^16.4.1',
      helmet: '^7.1.0',
      'express-rate-limit': '^7.1.5',
      zod: '^3.24.1',
      ...(config.auth === 'jwt' && {
        jsonwebtoken: '^9.0.2',
        bcryptjs: '^2.4.3',
      }),
      ...(config.database.includes('prisma') || config.database === 'postgresql' || config.database === 'mysql' || config.database === 'sqlite' ? { '@prisma/client': '^6.2.0' } : {}),
      ...(config.database === 'mongodb' && { mongoose: '^8.9.0' }),
    },
    devDependencies: {
      '@types/express': '^5.0.0',
      '@types/cors': '^2.8.17',
      '@types/node': '^20.17.0',
      ...(config.auth === 'jwt' && {
        '@types/jsonwebtoken': '^9.0.7',
        '@types/bcryptjs': '^2.4.6',
      }),
      typescript: '^5.7.2',
      tsx: '^4.19.2',
      ...(config.database.includes('prisma') || config.database === 'postgresql' || config.database === 'mysql' || config.database === 'sqlite' ? { prisma: '^6.2.0' } : {}),
    },
  };

  await fs.writeJSON(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });

  await fs.writeJSON(path.join(backendDir, '.eslintrc.json'), {
    root: true,
    extends: ["eslint:recommended"],
    env: { node: true, es2021: true }
  }, { spaces: 2 });

  // TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'ES2021',
      module: 'CommonJS',
      moduleResolution: 'node',
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      outDir: './dist',
      rootDir: './src',
      strict: true,
      incremental: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  await fs.writeJSON(path.join(backendDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // Create src directory structure
  const srcDir = path.join(backendDir, 'src');
  await fs.ensureDir(srcDir);
  await fs.ensureDir(path.join(srcDir, 'routes'));
  await fs.ensureDir(path.join(srcDir, 'middleware'));
  await fs.ensureDir(path.join(srcDir, 'controllers'));
  await fs.ensureDir(path.join(srcDir, 'lib'));

  // Main server file
  const indexTs = getExpressIndex(config);
  await fs.writeFile(path.join(srcDir, 'index.ts'), indexTs);

  // Routes
  const healthRoute = `import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: '${config.projectName}-backend'
  });
});

export default router;
`;

  await fs.writeFile(path.join(srcDir, 'routes', 'health.ts'), healthRoute);

  // Error handler middleware
  const errorHandler = `import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', err);

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
`;

  await fs.writeFile(path.join(srcDir, 'middleware', 'errorHandler.ts'), errorHandler);

  // Multi-tenant middleware if enabled
  if (config.multiTenant) {
    const tenantMiddleware = getTenantMiddleware(config);
    await fs.writeFile(path.join(srcDir, 'middleware', 'tenant.ts'), tenantMiddleware);
  }
}

function getExpressIndex(config: StackConfig): string {
  return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
${config.auth === 'jwt' ? "import authRouter from './routes/auth';" : ''}
import { errorHandler } from './middleware/errorHandler';
${config.multiTenant ? "import { tenantMiddleware } from './middleware/tenant';" : ''}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // increased for flexibility in dev
});
app.use('/api', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

${config.multiTenant ? '// Multi-tenant middleware\napp.use(tenantMiddleware);' : ''}

// Routes
app.use('/api', healthRouter);
${config.auth === 'jwt' ? "app.use('/api/auth', authRouter);" : ''}

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/api/health\`);
});
`;
}

function getTenantMiddleware(config: StackConfig): string {
  if (config.auth === 'jwt') {
    return `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface TenantRequest extends Request {
  tenantId?: string;
  userId?: string;
}

export function tenantMiddleware(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '${config.jwtSecret}') as any;
    req.tenantId = decoded.tenantId;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    next();
  }
}
`;
  } else if (config.auth === 'clerk') {
    return `import { Request, Response, NextFunction } from 'express';

export interface TenantRequest extends Request {
  tenantId?: string;
  userId?: string;
}

export function tenantMiddleware(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  // Clerk organization ID is used as tenant ID
  // Extract from Clerk session token
  const orgId = req.headers['x-clerk-org-id'] as string;

  if (orgId) {
    req.tenantId = orgId;
  }

  next();
}
`;
  }

  return `import { Request, Response, NextFunction } from 'express';

export interface TenantRequest extends Request {
  tenantId?: string;
  userId?: string;
}

export function tenantMiddleware(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  // Extract tenant ID from request
  // Implementation depends on your auth provider
  const tenantId = req.headers['x-tenant-id'] as string;

  if (tenantId) {
    req.tenantId = tenantId;
  }

  next();
}
`;
}

async function generateFastify(config: StackConfig, backendDir: string) {
  // Package.json
  const packageJson = {
    name: `${config.projectName}-backend`,
    version: '0.1.0',
    scripts: {
      dev: 'tsx watch src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
      'db:migrate': config.database === 'postgresql' || config.database === 'mysql' || config.database === 'sqlite' ? 'prisma migrate dev' : undefined,
      'db:generate': config.database === 'postgresql' || config.database === 'mysql' || config.database === 'sqlite' ? 'prisma generate' : undefined,
    },
    dependencies: {
      fastify: '^5.6.1',
      '@fastify/cors': '^9.0.1',
      '@fastify/helmet': '^11.1.0',
      '@fastify/rate-limit': '^9.0.1',
      '@fastify/jwt': '^8.0.0',
      dotenv: '^16.4.1',
      zod: '^3.24.1',
      ...(config.auth === 'jwt' && {
        bcrypt: '^5.1.1',
      }),
      ...(config.database === 'mongodb' && { mongoose: '^8.9.0' }),
      ...(config.database !== 'mongodb' && { '@prisma/client': '^6.2.0' }),
    },
    devDependencies: {
      '@types/node': '^20.17.0',
      '@types/bcrypt': '^5.0.2',
      typescript: '^5.7.2',
      tsx: '^4.19.2',
      ...(config.database !== 'mongodb' && { prisma: '^6.2.0' }),
    },
  };

  await fs.writeJSON(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });

  await fs.writeJSON(path.join(backendDir, '.eslintrc.json'), {
    root: true,
    extends: ["eslint:recommended"],
    env: { node: true, es2021: true }
  }, { spaces: 2 });

  // TypeScript config (same as Express)
  const tsConfig = {
    compilerOptions: {
      target: 'ES2021',
      module: 'CommonJS',
      moduleResolution: 'node',
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      outDir: './dist',
      rootDir: './src',
      strict: true,
      incremental: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  await fs.writeJSON(path.join(backendDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // Create structure
  const srcDir = path.join(backendDir, 'src');
  await fs.ensureDir(srcDir);
  await fs.ensureDir(path.join(srcDir, 'routes'));
  await fs.ensureDir(path.join(srcDir, 'plugins'));

  // Main server
  const indexTs = `import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
${config.auth === 'jwt' ? "import authRoutes from './routes/auth.js';" : ''}

dotenv.config();

const fastify = Fastify({ logger: true });

// Plugins
fastify.register(helmet);
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
fastify.register(rateLimit, {
  max: 1000,
  timeWindow: '15m',
});
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || '${config.jwtSecret}',
});

// Routes
fastify.get('/api/health', async () => {
  return { status: 'ok', service: '${config.projectName}-backend' };
});

${config.auth === 'jwt' ? "fastify.register(authRoutes, { prefix: '/api/auth' });" : ''}

// Start
const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
`;

  await fs.writeFile(path.join(srcDir, 'index.ts'), indexTs);
}

async function generateNestJS(config: StackConfig, backendDir: string) {
  // Package.json
  const packageJson = {
    name: `${config.projectName}-backend`,
    version: '0.1.0',
    scripts: {
      dev: 'nest start --watch',
      build: 'nest build',
      format: 'prettier --write "src/**/*.ts"',
      start: 'nest start',
      'start:dev': 'nest start --watch',
      'start:debug': 'nest start --debug --watch',
      'start:prod': 'node dist/main',
      lint: 'eslint "{src,apps,libs,test}/**/*.ts" --fix',
    },
    dependencies: {
      '@nestjs/common': '^10.4.0',
      '@nestjs/core': '^10.4.0',
      '@nestjs/platform-express': '^10.4.0',
      '@nestjs/config': '^3.3.0',
      '@nestjs/jwt': '^10.2.0',
      '@nestjs/passport': '^10.0.0',
      '@nestjs/swagger': '^7.4.0',
      'passport': '^0.7.0',
      'passport-jwt': '^4.0.1',
      'bcrypt': '^5.1.1',
      'class-validator': '^0.14.1',
      'class-transformer': '^0.5.1',
      'reflect-metadata': '^0.2.2',
      'rxjs': '^7.8.1',
      ...(config.database === 'mongodb' && { '@nestjs/mongoose': '^11.0.0', 'mongoose': '^8.9.0' }),
      ...(config.database !== 'mongodb' && { '@prisma/client': '^6.2.0' }),
    },
    devDependencies: {
      '@nestjs/cli': '^10.4.0',
      '@nestjs/schematics': '^10.1.0',
      '@nestjs/testing': '^10.4.0',
      '@types/express': '^5.0.0',
      '@types/node': '^20.17.0',
      '@types/passport-jwt': '^4.0.1',
      '@types/bcrypt': '^5.0.2',
      '@typescript-eslint/eslint-plugin': '^8.18.0',
      '@typescript-eslint/parser': '^8.18.0',
      'eslint': '^9.16.0',
      'prettier': '^3.4.0',
      'typescript': '^5.7.2',
      ...(config.database !== 'mongodb' && { 'prisma': '^6.2.0' }),
    },
  };

  await fs.writeJSON(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });

  await fs.writeJSON(path.join(backendDir, '.eslintrc.json'), {
    root: true,
    extends: ["eslint:recommended"],
    env: { node: true, es2021: true }
  }, { spaces: 2 });

  // NestJS CLI config
  const nestCliJson = {
    '$schema': 'https://json.schemastore.org/nest-cli',
    collection: '@nestjs/schematics',
    sourceRoot: 'src',
    compilerOptions: {
      deleteOutDir: true,
    },
  };

  await fs.writeJSON(path.join(backendDir, 'nest-cli.json'), nestCliJson, { spaces: 2 });

  // TypeScript config
  const tsConfig = {
    compilerOptions: {
      module: 'commonjs',
      declaration: true,
      removeComments: true,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      allowSyntheticDefaultImports: true,
      target: 'ES2021',
      moduleResolution: 'node',
      resolveJsonModule: true,
      sourceMap: true,
      outDir: './dist',
      baseUrl: './',
      incremental: true,
      skipLibCheck: true,
      strict: true,
      noImplicitAny: false,
      strictBindCallApply: false,
      forceConsistentCasingInFileNames: true,
      noFallthroughCasesInSwitch: true,
    },
  };

  await fs.writeJSON(path.join(backendDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // Create directory structure
  const srcDir = path.join(backendDir, 'src');
  await fs.ensureDir(srcDir);
  await fs.ensureDir(path.join(srcDir, 'auth'));
  await fs.ensureDir(path.join(srcDir, 'auth/guards'));
  await fs.ensureDir(path.join(srcDir, 'auth/strategies'));
  await fs.ensureDir(path.join(srcDir, 'auth/dto'));
  await fs.ensureDir(path.join(srcDir, 'users'));
  await fs.ensureDir(path.join(srcDir, 'users/dto'));
  await fs.ensureDir(path.join(srcDir, 'common/interceptors'));
  await fs.ensureDir(path.join(srcDir, 'common/filters'));
  await fs.ensureDir(path.join(srcDir, 'config'));
  await fs.ensureDir(path.join(srcDir, 'database'));

  // Main.ts
  const mainTs = `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('${config.projectName} API')
    .setDescription('Generated by ForgeStack OS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3001);
  console.log(\`Application is running on: \${await app.getUrl()}\`);
}
bootstrap();
`;

  await fs.writeFile(path.join(srcDir, 'main.ts'), mainTs);

  // App Module
  const appModule = `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
`;

  await fs.writeFile(path.join(srcDir, 'app.module.ts'), appModule);

  // Configuration
  const configFile = `export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || '${config.jwtSecret}',
    expiresIn: '7d',
  },
});
`;

  await fs.writeFile(path.join(srcDir, 'config', 'configuration.ts'), configFile);

  // Database Module
  if (config.database === 'mongodb') {
    const dbModule = `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.url'),
      }),
    }),
  ],
})
export class DatabaseModule {}
`;
    await fs.writeFile(path.join(srcDir, 'database', 'database.module.ts'), dbModule);
  } else {
    const prismaService = `import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
`;
    await fs.writeFile(path.join(srcDir, 'database', 'prisma.service.ts'), prismaService);

    const dbModule = `import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
`;
    await fs.writeFile(path.join(srcDir, 'database', 'database.module.ts'), dbModule);
  }

  // Auth DTOs
  const loginDto = `import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;
}
`;

  await fs.writeFile(path.join(srcDir, 'auth/dto', 'login.dto.ts'), loginDto);

  const registerDto = `import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ required: false })
  @IsString()
  name?: string;
}
`;

  await fs.writeFile(path.join(srcDir, 'auth/dto', 'register.dto.ts'), registerDto);

  // JWT Strategy
  const jwtStrategy = `import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email${config.multiTenant ? ', tenantId: payload.tenantId' : ''} };
  }
}
`;

  await fs.writeFile(path.join(srcDir, 'auth/strategies', 'jwt.strategy.ts'), jwtStrategy);

  // JWT Auth Guard
  const jwtAuthGuard = `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
`;

  await fs.writeFile(path.join(srcDir, 'auth/guards', 'jwt-auth.guard.ts'), jwtAuthGuard);

  // Auth Service
  const authService = getNestJSAuthService(config);
  await fs.writeFile(path.join(srcDir, 'auth', 'auth.service.ts'), authService);

  // Auth Controller
  const authController = `import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
`;

  await fs.writeFile(path.join(srcDir, 'auth', 'auth.controller.ts'), authController);

  // Auth Module
  const authModule = `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<string>('jwt.expiresIn') },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
`;

  await fs.writeFile(path.join(srcDir, 'auth', 'auth.module.ts'), authModule);

  // Users Module
  const usersService = getNestJSUsersService(config);
  await fs.writeFile(path.join(srcDir, 'users', 'users.service.ts'), usersService);

  const usersController = `import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }
}
`;

  await fs.writeFile(path.join(srcDir, 'users', 'users.controller.ts'), usersController);

  const usersModule = `import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
`;

  await fs.writeFile(path.join(srcDir, 'users', 'users.module.ts'), usersModule);

  // Tenant Interceptor (if multi-tenant)
  if (config.multiTenant) {
    const tenantInterceptor = `import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (user && user.tenantId) {
      request.tenantId = user.tenantId;
    }
    
    return next.handle();
  }
}
`;
    await fs.writeFile(path.join(srcDir, 'common/interceptors', 'tenant.interceptor.ts'), tenantInterceptor);
  }

  // .env.example
  const envExample = `PORT=3001
DATABASE_URL=${config.database === 'mongodb' ? 'mongodb://localhost:27017/myapp' : 'postgresql://user:password@localhost:5432/myapp'}
JWT_SECRET=${config.jwtSecret}
`;

  await fs.writeFile(path.join(backendDir, '.env.example'), envExample);

  // .gitignore
  const gitignore = `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# Environment
.env
.env.local
`;

  await fs.writeFile(path.join(backendDir, '.gitignore'), gitignore);
}

async function generateBunElysia(config: StackConfig, backendDir: string) {
  // Package.json
  const packageJson = {
    name: `${config.projectName}-backend`,
    version: '0.1.0',
    scripts: {
      dev: 'bun dev',
      build: 'echo "Bun build not required"',
      start: 'bun src/index.ts',
    },
    dependencies: {
      elysia: '^1.0.0',
      '@elysiajs/cors': '^1.0.0',
      '@elysiajs/jwt': '^1.0.0',
      ...(config.database === 'postgresql' && { '@prisma/client': '^6.2.1' }),
      ...(config.database === 'mongodb' && { mongoose: '^8.1.0' }),
    },
    devDependencies: {
      bun: 'latest',
      ...(config.database !== 'mongodb' && { prisma: '^6.2.1' }),
    },
  };

  await fs.writeJSON(path.join(backendDir, 'package.json'), packageJson, { spaces: 2 });

  await fs.writeJSON(path.join(backendDir, '.eslintrc.json'), {
    root: true,
    extends: ["eslint:recommended"],
    env: { node: true, es2021: true }
  }, { spaces: 2 });

  const srcDir = path.join(backendDir, 'src');
  await fs.ensureDir(srcDir);

  const indexTs = `import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || '${config.jwtSecret}'
    })
  )
  .get('/api/health', () => ({ 
    status: 'ok', 
    service: '${config.projectName}-backend' 
  }))
  .listen(process.env.PORT || 3001);

console.log(\`🚀 Bun + Elysia running at \${app.server?.hostname}:\${app.server?.port}\`);
`;

  await fs.writeFile(path.join(srcDir, 'index.ts'), indexTs);
}

async function generateGoFiber(_config: StackConfig, _backendDir: string) {
  throw new Error('Go + Fiber support coming in Phase 2');
}
// NestJS helper functions

function getNestJSAuthService(config: StackConfig): string {
  if (config.database === 'mongodb') {
    return `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });
    await user.save();
    
    const token = this.generateToken(user);
    return { token, user: { id: user._id, email: user.email, name: user.name } };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { token, user: { id: user._id, email: user.email, name: user.name } };
  }

  private generateToken(user: any) {
    const payload = { 
      sub: user._id, 
      email: user.email${config.multiTenant ? ',\n      tenantId: user.tenantId' : ''} 
    };
    return this.jwtService.sign(payload);
  }
}
`;
  }

  return `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });
    
    const token = this.generateToken(user);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  private generateToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email${config.multiTenant ? ',\n      tenantId: user.tenantId' : ''} 
    };
    return this.jwtService.sign(payload);
  }
}
`;
}

function getNestJSUsersService(config: StackConfig): string {
  if (config.database === 'mongodb') {
    return `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
`;
  }

  return `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
`;
}
