import { motion } from 'framer-motion';
import { Database, Shield, Globe, Lock, Key, Server, Layers } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const ArchitectureDeepDive = () => {
    return (
        <section className="py-20 bg-black/40">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
                        For Senior Engineers
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Architecture <span className="text-gradient">Deep Dive</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        Under the hood, ForgeStack OS implements industry-standard best practices
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left: Diagram */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Abstract Architecture Visualization */}
                        <div className="glass rounded-3xl p-8 h-full min-h-[500px] relative overflow-hidden flex flex-col justify-center">
                            {/* Background Elements */}
                            <div className="absolute inset-0 bg-grid opacity-30" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

                            {/* Diagram Nodes */}
                            <div className="relative z-10 flex flex-col items-center gap-8">
                                {/* Load Balancer / Edge */}
                                <div className="flex flex-col items-center">
                                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-2">
                                        <Globe size={24} />
                                    </div>
                                    <span className="text-sm font-mono text-white/60">Edge / CDN</span>
                                </div>

                                {/* Connection Lines */}
                                <div className="h-8 w-px bg-gradient-to-b from-blue-500/30 to-purple-500/30" />

                                {/* App Services */}
                                <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                                    <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-col items-center text-center">
                                        <Server className="text-purple-400 mb-3" size={24} />
                                        <span className="font-bold text-sm">Control Plane</span>
                                        <span className="text-xs text-white/40 mt-1">Orchestration</span>
                                    </div>
                                    <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 flex flex-col items-center text-center">
                                        <Layers className="text-green-400 mb-3" size={24} />
                                        <span className="font-bold text-sm">Data Plane</span>
                                        <span className="text-xs text-white/40 mt-1">Business Logic</span>
                                    </div>
                                </div>

                                {/* Connection Lines */}
                                <div className="h-8 w-px bg-gradient-to-b from-purple-500/30 to-yellow-500/30" />

                                {/* Data Layer */}
                                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex flex-col items-center">
                                        <Database className="text-yellow-400 mb-2" size={20} />
                                        <span className="text-xs font-mono">Primary</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex flex-col items-center">
                                        <Database className="text-yellow-400 mb-2" size={20} />
                                        <span className="text-xs font-mono">Replica</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col items-center">
                                        <Lock className="text-red-400 mb-2" size={20} />
                                        <span className="text-xs font-mono">Cache</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Technical Details */}
                    <div className="flex flex-col justify-center">
                        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="multitenancy">
                            <AccordionItem value="multitenancy" className="glass rounded-xl px-6 border-b-0">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center space-x-3 text-left">
                                        <Shield className="text-blue-400" size={20} />
                                        <span className="font-bold text-lg">Multi-Tenancy Model</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-base">
                                    <p className="mb-4">
                                        ForgeStack OS implements row-level security (RLS) by default. Every database query
                                        is automatically scoped to the current tenant's organization ID.
                                    </p>
                                    <ul className="space-y-2 list-disc list-inside text-white/50 text-sm">
                                        <li>Schema-based isolation options</li>
                                        <li>Shared database, separate schemas</li>
                                        <li>Automatic tenant context injection</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="auth" className="glass rounded-xl px-6 border-b-0">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center space-x-3 text-left">
                                        <Key className="text-green-400" size={20} />
                                        <span className="font-bold text-lg">Authentication Flow</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-base">
                                    <p className="mb-4">
                                        Standardized JWT implementation with interchangeable providers. Whether you use
                                        Clerk, Supabase, or Auth.js, the internal API remains consistent.
                                    </p>
                                    <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-green-400">
                                        Bear token → Middleware → User Context → Controller
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="db" className="glass rounded-xl px-6 border-b-0">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center space-x-3 text-left">
                                        <Database className="text-yellow-400" size={20} />
                                        <span className="font-bold text-lg">Database Isolation</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-base">
                                    <p className="mb-4">
                                        Optimized connection pooling and migration management. Supports both SQL
                                        and NoSQL patterns with equal first-class citizenship.
                                    </p>
                                    <ul className="space-y-2 list-disc list-inside text-white/50 text-sm">
                                        <li>Prisma / Drizzle ORM pre-configured</li>
                                        <li>Automatic migration generation</li>
                                        <li>Seeding scripts included</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArchitectureDeepDive;
