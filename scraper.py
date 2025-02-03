import os
import json
import requests
from dotenv import load_dotenv
from pathlib import Path
from collections import OrderedDict
import time

load_dotenv()

class MediaProcessor:
    def __init__(self):
        self.api_key = os.getenv('TMDB_API_KEY')
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base = "https://image.tmdb.org/t/p/w500"
        self.seen_titles = set()
        self.media_type = None  # Will be set to either 'movie' or 'tv'
        
    def get_tmdb_poster(self, title, year, max_retries=3):
        """Search TMDB for poster with multiple retries"""
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

                # Use appropriate search endpoint based on media type
                search_url = f"{self.base_url}/search/{self.media_type}"
                params = {
                    'api_key': self.api_key,
                    'query': search_title,
                    'first_air_date_year' if self.media_type == 'tv' else 'year': year if attempt == 0 else '',
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
            print("2. Skip this item")
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

    def extract_year(self, title):
        """Extract year from title based on media type"""
        title_parts = title.split('(')
        clean_title = title_parts[0].strip()
        
        if len(title_parts) > 1:
            year_part = title_parts[1].split(')')[0]
            if self.media_type == 'tv':
                # For TV shows, use first year of range (e.g., "2010-2015" becomes "2010")
                year = year_part.split('-')[0].strip()
            else:
                year = year_part.strip()
        else:
            year = ""
            
        return clean_title, year

    def process_media(self, folder_path):
        all_items = []
        updated_count = 0
        manual_count = 0
        
        # Get list of JSON files to process
        folder_path = Path(folder_path)
        if not folder_path.exists():
            print(f"\nError: Folder '{folder_path}' does not exist")
            return
        
        json_files = list(folder_path.glob('*.json'))
        if not json_files:
            print(f"\nNo JSON files found in {folder_path}")
            return
        
        print(f"\nFound {len(json_files)} JSON files to process")
        
        for json_file in json_files:
            print(f"\nProcessing {json_file.name}...")
            
            try:
                # Debug: Print file size and first few characters
                file_size = json_file.stat().st_size
                print(f"File size: {file_size} bytes")
                
                with open(json_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if not content.strip():
                        print(f"File is empty: {json_file.name}")
                        continue
                    
                    # Debug: Print first 100 characters
                    print(f"First 100 chars: {content[:100]}")
                    
                    try:
                        items = json.loads(content)
                        if not isinstance(items, list):
                            print(f"Error: {json_file.name} does not contain a JSON array")
                            continue
                        
                        print(f"Found {len(items)} items in {json_file.name}")
                        
                        for item in items:
                            if not isinstance(item, dict) or 'title' not in item:
                                print(f"Skipping invalid item in {json_file.name}")
                                continue
                            
                            # Extract year from title
                            clean_title, year = self.extract_year(item['title'])
                            
                            # Check duplicates
                            unique_id = f"{clean_title.lower()}_{year}"
                            if unique_id in self.seen_titles:
                                continue
                            self.seen_titles.add(unique_id)
                            
                            # Update image if needed
                            if self.should_update_image(item.get('image')):
                                while True:
                                    new_image = self.get_tmdb_poster(clean_title, year)
                                    if new_image:
                                        print(f"Updated image for: {clean_title}")
                                        item['image'] = new_image
                                        updated_count += 1
                                        break
                                    else:
                                        manual_image = self.get_manual_image(item['title'])
                                        if manual_image is None:
                                            continue  # Retry TMDB search
                                        if manual_image:
                                            item['image'] = manual_image
                                            manual_count += 1
                                        break
                            
                            all_items.append(item)
                    except json.JSONDecodeError as e:
                        print(f"JSON parsing error in {json_file.name}: {str(e)}")
                        print("Content causing error:")
                        print(content[:200] + "..." if len(content) > 200 else content)
                        continue
                    
            except Exception as e:
                print(f"Error reading {json_file.name}: {str(e)}")
                continue
        
        if not all_items:
            print("\nNo valid items found to process")
            return
        
        # Split into chunks of 100
        chunk_size = 100
        for i in range(0, len(all_items), chunk_size):
            chunk = all_items[i:i+chunk_size]
            output_file = folder_path / f"{self.media_type}_{i//chunk_size + 1}.json"
            try:
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(chunk, f, indent=2, ensure_ascii=False)
                print(f"Created {output_file}")
            except Exception as e:
                print(f"Error writing to {output_file}: {str(e)}")
        
        print(f"\nProcessing complete:")
        print(f"Total items processed: {len(all_items)}")
        print(f"Automatic updates: {updated_count}")
        print(f"Manual updates: {manual_count}")
        print(f"Output files created: {len(all_items)//chunk_size + 1}")

def get_media_type():
    """Prompt user to select media type"""
    while True:
        print("\nSelect media type to process:")
        print("1. Movies")
        print("2. TV Shows")
        choice = input("Enter choice (1-2): ").strip()
        
        if choice == '1':
            return 'movie'
        elif choice == '2':
            return 'tv'
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    processor = MediaProcessor()
    
    # Get media type from user
    processor.media_type = get_media_type()
    
    # Get appropriate folder path based on media type
    default_path = 'Json/movies' if processor.media_type == 'movie' else 'Json/tv'
    print(f"\nDefault path: {default_path}")
    folder_path = input(f"Enter path to folder containing JSON files (press Enter for default): ").strip()
    
    if not folder_path:
        folder_path = default_path
    
    processor.process_media(folder_path)