export interface StackConfig {
    projectName: string;
    frontend: 'react-vite' | 'nextjs' | 'vue-vite' | 'sveltekit';
    backend: 'express' | 'fastify' | 'nestjs' | 'bun-elysia' | 'go-fiber';
    auth: 'jwt' | 'clerk' | 'supabase' | 'authjs' | 'firebase';
    database: 'postgresql' | 'mongodb' | 'mysql' | 'sqlite' | 'supabase-db';
    apiStyle: 'rest' | 'graphql' | 'trpc';
    docker: boolean;
    multiTenant: boolean;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
