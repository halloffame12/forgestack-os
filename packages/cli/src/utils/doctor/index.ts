/**
 * Doctor utility module exports
 * 
 * This module provides modular health check utilities for validating
 * development environment and project setup.
 */

export * from './types.js';
export { runNodeChecks, checkNodeVersion, checkNpmVersion, checkPnpmVersion } from './check-node.js';
export { checkEnvVariables, generateMissingEnvReport } from './check-env.js';
export { checkDatabaseConnection } from './check-database.js';
export { runPrismaChecks } from './check-prisma.js';
export { runDockerChecks } from './check-docker.js';
export { checkPortAvailability, checkAppPorts } from './check-ports.js';
export { runLintChecks } from './check-lint.js';
