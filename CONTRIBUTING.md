# Contributing to ForgeStack OS

Thank you for your interest in contributing to ForgeStack OS! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- **Add new templates** - Support for additional frameworks, databases, or auth providers
- **Improve existing templates** - Better code quality, security, or features
- **Fix bugs** - Help us squash issues
- **Improve documentation** - Make it easier for others to use ForgeStack OS
- **Share feedback** - Let us know what works and what doesn't

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- TypeScript knowledge

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/halloffame12/forgestack-os
cd forgestack-os

# Install dependencies
npm install

# Run CLI in development mode
cd packages/cli
npm run dev create test-app
```

## 📝 Adding a New Template

### 1. Create Template Files

Add your template files to `packages/templates/`:

```
packages/templates/
├── frontend/
│   └── your-framework/
├── backend/
│   └── your-framework/
├── auth/
│   └── your-provider/
└── database/
    └── your-database/
```

### 2. Add Generator Logic

Create or update a generator in `packages/cli/src/generators/`:

```typescript
// Example: adding a new frontend framework
export async function generateYourFramework(config: StackConfig, frontendDir: string) {
  // Your generation logic here
  await fs.writeFile(...);
}
```

### 3. Update Prompts

Add your option to the prompts in `packages/cli/src/utils/prompts.ts`:

```typescript
{
  type: 'list',
  name: 'frontend',
  message: 'Choose your frontend framework:',
  choices: [
    // ... existing choices
    { name: 'Your Framework', value: 'your-framework' },
  ],
}
```

### 4. Update Validators

Add compatibility checks in `packages/cli/src/utils/validators.ts`:

```typescript
// Check for incompatibilities
if (config.frontend === 'your-framework' && config.backend === 'incompatible') {
  errors.push('Your framework is not compatible with this backend');
}
```

### 5. Add Tests

Create tests for your generator:

```typescript
// packages/cli/src/generators/__tests__/your-generator.test.ts
describe('YourGenerator', () => {
  it('should generate correct files', async () => {
    // Test logic
  });
});
```

### 6. Update Documentation

Update the README and add any framework-specific documentation.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Test CLI generation
npm run dev create test-project
cd test-project
npm install
npm run dev
```

## 📋 Code Style

- Use TypeScript
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

### Linting

```bash
npm run lint
```

## 🔀 Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add support for YourFramework"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Commit Message Convention

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🐛 Reporting Bugs

When reporting bugs, please include:

- ForgeStack OS version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages or logs

## 💡 Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists
- Explain the use case
- Describe the expected behavior
- Consider if it fits ForgeStack OS's philosophy

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

## 📞 Questions?

- Open a GitHub Discussion
- Reach out to [@halloffame12](https://github.com/halloffame12)

Thank you for contributing to ForgeStack OS! 🚀
