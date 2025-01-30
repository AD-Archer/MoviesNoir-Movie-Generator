import TMDBService from '../services/tmdbService';
import DatabaseService from '../services/dbService';

async function updateDatabase() {
    const tmdb = new TMDBService();
    const db = new DatabaseService();

    try {
        // Initialize database tables
        await db.initializeTables();

        // Fetch and save movies
        for (let page = 1; page <= 5; page++) {
            const movies = await tmdb.searchBlackMovies(page);
            for (const movie of movies) {
                await db.saveMovie(movie);
            }
        }

        // Fetch and save TV shows
        for (let page = 1; page <= 5; page++) {
            const shows = await tmdb.searchBlackTVShows(page);
            for (const show of shows) {
                await db.saveTVShow(show);
            }
        }

        console.log('Database updated successfully!');
    } catch (error) {
        console.error('Error updating database:', error);
    }
}

updateDatabase(); 