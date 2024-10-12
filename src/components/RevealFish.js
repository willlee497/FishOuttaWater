'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CanvasRevealEffect({
    imagePath,
    revealText = 'Invasive Fish', // Default hidden text
}) {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div
            className="relative w-64 h-64 overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onMouseEnter={() => setIsRevealed(true)}
        >
            {/* Image that is revealed */}
            <motion.img
                src={imagePath}
                alt="Revealed Image"
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
            />

            {/* Blue wave animation */}
            {!isRevealed && (
                <motion.svg
                    className="absolute inset-0 w-full h-full z-10"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    initial="hidden"
                    animate={isRevealed ? 'visible' : 'hidden'}
                >
                    <motion.path
                        d="M 0 100 V 100 Q 25 100 50 100 T 100 100 V 100 z"
                        fill="blue" // Blue wave color
                        variants={{
                            hidden: {
                                d: 'M 0 100 V 100 Q 25 100 50 100 T 100 100 V 100 z',
                            },
                            visible: {
                                d: [
                                    'M 0 100 V 50 Q 25 0 50 50 T 100 50 V 100 z',
                                    'M 0 100 V 0 Q 25 0 50 0 T 100 0 V 100 z',
                                ],
                            },
                        }}
                        transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                        }}
                    />
                    {/* Adding some splashing effect on the wave */}
                    <motion.circle
                        cx="50"
                        cy="25"
                        r="4"
                        fill="white"
                        initial={{ opacity: 0 }}
                        animate={
                            isRevealed
                                ? {
                                      opacity: 1,
                                      scale: [0.5, 1.5, 1],
                                      y: [0, -10, 0],
                                  }
                                : { opacity: 0 }
                        }
                        transition={{
                            delay: 0.5,
                            duration: 0.4,
                            repeat: Infinity,
                            repeatType: 'loop',
                        }}
                    />
                    <motion.circle
                        cx="70"
                        cy="15"
                        r="3"
                        fill="white"
                        initial={{ opacity: 0 }}
                        animate={
                            isRevealed
                                ? {
                                      opacity: 1,
                                      scale: [0.5, 1.5, 1],
                                      y: [0, -5, 0],
                                  }
                                : { opacity: 0 }
                        }
                        transition={{
                            delay: 0.7,
                            duration: 0.4,
                            repeat: Infinity,
                            repeatType: 'loop',
                        }}
                    />
                </motion.svg>
            )}

            {/* Text revealed at the bottom */}
            {isRevealed && (
                <motion.div
                    className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {revealText} {/* Text passed as a prop */}
                </motion.div>
            )}

            {/* Optional overlay with hidden message before reveal */}
            {!isRevealed && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20 flex flex-col items-center justify-center">
                    <ul className="text-center text-white font-semibold">
                        <li>{'Hover Here'}</li>
                        <li>{'See An Invasive Fish'}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
