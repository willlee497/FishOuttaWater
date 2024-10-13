'use client';
import { ParallaxScroll } from '../components/ui/parallax-scroll';

const images = [
    '/images/image15.jpg',
    '/images/thelast.jpg',
    '/images/fishy22.jpg',
    '/images/fish6.jpg',
    '/images/fishy25.jpg',
    '/images/bluegil.jpg',
    '/images/fish21.jpg',
    '/images/fish8.webp',
    '/images/image155.jpg',
];

export default function ParallaxFishes() {
    return <ParallaxScroll images={images} />;
}
