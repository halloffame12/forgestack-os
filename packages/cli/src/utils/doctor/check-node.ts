/**
 * Node.js and package manager version checks
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { CheckResult } from './types.js';

/**
 * Parse semantic version string
 */
function parseVersion(version: string): { major: number; minor: number; patch: number } | null {
    const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;
    return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10),
    };
}

/**
 * Compare two versions, returns: -1 if a < b, 0 if equal, 1 if a > b
 */
function compareVersions(a: string, b: string): number {
    const va = parseVersion(a);
    const vb = parseVersion(b);
    if (!va || !vb) return 0;
    
    if (va.major !== vb.major) return va.major - vb.major;
    if (va.minor !== vb.minor) return va.minor - vb.minor;
    return va.patch - vb.patch;
}

/**
 * Get the required Node version from project config
 */
async function getRequiredNodeVersion(cwd: string): Promise<string | null> {
    // Check .nvmrc first
    const nvmrcPath = path.join(cwd, '.nvmrc');
    if (await fs.pathExists(nvmrcPath)) {
        const content = await fs.readFile(nvmrcPath, 'utf-8');
        return content.trim().replace(/^v/, '');
    }
    
    // Check package.json engines
    const pkgPath = path.join(cwd, 'package.json');
    if (await fs.pathExists(pkgPath)) {
        try {
            const pkg = await fs.readJson(pkgPath);
            if (pkg.engines?.node) {
                // Parse engine string like ">=18" or "^20.0.0"
                const match = pkg.engines.node.match(/\d+(\.\d+)?(\.\d+)?/);
                return match ? match[0] : null;
            }
        } catch {
            // Ignore JSON parse errors
        }
    }
    
    return null;
}

/**
 * Execute command and return output, or null on failure
 */
function execCommand(command: string): string | null {
    try {
        return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch {
        return null;
    }
}

/**
 * Check Node.js version
 */
export async function checkNodeVersion(cwd: string): Promise<CheckResult> {
    const nodeVersion = execCommand('node --version');
    
    if (!nodeVersion) {
        return {
            name: 'Node.js',
            status: 'fail',
            message: 'Node.js is not installed',
            fix: 'Install Node.js from https://nodejs.org/',
        };
    }
    
    const version = nodeVersion.replace(/^v/, '');
    const requiredVersion = await getRequiredNodeVersion(cwd);
    
    if (requiredVersion) {
        const comparison = compareVersions(version, requiredVersion);
        if (comparison < 0) {
            return {
                name: 'Node.js',
                status: 'fail',
                message: `Node version ${version} is below required ${requiredVersion}`,
                fix: `Update Node.js to version ${requiredVersion} or higher`,
            };
        }
    }
    
    // Minimum supported version is 18
    const parsed = parseVersion(version);
    if (parsed && parsed.major < 18) {
        return {
            name: 'Node.js',
            status: 'fail',
            message: `Node version ${version} is too old (minimum: 18.x)`,
            fix: 'Update Node.js to version 18 or higher',
        };
    }
    
    return {
        name: 'Node.js',
        status: 'pass',
        message: `Node version: ${version}`,
        details: requiredVersion ? `Required: >=${requiredVersion}` : undefined,
    };
}

/**
 * Check npm version
 */
export async function checkNpmVersion(): Promise<CheckResult> {
    const npmVersion = execCommand('npm --version');
    
    if (!npmVersion) {
        return {
            name: 'npm',
            status: 'fail',
            message: 'npm is not installed',
            fix: 'npm should be installed with Node.js. Try reinstalling Node.js.',
        };
    }
    
    const parsed = parseVersion(npmVersion);
    if (parsed && parsed.major < 8) {
        return {
            name: 'npm',
            status: 'warn',
            message: `npm version ${npmVersion} is outdated`,
            fix: 'Run: npm install -g npm@latest',
        };
    }
    
    return {
        name: 'npm',
        status: 'pass',
        message: `npm version: ${npmVersion}`,
    };
}

/**
 * Check pnpm installation (optional)
 */
export async function checkPnpmVersion(): Promise<CheckResult> {
    const pnpmVersion = execCommand('pnpm --version');
    
    if (!pnpmVersion) {
        return {
            name: 'pnpm',
            status: 'skip',
            message: 'pnpm is not installed (optional)',
            details: 'pnpm is an alternative package manager',
        };
    }
    
    return {
        name: 'pnpm',
        status: 'pass',
        message: `pnpm version: ${pnpmVersion}`,
    };
}

/**
 * Run all Node/package manager checks
 */
export async function runNodeChecks(cwd: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    results.push(await checkNodeVersion(cwd));
    results.push(await checkNpmVersion());
    results.push(await checkPnpmVersion());
    
    return results;
}
