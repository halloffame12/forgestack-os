<p align="center">
  <img src="https://i.postimg.cc/Y051sTkd/favicon.jpg" alt="ForgeStack OS Logo" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">ForgeStack OS CLI</h1>

<p align="center">
  <strong>Generate production-ready full-stack SaaS projects with one command.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/forgestack-os-cli"><img src="https://img.shields.io/npm/v/forgestack-os-cli?style=flat-square&color=0891b2&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/forgestack-os-cli"><img src="https://img.shields.io/npm/dm/forgestack-os-cli?style=flat-square&color=0891b2" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <a href="#-installation">Installation</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-commands">Commands</a> •
  <a href="#-examples">Examples</a> •
  <a href="#-troubleshooting">Help</a>
</p>

---

## 📦 Installation

### Using npx (Recommended — No Install Required)

```bash
npx forgestack-os-cli create my-app
```

### Global Installation

```bash
npm install -g forgestack-os-cli
forgestack-os-cli create my-app
```

<details>
<summary><strong>🔧 Troubleshooting global install</strong></summary>

If you get `command not found` after global install:

1. Check your npm bin directory:

   ```bash
   npm config get prefix
   ```

2. Add it to your PATH:
   - **Windows (PowerShell)**:
     ```powershell
     [System.Environment]::SetEnvironmentVariable("Path", "$env:Path;$(npm config get prefix)", [System.EnvironmentVariableTarget]::User)
     ```
   - **macOS/Linux**:
     ```bash
     export PATH="$(npm config get prefix)/bin:$PATH"
     ```

3. Verify installation:
   ```bash
   forgestack-os-cli --version
   ```

</details>

---

## ⚡ Quick Start

```bash
# Interactive mode — answer prompts to configure your stack
npx forgestack-os-cli create my-saas-app

# Use a preset for instant setup
npx forgestack-os-cli create my-app --preset next-nest-clerk-pg

# Specify options directly
npx forgestack-os-cli create my-app \
  --frontend nextjs \
  --backend nestjs \
  --auth clerk \
  --database postgresql \
  --docker
```

**In 30 seconds**, you get:

- ✅ Full authentication system
- ✅ Database with migrations
- ✅ API documentation (Swagger)
- ✅ Docker configuration
- ✅ TypeScript everywhere

---

## 🧰 Commands

### `create` — Generate a New Project

```bash
npx forgestack-os-cli create <project-name> [options]
```

<table>
<tr><th>Option</th><th>Values</th><th>Description</th></tr>
<tr><td><code>--frontend</code></td><td><code>react-vite</code> | <code>nextjs</code> | <code>vue-vite</code> | <code>sveltekit</code></td><td>Frontend framework</td></tr>
<tr><td><code>--backend</code></td><td><code>express</code> | <code>fastify</code> | <code>nestjs</code> | <code>bun-elysia</code> | <code>go-fiber</code></td><td>Backend framework</td></tr>
<tr><td><code>--auth</code></td><td><code>jwt</code> | <code>clerk</code> | <code>supabase</code> | <code>authjs</code> | <code>firebase</code></td><td>Authentication</td></tr>
<tr><td><code>--database</code></td><td><code>postgresql</code> | <code>mongodb</code> | <code>mysql</code> | <code>sqlite</code></td><td>Database</td></tr>
<tr><td><code>--api</code></td><td><code>rest</code> | <code>graphql</code> | <code>trpc</code></td><td>API style</td></tr>
<tr><td><code>--preset</code></td><td><code>next-nest-clerk-pg</code> | <code>react-express-jwt-mongo</code> | <code>next-fastify-supabase-trpc</code></td><td>Preset stack</td></tr>
<tr><td><code>--docker</code></td><td>—</td><td>Include Docker config</td></tr>
<tr><td><code>--multi-tenant</code></td><td>—</td><td>Enable multi-tenancy</td></tr>
<tr><td><code>--skip-install</code></td><td>—</td><td>Skip npm install</td></tr>
<tr><td><code>--skip-git</code></td><td>—</td><td>Skip git init</td></tr>
</table>

---

### `doctor` — Validate Environment ✨ NEW

Diagnose your dev environment and catch issues before they slow you down.

```bash
npx forgestack-os-cli doctor [options]
```

<table>
<tr><th>Option</th><th>Description</th></tr>
<tr><td><code>--lint</code></td><td>Run ESLint and TypeScript checks</td></tr>
<tr><td><code>--json</code></td><td>Output as JSON for CI/CD pipelines</td></tr>
<tr><td><code>--fix</code></td><td>Generate <code>.env.missing</code> report</td></tr>
<tr><td><code>--cwd &lt;path&gt;</code></td><td>Check a specific directory</td></tr>
</table>

**Example Output:**

