import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function GoldBarsAnimation() {
    const goldBars = useMemo(() => {
        return Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 15,
            duration: 15 + Math.random() * 10,
            size: 20 + Math.random() * 30,
            rotation: Math.random() * 360,
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {goldBars.map((bar) => (
                <motion.div
                    key={bar.id}
                    className="absolute"
                    style={{
                        left: `${bar.left}%`,
                        top: '-10%',
                    }}
                    initial={{ y: '-100vh', rotate: 0, opacity: 0 }}
                    animate={{
                        y: '110vh',
                        rotate: bar.rotation,
                        opacity: [0, 0.6, 0.6, 0],
                    }}
                    transition={{
                        duration: bar.duration,
                        delay: bar.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {/* Gold Bar SVG */}
                    <svg
                        width={bar.size}
                        height={bar.size * 0.6}
                        viewBox="0 0 100 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id={`goldGradient${bar.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#D8BC75" />
                                <stop offset="30%" stopColor="#DBA661" />
                                <stop offset="50%" stopColor="#F5D485" />
                                <stop offset="70%" stopColor="#DA9755" />
                                <stop offset="100%" stopColor="#C8844B" />
                            </linearGradient>
                            <linearGradient id={`goldShadow${bar.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#AA6537" />
                                <stop offset="100%" stopColor="#633F27" />
                            </linearGradient>
                        </defs>
                        {/* Bottom face */}
                        <polygon
                            points="15,55 85,55 95,45 5,45"
                            fill={`url(#goldShadow${bar.id})`}
                        />
                        {/* Left face */}
                        <polygon
                            points="5,45 5,20 15,10 15,55"
                            fill="#AA6537"
                        />
                        {/* Right face */}
                        <polygon
                            points="95,45 95,20 85,10 85,55"
                            fill="#82502E"
                        />
                        {/* Top face */}
                        <polygon
                            points="15,10 85,10 95,20 5,20"
                            fill={`url(#goldGradient${bar.id})`}
                        />
                        {/* Front face */}
                        <polygon
                            points="5,20 95,20 95,45 5,45"
                            fill={`url(#goldGradient${bar.id})`}
                        />
                        {/* Shine effect */}
                        <polygon
                            points="10,22 40,22 40,30 10,30"
                            fill="rgba(255,255,255,0.3)"
                        />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}

