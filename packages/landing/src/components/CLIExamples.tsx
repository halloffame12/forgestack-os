import { motion } from 'framer-motion';
import { Copy, Check, Code2, Sparkles, Stethoscope, FolderOpen, Play } from 'lucide-react';
import { useState } from 'react';

interface CommandItem {
    title: string;
    description: string;
    code: string;
    tags?: string[];
    category?: 'create' | 'doctor' | 'utility';
    isNew?: boolean;
}

const CLIExamples = () => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<'all' | 'create' | 'doctor' | 'utility'>('all');

    const commands: CommandItem[] = [
        {
            title: 'Interactive Mode (Recommended)',
            description: 'Get guided through stack selection with interactive prompts',
            code: 'npx forgestack-os-cli create my-app',
            tags: ['easiest', 'interactive'],
            category: 'create'
        },
        {
            title: 'With Preset Stack',
            description: 'Use a production-ready stack preset for quick setup',
            code: 'npx forgestack-os-cli create my-enterprise --preset next-nest-clerk-pg',
            tags: ['presets'],
            category: 'create'
        },
        {
            title: 'RESTful API with React',
            description: 'Generate React + Express + JWT + PostgreSQL REST API',
            code: 'npx forgestack-os-cli create my-rest-api \\\n  --frontend react-vite \\\n  --backend express \\\n  --auth jwt \\\n  --database postgresql \\\n  --api rest',
            tags: ['rest', 'multiline'],
            category: 'create'
        },
        {
            title: 'GraphQL Backend',
            description: 'Create GraphQL API with Vue + NestJS + MongoDB',
            code: 'npx forgestack-os-cli create my-graphql-app \\\n  --frontend vue-vite \\\n  --backend nestjs \\\n  --auth firebase \\\n  --database mongodb \\\n  --api graphql \\\n  --docker',
            tags: ['graphql', 'docker'],
            category: 'create'
        },
        {
            title: 'tRPC Full-Stack',
            description: 'Modern tRPC setup with Next.js + Fastify + Supabase',
            code: 'npx forgestack-os-cli create my-trpc-app \\\n  --preset next-fastify-supabase-trpc \\\n  --multi-tenant \\\n  --docker',
            tags: ['trpc', 'multitenant'],
            category: 'create'
        },
        // Doctor commands - NEW
        {
            title: '🩺 Doctor - Environment Check',
            description: 'Validate your development environment and catch issues early',
            code: 'npx forgestack-os-cli doctor',
            tags: ['new', 'diagnostics'],
            category: 'doctor',
            isNew: true
        },
        {
            title: '🩺 Doctor - Full Check with Lint',
            description: 'Run complete health check including ESLint and TypeScript',
            code: 'npx forgestack-os-cli doctor --lint',
            tags: ['new', 'linting'],
            category: 'doctor',
            isNew: true
        },
        {
            title: '🩺 Doctor - JSON Output for CI',
            description: 'Get machine-readable output for CI/CD pipelines',
            code: 'npx forgestack-os-cli doctor --json',
            tags: ['new', 'ci/cd'],
            category: 'doctor',
            isNew: true
        },
        {
            title: '🩺 Doctor - Generate Missing Env Report',
            description: 'Auto-generate .env.missing file with missing variables',
            code: 'npx forgestack-os-cli doctor --fix',
            tags: ['new', 'auto-fix'],
            category: 'doctor',
            isNew: true
        },
        {
            title: 'Organize Files by Type',
            description: 'Sort files into categories with duplicate detection',
            code: 'npx forgestack-os-cli organize ~/Downloads \\\n  --strategy type \\\n  --duplicates',
            tags: ['utility', 'files'],
            category: 'utility'
        },
        {
            title: 'Run Task Pipeline',
            description: 'Execute complex workflows from JSON config',
            code: 'npx forgestack-os-cli run-tasks ./tasks.json \\\n  --parallel \\\n  --stop-on-error false',
            tags: ['utility', 'automation'],
            category: 'utility'
        },
        {
            title: 'JSON Stack Config',
            description: 'Provide complete configuration as JSON string',
            code: 'npx forgestack-os-cli create my-custom \\\n  --stack \'{\"frontend\":\"nextjs\",\"backend\":\"fastify\",\"auth\":\"supabase\",\"database\":\"supabase-db\",\"apiStyle\":\"trpc\",\"docker\":true}\'',
            tags: ['json', 'advanced'],
            category: 'create'
        },
    ];

    const filteredCommands = activeCategory === 'all' 
        ? commands 
        : commands.filter(cmd => cmd.category === activeCategory);

    const copyCommand = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const categories = [
        { id: 'all', label: 'All Commands', icon: <Code2 size={16} /> },
        { id: 'create', label: 'Create', icon: <Sparkles size={16} /> },
        { id: 'doctor', label: 'Doctor', icon: <Stethoscope size={16} />, isNew: true },
        { id: 'utility', label: 'Utilities', icon: <FolderOpen size={16} /> },
    ];

    return (
        <section className="py-24 relative overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 -z-10" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl -z-10" />

            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 mb-6">
                        <Code2 className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">CLI Examples</span>
                        <span className="mx-2 h-4 w-px bg-blue-500/30"></span>
                        <span className="text-xs text-green-400 font-bold">NEW: Doctor Command</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Command <span className="text-gradient">Examples</span>
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        From project creation to environment diagnostics — here's everything the CLI can do
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-2 mb-10"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                activeCategory === cat.id
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                            {cat.isNew && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Commands Grid */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {filteredCommands.map((cmd, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className={`group relative glass rounded-xl p-4 md:p-6 border transition-all duration-300 min-w-0 ${
                                cmd.isNew 
                                    ? 'border-green-500/30 hover:border-green-500/50 bg-gradient-to-br from-green-500/5 to-transparent' 
                                    : 'border-white/10 hover:border-blue-500/30'
                            }`}
                        >
                            {/* New Badge */}
                            {cmd.isNew && (
                                <div className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg shadow-green-500/30 flex items-center gap-1">
                                    <Sparkles size={10} />
                                    NEW
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white mb-1">{cmd.title}</h3>
                                <p className="text-sm text-white/60">{cmd.description}</p>
                            </div>

                            {/* Tags */}
                            {cmd.tags && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {cmd.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                tag === 'new' 
                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                    : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                            }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Code Block */}
                            <div className="bg-[#0a0a0a] rounded-lg border border-white/5 p-3 sm:p-4 mb-3 relative group/code overflow-x-auto w-full max-w-full min-w-0">
                                <code className="block w-full text-xs sm:text-sm text-green-400 font-mono whitespace-pre leading-relaxed">
                                    $ {cmd.code}
                                </code>

                                {/* Copy Button */}
                                <button
                                    onClick={() => copyCommand(cmd.code)}
                                    className="absolute top-2 right-2 p-2 rounded opacity-0 group-hover/code:opacity-100 transition-all bg-white/5 hover:bg-white/10 border border-white/10"
                                >
                                    {copiedCode === cmd.code ? (
                                        <Check size={14} className="text-green-400" />
                                    ) : (
                                        <Copy size={14} className="text-white/60" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Doctor Command Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-12 glass rounded-2xl p-6 md:p-8 border border-green-500/20 bg-gradient-to-br from-green-500/5 to-teal-500/5"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                            <Stethoscope className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold">Doctor Command</h3>
                                <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">NEW</span>
                            </div>
                            <p className="text-white/60">Validate your environment before issues slow you down</p>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] rounded-xl p-4 md:p-6 font-mono text-sm border border-white/5 overflow-x-auto">
                        <pre className="text-white/80">
{`$ npx forgestack-os-cli doctor

🩺 ForgeStack Doctor Report

📋 Node.js & Package Managers

`}<span className="text-green-400">✅ Node.js: Node version: 20.2.0</span>{`
`}<span className="text-green-400">✅ npm: npm version: 10.2.0</span>{`
`}<span className="text-gray-500">⏭️ pnpm: pnpm is not installed (optional)</span>{`

📋 Environment Variables

`}<span className="text-red-400">❌ Missing .env Variables: DATABASE_URL, JWT_SECRET</span>{`
   `}<span className="text-cyan-400">💡 Fix: Add the missing variables to your .env file</span>{`

📋 Database Connectivity

`}<span className="text-green-400">✅ PostgreSQL Connection: Successfully connected</span>{`

📋 Prisma ORM

`}<span className="text-green-400">✅ Prisma Schema: Valid</span>{`
`}<span className="text-yellow-400">⚠️ Prisma Migrations: Pending migrations detected</span>{`
   `}<span className="text-cyan-400">💡 Fix: Run: npx prisma migrate dev</span>{`

📋 Port Availability

`}<span className="text-red-400">❌ Backend (port 3000): Port in use by node (PID: 12345)</span>{`
`}<span className="text-green-400">✅ Frontend (port 5173): Available</span>{`

───────────────────────────────────────────────────────────

📊 Summary:

   Total Checks: 10    Passed: 6    Warnings: 1    Failed: 2`}
                        </pre>
                    </div>

                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <div className="font-semibold">Node & npm</div>
                                <div className="text-xs text-white/50">Version validation</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Play className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="font-semibold">Database</div>
                                <div className="text-xs text-white/50">Connectivity check</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="font-semibold">ESLint & TypeScript</div>
                                <div className="text-xs text-white/50">With --lint flag</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Reference */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 glass rounded-xl p-6 md:p-8 border border-white/10"
                >
                    <h3 className="text-xl sm:text-2xl font-bold mb-6">Available Commands & Options</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <h4 className="font-semibold text-blue-400 mb-4 flex items-center gap-2">
                                <Sparkles size={16} />
                                Project Creation
                            </h4>
                            <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                                <li><span className="text-white font-mono">--frontend</span>: react-vite, nextjs, vue-vite, sveltekit</li>
                                <li><span className="text-white font-mono">--backend</span>: express, fastify, nestjs, bun-elysia</li>
                                <li><span className="text-white font-mono">--auth</span>: jwt, clerk, supabase, authjs, firebase</li>
                                <li><span className="text-white font-mono">--database</span>: postgresql, mongodb, mysql, sqlite</li>
                                <li><span className="text-white font-mono">--api</span>: rest, graphql, trpc</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                <Code2 size={16} />
                                Configuration
                            </h4>
                            <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                                <li><span className="text-white font-mono">--preset</span>: Predefined stack combos</li>
                                <li><span className="text-white font-mono">--docker</span>: Docker Compose setup</li>
                                <li><span className="text-white font-mono">--multi-tenant</span>: Multi-tenancy</li>
                                <li><span className="text-white font-mono">--skip-install</span>: Skip npm install</li>
                                <li><span className="text-white font-mono">--skip-git</span>: Skip git init</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                                <Stethoscope size={16} />
                                Doctor Command
                                <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">NEW</span>
                            </h4>
                            <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                                <li><span className="text-white font-mono">doctor</span>: Run health checks</li>
                                <li><span className="text-white font-mono">--lint</span>: Include ESLint + TS</li>
                                <li><span className="text-white font-mono">--json</span>: CI/CD output format</li>
                                <li><span className="text-white font-mono">--fix</span>: Generate .env.missing</li>
                                <li><span className="text-white font-mono">--cwd</span>: Custom directory</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                                <FolderOpen size={16} />
                                Utility Commands
                            </h4>
                            <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                                <li><span className="text-white font-mono">organize</span>: Sort files by type/date</li>
                                <li><span className="text-white font-mono">--strategy</span>: type or date</li>
                                <li><span className="text-white font-mono">--duplicates</span>: Detect duplicates</li>
                                <li><span className="text-white font-mono">run-tasks</span>: Execute workflows</li>
                                <li><span className="text-white font-mono">--parallel</span>: Run concurrently</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CLIExamples;
