#!/usr/bin/env node

import { Command } from 'commander';

import { createCommand } from './commands/create';

const program = new Command();

program
    .name('forgestack')
    .description('ForgeStack OS - One platform. Any stack. Production-ready.')
    .version('0.1.0');

program
    .command('create <project-name>')
    .description('Create a new full-stack SaaS application')
    .action(createCommand)
    .option('--frontend <framework>', 'Frontend framework')
    .option('--backend <framework>', 'Backend framework')
    .option('--auth <provider>', 'Auth provider')
    .option('--database <db>', 'Database')
    .option('--api <style>', 'API style')
    .option('--docker', 'Include Docker configuration')
    .option('--no-docker', 'Skip Docker configuration')
    .option('--multi-tenant', 'Enable multi-tenancy');

program.parse();
