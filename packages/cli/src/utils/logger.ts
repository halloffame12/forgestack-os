import chalk from 'chalk';
import ora, { Ora } from 'ora';

export const logger = {
    info: (message: string) => {
        console.log(chalk.blue('ℹ'), message);
    },

    success: (message: string) => {
        console.log(chalk.green('✔'), message);
    },

    error: (message: string) => {
        console.log(chalk.red('✖'), message);
    },

    warning: (message: string) => {
        console.log(chalk.yellow('⚠'), message);
    },

    title: (message: string) => {
        console.log(chalk.bold.cyan(`\n${message}\n`));
    },

    spinner: (text: string): Ora => {
        return ora({
            text,
            color: 'cyan',
        }).start();
    },
};
