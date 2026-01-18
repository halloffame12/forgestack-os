# ForgeStack OS Roadmap

**Vision**: Generate production-ready full-stack SaaS applications **100% offline**, with zero cost, using local-first technologies.

---

## Phase 1: Core Offline Generator (v0.4.0) ⚡

**Target**: Q1 2026 | **Status**: In Progress

### 1.1 Deterministic Generation Engine

- [ ] Remove all external API calls from core generation
- [ ] Implement file hashing to ensure reproducible builds
- [ ] Create `.forgestack/manifest.json` tracking all generated files
- [ ] Add `--seed` flag for reproducible generation
- [ ] Unit tests for all generators (target 90% coverage)

**Files**:

- `packages/cli/src/core/deterministic.ts` - Reproducibility engine
- `packages/cli/src/core/manifest.ts` - File tracking
- `packages/cli/tests/generators/*.test.ts` - Generator tests

### 1.2 Extended Stack Support

- [x] Frontend: React + Vite, Next.js 14
- [ ] Frontend: Vue + Vite (Q1 2026)
- [ ] Frontend: SvelteKit (Q1 2026)
- [ ] Backend: Go + Fiber (Q2 2026)
- [ ] Backend: Rust + Actix (Q2 2026)
- [ ] Database: Supabase self-hosted option
- [ ] Add Remix as frontend option

**Files**:

- `packages/cli/src/generators/frontend-vue.ts`
- `packages/cli/src/generators/frontend-svelte.ts`
- `packages/cli/src/generators/backend-go.ts`
- `packages/cli/src/generators/backend-rust.ts`

### 1.3 Environment Validation with Zod

- [ ] Shared `.env.schema.ts` for frontend + backend
- [ ] Runtime validation on app startup (fail-fast)
- [ ] Generate `.env.example` with descriptions
- [ ] Support `.env.local`, `.env.production`, `.env.staging`
- [ ] Type-safe environment access in generated code

**Files**:

- `packages/cli/src/generators/env-schema.ts`
- `packages/cli/src/templates/env-validator.ts`

---

## Phase 2: Plugin System (v0.5.0) 🔌

**Target**: Q2 2026 | **Status**: Planning

### 2.1 Plugin Architecture

- [ ] Plugin interface with hooks: `beforeGenerate`, `afterGenerate`, `beforeInstall`, `afterInstall`
- [ ] Plugin discovery from `~/.forgestack/plugins/`
- [ ] Local plugin development guide
- [ ] Plugin configuration schema validation

**Files**:

- `packages/cli/src/plugins/plugin-system.ts`
- `packages/cli/src/plugins/hooks.ts`
- `packages/cli/src/plugins/loader.ts`

### 2.2 AST-Based File Patching

- [ ] Safe JSON patching (patch `.eslintrc.json`, `tsconfig.json`)
- [ ] Safe JS/TS patching (inject imports, add exports)
- [ ] Safe YAML patching (`docker-compose.yml`)
- [ ] Rollback on patch failure

**Files**:

- `packages/cli/src/plugins/patchers/json-patcher.ts`
- `packages/cli/src/plugins/patchers/code-patcher.ts`
- `packages/cli/src/plugins/patchers/yaml-patcher.ts`

### 2.3 Built-In Plugins

- [ ] `payments-stripe` - Stripe integration scaffold
- [ ] `analytics-posthog` - PostHog event tracking
- [ ] `monitoring-sentry` - Sentry error tracking
- [ ] `email-resend` - Resend email service
- [ ] `observability-datadog` - Datadog integration

**CLI**: `forgestack plugin add payments-stripe`

---

## Phase 3: Presets & Configuration (v0.5.0) 🎯

**Target**: Q2 2026 | **Status**: Planning

### 3.1 Preset System v2

- [ ] `saas-standard` - SaaS best practices, auth + multi-tenancy
- [ ] `startup-mvp` - Minimal viable product, fast iteration
- [ ] `enterprise` - Security hardened, compliance ready
- [ ] `api-first` - Backend-focused, multiple client support
- [ ] `monorepo` - Turborepo/Nx setup with shared packages

