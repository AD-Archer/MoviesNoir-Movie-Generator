/**
 * This script updates the database with movies and TV shows from The Movie Database (TMDB).
 * It fetches movies and TV shows from TMDB and saves them to the database.
 * The script runs in a loop, fetching multiple pages of movies and TV shows.
 * It handles errors and logs the progress of the update.
 */

import TMDBService from '../services/tmdbService.js';
import DatabaseService from '../services/dbService.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(dirname(__dirname), '../.env') });

async function updateDatabase() {
    const tmdb = new TMDBService();
    const db = new DatabaseService();

    try {
        // Initialize database tables
        console.log('Initializing database tables...');
        await db.initializeTables();

        // Fetch and save movies (multiple pages)
        console.log('Fetching and saving movies...');
        for (let page = 1; page <= 5; page++) {
            console.log(`Fetching movies page ${page}...`);
            const movies = await tmdb.searchBlackMovies(page);
            console.log(`Found ${movies.length} movies on page ${page}`);
            
            for (const movie of movies) {
                try {
                    await db.saveMovie(movie);
                    console.log(`Saved movie: ${movie.title}`);
                } catch (error) {
                    console.error(`Error saving movie ${movie.title}:`, error.message);
                }
            }
        }

        // Fetch and save TV shows (multiple pages)
        console.log('Fetching and saving TV shows...');
        for (let page = 1; page <= 5; page++) {
            console.log(`Fetching TV shows page ${page}...`);
            const shows = await tmdb.searchBlackTVShows(page);
            console.log(`Found ${shows.length} TV shows on page ${page}`);
            
            for (const show of shows) {
                try {
                    await db.saveTVShow(show);
                    console.log(`Saved TV show: ${show.title}`);
                } catch (error) {
                    console.error(`Error saving TV show ${show.title}:`, error.message);
                }
            }
        }

        console.log('Database updated successfully!');
    } catch (error) {
        console.error('Error updating database:', error);
        process.exit(1);
    }
}

// Run the update
console.log('Starting database update...');
updateDatabase()
    .then(() => {
        console.log('Update completed successfully');
        process.exit(0);
    })
    .catch(error => {
        console.error('Update failed:', error);
        process.exit(1);
    }); 