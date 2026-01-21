import { execSync } from 'child_process';
import chalk from 'chalk';
import os from 'os';
import { Task } from '../commands/run-tasks.js';

export interface TaskResult {
    name: string;
    success: boolean;
    error?: string;
}

/**
 * Execute a single task
 */
async function executeTask(task: Task): Promise<TaskResult> {
    try {
        console.log(`${chalk.cyan('→')} Running: ${chalk.bold(task.name)}`);

        // Use shell: true for cross-platform command execution
        const options: Record<string, unknown> = {
            stdio: 'pipe',
            encoding: 'utf-8',
            shell: true,
        };

        if (task.cwd) {
            options.cwd = task.cwd;
        }

        // Add shell option for cross-platform compatibility
        if (os.platform() === 'win32') {
            options.shell = 'cmd.exe';
        }

        try {
            execSync(task.command, options);
        } catch (error) {
            // execSync throws on non-zero exit code
            // Extract stderr if available
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Command failed: ${task.command}`);
        }

        console.log(`${chalk.green('✔')} ${task.name} completed`);
        return { name: task.name, success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message.split('\n')[0] : String(error);
        console.log(`${chalk.red('✖')} ${task.name} failed`);
        return { name: task.name, success: false, error: errorMessage };
    }
}

/**
 * Execute tasks sequentially (one after another)
 */
export async function executeTasksSequentially(
    tasks: Task[],
    stopOnError: boolean = true
): Promise<TaskResult[]> {
    const results: TaskResult[] = [];

    for (const task of tasks) {
        console.log('');
        const result = await executeTask(task);
        results.push(result);

        if (!result.success && stopOnError) {
            console.log('');
            console.log(chalk.yellow('⚠ Stopping execution due to task failure'));
            break;
        }
    }

    return results;
}

/**
 * Execute tasks in parallel
 */
export async function executeTasksInParallel(
    tasks: Task[],
    stopOnError: boolean = true
): Promise<TaskResult[]> {
    console.log('');

    const promises = tasks.map(task =>
        executeTask(task)
            .catch(error => ({
                name: task.name,
                success: false,
                error: error instanceof Error ? error.message : String(error),
            }))
    );

    const results = await Promise.all(promises);

    // If stopOnError is true and any task failed, we should note this
    if (stopOnError && results.some(r => !r.success)) {
        console.log('');
        console.log(chalk.yellow('⚠ Some tasks failed during parallel execution'));
    }

    return results;
}

