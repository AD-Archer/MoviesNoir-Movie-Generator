# MoviesNoir Movie Generator (Development Version)

This is a development version of the MoviesNoir movie generator. It is not ready for production.

## About

This project connects a backend to the TMDB API and saves the results to a database. However, we are currently unable to properly sync the database with TMDB to find the best movies and TV shows.

## Backend Technology

The backend is built using Express and utilizes environment variables for configuration.

### Environment Variables

Ensure you have a `.env` file with the following variables:

```
DATABASE_URL='your-database-url'
TMDB_API_KEY='your-tmdb-api-key'
URL='http://localhost'
```

## Development Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/AD-Archer/MoviesNoir-Movie-Generator.git
   ```
2. Navigate to the project directory:
   ```sh
   cd moviesnoir-movie-generator
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up your `.env` file with the required credentials.
5. Start the development server:
   ```sh
   npm run dev
   ```

## Contributing

This is a work-in-progress project. Contributions are welcome to help improve the database synchronization with TMDB.

## License

MIT

