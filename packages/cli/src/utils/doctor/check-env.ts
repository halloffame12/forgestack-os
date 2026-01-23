/**
 * Environment variable validation checks
 */

import fs from 'fs-extra';
import path from 'path';
import type { CheckResult, EnvVariable } from './types.js';

/**
 * Parse .env file content into key-value pairs
 */
function parseEnvFile(content: string): Record<string, string> {
    const env: Record<string, string> = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    }
    
    return env;
}

/**
 * Infer the type of an environment variable from its example value
 */
function inferEnvType(name: string, exampleValue: string): EnvVariable['type'] {
    const lowerName = name.toLowerCase();
    
    // URL detection
    if (lowerName.includes('url') || lowerName.includes('uri') ||
        lowerName.includes('endpoint') || lowerName.includes('host') ||
        exampleValue.startsWith('http://') || exampleValue.startsWith('https://') ||
        exampleValue.startsWith('postgres://') || exampleValue.startsWith('mongodb://') ||
        exampleValue.startsWith('mysql://')) {
        return 'url';
    }
    
    // Boolean detection
    if (exampleValue.toLowerCase() === 'true' || exampleValue.toLowerCase() === 'false' ||
        exampleValue === '0' || exampleValue === '1') {
        return 'boolean';
    }
    
    // Number detection
    if (lowerName.includes('port') || lowerName.includes('timeout') ||
        lowerName.includes('limit') || lowerName.includes('size') ||
        lowerName.includes('count') || lowerName.includes('max') ||
        lowerName.includes('min') || /^\d+$/.test(exampleValue)) {
        return 'number';
    }
    
    return 'string';
}

/**
 * Validate a value against its expected type
 */
function validateEnvValue(value: string, type: EnvVariable['type']): boolean {
    if (!value) return false;
    
    switch (type) {
        case 'number':
            return !isNaN(Number(value)) && value.trim() !== '';
        case 'boolean':
            return ['true', 'false', '0', '1', 'yes', 'no'].includes(value.toLowerCase());
        case 'url':
            try {
                new URL(value);
                return true;
            } catch {
                // Also accept connection strings with protocols
                return /^[a-z]+:\/\/.+/.test(value);
            }
        case 'string':
        default:
            return true;
    }
}

/**
 * Check environment variables against .env.example
 */
export async function checkEnvVariables(cwd: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    const envExamplePath = path.join(cwd, '.env.example');
    const envPath = path.join(cwd, '.env');
    
    // Check if .env.example exists
    if (!await fs.pathExists(envExamplePath)) {
        results.push({
            name: 'Environment Variables',
            status: 'skip',
            message: 'No .env.example found',
            details: 'Create a .env.example file to enable environment variable validation',
        });
        return results;
    }
    
    // Read .env.example
    const exampleContent = await fs.readFile(envExamplePath, 'utf-8');
    const exampleVars = parseEnvFile(exampleContent);
    
    if (Object.keys(exampleVars).length === 0) {
        results.push({
            name: 'Environment Variables',
            status: 'skip',
            message: '.env.example is empty',
        });
        return results;
    }
    
    // Check if .env exists
    if (!await fs.pathExists(envPath)) {
        const missingVars = Object.keys(exampleVars);
        results.push({
            name: 'Environment Variables',
            status: 'fail',
            message: `.env file not found (${missingVars.length} variables required)`,
            details: `Missing: ${missingVars.join(', ')}`,
            fix: 'Copy .env.example to .env and fill in the values',
        });
        return results;
    }
    
    // Read .env
    const envContent = await fs.readFile(envPath, 'utf-8');
    const envVars = parseEnvFile(envContent);
    
    // Check for missing variables
    const missingVars: string[] = [];
    const invalidVars: Array<{ name: string; expectedType: string }> = [];
    
    for (const [name, exampleValue] of Object.entries(exampleVars)) {
        const currentValue = envVars[name];
        
        if (currentValue === undefined || currentValue === '') {
            missingVars.push(name);
        } else {
            // Validate type
            const expectedType = inferEnvType(name, exampleValue);
            if (!validateEnvValue(currentValue, expectedType)) {
                invalidVars.push({ name, expectedType });
            }
        }
    }
    
    // Report missing variables
    if (missingVars.length > 0) {
        results.push({
            name: 'Missing .env Variables',
            status: 'fail',
            message: `${missingVars.length} environment variable(s) missing`,
            details: missingVars.join(', '),
            fix: 'Add the missing variables to your .env file',
        });
    } else {
        results.push({
            name: 'Environment Variables',
            status: 'pass',
            message: 'All required environment variables are set',
        });
    }
    
    // Report invalid type variables
    if (invalidVars.length > 0) {
        results.push({
            name: 'Environment Variable Types',
            status: 'warn',
            message: `${invalidVars.length} variable(s) may have invalid types`,
            details: invalidVars.map(v => `${v.name} (expected: ${v.expectedType})`).join(', '),
        });
    }
    
    return results;
}

/**
 * Generate a .env.missing report file
 */
export async function generateMissingEnvReport(cwd: string): Promise<string | null> {
    const envExamplePath = path.join(cwd, '.env.example');
    const envPath = path.join(cwd, '.env');
    
    if (!await fs.pathExists(envExamplePath)) {
        return null;
    }
    
    const exampleContent = await fs.readFile(envExamplePath, 'utf-8');
    const exampleVars = parseEnvFile(exampleContent);
    
    let envVars: Record<string, string> = {};
    if (await fs.pathExists(envPath)) {
        const envContent = await fs.readFile(envPath, 'utf-8');
        envVars = parseEnvFile(envContent);
    }
    
    const missingVars: string[] = [];
    for (const name of Object.keys(exampleVars)) {
        if (envVars[name] === undefined || envVars[name] === '') {
            missingVars.push(name);
        }
    }
    
    if (missingVars.length === 0) {
        return null;
    }
    
    // Generate report content
    const reportContent = `# Missing Environment Variables Report
# Generated: ${new Date().toISOString()}
# 
# The following variables are defined in .env.example but missing from .env:

${missingVars.map(v => `${v}=`).join('\n')}
`;
    
    const reportPath = path.join(cwd, '.env.missing');
    await fs.writeFile(reportPath, reportContent, 'utf-8');
    
    return reportPath;
}
