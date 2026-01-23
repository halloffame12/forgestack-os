import { motion } from 'framer-motion';
import { Layers, Terminal, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

const STEPS = [
    {
        icon: <Layers className="w-7 h-7" />,
        title: 'Choose Your Stack',
        description: 'Select from 150+ combinations of frontend, backend, auth, and database technologies.',
        code: `# Pick your perfect stack
Frontend: Next.js, React, Vue, Svelte
Backend: NestJS, Express, Fastify
Auth: Clerk, JWT, Supabase
Database: PostgreSQL, MongoDB, MySQL`,
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: <Terminal className="w-7 h-7" />,
        title: 'Run One Command',
        description: 'Execute a single CLI command and watch your application scaffold itself in seconds.',
        code: `npx forgestack-os-cli create my-app \\
  --frontend=nextjs \\
  --backend=nestjs \\
  --auth=clerk \\
  --database=postgresql`,
        color: 'purple',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: <Rocket className="w-7 h-7" />,
        title: 'Start Building',
        description: 'Jump straight into building features with a production-ready foundation.',
        code: `✓ Multi-tenant architecture
✓ Authentication configured
✓ Database connected
✓ Docker ready
→ Start coding!`,
        color: 'green',
        gradient: 'from-green-500 to-emerald-500'
    }
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/20' }
};

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);
    
    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />

            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 md:mb-20"
                >
                    <motion.div 
                        className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Simple 3-Step Process</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg md:text-xl">
                        From idea to production-ready application in three simple steps
                    </p>
                </motion.div>

                {/* Timeline Connector - Desktop */}
                <div className="hidden md:block relative mb-16">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-full" />
                    <div className="flex justify-between relative z-10">
                        {STEPS.map((step, index) => {
                            const colors = colorMap[step.color];
                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                        activeStep === index 
                                            ? `bg-gradient-to-br ${step.gradient} shadow-xl ${colors.glow}` 
                                            : `${colors.bg} border ${colors.border} hover:scale-110`
                                    }`}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className={activeStep === index ? 'text-white' : colors.text}>
                                        {step.icon}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {STEPS.map((step, index) => (
                        <StepCard 
                            key={index} 
                            step={step} 
                            index={index} 
                            isActive={activeStep === index}
                            onClick={() => setActiveStep(index)}
                        />
                    ))}
                </div>

                {/* Bottom Arrow */}
                <motion.div 
                    className="flex justify-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <motion.a
                        href="#selector"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Try It Now</span>
                        <ArrowRight size={18} />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

const StepCard = ({ step, index, isActive, onClick }: { 
    step: typeof STEPS[0]; 
    index: number; 
    isActive: boolean;
    onClick: () => void;
}) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const colors = colorMap[step.color];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            onClick={onClick}
            className="relative cursor-pointer group"
        >
            {/* Step number */}
            <motion.div 
                className={`absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center font-bold text-lg z-10 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
            >
                {index + 1}
            </motion.div>

            <div className={`glass-card rounded-2xl p-6 md:p-8 h-full transition-all duration-500 group-hover:border-white/20 ${
                isActive ? 'ring-2 ring-white/20 bg-white/[0.06]' : ''
            }`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${colors.text}`}>
                    {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-gradient transition-all">{step.title}</h3>
                <p className="text-white/50 mb-6 leading-relaxed">{step.description}</p>

                {/* Code snippet */}
                <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 group-hover:border-white/10 transition-colors overflow-hidden">
                    <pre className="text-xs md:text-sm font-mono text-white/60 overflow-x-auto">
                        <code>{step.code}</code>
                    </pre>
                </div>

                {/* Hover Glow */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl ${colors.bg}`} />
            </div>
        </motion.div>
    );
};

export default HowItWorks;
