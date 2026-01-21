# Getting Started

Welcome to ForgeStack OS! This guide will help you get from zero to a running full-stack application in minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** or **yarn**
- **Docker** & **Docker Compose** (optional, but recommended for database and local environment)
- **Git**

## 🚀 Installation

You don't need to install ForgeStack OS globally. You can use it directly via `npx`:

```bash
npx forgestack-os-cli create my-awesome-app
```

Alternatively, if you prefer global installation:

```bash
npm install -g forgestack-os-cli
forgestack-os-cli create my-awesome-app
```

## 🛠️ Creating Your First Project

When you run the `create` command, the CLI will guide you through a series of prompts:

1. **Project Name**: Choose a name for your project directory.
2. **Frontend**: Select between `Next.js 14` (recommended) or `React + Vite`.
3. **Backend**: Choose `NestJS` (Enterprise) or `Express` (Simple).
4. **Authentication**: Pick `Clerk`, `Supabase`, `Auth.js`, `Firebase`, or `JWT`.
5. **Database**: Select `PostgreSQL`, `MongoDB`, `MySQL`, or `SQLite`.
6. **Docker**: Choose whether to generate Docker configuration.
7. **Multi-Tenancy**: Choose whether to enable tenant isolation.

## 📂 Project Structure

ForgeStack OS generates a clean, modular structure:

```
my-app/
├── apps/
│   ├── frontend/       # Your chosen frontend framework
│   └── backend/        # Your chosen backend framework
├── packages/
│   └── shared/         # Shared types and utilities
├── docker/             # Dockerfiles and orchestration
├── .env.example        # Environment variable templates
└── package.json        # Root package for workspace management
```

## 🏃 Running Locally

Once generated, follow these steps to start your app:

```bash
# 1. Enter the project
cd my-awesome-app

# 2. Start infrastructure (Databases, etc.)
docker-compose up -d

# 3. Install dependencies (if skipped during creation)
npm install

# 4. Start development servers
npm run dev
```

Your frontend will typically be at `http://localhost:3000` and your backend at `http://localhost:4000`.

## ⏭️ Next Steps

- Explore the [Stack Guide](../stacks/README.md) to understand your chosen tools.
- Learn about [Multi-Tenancy](../features/multi-tenancy.md) if you enabled it.
- Check the [Deployment Guide](../deployment/README.md) when you're ready to ship.
