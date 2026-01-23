import { motion } from 'framer-motion';
import { Terminal, Server, Package, Container, ArrowRight, Zap, Clock, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const WhatIsForgeStack = () => {
    return (
        <section id="features" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[150px] -z-10" />
            
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20"
                >
                    <motion.div 
                        className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Zap className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Revolutionary Development</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                        What Is <span className="text-gradient">ForgeStack OS</span>?
                    </h2>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg md:text-xl">
                        A revolutionary platform that transforms how you build full-stack applications
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Architecture Diagram */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
                            {/* Animated Background Orb */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse-glow" />

                            <div className="space-y-4">
                                {[
                                    { icon: Terminal, title: 'CLI Command', desc: 'Your input', color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
                                    { icon: Server, title: 'Generator Engine', desc: 'Core processor', color: 'purple', gradient: 'from-purple-500 to-pink-500' },
                                    { icon: Package, title: 'Generated App', desc: 'Your codebase', color: 'green', gradient: 'from-green-500 to-emerald-500' },
                                    { icon: Container, title: 'Docker Ready', desc: 'Deploy anywhere', color: 'pink', gradient: 'from-pink-500 to-rose-500' },
                                ].map((item, index) => (
                                    <motion.div 
                                        key={index}
                                        className="relative"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {/* Connector Line */}
                                        {index < 3 && (
                                            <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent" />
                                        )}
                                        
                                        <motion.div 
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group"
                                            whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                                <item.icon className="text-white" size={22} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white">{item.title}</h4>
                                                <p className="text-sm text-white/50">{item.desc}</p>
                                            </div>
                                            <ArrowRight className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" size={18} />
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
                                {[
                                    { value: '30s', label: 'Setup Time' },
                                    { value: '150+', label: 'Combinations' },
                                    { value: '100%', label: 'Type Safe' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-2xl font-black text-gradient">{stat.value}</div>
                                        <div className="text-xs text-white/40">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Explanation */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">The Power of Automation</h3>
                            <p className="text-white/50 leading-relaxed text-lg">
                                ForgeStack OS eliminates the tedious setup process by generating production-ready,
                                multi-tenant SaaS applications in seconds. Choose your stack, run one command,
                                and start building features immediately.
                            </p>
                        </div>

                        {/* Feature Cards - Desktop */}
                        <div className="hidden md:grid gap-4">
                            {[
                                { icon: Terminal, title: 'CLI-Driven Architecture', desc: 'The generator core manages infrastructure while you focus on business logic.', color: 'blue' },
                                { icon: Clock, title: 'Why This Matters', desc: 'Get a production-ready foundation in 30 seconds with auth, DB, and Docker.', color: 'purple' },
                                { icon: Shield, title: 'Time Saved', desc: 'Skip 2-3 weeks of boilerplate. Focus on features from day one.', color: 'green' },
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    className="glass-card rounded-xl p-6 group cursor-pointer"
                                    whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                                            <item.icon className={`text-${item.color}-400`} size={20} />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold mb-2 text-${item.color}-400`}>{item.title}</h4>
                                            <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile: Accordion */}
                        <div className="md:hidden">
                            <Accordion type="single" collapsible className="glass-card rounded-xl px-4">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-blue-400">
                                        CLI-Driven Architecture
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/60">
                                        The generator core manages your application's infrastructure and configuration,
                                        while the generated code handles your actual business logic and user data.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-purple-400">
                                        Why This Matters
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/60">
                                        Traditional setup takes days or weeks. With ForgeStack OS, you get a
                                        production-ready foundation in 30 seconds with everything configured.
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-green-400">
                                        Time Saved
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/60">
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
