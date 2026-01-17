# Environment & Configuration Guide

Learn how ForgeStack OS manages environment variables, configuration, and multi-environment setups with Zod validation.

---

## Overview

ForgeStack OS provides:
- **Zod-based validation** for type-safe environment configuration
- **Multi-environment support** (.env, .env.local, .env.production, etc.)
- **Automatic schema generation** based on usage
- **CLI environment injection** for local development
- **Runtime validation** with helpful error messages

---

## Quick Start

### 1. Define Environment Schema

```typescript
// src/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_LOG: z.boolean().default(false),
  
  // Auth
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  
  // API Keys (optional for local dev)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    result.error.issues.forEach(issue => {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }
  
  return result.data;
}

export const env = validateEnv();
```

### 2. Create .env File

```bash
# .env - Shared defaults
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost/myapp
JWT_SECRET=super-secret-key-at-least-32-characters-long
SESSION_SECRET=another-secret-key-at-least-32-characters
```

### 3. Use in Application

```typescript
import { env } from '@/env';

const app = express();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
```

---

## File Structure

```
my-app/
├── .env                  # Committed - shared defaults
├── .env.local           # Git-ignored - local overrides
├── .env.production      # Git-ignored - production config
├── .env.staging        # Git-ignored - staging config
├── .env.example         # Committed - documentation
├── .env.schema.json    # Auto-generated - schema reference
└── src/
    └── env.ts          # Validation logic
```

---

## Environment Files

### .env (Committed)

```bash
# Backend App Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://localhost/myapp_dev
DATABASE_LOG=false

# Security
JWT_SECRET=dev-secret-key-32-chars-minimum-length
SESSION_SECRET=dev-session-key-32-chars-minimum

# Optional Services (use local dev keys)
STRIPE_PUBLISHABLE_KEY=pk_test_...
ANALYTICS_ID=test-id
```

### .env.local (Git-ignored - Local Dev)

```bash
# Override defaults for your machine
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost/myapp_dev
JWT_SECRET=your-actual-local-secret-key-here
SESSION_SECRET=your-local-session-secret
STRIPE_SECRET_KEY=sk_test_...
DEBUG=app:*
```

### .env.production (Git-ignored - CI/CD only)

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://prod-user:password@prod-db.example.com/myapp
JWT_SECRET=${VAULT_JWT_SECRET}
SESSION_SECRET=${VAULT_SESSION_SECRET}
STRIPE_SECRET_KEY=${VAULT_STRIPE_SECRET}
LOG_LEVEL=warn
SENTRY_DSN=https://...
```

### .env.example (Committed - Documentation)

```bash
# Copy this file to .env and fill in your values

# Backend App Configuration
# Describes the Node environment (development, production, test)
NODE_ENV=development

# Port for the backend server to listen on (default: 3000)
PORT=3000

# Logging level (debug, info, warn, error)
LOG_LEVEL=info

# Database Configuration
# PostgreSQL connection string (format: postgresql://user:password@host:port/database)
DATABASE_URL=postgresql://localhost/myapp_dev

# Whether to log database queries (useful for debugging)
DATABASE_LOG=false

# Security Keys
# JWT signing secret (minimum 32 characters for HS256)
JWT_SECRET=your-jwt-secret-at-least-32-characters-long

# Session encryption secret (minimum 32 characters)
SESSION_SECRET=your-session-secret-at-least-32-chars

# Payment Processing (Optional)
# Stripe keys for payment processing
# Get from: https://dashboard.stripe.com/keys
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Analytics (Optional)
# PostHog project ID and key for analytics
POSTHOG_API_KEY=your-posthog-api-key
```

---

## Zod Schema Definition

### Basic Schema

```typescript
import { z } from 'zod';

export const envSchema = z.object({
  // String with format validation
  DATABASE_URL: z.string().url('Must be a valid URL'),
  
  // Number with coercion
  PORT: z.coerce.number().int().min(1).max(65535),
  
  // Enum
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // Boolean with coercion
  DEBUG: z.coerce.boolean().default('false'),
  
  // Optional fields
  API_KEY: z.string().optional(),
  
  // With defaults
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Complex validation
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .max(256)
    .regex(/^[A-Za-z0-9_-]+$/, 'JWT_SECRET must only contain alphanumeric, underscore, and dash'),
});
```

### Conditional Validation

```typescript
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().optional(),
}).refine(
  (env) => {
    // In production, Stripe must be configured
    if (env.NODE_ENV === 'production' && !env.STRIPE_SECRET_KEY) {
      return false;
    }
    return true;
  },
  {
    message: 'STRIPE_SECRET_KEY is required in production',
    path: ['STRIPE_SECRET_KEY'],
  }
);
```

### Custom Validation

```typescript
const customEnvSchema = envSchema.extend({
  POSTGRES_PASSWORD: z.string()
    .min(12, 'Database password must be at least 12 characters')
    .refine(
      (pwd) => /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
      'Password must contain uppercase and numbers'
    ),
});
```

---

## Multi-Environment Setup

### Development

```typescript
// src/env.ts
import dotenv from 'dotenv';
import path from 'path';

// Load from .env and .env.local
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

