import pkg from 'pg';
const { Pool } = pkg;
import Movie from '../models/Movie.js';
import TVShow from '../models/TVShow.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(dirname(__dirname), '../.env') });

// Simple API handler for the movie generator
class MovieGeneratorAPI {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL
        });
    }

    // Get a random movie
    async getRandomMovie() {
        try {
            const movie = await Movie.findOne({
                order: sequelize.random()
            });
            return movie;
        } catch (error) {
            console.error('Error fetching random movie:', error);
            throw error;
        }
    }

    // Get a random TV show
    async getRandomShow() {
        try {
            const show = await TVShow.findOne({
                order: sequelize.random()
            });
            return show;
        } catch (error) {
            console.error('Error fetching random show:', error);
            throw error;
        }
    }

    // Get media by genre
    async getMediaByGenre(genre) {
        try {
            const movies = await Movie.findAll({
                where: {
                    genres: {
                        [Op.contains]: [genre]
                    }
                }
            });
            return movies;
        } catch (error) {
            console.error('Error fetching media by genre:', error);
            throw error;
        }
    }

    // Get media by rating
    async getMediaByRating(rating) {
        try {
            const movies = await Movie.findAll({
                where: { rating }
            });
            return movies;
        } catch (error) {
            console.error('Error fetching media by rating:', error);
            throw error;
        }
    }
}

export default MovieGeneratorAPI; 