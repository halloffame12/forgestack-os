# Deployment Guide

ForgeStack OS projects are designed to be "deployment-ready" from day zero. This guide covers how to deploy your applications to popular cloud providers.

## 🚀 Cloud Providers (Standard)

### Vercel (Frontend)
Perfect for Next.js or React + Vite projects.
1. Connect your GitHub repository to Vercel.
2. Set the root directory to `apps/frontend`.
3. Configure environment variables (from your `.env` file).
4. Hit **Deploy**.

### Render / Railway / Fly.io (Backend)
Ideal for NestJS or Express servers.
1. Connect your repository.
2. Set the root directory to `apps/backend`.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add your database connection string and secrets to environment variables.

---

## 🐳 Docker Deployment (Recommended)

Docker is the best way to ensure your app runs identically in production as it does on your local machine.

### Using Docker Compose
If you are deploying to a VPS (DigitalOcean, AWS EC2, etc.), you can use our built-in orchestration:

```bash
# On your server
git clone your-repo
cd your-repo
docker-compose up -d --build
```

### Infrastructure in Docker
Our generated `docker-compose.yml` includes:
- **Frontend**: Nginx/Node container
- **Backend**: Node.js container
- **Database**: PostgreSQL/MongoDB container
- **Networking**: Pre-configured internal communication.

---

## 📁 Shared Packages
If you use shared packages, ensure your deployment platform supports monorepos (workspaces). Most modern platforms like Vercel and Render handle this automatically when you point them to the correct sub-folder.

## 🔒 Security Checklist
- [ ] Change all default passwords (DB_PASSWORD, JWT_SECRET).
- [ ] Use SSL (HTTPS) for all production endpoints.
- [ ] Set `NODE_ENV=production`.
- [ ] Configure CORS to only allow your production frontend domain.
