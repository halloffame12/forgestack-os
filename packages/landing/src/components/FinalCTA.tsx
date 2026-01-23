import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Copy, Check, Rocket, Sparkles, Zap, Github } from 'lucide-react';
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
        <section className="py-32 md:py-40 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-[150px] animate-pulse-glow" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container-custom relative">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Animated Badge */}
                    <motion.div 
                        className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 mb-8"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Rocket className="w-4 h-4 mr-2 animate-bounce" />
                        <span className="text-sm font-medium">Ready to Launch</span>
                        <span className="flex h-2 w-2 ml-3">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                    </motion.div>

                    <motion.h2 
                        className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Ready to Build Your<br />
                        <span className="text-gradient animate-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Next Big Idea?</span>
                    </motion.h2>

                    <motion.p 
                        className="text-xl md:text-2xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Join developers worldwide shipping faster with ForgeStack OS.
                        Start building production-ready apps in seconds.
                    </motion.p>

                    {/* Command Display */}
                    <motion.div 
                        className="glass-card rounded-2xl p-6 md:p-8 mb-12 max-w-2xl mx-auto relative overflow-hidden group"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Animated Border */}
                        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                        
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <motion.button
                                onClick={copyCommand}
                                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
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
                            </motion.button>
                        </div>
                        <code className="block font-mono text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-left">
                            <span className="text-green-400">$</span> {command}
                        </code>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div 
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.a
                            href="#selector"
                            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                        >
                            <Button variant="gradient" size="xl" className="w-full sm:w-auto shadow-2xl shadow-blue-500/20 group">
                                <Zap className="mr-2 group-hover:animate-pulse" size={20} />
                                Get Started Now
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Button>
                        </motion.a>

                        <motion.a
                            href="https://github.com/halloffame12/forgestack-os"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                        >
                            <Button variant="secondary" size="xl" className="w-full sm:w-auto backdrop-blur-sm">
                                <Github className="mr-2" size={20} />
                                Star on GitHub
                            </Button>
                        </motion.a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                        className="pt-12 border-t border-white/5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                            {[
                                { value: '150+', label: 'Stack Combinations', icon: Sparkles },
                                { value: '30s', label: 'Setup Time', icon: Zap },
                                { value: '100%', label: 'Open Source', icon: Github },
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i}
                                    className="text-center group cursor-default"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <stat.icon className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors" />
                                        <div className="text-4xl font-black text-gradient">{stat.value}</div>
                                    </div>
                                    <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
