import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Users, Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
        const interval = setInterval(fetchCount, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="border-gold-500/40 bg-gradient-to-r from-gold-800/40 via-gold-700/30 to-gold-800/40 overflow-hidden">
            <CardContent className="pt-6 pb-6">
                <div className="text-center">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-gold-400" />
                        <p className="text-gold-300 font-medium">
                            {t('counter.title')}
                        </p>
                    </div>
                    
                    {/* Counter */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={count}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={`flex items-center justify-center gap-3 ${isAnimating ? 'animate-pulse' : ''}`}
                        >
                            <span className="text-5xl md:text-6xl lg:text-7xl font-bold gold-shimmer tabular-nums">
                                {count.toLocaleString()}
                            </span>
                            <span className="text-gold-400 text-lg md:text-xl">
                                {t('counter.people')}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Live indicator */}
                    <div className="flex items-center justify-center mt-4">
                        <Badge variant="success" className="gap-1.5 px-3 py-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <Radio className="w-3 h-3" />
                            Live
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
