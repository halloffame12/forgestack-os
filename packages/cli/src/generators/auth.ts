import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types';

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
}

async function generateJWTAuth(
  config: StackConfig,
  frontendDir: string,
  backendDir: string
) {
  // Backend: Auth routes
  const authRoutes = `import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
${config.database === 'mongodb' ? "import User from '../models/User';" : "import prisma from '../lib/prisma';"}

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  ${config.multiTenant ? 'tenantId: z.string(),' : ''}
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    ${config.database === 'mongodb' ? `
    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      ${config.multiTenant ? 'tenantId: data.tenantId,' : ''}
    });
    ` : `
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        ${config.multiTenant ? 'tenantId: data.tenantId,' : ''}
      },
    });
    `}
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        ${config.multiTenant ? 'tenantId: user.tenantId,' : ''}
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    
    ${config.database === 'mongodb' ? `
    const user = await User.findOne({ email: data.email });
    ` : `
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    `}
    
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(data.password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        ${config.multiTenant ? 'tenantId: user.tenantId,' : ''}
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
});

export default router;
`;

  const routesDir = path.join(backendDir, 'src', 'routes');
  await fs.writeFile(path.join(routesDir, 'auth.ts'), authRoutes);

  // Frontend: Auth context
  const authContext = `import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
`;

  const frontendLibDir = path.join(frontendDir, config.frontend === 'nextjs' ? 'lib' : 'src/lib');

  // For Next.js, generateNextJS already handles auth pages and middleware.
  // We only need the backend routes and potentially the lib/auth.tsx if we 
  // want a context, but Next.js template currently uses direct api calls.
  // To restore reliability, we skip frontend JWT auth files for Next.js for now.
  if (config.frontend === 'nextjs') {
    return;
  }

  await fs.ensureDir(frontendLibDir);
  await fs.writeFile(path.join(frontendLibDir, 'auth.tsx'), authContext);

  // Frontend: Login page
  const loginPage = `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
        {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
`;

  const pagesDir = path.join(frontendDir, 'src', 'pages');
  await fs.writeFile(path.join(pagesDir, 'LoginPage.tsx'), loginPage);

  // Frontend: Home page
  const homePage = `export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-4">${config.projectName}</h1>
        <p className="text-xl text-gray-400 mb-8">
          Generated by ForgeStack OS
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
`;

  await fs.writeFile(path.join(pagesDir, 'HomePage.tsx'), homePage);

  // Frontend: Dashboard page
  const dashboardPage = `import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">${config.projectName}</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-4">Welcome, {user?.name || user?.email}!</h2>
        <p className="text-gray-400">You're logged in to your dashboard.</p>
      </div>
    </div>
  );
}
`;

  await fs.writeFile(path.join(pagesDir, 'DashboardPage.tsx'), dashboardPage);
}

async function generateClerkAuth(
  config: StackConfig,
  frontendDir: string,
  _backendDir: string
) {
  const isNextJS = config.frontend === 'nextjs';
  const clerkSetup = `# Clerk Authentication Setup

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy your API keys to .env
4. For ${isNextJS ? 'Next.js' : 'React'}, the components are already configured.

Components used:
- LoginPage: Uses Clerk's SignIn component
- Dashboard: Uses Clerk's UserButton
- Layout: ${isNextJS ? 'Configured with ClerkProvider' : 'Needs ClerkProvider in main.tsx'}
`;

  await fs.writeFile(path.join(frontendDir, 'CLERK_SETUP.md'), clerkSetup);

  if (isNextJS) {
    // Next.js specific logic (mostly handled in generateNextJS)
    const middleware = `import { authMiddleware } from '@clerk/nextjs';
 
export default authMiddleware({
  publicRoutes: ['/'],
});
 
export const config = {
  matcher: ['/((?!.+\\\\.[\\\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
`;
    await fs.writeFile(path.join(frontendDir, 'middleware.ts'), middleware);
  } else {
    // React+Vite specific logic
    const hook = `import { useAuth, useUser, SignInButton, SignOutButton } from "@clerk/clerk-react";

export function AuthStatus() {
  const { isSignedIn, user } = useUser();
  if (isSignedIn) return <div>Hello {user.fullName} <SignOutButton /></div>;
  return <SignInButton />;
}
`;
    await fs.ensureDir(path.join(frontendDir, 'src', 'components'));
    await fs.writeFile(path.join(frontendDir, 'src', 'components', 'AuthStatus.tsx'), hook);
  }
}

async function generateSupabaseAuth(
  config: StackConfig,
  frontendDir: string,
  _backendDir: string
) {
  const isNextJS = config.frontend === 'nextjs';
  const supabaseSetup = `# Supabase Authentication Setup

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key to .env
3. Configure auth providers in Supabase dashboard
4. For ${isNextJS ? 'Next.js' : 'React'}, the clients are already configured in src/lib/supabase.ts.
`;

  await fs.writeFile(path.join(frontendDir, 'SUPABASE_SETUP.md'), supabaseSetup);

  const supabaseClient = isNextJS
    ? `import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}`
    : `import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)`;

  const libDir = path.join(frontendDir, isNextJS ? 'lib' : 'src/lib');
  await fs.ensureDir(libDir);
  await fs.writeFile(path.join(libDir, 'supabase.ts'), supabaseClient);
}

async function generateAuthJS(
  config: StackConfig,
  frontendDir: string,
  _backendDir: string
) {
  const isNextJS = config.frontend === 'nextjs';
  const authJSSetup = `# Auth.js (NextAuth) Setup

1. Configure providers in ${isNextJS ? 'app/api/auth/[...nextauth]/route.ts' : 'src/lib/auth.ts'}
2. Add provider credentials to .env
3. See https://authjs.dev for setup guides.
`;

  await fs.writeFile(path.join(frontendDir, 'AUTHJS_SETUP.md'), authJSSetup);

  if (isNextJS) {
    const authRouteDir = path.join(frontendDir, 'app/api/auth/[...nextauth]');
    await fs.ensureDir(authRouteDir);
    const authRoute = `import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
`;
    await fs.writeFile(path.join(authRouteDir, 'route.ts'), authRoute);
  }
}

async function generateFirebaseAuth(
  config: StackConfig,
  frontendDir: string,
  _backendDir: string
) {
  const isNextJS = config.frontend === 'nextjs';
  const firebaseSetup = `# Firebase Auth Setup

1. Create a Firebase project at https://firebase.google.com
2. Enable authentication methods
3. Copy your project config to .env
`;

  await fs.writeFile(path.join(frontendDir, 'FIREBASE_SETUP.md'), firebaseSetup);

  const firebaseConfig = `import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.${isNextJS ? 'NEXT_PUBLIC_' : 'VITE_'}FIREBASE_API_KEY,
  authDomain: process.env.${isNextJS ? 'NEXT_PUBLIC_' : 'VITE_'}FIREBASE_AUTH_DOMAIN,
  projectId: process.env.${isNextJS ? 'NEXT_PUBLIC_' : 'VITE_'}FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
`;

  const libDir = path.join(frontendDir, isNextJS ? 'lib' : 'src/lib');
  await fs.ensureDir(libDir);
  await fs.writeFile(path.join(libDir, 'firebase.ts'), firebaseConfig);
}
