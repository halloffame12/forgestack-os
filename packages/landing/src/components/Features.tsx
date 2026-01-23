import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Layers, Cpu, Code2, Workflow, Stethoscope } from 'lucide-react';

const FEATURE_LIST = [
    {
        title: 'Local-First',
        description: 'Works 100% offline. No cloud account required to generate your project.',
        icon: <Zap className="text-yellow-400" />,
        color: 'yellow',
        gradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
        title: 'Any Stack',
        description: '150+ valid combinations including Next.js, NestJS, Express, and more.',
        icon: <Globe className="text-blue-400" />,
        color: 'blue',
        gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        title: 'Production-Ready',
        description: 'Built-in multi-tenancy, Docker, and environment management.',
        icon: <Shield className="text-green-400" />,
        color: 'green',
        gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
        title: 'Modular Design',
        description: 'Clean, extensible architecture that follows best practices.',
        icon: <Layers className="text-purple-400" />,
        color: 'purple',
        gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
        title: 'Type-Safe',
        description: 'Full TypeScript support across the entire generated codebase.',
        icon: <Code2 className="text-pink-400" />,
        color: 'pink',
        gradient: 'from-pink-500/20 to-rose-500/20'
    },
    {
        title: 'Fast Deployment',
        description: 'Ready to deploy to Vercel, Render, or any other platform.',
        icon: <Cpu className="text-red-400" />,
        color: 'red',
        gradient: 'from-red-500/20 to-orange-500/20'
    },
    {
        title: 'Doctor Command',
        description: 'Validate your environment, detect issues, and fix problems before they slow you down.',
        icon: <Stethoscope className="text-teal-400" />,
        color: 'teal',
        gradient: 'from-teal-500/20 to-cyan-500/20',
        isNew: true
    },
    {
        title: 'Batch Execution',
        description: 'Run complex task workflows sequentially or in parallel with error handling.',
        icon: <Workflow className="text-cyan-400" />,
        color: 'cyan',
        gradient: 'from-cyan-500/20 to-blue-500/20'
    },
];

const Features = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl -z-10" />
            
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-white/80 mb-6">
                        <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                        <span className="text-sm font-medium">Powerful Features</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Why <span className="text-gradient">ForgeStack OS</span>?
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
                        The ultimate toolkit for building modern full-stack applications without the headaches.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURE_LIST.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 h-full`}>
                                {/* New badge */}
                                {feature.isNew && (
                                    <div className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg shadow-green-500/30">
                                        NEW
                                    </div>
                                )}
                                
                                {/* Icon */}
                                <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-white/5">
                                    {React.cloneElement(feature.icon, { size: 24 })}
                                </div>
                                
                                {/* Content */}
                                <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

