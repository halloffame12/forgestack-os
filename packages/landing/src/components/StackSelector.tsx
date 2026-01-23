import { useState } from 'react';
import { Terminal, Copy, Check, Info, Sparkles, Zap, Code2, Database, Shield, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const OPTIONS = {
    frontend: [
        { name: 'Next.js 14', status: 'available', icon: '⚡' },
        { name: 'React + Vite', status: 'available', icon: '⚛️' },
        { name: 'Vue + Vite', status: 'soon', icon: '💚' },
        { name: 'SvelteKit', status: 'soon', icon: '🔶' }
    ],
    backend: [
        { name: 'NestJS', status: 'available', icon: '🏗️' },
        { name: 'Express', status: 'available', icon: '🚂' },
        { name: 'Fastify', status: 'available', icon: '⚡' },
        { name: 'Bun + Elysia', status: 'available', icon: '🥟' },
        { name: 'Go + Fiber', status: 'soon', icon: '🔷' }
    ],
    auth: [
        { name: 'Clerk', status: 'available', icon: '🔐' },
        { name: 'JWT', status: 'available', icon: '🎟️' },
        { name: 'Supabase Auth', status: 'available', icon: '⚡' },
        { name: 'Auth.js', status: 'available', icon: '🔑' },
        { name: 'Firebase', status: 'available', icon: '🔥' }
    ],
    database: [
        { name: 'PostgreSQL', status: 'available', icon: '🐘' },
        { name: 'MongoDB', status: 'available', icon: '🍃' },
        { name: 'MySQL', status: 'available', icon: '🐬' },
        { name: 'SQLite', status: 'available', icon: '📦' }
    ],
};

const categoryIcons = {
    frontend: Monitor,
    backend: Code2,
    auth: Shield,
    database: Database,
};

const categoryColors = {
    frontend: 'blue',
    backend: 'purple',
    auth: 'green',
    database: 'pink',
};

const StackSelector = () => {
    const [selections, setSelections] = useState({
        frontend: 'Next.js 14',
        backend: 'NestJS',
        auth: 'Clerk',
        database: 'PostgreSQL',
    });
    const [isCopied, setIsCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('frontend');

    const getSlug = (category: string, value: string) => {
        const val = value.toLowerCase();
        if (category === 'frontend') {
            if (val.includes('next.js')) return 'nextjs';
            return val.replace(' + ', '-');
        }
        if (category === 'auth') {
            if (val === 'supabase auth') return 'supabase';
            if (val === 'auth.js') return 'authjs';
            if (val === 'firebase') return 'firebase';
            return val;
        }
        return val.replace(' + ', '-');
    };

    const command = `npx forgestack-os-cli create my-app \\
  --frontend=${getSlug('frontend', selections.frontend)} \\
  --backend=${getSlug('backend', selections.backend)} \\
  --auth=${getSlug('auth', selections.auth)} \\
  --database=${getSlug('database', selections.database)}`;

    const copyCommand = () => {
        navigator.clipboard.writeText(command.replace(/\\\n\s+/g, ' '));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <section id="selector" className="py-24 md:py-32">
            <motion.div 
                className="glass-card rounded-3xl p-8 sm:p-10 md:p-12 overflow-hidden relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute top-10 right-10 text-white/[0.02] pointer-events-none">
                    <Terminal size={250} strokeWidth={1} />
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-10 md:mb-12 text-center md:text-left">
                        <motion.div 
                            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Interactive Stack Builder</span>
                        </motion.div>
                        
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Build Your <span className="text-gradient">Perfect Stack</span>
                        </h2>
                        <p className="text-white/50 max-w-xl text-lg md:text-xl">
                            Select your technologies and watch your custom command generate in real-time
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                        {/* Selection Panel */}
                        <div className="space-y-6">
                            <Tabs defaultValue="frontend" className="w-full" onValueChange={setActiveTab}>
                                <TabsList className="w-full flex justify-start overflow-x-auto mb-6 bg-transparent p-0 gap-2">
                                    {Object.keys(OPTIONS).map((key) => {
                                        const IconComponent = categoryIcons[key as keyof typeof categoryIcons];
                                        const color = categoryColors[key as keyof typeof categoryColors];
                                        return (
                                            <TabsTrigger
                                                key={key}
                                                value={key}
                                                className={`flex items-center gap-2 uppercase tracking-wider text-xs py-2.5 px-4 bg-white/[0.03] data-[state=active]:bg-gradient-to-r data-[state=active]:from-${color}-500 data-[state=active]:to-${color}-600 data-[state=active]:text-white data-[state=active]:shadow-lg border border-white/10 data-[state=active]:border-transparent rounded-xl transition-all`}
                                            >
                                                <IconComponent size={14} />
                                                {key}
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>

                                <AnimatePresence mode="wait">
                                    {Object.entries(OPTIONS).map(([key, opts]) => (
                                        <TabsContent key={key} value={key} className="mt-0">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="grid grid-cols-2 gap-3"
                                            >
                                                {opts.map((opt, i) => (
                                                    <motion.button
                                                        key={opt.name}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        disabled={opt.status === 'soon'}
                                                        onClick={() => setSelections(prev => ({ ...prev, [key]: opt.name }))}
                                                        whileHover={opt.status !== 'soon' ? { scale: 1.02, y: -2 } : {}}
                                                        whileTap={opt.status !== 'soon' ? { scale: 0.98 } : {}}
                                                        className={`p-4 rounded-xl text-sm font-medium transition-all border text-left flex items-center justify-between group relative overflow-hidden ${
                                                            selections[key as keyof typeof selections] === opt.name
                                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-xl shadow-blue-500/20'
                                                                : opt.status === 'soon'
                                                                    ? 'bg-white/[0.02] opacity-50 cursor-not-allowed border-white/5 text-white/30'
                                                                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white hover:border-white/20'
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="text-base">{opt.icon}</span>
                                                            <span>{opt.name}</span>
                                                        </span>
                                                        {opt.status === 'soon' && (
                                                            <span className="text-[9px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded-full text-white/40">Soon</span>
                                                        )}
                                                        {selections[key as keyof typeof selections] === opt.name && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                                                            >
                                                                <Check size={12} />
                                                            </motion.div>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </motion.div>
                                        </TabsContent>
                                    ))}
                                </AnimatePresence>
                            </Tabs>

                            {/* Selected Stack Summary */}
                            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/5">
                                {Object.entries(selections).map(([key, value]) => {
                                    const color = categoryColors[key as keyof typeof categoryColors];
                                    return (
                                        <motion.div 
                                            key={key} 
                                            className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5"
                                            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.1)' }}
                                        >
                                            <p className={`text-[10px] uppercase tracking-widest text-${color}-400/60 mb-1`}>{key}</p>
                                            <p className="text-xs font-bold text-white truncate" title={value}>
                                                {value.split(' ')[0]}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Terminal Preview */}
                        <div className="flex flex-col justify-center">
                            <motion.div 
                                className="bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                                whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
                            >
                                {/* Terminal Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-xs font-mono text-white/30">forgestack-cli</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/30">
                                        <Zap size={12} className="text-green-400" />
                                        <span>Ready</span>
                                    </div>
                                </div>

                                {/* Terminal Content */}
                                <div className="p-5 md:p-6 font-mono text-sm">
                                    <div className="flex items-start mb-4">
                                        <span className="text-green-500 mr-2">➜</span>
                                        <span className="text-blue-400 mr-2">~</span>
                                    </div>
                                    <motion.pre 
                                        className="text-cyan-400 whitespace-pre-wrap break-all text-xs md:text-sm leading-relaxed"
                                        key={command}
                                        initial={{ opacity: 0.5 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {command}
                                    </motion.pre>

                                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-xs text-white/30">
                                            <Info size={12} />
                                            <span>Click to copy command</span>
                                        </div>
                                        <motion.button
                                            onClick={copyCommand}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all text-white text-sm font-medium shadow-lg shadow-blue-500/20"
                                        >
                                            <AnimatePresence mode="wait">
                                                {isCopied ? (
                                                    <motion.div
                                                        key="copied"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Check size={16} />
                                                        <span>Copied!</span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="copy"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Copy size={16} />
                                                        <span>Copy Command</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default StackSelector;

