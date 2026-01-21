import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { organizeFilesByType, organizeFilesByDate, detectDuplicates } from '../utils/file-organizer.js';

export async function organizeCommand(
    folderPath: string | undefined,
    options: Record<string, unknown>,
    _command?: Command
) {
    try {
        let targetPath: string = folderPath || '';

        // If no folder path provided, use interactive prompt
        if (!targetPath) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'path',
                    message: 'Enter the folder path to organize:',
                    default: process.cwd(),
                    validate: (input: string) => {
                        if (!input.trim()) return 'Path cannot be empty';
                        return true;
                    },
                },
            ]);
            targetPath = answers.path;
        }

        // Resolve to absolute path
        const absolutePath = path.resolve(targetPath);

        // Validate folder exists
        if (!(await fs.pathExists(absolutePath))) {
            logger.error(`Folder does not exist: ${absolutePath}`);
            process.exit(1);
        }

        const stats = await fs.stat(absolutePath);
        if (!stats.isDirectory()) {
            logger.error(`Path is not a directory: ${absolutePath}`);
            process.exit(1);
        }

        // Get organization strategy
        let strategy = (options.strategy as string) || '';
        if (!['type', 'date'].includes(strategy)) {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'strategy',
                    message: 'How would you like to organize files?',
                    choices: [
                        { name: 'By File Type (images, documents, etc.)', value: 'type' },
                        { name: 'By Date (YYYY-MM)', value: 'date' },
                    ],
                },
            ]);
            strategy = answers.strategy;
        }

        // Check if user wants to handle duplicates
        let handleDuplicates = !!options.duplicates;
        if (!options.duplicates) {
            const answers = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'duplicates',
                    message: 'Move duplicate files to a "Duplicates" folder?',
                    default: false,
                },
            ]);
            handleDuplicates = answers.duplicates;
        }

        console.log('');
        logger.title('📁 Organizing files...');

        // Detect duplicates if needed
        let duplicates: Map<string, string[]> = new Map();
        if (handleDuplicates) {
            logger.info('Detecting duplicate files...');
            duplicates = await detectDuplicates(absolutePath);
            if (duplicates.size === 0) {
                console.log(chalk.gray('No duplicates found.'));
            } else {
                console.log(chalk.gray(`Found ${duplicates.size} set(s) of duplicate files.`));
            }
        }

        // Organize files
        let result;
        if (strategy === 'type') {
            result = await organizeFilesByType(absolutePath, duplicates);
        } else {
            result = await organizeFilesByDate(absolutePath, duplicates);
        }

        // Display results
        console.log('');
        logger.success('Organization complete!');
        console.log('');
        console.log(chalk.bold('Summary:'));
        console.log(chalk.gray('─'.repeat(50)));

        let totalFilesMoved = 0;
        const categorizedEntries = Object.entries(result.categorized);

        if (categorizedEntries.length === 0) {
            console.log(chalk.gray('No files to organize.'));
        } else {
            for (const [folder, count] of categorizedEntries) {
                console.log(`${chalk.cyan('→')} ${folder}: ${chalk.bold(count)} files`);
                totalFilesMoved += count;
            }
        }

        if (result.duplicates > 0) {
            console.log(`${chalk.cyan('→')} Duplicates: ${chalk.bold(result.duplicates)} files`);
            totalFilesMoved += result.duplicates;
        }

        console.log(chalk.gray('─'.repeat(50)));
        console.log(`${chalk.bold('Total files moved:')} ${chalk.green(totalFilesMoved)}`);
        console.log('');

    } catch (error) {
        logger.error('Failed to organize files');
        if (error instanceof Error) {
            console.error(chalk.red(error.message));
        } else {
            console.error(error);
        }
        process.exit(1);
    }
}
