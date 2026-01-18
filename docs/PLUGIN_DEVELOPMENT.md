# Plugin Development Guide

Learn how to build plugins that extend ForgeStack OS with custom functionality, third-party integrations, and specialized scaffolding.

---

## Quick Start

### 1. Create Your Plugin

```bash
mkdir -p ~/.forgestack/plugins/my-plugin
cd ~/.forgestack/plugins/my-plugin
npm init -y
npm install forgestack-os-plugin-sdk@latest
```

### 2. Create Plugin Entry File

```typescript
// ~/.forgestack/plugins/my-plugin/index.ts
import { Plugin } from "forgestack-os-plugin-sdk";

export default {
  name: "my-plugin",
  version: "1.0.0",
  description: "My custom plugin",

  hooks: {
    async afterGenerate(ctx) {
      console.log("✨ Custom setup complete!");
      ctx.addFile("custom-file.ts", "export const custom = true;");
    },
  },
} as Plugin;
```

### 3. Install Your Plugin

```bash
forgestack plugin add ~/.forgestack/plugins/my-plugin
```

### 4. Use Your Plugin

```bash
forgestack create my-app --plugins=my-plugin
```

---

## Plugin Structure

```
my-plugin/
├── package.json
├── index.ts              # Plugin entry
├── src/
│   ├── hooks/            # Hook implementations
│   │   ├── before-generate.ts
│   │   ├── after-generate.ts
│   │   ├── before-install.ts
│   │   └── after-install.ts
│   │
│   ├── patchers/         # AST-based patchers
│   │   ├── json-patches.ts
│   │   ├── code-patches.ts
│   │   └── yaml-patches.ts
│   │
│   ├── templates/        # Files to add
│   │   ├── api-client.ts
│   │   ├── service.ts
│   │   └── types.ts
│   │
│   └── config.ts         # Plugin configuration schema
│
├── tests/
│   └── plugin.test.ts
│
└── README.md
```

---

## Plugin Interface

```typescript
interface Plugin {
  // Identity
  name: string;
  version: string;
  description: string;
  author?: string;
  license?: string;

  // Configuration
  config?: PluginConfig;

  // Hooks (all optional)
  hooks?: {
    beforeGenerate?: (ctx: GenerateContext) => Promise<void>;
    afterGenerate?: (ctx: GenerateContext) => Promise<void>;
    beforeInstall?: (ctx: InstallContext) => Promise<void>;
    afterInstall?: (ctx: InstallContext) => Promise<void>;
  };

  // File management
  files?: Record<string, string>; // Files to add
  patches?: {
    json?: JsonPatch[];
    code?: CodePatch[];
    yaml?: YamlPatch[];
  };

  // Environment variables
  env?: Record<string, EnvVar>;

  // Documentation
  docs?: string;
}
```

---

## Context Objects

### GenerateContext

```typescript
interface GenerateContext {
  // Project info
  config: StackConfig;
  projectPath: string;
  projectName: string;

  // Current state
  manifest: FileManifest;
  files: Map<string, string>;

  // Operations
  addFile(path: string, content: string): void;
  removeFile(path: string): void;
  patchFile(path: string, patch: Patch): void;
  addEnv(key: string, value: string): void;

  // Utilities
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

interface InstallContext extends GenerateContext {
  // Install-specific operations
  runCommand(cmd: string, cwd?: string): Promise<void>;
  installDependency(name: string, version?: string): Promise<void>;
}
```

---

## Hook Lifecycle

```
1. beforeGenerate
   ├─ Modify config before generation
   ├─ Validate stack compatibility
   └─ Prepare dependencies
           ↓
2. Generate Core Files
   ├─ Frontend
   ├─ Backend
   ├─ Database setup
   └─ Auth scaffold
           ↓
3. afterGenerate
   ├─ Add custom files
   ├─ Patch configurations (AST)
   ├─ Add environment variables
   └─ Update manifest
           ↓
4. beforeInstall
   ├─ Prepare installation
   ├─ Validate system requirements
   └─ Pre-install checks
           ↓
5. Install Dependencies
   ├─ npm install (or equivalent)
   └─ Initialize Git
           ↓
6. afterInstall
   ├─ Post-install setup
   ├─ Database migrations
   ├─ Generate API docs
   └─ Show next steps
```

