'use client';
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';

// Remove the OpenAI import
// import { Configuration, OpenAIApi } from 'openai';

// Define loadMoreRecipes outside the component
const loadMoreRecipes = ({
    loading,
    setLoading,
    csvDataSetRef,
    setRecipes,
    currentIndexRef,
}) => {
    if (loading.current) return;
    if (!csvDataSetRef.current || csvDataSetRef.current.size === 0) {
        setLoading(false);
        return;
    }

    loading.current = true;
    setLoading(true);

    const csvDataArray = Array.from(csvDataSetRef.current);
    const nextIndex = currentIndexRef.current % csvDataArray.length;

    const newRecipes = [];
    for (let i = 0; i < 3; i++) {
        const recipeIndex = (nextIndex + i) % csvDataArray.length;
        newRecipes.push(csvDataArray[recipeIndex]);
    }

    setRecipes((prev) => {
        currentIndexRef.current += 3;
        return [...prev, ...newRecipes];
    });

    loading.current = false;
    setLoading(false);
};

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false); // Use a ref for loading
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState('');
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
    const observerRef = useRef(null);
    const csvDataSetRef = useRef(new Set());
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
                csvDataSetRef.current = names;

                // Initial load of recipes
                loadMoreRecipes({
                    loading: loadingRef,
                    setLoading,
                    csvDataSetRef,
                    setRecipes,
                    currentIndexRef,
                });
            },
            error: function (error) {
                console.error('Error parsing CSV:', error);
                setLoading(false);
            },
        });
    };

    const observerCallback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingRef.current) {
            loadMoreRecipes({
                loading: loadingRef,
                setLoading,
                csvDataSetRef,
                setRecipes,
                currentIndexRef,
            });
        }
    };

    useEffect(() => {
        fetchCsvData();

        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, []);

    const openModal = async (recipe) => {
        setSelectedRecipe(recipe);
        setRecipeDetails('');
        setIsLoadingRecipe(true);

        try {
            // Make a POST request to the API oute
            const response = await fetch('../api/generateRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipeName: recipe }),
            });

            if (!response.ok) {
                throw new Error(
                    `API request failed with status ${response.status}`
                );
            }

            const data = await response.json();
            const recipeText = data.recipe;
            setRecipeDetails(recipeText);
        } catch (error) {
            console.error('Error fetching recipe:', error);
            setRecipeDetails('Failed to load recipe details.');
        } finally {
            setIsLoadingRecipe(false);
        }
    };

    const closeModal = () => {
        setSelectedRecipe(null);
        setRecipeDetails('');
    };

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
                            <button
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => openModal(recipe)}
                            >
                                View Recipe
                            </button>
                        </div>
                    </div>
                ))}
                {/* Observer element */}
                <div ref={observerRef} className="h-10"></div>
            </div>

            {loading && (
                <div className="text-center text-blue-500 mt-4">
                    Loading more recipes...
                </div>
            )}

            {selectedRecipe && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-blue-800">
                            {selectedRecipe}
                        </h2>
                        {isLoadingRecipe ? (
                            <p>Loading recipe details...</p>
                        ) : (
                            <p className="mb-4 whitespace-pre-line">
                                {recipeDetails}
                            </p>
                        )}
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
