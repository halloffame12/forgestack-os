import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STACKS = [
    { name: 'React + Vite', category: 'Frontend', status: 'available' },
    { name: 'Next.js 14', category: 'Frontend', status: 'available' },
    { name: 'Vue + Vite', category: 'Frontend', status: 'soon' },
    { name: 'NestJS', category: 'Backend', status: 'available' },
    { name: 'Express', category: 'Backend', status: 'available' },
    { name: 'Fastify', category: 'Backend', status: 'available' },
    { name: 'Bun + Elysia', category: 'Backend', status: 'available' },
    { name: 'Clerk', category: 'Auth', status: 'available' },
    { name: 'JWT Auth', category: 'Auth', status: 'available' },
    { name: 'Supabase Auth', category: 'Auth', status: 'available' },
    { name: 'Auth.js', category: 'Auth', status: 'available' },
    { name: 'Firebase', category: 'Auth', status: 'available' },
    { name: 'PostgreSQL', category: 'Database', status: 'available' },
    { name: 'MongoDB', category: 'Database', status: 'available' },
    { name: 'MySQL', category: 'Database', status: 'available' },
    { name: 'SQLite', category: 'Database', status: 'available' },
    { name: 'Docker', category: 'Infrastructure', status: 'available' },
    { name: 'Prisma', category: 'ORM', status: 'available' },
    { name: 'Tailwind CSS', category: 'Styling', status: 'available' },
];

const SupportedStacks = () => {
    return (
        <section className="py-20 text-center">
            <h2 className="text-3xl font-bold mb-12">Universal Compatibility</h2>
            <div className="inline-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 rounded-3xl bg-white/5 border border-white/10">
                {STACKS.map((stack, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center space-x-2 px-4 py-2 text-left ${stack.status === 'soon' ? 'opacity-40' : ''}`}
                    >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                            {stack.status === 'soon' ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            ) : (
                                <Check className="text-blue-400" size={12} strokeWidth={4} />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-white leading-none">{stack.name}</p>
                                {stack.status === 'soon' && (
                                    <span className="text-[7px] uppercase tracking-tighter bg-white/10 px-1 py-0.5 rounded text-white/40">Soon</span>
                                )}
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-white/30">{stack.category}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SupportedStacks;
