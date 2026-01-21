import { motion } from 'framer-motion';
import { Copy, Check, Code2 } from 'lucide-react';
import { useState } from 'react';

interface CommandItem {
    title: string;
    description: string;
    code: string;
    tags?: string[];
}

const CLIExamples = () => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const commands: CommandItem[] = [
        {
            title: 'Interactive Mode (Recommended)',
            description: 'Get guided through stack selection with interactive prompts',
            code: 'npx forgestack-os-cli create my-app',
            tags: ['easiest', 'interactive']
        },
        {
            title: 'With Preset Stack',
            description: 'Use a production-ready stack preset for quick setup',
            code: 'npx forgestack-os-cli create my-enterprise --preset next-nest-clerk-pg',
            tags: ['presets']
        },
        {
            title: 'RESTful API with React',
            description: 'Generate React + Express + JWT + PostgreSQL REST API',
            code: 'npx forgestack-os-cli create my-rest-api \\\n  --frontend react-vite \\\n  --backend express \\\n  --auth jwt \\\n  --database postgresql \\\n  --api rest',
            tags: ['rest', 'multiline']
        },
        {
            title: 'GraphQL Backend',
            description: 'Create GraphQL API with Vue + NestJS + MongoDB',
            code: 'npx forgestack-os-cli create my-graphql-app \\\n  --frontend vue-vite \\\n  --backend nestjs \\\n  --auth firebase \\\n  --database mongodb \\\n  --api graphql \\\n  --docker',
            tags: ['graphql', 'docker']
        },
        {
            title: 'tRPC Full-Stack',
            description: 'Modern tRPC setup with Next.js + Fastify + Supabase',
            code: 'npx forgestack-os-cli create my-trpc-app \\\n  --preset next-fastify-supabase-trpc \\\n  --multi-tenant \\\n  --docker',
            tags: ['trpc', 'multitenant']
        },
        {
            title: 'Minimal Setup',
            description: 'Lightweight setup with SQLite, no Docker',
            code: 'npx forgestack-os-cli create my-minimal-app \\\n  --frontend react-vite \\\n  --backend express \\\n  --auth jwt \\\n  --database sqlite \\\n  --no-docker',
            tags: ['minimal', 'sqlite']
        },
        {
            title: 'Organize Files by Type',
            description: 'Sort files into categories with duplicate detection',
            code: 'npx forgestack-os-cli organize ~/Downloads \\\n  --strategy type \\\n  --duplicates',
            tags: ['utility', 'files']
        },
        {
            title: 'Run Task Pipeline',
            description: 'Execute complex workflows from JSON config',
            code: 'npx forgestack-os-cli run-tasks ./tasks.json \\\n  --parallel \\\n  --stop-on-error false',
            tags: ['utility', 'automation']
        },
        {
            title: 'JSON Stack Config',
            description: 'Provide complete configuration as JSON string',
            code: 'npx forgestack-os-cli create my-custom \\\n  --stack \'{\"frontend\":\"nextjs\",\"backend\":\"fastify\",\"auth\":\"supabase\",\"database\":\"supabase-db\",\"apiStyle\":\"trpc\",\"docker\":true}\'',
            tags: ['json', 'advanced']
        },
        {
            title: 'Skip Dependencies',
            description: 'Create project but skip npm install for later',
            code: 'npx forgestack-os-cli create my-app --skip-install\ncd my-app\nnpm install  # Install when ready',
            tags: ['ci/cd']
        },
        {
            title: 'Global Install Usage',
            description: 'After npm install -g, use directly in terminal',
            code: 'npm install -g forgestack-os-cli\nforgestack-os-cli create my-app',
            tags: ['global']
        },
        {
            title: 'Help & Version',
            description: 'View available options and CLI version',
            code: 'npx forgestack-os-cli --help\nnpx forgestack-os-cli --version\nnpx forgestack-os-cli create --help',
            tags: ['help']
        }
    ];

    const copyCommand = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <section className="py-20 relative overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 -z-10" />

            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
                        <Code2 className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">CLI Examples</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Command Examples
                    </h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        From simple to advanced, here are all the ways to generate your stack
                    </p>
                </motion.div>

                {/* Commands Grid */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {commands.map((cmd, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className="group glass rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 min-w-0"
                        >
                            {/* Header */}
                            <div className="mb-2 sm:mb-3">
                                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{cmd.title}</h3>
                                <p className="text-xs sm:text-sm text-white/60">{cmd.description}</p>
                            </div>

                            {/* Tags */}
                            {cmd.tags && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {cmd.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Code Block */}
                            <div className="bg-[#0a0a0a] rounded border sm:rounded-lg border-white/5 p-2 sm:p-4 mb-3 sm:mb-4 relative group/code overflow-x-auto w-full max-w-full min-w-0">
                                <code className="block w-full text-xs sm:text-sm text-green-400 font-mono whitespace-pre leading-relaxed">
                                    $ {cmd.code}
                                </code>

                                {/* Copy Button */}
                                <button
                                    onClick={() => copyCommand(cmd.code)}
                                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded opacity-0 group-hover/code:opacity-100 transition-all bg-white/5 hover:bg-white/10 border border-white/10"
                                >
                                    {copiedCode === cmd.code ? (
                                        <Check size={16} className="text-green-400" />
                                    ) : (
                                        <Copy size={16} className="text-white/60" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Reference */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 sm:mt-12 md:mt-16 glass rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border border-white/10"
                >
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Available Commands & Options</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        <div>
                            <h4 className="font-semibold text-blue-400 mb-4">Project Creation</h4>
                            <ul className="space-y-1.5 sm:space-y-2 text-white/70 text-xs sm:text-sm leading-relaxed">
                                <li><span className="text-white font-mono">--frontend</span>: react-vite, nextjs, vue-vite, sveltekit</li>
                                <li><span className="text-white font-mono">--backend</span>: express, fastify, nestjs, bun-elysia, go-fiber</li>
                                <li><span className="text-white font-mono">--auth</span>: jwt, clerk, supabase, authjs, firebase</li>
                                <li><span className="text-white font-mono">--database</span>: postgresql, mongodb, mysql, sqlite, supabase-db</li>
                                <li><span className="text-white font-mono">--api</span>: rest, graphql, trpc</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-blue-400 mb-4">Configuration</h4>
                            <ul className="space-y-1.5 sm:space-y-2 text-white/70 text-xs sm:text-sm leading-relaxed">
                                <li><span className="text-white font-mono">--preset</span>: next-nest-clerk-pg, react-express-jwt-mongo, next-fastify-supabase-trpc</li>
                                <li><span className="text-white font-mono">--docker</span>: Include Docker Compose setup</li>
                                <li><span className="text-white font-mono">--multi-tenant</span>: Enable multi-tenancy</li>
                                <li><span className="text-white font-mono">--skip-install</span>: Skip npm install</li>
                                <li><span className="text-white font-mono">--skip-git</span>: Skip git initialization</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-green-400 mb-4">Utility Commands</h4>
                            <ul className="space-y-1.5 sm:space-y-2 text-white/70 text-xs sm:text-sm leading-relaxed">
                                <li><span className="text-white font-mono">organize</span>: Sort files by type/date</li>
                                <li><span className="text-white font-mono">--strategy</span>: type or date</li>
                                <li><span className="text-white font-mono">--duplicates</span>: Detect duplicates</li>
                                <li><span className="text-white font-mono">run-tasks</span>: Execute task workflows</li>
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
