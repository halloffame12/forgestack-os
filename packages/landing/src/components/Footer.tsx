import { Github, BookOpen, Layers, ArrowUp, Mail } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="border-t border-white/10 bg-[#0a0a0a] pt-20 pb-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2 lg:col-span-5">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Layers className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">ForgeStack OS</span>
                        </div>
                        <p className="text-white/50 max-w-md leading-relaxed mb-8">
                            The revolutionary full-stack OS for modern developers.
                            Build, scale, and ship production-ready SaaS apps in minutes not months.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: Github, href: 'https://github.com/halloffame12' },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all duration-300"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-white/40 text-sm">
                            <li><a href="#features" className="hover:text-blue-400 transition-colors block">Features</a></li>
                            <li><a href="#selector" className="hover:text-blue-400 transition-colors block">Stack Selector</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors block">Roadmap</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors block">Changelog</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-white/40 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center"><BookOpen size={16} className="mr-2" /> Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors block">Templates</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors block">Guides</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors block">API Reference</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-white/40 text-sm mb-4">
                            Get the latest updates and developer tips directly to your inbox.
                        </p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative flex-1">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 text-sm text-white/30 space-y-4 sm:space-y-0">
                    <p>© 2026 ForgeStack OS. MIT License.</p>
                    <div className="flex items-center space-x-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <button
                            onClick={scrollToTop}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all ml-4"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

