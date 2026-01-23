import { motion } from 'framer-motion';
import { Github, ArrowRight, ChevronRight, Check, Sparkles, Zap } from 'lucide-react';
import AnimatedTerminal from './AnimatedTerminal';
import { Button } from './ui/button';

const Hero = () => {
    return (
        <section className="relative pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 md:pb-24 overflow-hidden min-h-screen flex items-center">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-square bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-pink-500/10 via-transparent to-transparent rounded-full blur-[100px] -z-10" />
            
            {/* Floating Particles */}
            <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 items-center">

                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-7 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            {/* Version Badge */}
                            <motion.a 
                                href="https://github.com/halloffame12/forgestack-os" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white/90 border border-white/10 mb-6 md:mb-8 hover:border-white/20 transition-all cursor-pointer group backdrop-blur-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Sparkles className="mr-2 w-4 h-4 text-yellow-500" />
                                <span className="text-white/70">New Release</span>
                                <span className="mx-2 h-4 w-[1px] bg-white/20"></span>
                                <span className="font-mono font-bold text-gradient">v0.3.5</span>
                                <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform text-white/40" />
                            </motion.a>

                            {/* Main Heading */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 md:mb-8 leading-[1.05]">
                                <motion.span 
                                    className="block text-white"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    Build & Ship
                                </motion.span>
                                <motion.span 
                                    className="block text-gradient animate-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35, duration: 0.6 }}
                                >
                                    Full-Stack Apps
                                </motion.span>
                                <motion.span 
                                    className="block text-white/90"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                >
                                    In Seconds.
                                </motion.span>
                            </h1>

                            {/* Subtitle */}
                            <motion.p 
                                className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-white/50 mb-8 md:mb-10 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                Generate production-ready SaaS with your choice of 
                                <span className="text-blue-400"> frontend</span>, 
                                <span className="text-purple-400"> backend</span>, 
                                <span className="text-green-400"> auth</span> & 
                                <span className="text-pink-400"> database</span>. 
                                100% free & open source.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div 
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 md:mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                <motion.a
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(59, 130, 246, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    href="#selector"
                                    className="w-full sm:w-auto"
                                >
                                    <Button size="xl" className="w-full sm:w-auto relative overflow-hidden group">
                                        <span className="relative z-10 flex items-center">
                                            <Zap className="mr-2" size={20} />
                                            Get Started Free
                                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                        </span>
                                    </Button>
                                </motion.a>
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="https://github.com/halloffame12/forgestack-os"
                                    target="_blank"
                                    className="w-full sm:w-auto"
                                >
                                    <Button variant="secondary" size="xl" className="w-full sm:w-auto backdrop-blur-sm">
                                        <Github className="mr-2" size={20} />
                                        Star on GitHub
                                    </Button>
                                </motion.a>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div 
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-white/40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                            >
                                {[
                                    { icon: Check, text: "No Vendor Lock-in", color: "text-green-400" },
                                    { icon: Check, text: "100% Open Source", color: "text-blue-400" },
                                    { icon: Check, text: "Production Ready", color: "text-purple-400" },
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5"
                                        whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.1)" }}
                                    >
                                        <item.icon className={item.color} size={14} />
                                        <span>{item.text}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column: Terminal */}
                    <motion.div
                        className="lg:col-span-5 relative"
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    >
                        {/* Glow effect behind terminal */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/10 blur-[80px] -z-10 rounded-full animate-pulse-glow" />

                        <div className="relative perspective-1000">
                            <motion.div 
                                className="preserve-3d"
                                whileHover={{ rotateY: 2, rotateX: -2 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatedTerminal />
                            </motion.div>
                        </div>

                        {/* Floating Badge - App Ready */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
                            transition={{ 
                                opacity: { delay: 1, duration: 0.5 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl hidden lg:flex items-center gap-3 shadow-2xl"
                        >
                            <div className="h-12 w-12 bg-gradient-to-br from-green-500/30 to-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Check className="text-green-400" size={24} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">App Ready</div>
                                <div className="text-xs text-white/50">Generated in 24.5s</div>
                            </div>
                        </motion.div>

                        {/* Floating Badge - Stack Count */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
                            transition={{ 
                                opacity: { delay: 1.2, duration: 0.5 },
                                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                            }}
                            className="absolute -top-4 -right-4 glass-card p-3 rounded-xl hidden lg:flex items-center gap-2 shadow-2xl"
                        >
                            <div className="text-2xl font-black text-gradient">150+</div>
                            <div className="text-xs text-white/50 leading-tight">Stack<br/>Combos</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

