import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Check, Copy, Circle } from 'lucide-react';

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
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let currentLine = 0;
        let isMounted = true;

        const processLine = () => {
            if (!isMounted) return;
            // Strict check to prevent out of bounds access
            if (currentLine >= commands.length) return;

            const commandToProcess = commands[currentLine];

            // Safety check
            if (!commandToProcess) return;

            setVisibleLines(prev => {
                // Defensive: ensure we don't add duplicates if logic is racy (though local var prevents it usually)
                return [...prev, commandToProcess];
            });

            // Scroll to bottom
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }

            const delay = commandToProcess.delay || 800;
            currentLine++;

            timeoutId = setTimeout(processLine, delay);
        };

        // Start animation
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
        <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-blue-500/10 font-mono text-sm leading-relaxed">
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex space-x-2">
                    <Circle size={10} className="fill-red-500 text-red-500" />
                    <Circle size={10} className="fill-yellow-500 text-yellow-500" />
                    <Circle size={10} className="fill-green-500 text-green-500" />
                </div>
                <div className="flex items-center space-x-2 text-white/30 text-xs">
                    <Terminal size={12} />
                    <span>bash — 80x24</span>
                </div>
                <button
                    onClick={copyCommand}
                    className="text-white/30 hover:text-white transition-colors"
                >
                    {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
            </div>

            <div
                ref={scrollRef}
                className="p-6 min-h-[380px] h-[380px] overflow-y-auto relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none h-full" />

                {visibleLines.map((line, i) => {
                    if (!line) return null; // Defensive check to prevent crash
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-3 relative z-10"
                        >
                            {line.type === 'prompt' ? (
                                <div className="flex flex-col sm:flex-row sm:items-center text-white/80">
                                    <span className="text-green-500 mr-2">?</span>
                                    <span className="font-bold mr-2">{line.question}</span>
                                    <span className="text-blue-400">{line.answer}</span>
                                </div>
                            ) : line.type === 'success' ? (
                                <div className="text-green-400 font-bold">
                                    {line.text}
                                </div>
                            ) : (
                                <div className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">➜</span>
                                    <span className="text-white/70">{line.text}</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {visibleLines.length < commands.length && (
                    <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2.5 h-5 bg-blue-500 align-middle mt-1 box-shadow-glow relative z-10"
                    />
                )}
            </div>
        </div>
    );
};

export default AnimatedTerminal;
