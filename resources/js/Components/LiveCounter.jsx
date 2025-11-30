import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function LiveCounter() {
    const { t } = useTranslation();
    const [count, setCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const fetchCount = async () => {
        try {
            const response = await axios.get('/api/interests/count');
            if (response.data.success) {
                const newCount = response.data.count;
                if (newCount !== count) {
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 500);
                }
                setCount(newCount);
            }
        } catch (error) {
            console.error('Error fetching count:', error);
        }
    };

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gold-600/30 via-gold-500/40 to-gold-600/30 backdrop-blur-md rounded-2xl p-6 border border-gold-500/50 shadow-2xl"
        >
            <div className="text-center">
                <p className="text-gold-300 text-sm mb-2 font-medium">
                    {t('counter.title')}
                </p>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={count}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`flex items-center justify-center gap-2 ${isAnimating ? 'animate-pulse' : ''}`}
                    >
                        <span className="text-5xl md:text-6xl font-bold gold-shimmer">
                            {count.toLocaleString()}
                        </span>
                        <span className="text-gold-400 text-lg">
                            {t('counter.people')}
                        </span>
                    </motion.div>
                </AnimatePresence>
                
                {/* Live indicator */}
                <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 text-xs">Live</span>
                </div>
            </div>
        </motion.div>
    );
}

