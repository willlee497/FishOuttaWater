'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import axios from 'axios';
import dynamic from 'next/dynamic';

export default function InteractiveFishMap() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const currentMarkers = useRef(new Map());
    const [error, setError] = useState(null);
    const [L, setL] = useState(null);

    const handleSearch = async (searchTerm) => {
        try {
            const response = await fetch(
                `/api/fetchFishImage?searchTerm=${searchTerm}`
            );
            const data = await response.json();

            if (response.ok) {
                return data.imageUrl;
            } else {
                console.error(data.error || 'Failed to fetch the image.');
                return null;
            }
        } catch (err) {
            console.error('An error occurred while fetching the image:', err);
            return null;
        }
    };

    const fishImages = [
        '/images/fishy.png',
        '/images/fishy2.png',
        '/images/fishy3.png',
        '/images/fishy4.png',
        '/images/fishy5.png',
    ];

    const hashLatLngToIndex = (latitude, longitude) => {
        const hash = Math.abs(Math.sin(latitude) * Math.cos(longitude) * 10000);
        return Math.floor(hash) % fishImages.length;
    };

    const getFishIconForMarker = (latitude, longitude) => {
        if (!L) return null;
        const iconIndex = hashLatLngToIndex(latitude, longitude);
        return L.icon({
            iconUrl: fishImages[iconIndex],
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-18, -80],
        });
    };

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            return data.display_name || 'Address not found';
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Address not available';
        }
    };

    const fetchFishInfo = async (fishName) => {
        if (typeof window === 'undefined') return {};
        const imageUrl = await handleSearch(fishName);
        console.log(`Fetched image URL for ${fishName}:`, imageUrl);
        return {
            info: `${fishName} is a fascinating species known for its unique appearance.`,
            imageUrl: imageUrl || null,
        };
    };

    const fetchBaitRecommendation = async (fishName) => {
        try {
            console.log('Fetching bait recommendation for:', fishName);
            const response = await axios.post('/api/GenerateBait', { fishName });
            console.log('Bait recommendation response:', response.data);
            return response.data.bait;
        } catch (error) {
            console.error('Error fetching bait recommendation:', error);
            setError(`Failed to fetch bait recommendation: ${error.message}`);
            return 'Bait recommendation not available';
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('leaflet').then((leaflet) => {
                setL(leaflet.default);
            });
        }
    }, []);

    useEffect(() => {
        if (L && !map.current && mapContainer.current) {
            map.current = L.map(mapContainer.current).setView(
                [37.7749, -122.4194],
                10
            );

            L.tileLayer(
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                {
                    maxZoom: 17,
                    minZoom: 6,
                    attribution:
                        'Tiles &copy; Esri &mdash; Source: Esri, USGS, AEX, GeoEye, and the GIS User Community',
                }
            ).addTo(map.current);

            Papa.parse('/cleaned_file.csv', {
                download: true,
                header: true,
                complete: function (results) {
                    const data = results.data;
                    loadMarkersInView(data);
                    map.current.on('moveend', function () {
                        loadMarkersInView(data);
                    });
                },
            });
        }
    }, [L]);

    const loadMarkersInView = (data) => {
        if (!L || !map.current) return;

        const bounds = map.current.getBounds();

        data.forEach((location) => {
            const { name, latitude, longitude, quantity } = location;
            const latLngKey = `${latitude}-${longitude}`;

            if (
                latitude &&
                longitude &&
                bounds.contains([parseFloat(latitude), parseFloat(longitude)])
            ) {
                if (!currentMarkers.current.has(latLngKey)) {
                    const fishIcon = getFishIconForMarker(
                        parseFloat(latitude),
                        parseFloat(longitude)
                    );

                    const marker = L.marker([parseFloat(latitude), parseFloat(longitude)], {
                        icon: fishIcon,
                    }).addTo(map.current);

                    const popup = L.popup({ offset: 25 }).setContent(
                        `<div id="popup-${latLngKey}">
              <b>${quantity} ${name}</b><br>
              <div id="address-${latLngKey}">Loading address...</div>
              <div id="details-${latLngKey}">Loading details...</div>
              <div id="bait-${latLngKey}">Loading bait recommendation...</div>
              <div id="image-${latLngKey}">Loading image...</div>
            </div>`
                    );
                    marker.bindPopup(popup);

                    marker.on('click', async () => {
                        try {
                            marker.openPopup();

                            // Fetch and update address
                            fetchAddress(latitude, longitude).then(address => {
                                const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                                document.getElementById(`address-${latLngKey}`).innerHTML =
                                    `<b>Address:</b> <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">${address}</a>`;
                            });

                            // Fetch and update fish info
                            fetchFishInfo(name).then(fishInfo => {
                                document.getElementById(`details-${latLngKey}`).innerHTML =
                                    `<b>Details:</b> ${fishInfo.info}`;
                                if (fishInfo.imageUrl) {
                                    document.getElementById(`image-${latLngKey}`).innerHTML =
                                        `<img src="${fishInfo.imageUrl}" alt="${name}" style="max-width: 200px; max-height: 200px;" />`;
                                } else {
                                    document.getElementById(`image-${latLngKey}`).innerHTML =
                                        `<p>Error fetching picture.</p>`;
                                }
                            });

                            // Fetch and update bait recommendation
                            fetchBaitRecommendation(name).then(baitRecommendation => {
                                document.getElementById(`bait-${latLngKey}`).innerHTML =
                                    `<b>Recommended Bait:</b><br>${baitRecommendation}`;
                            });

                        } catch (error) {
                            console.error('Error loading marker details:', error);
                            setError(`Failed to load marker details: ${error.message}`);
                        }
                    });

                    currentMarkers.current.set(latLngKey, marker);
                }
            }
        });
    };

    return (
        <div>
            <div
                ref={mapContainer}
                style={{
                    width: '100%',
                    height: '500px',
                    border: '4px solid black',
                }}
            />
            {error && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    Error: {error}
                </div>
            )}
        </div>
    );
}