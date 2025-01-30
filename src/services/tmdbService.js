import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(dirname(__dirname), '../.env') });

class TMDBService {
    constructor() {
        this.baseURL = 'https://api.themoviedb.org/3';
        this.apiKey = process.env.TMDB_API_KEY;
        this.headers = {
            'Content-Type': 'application/json'
        };
        // Keywords for Black representation
        this.blackRepresentationKeywords = [
            '158718',  // African American
            '179431',  // Black People
            '251585',  // Black Culture
            '195194',  // Black History
            '195195',  // Black Experience
            '245830'   // Black Lives Matter
        ];
        // IDs for production companies known for Black content
        this.blackProductionCompanies = [
            '3528',   // Tyler Perry Studios
            '13240',  // 40 Acres & A Mule
            '145458', // SpringHill Entertainment (LeBron James)
            '103731', // Khalabo Ink Society
            '94795'   // Monkeypaw Productions (Jordan Peele)
        ];
    }

    async searchBlackMovies(page = 1) {
        try {
            const response = await axios.get(`${this.baseURL}/discover/movie`, {
                headers: this.headers,
                params: {
                    api_key: this.apiKey,
                    with_keywords: this.blackRepresentationKeywords.join('|'),
                    with_companies: this.blackProductionCompanies.join('|'),
                    sort_by: 'popularity.desc',
                    page: page,
                    include_adult: false,
                    'vote_count.gte': 20, // Ensure some minimum votes for quality
                    with_original_language: 'en', // English language content
                    'vote_average.gte': 5.0 // Minimum rating threshold
                }
            });

            return response.data.results.map(movie => ({
                title: `${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - IMDb: ${movie.vote_average}/10`,
                image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                description: movie.overview,
                genres: movie.genre_ids,
                rating: this.convertRating(movie.adult),
                year: movie.release_date?.split('-')[0]
            }));
        } catch (error) {
            console.error('Error fetching black movies:', error);
            throw error;
        }
    }

    async searchBlackTVShows(page = 1) {
        try {
            const response = await axios.get(`${this.baseURL}/discover/tv`, {
                headers: this.headers,
                params: {
                    api_key: this.apiKey,
                    with_keywords: this.blackRepresentationKeywords.join('|'),
                    with_companies: this.blackProductionCompanies.join('|'),
                    sort_by: 'popularity.desc',
                    page: page,
                    'vote_count.gte': 20,
                    with_original_language: 'en',
                    'vote_average.gte': 5.0
                }
            });

            return response.data.results.map(show => ({
                title: `${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'}) - IMDb: ${show.vote_average}/10`,
                image: `https://image.tmdb.org/t/p/original${show.poster_path}`,
                description: show.overview,
                genres: show.genre_ids,
                rating: this.convertRating(show.adult)
            }));
        } catch (error) {
            console.error('Error fetching black TV shows:', error);
            throw error;
        }
    }

    convertRating(isAdult) {
        return isAdult ? 'R' : 'PG-13';
    }
}

export default TMDBService; 