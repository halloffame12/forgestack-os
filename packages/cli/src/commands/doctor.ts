/**
 * ForgeStack Doctor Command
 * 
 * Validates the generated SaaS project environment and dev setup.
 * Helps developers quickly detect missing dependencies, configuration issues,
 * and common setup problems before running the app.
 */

import chalk from 'chalk';
import path from 'path';
import {
    CheckResult,
    CheckStatus,
    DoctorOptions,
    DoctorReport,
    runNodeChecks,
    checkEnvVariables,
    checkDatabaseConnection,
    runPrismaChecks,
    runDockerChecks,
    checkAppPorts,
    runLintChecks,
    generateMissingEnvReport,
} from '../utils/doctor/index.js';
import { logger } from '../utils/logger.js';

/**
 * Status icons for console output
 */
const STATUS_ICONS: Record<CheckStatus, string> = {
    pass: chalk.green('✅'),
    warn: chalk.yellow('⚠️'),
    fail: chalk.red('❌'),
    skip: chalk.gray('⏭️'),
};

/**
 * Format a check result for console output
 */
function formatCheckResult(result: CheckResult): string {
    const icon = STATUS_ICONS[result.status];
    let output = `${icon} ${result.name}: ${result.message}`;
    
    if (result.details) {
        output += chalk.gray(`\n   └─ ${result.details}`);
    }
    
    if (result.fix && (result.status === 'fail' || result.status === 'warn')) {
        output += chalk.cyan(`\n   💡 Fix: ${result.fix}`);
    }
    
    return output;
}

/**
 * Create a summary from check results
 */
function createSummary(checks: CheckResult[]): DoctorReport['summary'] {
    return {
        total: checks.length,
        passed: checks.filter(c => c.status === 'pass').length,
        warnings: checks.filter(c => c.status === 'warn').length,
        failed: checks.filter(c => c.status === 'fail').length,
        skipped: checks.filter(c => c.status === 'skip').length,
    };
}

/**
 * Print the doctor report banner
 */
function printBanner(): void {
    console.log('');
    console.log(chalk.bold.cyan('╔═══════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║                                                   ║'));
    console.log(chalk.bold.cyan('║      🩺 ForgeStack Doctor Report                  ║'));
    console.log(chalk.bold.cyan('║                                                   ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════╝'));
    console.log('');
}

/**
 * Print the summary section
 */
function printSummary(summary: DoctorReport['summary']): void {
    console.log('');
    console.log(chalk.bold('─'.repeat(55)));
    console.log(chalk.bold('\n📊 Summary:\n'));
    
    const items = [
        { label: 'Total Checks', value: summary.total, color: chalk.white },
        { label: 'Passed', value: summary.passed, color: chalk.green },
        { label: 'Warnings', value: summary.warnings, color: chalk.yellow },
        { label: 'Failed', value: summary.failed, color: chalk.red },
        { label: 'Skipped', value: summary.skipped, color: chalk.gray },
    ];
    
    for (const item of items) {
        console.log(`   ${item.color(`${item.label}:`)} ${item.value}`);
    }
    
    console.log('');
}

/**
 * Print section header
 */
function printSection(title: string): void {
    console.log(chalk.bold.blue(`\n📋 ${title}\n`));
}

/**
 * Main doctor command implementation
 */
export async function doctorCommand(options: DoctorOptions = {}): Promise<void> {
    const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
    const allChecks: CheckResult[] = [];
    
    // Print banner (unless JSON output)
    if (!options.json) {
        printBanner();
        console.log(chalk.gray(`Working directory: ${cwd}\n`));
    }
    
    try {
        // 1. Node & Package Manager Checks
        if (!options.json) {
            printSection('Node.js & Package Managers');
        }
        const nodeChecks = await runNodeChecks(cwd);
        allChecks.push(...nodeChecks);
        if (!options.json) {
            nodeChecks.forEach(r => console.log(formatCheckResult(r)));
        }
        
        // 2. Environment Variable Checks
        if (!options.json) {
            printSection('Environment Variables');
        }
        const envChecks = await checkEnvVariables(cwd);
        allChecks.push(...envChecks);
        if (!options.json) {
            envChecks.forEach(r => console.log(formatCheckResult(r)));
        }
        
        // Generate .env.missing report if requested
        if (options.fix) {
            const missingReportPath = await generateMissingEnvReport(cwd);
            if (missingReportPath && !options.json) {
                console.log(chalk.cyan(`\n   📝 Generated: ${missingReportPath}`));
            }
        }
        
        // 3. Database Connectivity Checks
        if (!options.json) {
            printSection('Database Connectivity');
        }
        const dbChecks = await checkDatabaseConnection(cwd);
        allChecks.push(...dbChecks);
        if (!options.json) {
            dbChecks.forEach(r => console.log(formatCheckResult(r)));
        }
        
        // 4. Prisma Checks
        if (!options.json) {
            printSection('Prisma ORM');
        }
        const prismaChecks = await runPrismaChecks(cwd);
        allChecks.push(...prismaChecks);
        if (!options.json) {
            prismaChecks.forEach(r => console.log(formatCheckResult(r)));
        }
        
        // 5. Docker Checks
        if (!options.json) {
            printSection('Docker');
        }
        const dockerChecks = await runDockerChecks(cwd);
        allChecks.push(...dockerChecks);
        if (!options.json) {
            dockerChecks.forEach(r => console.log(formatCheckResult(r)));
        }
        
        // 6. Port Availability Checks
        if (!options.json) {
            printSection('Port Availability');
        }
        const portChecks = await checkAppPorts();
        allChecks.push(...portChecks);
        if (!options.json) {
            portChecks.forEach(r => console.log(formatCheckResult(r)));
        }
        
        // 7. Lint Checks (optional)
        if (options.lint) {
            if (!options.json) {
                printSection('Code Quality (ESLint & TypeScript)');
            }
            const lintChecks = await runLintChecks(cwd);
            allChecks.push(...lintChecks);
            if (!options.json) {
                lintChecks.forEach(r => console.log(formatCheckResult(r)));
            }
        }
        
        // Create report
        const summary = createSummary(allChecks);
        const report: DoctorReport = {
            timestamp: new Date().toISOString(),
            cwd,
            checks: allChecks,
            summary,
            exitCode: summary.failed > 0 ? 1 : 0,
        };
        
        // Output
        if (options.json) {
            console.log(JSON.stringify(report, null, 2));
        } else {
            printSummary(summary);
            
            // Final status message
            if (summary.failed > 0) {
                logger.error(`Found ${summary.failed} critical issue(s) that need to be fixed.`);
            } else if (summary.warnings > 0) {
                logger.warning(`Found ${summary.warnings} warning(s) to review.`);
            } else {
                logger.success('All checks passed! Your environment is ready. 🚀');
            }
            
            console.log('');
        }
        
        // Exit with appropriate code
        if (summary.failed > 0) {
            process.exit(1);
        }
        
    } catch (error) {
        if (!options.json) {
            logger.error('Doctor command failed unexpectedly');
            console.error(error);
        } else {
            console.log(JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                exitCode: 1,
            }));
        }
        process.exit(1);
    }
}
