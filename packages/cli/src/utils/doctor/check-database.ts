/**
 * Database connectivity checks
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { CheckResult, DatabaseConfig } from './types.js';

/**
 * Parse a database connection string to determine type
 */
function parseDatabaseUrl(url: string): DatabaseConfig | null {
    if (!url) return null;
    
    if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
        return { type: 'postgresql', connectionString: url };
    }
    if (url.startsWith('mongodb://') || url.startsWith('mongodb+srv://')) {
        return { type: 'mongodb', connectionString: url };
    }
    if (url.startsWith('mysql://')) {
        return { type: 'mysql', connectionString: url };
    }
    if (url.includes('.sqlite') || url.includes('.db') || url.startsWith('file:')) {
        return { type: 'sqlite', connectionString: url };
    }
    
    return null;
}

/**
 * Read DATABASE_URL from .env file
 */
async function getDatabaseUrl(cwd: string): Promise<string | null> {
    const envPath = path.join(cwd, '.env');
    
    if (!await fs.pathExists(envPath)) {
        return null;
    }
    
    const content = await fs.readFile(envPath, 'utf-8');
    const lines = content.split('\n');
    
    for (const line of lines) {
        const match = line.match(/^DATABASE_URL\s*=\s*["']?([^"'\s]+)["']?/);
        if (match) {
            return match[1];
        }
    }
    
    return null;
}

/**
 * Check PostgreSQL connectivity
 */
async function checkPostgresConnection(connectionString: string): Promise<CheckResult> {
    try {
        // Try using psql to check connection
        execSync(`psql "${connectionString}" -c "SELECT 1" 2>&1`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 10000,
        });
        
        return {
            name: 'PostgreSQL Connection',
            status: 'pass',
            message: 'Successfully connected to PostgreSQL',
        };
    } catch (error) {
        // Check if psql is installed
        try {
            execSync('psql --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
        } catch {
            return {
                name: 'PostgreSQL Connection',
                status: 'warn',
                message: 'Cannot verify connection (psql not installed)',
                details: 'Install PostgreSQL client tools to enable connection verification',
                fix: 'The connection will be verified when the app starts',
            };
        }
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('connection refused') || errorMessage.includes('ECONNREFUSED')) {
            return {
                name: 'PostgreSQL Connection',
                status: 'fail',
                message: 'PostgreSQL server is not running or unreachable',
                fix: 'Start your PostgreSQL server or check the connection string',
            };
        }
        
        if (errorMessage.includes('authentication failed') || errorMessage.includes('password')) {
            return {
                name: 'PostgreSQL Connection',
                status: 'fail',
                message: 'PostgreSQL authentication failed',
                fix: 'Check your DATABASE_URL credentials in .env',
            };
        }
        
        if (errorMessage.includes('does not exist')) {
            return {
                name: 'PostgreSQL Connection',
                status: 'fail',
                message: 'Database does not exist',
                fix: 'Create the database or run migrations: npx prisma migrate dev',
            };
        }
        
        return {
            name: 'PostgreSQL Connection',
            status: 'fail',
            message: 'Failed to connect to PostgreSQL',
            details: errorMessage.substring(0, 200),
            fix: 'Check your DATABASE_URL in .env',
        };
    }
}

/**
 * Check MongoDB connectivity
 */
