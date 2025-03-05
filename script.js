// Fetch and display autocomplete suggestions
async function fetchMovieSuggestions(query) {
    const response = await fetch(`/api/movie-suggestions?title=${encodeURIComponent(query)}`);
    const data = await response.json();

    const suggestionsList = document.getElementById("movieSuggestions");
    suggestionsList.innerHTML = ""; // Clear previous suggestions

    if (data.Response === "True" && data.Search) {
        data.Search.forEach(movie => {
            const option = document.createElement("option");
            option.value = movie.Title; // Add movie title as an option
            suggestionsList.appendChild(option);
        });
    }
}

// Search for movie details
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

// Event listener to handle user input for autocomplete
document.getElementById("movieSearch").addEventListener("input", (e) => {
    const query = e.target.value;
    if (query.length >= 3) { // Fetch suggestions only if user types 3 or more characters
        fetchMovieSuggestions(query);
    }
});
