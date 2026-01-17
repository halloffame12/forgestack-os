# Changelog

All notable changes to ForgeStack OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2026-01-17

### Fixed

- ESM module resolution: Added `.js` extensions to all relative imports for proper Node.js ESM support.
- npm configuration warnings: Fixed corrupted `.npmrc` file containing JSON instead of npm config.
- CLI execution: Fixed `ERR_MODULE_NOT_FOUND` errors when executing CLI from npm cache via `npx`.

### Changed

- Root package.json now includes `"type": "module"` for proper ESM support.

## [0.3.0] - 2026-01-17

### Added

- Preset system with `--preset` flag for rapid project creation (next-nest-clerk-pg, react-express-jwt-mongo, next-fastify-supabase-trpc).
- JSON config injection via `--stack <json>` for full stack definition in non-interactive mode.
- Last-used config persistence in `~/.forgestack/config.json` for convenience on repeated runs.
- Environment variable table and operational runbook in generated project README.
- Validation rule: reject incompatible Next.js + Express stacks.
- Version auto-sync from package.json (CLI banner and --version display).

### Changed

- CLI version bumped to 0.3.0 (stable release candidate).
- Root package version aligned to 0.3.0.
- Generated project README now includes env vars table with auth-specific rows and multi-step runbook.
- `prepublishOnly` hook added to enforce lint/test/build before npm publish.

### Fixed

- Lint errors: removed unused imports and parameters (Creator, Footer, Hero, badge, button).
- Build errors: fixed TypeScript module settings for ESM with import.meta support.
- Workspace test command now works: added placeholder test/lint scripts to docs and landing packages.

### Security

- Enabled npm provenance ready: added engines.node = ">=20" to enforce Node 20+ for CLI.
- Type definitions included in package (dist/index.d.ts).
- All dependencies pinned to current versions; no vulnerabilities detected (`npm audit --production`).

### Docs

- Added CLI-specific README to packages/cli for npm.
- Updated main README with accurate version badge (0.3.0).

---

## [0.2.1] - 2025-12-15

### Added

- Initial phases (1-4) complete: React+Vite, Next.js, NestJS, Express, Fastify, Bun+Elysia, multi-database, Docker, multi-tenancy.
- Landing page and documentation site (VitePress).
- Comprehensive generator system for all supported stacks.

---

## Unreleased (Phase 5+)

### Planned

- Vue + Vite frontend support.
- SvelteKit frontend support.
- Go + Fiber backend support (post-Phase 6).
- AI-powered code generation.
- Visual project builder.
- Template marketplace.
