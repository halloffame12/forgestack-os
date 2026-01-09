import { motion } from 'framer-motion';
import { Layers, Terminal, Rocket } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const STEPS = [
    {
        icon: <Layers className="w-8 h-8" />,
        title: 'Choose Your Stack',
        description: 'Select from 150+ combinations of frontend, backend, auth, and database technologies.',
        code: `# Pick your perfect stack
Frontend: Next.js, React, Vue, Svelte
Backend: NestJS, Express, Fastify
Auth: Clerk, JWT, Supabase
Database: PostgreSQL, MongoDB, MySQL`,
        color: 'blue'
    },
    {
        icon: <Terminal className="w-8 h-8" />,
        title: 'Run One Command',
        description: 'Execute a single CLI command and watch your application scaffold itself in seconds.',
        code: `npx forgestack-os-cli create my-app \\
  --frontend=nextjs \\
  --backend=nestjs \\
  --auth=clerk \\
  --database=postgresql`,
        color: 'purple'
    },
    {
        icon: <Rocket className="w-8 h-8" />,
        title: 'Start Building',
        description: 'Jump straight into building features with a production-ready foundation.',
        code: `✓ Multi-tenant architecture
✓ Authentication configured
✓ Database connected
✓ Docker ready
→ Start coding!`,
        color: 'green'
    }
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' }
};

const HowItWorks = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent -z-10" />

            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        Three simple steps to go from idea to production-ready application
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {STEPS.map((step, index) => (
                        <StepCard key={index} step={step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ step, index }: { step: typeof STEPS[0]; index: number }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const colors = colorMap[step.color];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative"
        >
            {/* Step number */}
            <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xl z-10">
                {index + 1}
            </div>

            <div className="glass rounded-2xl p-6 h-full hover:bg-white/[0.08] transition-all group">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colors.text}`}>
                    {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/60 mb-6 leading-relaxed">{step.description}</p>

                {/* Code snippet */}
                <div className="bg-black/50 rounded-lg p-4 border border-white/5">
                    <pre className="text-xs font-mono text-white/70 overflow-x-auto">
                        <code>{step.code}</code>
                    </pre>
                </div>
            </div>
        </motion.div>
    );
};

export default HowItWorks;
