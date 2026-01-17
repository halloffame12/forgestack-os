import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types.js';

export async function generateAuth(
  config: StackConfig,
  frontendDir: string,
  backendDir: string
) {
  switch (config.auth) {
    case 'jwt':
      await generateJWTAuth(config, frontendDir, backendDir);
      break;
    case 'clerk':
      await generateClerkAuth(config, frontendDir, backendDir);
      break;
    case 'supabase':
      await generateSupabaseAuth(config, frontendDir, backendDir);
      break;
    case 'authjs':
      await generateAuthJS(config, frontendDir, backendDir);
      break;
    case 'firebase':
      await generateFirebaseAuth(config, frontendDir, backendDir);
      break;
    default:
      throw new Error(`Unsupported auth: ${config.auth}`);
  }

  // Ensure frontend pages exist for all auth types
  await generateFrontendAuthPages(config, frontendDir);
}

async function generateJWTAuth(
  config: StackConfig,
  _frontendDir: string,
  backendDir: string
) {
  // Backend: Auth logic
  if (config.backend === 'express') {
    const routesDir = path.join(backendDir, 'src', 'routes');
    await fs.ensureDir(routesDir);
    await fs.writeFile(path.join(routesDir, 'auth.ts'), getExpressAuthRoutes(config));
  } else if (config.backend === 'fastify') {
    const routesDir = path.join(backendDir, 'src', 'routes');
    await fs.ensureDir(routesDir);
    await fs.writeFile(path.join(routesDir, 'auth.ts'), getFastifyAuthRoutes(config));
  } else if (config.backend === 'nestjs') {
    await generateNestJSAuth(config, backendDir);
  }

  // Isolation: Add .eslintrc.json to prevent parent config inheritance
  const eslintConfig = {
    root: true,
    extends: ["eslint:recommended"],
    env: { node: true, es2021: true }
  };
  await fs.writeJSON(path.join(backendDir, '.eslintrc.json'), eslintConfig, { spaces: 2 });
}

async function generateFrontendAuthPages(config: StackConfig, frontendDir: string) {
  const isNext = config.frontend === 'nextjs';
  const frontendLibDir = path.join(frontendDir, isNext ? 'app/lib' : 'src/lib');
  await fs.ensureDir(frontendLibDir);

  // Always generate auth context file for JWT-based auth
  await fs.writeFile(path.join(frontendLibDir, 'auth.tsx'), getAuthContextCode());

  if (isNext) {
    const nextEslint = {
      root: true,
      extends: ["next/core-web-vitals"]
    };
    await fs.writeJSON(path.join(frontendDir, '.eslintrc.json'), nextEslint, { spaces: 2 });

    const authAppDir = path.join(frontendDir, 'app');
    await fs.ensureDir(path.join(authAppDir, 'login'));
    await fs.ensureDir(path.join(authAppDir, 'dashboard'));

    await fs.writeFile(path.join(authAppDir, 'login', 'page.tsx'), getLoginPageCode(config));
    await fs.writeFile(path.join(authAppDir, 'dashboard', 'page.tsx'), getDashboardPageCode(config));
    await fs.writeFile(path.join(authAppDir, 'page.tsx'), getHomePageCode(config));
  } else {
    const pagesDir = path.join(frontendDir, 'src', 'pages');
    await fs.ensureDir(pagesDir);
    await fs.writeFile(path.join(pagesDir, 'LoginPage.tsx'), getLoginPageCode(config));
    await fs.writeFile(path.join(pagesDir, 'HomePage.tsx'), getHomePageCode(config));
    await fs.writeFile(path.join(pagesDir, 'DashboardPage.tsx'), getDashboardPageCode(config));
  }
}

function getExpressAuthRoutes(config: StackConfig): string {
  return `import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
${config.database === 'mongodb' ? "import User from '../models/User';" : "import prisma from '../lib/prisma';"}

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = ${config.database === 'mongodb' ? `await User.create({ email: data.email, password: hashedPassword, name: data.name })` : `await prisma.user.create({ data: { email: data.email, password: hashedPassword, name: data.name } })`};
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '${config.jwtSecret}', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = ${config.database === 'mongodb' ? `await User.findOne({ email })` : `await prisma.user.findUnique({ where: { email } })`};
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '${config.jwtSecret}', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) { next(error); }
});

export default router;
`;
}

