# ForgeStack OS CLI

Generate production-ready full-stack SaaS projects with one command.

## Installation

### Option 1: Using npx (Recommended - No Installation Needed)

```bash
npx forgestack-os-cli create my-app
```

No setup required! The fastest way to get started. The CLI is downloaded and run on the fly.

### Option 2: Install Globally

```bash
npm install -g forgestack-os-cli
```

Then create projects using:

```bash
forgestack-os-cli create my-app
```

**Note on Global Install:** After installing globally, the command `forgestack-os-cli` should be in your PATH. If you get `command not found` errors:

1. Verify your npm bin directory is in PATH:
   ```bash
   npm config get prefix
   ```
2. Add it to PATH if needed:
   - **Windows (PowerShell):** `[System.Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\Users\YourUsername\AppData\Roaming\npm", [System.EnvironmentVariableTarget]::User)`
   - **macOS/Linux:** Add `export PATH="~/.npm-global/bin:$PATH"` to `~/.bash_profile` or `~/.zshrc`

3. Verify installation:
   ```bash
   forgestack-os-cli --version
   ```

## Quick Start

**Fastest way to create a project:**

```bash
# Interactive mode - we'll ask you questions
npx forgestack-os-cli create my-app

# With a preset - production-ready stack
npx forgestack-os-cli create my-enterprise --preset next-nest-clerk-pg

# With specific flags
npx forgestack-os-cli create my-api --frontend nextjs --backend nestjs --auth supabase --database postgresql --docker
```

## Usage

```bash
forgestack-os-cli create <project-name> [options]
```

Or with npx:

```bash
npx forgestack-os-cli create <project-name> [options]
```

### Available Options

| Option           | Values                                                                            | Description                             |
| ---------------- | --------------------------------------------------------------------------------- | --------------------------------------- |
| `--frontend`     | `react-vite` \| `nextjs` \| `vue-vite` \| `sveltekit`                             | Frontend framework                      |
| `--backend`      | `express` \| `fastify` \| `nestjs` \| `bun-elysia` \| `go-fiber`                  | Backend framework                       |
| `--auth`         | `jwt` \| `clerk` \| `supabase` \| `authjs` \| `firebase`                          | Authentication provider                 |
| `--database`     | `postgresql` \| `mongodb` \| `mysql` \| `sqlite` \| `supabase-db`                 | Database                                |
| `--api`          | `rest` \| `graphql` \| `trpc`                                                     | API style                               |
| `--preset`       | `next-nest-clerk-pg` \| `react-express-jwt-mongo` \| `next-fastify-supabase-trpc` | Predefined stack                        |
| `--stack`        | JSON string                                                                       | Full stack config as JSON               |
| `--docker`       | -                                                                                 | Include Docker configuration            |
| `--no-docker`    | -                                                                                 | Skip Docker configuration (default)     |
| `--multi-tenant` | -                                                                                 | Enable multi-tenancy scaffolding        |
| `--skip-install` | -                                                                                 | Skip npm install after project creation |
| `--skip-git`     | -                                                                                 | Skip git initialization                 |

## Examples

### Interactive Mode (Recommended)

```bash
npx forgestack-os-cli create my-saas
```

You'll be guided through selecting your stack options with interactive prompts.

### Using Presets

**Next.js + NestJS + Clerk + PostgreSQL (Full-featured):**

```bash
npx forgestack-os-cli create my-enterprise --preset next-nest-clerk-pg
```

**React + Express + JWT + MongoDB (Simple SPA):**

```bash
npx forgestack-os-cli create my-app --preset react-express-jwt-mongo
```

**Next.js + Fastify + Supabase + tRPC (Modern fullstack):**

```bash
npx forgestack-os-cli create my-trpc-app --preset next-fastify-supabase-trpc
```

### Using Flags

**RESTful API with React + Express:**

```bash
npx forgestack-os-cli create my-rest-api \
  --frontend react-vite \
  --backend express \
  --auth jwt \
  --database postgresql \
  --api rest
```

**GraphQL Backend with Vue:**

```bash
npx forgestack-os-cli create my-graphql-app \
  --frontend vue-vite \
  --backend nestjs \
  --auth firebase \
  --database mongodb \
  --api graphql \
  --docker
```

**Minimal Setup (SQLite + No Docker):**

```bash
npx forgestack-os-cli create my-minimal-app \
  --frontend react-vite \
  --backend express \
  --auth jwt \
  --database sqlite \
  --no-docker
```

### Using JSON Stack Config

Provide complete configuration as a JSON string:

