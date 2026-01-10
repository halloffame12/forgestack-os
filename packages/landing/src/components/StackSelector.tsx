import { useState } from 'react';
import { Terminal, Copy, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const OPTIONS = {
    frontend: [
        { name: 'Next.js 14', status: 'available' },
        { name: 'React + Vite', status: 'available' },
        { name: 'Vue + Vite', status: 'soon' },
        { name: 'SvelteKit', status: 'soon' }
    ],
    backend: [
        { name: 'NestJS', status: 'available' },
        { name: 'Express', status: 'available' },
        { name: 'Fastify', status: 'available' },
        { name: 'Bun + Elysia', status: 'available' },
        { name: 'Go + Fiber', status: 'soon' }
    ],
    auth: [
        { name: 'Clerk', status: 'available' },
        { name: 'JWT', status: 'available' },
        { name: 'Supabase Auth', status: 'available' },
        { name: 'Auth.js', status: 'available' },
        { name: 'Firebase', status: 'available' }
    ],
    database: [
        { name: 'PostgreSQL', status: 'available' },
        { name: 'MongoDB', status: 'available' },
        { name: 'MySQL', status: 'available' },
        { name: 'SQLite', status: 'available' }
    ],
};

const StackSelector = () => {
    const [selections, setSelections] = useState({
        frontend: 'Next.js 14',
        backend: 'NestJS',
        auth: 'Clerk',
        database: 'PostgreSQL',
    });
    const [isCopied, setIsCopied] = useState(false);

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

    const command = `npx forgestack-os-cli create my-app --frontend=${getSlug('frontend', selections.frontend)} --backend=${getSlug('backend', selections.backend)} --auth=${getSlug('auth', selections.auth)} --database=${getSlug('database', selections.database)}`;

    const copyCommand = () => {
        navigator.clipboard.writeText(command);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <section id="selector" className="py-20">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                    <Terminal size={200} />
                </div>

                <div className="relative z-10">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-center sm:text-left">Choose Your <span className="text-gradient">Stack</span></h2>
                        <p className="text-white/60 max-w-xl text-center sm:text-left text-lg">
                            Experience the power of ForgeStack OS. Pick your favorite technologies and generate their code in seconds.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        <div className="space-y-8">
                            <Tabs defaultValue="frontend" className="w-full">
                                <TabsList className="w-full flex justify-start overflow-x-auto mb-6 bg-transparent p-0 space-x-2">
                                    {Object.keys(OPTIONS).map((key) => (
                                        <TabsTrigger
                                            key={key}
                                            value={key}
                                            className="uppercase tracking-widest text-xs py-2 px-4 bg-white/5 data-[state=active]:bg-blue-600 data-[state=active]:text-white border border-white/10 rounded-full"
                                        >
                                            {key}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {Object.entries(OPTIONS).map(([key, opts]) => (
                                    <TabsContent key={key} value={key} className="mt-0">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid grid-cols-2 gap-3"
                                        >
                                            {opts.map(opt => (
                                                <button
                                                    key={opt.name}
                                                    disabled={opt.status === 'soon'}
                                                    onClick={() => setSelections(prev => ({ ...prev, [key]: opt.name }))}
                                                    className={`p-4 rounded-xl text-sm font-medium transition-all border text-left flex items-center justify-between group relative overflow-hidden ${selections[key as keyof typeof selections] === opt.name
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                                                        : opt.status === 'soon'
                                                            ? 'bg-white/2 opacity-50 cursor-not-allowed border-white/5 text-white/20'
                                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20'
                                                        }`}
                                                >
                                                    <span>{opt.name}</span>
                                                    {opt.status === 'soon' && (
                                                        <span className="text-[8px] uppercase tracking-tighter bg-white/10 px-1.5 py-0.5 rounded text-white/40">Soon</span>
                                                    )}
                                                    {selections[key as keyof typeof selections] === opt.name && (
                                                        <Check size={16} />
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </TabsContent>
                                ))}
                            </Tabs>

                            {/* Mobile View: Show all categories stacked for quick selection without tabs */}
                            <div className="block sm:hidden space-y-8">
                                {Object.entries(OPTIONS).map(([key, opts]) => (
                                    <div key={key}>
                                        <h3 className="text-xs font-bold uppercase text-white/40 mb-3 tracking-widest">{key}</h3>
                                        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
                                            {opts.map(opt => (
                                                <button
                                                    key={opt.name}
                                                    disabled={opt.status === 'soon'}
                                                    onClick={() => setSelections(prev => ({ ...prev, [key]: opt.name }))}
                                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border whitespace-nowrap snap-center relative ${selections[key as keyof typeof selections] === opt.name
                                                        ? 'bg-blue-600 border-blue-500 text-white'
                                                        : opt.status === 'soon'
                                                            ? 'bg-white/2 opacity-40 cursor-not-allowed border-white/5 text-white/20'
                                                            : 'bg-white/5 border-white/10 text-white/60'
                                                        }`}
                                                >
                                                    {opt.name}
                                                    {opt.status === 'soon' && (
                                                        <span className="ml-2 text-[8px] uppercase tracking-tighter bg-white/10 px-1 py-0.5 rounded text-white/40">Soon</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                {/* Terminal Header */}
                                <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex-1 text-center text-xs font-mono text-white/40">bash — 80x24</div>
                                </div>

                                {/* Terminal Content */}
                                <div className="p-6 font-mono text-sm">
                                    <div className="flex items-start mb-4">
                                        <span className="text-green-500 mr-2">➜</span>
                                        <span className="text-blue-400 mr-2">~</span>
                                        <span className="text-white/60 typing-effect">{command}</span>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                                        <div className="flex items-center text-xs text-white/40">
                                            <Info size={14} className="mr-1.5" />
                                            Click to copy
                                        </div>
                                        <button
                                            onClick={copyCommand}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80"
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check size={16} className="text-green-400" />
                                                    <span className="text-green-400">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    <span>Copy Command</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stack Summary */}
                            <div className="mt-8 grid grid-cols-4 gap-4">
                                {Object.entries(selections).map(([key, value]) => (
                                    <div key={key} className="text-center">
                                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{key}</p>
                                        <p className="text-xs font-bold text-white truncate" title={value}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StackSelector;

