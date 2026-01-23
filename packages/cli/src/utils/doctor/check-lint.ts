/**
 * ESLint and TypeScript compilation checks
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { CheckResult } from './types.js';

/**
 * Check if ESLint is configured in the project
 */
async function hasEslintConfig(cwd: string): Promise<boolean> {
    const eslintFiles = [
        '.eslintrc',
        '.eslintrc.js',
        '.eslintrc.cjs',
        '.eslintrc.json',
        '.eslintrc.yml',
        '.eslintrc.yaml',
        'eslint.config.js',
        'eslint.config.mjs',
        'eslint.config.cjs',
    ];
    
    for (const file of eslintFiles) {
        if (await fs.pathExists(path.join(cwd, file))) {
            return true;
        }
    }
    
    // Check package.json for eslintConfig
    const pkgPath = path.join(cwd, 'package.json');
    if (await fs.pathExists(pkgPath)) {
        try {
            const pkg = await fs.readJson(pkgPath);
            if (pkg.eslintConfig) return true;
        } catch {
            // Ignore JSON parse errors
        }
    }
    
    return false;
}

/**
 * Check if TypeScript is configured in the project
 */
async function hasTypescriptConfig(cwd: string): Promise<boolean> {
    return await fs.pathExists(path.join(cwd, 'tsconfig.json'));
}

/**
 * Run ESLint and return results
 */
async function runEslint(cwd: string): Promise<CheckResult> {
    if (!await hasEslintConfig(cwd)) {
        return {
            name: 'ESLint',
            status: 'skip',
            message: 'No ESLint configuration found',
        };
    }
    
    try {
        // Check if ESLint is installed
        const eslintPath = path.join(cwd, 'node_modules', '.bin', 'eslint');
        if (!await fs.pathExists(eslintPath) && !await fs.pathExists(eslintPath + '.cmd')) {
            return {
                name: 'ESLint',
                status: 'warn',
                message: 'ESLint is not installed',
                fix: 'Run: npm install eslint --save-dev',
            };
        }
        
        // Run ESLint with JSON output
        const output = execSync('npx eslint . --format json --max-warnings 0', {
            cwd,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 60000,
        });
        
        try {
            const results = JSON.parse(output);
            let errorCount = 0;
            let warningCount = 0;
            
            for (const file of results) {
                errorCount += file.errorCount || 0;
                warningCount += file.warningCount || 0;
            }
            
            if (errorCount > 0) {
                return {
                    name: 'ESLint',
                    status: 'fail',
                    message: `${errorCount} error(s), ${warningCount} warning(s)`,
                    fix: 'Run: npx eslint . --fix',
                };
            }
            
            if (warningCount > 0) {
                return {
                    name: 'ESLint',
                    status: 'warn',
                    message: `${warningCount} warning(s)`,
                    fix: 'Run: npx eslint . --fix',
                };
            }
            
            return {
                name: 'ESLint',
                status: 'pass',
                message: 'No linting issues found',
            };
        } catch {
            // JSON parse failed, but command succeeded
            return {
                name: 'ESLint',
                status: 'pass',
                message: 'No linting issues found',
            };
        }
    } catch (error) {
        const errorOutput = error instanceof Error ? error.message : String(error);
        
        // Try to parse error output as JSON
        try {
            const jsonMatch = errorOutput.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const results = JSON.parse(jsonMatch[0]);
                let errorCount = 0;
                let warningCount = 0;
                
                for (const file of results) {
                    errorCount += file.errorCount || 0;
                    warningCount += file.warningCount || 0;
                }
                
                if (errorCount > 0 || warningCount > 0) {
                    return {
                        name: 'ESLint',
                        status: errorCount > 0 ? 'fail' : 'warn',
                        message: `${errorCount} error(s), ${warningCount} warning(s)`,
                        fix: 'Run: npx eslint . --fix',
                    };
                }
            }
        } catch {
            // JSON parse failed
        }
        
        // Check for common error patterns
        if (errorOutput.includes('error') || errorOutput.includes('Error')) {
            return {
                name: 'ESLint',
                status: 'fail',
                message: 'ESLint found issues',
                details: errorOutput.substring(0, 200),
                fix: 'Run: npx eslint . --fix',
            };
        }
        
        return {
            name: 'ESLint',
            status: 'fail',
            message: 'ESLint check failed',
            details: errorOutput.substring(0, 200),
        };
    }
}

/**
 * Run TypeScript compiler check
 */
async function runTypecheck(cwd: string): Promise<CheckResult> {
    if (!await hasTypescriptConfig(cwd)) {
        return {
            name: 'TypeScript',
            status: 'skip',
            message: 'No tsconfig.json found',
        };
    }
    
    try {
        // Check if TypeScript is installed
        const tscPath = path.join(cwd, 'node_modules', '.bin', 'tsc');
        if (!await fs.pathExists(tscPath) && !await fs.pathExists(tscPath + '.cmd')) {
            return {
                name: 'TypeScript',
                status: 'warn',
                message: 'TypeScript is not installed',
                fix: 'Run: npm install typescript --save-dev',
            };
        }
        
        // Run tsc --noEmit
        execSync('npx tsc --noEmit', {
            cwd,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 120000,
        });
        
        return {
            name: 'TypeScript',
            status: 'pass',
            message: 'No type errors found',
        };
    } catch (error) {
        const errorOutput = error instanceof Error ? error.message : String(error);
        
        // Count errors
        const errorMatches = errorOutput.match(/error TS\d+/g);
        const errorCount = errorMatches ? errorMatches.length : 0;
        
        if (errorCount > 0) {
            return {
                name: 'TypeScript',
                status: 'fail',
                message: `${errorCount} type error(s) found`,
                details: errorOutput.split('\n').slice(0, 5).join('\n'),
                fix: 'Fix the type errors in your TypeScript files',
            };
        }
        
        return {
            name: 'TypeScript',
            status: 'fail',
            message: 'TypeScript compilation failed',
            details: errorOutput.substring(0, 200),
        };
    }
}

/**
 * Run all lint checks
 */
export async function runLintChecks(cwd: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    results.push(await runEslint(cwd));
    results.push(await runTypecheck(cwd));
    
    return results;
}