**Files**:

- `packages/cli/src/presets/` - Preset definitions
- `packages/cli/src/presets/saas-standard/config.json`
- `packages/cli/src/presets/startup-mvp/config.json`
- `packages/cli/src/presets/enterprise/config.json`

### 3.2 Preset Validation & Locking

- [ ] Lock stack choices per preset
- [ ] Enforce security defaults
- [ ] Validate compatibility (e.g., no Next.js + Express)
- [ ] Show warnings for risky combinations

**Files**:

- `packages/cli/src/presets/preset-validator.ts`

---

## Phase 4: Upgrade Engine (v0.6.0) 🔄

**Target**: Q2-Q3 2026 | **Status**: Planning

### 4.1 File Change Detection

- [ ] Track generated vs. user files in `.forgestack/file-map.json`
- [ ] Hash-based detection of file modifications
- [ ] Show diff summary before upgrade
- [ ] Merge strategy: user changes > generated code

**Files**:

- `packages/cli/src/upgrade/file-tracker.ts`
- `packages/cli/src/upgrade/change-detector.ts`

### 4.2 Safe Upgrade Flow

- [ ] Command: `forgestack upgrade`
- [ ] Show changelog for new version
- [ ] Detect conflicts and ask for resolution
- [ ] Backup original files before upgrade
- [ ] Rollback capability

**Files**:

- `packages/cli/src/upgrade/upgrade-engine.ts`
- `packages/cli/src/commands/upgrade.ts`

---

## Phase 5: CI/CD Generators (v0.6.0) 🚀

**Target**: Q2 2026 | **Status**: Planning

### 5.1 GitHub Actions Templates

- [ ] Workflow: Lint + Test + Build
- [ ] Workflow: Deploy to Docker (local registry)
- [ ] Workflow: Deploy to Vercel
- [ ] Workflow: Deploy to Render
- [ ] Security scanning: Dependabot, SAST

**Files**:

- `packages/cli/src/generators/ci-github-actions.ts`
- `packages/cli/templates/.github/workflows/lint-test-build.yml`
- `packages/cli/templates/.github/workflows/deploy-docker.yml`

### 5.2 Local Deploy Instructions

- [ ] Docker Compose for full stack
- [ ] Nginx reverse proxy config
- [ ] SSL/TLS setup guide
- [ ] Database backup strategy

**Files**:

- `packages/cli/templates/docker-compose.yml`
- `packages/cli/templates/nginx.conf.template`

---

## Phase 6: AI (Optional & Local) (v0.7.0) 🤖

**Target**: Q3 2026 | **Status**: Planning

### 6.1 Local AI Commands

- [ ] `forgestack ai generate module <name> --local` - Generate code using local model
- [ ] `forgestack ai explain <file> --local` - Explain code
- [ ] `forgestack ai review security --local` - Security review
- [ ] `forgestack ai optimize performance <module> --local` - Performance suggestions

**Files**:

- `packages/cli/src/ai/local-ai-client.ts`
- `packages/cli/src/commands/ai.ts`

### 6.2 Local Model Support

- [ ] Ollama integration (llama2, mistral)
- [ ] LM Studio integration
- [ ] LocalAI integration
- [ ] User-provided API key support (optional)
- [ ] Prompt templates for code generation

**Files**:

- `packages/cli/src/ai/providers/ollama.ts`
- `packages/cli/src/ai/providers/lm-studio.ts`
- `packages/cli/src/ai/prompts/` - Prompt templates

### 6.3 AI Safety

- [ ] Never auto-apply AI changes to files
- [ ] Show diff before applying
- [ ] User approval required
- [ ] Audit trail of AI-generated code

---

## Phase 7: CLI Polish & Documentation (v0.7.0) ✨

**Target**: Q3 2026 | **Status**: Planning

### 7.1 Enhanced CLI Experience

