import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { promptForStack } from '../utils/prompts';
import { validateStackConfig } from '../utils/validators';
import { generateProject } from '../generators';

export async function createCommand(projectName: string, options: any) {
    try {
        // Display welcome banner
        console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════╗'));
        console.log(chalk.bold.cyan('║                                       ║'));
        console.log(chalk.bold.cyan('║        🚀 ForgeStack OS v0.1.0       ║'));
        console.log(chalk.bold.cyan('║                                       ║'));
        console.log(chalk.bold.cyan('║  One platform. Any stack. Production. ║'));
        console.log(chalk.bold.cyan('║                                       ║'));
        console.log(chalk.bold.cyan('╚═══════════════════════════════════════╝\n'));

        // Check if directory already exists
        const targetDir = path.resolve(process.cwd(), projectName);

        // Basic path sanitization for security
        if (projectName.includes('..') || projectName.includes('/') || projectName.includes('\\')) {
            logger.error(`Invalid project name: "${projectName}". Please use a simple name.`);
            process.exit(1);
        }

        if (await fs.pathExists(targetDir)) {
            logger.error(`Directory "${projectName}" already exists!`);
            process.exit(1);
        }

        // Test write permissions
        try {
            await fs.ensureDir(targetDir);
            await fs.remove(targetDir);
        } catch (err) {
            logger.error(`Permission denied! Cannot create directory at "${targetDir}".`);
            process.exit(1);
        }

        // Prompt for stack configuration
        logger.title('📋 Configure Your Stack');
        const config = await promptForStack(projectName, options);

        // Validate configuration
        const validation = validateStackConfig(config);

        if (validation.warnings.length > 0) {
            console.log('');
            validation.warnings.forEach(warning => logger.warning(warning));
        }

        if (!validation.valid) {
            console.log('');
            validation.errors.forEach(error => logger.error(error));
            process.exit(1);
        }

        // Display selected stack
        console.log('');
        logger.title('✨ Your Stack Configuration');
        console.log(chalk.gray('─'.repeat(50)));
        console.log(`${chalk.bold('Project:')}      ${chalk.cyan(config.projectName)}`);
        console.log(`${chalk.bold('Frontend:')}     ${chalk.cyan(config.frontend)}`);
        console.log(`${chalk.bold('Backend:')}      ${chalk.cyan(config.backend)}`);
        console.log(`${chalk.bold('Auth:')}         ${chalk.cyan(config.auth)}`);
        console.log(`${chalk.bold('Database:')}     ${chalk.cyan(config.database)}`);
        console.log(`${chalk.bold('API Style:')}    ${chalk.cyan(config.apiStyle)}`);
        console.log(`${chalk.bold('Docker:')}       ${chalk.cyan(config.docker ? 'Yes' : 'No')}`);
        console.log(`${chalk.bold('Multi-Tenant:')} ${chalk.cyan(config.multiTenant ? 'Yes' : 'No')}`);
        console.log(chalk.gray('─'.repeat(50)));
        console.log('');

        // Generate project
        await generateProject(config, targetDir);

        // Success message
        console.log('');
        logger.success(chalk.bold('🎉 Project created successfully!\n'));

        console.log(chalk.bold('Next steps:\n'));
        console.log(chalk.cyan(`  cd ${projectName}`));
        console.log(chalk.cyan('  npm install'));
        console.log(chalk.cyan('  npm run dev\n'));

        console.log(chalk.gray('For more information, check out the README.md in your project.\n'));
        console.log(chalk.bold('Built by Sumit Chauhan'));
        console.log(chalk.gray('GitHub: https://github.com/halloffame12'));
        console.log(chalk.gray('LinkedIn: https://www.linkedin.com/in/sumit-chauhan-a4ba98325/\n'));

    } catch (error) {
        logger.error('Failed to create project');
        console.error(error);
        process.exit(1);
    }
}
