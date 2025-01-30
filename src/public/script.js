let movies = [];
let shows = [];
let movieIndex = 0;
let showIndex = 0;
let shuffledMovies = [];
let shuffledShows = [];
let clickCount = 0; // Initialize clickCount

// Add genre/rating filters
let currentFilters = {
    genre: 'all',
    rating: 'all'
};

function filterMedia(mediaList) {
    return mediaList.filter(item => {
        if (currentFilters.genre !== 'all' && !item.genres.includes(currentFilters.genre)) return false;
        if (currentFilters.rating !== 'all' && item.rating !== currentFilters.rating) return false;
        return true;
    });
}

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
    shuffledMovies = shuffle(filterMedia(movies).slice());
}

// Initialize shuffled show list
function initShowList() {
    shuffledShows = shuffle(shows.slice());
}

// Get the next movie from the shuffled list
function getNextMovie() {
    if (movieIndex >= shuffledMovies.length) {
        movieIndex = 0;
        shuffledMovies = shuffle(filterMedia(movies).slice());
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

function addToRecentlyViewed(media) {
    let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    recent = [media, ...recent.filter(m => m.title !== media.title)].slice(0, 5);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
}

// Initialize the API
const api = new MovieGeneratorAPI();

// Update the displayRandomMedia function
async function displayRandomMedia(type) {
    const contentContainer = document.querySelector('.content-container');
    contentContainer.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        const response = await fetch(`http://localhost:3000/api/random/${type}`);
        const media = await response.json();

        if (!media) {
            throw new Error('No media found');
        }

        addToRecentlyViewed(media);

        const newContent = document.createElement('div');
        newContent.className = 'content';
        newContent.innerHTML = `
            <h2>${media.title}</h2>
            <img src="${media.image}" 
                 alt="${media.title}" 
                 loading="lazy" 
                 onerror="this.src='path/to/fallback-image.jpg'">
            <p>${media.description}</p>
        `;
        
        contentContainer.innerHTML = '';
        contentContainer.appendChild(newContent);
    } catch (error) {
        contentContainer.innerHTML = '<div class="error">Unable to load content. Please try again.</div>';
        console.error('Error:', error);
    }
}

function addShareButton(media) {
    const shareData = {
        title: media.title,
        text: `Check out ${media.title} on MoviesNoir!`,
        url: window.location.href
    };

    const shareButton = document.createElement('button');
    shareButton.className = 'share-button';
    shareButton.innerHTML = 'Share';
    shareButton.onclick = async () => {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.warn('Share failed:', err);
        }
    };
    
    return shareButton;
}

// Call loadData to fetch the JSON data
loadData();
