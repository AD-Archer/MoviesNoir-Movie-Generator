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
            158718,  // African American
            179431,  // Black People
            251585,  // Black Culture
            195194,  // Black History
            195195,  // Black Experience
            245830,  // Black Lives Matter
            256513,  // Black Excellence
            272469,  // Black Joy
            279259,  // Black Family
            272470   // Black Love
        ];

        // IDs for production companies known for Black content
        this.blackProductionCompanies = [
            3528,    // Tyler Perry Studios
            13240,   // 40 Acres & A Mule
            145458,  // SpringHill Entertainment
            103731,  // Khalabo Ink Society
            94795,   // Monkeypaw Productions
            7429,    // Will Packer Productions
            114152,  // Outlier Society
            4171     // Rainforest Films
        ];

        // Prominent Black actors and directors for person search
        this.prominentPersons = [
            18918,   // Will Smith
            134,     // Denzel Washington
            34847,   // Morgan Freeman
            5292,    // Spike Lee
            84433,   // Jordan Peele
            34489,   // Tyler Perry
            172069,  // Ryan Coogler
            1271624, // Ava DuVernay
            1178753  // Barry Jenkins
        ];
    }

    async searchBlackMovies(page = 1) {
        try {
            // Make multiple requests to get a diverse set of Black films
            const [keywordResults, companyResults, personResults] = await Promise.all([
                // Search by keywords
                this.searchMoviesByKeywords(page),
                // Search by production companies
                this.searchMoviesByCompanies(page),
                // Search by prominent persons
                this.searchMoviesByPersons(page)
            ]);

            // Combine and deduplicate results based on movie ID
            const combinedMovies = this.deduplicateResults([
                ...keywordResults,
                ...companyResults,
                ...personResults
            ]);

            return combinedMovies.map(movie => ({
                title: `${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'}) - IMDb: ${movie.vote_average}/10`,
                image: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : null,
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
            // Similar approach for TV shows
            const [keywordResults, companyResults] = await Promise.all([
                this.searchTVShowsByKeywords(page),
                this.searchTVShowsByCompanies(page)
            ]);

            const combinedShows = this.deduplicateResults([
                ...keywordResults,
                ...companyResults
            ]);

            return combinedShows.map(show => ({
                title: `${show.name} (${show.first_air_date?.split('-')[0] || 'N/A'}) - IMDb: ${show.vote_average}/10`,
                image: show.poster_path ? `https://image.tmdb.org/t/p/original${show.poster_path}` : null,
                description: show.overview,
                genres: show.genre_ids,
                rating: this.convertRating(show.adult)
            }));
        } catch (error) {
            console.error('Error fetching black TV shows:', error);
            throw error;
        }
    }

    async searchMoviesByKeywords(page) {
        const response = await axios.get(`${this.baseURL}/discover/movie`, {
            headers: this.headers,
            params: {
                api_key: this.apiKey,
                with_keywords: this.blackRepresentationKeywords.join('|'),
                sort_by: 'popularity.desc',
                page,
                include_adult: false,
                'vote_count.gte': 50,
                with_original_language: 'en',
                'vote_average.gte': 6.0
            }
        });
        return response.data.results;
    }

    async searchMoviesByCompanies(page) {
        const response = await axios.get(`${this.baseURL}/discover/movie`, {
            headers: this.headers,
            params: {
                api_key: this.apiKey,
                with_companies: this.blackProductionCompanies.join('|'),
                sort_by: 'popularity.desc',
                page,
                include_adult: false,
                'vote_count.gte': 50,
                with_original_language: 'en',
                'vote_average.gte': 6.0
            }
        });
        return response.data.results;
    }

    async searchMoviesByPersons(page) {
        const results = [];
        for (const personId of this.prominentPersons) {
            const response = await axios.get(`${this.baseURL}/person/${personId}/movie_credits`, {
                headers: this.headers,
                params: {
                    api_key: this.apiKey
                }
            });
            results.push(...response.data.cast.slice(0, 5));
        }
        return results;
    }

    async searchTVShowsByKeywords(page) {
        const response = await axios.get(`${this.baseURL}/discover/tv`, {
            headers: this.headers,
            params: {
                api_key: this.apiKey,
                with_keywords: this.blackRepresentationKeywords.join('|'),
                sort_by: 'popularity.desc',
                page,
                'vote_count.gte': 50,
                with_original_language: 'en',
                'vote_average.gte': 6.0
            }
        });
        return response.data.results;
    }

    async searchTVShowsByCompanies(page) {
        const response = await axios.get(`${this.baseURL}/discover/tv`, {
            headers: this.headers,
            params: {
                api_key: this.apiKey,
                with_companies: this.blackProductionCompanies.join('|'),
                sort_by: 'popularity.desc',
                page,
                'vote_count.gte': 50,
                with_original_language: 'en',
                'vote_average.gte': 6.0
            }
        });
        return response.data.results;
    }

    deduplicateResults(results) {
        const seen = new Set();
        return results.filter(item => {
            if (seen.has(item.id)) {
                return false;
            }
            seen.add(item.id);
            return true;
        });
    }

    convertRating(isAdult) {
        return isAdult ? 'R' : 'PG-13';
    }
}

export default TMDBService; 