/**
 * Prisma ORM status checks
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { CheckResult } from './types.js';

/**
 * Check if Prisma is used in the project
 */
async function isPrismaProject(cwd: string): Promise<boolean> {
    const prismaSchemaPath = path.join(cwd, 'prisma', 'schema.prisma');
    const pkgPath = path.join(cwd, 'package.json');
    
    if (await fs.pathExists(prismaSchemaPath)) {
        return true;
    }
    
    if (await fs.pathExists(pkgPath)) {
        try {
            const pkg = await fs.readJson(pkgPath);
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            return 'prisma' in deps || '@prisma/client' in deps;
        } catch {
            // Ignore JSON parse errors
        }
    }
    
    return false;
}

/**
 * Check if Prisma client has been generated
 */
async function checkPrismaGenerated(cwd: string): Promise<CheckResult> {
    // Check if node_modules/.prisma/client exists
    const prismaClientPath = path.join(cwd, 'node_modules', '.prisma', 'client');
    const indexPath = path.join(prismaClientPath, 'index.js');
    
    if (!await fs.pathExists(prismaClientPath) || !await fs.pathExists(indexPath)) {
        return {
            name: 'Prisma Client',
            status: 'fail',
            message: 'Prisma client has not been generated',
            fix: 'Run: npx prisma generate',
        };
    }
    
    // Check if schema has been modified after last generation
    const schemaPath = path.join(cwd, 'prisma', 'schema.prisma');
    if (await fs.pathExists(schemaPath)) {
        try {
            const schemaStat = await fs.stat(schemaPath);
            const clientStat = await fs.stat(indexPath);
            
            if (schemaStat.mtime > clientStat.mtime) {
                return {
                    name: 'Prisma Client',
                    status: 'warn',
                    message: 'Prisma schema modified after last generation',
                    fix: 'Run: npx prisma generate',
                };
            }
        } catch {
            // Ignore stat errors
        }
    }
    
    return {
        name: 'Prisma Client',
        status: 'pass',
        message: 'Prisma client is generated',
    };
}

/**
 * Check for pending Prisma migrations
 */
async function checkPrismaMigrations(cwd: string): Promise<CheckResult> {
    const migrationsDir = path.join(cwd, 'prisma', 'migrations');
    
    // Check if migrations directory exists
    if (!await fs.pathExists(migrationsDir)) {
        return {
            name: 'Prisma Migrations',
            status: 'warn',
            message: 'No migrations directory found',
            details: 'Migrations may not be set up yet',
            fix: 'Run: npx prisma migrate dev --name init',
        };
    }
    
    try {
        // Run prisma migrate status to check for pending migrations
        const output = execSync('npx prisma migrate status', {
            cwd,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 30000,
        });
        
        if (output.includes('Database schema is up to date')) {
            return {
                name: 'Prisma Migrations',
                status: 'pass',
                message: 'All migrations are applied',
            };
        }
        
        if (output.includes('pending migration') || output.includes('have not yet been applied')) {
            return {
                name: 'Prisma Migrations',
                status: 'warn',
                message: 'Pending migrations detected',
                fix: 'Run: npx prisma migrate dev',
            };
        }
        
        return {
            name: 'Prisma Migrations',
            status: 'pass',
            message: 'Migration status checked',
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('P1001') || errorMessage.includes('connection') || 
            errorMessage.includes('ECONNREFUSED')) {
            return {
                name: 'Prisma Migrations',
                status: 'warn',
                message: 'Cannot check migrations (database not accessible)',
                details: 'Fix database connection first',
            };
        }
        
        if (errorMessage.includes('pending') || errorMessage.includes('not yet been applied')) {
            return {
                name: 'Prisma Migrations',
                status: 'warn',
                message: 'Pending migrations detected',
                fix: 'Run: npx prisma migrate dev',
            };
        }
        
        if (errorMessage.includes('drift') || errorMessage.includes('out of sync')) {
            return {
                name: 'Prisma Migrations',
                status: 'fail',
                message: 'Database schema has drifted from migrations',
                fix: 'Run: npx prisma migrate dev to reconcile',
            };
        }
        
        return {
            name: 'Prisma Migrations',
            status: 'warn',
            message: 'Could not determine migration status',
            details: errorMessage.substring(0, 200),
        };
    }
}

/**
 * Check Prisma schema validity
 */
async function checkPrismaSchema(cwd: string): Promise<CheckResult> {
    const schemaPath = path.join(cwd, 'prisma', 'schema.prisma');
    
    if (!await fs.pathExists(schemaPath)) {
        return {
            name: 'Prisma Schema',
            status: 'skip',
            message: 'No Prisma schema found',
        };
    }
    
    try {
        execSync('npx prisma validate', {
            cwd,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 15000,
        });
        
        return {
            name: 'Prisma Schema',
            status: 'pass',
            message: 'Prisma schema is valid',
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        return {
            name: 'Prisma Schema',
            status: 'fail',
            message: 'Prisma schema validation failed',
            details: errorMessage.substring(0, 200),
            fix: 'Fix the schema errors and run: npx prisma validate',
        };
    }
}

/**
 * Run all Prisma checks
 */
export async function runPrismaChecks(cwd: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check if this is a Prisma project
    if (!await isPrismaProject(cwd)) {
        results.push({
            name: 'Prisma',
            status: 'skip',
            message: 'Not a Prisma project',
        });
        return results;
    }
    
    results.push(await checkPrismaSchema(cwd));
    results.push(await checkPrismaGenerated(cwd));
    results.push(await checkPrismaMigrations(cwd));
    
    return results;
}
