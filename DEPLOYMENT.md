# ForgeStack OS - Owner's Deployment Guide

**For: Sumit Chauhan (Project Owner)**

This guide explains how to deploy the ForgeStack OS platform itself (CLI, landing page, and documentation) to production.

---

## 📋 Table of Contents

1. [Running Locally](#1-running-locally)
2. [Publishing CLI to npm](#2-publishing-cli-to-npm)
3. [Deploying Landing Page to Vercel](#3-deploying-landing-page-to-vercel)
4. [Deploying Documentation to Vercel](#4-deploying-documentation-to-vercel)
5. [Optional: Platform API to Render](#5-optional-platform-api-to-render)

---

## 1. Running Locally

### Step 1.1: Install Prerequisites

**Check if you have Node.js installed:**
```bash
node --version
# Should show v20.x.x or higher
```

**If not installed:**
- Go to https://nodejs.org/
- Download LTS version (20.x)
- Run installer
- Restart terminal

**Verify npm:**
```bash
npm --version
# Should show v9.x.x or higher
```

### Step 1.2: Clone Your Repository (if not already)

```bash
# Navigate to where you want the project
cd D:\CliProject

# If not already cloned
git clone https://github.com/halloffame12/forgestack-os.git
cd forgestack-os
```

### Step 1.3: Install All Dependencies

```bash
# Install root dependencies
npm install

# Install CLI dependencies
cd packages/cli
npm install
cd ../..

# Install landing page dependencies
cd packages/landing
npm install
cd ../..
```

**Expected output:**
```
added 523 packages in 45s
```

### Step 1.4: Build the CLI

```bash
cd packages/cli

# Build TypeScript to JavaScript
npm run build
```

**Expected output:**
```
> @forgestack/cli@0.1.0 build
> tsc

# No errors = success!
```

### Step 1.5: Link CLI Globally (for local testing)

```bash
# Still in packages/cli
npm link
```

**Expected output:**
```
added 1 package in 2s
```

**Verify it works:**
```bash
forgestack --version
# Should show: 0.1.0
```

### Step 1.6: Test the CLI

```bash
# Create a test project
cd D:\CliProject
forgestack create test-app

# Answer the prompts:
? Project name: test-app
? Frontend: React + Vite
? Backend: Express
? Auth: JWT
? Database: PostgreSQL
? API: REST
? Docker: Yes
? Multi-tenant: No
```

**Alternative (Non-Interactive):**
```bash
forgestack create test-app \
  --frontend react-vite \
  --backend express \
  --auth jwt \
  --database postgresql \
  --docker
```

**Wait for generation to complete:**
```
✨ Generating your project...
✅ Created 45 files
✅ Installed dependencies
✅ Initialized Git repository
🚀 Your app is ready!
```

### Step 1.7: Run the Generated Project

```bash
cd test-app

# Start both frontend and backend
npm run dev
```

**Expected output:**
```
Frontend: http://localhost:5173
Backend: http://localhost:3000
```

**Open browser:**
- Go to http://localhost:5173
- You should see the app running!

### Step 1.8: Run Landing Page Locally

```bash
# Open new terminal
cd D:\CliProject\forgestack-os\packages\landing

# Start dev server
npm run dev
```

**Expected output:**
```
VITE v5.0.11 ready in 523 ms

➜  Local:   http://localhost:5174
➜  Network: use --host to expose
```

**Open browser:**
- Go to http://localhost:5174
- You should see the ForgeStack OS landing page!

### Step 1.9: Run Tests

```bash
cd D:\CliProject\forgestack-os\packages\cli

# Run all tests
npm test
```

**Expected output:**
```
✓ tests/validators.test.ts (4)
  ✓ Stack Validation (4)
    ✓ should validate compatible stacks
    ✓ should reject Next.js with Express
    ✓ should validate GraphQL API style
    ✓ should validate tRPC API style

Test Files  1 passed (1)
Tests  4 passed (4)
```

---

## 2. Publishing CLI to npm

### Step 2.1: Create npm Account (if you don't have one)

1. Go to https://www.npmjs.com/signup
2. Fill in:
   - Username: `halloffame12` (or your choice)
   - Email: your email
   - Password: strong password
3. Verify email
4. Enable 2FA (recommended)

### Step 2.2: Login to npm

```bash
npm login
```

**Enter your credentials:**
```
Username: halloffame12
Password: [your password]
Email: [your email]
```

**Verify login:**
```bash
npm whoami
# Should show: halloffame12
```

### Step 2.3: Update Package Name (First Time Only)

Edit `packages/cli/package.json`:

```json
{
  "name": "forgestack",
  "version": "1.0.0",
  "description": "Generate production-ready full-stack SaaS applications with a single CLI command",
  "author": "Sumit Chauhan <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/halloffame12/forgestack-os.git"
  },
  "homepage": "https://github.com/halloffame12/forgestack-os#readme",
  "bugs": {
    "url": "https://github.com/halloffame12/forgestack-os/issues"
  },
  "keywords": [
    "cli",
    "generator",
    "saas",
    "full-stack",
    "typescript",
    "nextjs",
    "nestjs",
    "react",
    "express",
    "prisma",
    "docker",
    "multi-tenancy"
  ],
  "bin": {
    "forgestack": "./dist/index.js"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### Step 2.4: Pre-Publish Checklist

```bash
cd packages/cli

# 1. Clean build
rm -rf dist node_modules
npm install
npm run build

# 2. Run tests
npm test

# 3. Check what will be published
npm pack --dry-run
```

**Review the output:**
```
npm notice package: forgestack@1.0.0
npm notice === Tarball Contents ===
npm notice 1.2kB  LICENSE
npm notice 15.3kB README.md
npm notice 2.1kB  package.json
npm notice 45.2kB dist/index.js
npm notice 523B   dist/index.d.ts
...
```

### Step 2.5: Publish to npm

```bash
# Publish as public package
npm publish --access public
```

**Expected output:**
```
npm notice Publishing to https://registry.npmjs.org/
+ forgestack@1.0.0
```

### Step 2.6: Verify Publication

**Check on npmjs.com:**
1. Go to https://www.npmjs.com/package/forgestack
2. You should see your package!

**Test installation:**
```bash
# In a different directory
cd ~
npm install -g forgestack

# Test it
forgestack --version
# Should show: 1.0.0

# Create a test project
forgestack create npm-test-app
```

### Step 2.7: Update Version for Future Releases

**When you make changes and want to publish again:**

```bash
cd packages/cli

# Update version
npm version patch  # 1.0.0 -> 1.0.1
# or
npm version minor  # 1.0.0 -> 1.1.0
# or
npm version major  # 1.0.0 -> 2.0.0

# This automatically:
# - Updates package.json version
# - Creates a git commit
# - Creates a git tag

# Build
npm run build

# Publish
npm publish
```

### Step 2.8: Unpublish (if needed - within 72 hours)

```bash
# Only if you made a mistake
npm unpublish forgestack@1.0.0

# Or unpublish entire package
npm unpublish forgestack --force
```

**⚠️ Warning:** You can only unpublish within 72 hours. After that, you need to contact npm support.

---

## 3. Deploying Landing Page to Vercel

### Step 3.1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub

### Step 3.2: Install Vercel CLI

```bash
npm install -g vercel
```

**Verify installation:**
```bash
vercel --version
# Should show: Vercel CLI 33.0.0
```

### Step 3.3: Login to Vercel

```bash
vercel login
```

**Choose login method:**
```
? Log in to Vercel
  GitHub
  GitLab
  Bitbucket
> Email
```

**If using email:**
- Enter your email
- Check inbox for verification email
- Click the link

### Step 3.4: Prepare Landing Page

```bash
cd D:\CliProject\forgestack-os\packages\landing

# Install dependencies (if not already)
npm install

# Test build locally
npm run build
```

**Expected output:**
```
vite v5.0.11 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-a1b2c3d4.css   12.34 kB │ gzip:  3.45 kB
dist/assets/index-e5f6g7h8.js   145.67 kB │ gzip: 45.67 kB
✓ built in 2.34s
```

**Test production build:**
```bash
npm run preview
```

Open http://localhost:4173 to verify it works.

### Step 3.5: Deploy to Vercel (Method 1: CLI)

```bash
# Still in packages/landing
vercel
```

**Answer the prompts:**
```
? Set up and deploy "~/forgestack-os/packages/landing"? [Y/n] y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] n
? What's your project's name? forgestack-landing
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

**Vercel will:**
1. Upload your code
2. Build the project
3. Deploy to a preview URL

**Expected output:**
```
🔗  Preview: https://forgestack-landing-abc123.vercel.app
📝  Inspect: https://vercel.com/your-name/forgestack-landing/abc123
```

**Deploy to production:**
```bash
vercel --prod
```

**Expected output:**
```
🔗  Production: https://forgestack-landing.vercel.app
```

### Step 3.6: Deploy to Vercel (Method 2: Dashboard - Recommended)

**Step 1: Push to GitHub**
```bash
cd D:\CliProject\forgestack-os

# Commit all changes
git add .
git commit -m "Prepare for deployment"
git push origin main
```

**Step 2: Import to Vercel**
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import" next to your repository
4. If not listed, click "Adjust GitHub App Permissions"

**Step 3: Configure Project**
```
Project Name: forgestack-landing
Framework Preset: Vite
Root Directory: packages/landing
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 20.x
```

**Step 4: Environment Variables (if needed)**
```
VITE_API_URL=https://your-api.com
```

**Step 5: Deploy**
1. Click "Deploy"
2. Wait 1-2 minutes
3. Click the deployment URL

**Your landing page is now live!** 🎉

### Step 3.7: Add Custom Domain

**Step 1: Go to Project Settings**
1. Click on your project
2. Go to "Settings" → "Domains"

**Step 2: Add Domain**
1. Click "Add"
2. Enter your domain: `forgestack.io`
3. Click "Add"

**Step 3: Configure DNS**

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Step 4: Wait for DNS Propagation**
- Usually takes 5-30 minutes
- Can take up to 48 hours
- Vercel will automatically issue SSL certificate

**Step 5: Verify**
- Go to https://forgestack.io
- Should show your landing page with SSL (🔒)

### Step 3.8: Enable Auto-Deploy

Vercel automatically deploys on every push to main branch.

**To configure:**
1. Go to Project Settings → Git
2. Production Branch: `main`
3. Preview Branches: All branches
4. Ignored Build Step: Leave empty

**Now every time you push:**
```bash
git add .
git commit -m "Update landing page"
git push
```

Vercel will automatically build and deploy!

---

## 4. Deploying Documentation to Vercel

### Step 4.1: Prepare Documentation

```bash
cd D:\CliProject\forgestack-os\packages\docs

# Install dependencies
npm install

# Build
npm run docs:build
```

### Step 4.2: Deploy to Vercel

**Option 1: Same as landing page (CLI)**
```bash
vercel
```

**Option 2: Dashboard**
1. Go to Vercel Dashboard
2. Add New Project
3. Import repository
4. Configure:
   ```
   Root Directory: packages/docs
   Build Command: npm run docs:build
   Output Directory: .vitepress/dist
   ```

**Your docs will be at:**
- https://forgestack-docs.vercel.app

### Step 4.3: Add to Main Domain (Optional)

**Option 1: Subdomain**
- Add domain: `docs.forgestack.io`
- Configure DNS:
  ```
  Type: CNAME
  Name: docs
  Value: cname.vercel-dns.com
  ```

**Option 2: Path-based**
- Configure in main project
- Add rewrites in `vercel.json`

---

## 5. Optional: Platform API to Render

### Step 5.1: Create Render Account

1. Go to https://render.com/
2. Sign up with GitHub
3. Authorize Render

### Step 5.2: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Configure:
   ```
   Name: forgestack-db
   Database: forgestack
   User: forgestack
   Region: Oregon (US West)
   PostgreSQL Version: 16
   Plan: Free
   ```
3. Click "Create Database"
4. Wait 2-3 minutes
5. Copy "Internal Database URL"

### Step 5.3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect repository
3. Configure:
   ```
   Name: forgestack-api
   Region: Oregon
   Branch: main
   Root Directory: packages/api (if you create it)
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```

### Step 5.4: Add Environment Variables

```
NODE_ENV=production
PORT=3000
DATABASE_URL=[paste Internal Database URL]
JWT_SECRET=your-super-secret-key-min-32-chars
FRONTEND_URL=https://forgestack-landing.vercel.app
```

### Step 5.5: Deploy

1. Click "Create Web Service"
2. Render will build and deploy
3. Monitor logs
4. Service URL: https://forgestack-api.onrender.com

### Step 5.6: Test API

```bash
curl https://forgestack-api.onrender.com/health

# Expected response:
{"status":"ok","timestamp":"2026-01-09T..."}
```

---

## 🎯 Quick Reference

### Local Development

```bash
# CLI
cd packages/cli
npm run build
npm link
forgestack create test-app

# Landing Page
cd packages/landing
npm run dev
# http://localhost:5174

# Run Tests
cd packages/cli
npm test
```

### Publishing

```bash
# npm
cd packages/cli
npm version patch
npm run build
npm publish

# Vercel (auto-deploy)
git add .
git commit -m "Update"
git push

# Manual Vercel
cd packages/landing
vercel --prod
```

### Troubleshooting

**CLI not found:**
```bash
cd packages/cli
npm link
```

**Build fails:**
```bash
rm -rf dist node_modules
npm install
npm run build
```

**Port in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Vercel build fails:**
- Check build logs
- Verify Node version (20.x)
- Check environment variables

**Render deploy fails:**
- Check deployment logs
- Verify DATABASE_URL
- Check start command

---

## 📞 Support

If you encounter issues:

1. Check error messages carefully
2. Google the error
3. Check GitHub Issues
4. Ask in GitHub Discussions
5. Contact Vercel/Render support

---

## ✅ Final Checklist

### Before Publishing CLI
- [ ] Version updated in package.json
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] Committed to Git
- [ ] Tagged release (`git tag v1.0.0`)
- [ ] Pushed to GitHub

### Before Deploying Landing Page
- [ ] Build succeeds locally
- [ ] All links work
- [ ] Images load
- [ ] Responsive on mobile
- [ ] Environment variables set
- [ ] Custom domain configured

### Before Deploying API
- [ ] Database created
- [ ] Environment variables set
- [ ] Health endpoint works
- [ ] CORS configured
- [ ] SSL certificate issued

---

**🎉 Congratulations! Your ForgeStack OS is now live!**

- CLI: https://www.npmjs.com/package/forgestack
- Landing: https://forgestack.io
- Docs: https://docs.forgestack.io
- API: https://api.forgestack.io

---

Made with ❤️ by Sumit Chauhan
