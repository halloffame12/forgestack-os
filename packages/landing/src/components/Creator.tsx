import { motion } from 'framer-motion';
import { Github, Linkedin, Code2, Sparkles, Heart } from 'lucide-react';

const Creator = () => {
    return (
        <section id="creator" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent -z-10" />
            
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <motion.div 
                        className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Code2 className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Meet the Creator</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-black mb-4">
                        Built with <Heart className="inline w-8 h-8 text-red-500 fill-current mx-1" /> by Developers
                    </h2>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg">
                        ForgeStack OS is an open-source project driven by the community and a passion for developer experience.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card p-8 sm:p-10 md:p-12 relative overflow-hidden rounded-3xl group"
                    >
                        {/* Background Decorations */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl -z-10" />
                        
                        {/* Sparkle Decorations */}
                        <Sparkles className="absolute top-8 right-8 w-6 h-6 text-yellow-500/30 animate-pulse" />
                        <Sparkles className="absolute bottom-12 left-12 w-4 h-4 text-blue-500/30 animate-pulse" style={{ animationDelay: '1s' }} />

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            {/* Avatar */}
                            <motion.div 
                                className="relative group/avatar shrink-0"
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Animated Ring */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-md group-hover/avatar:opacity-60 transition-opacity animate-gradient" />
                                
                                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white/10 group-hover/avatar:border-white/20 transition-colors">
                                    <img
                                        src="https://i.postimg.cc/59RkKQ6k/sumit-img-l.jpg"
                                        alt="Sumit Chauhan"
                                        className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                
                                {/* Status Badge */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span>Available</span>
                                </div>
                            </motion.div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left space-y-5">
                                <div>
                                    <motion.h3 
                                        className="text-3xl md:text-4xl font-black text-white mb-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        Sumit Chauhan
                                    </motion.h3>
                                    <p className="text-gradient font-bold tracking-wide text-sm uppercase">
                                        Full-Stack Developer & Platform Engineer
                                    </p>
                                </div>

                                <p className="text-white/50 text-lg leading-relaxed">
                                    Dedicated to building tools that make software development faster, better, and more accessible.
                                    ForgeStack OS is the culmination of years of experience in building scalable SaaS platforms.
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    {[
                                        { icon: Github, label: 'GitHub', href: 'https://github.com/halloffame12', color: 'hover:bg-white/10 hover:border-white/20' },
                                        { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/sumit-chauhan-a4ba98325/', color: 'hover:bg-blue-500/10 hover:border-blue-500/30' },
                                    ].map((social) => (
                                        <motion.a
                                            key={social.label}
                                            whileHover={{ y: -3, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 transition-all text-white/70 hover:text-white ${social.color}`}
                                        >
                                            <social.icon size={18} />
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

