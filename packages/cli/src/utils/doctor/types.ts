/**
 * Doctor check result types
 */

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'skip';

export interface CheckResult {
    name: string;
    status: CheckStatus;
    message: string;
    details?: string;
    fix?: string;
}

export interface DoctorOptions {
    /** Run lint/TypeScript checks */
    lint?: boolean;
    /** Output results as JSON */
    json?: boolean;
    /** Auto-fix issues where possible */
    fix?: boolean;
    /** Custom project directory */
    cwd?: string;
}

export interface DoctorReport {
    timestamp: string;
    cwd: string;
    checks: CheckResult[];
    summary: {
        total: number;
        passed: number;
        warnings: number;
        failed: number;
        skipped: number;
    };
    exitCode: number;
}

export interface EnvVariable {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'url';
    required?: boolean;
    example?: string;
}

export interface PortCheckResult {
    port: number;
    name: string;
    inUse: boolean;
    pid?: number;
}

export interface DatabaseConfig {
    type: 'postgresql' | 'mongodb' | 'mysql' | 'sqlite';
    connectionString?: string;
}
