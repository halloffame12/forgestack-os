# ForgeStack OS Architecture

## System Design Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ForgeStack OS CLI                           │
│  100% Offline | Zero Cost | Production Ready                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼────┐ ┌─────▼────┐ ┌────▼──────┐
        │  Generator │ │  Plugin  │ │ Upgrade  │
        │  Engine    │ │  System  │ │ Engine   │
        └────────────┘ └──────────┘ └──────────┘
                │             │             │
        ┌───────▼─────────────┼─────────────▼─────┐
        │                                         │
    ┌───▼──────┐  ┌─────────┐  ┌──────────┐   ┌─▼────────┐
    │ Manifest │  │ Presets │  │ AI       │   │ CI/CD    │
    │ Tracker  │  │ System  │  │ (Local)  │   │ Templates│
    └──────────┘  └─────────┘  └──────────┘   └──────────┘
```

---

## Folder Structure (Target v1.0)

```
forgestack-os/
├── packages/
│   ├── cli/
│   │   ├── src/
│   │   │   ├── core/
│   │   │   │   ├── deterministic.ts      # Reproducibility engine
│   │   │   │   ├── manifest.ts           # File tracking
│   │   │   │   └── validator.ts          # Config validation
│   │   │   │
│   │   │   ├── generators/
│   │   │   │   ├── frontend-*.ts         # React, Vue, Svelte, Next.js
│   │   │   │   ├── backend-*.ts          # Express, NestJS, Fastify, Go, Rust
│   │   │   │   ├── auth-*.ts             # Auth providers
│   │   │   │   ├── database-*.ts         # DB drivers
│   │   │   │   ├── env-schema.ts         # Zod env validation
│   │   │   │   ├── ci-*.ts               # CI/CD pipelines
│   │   │   │   └── docker.ts             # Docker templates
│   │   │   │
│   │   │   ├── plugins/
│   │   │   │   ├── plugin-system.ts      # Core plugin engine
│   │   │   │   ├── hooks.ts              # Plugin hooks
│   │   │   │   ├── loader.ts             # Plugin discovery & loading
│   │   │   │   ├── patchers/
│   │   │   │   │   ├── json-patcher.ts   # JSON AST patching
│   │   │   │   │   ├── code-patcher.ts   # JS/TS AST patching
│   │   │   │   │   └── yaml-patcher.ts   # YAML patching
│   │   │   │   └── built-in/
│   │   │   │       ├── stripe.ts
│   │   │   │       ├── posthog.ts
│   │   │   │       ├── sentry.ts
│   │   │   │       ├── resend.ts
│   │   │   │       └── datadog.ts
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── local-ai-client.ts    # Local model interface
│   │   │   │   ├── providers/
│   │   │   │   │   ├── ollama.ts
│   │   │   │   │   ├── lm-studio.ts
│   │   │   │   │   └── localai.ts
│   │   │   │   └── prompts/
│   │   │   │       ├── module-generation.ts
│   │   │   │       ├── explanation.ts
│   │   │   │       └── security-review.ts
│   │   │   │
│   │   │   ├── upgrade/
│   │   │   │   ├── file-tracker.ts       # Track file changes
│   │   │   │   ├── change-detector.ts    # Detect modifications
│   │   │   │   └── upgrade-engine.ts     # Merge & upgrade logic
│   │   │   │
│   │   │   ├── presets/
│   │   │   │   ├── preset-validator.ts
│   │   │   │   ├── saas-standard/
│   │   │   │   │   ├── config.json
│   │   │   │   │   └── hooks.ts
│   │   │   │   ├── startup-mvp/
│   │   │   │   ├── enterprise/
│   │   │   │   ├── api-first/
│   │   │   │   └── monorepo/
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── progress.ts           # Progress bars
│   │   │   │   ├── prompts.ts            # Interactive prompts
│   │   │   │   ├── help.ts               # Help system
│   │   │   │   └── errors.ts             # Error formatting
│   │   │   │
│   │   │   ├── commands/
│   │   │   │   ├── create.ts             # Main create command
│   │   │   │   ├── plugin.ts             # Plugin management
│   │   │   │   ├── upgrade.ts            # Upgrade command
│   │   │   │   ├── ai.ts                 # AI commands
│   │   │   │   ├── docs.ts               # Local docs server
│   │   │   │   └── init-guide.ts         # Interactive tutorial
│   │   │   │
│   │   │   ├── templates/                # Code templates
│   │   │   │   ├── .env.example
│   │   │   │   ├── env-validator.ts      # Runtime validation
│   │   │   │   ├── docker-compose.yml
│   │   │   │   ├── .github/workflows/
│   │   │   │   └── nginx.conf.template
│   │   │   │
│   │   │   ├── types.ts                  # Shared types
│   │   │   └── index.ts                  # CLI entry
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/                     # Unit tests
│   │   │   ├── integration/              # Integration tests
│   │   │   ├── e2e/                      # End-to-end tests
│   │   │   └── fixtures/                 # Test data
│   │   │
│   │   └── package.json
│   │
│   ├── landing/                           # Public landing page
│   └── docs/                              # Generated documentation
│
├── docs/
│   ├── ARCHITECTURE.md                    # (This file)
│   ├── ROADMAP.md
│   ├── PLUGIN_DEVELOPMENT.md
│   ├── UPGRADE_GUIDE.md
│   ├── TROUBLESHOOTING.md
│   └── AI_SETUP.md
│
├── CONTRIBUTING.md
├── SECURITY.md
├── .forgestack/                           # ForgeStack metadata
│   ├── file-map.json                      # Track generated files
│   └── manifest.json                      # Project manifest
│
└── .npmrc
```

---

## Key Components

### 1. **Deterministic Generation Engine**

```typescript
// packages/cli/src/core/deterministic.ts
interface DeterministicConfig {
  seed?: string;           // For reproducible generation
  skipNetwork: true;       // Always true - offline only
  version: string;         // ForgeStack version
  timestamp: number;       // Generation time
}

