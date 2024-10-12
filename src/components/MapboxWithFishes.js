'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';

export default function LeafletMapWithPersistentMarkers() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const loadedMarkers = useRef(new Map());

    const fishImages = [
        '/images/fishy.png',
        '/images/fishy2.png',
        '/images/fishy3.png',
        '/images/fishy4.png',
        '/images/fishy5.png',
    ];

    const getRandomFishIcon = () => {
        const randomImage =
            fishImages[Math.floor(Math.random() * fishImages.length)];
        return L.icon({
            iconUrl: randomImage,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
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
        data.forEach((location) => {
            const { name, latitude, longitude, quantity } = location;
            const latLngKey = `${latitude}-${longitude}`;
            if (
                latitude &&
                longitude &&
                bounds.contains([parseFloat(latitude), parseFloat(longitude)])
            ) {
                if (!loadedMarkers.current.has(latLngKey)) {
                    const randomFishIcon = getRandomFishIcon();
                    const marker = L.marker(
                        [parseFloat(latitude), parseFloat(longitude)],
                        {
                            icon: randomFishIcon,
                        }
                    ).addTo(map.current);
                    marker.bindPopup(`<b>${quantity} ${name}</b>`);
                    loadedMarkers.current.set(latLngKey, marker);
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
