# ForgeStack OS CLI

Generate production-ready full-stack SaaS projects with one command.

## Installation

```bash
# Recommended: npx (no install)
npx forgestack-os-cli create my-app

# Or install globally
npm install -g forgestack-os-cli
# then
forgestack create my-app
```

## Usage

```bash
forgestack create <project-name> [options]
```

**Common flags**

- `--frontend <framework>`: react-vite | nextjs
- `--backend <framework>`: express | fastify | nestjs | bun-elysia | go-fiber
- `--auth <provider>`: jwt | clerk | supabase | authjs | firebase
- `--database <db>`: postgresql | mongodb | mysql | sqlite | supabase-db
- `--api <style>`: rest | graphql | trpc
- `--preset <name>`: use a predefined stack (e.g., next-nest-clerk-pg)
- `--stack <json>`: provide full stack config as JSON
- `--docker` / `--no-docker`: include or skip Docker config
- `--multi-tenant`: enable multi-tenancy scaffolding
- `--skip-install`: skip dependency installation
- `--skip-git`: skip git init

### Examples

```bash
# Interactive
forgestack create my-saas

# Preset
forgestack create my-enterprise --preset next-nest-clerk-pg

# Full JSON config
forgestack create my-app --stack '{"frontend":"nextjs","backend":"fastify","auth":"supabase","database":"supabase-db","apiStyle":"trpc","docker":true,"multiTenant":true}'

# Minimal flags
forgestack create api-only --frontend=react-vite --backend=express --auth=jwt --database=postgresql --api=rest --no-docker
```

## Features

- 150+ stack combinations across frontend, backend, auth, database, and API styles
- Multi-tenancy ready scaffolds
- Docker Compose and env templates
- API docs (Swagger) for REST backends
- TypeScript-first across generated code

## Generated Project

```
my-app/
├─ frontend/   # Next.js or React+Vite
├─ backend/    # Express, Fastify, NestJS, Bun+Elysia, or Go+Fiber
├─ .env.example
├─ package.json (workspaces)
└─ README.md (per-project runbook)
```

## Author

Built and maintained by **Sumit Chauhan** ([halloffame12](https://github.com/halloffame12)).

## License

MIT
