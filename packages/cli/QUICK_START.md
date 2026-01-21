# Quick Start Examples

## organize Command

### Example 1: Organize Downloads Folder by Type
```bash
npx forgestack organize ~/Downloads --strategy type --duplicates
```

Result:
```
~/Downloads/
├── Images/               (45 files)
├── Documents/            (12 files)
├── Videos/               (8 files)
├── Archives/             (5 files)
├── Code/                 (23 files)
├── Audio/                (3 files)
└── Duplicates/           (3 duplicate files)
```

### Example 2: Organize Photos by Date
```bash
npx forgestack organize ~/Pictures --strategy date
```

Result:
```
~/Pictures/
├── 2024-12/              (28 files)
├── 2024-11/              (35 files)
├── 2024-10/              (22 files)
└── 2024-09/              (15 files)
```

### Example 3: Interactive Mode
```bash
npx forgestack organize
# Prompts:
# ? Enter the folder path to organize: ~/Documents
# ? How would you like to organize files? (Use arrow keys)
# ❯ By File Type (images, documents, etc.)
#   By Date (YYYY-MM)
# ? Move duplicate files to a "Duplicates" folder? (Y/n)
```

---

## run-tasks Command

### Example 1: Build Pipeline

**tasks.json:**
```json
{
  "tasks": [
    {
      "name": "Clean old build",
      "command": "rm -rf dist"
    },
    {
      "name": "Install dependencies",
      "command": "npm install"
    },
    {
      "name": "Build project",
      "command": "npm run build"
    },
    {
      "name": "Run tests",
      "command": "npm test"
    },
    {
      "name": "Generate docs",
      "command": "npm run docs"
    }
  ],
  "stopOnError": true
}
```

**Run:**
```bash
npx forgestack run-tasks ./tasks.json
```

**Output:**
```
🚀 Running Tasks

Total tasks: 5
Mode: Sequential
Stop on error: Yes

→ Running: Clean old build
✔ Clean old build completed

→ Running: Install dependencies
✔ Install dependencies completed

→ Running: Build project
✔ Build project completed

→ Running: Run tests
✔ Run tests completed

→ Running: Generate docs
✔ Generate docs completed

📊 Task Results
─────────────────────────────────────────────────
✔ Clean old build: SUCCESS
✔ Install dependencies: SUCCESS
✔ Build project: SUCCESS
✔ Run tests: SUCCESS
✔ Generate docs: SUCCESS
─────────────────────────────────────────────────

Results: 5 succeeded / 0 failed
```

### Example 2: Monorepo with Parallel Builds

**monorepo-tasks.json:**
```json
{
  "tasks": [
    {
      "name": "Lint Frontend",
      "command": "npm run lint",
      "cwd": "./packages/frontend"
    },
    {
      "name": "Lint Backend",
      "command": "npm run lint",
      "cwd": "./packages/backend"
    },
    {
      "name": "Lint CLI",
      "command": "npm run lint",
      "cwd": "./packages/cli"
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
      "name": "Build CLI",
      "command": "npm run build",
      "cwd": "./packages/cli"
    }
  ],
  "parallel": true,
  "stopOnError": false
}
```

**Run in parallel:**
```bash
npx forgestack run-tasks ./monorepo-tasks.json --parallel
```

### Example 3: CI/CD Pipeline

**ci-pipeline.json:**
```json
{
  "tasks": [
    {
      "name": "Type Check",
      "command": "npx tsc --noEmit"
    },
    {
      "name": "Lint",
      "command": "npm run lint"
    },
    {
      "name": "Unit Tests",
      "command": "npm test"
    },
    {
      "name": "Integration Tests",
      "command": "npm run test:integration"
    },
    {
      "name": "Build",
      "command": "npm run build"
    },
    {
      "name": "Deploy Preview",
      "command": "npm run deploy:preview"
    }
  ],
  "stopOnError": true
}
```

**Run:**
```bash
npx forgestack run-tasks ./ci-pipeline.json
```

### Example 4: Database Migrations with Error Continuation

**migrations.json:**
```json
{
  "tasks": [
    {
      "name": "Backup Database",
      "command": "pg_dump mydb > backup.sql"
    },
    {
      "name": "Run Migrations",
      "command": "npx prisma migrate deploy"
    },
    {
      "name": "Seed Database",
      "command": "npx prisma db seed"
    },
    {
      "name": "Verify Data Integrity",
      "command": "npm run verify:db"
    }
  ],
  "stopOnError": false
}
```

**Run and continue even if a task fails:**
```bash
npx forgestack run-tasks ./migrations.json --stop-on-error false
```

### Example 5: Development Server Setup

**dev-setup.json:**
```json
{
  "tasks": [
    {
      "name": "Install dependencies",
      "command": "npm install"
    },
    {
      "name": "Copy environment variables",
      "command": "cp .env.example .env"
    },
    {
      "name": "Generate prisma client",
      "command": "npx prisma generate"
    },
    {
      "name": "Run database migrations",
      "command": "npx prisma migrate deploy"
    },
    {
      "name": "Seed development data",
      "command": "npx prisma db seed"
    }
  ],
  "stopOnError": true
}
```

**Run for new developers:**
```bash
npx forgestack run-tasks ./dev-setup.json
```

---

## Combining Commands

### Organize and Process
```bash
# Organize files first
npx forgestack organize ./data --strategy type --duplicates

# Then run tasks to process organized files
npx forgestack run-tasks ./process-tasks.json
```

### Example: Photo Processing Workflow

**organize-photos.json:**
```bash
npx forgestack organize ~/raw-photos --strategy type --duplicates
```

**process-photos.json:**
```json
{
  "tasks": [
    {
      "name": "Convert Images to WebP",
      "command": "find ./Images -name '*.jpg' -o -name '*.png' | xargs cwebp -q 80",
      "cwd": "~/raw-photos"
    },
    {
      "name": "Generate Thumbnails",
      "command": "npm run generate:thumbnails",
      "cwd": "~/raw-photos"
    },
    {
      "name": "Compress Videos",
      "command": "npm run compress:videos",
      "cwd": "~/raw-photos"
    },
    {
      "name": "Create Archive",
      "command": "tar -czf processed-photos.tar.gz .",
      "cwd": "~/raw-photos"
    }
  ]
}
```

```bash
# Step 1: Organize
npx forgestack organize ~/raw-photos --strategy type --duplicates

# Step 2: Process
npx forgestack run-tasks ./process-photos.json
```

---

## Useful Patterns

### Pattern 1: Development Workflow

```bash
# Setup
npx forgestack run-tasks ./dev-setup.json

# Development
npx forgestack run-tasks ./dev-build.json --watch

# Pre-commit checks
npx forgestack run-tasks ./pre-commit.json
```

### Pattern 2: Deployment

```bash
# Run comprehensive checks
npx forgestack run-tasks ./deploy-checks.json

# Build and deploy
npx forgestack run-tasks ./deploy.json

# Post-deployment verification
npx forgestack run-tasks ./post-deploy-verify.json
```

### Pattern 3: Documentation and Release

```bash
# Prepare release
npx forgestack run-tasks ./release-prep.json

# Generate documentation
npx forgestack run-tasks ./generate-docs.json

# Create release artifacts
npx forgestack run-tasks ./create-release.json
```

