import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types';

export async function generateDatabase(config: StackConfig, backendDir: string) {
  switch (config.database) {
    case 'postgresql':
    case 'mysql':
    case 'sqlite':
      await generatePrisma(config, backendDir);
      break;
    case 'mongodb':
      await generateMongoose(config, backendDir);
      break;
    case 'supabase-db':
      await generateSupabase(config, backendDir);
      break;
    default:
      throw new Error(`Unsupported database: ${config.database}`);
  }
}

async function generatePrisma(config: StackConfig, backendDir: string) {
  const prismaDir = path.join(backendDir, 'prisma');
  await fs.ensureDir(prismaDir);

  // Prisma schema
  const schema = getPrismaSchema(config);
  await fs.writeFile(path.join(prismaDir, 'schema.prisma'), schema);

  // Prisma client initialization
  const prismaClient = `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
`;

  const libDir = path.join(backendDir, 'src', 'lib');
  await fs.ensureDir(libDir);
  await fs.writeFile(path.join(libDir, 'prisma.ts'), prismaClient);
}

function getPrismaSchema(config: StackConfig): string {
  const datasourceProvider = config.database === 'postgresql' ? 'postgresql'
    : config.database === 'mysql' ? 'mysql'
      : 'sqlite';

  const tenantModel = config.multiTenant ? `
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]
}
` : '';

  const userModel = `
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  ${config.multiTenant ? 'tenantId  String\n  tenant    Tenant   @relation(fields: [tenantId], references: [id])' : ''}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  ${config.multiTenant ? '@@index([tenantId])' : ''}
}
`;

  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${datasourceProvider}"
  url      = env("DATABASE_URL")
}
${tenantModel}${userModel}`;
}

async function generateMongoose(config: StackConfig, backendDir: string) {
  // Mongoose connection
  const mongooseConnection = `import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/${config.projectName}';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export default mongoose;
`;

  const libDir = path.join(backendDir, 'src', 'lib');
  await fs.ensureDir(libDir);
  await fs.writeFile(path.join(libDir, 'mongoose.ts'), mongooseConnection);

  // User model
  const modelsDir = path.join(backendDir, 'src', 'models');
  await fs.ensureDir(modelsDir);

  const userModel = `import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  ${config.multiTenant ? 'tenantId: string;' : ''}
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String },
    ${config.multiTenant ? 'tenantId: { type: String, required: true, index: true },' : ''}
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
`;

  await fs.writeFile(path.join(modelsDir, 'User.ts'), userModel);
}

async function generateSupabase(config: StackConfig, backendDir: string) {
  const supabaseClient = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
`;

  const libDir = path.join(backendDir, 'src', 'lib');
  await fs.ensureDir(libDir);
  await fs.writeFile(path.join(libDir, 'supabase.ts'), supabaseClient);
}
