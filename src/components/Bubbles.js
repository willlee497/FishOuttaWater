'use client';

import { motion } from 'framer-motion';

const bubbleVariants = {
    float: {
        y: [0, -30, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export default function BubblesBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(100)].map((_, i) => {
                const scale = Math.random() * 0.8 + 0.4;
                return (
                    <motion.div
                        key={i}
                        className="absolute bg-blue-300 rounded-full opacity-40"
                        style={{
                            width: '50px',
                            height: '50px',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            transform: `scale(${scale})`,
                        }}
                        variants={bubbleVariants}
                        animate="float"
                    />
                );
            })}
        </div>
    );
}
