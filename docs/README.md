# Documentation Index

Welcome to ForgeStack OS documentation! This is your guide to everything ForgeStack.

---

## 🚀 Get Started (5 min)

Start here if you're new to ForgeStack:

1. **[Quick Start Guide](./guide/getting-started.md)** - Installation and your first project
2. **[Supported Stacks](./stacks/README.md)** - See all available frameworks
3. **[Architecture Overview](./ARCHITECTURE.md)** - Understand how ForgeStack works

**Next**: Choose your stack and generate your first app!

---

## 👨‍💻 For Developers

### Using Generated Projects

- **[Environment Configuration](./ENVIRONMENT_GUIDE.md)** - Manage `.env`, `.env.local`, `.env.production` with Zod validation
- **[Upgrading Projects](./UPGRADE_GUIDE.md)** - Safely upgrade your generated projects with automatic migrations
- **[Local AI Setup](./AI_SETUP.md)** - Use local LLMs (Ollama, LM Studio) for code generation and analysis

### Stack-Specific Guides

- **[Next.js Guide](./stacks/)** - Server components, App Router, deployment
- **[React + Vite Guide](./stacks/)** - Client-side development, routing
- **[NestJS Guide](./stacks/)** - Modular architecture, dependency injection
- **[Express Guide](./stacks/)** - Lightweight REST APIs

---

## 🔧 For Contributors

### Development

- **[Development Quick Start](./DEVELOPMENT.md)** - Set up your development environment
- **[Architecture Deep Dive](./ARCHITECTURE.md)** - Complete system design with code examples
- **[Contributing Guide](../CONTRIBUTING.md)** - Code standards, PR process, commit messages

### Building Extensions

