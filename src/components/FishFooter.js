'use client';

import React from 'react';

const Fish = () => (
    <svg
        width="300"
        height="120"
        viewBox="0 0 300 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fish"
    >
        {/* Main body */}
        <path
            d="M20 60C20 60 80 20 150 20C220 20 280 60 280 60C280 60 220 100 150 100C80 100 20 60 20 60Z"
            fill="#FF6347"
            stroke="#FF4500"
            strokeWidth="8"
        />
        {/* Eye - on the right side, facing the direction of movement */}
        <circle cx="260" cy="60" r="8" fill="white" />
        <circle cx="262" cy="58" r="4" fill="black" />
        {/* Tail fin */}
        <path
            d="M10 30C30 45 30 75 10 90C40 75 40 45 10 30Z"
            fill="#FF6347"
            stroke="#FF4500"
            strokeWidth="4"
        />
        {/* Top fin */}
        <path
            d="M150 20C170 0 190 0 210 20"
            fill="none"
            stroke="#FF4500"
            strokeWidth="4"
        />
        {/* Bottom fin */}
        <path
            d="M150 100C170 120 190 120 210 100"
            fill="none"
            stroke="#FF4500"
            strokeWidth="4"
        />
    </svg>
);

export default function FishFooter() {
    return (
        <footer
            className="bg-sky-200 text-primary-foreground py-4 overflow-hidden relative"
            style={{ height: '150px' }}
        >
            <div className="fish-container">
                <Fish />
            </div>
            <div className="container mx-auto px-4 absolute bottom-4 left-0 right-0 z-10">
                <div className="text-center text-sky-800">
                    © {new Date().getFullYear()} Fish Outta Water LLC. All
                    rights reserved.
                </div>
            </div>
            <style jsx>{`
                @keyframes swim {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100vw);
                    }
                }
                .fish-container {
                    position: absolute;
                    left: 0;
                    top: 7.5%; /* Changed from 40% to 30% to raise the fish */
                    width: 300px;
                    height: 120px;
                    animation: swim 15s linear infinite;
                }
            `}</style>
        </footer>
    );
}
