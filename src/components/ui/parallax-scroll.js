'use client';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '../../lib/utils';

export const ParallaxScroll = ({ images, className }) => {
    const gridRef = useRef(null);

    // Track global scroll
    const { scrollYProgress } = useScroll();

    // Transformations for parallax scrolling
    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, 0]);
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -150]);

    // Divide images into thirds for column layout
    const third = Math.ceil(images.length / 3);
    const firstPart = images.slice(0, third);
    const secondPart = images.slice(third, 2 * third);
    const thirdPart = images.slice(2 * third);

    // Floating bubbles
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

    return (
        <div className={cn('relative w-full', className)} ref={gridRef}>
            {/* Bubbles */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-blue-300 rounded-full opacity-40"
                        style={{
                            width: `${Math.random() * 40 + 20}px`, // Random size between 20px and 60px
                            height: `${Math.random() * 40 + 20}px`, // Keep it circular
                            top: `${Math.random() * 100}%`, // Random vertical position
                            left: `${Math.random() * 100}%`, // Random horizontal position
                        }}
                        variants={bubbleVariants}
                        animate="float"
                    />
                ))}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 px-10 z-10 relative">
                {/* First Grid Column */}
                <div className="grid gap-10">
                    {firstPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateFirst }}
                            key={'grid-1' + idx}
                            className="relative z-20" // Ensure it’s above other elements
                        >
                            <Image
                                src={el}
                                className="h-80 w-full object-cover rounded-lg shadow-xlg hover:shadow-2xl duration-300"
                                height={400}
                                width={400}
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Second Grid Column */}
                <div className="grid gap-10">
                    {secondPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateSecond }}
                            key={'grid-2' + idx}
                            className="relative z-20"
                        >
                            <Image
                                src={el}
                                className="h-80 w-full object-cover rounded-lg shadow-xlg hover:shadow-2xl duration-300"
                                height={400}
                                width={400}
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Third Grid Column */}
                <div className="grid gap-10">
                    {thirdPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateThird }}
                            key={'grid-3' + idx}
                            className="relative z-20"
                        >
                            <Image
                                src={el}
                                className="h-80 w-full object-cover rounded-lg shadow-xlg hover:shadow-2xl duration-300"
                                height={400}
                                width={400}
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
