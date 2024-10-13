'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CanvasRevealEffect({
    imagePath,
    revealText = 'Invasive Fish',
}) {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div
            className="relative w-64 h-64 overflow-hidden rounded-lg cursor-pointer bg-black/50 duration-300 transition-transform hover:scale-110"
            onClick={() => setIsRevealed(true)} // Changed from onMouseEnter to onClick
        >
            <motion.img
                src={imagePath}
                alt="Revealed Image"
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 3 }}
            />

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
                        fill="blue"
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

            {isRevealed && (
                <motion.div
                    className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="underline">{revealText}</p>
                    <p className="italic">{`Yes, actually a ${revealText}.`}</p>
                </motion.div>
            )}

            {!isRevealed && (
                <div className="absolute inset-0 bg-gradient-radial from-black via-black/50 to-transparent z-20 flex flex-col items-center justify-center">
                    <ul className="text-center text-white font-semibold">
                        <li>{'Click Here To See'}</li>
                        <li>{'See a Surprise Invasive Fish'}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
