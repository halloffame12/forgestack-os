import { motion } from 'framer-motion';
import { Github, Download, Shield, Code2, Zap, Heart, Star, Cpu } from 'lucide-react';

const TRUST_BADGES = [
    { icon: Github, label: '100% Open Source', color: 'from-white/20 to-white/10' },
    { icon: Download, label: 'Free & Local-First', color: 'from-blue-500/20 to-cyan-500/20' },
    { icon: Shield, label: 'Production-Grade', color: 'from-green-500/20 to-emerald-500/20' },
    { icon: Code2, label: 'TypeScript First', color: 'from-blue-500/20 to-indigo-500/20' },
    { icon: Zap, label: '30s Setup', color: 'from-yellow-500/20 to-orange-500/20' },
    { icon: Heart, label: 'Community Driven', color: 'from-pink-500/20 to-rose-500/20' },
    { icon: Star, label: 'Best Practices', color: 'from-purple-500/20 to-violet-500/20' },
    { icon: Cpu, label: 'Multi-Platform', color: 'from-cyan-500/20 to-teal-500/20' },
];

const TrustStrip = () => {
    return (
        <section className="py-8 border-y border-white/5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent overflow-hidden relative">
            {/* Gradient Fade Left */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
            {/* Gradient Fade Right */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling Container */}
            <div className="flex animate-marquee whitespace-nowrap">
                {[...TRUST_BADGES, ...TRUST_BADGES].map((badge, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center mx-8 shrink-0"
                        whileHover={{ scale: 1.1 }}
                    >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${badge.color} mr-3`}>
                            <badge.icon className="w-4 h-4 text-white/80" />
                        </div>
                        <span className="text-sm font-medium text-white/70 whitespace-nowrap">
                            {badge.label}
                        </span>
                    </motion.div>
                ))}
            </div>
            
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default TrustStrip;
