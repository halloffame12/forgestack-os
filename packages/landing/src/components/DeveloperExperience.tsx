import { motion } from 'framer-motion';
import { Folder, FileText, Container, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const DeveloperExperience = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent -z-10" />

            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Developer <span className="text-gradient">Experience</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        See what you get out of the box with ForgeStack OS
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Tabs defaultValue="structure" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
                            <TabsTrigger value="structure" className="flex items-center space-x-2 py-3">
                                <Folder size={16} />
                                <span className="hidden sm:inline">Structure</span>
                            </TabsTrigger>
                            <TabsTrigger value="cli" className="flex items-center space-x-2 py-3">
                                <FileText size={16} />
                                <span className="hidden sm:inline">CLI Output</span>
                            </TabsTrigger>
                            <TabsTrigger value="docker" className="flex items-center space-x-2 py-3">
                                <Container size={16} />
                                <span className="hidden sm:inline">Docker</span>
                            </TabsTrigger>
                            <TabsTrigger value="env" className="flex items-center space-x-2 py-3">
                                <Settings size={16} />
                                <span className="hidden sm:inline">Environment</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Folder Structure */}
                        <TabsContent value="structure">
                            <div className="glass rounded-2xl p-6 md:p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                    <Folder className="text-blue-400" size={20} />
                                    <span>Clean Folder Structure</span>
                                </h3>
                                <div className="bg-black/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                                    <pre className="text-white/70">
                                        {`my-app/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── src/
│   │   │   ├── app/       # App router
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── backend/           # NestJS application
│       ├── src/
│       │   ├── modules/
│       │   ├── auth/      # Authentication
│       │   └── database/  # Database config
│       └── package.json
│
├── packages/
│   ├── shared/            # Shared types & utils
│   └── ui/                # Shared UI components
│
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── .env.example
├── README.md
└── package.json`}
                                    </pre>
                                </div>
                            </div>
                        </TabsContent>

                        {/* CLI Output */}
                        <TabsContent value="cli">
                            <div className="glass rounded-2xl p-6 md:p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                    <FileText className="text-green-400" size={20} />
                                    <span>CLI Output</span>
                                </h3>
                                <div className="bg-black/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                                    <pre className="text-green-400">
                                        {`$ npx forgestack-os-cli create my-app

🚀 ForgeStack OS v0.1.1

✓ Analyzing stack configuration...
✓ Frontend: Next.js 14 (App Router)
✓ Backend: NestJS
✓ Auth: Clerk
✓ Database: PostgreSQL
✓ Docker: Enabled

📦 Generating project structure...
✓ Created frontend application
✓ Created backend application
✓ Configured authentication
✓ Set up database connections
✓ Generated Docker configuration
✓ Created environment files

📚 Installing dependencies...
✓ Frontend dependencies installed
✓ Backend dependencies installed

🎉 Success! Your app is ready.

Next steps:
  cd my-app
  docker-compose up
  
Visit http://localhost:3000 to see your app!`}
                                    </pre>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Docker */}
                        <TabsContent value="docker">
                            <div className="glass rounded-2xl p-6 md:p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                    <Container className="text-purple-400" size={20} />
                                    <span>Docker Configuration</span>
                                </h3>
                                <div className="bg-black/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                                    <pre className="text-white/70">
                                        {`# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`}
                                    </pre>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Environment */}
                        <TabsContent value="env">
                            <div className="glass rounded-2xl p-6 md:p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                    <Settings className="text-yellow-400" size={20} />
                                    <span>Environment Variables</span>
                                </h3>
                                <div className="bg-black/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                                    <pre className="text-white/70">
                                        {`# .env.example

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp
DB_PASSWORD=your_secure_password

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Backend
JWT_SECRET=your_jwt_secret_here
API_PORT=4000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Docker
COMPOSE_PROJECT_NAME=myapp

# Optional: Analytics, Monitoring, etc.
SENTRY_DSN=
ANALYTICS_ID=`}
                                    </pre>
                                </div>
                                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <p className="text-sm text-blue-400">
                                        💡 <strong>Tip:</strong> All environment variables are documented in the generated README
                                        with instructions on where to get API keys.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </section>
    );
};

export default DeveloperExperience;
