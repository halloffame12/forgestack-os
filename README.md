<p align="center">
  <img src="https://raw.githubusercontent.com/halloffame12/forgestack-os/main/docs/assets/logo.svg" alt="ForgeStack OS Logo" width="120" height="120" />
</p>

<h1 align="center">ForgeStack OS</h1>

<p align="center">
  <strong>🚀 One platform. Any stack. Production-ready.</strong>
</p>

<p align="center">
  Generate full-stack SaaS applications with a single CLI command.<br/>
  Skip weeks of boilerplate. Ship faster. Build better.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/forgestack-os-cli"><img src="https://img.shields.io/npm/v/forgestack-os-cli?style=flat-square&color=0891b2&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/forgestack-os-cli"><img src="https://img.shields.io/npm/dm/forgestack-os-cli?style=flat-square&color=0891b2" alt="npm downloads" /></a>
  <a href="https://github.com/halloffame12/forgestack-os/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" /></a>
  <a href="https://github.com/halloffame12/forgestack-os"><img src="https://img.shields.io/github/stars/halloffame12/forgestack-os?style=flat-square&color=yellow" alt="GitHub stars" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-supported-stacks">Stacks</a> •
  <a href="#-cli-commands">Commands</a> •
  <a href="#-documentation">Docs</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br/>

<p align="center">
  <img src="https://raw.githubusercontent.com/halloffame12/forgestack-os/main/docs/assets/demo.gif" alt="ForgeStack CLI Demo" width="700" />
</p>

---

## ⚡ Quick Start

```bash
# Create a new project with npx (no install required)
npx forgestack-os-cli create my-saas-app

# Answer interactive prompts to configure your stack
? Choose your frontend framework: › Next.js 14 (App Router)
? Choose your backend framework:  › NestJS (Enterprise)
? Choose your authentication:     › Clerk
? Choose your database:           › PostgreSQL + Prisma
? API style:                      › REST
? Enable Docker?                  › Yes
? Enable multi-tenancy?           › Yes

# Start building immediately
cd my-saas-app && npm run dev
```

<details>
<summary><strong>🎯 Or use a preset for instant setup</strong></summary>

```bash
# Enterprise Stack: Next.js + NestJS + Clerk + PostgreSQL
npx forgestack-os-cli create my-enterprise --preset next-nest-clerk-pg

# Startup Stack: React + Express + JWT + MongoDB
npx forgestack-os-cli create my-startup --preset react-express-jwt-mongo

# Modern Stack: Next.js + Fastify + Supabase + tRPC
npx forgestack-os-cli create my-modern --preset next-fastify-supabase-trpc
```

</details>

**In under 30 seconds**, you get a complete production-ready application with:

| Feature                     | Included                                            |
| --------------------------- | --------------------------------------------------- |
| ✅ Full authentication flow | Login, register, password reset, session management |
| ✅ Multi-tenancy support    | Organization/team isolation, role-based access      |
| ✅ Database integration     | Prisma ORM with migrations, seeding scripts         |
| ✅ API documentation        | Swagger/OpenAPI auto-generated docs                 |
| ✅ Docker configuration     | Multi-stage builds, docker-compose ready            |
| ✅ TypeScript everywhere    | Full type safety, no `any` types                    |

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Local-First

- Works **100% offline** — no account needed
- No vendor lock-in — your code, your machine
- No telemetry or tracking

### 🔧 Any Stack Combination

- **150+ valid combinations**
- Mix & match frameworks freely
- Battle-tested configurations

### 🚀 Production-Ready

- Not just boilerplate — complete features
- Security best practices built-in
- Environment management included

</td>
<td width="50%">

### 💎 Developer Experience

- Full TypeScript support
- Hot reload in development
- ESLint + Prettier pre-configured
- Comprehensive error handling

### 🩺 Health Checks (NEW in v0.3.5)