function getFastifyAuthRoutes(_config: StackConfig): string {
  return `import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    reply.send({ success: true });
  });
  fastify.post('/login', async (request, reply) => {
    reply.send({ token: '...' });
  });
}
`;
}

async function generateNestJSAuth(_config: StackConfig, backendDir: string) {
  const authDir = path.join(backendDir, 'src', 'auth');
  await fs.ensureDir(authDir);
  await fs.ensureDir(path.join(authDir, 'dto'));

  const controller = `import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: RegisterDto) { return this.authService.register(dto); }
  @Post('login')
  async login(@Body() dto: LoginDto) { return this.authService.login(dto); }
}
`;
  await fs.writeFile(path.join(authDir, 'auth.controller.ts'), controller);

  const dto = `import { IsEmail, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(8)
  password!: string;
  @IsString()
  name?: string;
}
export class LoginDto {
  @IsEmail()
  email!: string;
  @IsString()
  password!: string;
}
`;
  await fs.writeFile(path.join(authDir, 'dto/auth.dto.ts'), dto);

  const service = `import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async register(dto: any) { return { success: true }; }
  async login(user: any) { return { token: this.jwtService.sign({ id: '1' }) }; }
}
`;
  await fs.writeFile(path.join(authDir, 'auth.service.ts'), service);
}

function getAuthContextCode(): string {
  return `'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me').then(res => setUser(res.data.user)).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
`;
}

function getLoginPageCode(config: StackConfig): string {
  const isNext = config.frontend === 'nextjs';
  const authPath = isNext ? '../lib/auth' : '../lib/auth';

  return `${isNext ? "'use client';" : ""}
import { useState } from 'react';
${isNext ? "import { useRouter } from 'next/navigation';" : "import { useNavigate } from 'react-router-dom';"}
import { useAuth } from '${authPath}';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  ${isNext ? "const router = useRouter();" : "const navigate = useNavigate();"}

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await login(email, password);
    ${isNext ? "router.push('/dashboard');" : "navigate('/dashboard');"}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-lg">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full mb-4 p-2 bg-gray-700 text-white" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full mb-4 p-2 bg-gray-700 text-white" />
        <button type="submit" className="w-full bg-blue-600 p-2 text-white">Login</button>
      </form>
    </div>
  );
}
`;
}

function getHomePageCode(config: StackConfig): string {
  return `export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-4xl">${config.projectName}</h1>
    </div>
  );
}
`;
}

function getDashboardPageCode(config: StackConfig): string {
  const isNext = config.frontend === 'nextjs';
  const authPath = isNext ? '../lib/auth' : '../lib/auth';

  return `${isNext ? "'use client';" : ""}
import { useAuth } from '${authPath}';
export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1>Dashboard for ${config.projectName}</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout} className="bg-red-600 p-2 rounded">Logout</button>
    </div>
  );
}
`;
}

async function generateClerkAuth(config: StackConfig, frontendDir: string, _backendDir: string) {
  await fs.writeFile(path.join(frontendDir, 'CLERK_SETUP.md'), '# Clerk Setup');
}

async function generateSupabaseAuth(config: StackConfig, frontendDir: string, _backendDir: string) {
  await fs.writeFile(path.join(frontendDir, 'SUPABASE_SETUP.md'), '# Supabase Setup');
}

async function generateAuthJS(config: StackConfig, frontendDir: string, _backendDir: string) {
  await fs.writeFile(path.join(frontendDir, 'AUTHJS_SETUP.md'), '# Auth.js Setup');
}

async function generateFirebaseAuth(config: StackConfig, frontendDir: string, _backendDir: string) {
  await fs.writeFile(path.join(frontendDir, 'FIREBASE_SETUP.md'), '# Firebase Setup');
}
