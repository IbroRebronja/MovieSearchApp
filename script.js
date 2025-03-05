let timeoutId;

async function showSuggestions(query) {
    if (query.length < 3) {
        document.getElementById('suggestionsList').style.display = 'none';
        return;
    }

    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(async () => {
        const response = await fetch(`/api/movie/suggestions?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = '';

        if (data.Search && data.Search.length > 0) {
            data.Search.forEach(movie => {
                const li = document.createElement('li');
                li.textContent = movie.Title;
                li.onclick = () => {
                    document.getElementById('movieSearch').value = movie.Title;
                    searchMovie(movie.Title);
                    document.getElementById('suggestionsList').style.display = 'none';
                };
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    }, 300);
}

async function searchMovie(searchTerm = null) {
    const searchQuery = searchTerm || document.getElementById("movieSearch").value.trim();
    
    if (!searchQuery) {
        alert("Please enter a movie title.");
        return;
    }

    try {
        const response = await fetch(`/api/movie?title=${encodeURIComponent(searchQuery)}`);
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