- `doctor` command validates your setup
- Detects missing dependencies
- Checks database connectivity
- Verifies environment variables

### 🛠️ Utility Commands

- File organization (`organize`)
- Batch task runner (`run-tasks`)
- Environment validation (`doctor`)

</td>
</tr>
</table>

---

## 🧰 CLI Commands

### 📦 `create` — Generate a New Project

```bash
npx forgestack-os-cli create <project-name> [options]
```

| Option           | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `--frontend`     | `react-vite` \| `nextjs` \| `vue-vite` \| `sveltekit`            |
| `--backend`      | `express` \| `fastify` \| `nestjs` \| `bun-elysia` \| `go-fiber` |
| `--auth`         | `jwt` \| `clerk` \| `supabase` \| `authjs` \| `firebase`         |
| `--database`     | `postgresql` \| `mongodb` \| `mysql` \| `sqlite`                 |
| `--api`          | `rest` \| `graphql` \| `trpc`                                    |
| `--docker`       | Include Docker configuration                                     |
| `--multi-tenant` | Enable multi-tenancy scaffolding                                 |
| `--preset`       | Use a predefined stack preset                                    |

---

### 🩺 `doctor` — Validate Environment (NEW)

Diagnose your development environment and catch issues before they slow you down.

```bash
npx forgestack-os-cli doctor [options]
```

```
🩺 ForgeStack Doctor Report

✅ Node.js: Node version: 20.2.0
✅ npm: npm version: 10.2.0
❌ Missing .env Variables: DATABASE_URL, JWT_SECRET
⚠️ Prisma Migrations: Pending migrations detected
✅ Docker: Docker installed: 24.0.7
✅ Docker Daemon: Docker daemon is running
❌ Backend (port 3000): Port 3000 is used by node (PID: 12345)
✅ Frontend (port 5173): Port 5173 is available

📊 Summary:
   Total Checks: 9
   Passed: 5
   Warnings: 1
   Failed: 2
   Skipped: 1
```

| Option         | Description                          |
| -------------- | ------------------------------------ |
| `--lint`       | Run ESLint and TypeScript checks     |
| `--json`       | Output as JSON (for CI/CD pipelines) |
| `--fix`        | Generate `.env.missing` report       |
| `--cwd <path>` | Check a specific directory           |

**What it checks:**

- ✅ Node.js & npm/pnpm versions
- ✅ Environment variables (`.env` vs `.env.example`)
- ✅ Database connectivity (PostgreSQL, MongoDB, MySQL, SQLite)
- ✅ Prisma client generation & migrations
- ✅ Docker installation & daemon status
- ✅ Port availability (3000, 5173)
- ✅ ESLint & TypeScript (with `--lint`)

---

### 📁 `organize` — File Organization Utility

```bash
npx forgestack-os-cli organize ~/Downloads --strategy type --duplicates
```

| Option         | Description                                  |
| -------------- | -------------------------------------------- |
| `--strategy`   | `type` (by file type) or `date` (by YYYY-MM) |
| `--duplicates` | Move duplicate files to `Duplicates/` folder |

**Categories:** Images, Documents, Videos, Audio, Code, Archives, Data, Executables, Others

---

### 🚀 `run-tasks` — Batch Task Runner

```bash
npx forgestack-os-cli run-tasks ./tasks.json --parallel
```

| Option            | Description            |
| ----------------- | ---------------------- |
| `--parallel`      | Run tasks concurrently |
| `--stop-on-error` | Stop on first failure  |

<details>
<summary><strong>Example tasks.json</strong></summary>

```json
{
  "tasks": [
    {
      "name": "Build Frontend",
      "command": "npm run build",
      "cwd": "./frontend"
    },
    { "name": "Build Backend", "command": "npm run build", "cwd": "./backend" },
    { "name": "Run Tests", "command": "npm test" }
  ],
  "parallel": false,
  "stopOnError": true
}
```

</details>

---

## 🎨 Supported Stacks

