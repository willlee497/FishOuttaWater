'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy search
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search } from "lucide-react";

const loadMoreRecipes = ({
    loading,
    csvDataSetRef,
    setRecipes,
    currentIndexRef
}) => {
    if (loading.current) return;
    if (!csvDataSetRef.current || csvDataSetRef.current.size === 0) {
        console.log("No data in csvDataSetRef");
        return;
    }

    loading.current = true;

    const csvDataArray = Array.from(csvDataSetRef.current);
    const nextIndex = currentIndexRef.current % csvDataArray.length;

    const newRecipes = [];
    for (let i = 0; i < 3; i++) {
        const recipeIndex = (nextIndex + i) % csvDataArray.length;
        newRecipes.push(csvDataArray[recipeIndex]);
    }

    setRecipes((prev) => {
        currentIndexRef.current += 3;
        const uniqueRecipes = newRecipes.filter(
            (recipe) => !prev.includes(recipe)
        );
        return [...prev, ...uniqueRecipes];
    });

    loading.current = false;
};

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [suggestions, setSuggestions] = useState([]); // For dropdown suggestions
    const loadingRef = useRef(false);  // using ref for loading state
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipeDetails, setRecipeDetails] = useState('');
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
    const csvDataSetRef = useRef(new Set());
    const currentIndexRef = useRef(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Fuse.js options for fuzzy search
    const fuseOptions = {
        keys: ['name'], // We are searching based on recipe names
        includeScore: true,
        threshold: 0.3,  // The lower the value, the stricter the search
    };

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
                    csvDataSetRef,
                    setRecipes,
                    currentIndexRef,
                });
            },
            error: function (error) {
                console.error('Error parsing CSV:', error);
                setError('Failed to load recipes. Please try again later.');
            },
        });
    };

    useEffect(() => {
        fetchCsvData();
    }, []);

    useEffect(() => {
        const fuse = new Fuse([...csvDataSetRef.current], fuseOptions);

        if (searchTerm) {
            const results = fuse.search(searchTerm);
            const filtered = results.map(result => result.item);
            setFilteredRecipes(filtered);

            // Set suggestions for the dropdown
            const suggestionList = results.slice(0, 5).map(result => result.item);
            setSuggestions(suggestionList);
        } else {
            setFilteredRecipes(recipes);
            setSuggestions([]);  // Clear suggestions when search term is empty
        }
    }, [searchTerm, recipes]);

    const observerRef = useRef();
    const lastRecipeElementRef = useCallback(
        (node) => {
            if (loadingRef.current) return;

            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreRecipes({
                        loading: loadingRef,
                        csvDataSetRef,
                        setRecipes,
                        currentIndexRef,
                    });
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [loadingRef, csvDataSetRef, setRecipes, currentIndexRef]
    );

    const openModal = async (recipe) => {
        setSelectedRecipe(recipe);
        setRecipeDetails('');
        setIsLoadingRecipe(true);

        try {
            const response = await fetch('../api/generateRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipeName: recipe }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setRecipeDetails(data.recipe);
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

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const displayRecipes = searchTerm ? filteredRecipes : recipes;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                Fish Outta Water Recipes
            </h1>

            <div className="flex justify-end mb-4">
                <form onSubmit={handleSearch} className="w-full max-w-xs">
                    <div className="relative flex">
                        <Input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit" className="ml-2">
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <ul className="absolute left-0 top-full bg-white shadow-lg mt-1 max-h-48 w-full overflow-y-auto z-10">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-blue-200 cursor-pointer"
                                        onClick={() => setSearchTerm(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </form>
            </div>

            {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            {displayRecipes.length === 0 && !loadingRef.current && !error && (
                <div className="text-center text-gray-500 mt-4">No recipes found.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayRecipes.map((recipe, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                        ref={index === displayRecipes.length - 1 ? lastRecipeElementRef : null}
                    >
                        <div className="aspect-w-16 aspect-h-9 bg-blue-100 flex items-center justify-center">
                            <span className="text-6xl">🐟</span>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 text-blue-800">
                                {recipe}
                            </h2>
                            <p className="text-blue-600">
                                A delightfully strange dish that will
                                tantalize your taste buds and challenge
                                your culinary expectations.
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
            </div>

            {loadingRef.current && (
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


