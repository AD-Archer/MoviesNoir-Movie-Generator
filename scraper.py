import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path
from collections import OrderedDict

load_dotenv()

class MovieProcessor:
    def __init__(self):
        self.api_key = ''
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base = "https://image.tmdb.org/t/p/w500"
        self.seen_titles = set()
        
    def get_tmdb_poster(self, title, year):
        try:
            search_url = f"{self.base_url}/search/movie"
            params = {
                'api_key': self.api_key,
                'query': title,
                'year': year,
                'include_adult': False
            }
            response = requests.get(search_url, params=params)
            response.raise_for_status()
            results = response.json().get('results', [])
            
            if results:
                return f"{self.image_base}{results[0]['poster_path']}"
            return ""
        except Exception as e:
            print(f"Error searching for {title}: {str(e)}")
            return ""

    def process_movies(self, folder_path):
        all_movies = []
        
        for json_file in Path(folder_path).glob('*.json'):
            with open(json_file, 'r') as f:
                try:
                    movies = json.load(f)
                    for movie in movies:
                        # Extract year from title
                        title_parts = movie['title'].split('(')
                        clean_title = title_parts[0].strip()
                        year = title_parts[-1].split(')')[0] if '(' in movie['title'] else ""
                        
                        # Check duplicates
                        unique_id = f"{clean_title.lower()}_{year}"
                        if unique_id in self.seen_titles:
                            continue
                        self.seen_titles.add(unique_id)
                        
                        # Update image
                        if not movie.get('image'):
                            movie['image'] = self.get_tmdb_poster(clean_title, year)
                            
                        all_movies.append(movie)
                except Exception as e:
                    print(f"Error processing {json_file.name}: {str(e)}")
        
        # Split into chunks of 100
        chunk_size = 100
        for i in range(0, len(all_movies), chunk_size):
            chunk = all_movies[i:i+chunk_size]
            output_file = Path(folder_path) / f"movies_{i//chunk_size + 1}.json"
            with open(output_file, 'w') as f:
                json.dump(chunk, f, indent=2)
        
        print(f"Processed {len(all_movies)} movies into {len(all_movies)//chunk_size + 1} files")

if __name__ == "__main__":
    processor = MovieProcessor()
    folder_path = input("Enter path to folder containing JSON files: ")
    processor.process_movies(folder_path)