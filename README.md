# ForgeStack OS

<div align="center">

![ForgeStack OS](https://img.shields.io/badge/ForgeStack-OS-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-0.3.5-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Node](https://img.shields.io/badge/Node-18+-green?style=for-the-badge&logo=node.js)

**One platform. Any stack. Production-ready.**

Generate full-stack SaaS applications with a single CLI command.

[Get Started](#quick-start) · [Documentation](./docs) · [Examples](#examples) · [Contributing](./CONTRIBUTING.md)

</div>

---

## 🚀 Quick Start

```bash
# Using npx (recommended)
npx forgestack-os-cli create my-saas-app

# Install globally
npm install -g forgestack-os-cli

# Create a new project
npx forgestack-os-cli create my-saas-app

# Or if installed globally:
forgestack-os-cli create my-saas-app

# Follow the interactive prompts
? Choose your frontend framework: Next.js 14 (App Router)
? Choose your backend framework: NestJS (Enterprise)
? Choose your authentication: Clerk
? Choose your database: PostgreSQL + Prisma
? API style: REST
? Enable Docker? Yes
? Enable multi-tenancy? Yes

# Start development
cd my-saas-app
npm run dev
```

**That's it!** You now have a production-ready full-stack application with:

- ✅ Complete authentication flow
- ✅ Multi-tenancy support
- ✅ Database integration
- ✅ Docker configuration
- ✅ TypeScript throughout
- ✅ API documentation (Swagger)

---

## 🛠️ Utility Commands (New in v0.3.5)

Beyond project generation, ForgeStack CLI now includes powerful utility commands:

### 📁 Organize - File Organization Utility

Organize files by type or date with automatic duplicate detection:

```bash
# Organize by file type
npx forgestack-os-cli organize ~/Downloads --strategy type --duplicates

# Organize by date (YYYY-MM format)
npx forgestack-os-cli organize ~/Photos --strategy date

# Interactive mode
npx forgestack-os-cli organize
```

**Features:**
- 9 file categories (Images, Documents, Videos, Audio, Code, Archives, Data, Executables, Others)
- MD5-based duplicate detection
- Automatic system folder exclusion (node_modules, .git, dist, etc.)
- Cross-platform compatible

### 🚀 Run-Tasks - Batch Task Runner

Execute shell commands from JSON configuration with sequential or parallel execution:

```bash
# Run tasks from config file
npx forgestack-os-cli run-tasks ./tasks.json

# Run in parallel mode
npx forgestack-os-cli run-tasks ./tasks.json --parallel

# Interactive mode
npx forgestack-os-cli run-tasks
```

**Example tasks.json:**
```json
{
  "tasks": [
    {
      "name": "Build Frontend",
      "command": "npm run build",
      "cwd": "./packages/frontend"
    },
    {
      "name": "Build Backend",
      "command": "npm run build",
      "cwd": "./packages/backend"
    }
  ],
  "parallel": true,
  "stopOnError": false
}
```

**Features:**
- Sequential or parallel execution
- Task-specific working directories
- Configurable error handling
- Cross-platform shell support
- Comprehensive error reporting

---

## ✨ Features

### 🛠️ **Utility Commands** *(New in v0.3.5)*

**File Organization - `organize` command**
- Organize by file type or date (YYYY-MM format)
- MD5-based duplicate detection
- 9 file categories (Images, Documents, Videos, Audio, Code, Archives, Data, Executables, Others)
- Automatic system folder exclusion (node_modules, .git, dist, etc.)

**Task Runner - `run-tasks` command**
- Batch command execution (sequential or parallel modes)
- Task-specific working directories
- Cross-platform shell support

---

### 🎯 **Local-First**

- Works 100% offline
- No account required
- No vendor lock-in
- Your code, your machine

### 🔧 **Any Stack Combination**

- **150+ valid combinations**
- Mix and match frameworks
- Choose your preferred tools
- Production-tested stacks

### � **Production-Ready**

- Not just boilerplate
- Complete authentication
- Multi-tenancy built-in
- Security best practices
- Docker configuration
- Environment management

### 💎 **Developer Experience**

- Full TypeScript support
- Auto-generated API docs
- Hot reload in development
- Comprehensive error handling
- ESLint + Prettier configured

---

## � Supported Stacks

### Frontend

- ✅ **React + Vite** - Fast, modern React development
- ✅ **Next.js 14** - App Router, Server Components, SSR
- 🔜 **Vue + Vite** - Progressive JavaScript framework
- 🔜 **SvelteKit** - Cybernetically enhanced web apps

### Backend

- ✅ **Express** - Fast, unopinionated Node.js framework
- ✅ **NestJS** - Enterprise-grade, modular architecture
- ✅ **Fastify** - High-performance Node.js framework
- ✅ **Bun + Elysia** - Blazing fast JavaScript runtime
- 🔜 **Go + Fiber** - High-performance Go framework

### Authentication

- ✅ **JWT** - Built-in token-based authentication
- ✅ **Clerk** - Complete user management (recommended for SaaS)
- ✅ **Supabase Auth** - Open-source Firebase alternative
- ✅ **Auth.js (NextAuth)** - Flexible authentication
- ✅ **Firebase Auth** - Google's authentication service

### Database

- ✅ **PostgreSQL** - Powerful relational database (Prisma ORM)
- ✅ **MongoDB** - Flexible document database (Mongoose ODM)
- ✅ **MySQL** - Popular relational database (Prisma ORM)
- ✅ **SQLite** - Lightweight embedded database (Prisma ORM)

### API Styles

- ✅ **REST** - Traditional RESTful APIs
- ✅ **GraphQL** - Query language for APIs (Apollo Server)
- ✅ **tRPC** - End-to-end type-safe APIs

### Infrastructure

- ✅ **Docker** - Containerization with Docker Compose
- ✅ **Multi-Tenancy** - Built-in tenant isolation

---

## 📚 Examples

### Example 1: Next.js + NestJS + Clerk + PostgreSQL

```bash
npx forgestack-os-cli create my-enterprise-app

? Frontend: Next.js 14 (App Router)
? Backend: NestJS (Enterprise)
? Auth: Clerk
? Database: PostgreSQL + Prisma
? API: REST
? Docker: Yes
? Multi-tenancy: Yes
```

**Generated files**: 52 production-ready files including:

- Next.js App Router with server components
- NestJS modules, controllers, services
- Clerk authentication integration
- Prisma schema with multi-tenancy
- Docker Compose configuration
- Complete TypeScript types

### Example 2: React + Express + JWT + MongoDB

```bash
npx forgestack-os-cli create my-startup-app

? Frontend: React + Vite
? Backend: Express
? Auth: JWT
? Database: MongoDB + Mongoose
? API: GraphQL
? Docker: Yes
? Multi-tenancy: No
```

**Generated files**: 45 production-ready files including:

- React + Vite with TailwindCSS
- Express with Apollo Server
- JWT authentication middleware
- Mongoose models and schemas
- GraphQL resolvers and types

### Example 3: Next.js + NestJS + Supabase + tRPC

```bash
npx forgestack-os-cli create my-modern-app

? Frontend: Next.js 14 (App Router)
? Backend: NestJS (Enterprise)
? Auth: Supabase
? Database: PostgreSQL + Prisma
? API: tRPC
? Docker: Yes
? Multi-tenancy: Yes
```

**Generated files**: 50+ production-ready files with:

- Full type-safety end-to-end
- Supabase authentication
- tRPC procedures with Zod validation
- Row-level security policies

---

## 🏗️ Architecture

### Generated Project Structure

```
my-app/
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & API client
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── tsconfig.json
│
├── backend/               # Backend application
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # Users module
│   │   ├── database/     # Database configuration
│   │   └── main.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml    # Docker orchestration
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

### System Architecture

```
┌─────────────────────────────────────┐
│         Frontend (Port 5173)        │
│  Next.js / React+Vite               │
│  - Auth Middleware                  │
│  - API Client                       │
│  - Protected Routes                 │
└──────────────┬──────────────────────┘
               │ HTTP/REST/GraphQL/tRPC
               ↓
┌─────────────────────────────────────┐
│         Backend (Port 3000)         │
│    NestJS / Express                 │
│  - Auth Guards                      │
│  - Tenant Interceptors              │
│  - API Documentation                │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│           Database                  │
│  PostgreSQL / MongoDB               │
│  - Multi-tenant Schema              │
│  - Migrations                       │
└─────────────────────────────────────┘
```

---

## 🎯 Use Cases

### SaaS Applications

- Multi-tenant architecture built-in
- Organization/team management
- Subscription handling ready
- User authentication complete

### Internal Tools

- Admin dashboards
- Data management systems
- Analytics platforms
- Monitoring tools

### MVPs & Prototypes

- Rapid development
- Production-ready from day one
- Easy to extend
- No technical debt

### Learning Projects

- Modern stack examples
- Best practices implemented
- Well-structured code
- Comprehensive comments

---

## 🔧 CLI Commands

### Create Project

```bash
npx forgestack-os-cli create <project-name> [options]

# Or if installed globally:
forgestack-os-cli create <project-name> [options]

Options:
  --frontend <framework>    Frontend framework (react-vite, nextjs, vue-vite, sveltekit)
  --backend <framework>     Backend framework (express, fastify, nestjs, bun-elysia, go-fiber)
  --auth <provider>         Auth provider (jwt, clerk, supabase, authjs, firebase)
  --database <db>           Database (postgresql, mongodb, mysql, sqlite, supabase-db)
  --api <style>             API style (rest, graphql, trpc)
  --docker                  Enable Docker
  --multi-tenant            Enable multi-tenancy
  --skip-install            Skip dependency installation
  --skip-git                Skip Git initialization
```

### Examples

```bash
# Interactive mode (recommended)
npx forgestack-os-cli create my-app

# With options
npx forgestack-os-cli create my-app --frontend=nextjs --backend=nestjs --auth=clerk

# Skip installation
npx forgestack-os-cli create my-app --skip-install

# Help
npx forgestack-os-cli --help
npx forgestack-os-cli create --help
```

---

## 📖 Documentation

### Getting Started

- **[Quick Start Guide](./docs/guide/getting-started.md)** - Installation and first project
- **[Development Quick Start](./docs/DEVELOPMENT.md)** - Set up your development environment

### User Guides

- **[Stack Guide](./docs/stacks/)** - Detailed stack documentation
- **[Multi-Tenancy](./docs/features/multi-tenancy.md)** - Multi-tenant architecture
- **[Deployment](./docs/deployment/)** - Deploy to production
- **[Environment Configuration](./docs/ENVIRONMENT_GUIDE.md)** - Manage environment variables and Zod validation
- **[Upgrading Projects](./docs/UPGRADE_GUIDE.md)** - Safely upgrade generated projects with migrations

### Advanced Topics

- **[Architecture Overview](./docs/ARCHITECTURE.md)** - Complete system design and components
- **[Plugin Development](./docs/PLUGIN_DEVELOPMENT.md)** - Build plugins to extend ForgeStack
- **[Local AI Setup](./docs/AI_SETUP.md)** - Use local LLMs for code generation and analysis
- **[Feature Roadmap](./docs/FEATURES_ROADMAP.md)** - See what's coming in v0.4.0 → v1.0.0

### Reference

- **[API Reference](./docs/cli/)** - CLI commands and options
- **[CHANGELOG](./CHANGELOG.md)** - Version history and release notes
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

---

## � Deployment

### Quick Deploy

**Vercel (Frontend)**:

```bash
cd frontend
vercel --prod
```

**Render (Backend)**:

```bash
cd backend
# Connect GitHub repo to Render
# Auto-deploys on push
```

**Docker (Full Stack)**:

```bash
docker-compose up -d
```

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/halloffame12/forgestack-os.git
cd forgestack-os

# Install dependencies
npm install

# Build CLI
cd packages/cli
npm run build

# Run tests
npm test

# Link for local testing
npm link
```

---

## 📊 Stats

- **7,000+** lines of production code
- **150+** valid stack combinations
- **8** specialized generators
- **100%** TypeScript
- **MIT** licensed

---

## 🗺️ Roadmap

### Phase 1 ✅ (Complete)

- React + Vite frontend
- Express backend
- JWT authentication
- Multi-database support
- Docker configuration

### Phase 2 ✅ (Complete)

- Next.js 14 App Router
- NestJS backend
- Clerk & Supabase auth
- GraphQL & tRPC support
- Automated tests

### Phase 3 ✅ (Complete)

- Fastify backend support
- Bun + Elysia backend support
- Auth.js & Firebase Auth integration
- Multi-stage Docker optimization
- Cross-platform CLI hardening

### Phase 4 ✅ (Complete)

- Landing page
- Documentation site
- Deployment guides

### Phase 5 🔜 (Planned)

- Vue + Vite frontend
- SvelteKit frontend

### Phase 6 🔜 (Future)

- Go + Fiber backend
- Rust + Actix backend
- AI-powered code generation
- Visual project builder
- Template marketplace

---

## 👨‍💻 Creator

**Sumit Chauhan**  
Full-Stack Developer & Platform Engineer

- GitHub: [@halloffame12](https://github.com/halloffame12)
- LinkedIn: [Sumit Chauhan](https://www.linkedin.com/in/sumit-chauhan-a4ba98325/)

> Building developer tools, scalable SaaS platforms, and open-source infrastructure.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

Copyright © 2026 Sumit Chauhan

---

## 🙏 Acknowledgments

- Inspired by modern development workflows
- Built with love for the developer community
- Powered by open-source technologies

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/halloffame12/forgestack-os/issues)
- **Discussions**: [GitHub Discussions](https://github.com/halloffame12/forgestack-os/discussions)
- **Email**: [sumitchauhan10062004@gmail.com](mailto:sumitchauhan10062004@gmail.com)

---

<div align="center">

**⭐ Star us on GitHub if ForgeStack OS helped you!**

Made with ❤️ by [Sumit Chauhan](https://github.com/halloffame12)

</div>