class DeterministicGenerator {
  async generate(config: DeterministicConfig): Promise<void> {
    // 1. Hash config to generate seed if needed
    // 2. Generate all files with deterministic ordering
    // 3. Create manifest with file hashes
    // 4. Save .forgestack/manifest.json
  }
}
```

### 2. **Manifest Tracking System**

```typescript
// packages/cli/src/core/manifest.ts
interface FileManifest {
  version: string;
  generatedAt: number;
  forgeStackVersion: string;
  files: {
    [path: string]: {
      hash: string;                    // SHA256 of file content
      generatedBy: string;             // Generator name
      userModified?: boolean;          // Detected by change detector
      canUpgrade: boolean;             // Safe to upgrade?
    }
  };
  plugins: {
    [name: string]: {
      version: string;
      files: string[];                 // Files added by plugin
    }
  };
  env: {
    schema: Record<string, any>;       // Zod schema
    variables: string[];               // Env var names
  };
}
```

### 3. **Plugin System Architecture**

```typescript
// packages/cli/src/plugins/plugin-system.ts
interface Plugin {
  name: string;
  version: string;
  hooks: {
    beforeGenerate?: (ctx: GenerateContext) => Promise<void>;
    afterGenerate?: (ctx: GenerateContext) => Promise<void>;
    beforeInstall?: (ctx: InstallContext) => Promise<void>;
    afterInstall?: (ctx: InstallContext) => Promise<void>;
  };
  patchers?: {
    json?: JsonPatcher[];
    code?: CodePatcher[];
    yaml?: YamlPatcher[];
  };
  addFiles?: Record<string, string>;   // Files to add
  env?: Record<string, string>;         // Env vars to add
}

interface GenerateContext {
  config: StackConfig;
  projectPath: string;
  manifest: FileManifest;
  addFile: (path: string, content: string) => void;
  patchFile: (path: string, patch: Patch) => void;
}
```

### 4. **Environment Validation with Zod**

```typescript
// packages/cli/src/generators/env-schema.ts
import { z } from 'zod';

// Shared schema used by both frontend and backend
export const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().describe('PostgreSQL connection string'),
  
  // Auth
  AUTH_SECRET: z.string().min(32).describe('Session secret key'),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  
  // API
  API_BASE_URL: z.string().url(),
  
  // Third-party
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
});

