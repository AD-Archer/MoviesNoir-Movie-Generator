import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class TMDBService {
    constructor() {
        this.baseURL = 'https://api.themoviedb.org/3';
        this.apiKey = process.env.TMDB_API_KEY;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    async searchBlackMovies(page = 1) {
        try {
            const response = await axios.get(`${this.baseURL}/discover/movie`, {
                headers: this.headers,
                params: {
                    api_key: this.apiKey,
                    with_keywords: '158718,179431',
                    sort_by: 'popularity.desc',
                    page: page,
                    include_adult: false
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
                    with_keywords: '158718,179431',
                    sort_by: 'popularity.desc',
                    page: page
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