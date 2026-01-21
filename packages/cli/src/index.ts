#!/usr/bin/env node

import { createRequire } from 'module';
import { Command } from 'commander';

import { createCommand } from './commands/create.js';
import { organizeCommand } from './commands/organize.js';
import { runTasksCommand } from './commands/run-tasks.js';

const pkgRequire = createRequire(import.meta.url);
const { version: CLI_VERSION } = pkgRequire('../package.json') as { version: string };

const program = new Command();

program
    .name('forgestack')
    .description('ForgeStack OS - One platform. Any stack. Production-ready.')
    .version(CLI_VERSION);

program
    .command('create <project-name>')
    .description('Create a new full-stack SaaS application')
    .action(createCommand)
    .option('--frontend <framework>', 'Frontend framework')
    .option('--backend <framework>', 'Backend framework')
    .option('--auth <provider>', 'Auth provider')
    .option('--database <db>', 'Database')
    .option('--api <style>', 'API style')
    .option('--preset <name>', 'Use a predefined stack preset')
    .option('--stack <json>', 'Provide full stack config as JSON')
    .option('--docker', 'Include Docker configuration')
    .option('--no-docker', 'Skip Docker configuration')
    .option('--multi-tenant', 'Enable multi-tenancy')
    .option('--skip-install', 'Skip dependency installation')
    .option('--skip-git', 'Skip Git initialization');

program
    .command('organize [folder-path]')
    .description('Organize files by type or date')
    .action(organizeCommand)
    .option('--strategy <type>', 'Organization strategy: type or date')
    .option('--duplicates', 'Move duplicate files to a Duplicates folder');

program
    .command('run-tasks [config-path]')
    .description('Run batch tasks from a JSON config file')
    .action(runTasksCommand)
    .option('--parallel', 'Run tasks in parallel instead of sequentially')
    .option('--stop-on-error', 'Stop execution if any task fails');

program.parse();
