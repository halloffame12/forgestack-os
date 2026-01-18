# Upgrade & Migration Guide

Learn how to safely upgrade ForgeStack-generated projects with automatic migration support.

---

## Overview

ForgeStack provides:

- **Safe file tracking** via `.forgestack/manifest.json`
- **Automatic upgrade detection** with version compatibility checking
- **Safe migrations** with merge conflict resolution
- **Backup & rollback** capabilities
- **Plugin-compatible upgrades** via hooks

---

## How It Works

```
forgestack upgrade my-app
    ↓
1. Verify manifest exists
    ↓
2. Detect current version
    ↓
3. Fetch migration plan (v0.x → v1.x)
    ↓
4. Backup project (.forgestack/backup-<date>/)
    ↓
5. Run pre-upgrade hooks
    ↓
6. Apply core updates
    ↓
7. Apply plugin updates
    ↓
8. Detect merge conflicts
    ↓
9. Prompt for resolution
    ↓
10. Run post-upgrade hooks
    ↓
11. Success! Or rollback on error
```

---

## Manifest File

ForgeStack tracks all generated files in `.forgestack/manifest.json`:

```json
{
  "version": "0.4.0",
  "timestamp": "2025-01-15T10:30:00Z",
  "forgestack": {
    "version": "0.4.0"
  },
  "config": {
    "framework": "next",
    "backend": "nest",
    "database": "postgresql",
    "auth": "jwt"
  },
  "files": {
    "src/index.ts": {
      "hash": "sha256:abc123...",
      "generated": true,
      "type": "core"
    },
    "src/routes/users.ts": {
      "hash": "sha256:def456...",
      "generated": true,
      "type": "routes"
    },
    "custom-file.ts": {
      "hash": "sha256:ghi789...",
      "generated": false,
      "type": "custom"
    }
  },
  "plugins": {
    "payments-stripe": "1.0.0"
  },
  "migrations": [
    {
      "from": "0.3.0",
      "to": "0.4.0",
      "date": "2025-01-15T10:30:00Z",
      "status": "applied",
      "changes": 5
    }
  ]
}
```

---

## Upgrading Projects

### Basic Upgrade

```bash
cd my-app

# Check upgrade availability
forgestack upgrade --check
# Output:
# ✅ Upgrade available: 0.4.0 → 0.5.0
# 📝 Changes: 12 files updated, 3 new features
# ⏱️  Estimated time: 2 minutes

# Perform upgrade
forgestack upgrade
# Backup created: .forgestack/backup-2025-01-15T10-30-00/
# Running pre-upgrade hooks...
# Updating core files...
# Running post-upgrade hooks...
# ✅ Upgrade complete! (0 conflicts)
```

### Upgrade with Specific Version

```bash
forgestack upgrade --to=0.5.0
```

### Dry Run

```bash
forgestack upgrade --dry-run
# Shows what would happen without making changes
```

### With Custom Config

```bash
forgestack upgrade \
  --config ./upgrade.config.ts \
  --skip-plugins \
  --strategy=manual
```

---

## Migration Strategies

### Auto (Default)

```bash
forgestack upgrade --strategy=auto
# Automatically resolves conflicts:
# - Keep user changes in custom files
# - Update generated files
# - Merge dependencies safely
```

### Manual

```bash
forgestack upgrade --strategy=manual
# For each conflict, prompts you:
# ✘ Conflict in src/routes/users.ts
#   a) Keep generated version
#   b) Keep my changes
#   c) Review diff
#   >
```

### Merge (Advanced)

```bash
forgestack upgrade --strategy=merge
# Uses smart merge algorithm:
# - JSON: merges objects intelligently
# - Code: AST-based conflict detection
# - YAML: deep merge with conflict markers
```

---

## Handling Conflicts

### Example: Conflicting File

```typescript
// Current version (0.4.0)
export async function getUsers() {
  return db.users.findMany();
}
```

```typescript
// New version (0.5.0)
export async function getUsers(limit = 10) {
  return db.users.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}
```

Your file was customized:

```typescript
export async function getUsers() {
  const users = await db.users.findMany();
  // Your custom caching logic
  return cache.set("users", users);
}
```

**Resolution Options**:

```bash
# 1. Keep your version (custom caching preserved, misses new feature)
forgestack upgrade --resolve=keep-user

# 2. Keep new version (gets new feature, loses custom caching)
forgestack upgrade --resolve=keep-generated

# 3. Manual merge (combine both)
# Opens editor to merge changes
forgestack upgrade --resolve=manual
```

### Merge Markers (Manual Resolution)

```typescript
// After upgrade with conflicts
export async function getUsers() {
<<<<<<< GENERATED
  return db.users.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
||||||| 0.4.0
  return db.users.findMany();
=======
  const users = await db.users.findMany();
  return cache.set('users', users);
>>>>>>> YOUR_CHANGES
}
```

Resolved:

```typescript
export async function getUsers(limit = 10) {
  const users = await db.users.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  // Preserve custom caching
  return cache.set("users", users);
}
```

---

## Migration Hooks

Plugins can handle upgrades via hooks:

```typescript
// plugins/my-plugin/index.ts
export default {
  name: "my-plugin",
  hooks: {
    async beforeUpgrade(ctx: UpgradeContext) {
      // Backup plugin-specific state
      const state = ctx.loadFile("plugin-state.json");
      ctx.backup("plugin-state-pre-upgrade.json", state);
    },

    async afterUpgrade(ctx: UpgradeContext) {
      // Migrate plugin configuration
      if (ctx.previousVersion === "1.0.0" && ctx.newVersion === "1.1.0") {
        // Migrate old config format to new format
        const oldConfig = ctx.loadFile("plugin-config.json");
        const newConfig = migrateConfig(oldConfig);
        ctx.writeFile("plugin-config.json", newConfig);
      }

      ctx.log("✅ Plugin upgraded successfully");
    },
  },
} as Plugin;
```