<table>
<tr>
<th width="20%">Category</th>
<th width="80%">Options</th>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>
<img src="https://img.shields.io/badge/React_+_Vite-✅-61dafb?style=flat-square&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js_14-✅-000000?style=flat-square&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/Vue_+_Vite-🔜-4fc08d?style=flat-square&logo=vue.js&logoColor=white" />
<img src="https://img.shields.io/badge/SvelteKit-🔜-ff3e00?style=flat-square&logo=svelte&logoColor=white" />
</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>
<img src="https://img.shields.io/badge/Express-✅-000000?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/NestJS-✅-e0234e?style=flat-square&logo=nestjs&logoColor=white" />
<img src="https://img.shields.io/badge/Fastify-✅-000000?style=flat-square&logo=fastify&logoColor=white" />
<img src="https://img.shields.io/badge/Bun_+_Elysia-✅-fbf0df?style=flat-square&logo=bun&logoColor=black" />
<img src="https://img.shields.io/badge/Go_+_Fiber-🔜-00add8?style=flat-square&logo=go&logoColor=white" />
</td>
</tr>
<tr>
<td><strong>Auth</strong></td>
<td>
<img src="https://img.shields.io/badge/JWT-✅-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/Clerk-✅-6c47ff?style=flat-square&logo=clerk&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-✅-3ecf8e?style=flat-square&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Auth.js-✅-000000?style=flat-square" />
<img src="https://img.shields.io/badge/Firebase-✅-ffca28?style=flat-square&logo=firebase&logoColor=black" />
</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>
<img src="https://img.shields.io/badge/PostgreSQL-✅-4169e1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-✅-47a248?style=flat-square&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-✅-4479a1?style=flat-square&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/SQLite-✅-003b57?style=flat-square&logo=sqlite&logoColor=white" />
</td>
</tr>
<tr>
<td><strong>API Style</strong></td>
<td>
<img src="https://img.shields.io/badge/REST-✅-009688?style=flat-square" />
<img src="https://img.shields.io/badge/GraphQL-✅-e10098?style=flat-square&logo=graphql&logoColor=white" />
<img src="https://img.shields.io/badge/tRPC-✅-2596be?style=flat-square&logo=trpc&logoColor=white" />
</td>
</tr>
<tr>
<td><strong>Infrastructure</strong></td>
<td>
<img src="https://img.shields.io/badge/Docker-✅-2496ed?style=flat-square&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Multi--Tenancy-✅-ff6b6b?style=flat-square" />
</td>
</tr>
</table>

---

## 🏗️ Generated Project Structure

```
my-saas-app/
├── 📁 frontend/                 # React/Next.js application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   ├── 📁 pages/            # Route pages
│   │   ├── 📁 lib/              # Utilities & API client
│   │   └── 📄 App.tsx           # Main app component
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📁 backend/                  # Express/NestJS API
│   ├── 📁 src/
│   │   ├── 📁 auth/             # Authentication module
│   │   ├── 📁 users/            # User management
│   │   ├── 📁 tenants/          # Multi-tenancy (if enabled)
│   │   └── 📄 main.ts           # Entry point
│   ├── 📄 package.json
│   └── 📄 .env.example
│
├── 📁 docker/                   # Docker configuration
│   ├── 📄 docker-compose.yml
│   ├── 📄 frontend.Dockerfile
│   └── 📄 backend.Dockerfile
│
├── 📄 .env.example              # Environment template
├── 📄 package.json              # Monorepo workspace
└── 📄 README.md                 # Setup instructions
```

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Client Browser                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              📱 Frontend (Port 5173/3000)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Next.js 14 / React + Vite                          │    │
│  │  • Server Components • Auth Middleware • API Client │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST / GraphQL / tRPC
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                🔧 Backend API (Port 3000)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  NestJS / Express / Fastify                         │    │
│  │  • Auth Guards • Tenant Isolation • Swagger Docs    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │ Prisma / Mongoose
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   🗄️ Database Layer                          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐  │
│  │ PostgreSQL│  │  MongoDB  │  │   MySQL   │  │ SQLite  │  │
│  └───────────┘  └───────────┘  └───────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📖 Documentation

