import inquirer from 'inquirer';
import { StackConfig } from '../types';

/**
 * Normalizes input strings for consistency (e.g., 'Next.js 14' -> 'nextjs')
 */
function normalizeInput(category: 'frontend' | 'backend' | 'auth' | 'database', value: string): string {
    const v = value.toLowerCase().trim();

    const mappings: Record<string, Record<string, string>> = {
        frontend: {
            'react-vite': 'react-vite',
            'react + vite': 'react-vite',
            'react': 'react-vite',
            'vite': 'react-vite',
            'nextjs': 'nextjs',
            'next.js': 'nextjs',
            'next.js-14': 'nextjs',
            'next': 'nextjs',
            'vue-vite': 'vue-vite',
            'vue': 'vue-vite',
            'sveltekit': 'sveltekit',
            'svelte': 'sveltekit'
        },
        backend: {
            'express': 'express',
            'node.js + express': 'express',
            'fastify': 'fastify',
            'node.js + fastify': 'fastify',
            'nestjs': 'nestjs',
            'nest': 'nestjs',
            'bun-elysia': 'bun-elysia',
            'bun': 'bun-elysia',
            'elysia': 'bun-elysia',
            'go-fiber': 'go-fiber',
            'go': 'go-fiber'
        },
        auth: {
            'jwt': 'jwt',
            'clerk': 'clerk',
            'supabase': 'supabase',
            'supabase-auth': 'supabase',
            'authjs': 'authjs',
            'auth.js': 'authjs',
            'nextauth': 'authjs',
            'firebase': 'firebase',
            'firebase-auth': 'firebase'
        },
        database: {
            'postgresql': 'postgresql',
            'postgres': 'postgresql',
            'mongodb': 'mongodb',
            'mongo': 'mongodb',
            'mysql': 'mysql',
            'sqlite': 'sqlite',
            'supabase-db': 'supabase-db'
        }
    };

    return mappings[category][v] || v;
}

export async function promptForStack(projectName: string, options: any = {}): Promise<StackConfig> {
    console.log('\n');

    // If flags are provided, normalize and return immediately for non-interactive mode
    if (options.frontend || options.backend || options.auth || options.database) {
        return {
            projectName,
            frontend: normalizeInput('frontend', options.frontend || 'react-vite'),
            backend: normalizeInput('backend', options.backend || 'express'),
            auth: normalizeInput('auth', options.auth || 'jwt'),
            database: normalizeInput('database', options.database || 'postgresql'),
            apiStyle: options.api // 'api' option maps to 'apiStyle' in config
                ? (options.api === 'trpc' ? 'trpc' : options.api === 'graphql' ? 'graphql' : 'rest')
                : 'rest',
            docker: options.docker !== false, // Default to true unless --no-docker
            multiTenant: !!options.multiTenant,
        } as StackConfig;
    }

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'frontend',
            message: 'Choose your frontend framework:',
            choices: [
                { name: 'React + Vite (Recommended)', value: 'react-vite' },
                { name: 'Next.js 14 (App Router)', value: 'nextjs' },
                { name: 'Vue + Vite', value: 'vue-vite' },
                { name: 'SvelteKit', value: 'sveltekit' },
            ],
            default: 'react-vite',
        },
        {
            type: 'list',
            name: 'backend',
            message: 'Choose your backend framework:',
            choices: [
                { name: 'Node.js + Express (Recommended)', value: 'express' },
                { name: 'Node.js + Fastify', value: 'fastify' },
                { name: 'NestJS', value: 'nestjs' },
                { name: 'Bun + Elysia', value: 'bun-elysia' },
                { name: 'Go + Fiber (Experimental)', value: 'go-fiber' },
            ],
            default: 'express',
        },
        {
            type: 'list',
            name: 'auth',
            message: 'Choose your authentication provider:',
            choices: [
                { name: 'Built-in JWT Auth (Free)', value: 'jwt' },
                { name: 'Clerk', value: 'clerk' },
                { name: 'Supabase Auth', value: 'supabase' },
                { name: 'Auth.js (NextAuth)', value: 'authjs' },
                { name: 'Firebase Auth', value: 'firebase' },
            ],
            default: 'jwt',
        },
        {
            type: 'list',
            name: 'database',
            message: 'Choose your database:',
            choices: [
                { name: 'PostgreSQL + Prisma (Recommended)', value: 'postgresql' },
                { name: 'MongoDB + Mongoose', value: 'mongodb' },
                { name: 'MySQL + Prisma', value: 'mysql' },
                { name: 'SQLite (Local)', value: 'sqlite' },
                { name: 'Supabase DB', value: 'supabase-db' },
            ],
            default: 'postgresql',
        },
        {
            type: 'list',
            name: 'apiStyle',
            message: 'Choose your API style:',
            choices: [
                { name: 'REST (Recommended)', value: 'rest' },
                { name: 'GraphQL', value: 'graphql' },
                { name: 'tRPC (Type-safe)', value: 'trpc' },
            ],
            default: 'rest',
        },
        {
            type: 'confirm',
            name: 'docker',
            message: 'Include Docker configuration?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'multiTenant',
            message: 'Enable multi-tenancy support?',
            default: false,
        },
    ]);

    return {
        projectName,
        ...answers,
    };
}
