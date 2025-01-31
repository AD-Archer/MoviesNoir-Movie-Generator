let movies = [];
let shows = [];
let movieIndex = 0;
let showIndex = 0;
let shuffledMovies = [];
let shuffledShows = [];
let clickCount = 0; // Initialize clickCount

// Fetch JSON data
async function loadData() {
    try {
        // Fetch all movie lists with updated paths
        const [halloweenMovies, generalMovies] = await Promise.all([
            fetch('Json/movies/halloween_movies.json').then(response => response.json()),
            fetch('Json/movies/general_movies.json').then(response => response.json())
        ]);

        // Combine all movie lists into one
        movies = [...halloweenMovies, ...generalMovies];
        initMovieList();

        // Load TV shows with updated path
        const showsResponse = await fetch('Json/tv/general_tv.json');
        shows = await showsResponse.json();
        initShowList();
    } catch (error) {
        console.error('Error loading data:', error);
    }
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
    const title = document.querySelector('h1');
    
    if (!contentContainer) {
        console.error('Content container not found.');
        return;
    }

    if (title) {
        title.style.display = 'none';
    }

    const content = contentContainer.querySelector('.content');
    if (content) {
        content.remove();
    }

    const newContent = document.createElement('div');
    newContent.className = 'content';

    if (type === 'movie') {
        const randomMovie = getNextMovie();
        // Extract the base title by removing the IMDb rating
        const baseTitle = randomMovie.title.split(' - IMDb')[0];
        
        newContent.innerHTML = `
            <h2>${randomMovie.title}</h2>
            <img src="${randomMovie.image}" alt="${baseTitle}" style="max-width: 40%;" class="clickable-image">
            <p>${randomMovie.description}</p>
            <button class="view-button">View Where to Watch</button>
        `;
        
        // Add click handlers after creating the elements
        const image = newContent.querySelector('.clickable-image');
        const viewButton = newContent.querySelector('.view-button');
        const searchHandler = () => {
            const searchQuery = `where to watch ${baseTitle}`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        };
        
        image.addEventListener('click', searchHandler);
        viewButton.addEventListener('click', searchHandler);
    } else if (type === 'show') {
        const randomTVShow = getNextShow();
        // Extract the base title by removing the IMDb rating
        let baseTitle = randomTVShow.title.split(' - IMDb')[0];
        // Extract just the first year for TV shows (e.g., "Show Name (2014)" instead of "Show Name (2014-2020)")
        baseTitle = baseTitle.replace(/\(\d{4}[-–]\d{4}\)/, match => `(${match.slice(1,5)})`);
        
        newContent.innerHTML = `
            <h2>${randomTVShow.title}</h2>
            <img src="${randomTVShow.image}" alt="${baseTitle}" style="max-width: 40%;" class="clickable-image">
            <p>${randomTVShow.description}</p>
            <button class="view-button">View Where to Watch</button>
        `;
        
        // Add click handlers after creating the elements
        const image = newContent.querySelector('.clickable-image');
        const viewButton = newContent.querySelector('.view-button');
        const searchHandler = () => {
            const searchQuery = `where to watch ${baseTitle}`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        };
        
        image.addEventListener('click', searchHandler);
        viewButton.addEventListener('click', searchHandler);
    }
    contentContainer.appendChild(newContent);
}

// Call loadData to fetch the JSON data
loadData();