| Guide                                                | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| [🚀 Quick Start](./docs/guide/getting-started.md)    | Get up and running in 5 minutes |
| [🏗️ Architecture](./docs/ARCHITECTURE.md)            | System design and components    |
| [🎨 Stack Guide](./docs/stacks/)                     | Detailed stack documentation    |
| [🏢 Multi-Tenancy](./docs/features/multi-tenancy.md) | Tenant isolation patterns       |
| [🚢 Deployment](./docs/deployment/)                  | Production deployment guides    |
| [🔧 Development](./docs/DEVELOPMENT.md)              | Contributing to ForgeStack      |
| [🔌 Plugins](./docs/PLUGIN_DEVELOPMENT.md)           | Extend ForgeStack with plugins  |
| [🤖 AI Setup](./docs/AI_SETUP.md)                    | Local LLM integration           |

---

## 📊 Project Stats

<table>
<tr>
<td align="center"><strong>7,500+</strong><br/>Lines of Code</td>
<td align="center"><strong>150+</strong><br/>Stack Combinations</td>
<td align="center"><strong>8</strong><br/>Generators</td>
<td align="center"><strong>100%</strong><br/>TypeScript</td>
<td align="center"><strong>MIT</strong><br/>License</td>
</tr>
</table>

---

## 🗺️ Roadmap

<table>
<tr>
<th>Phase</th>
<th>Status</th>
<th>Features</th>
</tr>
<tr>
<td><strong>Phase 1-3</strong></td>
<td>✅ Complete</td>
<td>Core generators, authentication, multi-database, Docker, NestJS, Fastify, Bun+Elysia</td>
</tr>
<tr>
<td><strong>Phase 4</strong></td>
<td>✅ Complete</td>
<td>Landing page, documentation, deployment guides</td>
</tr>
<tr>
<td><strong>Phase 5</strong></td>
<td>🚧 In Progress</td>
<td>Vue + Vite, SvelteKit, Doctor command</td>
</tr>
<tr>
<td><strong>Phase 6</strong></td>
<td>🔜 Planned</td>
<td>Go + Fiber, Rust + Actix, AI code generation, Visual builder, Template marketplace</td>
</tr>
</table>

---

## 🤝 Contributing

We ❤️ contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Clone the repo
git clone https://github.com/halloffame12/forgestack-os.git
cd forgestack-os

# Install dependencies
npm install

# Build the CLI
cd packages/cli && npm run build

# Run tests
npm test

# Link for local development
npm link
```

---

## 👨‍💻 Creator

<table>
<tr>
<td>
<img src="https://github.com/halloffame12.png" width="100" style="border-radius: 50%;" alt="Sumit Chauhan" />
</td>
<td>
<strong>Sumit Chauhan</strong><br/>
Full-Stack Developer & Platform Engineer<br/><br/>
<a href="https://github.com/halloffame12">
<img src="https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white" />
</a>
<a href="https://www.linkedin.com/in/sumit-chauhan-a4ba98325/">
<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white" />
</a>
<br/><br/>
<em>Building developer tools, scalable SaaS platforms, and open-source infrastructure.</em>
</td>
</tr>
</table>

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

Copyright © 2026 Sumit Chauhan

---

## 💬 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/halloffame12/forgestack-os/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/halloffame12/forgestack-os/discussions)
- 📧 **Email**: [sumitchauhan10062004@gmail.com](mailto:sumitchauhan10062004@gmail.com)

---

<p align="center">
  <strong>⭐ Star us on GitHub — it motivates us to build more!</strong>
</p>

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/halloffame12">Sumit Chauhan</a></sub>
</p>
