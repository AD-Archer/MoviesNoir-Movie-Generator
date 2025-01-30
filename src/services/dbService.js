import sequelize from '../config/database.js';
import Movie from '../models/Movie.js';
import TVShow from '../models/TVShow.js';

class DatabaseService {
    async initializeTables() {
        try {
            await sequelize.sync({ force: true });
            console.log('Database synchronized successfully');
        } catch (error) {
            console.error('Error initializing tables:', error);
            throw error;
        }
    }

    async saveMovie(movie) {
        try {
            await Movie.upsert(movie);
        } catch (error) {
            console.error('Error saving movie:', error);
            throw error;
        }
    }

    async saveTVShow(show) {
        try {
            await TVShow.upsert(show);
        } catch (error) {
            console.error('Error saving TV show:', error);
            throw error;
        }
    }

    async getRandomMovie() {
        try {
            return await Movie.findOne({
                order: sequelize.random()
            });
        } catch (error) {
            console.error('Error getting random movie:', error);
            throw error;
        }
    }

    async getRandomTVShow() {
        try {
            return await TVShow.findOne({
                order: sequelize.random()
            });
        } catch (error) {
            console.error('Error getting random TV show:', error);
            throw error;
        }
    }
}

export default DatabaseService; 