```bash
npx forgestack-os-cli create my-custom-stack --stack '{
  "frontend": "nextjs",
  "backend": "fastify",
  "auth": "supabase",
  "database": "supabase-db",
  "apiStyle": "trpc",
  "docker": true,
  "multiTenant": true
}'
```

**Multi-tenancy with Docker:**

```bash
npx forgestack-os-cli create my-multitenant-app \
  --preset next-nest-clerk-pg \
  --multi-tenant \
  --docker
```

**Skip Dependency Installation:**

```bash
npx forgestack-os-cli create my-app --preset next-nest-clerk-pg --skip-install
cd my-app
npm install  # Install later when you're ready
```

## Additional Commands

### `organize` - File Organization Utility

Organize files in a folder by type or date, with optional duplicate detection. Supports MD5-based duplicate identification and automatic system folder exclusion for performance.

```bash
npx forgestack-os-cli organize <folder-path> [options]
```

**Options:**
- `--strategy <type>` - Organization strategy: `type` (default) or `date`
- `--duplicates` - Move duplicate files to a `Duplicates` folder

**File Categories (when using `--strategy type`):**
- **Images**: jpg, png, gif, svg, webp, bmp, ico
- **Documents**: pdf, doc, docx, txt, xlsx, csv, md
- **Videos**: mp4, mkv, avi, mov, wmv, flv
- **Audio**: mp3, wav, flac, aac, m4a, ogg
- **Code**: js, ts, py, java, cpp, go, rs, rb
- **Archives**: zip, rar, 7z, tar, gz, bz2
- **Data**: json, xml, yaml, sql, db, sqlite
- **Executables**: exe, msi, app, deb, rpm
- **Others**: All other file types

**Date Format (when using `--strategy date`):**
Files organized into folders using format: `YYYY-MM` (e.g., `2026-01`, `2025-12`)

**Features:**
- ✅ Automatically skips system folders (node_modules, .git, dist, build, .next, .env, .DS_Store, .vscode)
- ✅ MD5-based duplicate detection (prevents moving the same file twice)
- ✅ Graceful error handling for permission denied or inaccessible files
- ✅ Summary report showing total files organized and categories
- ✅ Interactive prompts if options not provided

**Examples:**

```bash
# Organize by file type with duplicate detection
npx forgestack-os-cli organize ~/Downloads --strategy type --duplicates

# Organize photos by month
npx forgestack-os-cli organize ~/Pictures --strategy date

# Interactive mode (prompts for folder and options)
npx forgestack-os-cli organize

# Organize current directory
npx forgestack-os-cli organize .
```

**Output Example:**
```
✓ Found and organized 1,250 files
✓ Categories:
  - Images: 450 files
  - Documents: 280 files
  - Videos: 320 files
  - Code: 145 files
  - Others: 55 files
✓ Found 12 set(s) of duplicate files moved to Duplicates folder
```

**Edge Cases Handled:**
- Empty folders: Displays "No files to organize" message
- Invalid paths: Shows clear error message with validation
- Permission errors: Skips files with access denied, continues processing
- Unreadable files: Skips during hash calculation, no crash
- Large monorepos: Excludes node_modules, .git, and build folders automatically

---

### `run-tasks` - Batch Task Runner

Execute shell commands from a JSON configuration file, sequentially or in parallel. Supports task-specific working directories and comprehensive error handling.

```bash
npx forgestack-os-cli run-tasks <config-path> [options]
```

**Options:**
- `--parallel` - Run tasks concurrently instead of sequentially (default: false)
- `--stop-on-error` - Stop execution on first task failure (default: true)

**Config File Format (tasks.json):**

```json
{
  "tasks": [
    {
      "name": "Build",
      "command": "npm run build",
      "cwd": "./"
    },
    {
      "name": "Test",
      "command": "npm test",
      "cwd": "./"
    }
  ],
  "parallel": false,
  "stopOnError": true
}
```

**Features:**
- ✅ Cross-platform shell execution (Windows CMD, Unix bash)
- ✅ Task-specific working directory support
- ✅ Sequential or parallel execution modes
- ✅ Configurable failure handling
- ✅ Comprehensive error reporting
- ✅ Interactive mode with default config file detection
- ✅ Proper exit codes for CI/CD integration

**Examples:**

```bash
# Run tasks sequentially (stops on first error)
npx forgestack-os-cli run-tasks ./tasks.json

# Run tasks in parallel
npx forgestack-os-cli run-tasks ./tasks.json --parallel

# Continue on errors
npx forgestack-os-cli run-tasks ./tasks.json --stop-on-error false

# Interactive mode (looks for ./tasks.json automatically)
npx forgestack-os-cli run-tasks
```