// Generated at runtime in app startup
// Both frontend and backend use same schema
```

### 5. **Upgrade Engine**

```typescript
// packages/cli/src/upgrade/upgrade-engine.ts
class UpgradeEngine {
  async detectChanges(): Promise<FileChange[]> {
    // 1. Load old manifest
    // 2. Compare current files with hashes
    // 3. Detect user modifications
    // 4. Return list of changes
  }

  async planUpgrade(): Promise<UpgradePlan> {
    // 1. Load new generator code
    // 2. Generate new files in temp dir
    // 3. Compare old vs new
    // 4. Determine merge strategy per file
    // 5. Show diff to user
  }

  async applyUpgrade(plan: UpgradePlan): Promise<void> {
    // 1. Backup original files
    // 2. Apply changes file by file
    // 3. Run user's install scripts
    // 4. Verify project still builds
    // 5. On error: rollback
  }
}
```

### 6. **Local AI Integration**

```typescript
// packages/cli/src/ai/local-ai-client.ts
interface LocalAIProvider {
  name: string;  // 'ollama', 'lm-studio', 'localai'
  baseUrl: string;
  model: string;
  isAvailable(): Promise<boolean>;
  generate(prompt: string): Promise<string>;
}

class LocalAIClient {
  async generateCode(spec: ModuleSpec): Promise<string> {
    // 1. Check local models available
    // 2. Show diff, ask for approval
    // 3. Never auto-apply
    // 4. Audit trail in .forgestack/ai-history.json
  }

  async explainCode(filePath: string): Promise<string> {
    // Read file, ask local model to explain
  }

  async reviewSecurity(): Promise<SecurityReport> {
    // Analyze generated code for security issues
  }
}
```

---

## Data Flow

### Generation Flow
```
User Input
    ↓
Config Validation (Zod)
    ↓
Load Plugins
    ↓
beforeGenerate Hooks
    ↓
Generate Files (Deterministically)
    ↓
Apply Plugin Patches (AST-based)
    ↓
Create Manifest
    ↓
afterGenerate Hooks
    ↓
Install Dependencies
    ↓
beforeInstall Hooks
    ↓
Initialize Git
    ↓
afterInstall Hooks
    ↓
Show Next Steps
```

### Upgrade Flow
```
User runs: forgestack upgrade
    ↓
Load Current Manifest
    ↓
Detect File Changes
    ↓
Generate New Project (temp)
    ↓
Diff Analysis
    ↓
Show Diff Summary
    ↓
User Approval
    ↓
Backup Original
    ↓
Apply Changes
    ↓
Verify Build
    ↓
Update Manifest
```

---

## Design Principles

1. **Offline-First**: Zero external API calls in core functionality
2. **Deterministic**: Same input = Same output (with seed)
3. **Safe**: Never overwrite user code without approval
4. **Modular**: Each feature is independent and pluggable
5. **Type-Safe**: 100% TypeScript with strict mode
6. **User-Controlled**: All AI is optional and local-first
7. **Auditable**: Full trail of generated code and modifications
8. **Backward Compatible**: Old projects can always upgrade safely

---

## Performance Targets

| Operation | Target | Metric |
|-----------|--------|--------|
| Generation | < 30s | Full stack project |
| Upgrade | < 20s | Planning & merge |
| Plugin Load | < 2s | Per plugin |
| AI Generation | < 60s | Per module |

---

## Security Considerations

- ✅ No credentials stored in generated code
- ✅ Environment validation at runtime
- ✅ AST-based patching prevents injection
- ✅ All AI changes reviewed by user
- ✅ Automatic SAST scanning in CI/CD templates
- ✅ Dependabot configured by default

---

## Testing Strategy

| Level | Coverage | Tools |
|-------|----------|-------|
| Unit | 90%+ | Vitest |
| Integration | All stacks | Vitest + Docker |
| E2E | Full flow | Playwright |
| Performance | Benchmarks | Autocannon |
| Security | OWASP | SonarQube, Snyk |

---

## Deployment & Distribution

- **Package**: npm registry
- **Installation**: `npm install -g forgestack-os-cli` or `npx forgestack-os-cli`
- **Updates**: `npm update -g forgestack-os-cli`
- **Offline**: Works completely offline after installation
- **Telemetry**: Optional, user-controlled, fully transparent

---

## Next Steps

See [ROADMAP.md](./ROADMAP.md) for implementation timeline and tasks.
