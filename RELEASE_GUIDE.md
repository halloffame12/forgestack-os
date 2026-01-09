# ForgeStack OS - Quick Release Guide

This file contains direct, accurate commands to publish your project components to npm, Vercel, and Render.

---

## 📦 1. CLI Tool -> npmjs.com

**Prerequisites:**
- `npm login` (Run once)

**Commands:**

```bash
# 1. Go to CLI package
cd packages/cli

# 2. Bump version (creates git tag automatically)
npm version patch  # Use 'minor' or 'major' as needed

# 3. Build the project
npm run build

# 4. Public Publish
npm publish --access public
```

---

## ▲ 2. Landing Page -> Vercel

**Prerequisites:**
- `npm i -g vercel`
- `vercel login`

**Commands:**

```bash
# 1. Go to landing package
cd packages/landing

# 2. Deploy directly to production
vercel --prod
```

*Note: The first time you run this, it will ask to link the project. Select defaults.*

---

## ☁️ 3. Backend/API -> Render

Render deploys directly from your GitHub repository.

**Fastest Method (Git Push):**

```bash
# 1. Commit all your changes
git add .
git commit -m "Release: Update backend"

# 2. Push to main branch
git push origin main
```

**Alternative (Validation Deployment):**
If you want to deploy a specific endpoint or docker container without git, it's recommended to stick to the Git workflow for Render as it maintains state best.

---

## 🚀 Automation Script (Windows)

Save this code as `deploy.ps1` in your root folder to deploy everything at once.

```powershell
Write-Host "🚀 Starting Global Release..." -ForegroundColor Cyan

# 1. Publish CLI
Write-Host "📦 Publishing CLI..."
cd packages/cli
call npm version patch
call npm run build
call npm publish --access public
cd ../..

# 2. Deploy Landing Page
Write-Host "▲ Deploying Landing Page..."
cd packages/landing
call vercel --prod
cd ../..

# 3. Push to GitHub (Triggers Render)
Write-Host "☁️ Triggering Render via Git..."
git add .
git commit -m "Release: Automated deployment"
git push origin main

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
```
