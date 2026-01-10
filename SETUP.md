# ForgeStack OS - Complete Setup & Deployment Guide

This guide provides step-by-step instructions for setting up ForgeStack OS v0.2.5 locally, deploying to production, and publishing to npm.

---

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Publishing CLI to npm](#publishing-cli-to-npm)
3. [Deploying Landing Page to Vercel](#deploying-landing-page-to-vercel)
4. [Deploying Backend to Render](#deploying-backend-to-render)
5. [Deploying Full Stack with Docker](#deploying-full-stack-with-docker)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

---

## 1. Local Development Setup

### Prerequisites

- **Node.js**: v20+ ([Download](https://nodejs.org/))
- **npm**: v9+ (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Docker**: (Optional) For containerization ([Download](https://www.docker.com/))

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/halloffame12/forgestack-os.git

# Navigate to the project
cd forgestack-os
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install CLI dependencies
cd packages/cli
npm install

# Install landing page dependencies (if needed)
cd ../landing
npm install

# Return to root
cd ../..
```

### Step 3: Build the CLI

```bash
cd packages/cli

# Build TypeScript
npm run build

# Link CLI globally for local testing
npm link

# Verify installation
forgestack --version
```

### Step 4: Test the CLI

```bash
# Create a test project
forgestack create test-app

# Follow the prompts
? Choose your frontend framework: React + Vite
? Choose your backend framework: Express
? Choose your authentication: JWT
? Choose your database: PostgreSQL
? API style: REST
? Enable Docker? Yes
? Enable multi-tenancy? No

# Navigate to the test project
cd test-app

# Start development servers
npm run dev
```

**Pro Tip: Non-Interactive Mode (Great for CI/CD)**

You can also run the CLI without prompts using flags:

```bash
forgestack create my-app \
  --frontend react-vite \
  --backend express \
  --auth jwt \
  --database postgresql \
  --docker
```

### Step 5: Run Tests

```bash
cd packages/cli

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 2. Publishing CLI to npm

### Prerequisites

- npm account ([Sign up](https://www.npmjs.com/signup))
- npm CLI logged in

### Step 1: Login to npm

```bash
# Login to npm
npm login

# Enter your credentials
Username: your-username
Password: your-password
Email: your-email@example.com
```

### Step 2: Update Package Information

Edit `packages/cli/package.json`:

```json
{
  "name": "@your-username/forgestack",
  "version": "1.0.0",
  "description": "Generate production-ready full-stack SaaS applications",
  "author": "Your Name <your-email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/forgestack-os.git"
  },
  "keywords": [
    "cli",
    "generator",
    "saas",
    "full-stack",
    "typescript",
    "nextjs",
    "nestjs",
    "react"
  ],
  "bin": {
    "forgestack": "./dist/index.js"
  }
}
```

### Step 3: Prepare for Publishing

```bash
cd packages/cli

# Ensure everything builds
npm run build

# Run tests
npm test

# Check package contents
npm pack --dry-run
```

### Step 4: Publish to npm

```bash
# Publish as public package
npm publish --access public

# Or for scoped package
npm publish
```

### Step 5: Verify Publication

```bash
# Install your package globally
npm install -g @your-username/forgestack

# Test it
forgestack create my-test-app

# Uninstall when done testing
npm uninstall -g @your-username/forgestack
```

### Step 6: Update Version (for future releases)

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Publish new version
npm publish
```

### Publishing Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run all tests (`npm test`)
- [ ] Build successfully (`npm run build`)
- [ ] Update README if needed
- [ ] Commit all changes
- [ ] Create git tag (`git tag v1.0.0`)
- [ ] Push to GitHub (`git push && git push --tags`)
- [ ] Publish to npm (`npm publish`)
- [ ] Verify on npmjs.com

---

## 3. Deploying Landing Page to Vercel

### Prerequisites

- Vercel account ([Sign up](https://vercel.com/signup))
- Vercel CLI installed: `npm install -g vercel`

### Method 1: Deploy via Vercel CLI

#### Step 1: Prepare Landing Page

```bash
cd packages/landing

# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

#### Step 2: Login to Vercel

```bash
# Login to Vercel
vercel login

# Follow the authentication flow
```

#### Step 3: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Step 4: Configure Project Settings

```bash
# Set environment variables (if needed)
vercel env add VITE_API_URL production

# Set build settings
# Framework Preset: Vite
# Build Command: npm run build
# Output Directory: dist
# Install Command: npm install
```

### Method 2: Deploy via Vercel Dashboard

#### Step 1: Push to GitHub

```bash
# Commit your changes
git add .
git commit -m "Prepare landing page for deployment"
git push origin main
```

#### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select `packages/landing` as the root directory

#### Step 3: Configure Build Settings

```
Framework Preset: Vite
Root Directory: packages/landing
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 20.x
```

#### Step 4: Add Environment Variables

```
VITE_API_URL=https://your-api.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx (if using Clerk)
```

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL

### Custom Domain Setup

#### Step 1: Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `forgestack.io`)
3. Follow DNS configuration instructions

#### Step 2: Configure DNS

Add these records to your DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Step 3: Verify Domain

1. Wait for DNS propagation (up to 48 hours)
2. Vercel will automatically issue SSL certificate
3. Your site will be live at your custom domain

### Vercel Deployment Checklist

- [ ] Build succeeds locally (`npm run build`)
- [ ] All environment variables configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate issued
- [ ] Analytics enabled (optional)
- [ ] Performance optimized
- [ ] SEO meta tags added
- [ ] Favicon and social images added

---

## 4. Deploying Backend to Render

### Prerequisites

- Render account ([Sign up](https://render.com/))
- GitHub repository

### Step 1: Prepare Backend for Deployment

#### Update `package.json`

```json
{
  "scripts": {
    "start": "node dist/main.js",
    "build": "nest build",
    "postinstall": "npm run build"
  },
  "engines": {
    "node": "20.x",
    "npm": "9.x"
  }
}
```

#### Create `render.yaml` (optional)

```yaml
services:
  - type: web
    name: forgestack-api
    env: node
    region: oregon
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: forgestack-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 3000

databases:
  - name: forgestack-db
    databaseName: forgestack
    user: forgestack
    region: oregon
    plan: starter
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### Step 3: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repository

### Step 4: Configure Web Service

```
Name: forgestack-api
Region: Oregon (US West)
Branch: main
Root Directory: packages/backend (or leave blank if backend is at root)
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Plan: Free (or Starter for production)
```

### Step 5: Add Environment Variables

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 6: Create Database (PostgreSQL)

1. Click "New +" → "PostgreSQL"
2. Configure database:
   ```
   Name: forgestack-db
   Database: forgestack
   User: forgestack
   Region: Oregon (same as web service)
   Plan: Free (or Starter)
   ```
3. Copy the Internal Database URL
4. Add to web service environment variables

### Step 7: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your application
   - Start the server
3. Monitor deployment logs
4. Visit your service URL when ready

### Step 8: Configure Custom Domain (Optional)

1. Go to Service Settings → Custom Domains
2. Add your domain (e.g., `api.forgestack.io`)
3. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: your-service.onrender.com
   ```
4. Wait for SSL certificate

### Auto-Deploy Setup

Render automatically deploys on every push to your main branch.

To disable auto-deploy:
1. Go to Service Settings
2. Uncheck "Auto-Deploy"
3. Deploy manually from dashboard

### Render Deployment Checklist

- [ ] `package.json` has correct start script
- [ ] Environment variables configured
- [ ] Database created and connected
- [ ] Build succeeds on Render
- [ ] Health check endpoint working
- [ ] Logs show no errors
- [ ] API accessible from frontend
- [ ] Custom domain configured (optional)
- [ ] SSL certificate issued

---

## 5. Deploying Full Stack with Docker

### Prerequisites

- Docker installed ([Download](https://www.docker.com/))
- Docker Compose installed (included with Docker Desktop)

### Step 1: Verify Docker Files

Ensure you have these files in your project root:

**`docker-compose.yml`**:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Frontend `Dockerfile`**:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

**Backend `Dockerfile`**:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Build and Run

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Step 3: Access Your Application

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Database: localhost:5432

### Step 4: Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production Deployment with Docker

#### Option 1: Deploy to DigitalOcean

1. Create a Droplet (Ubuntu 22.04)
2. SSH into your server
3. Install Docker:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
4. Clone your repository
5. Run `docker-compose up -d`

#### Option 2: Deploy to AWS ECS

1. Push images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure load balancer

#### Option 3: Deploy to Google Cloud Run

1. Build and push to Google Container Registry
2. Deploy to Cloud Run
3. Configure environment variables

### Docker Deployment Checklist

- [ ] Dockerfiles optimized (multi-stage builds)
- [ ] Environment variables configured
- [ ] Volumes for persistent data
- [ ] Health checks configured
- [ ] Logs properly configured
- [ ] Security: non-root user
- [ ] Resource limits set
- [ ] Backup strategy in place

---

## 6. Environment Variables

### Frontend (.env.local)

```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Clerk (if using)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Supabase (if using)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

### Backend (.env)

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Clerk (if using)
CLERK_SECRET_KEY=sk_test_xxxxx

# Supabase (if using)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

### Production Environment Variables

**Never commit these to Git!**

Use:
- Vercel: Project Settings → Environment Variables
- Render: Service Settings → Environment
- Docker: `.env` file (add to `.gitignore`)

---

## 7. Troubleshooting

### Common Issues

#### Issue: CLI command not found

```bash
# Solution: Link the CLI globally
cd packages/cli
npm link

# Or install globally
npm install -g .
```

#### Issue: TypeScript compilation errors

```bash
# Solution: Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

#### Issue: Port already in use

```bash
# Solution: Kill the process using the port
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Issue: Database connection failed

```bash
# Solution: Check DATABASE_URL format
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/database

# MongoDB
DATABASE_URL=mongodb://localhost:27017/database

# Verify database is running
docker ps  # if using Docker
```

#### Issue: Vercel build fails

```bash
# Solution: Check build logs
# Common fixes:
# 1. Ensure package.json has correct build script
# 2. Check Node version in Vercel settings
# 3. Verify all dependencies are in package.json
# 4. Check environment variables
```

#### Issue: Render deployment fails

```bash
# Solution: Check deployment logs
# Common fixes:
# 1. Ensure start script is correct
# 2. Check Node version compatibility
# 3. Verify DATABASE_URL is set
# 4. Check for missing environment variables
```

### Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/halloffame12/forgestack-os/issues)
- **Discussions**: [Ask questions](https://github.com/halloffame12/forgestack-os/discussions)
- **Email**: your-email@example.com

---

## 🎉 Congratulations!

You've successfully set up and deployed ForgeStack OS!

**Next Steps**:
- ⭐ Star the repository
- 📢 Share with the community
- 🤝 Contribute improvements
- 📝 Write about your experience

---

Made with ❤️ by [Sumit Chauhan](https://github.com/halloffame12)
