import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path
from collections import OrderedDict
import time

load_dotenv()

class MovieProcessor:
    def __init__(self):
        self.api_key = os.getenv('TMDB_API_KEY')
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base = "https://image.tmdb.org/t/p/w500"
        self.seen_titles = set()
        
    def get_tmdb_poster(self, title, year, max_retries=3):
        """Search TMDB for movie poster with multiple retries"""
        for attempt in range(max_retries):
            try:
                # Try different search variations
                if attempt == 0:
                    search_title = title
                elif attempt == 1:
                    # Try without year
                    search_title = title.split('(')[0].strip()
                else:
                    # Try with simplified title
                    search_title = ' '.join(title.split()[:2])

                search_url = f"{self.base_url}/search/movie"
                params = {
                    'api_key': self.api_key,
                    'query': search_title,
                    'year': year if attempt == 0 else '',
                    'include_adult': False
                }
                
                response = requests.get(search_url, params=params)
                response.raise_for_status()
                results = response.json().get('results', [])
                
                if results and results[0].get('poster_path'):
                    return f"{self.image_base}{results[0]['poster_path']}"
                
                time.sleep(0.25)  # Avoid rate limiting
                
            except Exception as e:
                print(f"Error on attempt {attempt + 1} searching for {title}: {str(e)}")
                time.sleep(1)  # Wait longer after an error
                
        return None

    def get_manual_image(self, title):
        """Prompt for manual image input"""
        while True:
            print(f"\nNeed manual image for: {title}")
            print("Options:")
            print("1. Enter image URL")
            print("2. Skip this movie")
            print("3. Retry TMDB search")
            
            choice = input("Enter choice (1-3): ").strip()
            
            if choice == '1':
                url = input("Enter image URL: ").strip()
                if url:
                    return url
            elif choice == '2':
                return ""
            elif choice == '3':
                return None
            else:
                print("Invalid choice. Please try again.")

    def should_update_image(self, current_image):
        """Check if the image should be updated based on its URL"""
        if not current_image:
            return True
        
        # List of approved image domains
        approved_domains = ["image.tmdb.org"]
        
        # Check if the image URL is from an approved domain
        return not any(domain in current_image for domain in approved_domains)

    def process_movies(self, folder_path):
        all_movies = []
        updated_count = 0
        manual_count = 0
        
        for json_file in Path(folder_path).glob('*.json'):
            print(f"\nProcessing {json_file.name}...")
            with open(json_file, 'r') as f:
                try:
                    movies = json.load(f)
                    for movie in movies:
                        # Extract year from title
                        title_parts = movie['title'].split('(')
                        clean_title = title_parts[0].strip()
                        year = title_parts[1].split(')')[0] if len(title_parts) > 1 else ""
                        
                        # Check duplicates
                        unique_id = f"{clean_title.lower()}_{year}"
                        if unique_id in self.seen_titles:
                            continue
                        self.seen_titles.add(unique_id)
                        
                        # Update image if needed
                        if self.should_update_image(movie.get('image')):
                            while True:
                                new_image = self.get_tmdb_poster(clean_title, year)
                                if new_image:
                                    print(f"Updated image for: {clean_title}")
                                    movie['image'] = new_image
                                    updated_count += 1
                                    break
                                else:
                                    manual_image = self.get_manual_image(movie['title'])
                                    if manual_image is None:
                                        continue  # Retry TMDB search
                                    if manual_image:
                                        movie['image'] = manual_image
                                        manual_count += 1
                                    break
                            
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
        
        print(f"\nProcessing complete:")
        print(f"Total movies processed: {len(all_movies)}")
        print(f"Automatic updates: {updated_count}")
        print(f"Manual updates: {manual_count}")
        print(f"Output files created: {len(all_movies)//chunk_size + 1}")

if __name__ == "__main__":
    processor = MovieProcessor()
    folder_path = input("Enter path to folder containing JSON files: ")
    processor.process_movies(folder_path)