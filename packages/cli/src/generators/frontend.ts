import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types';

export async function generateFrontend(config: StackConfig, frontendDir: string) {
  // For Phase 1 MVP, we'll create a basic React + Vite template
  // In later phases, we'll add support for other frameworks

  switch (config.frontend) {
    case 'react-vite':
      await generateReactVite(config, frontendDir);
      break;
    case 'nextjs':
      await generateNextJS(config, frontendDir);
      break;
    case 'vue-vite':
      await generateVueVite(config, frontendDir);
      break;
    case 'sveltekit':
      await generateSvelteKit(config, frontendDir);
      break;
    default:
      throw new Error(`Unsupported frontend: ${config.frontend}`);
  }
}

async function generateReactVite(config: StackConfig, frontendDir: string) {
  // Package.json
  const packageJson = {
    name: `${config.projectName}-frontend`,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      lint: 'eslint . --ext ts,tsx',
    },
    dependencies: {
      react: '^19.2.0',
      'react-dom': '^19.2.0',
      'react-router-dom': '^7.1.0',
      axios: '^1.7.9',
      ...(config.auth === 'clerk' && { '@clerk/clerk-react': '^5.40.0' }),
      ...(config.auth === 'supabase' && { '@supabase/supabase-js': '^2.47.0' }),
      ...(config.auth === 'firebase' && { firebase: '^11.1.0' }),
    },
    devDependencies: {
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      '@vitejs/plugin-react': '^4.3.4',
      typescript: '^5.7.2',
      vite: '^7.3.0',
      'tailwindcss': '^4.0.0',
      'autoprefixer': '^11.0.0',
      'postcss': '^8.4.49',
      'eslint': '^9.16.0',
    },
  };

  await fs.writeJSON(path.join(frontendDir, 'package.json'), packageJson, { spaces: 2 });

  // Vite config
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
`;

  await fs.writeFile(path.join(frontendDir, 'vite.config.ts'), viteConfig);

  // TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundle',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      incremental: true,
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }],
  };

  await fs.writeJSON(path.join(frontendDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // tsconfig.node.json
  const tsConfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundle',
      allowSyntheticDefaultImports: true,
      strict: true,
    },
    include: ['vite.config.ts'],
  };

  await fs.writeJSON(path.join(frontendDir, 'tsconfig.node.json'), tsConfigNode, { spaces: 2 });

  // Tailwind config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

  await fs.writeFile(path.join(frontendDir, 'tailwind.config.js'), tailwindConfig);

  // PostCSS config
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  await fs.writeFile(path.join(frontendDir, 'postcss.config.js'), postcssConfig);

  // Create src directory structure
  const srcDir = path.join(frontendDir, 'src');
  await fs.ensureDir(srcDir);
  await fs.ensureDir(path.join(srcDir, 'components'));
  await fs.ensureDir(path.join(srcDir, 'pages'));
  await fs.ensureDir(path.join(srcDir, 'lib'));
  await fs.ensureDir(path.join(srcDir, 'hooks'));

  // index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(frontendDir, 'index.html'), indexHtml);

  // Main entry point
  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

  await fs.writeFile(path.join(srcDir, 'main.tsx'), mainTsx);

  // Main CSS
  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-height: 100vh;
}
`;

  await fs.writeFile(path.join(srcDir, 'index.css'), indexCss);

  // App component
  const appTsx = getAppComponent(config);
  await fs.writeFile(path.join(srcDir, 'App.tsx'), appTsx);

  // API client
  const apiClient = getApiClient(config);
  await fs.writeFile(path.join(srcDir, 'lib', 'api.ts'), apiClient);
}

function getAppComponent(config: StackConfig): string {
  return `import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './lib/auth'
${config.auth === 'clerk' ? "import { ClerkProvider } from '@clerk/clerk-react'" : ''}

function App() {
  ${config.auth === 'clerk' ? `const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;` : ''}

  return (
    ${config.auth === 'clerk' ? '<ClerkProvider publishableKey={clerkPubKey}>' : ''}
    ${config.auth === 'jwt' ? '<AuthProvider>' : ''}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
    ${config.auth === 'jwt' ? '</AuthProvider>' : ''}
    ${config.auth === 'clerk' ? '</ClerkProvider>' : ''}
  )
}

export default App
`;
}

function getApiClient(config: StackConfig): string {
  return `import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
`;
}

