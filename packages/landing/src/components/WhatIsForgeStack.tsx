import { motion } from 'framer-motion';
import { Terminal, Server, Package, Container, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const WhatIsForgeStack = () => {
    return (
        <section id="features" className="py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        What Is <span className="text-gradient">ForgeStack OS</span>?
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        A revolutionary platform that transforms how you build full-stack applications
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Architecture Diagram */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="glass rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />

                            <div className="space-y-6">
                                {/* CLI */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <Terminal className="text-blue-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">CLI Command</h4>
                                        <p className="text-sm text-white/50">Your input</p>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <ArrowRight className="text-white/30" size={24} />
                                </div>

                                {/* CLI Generator */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <Server className="text-purple-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">CLI Generator</h4>
                                        <p className="text-sm text-white/50">Core engine</p>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <ArrowRight className="text-white/30" size={24} />
                                </div>

                                {/* Generated App */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Package className="text-green-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">Generated App</h4>
                                        <p className="text-sm text-white/50">Your codebase</p>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <ArrowRight className="text-white/30" size={24} />
                                </div>

                                {/* Docker */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
                                        <Container className="text-pink-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">Docker Container</h4>
                                        <p className="text-sm text-white/50">Ready to deploy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Explanation */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-4">The Power of Automation</h3>
                            <p className="text-white/60 leading-relaxed">
                                ForgeStack OS eliminates the tedious setup process by generating production-ready,
                                multi-tenant SaaS applications in seconds. Choose your stack, run one command,
                                and start building features immediately.
                            </p>
                        </div>

                        {/* Desktop: Expandable sections, Mobile: Accordion */}
                        <div className="hidden md:block space-y-4">
                            <div className="glass rounded-xl p-6">
                                <h4 className="font-bold mb-2 text-blue-400">CLI-Driven Architecture</h4>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    The generator core manages your application's infrastructure and configuration,
                                    while the generated code handles your actual business logic and user data.
                                    This separation ensures scalability and maintainability.
                                </p>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h4 className="font-bold mb-2 text-purple-400">Why This Matters</h4>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Traditional setup takes days or weeks. With ForgeStack OS, you get a
                                    production-ready foundation in 30 seconds, complete with authentication,
                                    database integration, Docker configuration, and best practices baked in.
                                </p>
                            </div>

                            <div className="glass rounded-xl p-6">
                                <h4 className="font-bold mb-2 text-green-400">Time Saved</h4>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Skip 2-3 weeks of boilerplate setup, configuration, and integration work.
                                    Focus on building features that matter to your users from day one.
                                </p>
                            </div>
                        </div>

                        {/* Mobile: Accordion */}
                        <div className="md:hidden">
                            <Accordion type="single" collapsible className="glass rounded-xl px-4">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-blue-400">
                                        CLI-Driven Architecture
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        The generator core manages your application's infrastructure and configuration,
                                        while the generated code handles your actual business logic and user data.
                                        This separation ensures scalability and maintainability.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-purple-400">
                                        Why This Matters
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Traditional setup takes days or weeks. With ForgeStack OS, you get a
                                        production-ready foundation in 30 seconds, complete with authentication,
                                        database integration, Docker configuration, and best practices baked in.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-green-400">
                                        Time Saved
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Skip 2-3 weeks of boilerplate setup, configuration, and integration work.
                                        Focus on building features that matter to your users from day one.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhatIsForgeStack;
