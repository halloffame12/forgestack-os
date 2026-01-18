import { motion } from 'framer-motion';
import { Github, ArrowRight, ChevronRight, Check } from 'lucide-react';
import AnimatedTerminal from './AnimatedTerminal';
import { Button } from './ui/button';

const Hero = () => {
    return (
        <section className="relative pt-16 sm:pt-20 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] flex items-center">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] -z-10" />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-center">

                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-7 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <a href="https://github.com/halloffame12/forgestack-os" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-xs font-medium bg-white/5 text-white/80 border border-white/10 mb-4 sm:mb-6 md:mb-8 hover:bg-white/10 transition-colors cursor-pointer group hover:border-white/20">
                                <Github className="mr-2 w-3.5 h-3.5 fill-current" />
                                Star on GitHub
                                <span className="mx-2 h-3 w-[1px] bg-white/20"></span>
                                <span className="font-mono text-yellow-500/80">v0.3.4</span>
                                <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform text-white/40" />
                            </a>

                            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 md:mb-8 leading-[1.1]">
                                <span className="block text-white">Build, Run, and Scale</span>
                                <span className="block text-gradient">Any Full-Stack App</span>
                                <span className="block text-white">Instantly.</span>
                            </h1>

                            <p className="max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg lg:text-xl text-white/60 mb-6 sm:mb-8 md:mb-10 text-balance leading-relaxed px-2 sm:px-0">
                                ForgeStack OS generates production-ready apps with your choice of frontend, backend, auth, database, and Docker — free & local-first.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#selector"
                                    className="w-full sm:w-auto"
                                >
                                    <Button size="xl" className="w-full sm:w-auto">
                                        Get Started
                                        <ArrowRight className="ml-2" size={20} />
                                    </Button>
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="https://github.com/halloffame12/forgestack-os"
                                    target="_blank"
                                    className="w-full sm:w-auto"
                                >
                                    <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                                        <Github className="mr-2" size={20} />
                                        View Code
                                    </Button>
                                </motion.a>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-medium text-white/40">
                                <div className="flex items-center">
                                    <Check className="text-green-400 mr-2" size={16} />
                                    No Vendor Lock-in
                                </div>
                                <div className="flex items-center">
                                    <Check className="text-green-400 mr-2" size={16} />
                                    100% Free & Open Source
                                </div>
                                <div className="flex items-center">
                                    <Check className="text-green-400 mr-2" size={16} />
                                    Production Ready
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Terminal */}
                    <motion.div
                        className="lg:col-span-5 relative"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        {/* Glow effect behind terminal */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-[80px] -z-10 rounded-full" />

                        <div className="relative group perspective-1000">
                            <div className="transform transition-transform duration-500 group-hover:rotate-y-2 group-hover:rotate-x-2">
                                <AnimatedTerminal />
                            </div>
                        </div>

                        {/* Floating Badge (Decorative) */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 -left-8 glass p-4 rounded-xl hidden lg:flex items-center gap-3 shadow-2xl"
                        >
                            <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <Check className="text-green-400" size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">App Ready</div>
                                <div className="text-xs text-white/50">in 24.5 seconds</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