async function generateNextJS(config: StackConfig, frontendDir: string) {
  // Package.json
  const packageJson = {
    name: `${config.projectName}-frontend`,
    version: '0.1.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      react: '^19.2.0',
      'react-dom': '^19.2.0',
      next: '^16.0.0',
      axios: '^1.7.9',
      ...(config.auth === 'clerk' && { '@clerk/nextjs': '^6.9.0' }),
      ...(config.auth === 'supabase' && { '@supabase/supabase-js': '^2.47.0', '@supabase/ssr': '^0.5.2' }),
      ...(config.auth === 'firebase' && { firebase: '^11.1.0' }),
      ...(config.auth === 'authjs' && { 'next-auth': '^5.0.0-beta.25' }),
    },
    devDependencies: {
      '@types/node': '^20.17.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      typescript: '^5.7.2',
      tailwindcss: '^4.0.0',
      autoprefixer: '^11.0.0',
      postcss: '^8.4.49',
      eslint: '^9.16.0',
      'eslint-config-next': '^16.0.0',
    },
  };

  await fs.writeJSON(path.join(frontendDir, 'package.json'), packageJson, { spaces: 2 });

  // Next.js config
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`;

  await fs.writeFile(path.join(frontendDir, 'next.config.js'), nextConfig);

  // TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };

  await fs.writeJSON(path.join(frontendDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // Tailwind config
  const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
`;

  await fs.writeFile(path.join(frontendDir, 'tailwind.config.ts'), tailwindConfig);

  // PostCSS config
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  await fs.writeFile(path.join(frontendDir, 'postcss.config.js'), postcssConfig);

  // Create app directory structure
  const appDir = path.join(frontendDir, 'app');
  await fs.ensureDir(appDir);
  await fs.ensureDir(path.join(appDir, 'login'));
  await fs.ensureDir(path.join(appDir, 'dashboard'));
  await fs.ensureDir(path.join(frontendDir, 'components'));
  await fs.ensureDir(path.join(frontendDir, 'lib'));

  // Root layout
  const layout = getNextJSLayout(config);
  await fs.writeFile(path.join(appDir, 'layout.tsx'), layout);

  // Home page
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
  )
}
`;

  await fs.writeFile(path.join(appDir, 'page.tsx'), homePage);

  // Login page
  const loginPage = getNextJSLoginPage(config);
  await fs.writeFile(path.join(appDir, 'login', 'page.tsx'), loginPage);

  // Dashboard page
  const dashboardPage = getNextJSDashboardPage(config);
  await fs.writeFile(path.join(appDir, 'dashboard', 'page.tsx'), dashboardPage);

  // Global CSS
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 17, 24, 39;
  --background-end-rgb: 0, 0, 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
`;

  await fs.writeFile(path.join(appDir, 'globals.css'), globalsCss);

  // API client
  const apiClient = `import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
`;

  await fs.writeFile(path.join(frontendDir, 'lib', 'api.ts'), apiClient);

  // Middleware for auth (if using Clerk or custom JWT)
  if (config.auth === 'clerk') {
    const middleware = `import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/login'],
});

export const config = {
  matcher: ['/((?!.+\\\\.[\\\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
`;
    await fs.writeFile(path.join(frontendDir, 'middleware.ts'), middleware);
  } else if (config.auth === 'jwt') {
    const middleware = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
`;
    await fs.writeFile(path.join(frontendDir, 'middleware.ts'), middleware);
  }

  // .env.local.example
  const envExample = `NEXT_PUBLIC_API_URL=http://localhost:3000/api
${config.auth === 'clerk' ? 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx\nCLERK_SECRET_KEY=sk_test_xxxxx' : ''}
${config.auth === 'supabase' ? 'NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx' : ''}
`;

  await fs.writeFile(path.join(frontendDir, '.env.local.example'), envExample);

  // .gitignore
  const gitignore = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

  await fs.writeFile(path.join(frontendDir, '.gitignore'), gitignore);
}

async function generateVueVite(_config: StackConfig, _frontendDir: string) {
  // Placeholder for Vue generation
  throw new Error('Vue support coming in Phase 2');
}

async function generateSvelteKit(_config: StackConfig, _frontendDir: string) {
  // Placeholder for SvelteKit generation
  throw new Error('SvelteKit support coming in Phase 2');
}
// Helper functions for Next.js at the end of frontend.ts

function getNextJSLayout(config: StackConfig): string {
  return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${config.projectName}',
  description: 'Generated by ForgeStack OS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;
}

function getNextJSLoginPage(config: StackConfig): string {
  if (config.auth === 'clerk') {
    return `import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <SignIn />
    </div>
  )
}
`;
  }

  return `'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

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
  )
}
`;
}

function getNextJSDashboardPage(config: StackConfig): string {
  if (config.auth === 'clerk') {
    return `import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">${config.projectName}</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-4">Welcome, {user.firstName || user.emailAddresses[0].emailAddress}!</h2>
        <p className="text-gray-400">You're logged in to your dashboard.</p>
      </div>
    </div>
  )
}
`;
  }

  return `'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser(payload)
    } catch (err) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">${config.projectName}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-4">Welcome, {user?.email}!</h2>
        <p className="text-gray-400">You're logged in to your dashboard.</p>
      </div>
    </div>
  )
}
`;
}