async function checkMongoConnection(connectionString: string): Promise<CheckResult> {
    try {
        // Try using mongosh or mongo to check connection
        const mongoCmd = execSync('which mongosh 2>/dev/null || which mongo 2>/dev/null || echo mongosh', {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
        
        execSync(`${mongoCmd} "${connectionString}" --eval "db.runCommand({ping:1})" --quiet 2>&1`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 10000,
        });
        
        return {
            name: 'MongoDB Connection',
            status: 'pass',
            message: 'Successfully connected to MongoDB',
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Check if mongo shell is not installed
        if (errorMessage.includes('not found') || errorMessage.includes('not recognized')) {
            return {
                name: 'MongoDB Connection',
                status: 'warn',
                message: 'Cannot verify connection (mongosh not installed)',
                details: 'Install MongoDB Shell to enable connection verification',
                fix: 'The connection will be verified when the app starts',
            };
        }
        
        return {
            name: 'MongoDB Connection',
            status: 'fail',
            message: 'Failed to connect to MongoDB',
            details: errorMessage.substring(0, 200),
            fix: 'Check your DATABASE_URL in .env and ensure MongoDB is running',
        };
    }
}

/**
 * Check MySQL connectivity
 */
async function checkMysqlConnection(connectionString: string): Promise<CheckResult> {
    try {
        // Parse connection string
        const url = new URL(connectionString);
        const host = url.hostname;
        const port = url.port || '3306';
        const user = url.username;
        const password = url.password;
        const database = url.pathname.slice(1);
        
        execSync(`mysql -h ${host} -P ${port} -u ${user} -p${password} ${database} -e "SELECT 1" 2>&1`, {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 10000,
        });
        
        return {
            name: 'MySQL Connection',
            status: 'pass',
            message: 'Successfully connected to MySQL',
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('not found') || errorMessage.includes('not recognized')) {
            return {
                name: 'MySQL Connection',
                status: 'warn',
                message: 'Cannot verify connection (mysql client not installed)',
                fix: 'The connection will be verified when the app starts',
            };
        }
        
        return {
            name: 'MySQL Connection',
            status: 'fail',
            message: 'Failed to connect to MySQL',
            details: errorMessage.substring(0, 200),
            fix: 'Check your DATABASE_URL in .env and ensure MySQL is running',
        };
    }
}

/**
 * Check SQLite file exists
 */
async function checkSqliteConnection(connectionString: string): Promise<CheckResult> {
    // Extract file path from connection string
    let dbPath = connectionString.replace(/^file:/, '').replace(/\?.*$/, '');
    
    // Handle relative paths
    if (!path.isAbsolute(dbPath)) {
        dbPath = path.join(process.cwd(), dbPath);
    }
    
    if (await fs.pathExists(dbPath)) {
        return {
            name: 'SQLite Database',
            status: 'pass',
            message: 'SQLite database file exists',
            details: dbPath,
        };
    }
    
    // Check if parent directory exists (database will be created on first run)
    const dbDir = path.dirname(dbPath);
    if (await fs.pathExists(dbDir)) {
        return {
            name: 'SQLite Database',
            status: 'warn',
            message: 'SQLite database file does not exist yet',
            details: 'The file will be created when you run migrations',
            fix: 'Run: npx prisma migrate dev',
        };
    }
    
    return {
        name: 'SQLite Database',
        status: 'fail',
        message: 'SQLite database directory does not exist',
        fix: 'Create the directory or check the DATABASE_URL path',
    };
}

/**
 * Run database connectivity check
 */
export async function checkDatabaseConnection(cwd: string): Promise<CheckResult[]> {
    const results: CheckResult[] = [];
    
    const databaseUrl = await getDatabaseUrl(cwd);
    
    if (!databaseUrl) {
        results.push({
            name: 'Database Connection',
            status: 'skip',
            message: 'No DATABASE_URL configured',
            details: 'Set DATABASE_URL in .env to enable database checks',
        });
        return results;
    }
    
    const dbConfig = parseDatabaseUrl(databaseUrl);
    
    if (!dbConfig) {
        results.push({
            name: 'Database Connection',
            status: 'warn',
            message: 'Unknown database type in DATABASE_URL',
            details: 'Supported: postgresql, mongodb, mysql, sqlite',
        });
        return results;
    }
    
    switch (dbConfig.type) {
        case 'postgresql':
            results.push(await checkPostgresConnection(databaseUrl));
            break;
        case 'mongodb':
            results.push(await checkMongoConnection(databaseUrl));
            break;
        case 'mysql':
            results.push(await checkMysqlConnection(databaseUrl));
            break;
        case 'sqlite':
            results.push(await checkSqliteConnection(databaseUrl));
            break;
    }
    
    return results;
}
