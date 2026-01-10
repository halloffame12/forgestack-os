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
import { generateTRPC, generateGraphQL } from './api';
import { generateRandomSecret } from '../utils/security';
import execa from 'execa';

export async function generateProject(config: StackConfig, targetDir: string) {
    const spinner = logger.spinner('Creating project structure...');

    try {
        // Generate JWT secret if needed
        if (config.auth === 'jwt' || config.apiStyle === 'trpc') {
            config.jwtSecret = generateRandomSecret();
        }

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

        // Generate API Style (tRPC/GraphQL)
        if (config.apiStyle === 'trpc') {
            const trpcSpinner = logger.spinner('Integrating tRPC...');
            await generateTRPC(config, backendDir, frontendDir);
            trpcSpinner.succeed('tRPC integrated');
        } else if (config.apiStyle === 'graphql') {
            const gqlSpinner = logger.spinner('Integrating GraphQL...');
            await generateGraphQL(config, backendDir);
            gqlSpinner.succeed('GraphQL integrated');
        }

        // Generate Docker configuration if requested
        if (config.docker) {
            const dockerSpinner = logger.spinner('Generating Docker configuration...');
            await generateDocker(config, targetDir);
            dockerSpinner.succeed('Docker configuration generated');
        }

        // Initialize Git
        if (!config.skipGit) {
            const gitSpinner = logger.spinner('Initializing Git repository...');
            try {
                await execa('git', ['init'], { cwd: targetDir });
                gitSpinner.succeed('Git repository initialized');
            } catch {
                gitSpinner.warn('Failed to initialize Git repository');
            }
        }

        // Install dependencies
        if (!config.skipInstall) {
            const installSpinner = logger.spinner('Installing dependencies (this may take a few minutes)...');
            try {
                // Using npm install at root (for workspaces)
                await execa('npm', ['install'], { cwd: targetDir });
                installSpinner.succeed('Dependencies installed');
            } catch {
                installSpinner.warn('Failed to install dependencies. You may need to run "npm install" manually.');
            }
        }

    } catch (error) {
        spinner.fail('Failed to generate project');
        throw error;
    }
}
