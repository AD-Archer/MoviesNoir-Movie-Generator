let movies = [];
let shows = [];
let movieIndex = 0;
let showIndex = 0;
let shuffledMovies = [];
let shuffledShows = [];
let clickCount = 0; // Initialize clickCount

// Fetch JSON data
function loadData() {
    fetch('Json/movies.json')
        .then(response => response.json())
        .then(data => {
            movies = data;
            initMovieList();
        })
        .catch(error => console.error('Error loading movies:', error));

    fetch('Json/tv.json')
        .then(response => response.json())
        .then(data => {
            shows = data;
            initShowList();
        })
        .catch(error => console.error('Error loading shows:', error));
}

// Fisher-Yates shuffle to randomize arrays
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize shuffled movie list
function initMovieList() {
    shuffledMovies = shuffle(movies.slice());
}

// Initialize shuffled show list
function initShowList() {
    shuffledShows = shuffle(shows.slice());
}

// Get the next movie from the shuffled list
function getNextMovie() {
    if (movieIndex >= shuffledMovies.length) {
        movieIndex = 0; // Reset index and shuffle again
        shuffledMovies = shuffle(movies.slice());
    }
    return shuffledMovies[movieIndex++];
}

// Get the next show from the shuffled list
function getNextShow() {
    if (showIndex >= shuffledShows.length) {
        showIndex = 0; // Reset index and shuffle again
        shuffledShows = shuffle(shows.slice());
    }
    return shuffledShows[showIndex++];
}

// Display media function
function displayRandomMedia(type) {
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) {
        console.error('Content container not found.');
        return;
    }

    const content = contentContainer.querySelector('.content');
    if (content) {
        content.remove();
    }

   
    const newContent = document.createElement('div');
    newContent.className = 'content'; // Add class for easier removal

    if (type === 'movie') {
        const randomMovie = getNextMovie();
        newContent.innerHTML = `
            <h2>${randomMovie.title}</h2>
            <img src="${randomMovie.image}" alt="${randomMovie.title}" style="max-width: 40%;">
            <p>${randomMovie.description}</p>
        `;
    } else if (type === 'show') {
        const randomTVShow = getNextShow();
        newContent.innerHTML = `
            <h2>${randomTVShow.title}</h2>
            <img src="${randomTVShow.image}" alt="${randomTVShow.title}" style="max-width: 40%;">
            <p>${randomTVShow.description}</p>
        `;
    }
    contentContainer.appendChild(newContent);
}

// Call loadData to fetch the JSON data
loadData();
