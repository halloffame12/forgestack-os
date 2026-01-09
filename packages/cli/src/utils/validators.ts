import { StackConfig, ValidationResult } from '../types';
import validateNpmPackageName from 'validate-npm-package-name';

export function validateStackConfig(config: StackConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate project name
    const nameValidation = validateNpmPackageName(config.projectName);
    if (!nameValidation.validForNewPackages) {
        errors.push(`Invalid project name: ${nameValidation.errors?.join(', ')}`);
    }

    // tRPC requires TypeScript backend
    if (config.apiStyle === 'trpc') {
        if (config.backend === 'go-fiber') {
            errors.push('tRPC is not compatible with Go backend. Please choose a TypeScript backend.');
        }
    }

    // GraphQL compatibility
    if (config.apiStyle === 'graphql') {
        if (config.backend === 'bun-elysia' || config.backend === 'go-fiber') {
            warnings.push('GraphQL support for this backend is experimental.');
        }
    }

    // Supabase auth requires Supabase DB
    if (config.auth === 'supabase' && config.database !== 'supabase-db') {
        warnings.push('Supabase Auth works best with Supabase DB. Consider using Supabase DB for full integration.');
    }

    // Go backend is experimental
    if (config.backend === 'go-fiber') {
        warnings.push('Go + Fiber backend is experimental and may have limited features.');
    }

    // Multi-tenancy warnings
    if (config.multiTenant) {
        if (config.database === 'sqlite') {
            warnings.push('SQLite with multi-tenancy is not recommended for production use.');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
