import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const COMPARISONS = [
    { without: 'Manual setup (days)', with: 'One command (30s)' },
    { without: 'Auth headaches', with: 'Plug & play auth' },
    { without: 'Weeks to ship', with: 'Minutes to production' },
    { without: 'Fragile configuration', with: 'Battle-tested setup' },
    { without: 'No multi-tenancy', with: 'Built-in isolation' },
    { without: 'DIY Docker setup', with: 'Optimized containers' },
];

const ComparisonSection = () => {
    return (
        <section className="py-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Before vs <span className="text-gradient">After</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg">
                        See the difference ForgeStack OS makes in your development workflow
                    </p>
                </motion.div>

                {/* Desktop: Table */}
                <div className="hidden md:block">
                    <div className="glass rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-2">
                            {/* Header */}
                            <div className="bg-red-500/10 border-b border-white/10 p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <X className="text-red-400" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold">Without ForgeStack</h3>
                                </div>
                            </div>
                            <div className="bg-green-500/10 border-b border-white/10 p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Check className="text-green-400" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold">With ForgeStack</h3>
                                </div>
                            </div>

                            {/* Rows */}
                            {COMPARISONS.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`col-span-2 grid grid-cols-2 ${index !== COMPARISONS.length - 1 ? 'border-b border-white/5' : ''
                                        }`}
                                >
                                    <div className="p-6 flex items-center space-x-3">
                                        <X className="text-red-400 shrink-0" size={16} />
                                        <span className="text-white/60">{item.without}</span>
                                    </div>
                                    <div className="p-6 flex items-center space-x-3 bg-white/[0.02]">
                                        <Check className="text-green-400 shrink-0" size={16} />
                                        <span className="text-white font-medium">{item.with}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile: Stacked Cards */}
                <div className="md:hidden space-y-4">
                    {COMPARISONS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass rounded-2xl overflow-hidden"
                        >
                            {/* Without */}
                            <div className="bg-red-500/5 p-4 border-b border-white/10">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <X className="text-red-400" size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Without</p>
                                        <p className="text-white/70">{item.without}</p>
                                    </div>
                                </div>
                            </div>

                            {/* With */}
                            <div className="bg-green-500/5 p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="text-green-400" size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">With ForgeStack</p>
                                        <p className="text-white font-medium">{item.with}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ComparisonSection;
