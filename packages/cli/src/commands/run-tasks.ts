import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { Command } from 'commander';
import { logger } from '../utils/logger.js';
import { executeTasksSequentially, executeTasksInParallel } from '../utils/task-runner.js';

export interface Task {
    name: string;
    command: string;
    cwd?: string;
}

export interface TasksConfig {
    tasks: Task[];
    parallel?: boolean;
    stopOnError?: boolean;
}

export async function runTasksCommand(
    configPath: string | undefined,
    options: Record<string, unknown>,
    _command?: Command
) {
    try {
        let tasksFilePath: string = configPath || '';

        // If no config path provided, use interactive prompt
        if (!tasksFilePath) {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'path',
                    message: 'Enter the path to tasks.json config file:',
                    default: './tasks.json',
                    validate: (input: string) => {
                        if (!input.trim()) return 'Path cannot be empty';
                        return true;
                    },
                },
            ]);
            tasksFilePath = answers.path;
        }

        // Resolve to absolute path
        const absolutePath = path.resolve(tasksFilePath);

        // Validate file exists
        if (!(await fs.pathExists(absolutePath))) {
            logger.error(`Config file not found: ${absolutePath}`);
            process.exit(1);
        }

        // Validate it's a file
        const stats = await fs.stat(absolutePath);
        if (!stats.isFile()) {
            logger.error(`Path is not a file: ${absolutePath}`);
            process.exit(1);
        }

        // Parse config file
        let config: TasksConfig;
        try {
            const fileContent = await fs.readFile(absolutePath, 'utf-8');
            config = JSON.parse(fileContent) as TasksConfig;
        } catch (error) {
            logger.error(`Failed to parse config file: ${absolutePath}`);
            if (error instanceof SyntaxError) {
                console.error(chalk.red(`JSON Error: ${error.message}`));
            }
            process.exit(1);
        }

        // Validate config
        if (!config.tasks || !Array.isArray(config.tasks) || config.tasks.length === 0) {
            logger.error('Config file must contain a "tasks" array with at least one task');
            process.exit(1);
        }

        // Validate each task
        for (const task of config.tasks) {
            if (!task.name || !task.command) {
                logger.error('Each task must have a "name" and "command" field');
                process.exit(1);
            }
            if (task.cwd && !(await fs.pathExists(task.cwd))) {
                logger.warning(`Working directory does not exist for task "${task.name}": ${task.cwd}`);
            }
        }

        // Determine execution mode (CLI options override config file)
        const parallel = options.parallel === true || (config.parallel === true && options.parallel !== false);
        const stopOnError = options.stopOnError !== false && (config.stopOnError !== false || options.stopOnError === true);

        console.log('');
        logger.title('🚀 Running Tasks');
        console.log(chalk.gray(`Total tasks: ${config.tasks.length}`));
        console.log(chalk.gray(`Mode: ${parallel ? 'Parallel' : 'Sequential'}`));
        console.log(chalk.gray(`Stop on error: ${stopOnError ? 'Yes' : 'No'}`));
        console.log('');

        // Execute tasks
        let results;
        if (parallel) {
            results = await executeTasksInParallel(config.tasks, stopOnError);
        } else {
            results = await executeTasksSequentially(config.tasks, stopOnError);
        }

        // Display results
        console.log('');
        logger.title('📊 Task Results');
        console.log(chalk.gray('─'.repeat(60)));

        let successCount = 0;
        let failureCount = 0;

        for (const result of results) {
            const statusIcon = result.success ? chalk.green('✔') : chalk.red('✖');
            const statusText = result.success ? chalk.green('SUCCESS') : chalk.red('FAILED');
            console.log(`${statusIcon} ${chalk.bold(result.name)}: ${statusText}`);

            if (!result.success) {
                failureCount++;
                if (result.error) {
                    console.log(chalk.red(`   Error: ${result.error}`));
                }
            } else {
                successCount++;
            }
        }

        console.log(chalk.gray('─'.repeat(60)));
        console.log('');
        console.log(
            chalk.bold(`Results: ${chalk.green(`${successCount} succeeded`)} / ${chalk.red(`${failureCount} failed`)}`)
        );
        console.log('');

        // Exit with appropriate code
        if (failureCount > 0 && stopOnError) {
            process.exit(1);
        }

    } catch (error) {
        logger.error('Failed to run tasks');
        if (error instanceof Error) {
            console.error(chalk.red(error.message));
        } else {
            console.error(error);
        }
        process.exit(1);
    }
}
