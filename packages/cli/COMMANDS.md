# ForgeStack CLI - New Commands

## `organize` Command

Organize files in a folder by type or date, with optional duplicate detection.

### Usage

```bash
npx forgestack organize <folder-path> [options]
npx forgestack organize                # Interactive mode
```

### Options

- `--strategy <type>` - Organization strategy: `type` or `date`
- `--duplicates` - Move duplicate files to a `Duplicates` folder

### Examples

**Organize by file type with duplicates detection:**

```bash
npx forgestack organize ./Downloads --strategy type --duplicates
```

**Organize by date:**

```bash
npx forgestack organize ./photos --strategy date
```

**Interactive mode:**

```bash
npx forgestack organize
```

### Features

- **By Type**: Organizes files into folders like `Images`, `Documents`, `Videos`, `Audio`, `Code`, `Archives`, etc.
- **By Date**: Organizes files into YYYY-MM formatted folders based on modification date
- **Duplicate Detection**: Uses MD5 hashing to find duplicate files and optionally moves them to a `Duplicates` folder
- **Recursive**: Processes all files in subfolders

### Output

The command displays a summary of:

- Number of files moved to each category
- Number of duplicate files moved (if detected)
- Total files moved

---

## `run-tasks` Command

Execute a batch of shell commands from a JSON config file, either sequentially or in parallel.

### Usage

```bash
npx forgestack run-tasks <config-path> [options]
npx forgestack run-tasks                # Interactive mode (looks for ./tasks.json)
```

### Options

- `--parallel` - Run tasks in parallel instead of sequentially
- `--stop-on-error` - Stop execution if any task fails (default: true)

### Examples

**Run tasks sequentially:**

```bash
npx forgestack run-tasks ./tasks.json
```

**Run tasks in parallel:**

```bash
npx forgestack run-tasks ./tasks.json --parallel
```

**Continue even if a task fails:**

```bash
npx forgestack run-tasks ./tasks.json --stop-on-error false
```

### Config File Format

Create a `tasks.json` file with the following structure:

```json
{
  "tasks": [
    {
      "name": "Task 1 Name",
      "command": "npm run build",
      "cwd": "./"
    },
    {
      "name": "Task 2 Name",
      "command": "npm test",
      "cwd": "./"
    }
  ],
  "parallel": false,
  "stopOnError": true
}
```

### Task Properties

- `name` (required): Display name for the task
- `command` (required): Shell command to execute
- `cwd` (optional): Working directory for the command

### Global Config Properties

- `parallel` (optional): Run all tasks in parallel (default: false)
- `stopOnError` (optional): Stop on first failure (default: true)

### Output

Displays:

- Task execution progress with colored indicators
- Success/failure status for each task
- Summary showing succeeded and failed task counts
- Error messages for failed tasks

---

## Examples

See the `examples/tasks.json` file in the CLI package for a complete example.

---

## `doctor` Command

Validate the generated SaaS project environment and dev setup. This helps developers quickly detect missing dependencies, configuration issues, and common setup problems before running the app.

### Usage

```bash
npx forgestack doctor [options]
npx forgestack-os-cli doctor           # If globally installed
```

### Options

- `--lint` - Run ESLint and TypeScript checks
- `--json` - Output results as JSON for CI pipelines
- `--fix` - Auto-generate missing .env report
- `--cwd <path>` - Custom project directory to check

### Examples

**Basic health check:**

```bash
npx forgestack doctor
```

**Full check with linting:**

```bash
npx forgestack doctor --lint
```

**JSON output for CI/CD:**

```bash
npx forgestack doctor --json
```

**Generate missing env report:**

```bash
npx forgestack doctor --fix
```

### Checks Performed

| Check                     | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| **Node.js**               | Verify correct Node version (checks against .nvmrc or package.json engines) |
| **npm/pnpm**              | Verify package managers are installed                                       |
| **Environment Variables** | Detect missing variables from .env.example in .env                          |
| **Database Connectivity** | Attempt to connect to configured DB (PostgreSQL, MongoDB, MySQL, SQLite)    |
| **Prisma**                | Check if prisma generate has been run and if migrations are pending         |
| **Docker**                | Verify Docker is installed and running (if project uses Docker)             |
| **Port Availability**     | Check if backend (3000) and frontend (5173) ports are free                  |
| **ESLint**                | Run ESLint check (with `--lint` flag)                                       |
| **TypeScript**            | Run TypeScript compile check (with `--lint` flag)                           |

### Output Example

```
🩺 ForgeStack Doctor Report

✅ Node version: 20.2.0 (OK)
✅ npm version: 10.2.0 (OK)
❌ .env missing: DATABASE_URL, JWT_SECRET
⚠️ Prisma migrations pending
✅ Docker installed: OK
❌ Backend port 3000 in use
✅ Frontend port 5173 free

📊 Summary:
   Total Checks: 9
   Passed: 5
   Warnings: 1
   Failed: 2
   Skipped: 1
```

### Exit Codes

- `0` - All checks passed (no critical failures)
- `1` - One or more critical issues found

### CI/CD Integration

Use the `--json` flag to integrate with CI pipelines:

```yaml
# GitHub Actions example
- name: Health Check
  run: npx forgestack doctor --json | jq '.summary'
```

### Modular Architecture

Each check is implemented as a separate utility module in `src/utils/doctor/` for re-use in CI pipelines:

- `check-node.ts` - Node.js and package manager checks
- `check-env.ts` - Environment variable validation
- `check-database.ts` - Database connectivity
- `check-prisma.ts` - Prisma ORM status
- `check-docker.ts` - Docker installation and status
- `check-ports.ts` - Port availability
- `check-lint.ts` - ESLint and TypeScript checks
