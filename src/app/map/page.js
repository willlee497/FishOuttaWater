import React from 'react';
import MapboxWithCSV from '../../components/MapboxWithFishes';

export default function Map() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                The Invasive Fish Tracker
            </h1>
            <div className="bg-blue-100 p-4 rounded-lg shadow-inner">
                <p className="text-center text-blue-800 mb-4">
                    Explore our bizarre aquatic sightings!
                </p>
                <div className="aspect-w-16 aspect-h-9 bg-blue-200 rounded-lg">
                    <div>
                        <MapboxWithCSV className="h-10 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}