---

## Example: Stripe Payment Integration Plugin

```typescript
// ~/.forgestack/plugins/payments-stripe/index.ts
import { Plugin, GenerateContext } from "forgestack-os-plugin-sdk";

export default {
  name: "payments-stripe",
  version: "1.0.0",
  description: "Add Stripe payment processing",

  config: {
    schema: {
      type: "object",
      properties: {
        apiVersion: {
          type: "string",
          default: "v1",
          description: "Stripe API version",
        },
      },
    },
  },

  env: {
    STRIPE_PUBLISHABLE_KEY: {
      required: false,
      description: "Stripe publishable key for browser",
    },
    STRIPE_SECRET_KEY: {
      required: false,
      description: "Stripe secret key (keep private)",
    },
    STRIPE_WEBHOOK_SECRET: {
      required: false,
      description: "Webhook endpoint secret",
    },
  },

  hooks: {
    async afterGenerate(ctx: GenerateContext) {
      // Add Stripe files
      ctx.addFile(
        "src/lib/stripe.ts",
        `import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
`
      );

      // Add payment API routes
      ctx.addFile(
        "src/routes/payments.ts",
        `import { Router } from 'express';
import { stripe } from '@/lib/stripe';

const router = Router();

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

export default router;
`
      );

      // Add types
      ctx.addFile(
        "src/types/stripe.ts",
        `export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method';
}
`
      );

      // Patch backend main file
      ctx.patchFile("src/index.ts", {
        type: "code",
        pattern: "import { createServer } from 'http';",
        replacement: `import { createServer } from 'http';
import paymentsRouter from './routes/payments';`,
      });

      ctx.patchFile("src/index.ts", {
        type: "code",
        pattern: "app.use(routes)",
        replacement: `app.use('/api/payments', paymentsRouter);
app.use(routes)`,
      });

      // Add frontend hook
      ctx.addFile(
        "frontend/src/hooks/useStripe.ts",
        `import { loadStripe } from '@stripe/js';
import { useMemo } from 'react';