```
🩺 ForgeStack Doctor Report

📋 Node.js & Package Managers

✅ Node.js: Node version: 20.2.0
✅ npm: npm version: 10.2.0
⏭️ pnpm: pnpm is not installed (optional)

📋 Environment Variables

❌ Missing .env Variables: DATABASE_URL, JWT_SECRET
   💡 Fix: Add the missing variables to your .env file

📋 Database Connectivity

✅ PostgreSQL Connection: Successfully connected to PostgreSQL

📋 Prisma ORM

✅ Prisma Schema: Prisma schema is valid
✅ Prisma Client: Prisma client is generated
⚠️ Prisma Migrations: Pending migrations detected
   💡 Fix: Run: npx prisma migrate dev

📋 Docker

✅ Docker: Docker installed: 24.0.7
✅ Docker Daemon: Docker daemon is running
✅ Docker Compose: Docker Compose V2: 2.23.0

📋 Port Availability

❌ Backend (port 3000): Port 3000 is used by node (PID: 12345)
   💡 Fix: Stop the process or use a different port. Kill: taskkill /PID 12345 /F
✅ Frontend (port 5173): Port 5173 is available

───────────────────────────────────────────────────────────

📊 Summary:

   Total Checks: 12
   Passed: 8
   Warnings: 1
   Failed: 2
   Skipped: 1

✖ Found 2 critical issue(s) that need to be fixed.
```

**Checks Performed:**

| Check          | Description                                        |
| -------------- | -------------------------------------------------- |
| 🟢 Node.js     | Version against `.nvmrc` or `package.json` engines |
| 🟢 npm/pnpm    | Package manager availability                       |
| 🟢 Environment | Missing variables from `.env.example`              |
| 🟢 Database    | PostgreSQL, MongoDB, MySQL, SQLite connectivity    |
| 🟢 Prisma      | Client generation, schema validation, migrations   |
| 🟢 Docker      | Installation, daemon status, Compose availability  |
| 🟢 Ports       | Backend (3000) and frontend (5173) availability    |
| 🟢 ESLint      | Linting issues (with `--lint`)                     |
| 🟢 TypeScript  | Compile errors (with `--lint`)                     |

**CI/CD Integration:**

```yaml
# GitHub Actions
- name: Validate Environment
  run: |
    npx forgestack-os-cli doctor --json > doctor-report.json
    if [ $(jq '.summary.failed' doctor-report.json) -gt 0 ]; then
      exit 1
    fi
```

---

### `organize` — File Organization Utility

Organize files by type or date with duplicate detection.

```bash
npx forgestack-os-cli organize <folder-path> [options]
```

<table>
<tr><th>Option</th><th>Description</th></tr>
<tr><td><code>--strategy &lt;type&gt;</code></td><td><code>type</code> (by extension) or <code>date</code> (by YYYY-MM)</td></tr>
<tr><td><code>--duplicates</code></td><td>Move duplicate files to <code>Duplicates/</code></td></tr>
</table>

**File Categories:**

- 📷 **Images**: jpg, png, gif, svg, webp, bmp, ico
- 📄 **Documents**: pdf, doc, docx, txt, xlsx, csv, md
- 🎬 **Videos**: mp4, mkv, avi, mov, wmv, flv
- 🎵 **Audio**: mp3, wav, flac, aac, m4a, ogg
- 💻 **Code**: js, ts, py, java, cpp, go, rs, rb
- 📦 **Archives**: zip, rar, 7z, tar, gz, bz2
- 📊 **Data**: json, xml, yaml, sql, db, sqlite
- ⚙️ **Executables**: exe, msi, app, deb, rpm

**Example:**

```bash
# Organize Downloads by file type with duplicate detection
npx forgestack-os-cli organize ~/Downloads --strategy type --duplicates

# Organize photos by month
npx forgestack-os-cli organize ~/Pictures --strategy date
```

---

### `run-tasks` — Batch Task Runner

Execute shell commands from JSON config with parallel support.

```bash
npx forgestack-os-cli run-tasks <config-path> [options]
```

<table>
<tr><th>Option</th><th>Description</th></tr>
<tr><td><code>--parallel</code></td><td>Run tasks concurrently</td></tr>
<tr><td><code>--stop-on-error</code></td><td>Stop on first failure (default: true)</td></tr>
</table>

**Config Format (tasks.json):**

```json
{
  "tasks": [
    {
      "name": "Build Frontend",
      "command": "npm run build",
      "cwd": "./frontend"
    },
    { "name": "Build Backend", "command": "npm run build", "cwd": "./backend" },
    { "name": "Run Tests", "command": "npm test" },
    { "name": "Deploy", "command": "npm run deploy" }
  ],
  "parallel": false,
  "stopOnError": true
}
```

**Example:**