export const env = validateEnv();
```

### Production (with CI/CD)

```bash
# docker-compose.prod.yml
services:
  app:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    build:
      context: .
```

### Testing

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://localhost/test_db',
      JWT_SECRET: 'test-secret-minimum-32-chars!',
      SESSION_SECRET: 'test-session-minimum-32-chars',
    },
  },
});
```

---

## Frontend Environment Variables

```typescript
// frontend/src/env.ts
const envSchema = z.object({
  // Only variables prefixed with VITE_ are exposed to browser
  VITE_API_URL: z.string().url(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_ANALYTICS_ID: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```typescript
// frontend/src/api/client.ts
import { env } from '@/env';

export const api = axios.create({
  baseURL: env.VITE_API_URL,
});
```

---

## Auto-Generated Schema Documentation

ForgeStack generates `.env.schema.json` with full documentation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "NODE_ENV": {
      "type": "string",
      "enum": ["development", "production", "test"],
      "default": "development",
      "description": "Node runtime environment"
    },
    "PORT": {
      "type": "number",
      "default": 3000,
      "minimum": 1,
      "maximum": 65535,
      "description": "Backend server port"
    },
    "DATABASE_URL": {
      "type": "string",
      "format": "uri",
      "description": "PostgreSQL connection string",
      "examples": ["postgresql://user:pass@localhost/dbname"]
    },
    "JWT_SECRET": {
      "type": "string",
      "minLength": 32,
      "description": "JWT signing secret (minimum 32 characters)"
    }
  },
  "required": ["DATABASE_URL", "JWT_SECRET", "SESSION_SECRET"]
}
```

---

## CLI Environment Injection

### Via forgestack create

```bash
# Set environment for generation
forgestack create my-app \
  --env NODE_ENV=production \
  --env PORT=8080 \
  --env-file ./prod.env
```

### Via environment file

```bash
# forgestack.config.ts
export default {
  envFile: '.env.production',
  templates: 'templates/',
};
```

---

## Validation Best Practices

### ✅ Good

```typescript
// 1. Validate at startup
const env = validateEnv();

// 2. Use typed imports
import type { Env } from '@/env';

// 3. Provide helpful defaults
DATABASE_LOG: z.boolean().default(false),

// 4. Validate format early
JWT_SECRET: z.string().min(32),

// 5. Document in .env.example
// JWT_SECRET=your-secret-here (32+ chars)
```

### ❌ Bad

```typescript
// 1. Don't read process.env directly
const port = process.env.PORT;  // ❌ No validation

// 2. Don't allow invalid values to propagate
const jwtSecret = process.env.JWT_SECRET || 'short';  // ❌ Bad default

// 3. Don't validate inside functions
function createServer() {
  const port = z.coerce.number().parse(process.env.PORT);  // ❌ Do at startup
}
```

---

## Secret Management

### Local Development

```bash
# .env.local (Git-ignored)
# Store local development secrets here
STRIPE_SECRET_KEY=sk_test_abc123...
API_KEY=local-dev-key...
```

### Production (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        env:
          NODE_ENV: production
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: npm run build && npm run deploy
```

### Vault Integration

```typescript
// src/env.ts
import { getSecret } from '@hashicorp/vault-api';

async function loadSecrets() {
  const jwtSecret = process.env.JWT_SECRET ||
    await getSecret('secret/jwt_secret');
  
  return {
    JWT_SECRET: jwtSecret,
    // ...
  };
}
```

---

## Common Patterns

### Feature Flags

```typescript
const env = z.object({
  FEATURE_NEW_UI: z.coerce.boolean().default('false'),
  FEATURE_BETA_API: z.coerce.boolean().default('false'),
});

if (env.FEATURE_NEW_UI) {
  app.use(newUIMiddleware);
}
```

### Rate Limiting

```typescript
const env = z.object({
  RATE_LIMIT_REQUESTS: z.coerce.number().default('100'),
  RATE_LIMIT_WINDOW: z.coerce.number().default('60'),  // seconds
});

limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW * 1000,
  max: env.RATE_LIMIT_REQUESTS,
});
```

### Logging

```typescript
const env = z.object({
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('pretty'),
});

logger.level = env.LOG_LEVEL;
```

---

## Troubleshooting

### Variables not loading

```bash
# Check .env file exists and is readable
ls -la .env .env.local

# Verify format
cat .env | grep DATABASE_URL

# Test in Node
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

### Validation errors

```
❌ Invalid environment configuration:
  JWT_SECRET: String must contain at least 32 character(s)
  DATABASE_URL: Invalid url
```

Solutions:
1. Check `.env` and `.env.local` files
2. Ensure values meet validation requirements
3. Run `node -e "console.log(process.env)"` to debug

### Variables exposed to browser

Only variables prefixed with `VITE_` (Vue/Vite) are exposed:

```bash
# ✅ Exposed (frontend can see)
VITE_API_URL=http://localhost:3000

# ❌ Not exposed (frontend cannot see)
DATABASE_URL=postgresql://...
JWT_SECRET=secret...
```

---

## Resources

- [Zod Documentation](https://zod.dev)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [12 Factor App - Config](https://12factor.net/config)

---

**Next**: [Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)
