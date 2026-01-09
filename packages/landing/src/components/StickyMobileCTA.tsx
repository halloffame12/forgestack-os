import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const StickyMobileCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show CTA after scrolling past hero section (approximately 800px)
            const scrollPosition = window.scrollY;
            setIsVisible(scrollPosition > 800);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                >
                    <div className="bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 p-4 shadow-2xl">
                        <a href="#selector" className="block">
                            <Button
                                variant="gradient"
                                size="lg"
                                className="w-full shadow-lg shadow-blue-500/30"
                            >
                                Get Started
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyMobileCTA;