---

## Database Migrations

ForgeStack tracks database schema changes:

```bash
# Auto-generated migration files
my-app/migrations/
├── 001_initial_schema.sql
├── 002_add_users_table.sql
├── 003_add_posts_table.sql
└── 004_add_indexes.sql    ← New in v0.5.0
```

Upgrade handles migrations:

```bash
forgestack upgrade
# Detected new migrations: 001
# Running migrations...
#   ✅ 004_add_indexes.sql
# Database updated
```

---

## Backing Up & Rollback

### Automatic Backup

Every upgrade creates a backup:

```bash
# After upgrade to 0.5.0
ls .forgestack/backup-2025-01-15T10-30-00/
├── package.json
├── src/
├── manifest.json
└── metadata.json
```

### Manual Backup

```bash
forgestack backup create
# Backup created: .forgestack/backup-2025-01-15T10-32-00/
```

### Rollback

```bash
# List available backups
forgestack backup list
# - 2025-01-15T10-30-00 (upgrade to 0.5.0)
# - 2025-01-15T10-20-00 (upgrade to 0.4.5)

# Restore specific backup
forgestack backup restore 2025-01-15T10-30-00
# ⚠️  This will restore your project to the state before the upgrade
# Continue? (y/N) y
# ✅ Restored to 2025-01-15T10-30-00
# Manifest updated to 0.4.0

# Or rollback to previous upgrade
forgestack backup rollback
# ✅ Rolled back to v0.4.0
```

---

## Dependency Updates

ForgeStack intelligently manages `package.json`:

```typescript
// Migration plan
{
  version: '0.5.0',
  dependencies: {
    add: {
      'new-package': '^1.0.0',
    },
    update: {
      'express': '^4.18.0 → ^4.20.0',
    },
    remove: {
      'deprecated-package': '^2.0.0',
    },
  },
}
```

During upgrade:

```bash
forgestack upgrade
# Detected dependency changes:
#   + new-package@^1.0.0
#   ~ express@^4.18.0 → ^4.20.0
#   - deprecated-package@^2.0.0
# Continue? (y/N) y
# ✅ Updated package.json
# Run: npm install
```

---

## Upgrade Configuration

Create `forgestack.config.ts`:

```typescript
import { defineConfig } from "forgestack-os";

export default defineConfig({
  // Upgrade settings
  upgrade: {
    // Which files to keep during upgrade
    preserveFiles: ["README.md", "CONTRIBUTING.md", "docs/**"],

    // Automatic conflict resolution strategy
    conflictStrategy: "auto",

    // Skip certain file types
    skipPatterns: ["node_modules/**", "dist/**", ".next/**"],

    // Hooks for custom upgrade logic
    beforeUpgrade: async (ctx) => {
      console.log("Starting upgrade...");
    },

    afterUpgrade: async (ctx) => {
      console.log("Upgrade complete!");
      // Run tests
      await ctx.runCommand("npm test");
    },

    // Backup settings
    backup: {
      keep: 5, // Keep last 5 backups
      compress: true,
    },
  },
});
```

---

## Checking Upgrade Status

```bash
# Show current status
forgestack status

# Output:
# ForgeStack Project Status
# ├─ Version: 0.4.0
# ├─ Last upgrade: 2025-01-15
# ├─ Plugins: 2 (payments-stripe@1.0.0, analytics-posthog@2.1.0)
# ├─ Tracked files: 45
# ├─ Modified files: 3 (tracked_file.ts, src/routes.ts, tsconfig.json)
# └─ Next version: 0.5.0 (available now!)
```

---

## Troubleshooting

### Upgrade fails with no manifest

```bash
# Create manifest from current state
forgestack manifest init

# or specify version manually
forgestack manifest init --version 0.4.0
```

### Too many conflicts

```bash
# Review all conflicts
forgestack upgrade --strategy=manual

# Or use file-by-file approach
forgestack upgrade --interactive

# For complex cases, revert and start over
forgestack backup rollback
```

### Rollback failed

```bash
# Manual restoration
cp -r .forgestack/backup-<date>/* .
git checkout .
npm install
```

---

## Migration Examples

### v0.4.0 → v0.5.0

**New Features**:

- Plugin system support
- Zod environment validation
- Docker Compose improvements

**Breaking Changes**: None

**What updates**:

- ✅ Core CLI
- ✅ Generator templates
- ✅ Type definitions
- ✅ Config schemas

**User action**: Run `npm install`

### v0.3.x → v0.4.0

**New Features**:

- Deterministic generation (--seed flag)
- Multi-environment configuration
- Plugin system foundation

**Breaking Changes**:

- `generateConfig()` renamed to `generateDeterministic()`
- Environment variables now use Zod validation

**Migration steps**:

```bash
forgestack upgrade --to=0.4.0

# Update your code if using generateConfig():
# Change: generateConfig(...)
# To:     generateDeterministic(...)

# Test generation
npm run build
npm test

# Done!
```

---

## Best Practices

✅ **Do**:

- Test upgrades in a branch first
- Review backup before deleting old backups
- Keep manifests committed to version control
- Run tests after each upgrade
- Update dependencies regularly

❌ **Don't**:

- Delete `.forgestack/` directory
- Manually edit `manifest.json`
- Skip backup creation
- Upgrade without testing
- Use very old versions

---

## Resources

- [Manifest Format Reference](https://github.com/halloffame12/forgestack-os/wiki/Manifest-Format)
- [Migration Planning Guide](./ROADMAP.md)
- [Version History](./CHANGELOG.md)

---

**Next**: [Local AI Setup](./AI_SETUP.md)
