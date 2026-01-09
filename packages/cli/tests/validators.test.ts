import { describe, it, expect } from 'vitest';
import { validateStackConfig } from '../src/utils/validators';

describe('Stack Validation', () => {
    it('should validate compatible stacks', () => {
        const config = {
            projectName: 'test-app',
            frontend: 'react-vite' as const,
            backend: 'express' as const,
            auth: 'jwt' as const,
            database: 'postgresql' as const,
            apiStyle: 'rest' as const,
            docker: true,
            multiTenant: false,
        };

        const result = validateStackConfig(config);
        expect(result.valid).toBe(true);
    });

    it('should reject Next.js with Express (incompatible)', () => {
        const config = {
            projectName: 'test-app',
            frontend: 'nextjs' as const,
            backend: 'express' as const,
            auth: 'jwt' as const,
            database: 'postgresql' as const,
            apiStyle: 'rest' as const,
            docker: true,
            multiTenant: false,
        };

        const result = validateStackConfig(config);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Next.js works best with NestJS backend');
    });

    it('should validate GraphQL API style', () => {
        const config = {
            projectName: 'test-app',
            frontend: 'react-vite' as const,
            backend: 'express' as const,
            auth: 'jwt' as const,
            database: 'postgresql' as const,
            apiStyle: 'graphql' as const,
            docker: true,
            multiTenant: false,
        };

        const result = validateStackConfig(config);
        expect(result.valid).toBe(true);
    });

    it('should validate tRPC API style', () => {
        const config = {
            projectName: 'test-app',
            frontend: 'nextjs' as const,
            backend: 'nestjs' as const,
            auth: 'clerk' as const,
            database: 'postgresql' as const,
            apiStyle: 'trpc' as const,
            docker: true,
            multiTenant: true,
        };

        const result = validateStackConfig(config);
        expect(result.valid).toBe(true);
    });
});
