# CLI Reference

The ForgeStack OS CLI is a powerful tool to generate, manage, and update your SaaS applications.

## 🚀 Core Commands

### `create <project-name>`
Generate a new full-stack project from scratch.

```bash
npx forgestack-os-cli create my-app [options]
```

#### Options:
| Flag | Description | Options |
|------|-------------|---------|
| `--frontend` | Frontend framework | `nextjs`, `react-vite` |
| `--backend` | Backend framework | `nestjs`, `express`, `fastify`, `elysia` |
| `--auth` | Auth provider | `clerk`, `supabase`, `authjs`, `firebase`, `jwt` |
| `--database` | Database type | `postgresql`, `mongodb`, `mysql`, `sqlite` |
| `--docker` | Enable Docker | `true`, `false` |
| `--multi-tenant`| Enable multi-tenancy | `true`, `false` |
| `--skip-install`| Skip `npm install` | |
| `--skip-git` | Skip `git init` | |

---

## 🛠️ Utility Commands

### `--help`
Display help information for any command.

```bash
npx forgestack-os-cli --help
npx forgestack-os-cli create --help

# Or if installed globally:
forgestack-os-cli --help
forgestack-os-cli create --help
```

### `--version`
Display the current version of the CLI.

```bash
npx forgestack-os-cli --version

# Or if installed globally:
forgestack-os-cli --version
```

---

## 💡 Pro Tips

### Interactive Mode
If you run `npx forgestack-os-cli create my-app` without any flags, it will start an interactive prompt session which is the recommended way for beginners.

### Flag Shortcuts
You can combine flags for rapid generation in CI/CD environments:
```bash
npx forgestack-os-cli create ci-test --frontend=nextjs --backend=nestjs --auth=clerk --skip-install --skip-git
```

### Auto-Normalization
The CLI is smart! If you provide variations like `--frontend=Next.js` or `--auth=NextAuth`, it will automatically map them to the correct internal slugs (`nextjs`, `authjs`).
