'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';

export default function LeafletMapWithPersistentMarkers() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const currentMarkers = useRef(new Map());

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
        const iconIndex = hashLatLngToIndex(latitude, longitude);
        return L.icon({
            iconUrl: fishImages[iconIndex],
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });
    };

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            return data.display_name || "Address not found";
        } catch (error) {
            console.error('Error fetching address:', error);
            return "Address not available";
        }
    };

    const fetchFishInfo = async (fishName) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`${fishName} is a fascinating species known for its unique appearance.`);
            }, 1000);
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!map.current && mapContainer.current) {
                map.current = L.map(mapContainer.current).setView(
                    [37.7749, -122.4194],
                    10
                );

                L.tileLayer(
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    {
                        maxZoom: 17,
                        minZoom: 8,
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
        }
    }, []);

    const loadMarkersInView = (data) => {
        const bounds = map.current.getBounds();

        // Loop through the CSV data and add markers only if not already added
        data.forEach((location) => {
            const { name, latitude, longitude, quantity } = location;
            const latLngKey = `${latitude}-${longitude}`;

            if (
                latitude &&
                longitude &&
                bounds.contains([parseFloat(latitude), parseFloat(longitude)])
            ) {
                // Check if the marker is already added
                if (!currentMarkers.current.has(latLngKey)) {
                    const fishIcon = getFishIconForMarker(parseFloat(latitude), parseFloat(longitude));

                    const marker = L.marker([parseFloat(latitude), parseFloat(longitude)], {
                        icon: fishIcon,
                    }).addTo(map.current);

                    marker.bindPopup(`<b>Click for details...</b>`).openPopup();

                    marker.on('click', async () => {
                        marker.getPopup().setContent(`<b>Loading details...</b>`).openOn(map.current);

                        const address = await fetchAddress(latitude, longitude);
                        const fishInfo = await fetchFishInfo(name);

                        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

                        marker.getPopup().setContent(`
                            <b>${quantity} ${name}</b><br>
                            <b>Address:</b> <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">${address}</a><br>
                            <b>Details:</b> ${fishInfo}
                            <img src="/images/goldfish.jpg" alt="Fish" />
                        `).openOn(map.current);
                    });

                    // Store the marker in the map
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
        </div>
    );
}
