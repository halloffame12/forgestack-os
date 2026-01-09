# Stack Guide

ForgeStack OS supports a wide variety of frontend, backend, database, and authentication technologies. This guide provides technical details for each.

## 💻 Frontend Frameworks

### Next.js 14
- **Routing**: App Router (Server Components)
- **Styling**: Tailwind CSS
- **Features**: API Routes, Middleware, Server Actions ready.
- **State Management**: React Context / Hooks

### React + Vite
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: React Context / Hooks

---

## ⚙️ Backend Frameworks

### NestJS (Enterprise)
- **Architecture**: Modular (Modules, Controllers, Services)
- **Typing**: Strict TypeScript
- **Features**: Swagger/OpenAPI built-in, Validation decorators, Dependency Injection.

### Express (Simple)
- **Architecture**: Clean Middleware-based
- **Typing**: TypeScript modules
- **Features**: Modular router, standard JSON parsing, CORS ready.

### Fastify (High Performance)
- **Performance**: Extremely fast overhead
- **Features**: Schema-based validation, plugin architecture.

### Bun + Elysia
- **Runtime**: Bun
- **Framework**: Elysia
- **Features**: End-to-end type safety with Eden, blazing fast performance.

---

## 🔐 Authentication

| Provider | Description | Best For |
|----------|-------------|----------|
| **Clerk** | Managed User Auth & Dashboard | Rapid SaaS development |
| **Supabase** | Open-source Firebase alternative| Full backend-as-a-service feel |
| **Auth.js** | Flexible library (NextAuth) | Custom logic & multiple providers |
| **JWT** | Simple, local token auth | Internal tools, simple apps |
| **Firebase** | Google's managed auth | Mobile-heavy or simple web apps |

---

## 🗄️ Databases & ORMs

### Relational (SQL)
- **PostgreSQL**: Robust, production-standard.
- **MySQL**: Highly compatible, widely used.
- **SQLite**: Local-first, zero-config (great for dev/testing).
- **ORM**: **Prisma** (type-safe queries, migrations).

### NoSQL
- **MongoDB**: Schema-less flexibility.
- **ODM**: **Mongoose** (structured document modeling).

---

## 🔧 API Styles

- **REST**: Standard resource-based endpoints.
- **GraphQL**: Query exactly what you need (Apollo Server).
- **tRPC**: End-to-end type safety without code generation.
