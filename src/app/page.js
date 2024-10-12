'use client';
import Image from 'next/image';
import ParallaxFishes from '../components/ParallaxFishes';
import CanvasRevealEffect from '../components/RevealFish';

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-blue-100">
            <div className="wave-container">
                <div className="wave"></div>
            </div>
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-center text-blue-600">
                        Fish Outta Water
                    </h1>
                    <p className="text-lg text-center text-gray-800">
                        Welcome to the wild world of aquatic oddities!
                    </p>
                </div>
            </div>
            <ParallaxFishes className="mb-20" />
            <ul className="flex flex-row justify-center">
                <li className="m-5">
                    <CanvasRevealEffect
                        imagePath="/images/goldfish.jpg"
                        revealText="Goldfish"
                    />
                </li>
                <li className="m-5">
                    <CanvasRevealEffect
                        imagePath="/images/clownfish.jpg"
                        revealText="Clownfish"
                    />
                </li>
            </ul>
            {/* //     <style jsx>{`
        //         .wave-container {
        //             position: absolute;
        //             width: 100%;
        //             height: 100%;
        //             overflow: hidden;
        //         }
        //         .wave {
        //             position: absolute;
        //             bottom: 0;
        //             left: 0;
        //             width: 200%;
        //             height: 100%;
        //             background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%2387CEEB'/%3E%3C/svg%3E");
        //             background-size: 50% 100px;
        //             animation: wave 10s linear infinite;
        //             transform: translate3d(0, 0, 0);
        //         }
        //         @keyframes wave {
        //             0% {
        //                 transform: translateX(0);
        //             }
        //             50% {
        //                 transform: translateX(-25%);
        //             }
        //             100% {
        //                 transform: translateX(-50%);
        //             }
        //         }
        //     `}</style> */}
        </div>
    );
}