- **[Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)** - Build plugins that extend ForgeStack
- **[Creating Custom Generators](./ARCHITECTURE.md#creating-custom-generators)** - Add support for new stacks
- **[AST-Based Patching](./PLUGIN_DEVELOPMENT.md#ast-based-patching)** - Modify files programmatically

---

## 📊 Planning & Strategy

### Roadmap

- **[Feature Roadmap](./FEATURES_ROADMAP.md)** - Complete v0.4.0 → v1.0.0 roadmap
  - v0.4.0 (Q1 2026): Deterministic generation, Vue+Vite, Zod validation
  - v0.5.0 (Q2 2026): Plugin system, extended stacks
  - v0.6.0 (Q3 2026): Upgrade engine, CI/CD templates
  - v0.7.0 (Q4 2026): Local AI, CLI polish
  - v0.8.0+: Testing, quality gates
  - v1.0.0: Production release

### Vision & Design

- **[Architecture](./ARCHITECTURE.md)** - System design, components, data flows
- **[Design Principles](./ARCHITECTURE.md#design-principles)** - The "why" behind ForgeStack
- **[Security Considerations](./ARCHITECTURE.md#security-considerations)** - Privacy-first design

---

## 🎯 Common Tasks

### I want to...

**...create a new project**
→ [Quick Start Guide](./guide/getting-started.md)

**...upgrade my generated project**
→ [Upgrade Guide](./UPGRADE_GUIDE.md)

**...build a plugin**
→ [Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)

**...use local AI for code generation**
→ [AI Setup Guide](./AI_SETUP.md)

**...contribute to ForgeStack**
→ [Development Quick Start](./DEVELOPMENT.md) + [Contributing Guide](../CONTRIBUTING.md)

**...understand the system architecture**
→ [Architecture Deep Dive](./ARCHITECTURE.md)

**...see what's coming next**
→ [Feature Roadmap](./FEATURES_ROADMAP.md)

**...deploy my app to production**
→ [Deployment Guide](./deployment/README.md)

**...manage environment variables**
→ [Environment Configuration Guide](./ENVIRONMENT_GUIDE.md)

---

## 📚 Documentation Structure

```
docs/
├── README.md                           # This file
├── ARCHITECTURE.md                     # System design & architecture
├── DEVELOPMENT.md                      # Development setup & workflow
├── FEATURES_ROADMAP.md                # v0.4.0 → v1.0.0 roadmap
├── ENVIRONMENT_GUIDE.md               # Environment variables & Zod
├── PLUGIN_DEVELOPMENT.md              # Plugin development guide
├── UPGRADE_GUIDE.md                   # Project upgrade & migrations
├── AI_SETUP.md                        # Local AI setup & usage
│
├── guide/
│   └── getting-started.md             # Quick start for new users
│
├── stacks/
│   └── README.md                      # All supported stacks
│
├── deployment/
│   └── README.md                      # Deployment instructions
│
├── features/
│   └── multi-tenancy.md               # Multi-tenancy architecture
│
└── cli/
    └── README.md                      # CLI command reference
```

---

## 🔍 Quick Reference

### Commands

```bash
# Create project (interactive)
forgestack create my-app

# Create with options
forgestack create my-app --frontend=nextjs --backend=nestjs

# Check CLI version
forgestack --version

# Get help
forgestack --help
forgestack create --help
```

### Stack Combinations

**Popular combinations**:
- React + Vite + Express + PostgreSQL + JWT
- Next.js + NestJS + Clerk + PostgreSQL
- Next.js + NestJS + Supabase + tRPC
- React + Fastify + MongoDB + Auth.js

See [Supported Stacks](./stacks/README.md) for all combinations.

### Configuration

**Generated project structure**:
```
my-app/
├── frontend/          # React, Next.js, or Vue
├── backend/           # Express, NestJS, or Fastify
├── docker-compose.yml
├── .env              # Shared defaults (committed)
├── .env.local        # Local overrides (git-ignored)
└── .forgestack/      # ForgeStack metadata
    └── manifest.json  # File tracking for upgrades
```

---

## 🚀 Next Steps

**First time here?**
1. Read [Quick Start Guide](./guide/getting-started.md)
2. Create your first project
3. Explore the generated code
4. Check out [Stack Guide](./stacks/README.md) for your chosen frameworks

**Want to contribute?**
1. Read [Development Quick Start](./DEVELOPMENT.md)
2. Check [Feature Roadmap](./FEATURES_ROADMAP.md) for ideas
3. Follow [Contributing Guide](../CONTRIBUTING.md)

**Advanced user?**
1. Learn about [Plugin Development](./PLUGIN_DEVELOPMENT.md)
2. Set up [Local AI](./AI_SETUP.md)
3. Explore [Architecture](./ARCHITECTURE.md)

---

## 🆘 Troubleshooting

**Common issues and solutions**:

1. **"Module not found" error** → See [ENVIRONMENT_GUIDE.md](./ENVIRONMENT_GUIDE.md#troubleshooting)
2. **Upgrade conflicts** → See [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md#troubleshooting)
3. **AI not connecting** → See [AI_SETUP.md](./AI_SETUP.md#troubleshooting)
4. **Build failures** → See [DEVELOPMENT.md](./DEVELOPMENT.md#troubleshooting)

---

## 📞 Support

- **[GitHub Issues](https://github.com/halloffame12/forgestack-os/issues)** - Report bugs or request features
- **[GitHub Discussions](https://github.com/halloffame12/forgestack-os/discussions)** - Ask questions and discuss
- **[Contributing Guide](../CONTRIBUTING.md)** - Ways to help
- **[Code of Conduct](../CONTRIBUTING.md#code-of-conduct)** - Community guidelines

---

## 📋 Version Info

- **Current Version**: 0.3.3
- **Node.js Required**: 20.0.0+
- **npm Required**: 10.0.0+
- **License**: MIT

---

## 🔗 External Resources

### Learning
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)

### Tools & Services
- [Clerk Authentication](https://clerk.com)
- [Supabase](https://supabase.com)
- [Prisma ORM](https://www.prisma.io)
- [NestJS Framework](https://docs.nestjs.com)

### Community
- [GitHub Discussions](https://github.com/halloffame12/forgestack-os/discussions)
- [npm Package](https://www.npmjs.com/package/forgestack-os-cli)
- [Open Source on GitHub](https://github.com/halloffame12/forgestack-os)

---

**Happy building! 🚀**

*Last updated: January 2025*
