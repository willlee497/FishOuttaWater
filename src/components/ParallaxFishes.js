'use client';
import { ParallaxScroll } from '../components/ui/parallax-scroll';

const images = [
    '/images/fish1.jpg',
    '/images/fish20.jpg',
    '/images/fish3.webp',
    '/images/fish21.jpg',
    '/images/fish5.jpg',
    '/images/fish17.jpg',
    '/images/fish18.jpg',
    '/images/fish8.webp',
    '/images/fish9.webp',
];

export default function ParallaxFishes() {
    return <ParallaxScroll images={images} />;
}
