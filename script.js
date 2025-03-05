// Event listener for the input field
document.getElementById("movieSearch").addEventListener("input", function() {
    const searchTerm = document.getElementById("movieSearch").value.trim();
    if (searchTerm.length >= 3) {
        fetchSuggestions(searchTerm);
    } else {
        document.getElementById("movieSuggestions").innerHTML = ''; // Clear suggestions when the input is less than 3 characters
    }
});

// Function to fetch movie suggestions
async function fetchSuggestions(query) {
    const apiKey = 'YOUR_OMDB_API_KEY'; // Replace with your OMDB API key
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            const suggestions = data.Search;
            let suggestionHTML = '';
            suggestions.forEach(movie => {
                suggestionHTML += `<option value="${movie.Title}" data-imdbid="${movie.imdbID}">`;
            });
            document.getElementById("movieSuggestions").innerHTML = suggestionHTML;
        }
    } catch (error) {
        console.error("Error fetching movie suggestions:", error);
    }
}

// Function to search movie by title
async function searchMovie() {
    const searchTerm = document.getElementById("movieSearch").value.trim();
    if (!searchTerm) {
        alert("Please enter a movie title.");
        return;
    }

    try {
        const response = await fetch(`/api/movie?title=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (data.Response === "True") {
            document.getElementById("movieResult").innerHTML = `
                <div class="card movie-card mx-auto" style="max-width: 600px;">
                    <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/400'}" class="card-img-top" alt="${data.Title}">
                    <div class="card-body">
                        <h4 class="card-title">${data.Title} (${data.Year})</h4>
                        <p><strong>Genre:</strong> ${data.Genre}</p>
                        <p><strong>Director:</strong> ${data.Director}</p>
                        <p><strong>Plot:</strong> ${data.Plot}</p>
                        <p><strong>IMDB Rating:</strong> ⭐ ${data.imdbRating}</p>
                    </div>
                </div>
            `;
        } else {
            document.getElementById("movieResult").innerHTML = `<p class="text-danger">Movie not found. Try another search.</p>`;
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
        document.getElementById("movieResult").innerHTML = `<p class="text-danger">Failed to fetch movie details.</p>`;
    }
}
