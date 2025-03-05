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

async function getSuggestions() {
    const searchTerm = document.getElementById("movieSearch").value.trim();
    if (!searchTerm) {
        document.getElementById("suggestionsDropdown").style.display = "none";
        return;
    }

    try {
        const response = await fetch(`/api/movie?title=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (data.Response === "True") {
            const suggestions = data.Search || [];
            const suggestionsDropdown = document.getElementById("suggestionsDropdown");
            suggestionsDropdown.innerHTML = '';

            suggestions.forEach(movie => {
                const div = document.createElement("div");
                div.textContent = movie.Title;
                div.onclick = () => {
                    document.getElementById("movieSearch").value = movie.Title;
                    document.getElementById("suggestionsDropdown").style.display = "none";
                    searchMovie(); // Trigger search for the selected movie
                };
                suggestionsDropdown.appendChild(div);
            });

            suggestionsDropdown.style.display = suggestions.length > 0 ? "block" : "none";
        } else {
            document.getElementById("suggestionsDropdown").style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}
