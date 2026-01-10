import path from 'path';
import fs from 'fs-extra';
import { StackConfig } from '../types';

export async function generateDocker(config: StackConfig, targetDir: string) {
  const dockerDir = path.join(targetDir, 'docker');
  await fs.ensureDir(dockerDir);

  // Frontend Dockerfile
  const frontendDockerfile = `FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`;

  await fs.writeFile(path.join(dockerDir, 'frontend.Dockerfile'), frontendDockerfile);

  // Backend Dockerfile
  const backendDockerfile = `FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
${config.database !== 'mongodb' ? 'COPY --from=builder /app/prisma ./prisma\nRUN npx prisma generate' : ''}

USER node

EXPOSE 3001

CMD ["node", "dist/index.js"]
`;

  await fs.writeFile(path.join(dockerDir, 'backend.Dockerfile'), backendDockerfile);

  // Nginx config for frontend
  const nginxConf = `server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

  await fs.writeFile(path.join(dockerDir, 'nginx.conf'), nginxConf);

  // Docker Compose
  const dockerCompose = getDockerCompose(config);
  await fs.writeFile(path.join(targetDir, 'docker-compose.yml'), dockerCompose);

  // .dockerignore
  const dockerignore = `node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.vscode
.idea
dist
build
coverage
`;

  await fs.writeFile(path.join(targetDir, '.dockerignore'), dockerignore);
}

function getDockerCompose(config: StackConfig): string {
  let services = `version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend.Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:3001/api

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend.Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_URL=${config.database === 'postgresql' ? `postgresql://postgres:postgres@postgres:5432/${config.projectName}` : config.database === 'mongodb' ? `mongodb://mongo:mongo@mongodb:27017/${config.projectName}` : config.database === 'mysql' ? `mysql://root:mysql@mysql:3306/${config.projectName}` : 'sqlite:./dev.db'}
      - JWT_SECRET=\${JWT_SECRET:-your-secret-key}
    depends_on:
`;

  // Add database service
  if (config.database === 'postgresql') {
    services += `      - postgres

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${config.projectName}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;
  } else if (config.database === 'mongodb') {
    services += `      - mongodb

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=mongo
      - MONGO_INITDB_ROOT_PASSWORD=mongo
      - MONGO_INITDB_DATABASE=${config.projectName}
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
`;
  } else if (config.database === 'mysql') {
    services += `      - mysql

  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=mysql
      - MYSQL_DATABASE=${config.projectName}
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
`;
  } else {
    services += `      # Add your database service here

volumes:
  data:
`;
  }

  return services;
}
