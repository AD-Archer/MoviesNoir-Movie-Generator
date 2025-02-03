# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-19

### Added
- New image scraping functionality with TMDB API integration
- Tons of new movies
- Python script to scrape images from TMDB

### Changed
- Change naming convention for movies

### Fixed
- Empty image URL handling
- Year extraction from movie titles

### DEV Dependencies(advanced, not needed for running)
- Python 3.6+
- requests
- python-dotenv
- pathlib

### Notes 
- Requires TMDB API key in .env file for scraping images
- Processes JSON files in chunks of 100 movies
- Maintains original movie data structure while updating images 