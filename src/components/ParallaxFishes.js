'use client';
import { ParallaxScroll } from '../components/ui/parallax-scroll';

const images = [
    '/images/fish1.jpg',
    '/images/fish2.jpg',
    '/images/fish3.webp',
    '/images/fish4.webp',
    '/images/fish5.jpg',
    '/images/fish6.jpg',
    '/images/fish7.jpg',
    '/images/fish8.webp',
    '/images/fish9.webp',
];

export default function ParallaxFishes() {
    return <ParallaxScroll images={images} />;
}
