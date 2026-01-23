/**
 * Docker installation and status checks
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { CheckResult } from './types.js';

/**
 * Check if Docker files exist in the project
 */
async function hasDockerConfig(cwd: string): Promise<boolean> {
    const dockerFiles = [
        'Dockerfile',
        'docker-compose.yml',
        'docker-compose.yaml',
        'compose.yml',
        'compose.yaml',
    ];
    
    for (const file of dockerFiles) {
        if (await fs.pathExists(path.join(cwd, file))) {
            return true;
        }
    }
    
    return false;
}

/**
 * Check if Docker is installed
 */
async function checkDockerInstalled(): Promise<CheckResult> {
    try {
        const version = execSync('docker --version', {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
        
        // Extract version number
        const match = version.match(/Docker version (\d+\.\d+\.\d+)/);
        const versionNum = match ? match[1] : 'unknown';
        
        return {
            name: 'Docker',
            status: 'pass',
            message: `Docker installed: ${versionNum}`,
        };
    } catch {
        return {
            name: 'Docker',
            status: 'fail',
            message: 'Docker is not installed',
            fix: 'Install Docker from https://www.docker.com/get-started',
        };
    }
}

/**
 * Check if Docker daemon is running
 */
async function checkDockerRunning(): Promise<CheckResult> {
    try {
        execSync('docker info', {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 10000,
        });
        
        return {
            name: 'Docker Daemon',
            status: 'pass',
            message: 'Docker daemon is running',
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('Cannot connect') || errorMessage.includes('permission denied')) {
            return {
                name: 'Docker Daemon',
                status: 'fail',
                message: 'Docker daemon is not running',
                fix: 'Start Docker Desktop or run: sudo systemctl start docker',
            };
        }
        
        return {
            name: 'Docker Daemon',
            status: 'fail',
            message: 'Cannot connect to Docker daemon',
            details: errorMessage.substring(0, 100),
            fix: 'Ensure Docker is installed and running',
        };
    }
}

/**
 * Check if Docker Compose is available
 */
async function checkDockerCompose(): Promise<CheckResult> {
    // Try docker compose (V2)
    try {
        const version = execSync('docker compose version', {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
        
        const match = version.match(/v?(\d+\.\d+\.\d+)/);
        const versionNum = match ? match[1] : 'unknown';
        
        return {
            name: 'Docker Compose',
            status: 'pass',
            message: `Docker Compose V2: ${versionNum}`,
        };
    } catch {
        // Try docker-compose (V1)
        try {
            const version = execSync('docker-compose --version', {
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            }).trim();
            
            const match = version.match(/(\d+\.\d+\.\d+)/);
            const versionNum = match ? match[1] : 'unknown';
            
            return {
                name: 'Docker Compose',
                status: 'warn',
                message: `Docker Compose V1: ${versionNum}`,
                details: 'Consider upgrading to Docker Compose V2',
            };
        } catch {
            return {
                name: 'Docker Compose',
                status: 'fail',
                message: 'Docker Compose is not installed',
                fix: 'Install Docker Compose or update Docker Desktop',
            };
        }
    }
}

/**
 * Check if docker-compose.yml is valid
 */
async function checkDockerComposeConfig(cwd: string): Promise<CheckResult> {
    const composeFiles = [
        'docker-compose.yml',
        'docker-compose.yaml',
        'compose.yml',
        'compose.yaml',
    ];
    
    let composeFile: string | null = null;
    for (const file of composeFiles) {
        if (await fs.pathExists(path.join(cwd, file))) {
            composeFile = file;
            break;
        }
    }
    
    if (!composeFile) {
        return {
            name: 'Docker Compose Config',
            status: 'skip',
            message: 'No docker-compose file found',
        };
    }
    
    try {
        execSync('docker compose config --quiet', {
            cwd,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 10000,
        });
        
        return {
            name: 'Docker Compose Config',
            status: 'pass',
            message: `${composeFile} is valid`,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        return {
            name: 'Docker Compose Config',
            status: 'fail',
            message: `Invalid ${composeFile}`,
            details: errorMessage.substring(0, 200),
            fix: 'Fix the syntax errors in your docker-compose file',
        };
    }
}

/**
 * Run all Docker checks
 */
export async function runDockerChecks(cwd: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    // Check if project uses Docker
    const usesDocker = await hasDockerConfig(cwd);
    
    if (!usesDocker) {
        results.push({
            name: 'Docker',
            status: 'skip',
            message: 'No Docker configuration found in project',
        });
        return results;
    }
    
    // Check Docker installation
    const dockerInstalled = await checkDockerInstalled();
    results.push(dockerInstalled);
    
    if (dockerInstalled.status === 'fail') {
        return results;
    }
    
    // Check Docker daemon
    const dockerRunning = await checkDockerRunning();
    results.push(dockerRunning);
    
    if (dockerRunning.status === 'fail') {
        return results;
    }
    
    // Check Docker Compose
    results.push(await checkDockerCompose());
    
    // Check compose config validity
    results.push(await checkDockerComposeConfig(cwd));
    
    return results;
}
