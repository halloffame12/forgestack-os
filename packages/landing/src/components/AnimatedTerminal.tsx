import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Check, Copy, Circle, Sparkles } from 'lucide-react';

interface Command {
    text: string;
    delay?: number;
    type?: 'prompt' | 'info' | 'success' | 'command';
    question?: string;
    answer?: string;
}

const commands: Command[] = [
    { text: "npx forgestack-os-cli create my-saas", type: "command" },
    { text: '?', type: 'prompt', question: 'Frontend Framework?', answer: 'Next.js 14 (App Router)', delay: 800 },
    { text: '?', type: 'prompt', question: 'Backend Framework?', answer: 'NestJS (Enterprise)', delay: 800 },
    { text: '?', type: 'prompt', question: 'Authentication?', answer: 'Clerk', delay: 800 },
    { text: '?', type: 'prompt', question: 'Database?', answer: 'PostgreSQL + Prisma', delay: 1200 },
    { text: '✨ Generating your project structure...', delay: 600, type: 'info' },
    { text: '📦 Installing dependencies (pnpm)...', delay: 1500, type: 'info' },
    { text: '🐳 Configuring Docker containers...', delay: 1000, type: 'info' },
    { text: '✅ Successfully created my-saas', delay: 400, type: 'success' },
    { text: '🚀 Ready to ship!', delay: 200, type: 'success' },
];

const AnimatedTerminal = () => {
    const [visibleLines, setVisibleLines] = useState<Command[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    const [isTyping, setIsTyping] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let currentLine = 0;
        let isMounted = true;

        const processLine = () => {
            if (!isMounted) return;
            if (currentLine >= commands.length) {
                setIsTyping(false);
                return;
            }

            const commandToProcess = commands[currentLine];
            if (!commandToProcess) return;

            setVisibleLines(prev => [...prev, commandToProcess]);

            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }

            const delay = commandToProcess.delay || 800;
            currentLine++;
            timeoutId = setTimeout(processLine, delay);
        };

        timeoutId = setTimeout(processLine, 500);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    const copyCommand = () => {
        navigator.clipboard.writeText('npx forgestack-os-cli create my-saas');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl shadow-blue-500/10 font-mono text-sm leading-relaxed">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-white/[0.03] to-white/[0.06] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex space-x-2">
                        <motion.div 
                            className="w-3 h-3 rounded-full bg-red-500"
                            whileHover={{ scale: 1.2 }}
                        />
                        <motion.div 
                            className="w-3 h-3 rounded-full bg-yellow-500"
                            whileHover={{ scale: 1.2 }}
                        />
                        <motion.div 
                            className="w-3 h-3 rounded-full bg-green-500"
                            whileHover={{ scale: 1.2 }}
                        />
                    </div>
                    <div className="hidden sm:flex items-center gap-2 ml-4 text-white/30 text-xs">
                        <Terminal size={12} />
                        <span>forgestack-cli</span>
                    </div>
                </div>
                
                <motion.button
                    onClick={copyCommand}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence mode="wait">
                        {isCopied ? (
                            <motion.div
                                key="copied"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center gap-1 text-green-400"
                            >
                                <Check size={14} />
                                <span>Copied!</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center gap-1"
                            >
                                <Copy size={14} />
                                <span>Copy</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Terminal Content */}
            <div
                ref={scrollRef}
                className="p-5 sm:p-6 min-h-[320px] sm:min-h-[380px] max-h-[380px] overflow-y-auto relative"
            >
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                <AnimatePresence>
                    {visibleLines.map((line, i) => {
                        if (!line) return null;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="mb-3 relative z-10"
                            >
                                {line.type === 'prompt' ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                                        <span className="text-green-500 mr-2 font-bold">?</span>
                                        <span className="font-semibold text-white/90 mr-2">{line.question}</span>
                                        <motion.span 
                                            className="text-blue-400 font-medium"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            › {line.answer}
                                        </motion.span>
                                    </div>
                                ) : line.type === 'success' ? (
                                    <motion.div 
                                        className="text-green-400 font-bold flex items-center gap-2"
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        {line.text.includes('🚀') && <Sparkles size={14} className="text-yellow-400" />}
                                        {line.text}
                                    </motion.div>
                                ) : line.type === 'info' ? (
                                    <div className="flex items-start text-white/70">
                                        <span>{line.text}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-start">
                                        <span className="text-blue-500 mr-3 mt-0.5">➜</span>
                                        <span className="text-cyan-400">{line.text}</span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Typing Cursor */}
                {isTyping && (
                    <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7 }}
                        className="inline-block w-2.5 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm ml-1 shadow-lg shadow-blue-500/50"
                    />
                )}
            </div>

            {/* Terminal Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02] flex items-center justify-between text-xs text-white/30">
                <span>forgestack-os-cli v0.3.5</span>
                <div className="flex items-center gap-2">
                    <Circle size={6} className={`${isTyping ? 'text-yellow-500 animate-pulse' : 'text-green-500'} fill-current`} />
                    <span>{isTyping ? 'Running...' : 'Complete'}</span>
                </div>
            </div>
        </div>
    );
};

export default AnimatedTerminal;
