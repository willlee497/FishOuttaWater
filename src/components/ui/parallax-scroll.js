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

    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, 0]);
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -150]);

    const third = Math.ceil(images.length / 3);
    const firstPart = images.slice(0, third);
    const secondPart = images.slice(third, 2 * third);
    const thirdPart = images.slice(2 * third);

    return (
        <div className={cn('relative w-full', className)} ref={gridRef}>
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
                                className="h-80 w-full object-cover rounded-lg shadow-xlg hover:shadow-2xl duration-300 transition-transform hover:scale-110"
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
                                className="h-80 w-full object-cover rounded-lg shadow-xlg hover:shadow-2xl duration-300 transition-transform hover:scale-110"
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
                                className="h-80 w-full object-cover rounded-lg shadow-xlg hover:shadow-2xl duration-300 transition-transform hover:scale-110"
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
