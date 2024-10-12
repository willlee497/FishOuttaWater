'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type FishData = {
  id: number;
  species: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  summary?: string;
};

export default function InvasiveFishMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFish, setSelectedFish] = useState<FishData | null>(null);
  const [fishData, setFishData] = useState<FishData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    console.log("Mapbox Access Token:", mapboxgl.accessToken);  // Debug the token

    if (!mapboxgl.accessToken) {
      setError("Missing Mapbox Access Token");
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-95, 40],
        zoom: 3,
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      });

      map.current.addControl(geolocate);

      geolocate.on('geolocate', (e) => {
        const { latitude, longitude } = e.coords;
        console.log("User location:", latitude, longitude);
        setUserLocation({ lat: latitude, lng: longitude });
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: 10,
        });
        fetchNearbyFish(latitude, longitude);
      });
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      setError("Error initializing Mapbox");
    }
  }, []);

  const fetchNearbyFish = async (lat: number, lng: number) => {
    try {
      const radius = 50; 
      const res = await fetch(`/api?lat=${lat}&lng=${lng}&radius=${radius}`);
      if (!res.ok) {
        throw new Error("Failed to fetch nearby fish");
      }
      const data: FishData[] = await res.json();
      setFishData(data);
      addFishMarkers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch fish data');
    }
  };

  const addFishMarkers = (fishData: FishData[]) => {
    if (!map.current) return;

    fishData.forEach((fish) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'fish-marker';
      markerElement.style.backgroundImage = 'url(/fish-icon.png)';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.backgroundSize = '100%';

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([fish.longitude, fish.latitude])
        .addTo(map.current!)
        .getElement()
        .addEventListener('click', () => fetchFishDetails(fish.id));
    });
  };

  const fetchFishDetails = async (id: number) => {
    try {
      const res = await fetch(`/api/fish/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch fish details");
      }
      const data: FishData = await res.json();
      setSelectedFish(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch fish details');
    }
  };

  return (
    <div className="relative">
      <div ref={mapContainer} className="map-container" style={{ height: '600px' }} />
      {selectedFish && (
        <div className="absolute top-0 left-0 m-3 p-3 bg-white shadow-md rounded max-w-sm">
          <h3 className="font-bold text-xl mb-2">{selectedFish.species}</h3>
          {selectedFish.imageUrl && <img src={selectedFish.imageUrl} alt={selectedFish.species} className="w-full h-auto mb-2" />}
          <p className="mb-2">{selectedFish.summary}</p>
          <button onClick={() => setSelectedFish(null)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
        </div>
      )}
      {error && (
        <div className="absolute top-0 right-0 m-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
