'use client';
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef(null);
    const csvDataRef = useRef(new Set());
    const currentIndexRef = useRef(0);

    const fetchCsvData = () => {
        Papa.parse('/cleaned_file.csv', {
            download: true,
            header: true,
            complete: function (results) {
                const parsedData = results.data;
                const names = new Set(
                    parsedData.map((row) => row.name).filter((name) => name)
                );
                csvDataRef.current = names;
                loadMoreRecipes();
            },
            error: function (error) {
                console.error('Error parsing CSV:', error);
                setLoading(false);
            },
        });
    };

    const loadMoreRecipes = () => {
        if (loading || !hasMore) return;

        setLoading(true);

        const csvDataArray = Array.from(csvDataRef.current);
        const nextIndex = currentIndexRef.current;

        if (nextIndex < csvDataArray.length) {
            const newRecipe = csvDataArray[nextIndex];
            setRecipes((prev) => [...prev, newRecipe]);
            currentIndexRef.current += 1;
        }

        if (currentIndexRef.current >= csvDataArray.length) {
            setHasMore(false);
        }

        setLoading(false);
    };

    const observerCallback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
            loadMoreRecipes();
        }
    };

    useEffect(() => {
        fetchCsvData();

        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasMore, loading]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                Fish Outta Water Recipes
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="aspect-w-16 aspect-h-9 bg-blue-100 flex items-center justify-center">
                            <span className="text-6xl">🐟</span>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 text-blue-800">
                                {recipe}
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

            <div ref={observerRef} className="h-10"></div>

            {loading && (
                <div className="text-center text-blue-500 mt-4">
                    Loading more recipes...
                </div>
            )}

            {!hasMore && (
                <div className="text-center text-gray-500 mt-4">
                    No more recipes to load.
                </div>
            )}
        </div>
    );
}
