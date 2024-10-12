'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const BoxGrid = dynamic(() => import('../../components/BoxGrid'), {
    ssr: false, // Disable server-side rendering for the lazy loading
});

export default function Recipes() {
    const recipes = [
        { name: 'Twisted Tuna Tacos', emoji: '🌮' },
        { name: 'Peculiar Pufferfish Pie', emoji: '🥧' },
        { name: 'Bizarre Blobfish Burger', emoji: '🍔' },
        { name: 'Eccentric Eel Enchiladas', emoji: '🌯' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                Fucked Up Fishies Recipes
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="aspect-w-16 aspect-h-9 bg-blue-100 flex items-center justify-center">
                            <span className="text-6xl">{recipe.emoji}</span>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 text-blue-800">
                                {recipe.name}
                            </h2>
                            <p className="text-blue-600">
                                A delightfully strange dish that will tantalize
                                your taste buds and challenge your culinary
                                expectations.
                            </p>
                            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                View Recipe
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