- [ ] Progress bars for long operations
- [ ] Real-time feedback during generation
- [ ] Contextual help: `forgestack create --help`, `forgestack plugin --help`
- [ ] Command suggestions on typos
- [ ] Post-generation next steps guide

**Files**:

- `packages/cli/src/ui/progress.ts`
- `packages/cli/src/ui/prompts.ts`
- `packages/cli/src/ui/help.ts`

### 7.2 Comprehensive Documentation

- [ ] Offline docs: `forgestack docs --local` (serve via HTTP)
- [ ] Interactive tutorial: `forgestack init-guide`
- [ ] Plugin development guide
- [ ] Upgrade guide
- [ ] Troubleshooting guide

**Files**:

- `docs/PLUGIN_DEVELOPMENT.md`
- `docs/UPGRADE_GUIDE.md`
- `docs/TROUBLESHOOTING.md`
- `packages/cli/src/commands/docs.ts`

---

## Phase 8: Testing & Quality (v0.8.0) 📋

**Target**: Q3 2026 | **Status**: Planning

### 8.1 Test Coverage

- [ ] Unit tests: 90%+ coverage
- [ ] Integration tests: all generators
- [ ] E2E tests: full project generation flow
- [ ] Plugin tests: plugin system validation
- [ ] Snapshot tests: generated code consistency

**Files**:

- `packages/cli/tests/` - All test files
- `packages/cli/tests/e2e/` - End-to-end tests

### 8.2 Quality Metrics

- [ ] Performance benchmarks (generation speed)
- [ ] Security scanning (OWASP, dependency audit)
- [ ] Code coverage reports
- [ ] Lighthouse scores for generated frontends

---

## Phase 9: Community & Ecosystem (v1.0.0) 🌍

**Target**: Q4 2026 | **Status**: Planning

### 9.1 Plugin Marketplace

- [ ] Community plugin registry (GitHub-based)
- [ ] Plugin discovery: `forgestack plugin search`
- [ ] Plugin publishing guide
- [ ] Contribution guidelines

### 9.2 Templates & Examples

- [ ] SaaS examples (multi-tenant, billing, auth)
- [ ] Marketplace example
- [ ] Real-time app example
- [ ] Video tutorials
- [ ] Blog posts on best practices

---

## Current Status (v0.3.3) ✅

**Completed**:

- ✅ Basic CLI generator with interactive prompts
- ✅ Stack support: React+Vite, Next.js 14, Express, NestJS, Fastify
- ✅ Auth providers: JWT, Clerk, Supabase, Auth.js, Firebase
- ✅ Database support: PostgreSQL, MongoDB, MySQL, SQLite
- ✅ API styles: REST, GraphQL, tRPC
- ✅ Docker generation
- ✅ Multi-tenancy scaffolding
- ✅ Preset system (3 presets)
- ✅ JSON config injection
- ✅ Last-used config persistence
- ✅ ESM module support
- ✅ npm package published
- ✅ GitHub repository synced

**In Progress**:

- 🔄 Deterministic generation engine
- 🔄 File tracking system

**Next Priority** (v0.4.0):

1. Implement file manifest tracking
2. Add Vue + Vite support
3. Implement environment validation with Zod
4. Create plugin system foundation
5. Add upgrade engine

---

## Version Timeline

| Version | Target      | Focus                                    |
| ------- | ----------- | ---------------------------------------- |
| v0.3.3  | ✅ Jan 2026 | ESM fixes, offline core                  |
| v0.4.0  | Q1 2026     | Deterministic generation, Zod validation |
| v0.5.0  | Q2 2026     | Plugin system, presets v2, more stacks   |
| v0.6.0  | Q2-Q3 2026  | Upgrade engine, CI/CD templates          |
| v0.7.0  | Q3 2026     | Local AI, CLI polish                     |
| v0.8.0  | Q3 2026     | Full test coverage                       |
| v1.0.0  | Q4 2026     | Production ready, community ecosystem    |

---

## How to Contribute

1. Pick a phase/feature from above
2. Check the issue tracker for discussions
3. Submit PR with tests
4. Update this roadmap when complete

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