export function useStripe() {
  const stripe = useMemo(() => {
    return loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  return stripe;
}
`
      );

      ctx.log("💳 Stripe integration added!");
    },

    async beforeInstall(ctx) {
      // Install Stripe dependencies
      await ctx.installDependency("stripe", "latest");
      await ctx.installDependency("@stripe/js", "latest");
    },

    async afterInstall(ctx) {
      ctx.log("📚 Stripe docs: https://stripe.com/docs");
    },
  },
} as Plugin;
```

---

## AST-Based Patching

### JSON Patching

```typescript
// Patch tsconfig.json
ctx.patchFile("tsconfig.json", {
  type: "json",
  operations: [
    {
      op: "add",
      path: "/compilerOptions/strictNullChecks",
      value: true,
    },
    {
      op: "add",
      path: "/include/-",
      value: "stripe-config.ts",
    },
  ],
});
```

### Code (JS/TS) Patching

```typescript
// Add import
ctx.patchFile("src/index.ts", {
  type: "code",
  pattern: "import { express } from 'express';",
  replacement: `import { express } from 'express';
import { setupStripe } from '@/lib/stripe';`,
});

// Add function call
ctx.patchFile("src/index.ts", {
  type: "code",
  pattern: "app.listen(port)",
  replacement: `setupStripe(app);
app.listen(port)`,
});
```

### YAML Patching

```typescript
// Patch docker-compose.yml
ctx.patchFile("docker-compose.yml", {
  type: "yaml",
  operations: [
    {
      op: "add",
      path: "/services/stripe-webhook",
      value: {
        image: "stripe/stripe-cli:latest",
        command: ["listen", "--api-key", "${STRIPE_SECRET_KEY}"],
      },
    },
  ],
});
```

---

## Plugin Configuration

Plugins can accept user configuration via `--plugin-config`:

```bash
forgestack create my-app \
  --plugins=payments-stripe \
  --plugin-config=payments-stripe.apiVersion=v2
```

Define schema in plugin:

```typescript
export default {
  name: "payments-stripe",

  config: {
    schema: z.object({
      apiVersion: z.enum(["v1", "v2"]).default("v1"),
      webhookVersion: z.enum(["v1", "v2"]).default("v1"),
    }),

    async validate(config) {
      // Custom validation logic
      if (config.apiVersion === "v2") {
        console.warn("v2 is experimental");
      }
    },
  },
} as Plugin;
```

---

## Built-in Plugins

### payments-stripe

- Stripe payment integration
- Payment intents, webhooks, customer portal

### analytics-posthog

- PostHog analytics setup
- Event tracking, feature flags

### monitoring-sentry

- Sentry error tracking
- Release tracking, performance monitoring

### email-resend

- Resend email service integration
- Email templates, sending

### observability-datadog

- Datadog integration
- Metrics, logs, APM

---

## Plugin Publishing

### 1. Prepare Plugin

```json
{
  "name": "@forgestack/plugin-my-plugin",
  "version": "1.0.0",
  "description": "My ForgeStack plugin",
  "forgestack": {
    "category": "integration",
    "tags": ["payment", "stripe"],
    "compatible": ["v0.4.0+"]
  }
}
```

### 2. Publish to npm

```bash
npm publish --registry https://registry.npmjs.org
```

### 3. Submit to Registry

Create issue on GitHub with plugin details.

### 4. Discovery

```bash
forgestack plugin search payment
forgestack plugin search @forgestack/plugin-*
```

---

## Testing Plugins

### Unit Tests

```typescript
// tests/plugin.test.ts
import { describe, it, expect } from "vitest";
import plugin from "../index";

describe("Payments Stripe Plugin", () => {
  it("should add Stripe files", async () => {
    const ctx = createMockContext();
    await plugin.hooks?.afterGenerate?.(ctx);

    expect(ctx.fileAdded("src/lib/stripe.ts")).toBe(true);
  });

  it("should add environment variables", () => {
    expect(plugin.env?.STRIPE_SECRET_KEY).toBeDefined();
  });
});
```

### Integration Tests

```bash
forgestack create test-app --plugins=my-plugin
cd test-app
npm run build
npm test
```

---

## Plugin Best Practices

✅ **Do**:

- Make plugins focused and single-purpose
- Document all environment variables
- Provide example configuration
- Test with multiple stack combinations
- Add descriptive error messages
- Version your plugin properly
- Handle optional dependencies gracefully

❌ **Don't**:

- Call external APIs during generation
- Require paid services without opt-in
- Modify user code without `ctx` operations
- Store credentials in generated code
- Use relative imports outside plugin
- Break on stack mismatches; warn instead

---

## Troubleshooting

### Plugin not loading

```bash
forgestack plugin list
forgestack plugin add /path/to/plugin --verbose
```

### Patching errors

Ensure your patterns match exactly:

```typescript
// ✅ Correct - exact match
ctx.patchFile("src/index.ts", {
  pattern: "app.listen(port, () => {",
  replacement: "setupStripe(); app.listen(port, () => {",
});

// ❌ Wrong - won't match whitespace differences
ctx.patchFile("src/index.ts", {
  pattern: "app.listen(port,()=>{",
  replacement: "setupStripe(); app.listen(port, () => {",
});
```

### Environment variables not showing

Check that they're in plugin.env:

```typescript
env: {
  MY_VAR: {
    required: true,
    description: 'My variable',
  },
}
```

---

## Resources

- [Contribution Guidelines](../CONTRIBUTING.md)
- [Architecture](./ARCHITECTURE.md)
- [API Reference](https://github.com/halloffame12/forgestack-os/wiki/Plugin-API)
- [Examples](https://github.com/halloffame12/forgestack-os/tree/main/packages/cli/src/plugins/built-in)

---

**Happy building! 🚀**