**Task Properties:**
- `name` (required) - Display name for the task (for logging)
- `command` (required) - Shell command to execute
- `cwd` (optional) - Working directory for command execution (must exist)

**Example: Monorepo Build Pipeline**

```json
{
  "tasks": [
    {
      "name": "Clean Build Artifacts",
      "command": "rm -rf dist"
    },
    {
      "name": "Build Frontend",
      "command": "npm run build",
      "cwd": "./packages/frontend"
    },
    {
      "name": "Build Backend",
      "command": "npm run build",
      "cwd": "./packages/backend"
    },
    {
      "name": "Run Tests",
      "command": "npm test",
      "cwd": "./packages/backend"
    },
    {
      "name": "Generate Docs",
      "command": "npm run docs"
    }
  ],
  "parallel": false,
  "stopOnError": true
}
```

**Output Example:**
```
⏳ Running tasks sequentially...
✓ Task 1/5: Clean Build Artifacts completed
✓ Task 2/5: Build Frontend completed
✓ Task 3/5: Build Backend completed
✓ Task 4/5: Run Tests completed
✓ Task 5/5: Generate Docs completed

✓ All 5 tasks completed successfully
```

**Error Handling:**
- **Invalid config path**: Shows clear error, no crash
- **Malformed JSON**: Displays JSON parsing error
- **Missing command**: Validates all tasks have required fields
- **Invalid working directory**: Shows warning, continues with project root
- **Task execution fails**: Respects `stopOnError` flag
- **Cross-platform compatibility**: Automatically handles Windows vs Unix paths

---

## Features

### Project Generation
- **150+ Stack Combinations** - Frontend (React, Next.js, Vue, Svelte) × Backend (Express, Fastify, NestJS, Bun, Go) × Auth × Database × API Style
- **Multi-tenancy Ready** - Scaffolding support for SaaS applications
- **Docker Compose** - Complete Docker setup with frontend and backend services
- **Environment Templates** - Pre-configured `.env.example` files
- **API Documentation** - Swagger/OpenAPI docs for REST APIs
- **TypeScript First** - Full TypeScript support across all generated code
- **Production Ready** - Best practices, security headers, error handling

### Utility Commands
- **File Organization** (`organize`) - Sort files by type or date, with MD5-based duplicate detection and automatic system folder exclusion
- **Batch Task Runner** (`run-tasks`) - Execute complex workflows with sequential or parallel task execution, cross-platform compatibility, and comprehensive error handling

## Generated Project Structure

```
my-app/
├── frontend/              # React+Vite, Next.js, Vue, or SvelteKit
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts (or next.config.js)
│
├── backend/               # Express, Fastify, NestJS, Bun+Elysia, or Go
│   ├── src/
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docker/                # Optional - if --docker enabled
│   ├── docker-compose.yml
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
│
├── .env.example           # Environment variables template
├── package.json           # Workspace configuration (monorepo)
├── README.md              # Per-project setup guide
└── .gitignore
```

## Troubleshooting

### "command not found: forgestack-os-cli"

**Using npx?** Make sure you use the full package name:

```bash
npx forgestack-os-cli create my-app
```

**Installed globally?** Try:

1. Verify npm global bin is in PATH: `echo $PATH` (Unix) or `$env:Path` (Windows)
2. Reinstall: `npm install -g forgestack-os-cli@latest`
3. Check Node.js version: `node --version` (requires 18+)

### "404 Not Found - forgestack"

The package name is **`forgestack-os-cli`**, not `forgestack`:

```bash
# ✅ Correct
npx forgestack-os-cli create my-app

# ❌ Wrong
npx forgestack create my-app
```

### "Unknown command"

Ensure you're using `create`, not `init`:

```bash
# ✅ Correct
npx forgestack-os-cli create my-app

# ❌ Wrong
npx forgestack-os-cli init my-app
```

### Preset not found

Available presets:

- `next-nest-clerk-pg` - Next.js, NestJS, Clerk, PostgreSQL
- `react-express-jwt-mongo` - React+Vite, Express, JWT, MongoDB
- `next-fastify-supabase-trpc` - Next.js, Fastify, Supabase, tRPC

Use exact preset names (case-sensitive).

### Node.js version error

ForgeStack requires Node.js 18 or higher:

```bash
node --version  # Check your version
nvm install 18  # Or use nvm/fnm to upgrade
```

## Author

Built and maintained by **Sumit Chauhan** ([halloffame12](https://github.com/halloffame12)).

## License

MIT
