// movie-suggestions.js in the 'api' folder
export default async function handler(req, res) {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: "Movie title is required" });
    }

    const apiKey = process.env.OMDB_API_KEY; // Ensure this is set in your environment
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            res.status(200).json(data); // Return search results with the movie titles
        } else {
            res.status(404).json({ error: "No movies found" });
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
        res.status(500).json({ error: "Failed to fetch movie suggestions" });
    }
}
