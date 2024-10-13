import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

type FishData = {
  id: number;
  species: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  summary?: string;
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Function to get fish data from CSV
const getFishDataFromCSV = (): FishData[] => {
  const csvFilePath = path.join(process.cwd(), 'data', 'invasive_fish.csv');
  const fileContents = fs.readFileSync(csvFilePath, 'utf8');
  const rows = fileContents.trim().split('\n');

  return rows.slice(1).map((row) => {
    const values = row.split(',');
    return {
      id: Number(values[0]),
      species: values[1],
      latitude: Number(values[2]),
      longitude: Number(values[3]),
    };
  });
};

// Fetch Google Custom Search API for fish details
const fetchFishDetailsFromGoogle = async (species: string): Promise<{ imageUrl: string, summary: string }> => {
  const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(species)}&cx=${process.env.SEARCH_ENGINE_ID}&key=${process.env.GOOGLE_API_KEY}`;
  const res = await fetch(searchUrl);
  
  if (!res.ok) {
    throw new Error('Failed to fetch data from Google Custom Search API');
  }

  const data = await res.json() as {
    items: Array<{
      pagemap: {
        cse_image?: { src: string }[];
      };
      snippet: string;
    }>
  };

  return {
    imageUrl: data.items?.[0]?.pagemap?.cse_image?.[0]?.src || '',
    summary: data.items?.[0]?.snippet || 'No description available.',
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, lat, lng, radius } = req.query;
  const fishData = getFishDataFromCSV();

  if (id) {
    // Fetch specific fish by ID and return details from Google API
    const fish = fishData.find((fish) => fish.id === Number(id));
    if (!fish) {
      return res.status(404).json({ message: 'Fish not found' });
    }

    try {
      const details = await fetchFishDetailsFromGoogle(fish.species);
      return res.status(200).json({ ...fish, ...details });
    } catch (error) {
      console.error('Error fetching Google API data:', error);
      return res.status(500).json({ message: 'Error fetching fish details' });
    }
  } else if (lat && lng && radius) {
    // Fetch nearby fish based on user's location and radius
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const searchRadius = parseFloat(radius as string);

    const nearbyFish = fishData.filter((fish) => {
      const distance = calculateDistance(latitude, longitude, fish.latitude, fish.longitude);
      return distance <= searchRadius;
    });

    return res.status(200).json(nearbyFish);
  } else {
    return res.status(400).json({ message: 'Invalid request parameters' });
  }
}
