import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { title, query } = req.query;

    const apiKey = process.env.OMDB_API_KEY; // Ensure you have your OMDB API key stored in your environment variables
    if (title) {
        // Handle full search query for movie details
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                res.status(200).json(data);
            } else {
                res.status(404).json({ error: "Movie not found" });
            }
        } catch (error) {
            console.error("Error fetching movie data:", error);
            res.status(500).json({ error: "Failed to fetch movie details" });
        }
    } else if (query) {
        // Handle search suggestions
        const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                res.status(200).json(data);
            } else {
                res.status(404).json({ error: "No suggestions found" });
            }
        } catch (error) {
            console.error("Error fetching movie suggestions:", error);
            res.status(500).json({ error: "Failed to fetch suggestions" });
        }
    } else {
        res.status(400).json({ error: "Title or query is required" });
    }
}
