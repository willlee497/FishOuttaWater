import axios from 'axios';

export default async function handler(req, res) {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.SEARCH_ENGINE_ID,
                q: query,
                searchType: 'image',
                num: 1,
            },
        });

        console.log(response.data); // Log response data for debugging
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching image data:', error);
        res.status(500).json({ error: 'Error fetching image data' });
    }
}