```bash
# Run sequentially
npx forgestack-os-cli run-tasks ./build-pipeline.json

# Run in parallel
npx forgestack-os-cli run-tasks ./build-pipeline.json --parallel

# Continue on errors
npx forgestack-os-cli run-tasks ./tasks.json --stop-on-error false
```

---

## 📚 Examples

### Interactive Mode (Recommended)

```bash
npx forgestack-os-cli create my-saas
# Answer prompts to configure your perfect stack
```

### Using Presets

```bash
# Enterprise: Next.js + NestJS + Clerk + PostgreSQL
npx forgestack-os-cli create my-enterprise --preset next-nest-clerk-pg

# Startup: React + Express + JWT + MongoDB
npx forgestack-os-cli create my-startup --preset react-express-jwt-mongo

# Modern: Next.js + Fastify + Supabase + tRPC
npx forgestack-os-cli create my-modern --preset next-fastify-supabase-trpc
```

### Using Flags

```bash
# RESTful API with PostgreSQL
npx forgestack-os-cli create my-api \
  --frontend react-vite \
  --backend express \
  --auth jwt \
  --database postgresql \
  --api rest \
  --docker

# GraphQL with MongoDB
npx forgestack-os-cli create my-graphql \
  --frontend vue-vite \
  --backend nestjs \
  --auth firebase \
  --database mongodb \
  --api graphql

# Multi-tenant SaaS
npx forgestack-os-cli create my-saas \
  --preset next-nest-clerk-pg \
  --multi-tenant \
  --docker
```

### JSON Stack Config

```bash
npx forgestack-os-cli create my-custom --stack '{
  "frontend": "nextjs",
  "backend": "fastify",
  "auth": "supabase",
  "database": "postgresql",
  "apiStyle": "trpc",
  "docker": true,
  "multiTenant": true
}'
```

---

## 📁 Generated Project Structure

```
my-app/
├── 📁 frontend/              # React/Next.js/Vue/Svelte
│   ├── 📁 src/
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📄 vite.config.ts
│
├── 📁 backend/               # Express/Fastify/NestJS/Bun
│   ├── 📁 src/
│   │   ├── 📁 auth/          # Authentication module
│   │   ├── 📁 users/         # User management
│   │   └── 📄 main.ts
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📄 .env.example
│
├── 📁 docker/                # If --docker enabled
│   ├── 📄 docker-compose.yml
│   ├── 📄 frontend.Dockerfile
│   └── 📄 backend.Dockerfile
│
├── 📄 .env.example           # Environment template
├── 📄 package.json           # Monorepo workspace
└── 📄 README.md              # Project-specific docs
```

---

## ❓ Troubleshooting

<details>
<summary><strong>"command not found: forgestack-os-cli"</strong></summary>

Using npx? Use the full package name:

```bash
npx forgestack-os-cli create my-app
```

Installed globally? Check your PATH includes npm's bin directory.

</details>

<details>
<summary><strong>"404 Not Found - forgestack"</strong></summary>

The package name is `forgestack-os-cli`, not `forgestack`:

```bash
# ✅ Correct
npx forgestack-os-cli create my-app

# ❌ Wrong
npx forgestack create my-app
```

</details>

<details>
<summary><strong>"Unknown command"</strong></summary>

Use `create`, not `init`:

```bash
# ✅ Correct
npx forgestack-os-cli create my-app

# ❌ Wrong
npx forgestack-os-cli init my-app
```

</details>

<details>
<summary><strong>"Preset not found"</strong></summary>

Available presets (case-sensitive):

- `next-nest-clerk-pg`
- `react-express-jwt-mongo`
- `next-fastify-supabase-trpc`

</details>

<details>
<summary><strong>Node.js version error</strong></summary>

ForgeStack requires Node.js 18+:

```bash
node --version  # Check version
nvm install 18  # Upgrade with nvm
```

</details>

---

## 🔗 Links

- 📚 [Documentation](https://github.com/halloffame12/forgestack-os#readme)
- 🐛 [Issues](https://github.com/halloffame12/forgestack-os/issues)
- 💬 [Discussions](https://github.com/halloffame12/forgestack-os/discussions)
- 📦 [npm Package](https://www.npmjs.com/package/forgestack-os-cli)

---

## 👨‍💻 Author

<table>
<tr>
<td>
<img src="https://github.com/halloffame12.png" width="60" style="border-radius: 50%;" alt="Sumit Chauhan" />
</td>
<td>
<strong>Sumit Chauhan</strong><br/>
<a href="https://github.com/halloffame12">GitHub</a> •
<a href="https://www.linkedin.com/in/sumit-chauhan-a4ba98325/">LinkedIn</a>
</td>
</tr>
</table>

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>⭐ Star us on GitHub if this tool helped you!</strong>
</p>

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/halloffame12">Sumit Chauhan</a></sub>
</p>
