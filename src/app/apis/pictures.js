import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Get Fish Image Using Google Custom Search API
app.get('/api/fish-image', async (req, res) => {
    const fishName = req.query.name;
    const apiKey = "AIzaSyDTOUnopwXg38NdZ8d7FXlaWgy71_205DQ";
    const searchEngineId = "0211d8bafaaf1420b";
    const query = encodeURIComponent(fishName);
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${searchEngineId}&searchType=image&num=1&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            res.json({ imageUrl: data.items[0].link });
        } else {
            res.json({ imageUrl: "https://via.placeholder.com/200?text=No+Image+Found" });
        }
    } catch (error) {
        console.error("Error fetching image:", error);
        res.json({ imageUrl: "https://via.placeholder.com/200?text=Error+Fetching+Image" });
    }
});

// Get Fish Description Using Google Custom Search API
app.get('/api/fish-description', async (req, res) => {
    const fishName = req.query.name;
    const apiKey = "YOUR_GOOGLE_API_KEY";
    const searchEngineId = "YOUR_SEARCH_ENGINE_ID";
    const query = encodeURIComponent(fishName + ' description');
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${searchEngineId}&num=1&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            res.json({ description: data.items[0].snippet });
        } else {
            res.json({ description: "No description found." });
        }
    } catch (error) {
        console.error("Error fetching description:", error);
        res.json({ description: "Error fetching description." });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});