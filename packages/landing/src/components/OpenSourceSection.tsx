import { motion } from 'framer-motion';
import { Github, Heart, Lock, Code, Star, GitBranch, Users, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const OpenSourceSection = () => {
    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-blue-500/5 to-purple-500/5 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-500/10 to-transparent rounded-full blur-3xl -z-10" />

            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-green-500/20 to-transparent rounded-full blur-3xl -z-10" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 border border-green-500/20 rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-blue-500/20 rounded-full" />

                        {/* Badge */}
                        <motion.div 
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-400 mb-8"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Heart className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">Open Source Forever</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                            Free & <span className="text-gradient-green">Open Source</span>
                        </h2>

                        <p className="text-white/50 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                            ForgeStack OS is 100% open source and free to use. No hidden costs, no vendor lock-in,
                            no strings attached. You own the generated code completely.
                        </p>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {[
                                { icon: Code, title: '100% Open Source', desc: 'MIT licensed. Fork it, modify it, use it however you want.', color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
                                { icon: Lock, title: 'No Vendor Lock-In', desc: 'The generated code is yours. No dependencies on our services.', color: 'purple', gradient: 'from-purple-500 to-pink-500' },
                                { icon: Heart, title: 'Free Forever', desc: 'Free for local use. Build unlimited projects at no cost.', color: 'green', gradient: 'from-green-500 to-emerald-500' },
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group"
                                    whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-sm text-white/50">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <motion.a
                                href="https://github.com/halloffame12/forgestack-os"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="gradient" size="lg" className="w-full sm:w-auto shadow-xl group">
                                    <Github className="mr-2" size={20} />
                                    Star on GitHub
                                    <Star className="ml-2 w-4 h-4 group-hover:fill-current transition-all" />
                                </Button>
                            </motion.a>

                            <motion.a
                                href="https://github.com/halloffame12/forgestack-os/blob/main/CONTRIBUTING.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                    <GitBranch className="mr-2" size={20} />
                                    Contribute
                                </Button>
                            </motion.a>
                        </div>

                        {/* Bottom Stats */}
                        <div className="pt-8 border-t border-white/5">
                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                                {[
                                    { icon: Sparkles, label: 'MIT License', color: 'text-blue-400' },
                                    { icon: GitBranch, label: 'Active Development', color: 'text-green-400' },
                                    { icon: Users, label: 'Community Driven', color: 'text-purple-400' },
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i}
                                        className="flex items-center gap-2 text-white/50 hover:text-white/70 transition-colors cursor-default"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                        <span>{item.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OpenSourceSection;
