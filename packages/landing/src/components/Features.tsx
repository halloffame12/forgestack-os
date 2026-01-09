import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Layers, Cpu, Code2 } from 'lucide-react';

const FEATURE_LIST = [
    {
        title: 'Local-First',
        description: 'Works 100% offline. No cloud account required to generate your project.',
        icon: <Zap className="text-yellow-400" />,
        color: 'yellow'
    },
    {
        title: 'Any Stack',
        description: '150+ valid combinations including Next.js, NestJS, Express, and more.',
        icon: <Globe className="text-blue-400" />,
        color: 'blue'
    },
    {
        title: 'Production-Ready',
        description: 'Built-in multi-tenancy, Docker, and environment management.',
        icon: <Shield className="text-green-400" />,
        color: 'green'
    },
    {
        title: 'Modular Design',
        description: 'Clean, extensible architecture that follows best practices.',
        icon: <Layers className="text-purple-400" />,
        color: 'purple'
    },
    {
        title: 'Type-Safe',
        description: 'Full TypeScript support across the entire generated codebase.',
        icon: <Code2 className="text-pink-400" />,
        color: 'pink'
    },
    {
        title: 'Fast Deployment',
        description: 'Ready to deploy to Vercel, Render, or any other platform.',
        icon: <Cpu className="text-red-400" />,
        color: 'red'
    },
];

const Features = () => {
    return (
        <section id="features" className="py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Why ForgeStack OS?</h2>
                <p className="text-white/60 max-w-2xl mx-auto text-lg">
                    The ultimate toolkit for building modern full-stack applications without the headaches.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURE_LIST.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all"
                    >
                        <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-white/50 leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Features;
