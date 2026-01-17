import fs from 'fs-extra';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';
import { StackConfig } from '../types.js';

const PRESETS: Record<string, Omit<StackConfig, 'projectName'>> = {
    'next-nest-clerk-pg': {
        frontend: 'nextjs',
        backend: 'nestjs',
        auth: 'clerk',
        database: 'postgresql',
        apiStyle: 'rest',
        docker: true,
        multiTenant: true,
    },
    'react-express-jwt-mongo': {
        frontend: 'react-vite',
        backend: 'express',
        auth: 'jwt',
        database: 'mongodb',
        apiStyle: 'graphql',
        docker: true,
        multiTenant: false,
    },
    'next-fastify-supabase-trpc': {
        frontend: 'nextjs',
        backend: 'fastify',
        auth: 'supabase',
        database: 'supabase-db',
        apiStyle: 'trpc',
        docker: true,
        multiTenant: true,
    },
};

const LAST_CONFIG_PATH = path.join(os.homedir(), '.forgestack', 'config.json');

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

async function loadLastConfig(): Promise<Partial<StackConfig>> {
    try {
        const raw = await fs.readJSON(LAST_CONFIG_PATH);
        return raw.lastStack || {};
    } catch {
        return {};
    }
}

async function saveLastConfig(config: StackConfig) {
    try {
        await fs.ensureDir(path.dirname(LAST_CONFIG_PATH));
        await fs.writeJSON(LAST_CONFIG_PATH, { lastStack: config }, { spaces: 2 });
    } catch {
        // non-blocking persistence
    }
}

function parseApiStyle(api?: string): 'rest' | 'graphql' | 'trpc' {
    if (api === 'trpc') return 'trpc';
    if (api === 'graphql') return 'graphql';
    return 'rest';
}

type CLIOptions = {
    frontend?: string;
    backend?: string;
    auth?: string;
    database?: string;
    api?: string;
    preset?: string;
    stack?: string;
    docker?: boolean;
    multiTenant?: boolean;
    skipInstall?: boolean;
    skipGit?: boolean;
};

function buildConfigFromOptions(projectName: string, options: CLIOptions, last: Partial<StackConfig>): StackConfig {
    let base: Partial<StackConfig> = {};

    if (options.preset) {
        const preset = PRESETS[options.preset];
        if (!preset) {
            throw new Error(`Unknown preset "${options.preset}". Available: ${Object.keys(PRESETS).join(', ')}`);
        }
        base = { ...preset };
    }

    if (options.stack) {
        try {
            const parsed = JSON.parse(options.stack);
            base = { ...base, ...parsed };
        } catch {
            throw new Error('Failed to parse --stack JSON. Ensure it is valid JSON.');
        }
    }

    const merged: StackConfig = {
        projectName,
        frontend: normalizeInput('frontend', options.frontend || base.frontend || last.frontend || 'react-vite') as StackConfig['frontend'],
        backend: normalizeInput('backend', options.backend || base.backend || last.backend || 'express') as StackConfig['backend'],
        auth: normalizeInput('auth', options.auth || base.auth || last.auth || 'jwt') as StackConfig['auth'],
        database: normalizeInput('database', options.database || base.database || last.database || 'postgresql') as StackConfig['database'],
        apiStyle: parseApiStyle(options.api || base.apiStyle || last.apiStyle),
        docker: options.docker !== undefined ? Boolean(options.docker) : (base.docker ?? last.docker ?? true),
        multiTenant: options.multiTenant !== undefined ? Boolean(options.multiTenant) : (base.multiTenant ?? last.multiTenant ?? false),
        skipInstall: Boolean(options.skipInstall),
        skipGit: Boolean(options.skipGit),
    };

    return merged;
}

export async function promptForStack(projectName: string, options: CLIOptions = {}): Promise<StackConfig> {
    console.log('\n');
    const lastConfig = await loadLastConfig();

    // Non-interactive: use flags, preset, or stack JSON
    if (options.frontend || options.backend || options.auth || options.database || options.preset || options.stack) {
        const config = buildConfigFromOptions(projectName, options, lastConfig);
        await saveLastConfig(config);
        return config;
    }

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'frontend',
            message: 'Choose your frontend framework:',
            choices: [
                { name: 'React + Vite (Recommended)', value: 'react-vite' },
                { name: 'Next.js 14 (App Router)', value: 'nextjs' },
                { name: 'Vue + Vite', value: 'vue-vite', disabled: 'Coming in Phase 5' },
                { name: 'SvelteKit', value: 'sveltekit', disabled: 'Coming in Phase 5' },
            ],
            default: lastConfig.frontend || 'react-vite',
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
                { name: 'Go + Fiber (Experimental)', value: 'go-fiber', disabled: 'Coming in Phase 6' },
            ],
            default: lastConfig.backend || 'express',
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
            default: lastConfig.auth || 'jwt',
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
            default: lastConfig.database || 'postgresql',
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
            default: lastConfig.apiStyle || 'rest',
        },
        {
            type: 'confirm',
            name: 'docker',
            message: 'Include Docker configuration?',
            default: lastConfig.docker ?? true,
        },
        {
            type: 'confirm',
            name: 'multiTenant',
            message: 'Enable multi-tenancy support?',
            default: lastConfig.multiTenant ?? false,
        },
    ]);

    const config: StackConfig = {
        projectName,
        ...answers,
    };

    await saveLastConfig(config);
    return config;
}
