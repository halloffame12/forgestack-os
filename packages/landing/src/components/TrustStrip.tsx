import { motion } from 'framer-motion';
import { Github, Download, Shield, Code2 } from 'lucide-react';

const TRUST_BADGES = [
    {
        icon: <Github className="w-5 h-5" />,
        label: '100% Open Source',
        color: 'text-white'
    },
    {
        icon: <Download className="w-5 h-5" />,
        label: 'Free & Local-First',
        color: 'text-blue-400'
    },
    {
        icon: <Shield className="w-5 h-5" />,
        label: 'Production-Grade',
        color: 'text-green-400'
    },
    {
        icon: <Code2 className="w-5 h-5" />,
        label: 'Built for Developers',
        color: 'text-purple-400'
    },
];

const TrustStrip = () => {
    return (
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
            <div className="container-custom">
                <div className="flex items-center justify-center gap-8 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                    {TRUST_BADGES.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center space-x-3 snap-center shrink-0"
                        >
                            <div className={`${badge.color}`}>
                                {badge.icon}
                            </div>
                            <span className="text-sm md:text-base font-medium text-white/80 whitespace-nowrap">
                                {badge.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustStrip;
