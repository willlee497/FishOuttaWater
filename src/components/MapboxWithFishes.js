'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';

export default function LeafletMapWithPersistentMarkers() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const currentMarkers = useRef([]);

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

        currentMarkers.current.forEach((marker) => map.current.removeLayer(marker));
        currentMarkers.current = [];

        data.forEach((location) => {
            const { name, latitude, longitude, quantity } = location;

            if (
                latitude &&
                longitude &&
                bounds.contains([parseFloat(latitude), parseFloat(longitude)])
            ) {
                const fishIcon = getFishIconForMarker(parseFloat(latitude), parseFloat(longitude));

                const marker = L.marker([parseFloat(latitude), parseFloat(longitude)], {
                    icon: fishIcon,
                }).addTo(map.current);

                marker.bindPopup(`<b>${quantity} ${name}</b>`);
                
                currentMarkers.current.push(marker);
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
