import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

const FinalCTA = () => {
    const [copied, setCopied] = useState(false);
    const command = "npx forgestack-os-cli create my-saas";

    const copyCommand = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-gradient-to-b from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-[120px] -z-10" />

            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                        <span className="text-sm font-medium">Ready to Ship</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                        Ready to Build Your<br />
                        <span className="text-gradient">Next SaaS?</span>
                    </h2>

                    <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                        Join thousands of developers shipping faster with ForgeStack OS.
                        Start building production-ready apps in seconds.
                    </p>

                    {/* Command Display */}
                    <div className="glass rounded-2xl p-6 md:p-8 mb-12 max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                            <span className="text-sm text-white/40 font-mono">Terminal</span>
                            <button
                                onClick={copyCommand}
                                className="flex items-center space-x-2 text-sm text-white/60 hover:text-white transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="text-green-400" />
                                        <span className="text-green-400">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <code className="block font-mono text-lg md:text-xl text-blue-400 text-left">
                            $ {command}
                        </code>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href="#selector"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                        >
                            <Button variant="gradient" size="xl" className="w-full sm:w-auto shadow-2xl shadow-blue-500/30">
                                Get Started Now
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </motion.a>

                        <motion.a
                            href="https://github.com/halloffame12/forgestack-os#readme"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                        >
                            <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                                <BookOpen className="mr-2" size={20} />
                                View Documentation
                            </Button>
                        </motion.a>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-16 pt-12 border-t border-white/10">
                        <p className="text-sm text-white/40 mb-6">Trusted by developers worldwide</p>
                        <div className="flex flex-wrap items-center justify-center gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gradient mb-1">150+</div>
                                <div className="text-sm text-white/50">Stack Combinations</div>
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gradient mb-1">30s</div>
                                <div className="text-sm text-white/50">Setup Time</div>
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gradient mb-1">100%</div>
                                <div className="text-sm text-white/50">Open Source</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
