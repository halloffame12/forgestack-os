# Development Quick Start

Get started with ForgeStack OS development in 5 minutes.

---

## Prerequisites

- **Node.js**: 20.0.0 or later
- **npm**: 10.0.0 or later
- **Git**: 2.30.0 or later
- **TypeScript**: 5.0.0+ (for IDE support)

Check versions:
```bash
node --version   # v20.11.0+
npm --version    # 10.0.0+
git --version    # 2.30.0+
```

---

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/halloffame12/forgestack-os.git
cd forgestack-os
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all workspaces (cli, landing, docs).

### 3. Build All Packages

```bash
npm run build
```

Output:
```
packages/cli
  ✅ TypeScript compiled (45 files)
  ✅ Type definitions generated
  
packages/landing
  ✅ Vite build complete (2.4MB)
  
packages/docs
  ✅ Documentation compiled
```

### 4. Verify Installation

```bash
# Test CLI locally
node packages/cli/dist/index.js --version
# Output: 0.3.3

# Or use npm link for easier testing
npm link packages/cli
forgestack --version
# Output: 0.3.3
```

---

## Development Workflow

### CLI Development

```bash
# Watch mode (auto-rebuild on changes)
npm run dev -w packages/cli

# In another terminal, test changes
node packages/cli/dist/index.js --help

# Or with npm link
forgestack create test-app
```

### Full Rebuild

```bash
# Build everything
npm run build

# Build specific package
npm run build -w packages/cli
npm run build -w packages/landing

# Clean build (remove dist/)
npm run clean
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run CLI tests only
npm test -w packages/cli

# Watch mode for tests
npm run test:watch

# Coverage report
npm run test:coverage
```

### Linting & Formatting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

---

## Directory Structure

```
forgestack-os/
├── packages/
│   ├── cli/                    # CLI package
│   │   ├── src/
│   │   │   ├── index.ts       # Entry point
│   │   │   ├── commands/      # CLI commands
│   │   │   ├── generators/    # Code generators
│   │   │   ├── utils/         # Utilities
│   │   │   └── types.ts       # Type definitions
│   │   ├── dist/              # Compiled output
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── landing/                # Landing page
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   │
│   └── docs/                   # Documentation site
│       ├── src/
│       └── package.json
│
├── docs/                       # Markdown documentation
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── PLUGIN_DEVELOPMENT.md
│   ├── ENVIRONMENT_GUIDE.md
│   ├── UPGRADE_GUIDE.md
│   └── AI_SETUP.md
│
├── package.json                # Root workspace config
├── tsconfig.base.json          # Shared TypeScript config
└── eslint.config.js            # ESLint configuration
```

---

## Making Changes

### Adding a New Command

```typescript
// packages/cli/src/commands/my-command.ts
import { Command } from 'commander';

export function createMyCommand(program: Command) {
  return program
    .command('my-command')
    .description('My new command')
    .option('--option <value>', 'An option')
    .action(async (options) => {
      console.log('Running my-command...');
      // Implementation
    });
}
```

Add to main CLI:

```typescript
// packages/cli/src/index.ts
import { createMyCommand } from './commands/my-command.js';

// In the main CLI setup
createMyCommand(program);
```

### Adding a New Generator

```typescript
// packages/cli/src/generators/my-feature.ts
import { StackConfig } from '../types.js';

export async function generateMyFeature(config: StackConfig, projectPath: string) {
  // Generate files
  const files = {
    'src/my-feature.ts': `export const myFeature = true;`,
  };

  for (const [path, content] of Object.entries(files)) {
    // Write files
    console.log(`Generated ${path}`);
  }
}
```

Register in index:

```typescript
// packages/cli/src/generators/index.ts
export { generateMyFeature } from './my-feature.js';
```

### Adding Tests

```typescript
// packages/cli/tests/my-command.test.ts
import { describe, it, expect } from 'vitest';

describe('My Command', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

Run: `npm test -w packages/cli`

---

## Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-fix
```

### Make Changes

```bash
# Edit files
npm run dev -w packages/cli
npm test

# Commit with clear message
git add .
git commit -m "feat: add my-feature - description"
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```bash
git commit -m "feat(cli): add stripe integration plugin"
git commit -m "fix(generators): resolve ESM import issues"
git commit -m "docs(readme): update installation steps"
git commit -m "test(validators): add unit tests for email validation"
```

### Push & Create PR

```bash
git push origin feature/my-feature

# Open GitHub and create Pull Request
# GitHub will show PR template
```

---

## npm Workspaces Commands

### Install

```bash
npm install                 # Install all
npm install -w packages/cli # Install specific package
```

### Run Scripts

```bash
npm run build               # Run build in all packages
npm run build -w packages/cli  # Run build in specific package

npm run dev                 # Run dev in all packages
npm run dev -w packages/cli    # Run dev in specific package
```

### Add Dependencies

```bash
# Add to all packages (not recommended)
npm install lodash

# Add to specific package
npm install -w packages/cli lodash

# Add dev dependency
npm install -w packages/cli --save-dev @types/lodash
```

---

## Common Development Tasks

### Publish New Version

```bash
# Update version in package.json
npm version patch  # 0.3.3 → 0.3.4
npm version minor  # 0.3.3 → 0.4.0
npm version major  # 0.3.3 → 1.0.0

# Or manually edit package.json then:
npm run build

# Test locally
node packages/cli/dist/index.js --version

# Publish to npm
npm publish

# Push to GitHub
git push origin main
git push --tags
```

### Update Documentation

```bash
# Edit markdown files in ./docs/
# Files are automatically committed

# Update README.md or other docs
git add docs/
git commit -m "docs: update documentation"
git push
```

### Debug CLI

```bash
# Run with debugging
NODE_DEBUG=* node packages/cli/dist/index.js create test-app

# Or use VS Code debugger
# Create .vscode/launch.json:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "ForgeStack CLI",
      "program": "${workspaceFolder}/packages/cli/dist/index.js",
      "args": ["create", "test-app"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

---

## Troubleshooting

### Build fails

```bash
# Clean and rebuild
npm run clean
npm run build

# Or clean specific package
rm -rf packages/cli/dist
npm run build -w packages/cli
```

### Tests fail

```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Run specific test file
npm test -- packages/cli/tests/validators.test.ts

# Update snapshots if expected
npm test -- -u
```

### Dependencies out of date

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Or interactive update
npm update --interactive --legacy-peer-deps
```

### Module not found errors

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Or clear npm cache
npm cache clean --force
npm install
```

---

## Performance Tips

### Faster Development

```bash
# Use watch mode (rebuilds only changed files)
npm run dev -w packages/cli

# Use linked package for instant testing
npm link packages/cli
forgestack create test-app

# Run tests in watch mode
npm run test:watch
```

### Faster Builds

```bash
# Parallel builds (if available)
npm run build -- --parallel

# Single package instead of all
npm run build -w packages/cli
```

---

## IDE Setup

### VS Code

**Recommended Extensions**:
- ESLint
- Prettier
- TypeScript Vue Plugin
- Thunder Client (for API testing)

**settings.json**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript"]
}
```

### WebStorm

**Settings**:
- Enable TypeScript compiler
- ESLint: check `Automatic ESLint configuration`
- Prettier: set as default formatter

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [Contributing Guide](../CONTRIBUTING.md)

---

**Ready to code? Check out the [Architecture Guide](./ARCHITECTURE.md) for deeper context!**
