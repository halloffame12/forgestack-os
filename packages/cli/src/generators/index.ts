import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types';
import { logger } from '../utils/logger';
import { generateFrontend } from './frontend';
import { generateBackend } from './backend';
import { generateDatabase } from './database';
import { generateAuth } from './auth';
import { generateDocker } from './docker';
import { generateCommon } from './common';

export async function generateProject(config: StackConfig, targetDir: string) {
    const spinner = logger.spinner('Creating project structure...');

    try {
        // Create project directory
        await fs.ensureDir(targetDir);

        // Create subdirectories
        const frontendDir = path.join(targetDir, 'frontend');
        const backendDir = path.join(targetDir, 'backend');

        await fs.ensureDir(frontendDir);
        await fs.ensureDir(backendDir);

        spinner.succeed('Project structure created');

        // Generate common files (root package.json, README, .gitignore, etc.)
        const commonSpinner = logger.spinner('Generating common files...');
        await generateCommon(config, targetDir);
        commonSpinner.succeed('Common files generated');

        // Generate frontend
        const frontendSpinner = logger.spinner(`Generating ${config.frontend} frontend...`);
        await generateFrontend(config, frontendDir);
        frontendSpinner.succeed('Frontend generated');

        // Generate backend
        const backendSpinner = logger.spinner(`Generating ${config.backend} backend...`);
        await generateBackend(config, backendDir);
        backendSpinner.succeed('Backend generated');

        // Generate database setup
        const dbSpinner = logger.spinner(`Setting up ${config.database} database...`);
        await generateDatabase(config, backendDir);
        dbSpinner.succeed('Database setup complete');

        // Generate auth integration
        const authSpinner = logger.spinner(`Integrating ${config.auth} authentication...`);
        await generateAuth(config, frontendDir, backendDir);
        authSpinner.succeed('Authentication integrated');

        // Generate Docker configuration if requested
        if (config.docker) {
            const dockerSpinner = logger.spinner('Generating Docker configuration...');
            await generateDocker(config, targetDir);
            dockerSpinner.succeed('Docker configuration generated');
        }

    } catch (error) {
        spinner.fail('Failed to generate project');
        throw error;
    }
}
