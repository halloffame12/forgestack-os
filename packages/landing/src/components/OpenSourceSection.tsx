import { motion } from 'framer-motion';
import { Github, Heart, Lock, Code } from 'lucide-react';
import { Button } from './ui/button';

const OpenSourceSection = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5 -z-10" />

            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-3xl -z-10" />

                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-6">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">Open Source</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Free & <span className="text-gradient">Open Source</span>
                        </h2>

                        <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                            ForgeStack OS is 100% open source and free to use. No hidden costs, no vendor lock-in,
                            no strings attached. You own the generated code completely.
                        </p>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Code className="text-blue-400" size={24} />
                                </div>
                                <h3 className="font-bold mb-2">100% Open Source</h3>
                                <p className="text-sm text-white/60">
                                    MIT licensed. Fork it, modify it, use it however you want.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Lock className="text-purple-400" size={24} />
                                </div>
                                <h3 className="font-bold mb-2">No Vendor Lock-In</h3>
                                <p className="text-sm text-white/60">
                                    The generated code is yours. No dependencies on our services.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Heart className="text-green-400" size={24} />
                                </div>
                                <h3 className="font-bold mb-2">Free Forever</h3>
                                <p className="text-sm text-white/60">
                                    Free for local use. Build unlimited projects at no cost.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.a
                                href="https://github.com/halloffame12/forgestack-os"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                                    <Github className="mr-2" size={20} />
                                    Star on GitHub
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
                                    Contribute
                                </Button>
                            </motion.a>
                        </div>

                        {/* GitHub Stats (Optional - can be populated with real data via API) */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/60">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span>MIT License</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <span>Active Development</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                                    <span>Community Driven</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OpenSourceSection;
