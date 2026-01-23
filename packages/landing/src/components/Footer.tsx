import { Github, BookOpen, Layers, ArrowUp, Mail, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="border-t border-white/5 bg-[#030303] pt-16 lg:pt-24 pb-8 relative overflow-hidden">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            
            {/* Background Decoration */}
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -z-10" />

            <div className="container-custom">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 lg:mb-20">
                    {/* Brand Column */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-5 min-w-0">
                        <motion.div 
                            className="flex items-center gap-3 mb-6"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Layers className="text-white" size={26} />
                            </div>
                            <span className="text-2xl font-black tracking-tight">ForgeStack OS</span>
                        </motion.div>
                        <p className="text-white/40 max-w-md leading-relaxed mb-8 text-base">
                            The revolutionary full-stack OS for modern developers.
                            Build, scale, and ship production-ready SaaS apps in minutes not months.
                        </p>
                        <div className="flex gap-3">
                            <motion.a
                                href="https://github.com/halloffame12/forgestack-os"
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ y: -3, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all"
                            >
                                <Github size={20} />
                            </motion.a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="lg:col-span-2 min-w-0">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            Product
                        </h4>
                        <ul className="space-y-4 text-white/40 text-sm">
                            {[
                                { label: 'Features', href: '#features' },
                                { label: 'Stack Selector', href: '#selector' },
                                { label: 'Roadmap', href: 'https://github.com/halloffame12/forgestack-os#roadmap', external: true },
                                { label: 'Changelog', href: 'https://github.com/halloffame12/forgestack-os/blob/main/CHANGELOG.md', external: true },
                            ].map((link, i) => (
                                <li key={i}>
                                    <motion.a 
                                        href={link.href} 
                                        className="hover:text-blue-400 transition-colors block"
                                        whileHover={{ x: 4 }}
                                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    >
                                        {link.label}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div className="lg:col-span-2 min-w-0">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-400" />
                            Resources
                        </h4>
                        <ul className="space-y-4 text-white/40 text-sm">
                            {[
                                { label: 'Documentation', href: 'https://github.com/halloffame12/forgestack-os/tree/main/docs' },
                                { label: 'Templates', href: 'https://github.com/halloffame12/forgestack-os/tree/main/templates' },
                                { label: 'Guides', href: 'https://github.com/halloffame12/forgestack-os/tree/main/docs/guide' },
                                { label: 'CLI Reference', href: 'https://github.com/halloffame12/forgestack-os/tree/main/docs/cli' },
                            ].map((link, i) => (
                                <li key={i}>
                                    <motion.a href={link.href} className="hover:text-purple-400 transition-colors block" target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }}>
                                        {link.label}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:col-span-3 min-w-0">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-green-400" />
                            Stay Updated
                        </h4>
                        <p className="text-white/40 text-sm mb-4 leading-relaxed">
                            Get the latest updates and developer tips directly to your inbox.
                        </p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                                />
                            </div>
                            <motion.button 
                                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Subscribe
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-white/30 gap-4">
                    <p className="flex items-center gap-1">
                        © 2026 ForgeStack OS. Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> MIT License.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="https://github.com/halloffame12/forgestack-os/blob/main/SECURITY.md" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Security</a>
                        <a href="https://github.com/halloffame12/forgestack-os/blob/main/LICENSE" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">License</a>
                        <motion.button
                            onClick={scrollToTop}
                            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all"
                            whileHover={{ y: -2, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={16} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

