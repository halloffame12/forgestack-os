import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

const Creator = () => {
    return (
        <section id="creator" className="py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Built by Developers</h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        ForgeStack OS is an open-source project driven by the community and a passion for developer experience.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass p-8 sm:p-12 relative overflow-hidden rounded-3xl"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl -z-10" />

                        <div className="flex flex-col md:flex-row items-center gap-10">
                            {/* Avatar */}
                            <div className="relative group shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-white/20 transition-colors">
                                    <img
                                        src="https://i.postimg.cc/59RkKQ6k/sumit-img-l.jpg"
                                        alt="Sumit Chauhan"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left space-y-6">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Sumit Chauhan</h3>
                                    <p className="text-blue-400 font-medium tracking-wide uppercase text-sm">Full-Stack Developer & Platform Engineer</p>
                                </div>

                                <p className="text-white/60 text-lg leading-relaxed">
                                    Dedicated to building tools that make software development faster, better, and more accessible.
                                    ForgeStack OS is the culmination of years of experience in building scalable SaaS platforms.
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    {[
                                        { icon: <Github size={20} />, label: 'GitHub', href: 'https://github.com/halloffame12' },
                                        { icon: <Linkedin size={20} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/sumit-chauhan-a4ba98325/' },
                                    ].map((social) => (
                                        <motion.a
                                            key={social.label}
                                            whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 transition-all text-white/80 hover:text-white"
                                        >
                                            {social.icon}
                                            <span className="font-medium">{social.label}</span>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Creator;

