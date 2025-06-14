# Some dependencies
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import quote
import random

class SwiggyRestaurantScraper:
    def __init__(self, driver, delay=2):
        self.driver = driver
        self.delay = delay
        self.base_url = "https://www.swiggy.com"
        self.wait = WebDriverWait(driver, 15)
    
    def set_location(self, pincode):
        try:
            # Navigate to Swiggy homepage
            self.driver.get(self.base_url)
             # Random delay after page load
            time.sleep(random.uniform(1.5, 3.5)) 
            
            # Look for the location input field
            # Timeouts the ops for the elem to be loaded
            location_input = self.wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//input[@placeholder='Enter your delivery location']")))
            location_input.click()

            time.sleep(random.uniform(0.8, 2))  
            
            # Enter location search term
            search_term = f"{pincode}"
            location_input.clear()
            location_input.send_keys(search_term)

            time.sleep(random.uniform(2, 4))  

            # First wait for the search results container
            self.wait.until(EC.presence_of_element_located(
                (By.XPATH, "//div[text()='Search Result']")))
            
            # Waiting for the location options
            location_options = self.wait.until(EC.presence_of_all_elements_located(
                (By.XPATH, "//div[@role='button'][not(contains(text(), 'Use my current location'))]")))
            
            time.sleep(1)
            if location_options:
                # Click the first option
                print(location_options[1].text)
                location_options[1].click()
          
            time.sleep(self.delay * 2)  
            
            # Navigate to restaurants page
            self.driver.get(f"{self.base_url}/restaurants")
            time.sleep(self.delay)
            
            # Check if we've successfully navigated to restaurant list page
            return "restaurants" in self.driver.current_url
            
        except Exception as e:
            print(f"Error setting location: {e}")
            return False
    

    
    def get_restaurants(self, cuisine=None, max_restaurants=100, scroll_pause_time=2):
        # Global restaurant store
        restaurants = []
        try:
            # Wait for page to load and restaurant cards to appear
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "h2")))
            # Random delay after initial load
            time.sleep(random.uniform(1.5, 3))  
            
            # Apply cuisine filter
            if cuisine:
                # Convert single cuisine to list for consistent handling
                cuisines_to_apply = cuisine if isinstance(cuisine, list) else [cuisine]
                
                try:
                    # Find the filter widget
                    filter_widget = self.wait.until(EC.element_to_be_clickable(
                        (By.XPATH, "//div[@data-testid='filter_widget'] | //div[contains(text(), 'Filter')]")))
                    
                    # First, apply sort by delivery time (if needed)
                    sort_button = filter_widget.find_element(By.XPATH, ".//div[contains(text(), 'Sort By')]")
                    sort_button.click()
                    time.sleep(random.uniform(1.5, 3))  

                    delivery_time_option = self.wait.until(EC.element_to_be_clickable(
                        (By.XPATH, "//label[contains(text(), 'Delivery Time')]")))
                    delivery_time_option.click()
                    time.sleep(random.uniform(1.5, 2.5))  

                    # Click apply for sort
                    apply_button = self.wait.until(EC.element_to_be_clickable(
                        (By.XPATH, "//button[normalize-space()='Apply' or .//div[normalize-space()='Apply']]")))
                    apply_button.click()
                    time.sleep(random.uniform(2, 4))  


                    # Click filter button
                    filter_button = filter_widget.find_element(By.XPATH, ".//div[contains(text(), 'Filter')]")
                    filter_button.click()
                    time.sleep(random.uniform(1, 2.5))  

                    # Find cuisines section in the modal
                    cuisines_section = self.wait.until(EC.element_to_be_clickable(
                        (By.XPATH, "//span[contains(text(), 'Cuisines')] | //div[contains(text(), 'Cuisines')]")))
                    cuisines_section.click()
                    time.sleep(random.uniform(1.5, 3))  
                                               
                    # Now apply each cuisine filter
                    for cuisine_item in cuisines_to_apply:
                        try:
                            specific_cuisine = self.driver.find_element(By.XPATH, 
                                f"//label[contains(text(), '{cuisine_item}')]")
                            self.driver.execute_script("arguments[0].click();", specific_cuisine)
                            time.sleep(1)
                            print(f"Applied filter for cuisine: {cuisine_item} using JavaScript")
                        except Exception as js_error:
                            print(f"JavaScript click also failed: {js_error}")

                    # Click apply button
                    apply_button = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[normalize-space()='Apply' or .//div[normalize-space()='Apply']]")))
                    apply_button.click()
                    time.sleep(2)

                except Exception as e:
                    print(f"Error applying cuisine filters: {e}")
            
            else:
                raise ValueError("Cuisine is required")
            
            # Scroll down to load more restaurants until no new ones appear or we reach max_restaurants
            last_count = 0
            no_change_count = 0  # Track consecutive scrolls with no new restaurants
            
            while True:
                # Get current restaurant count - using the restaurant_list_card elements
                current_restaurants = self.driver.find_elements(By.XPATH, 
                    "//div[@data-testid='restaurant_list_card']")
                current_count = len(current_restaurants)
                
                # Print progress
                print(f"Found {current_count} restaurants so far")
                
                # Check if we've reached max restaurants or no new ones are loading
                if current_count >= max_restaurants or no_change_count >= 3:
                    print(f"Stopping after finding {current_count} restaurants")
                    break
                    
                # Check if count changed
                if current_count == last_count:
                    no_change_count += 1
                else:
                    no_change_count = 0
                    
                # Scroll to bottom of the specific div + 100px to trigger loading more
                self.driver.execute_script(
                    "document.querySelector('div[data-testid=\"restaurant_list\"]').scrollIntoView({ behavior: 'smooth', block: 'end' }); window.scrollBy(0, 100);")
                
                # Randomize scroll pause time
                time.sleep(random.uniform(1.5, 4))
                
                # Update last count
                last_count = current_count
            
            # Now parse all loaded restaurants
            page_source = self.driver.page_source
            # For static parsing
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Find all restaurant cards (parent div of all the restaurants)
            restaurant_cards = soup.select("div[data-testid='restaurant_list_card']")
            restaurant_cards = restaurant_cards[:max_restaurants]
            print(f"Parsing {len(restaurant_cards)} restaurant cards")
            
            for idx, card in enumerate(restaurant_cards):

                restaurant = {}
                
                # Get URL using the restaurant index
                # ts pmo
                # need to find something better than this
                restaurant_url = self.get_url_by_clicking(idx)
                if restaurant_url:
                    restaurant['url'] = restaurant_url
                    
                    # Extract ID from URL
                    id_match = re.search(r'-(\d+)(?:\?|$)', restaurant_url)
                    if id_match:
                        restaurant['id'] = id_match.group(1)
                
                # Extract offer first - it appears at the top of the card
                offer_text = card.find(string=lambda s: s and ('OFF' in s or 'AT' in s or 'UPTO' in s))
                if offer_text:
                    restaurant['offer'] = offer_text.strip()
                
                # Extract name - find the div that is a sibling of sw-restaurant-card-subtext-container but above it
                name_candidates = card.select_one("div.sw-restaurant-card-subtext-container").find_previous_sibling("div")
                if name_candidates:
                    restaurant['name'] = name_candidates.text.strip()
                
                
                # Extract rating - looking for text that contains a decimal number like 4.3
                rating_text = card.find(string=lambda s: s and re.search(r'\d+\.\d+\s*•', s))
                if rating_text:
                    rating_match = re.search(r'(\d+\.\d+)', rating_text)
                    if rating_match:
                        restaurant['rating'] = rating_match.group(1)
                
                # Extract delivery time - text containing "mins"
                time_text = card.find(string=lambda s: s and 'mins' in s)
                if time_text:
                    time_match = re.search(r'(\d+-\d+\s+mins)', time_text)
                    if time_match:
                        restaurant['delivery_time'] = time_match.group(1)
                
                # Extract cuisines from the first child of sw-restaurant-card-descriptions-container
                cuisine_div = card.select_one("div.sw-restaurant-card-descriptions-container > div:first-child")
                if cuisine_div and cuisine_div.text:
                    restaurant['cuisines'] = cuisine_div.text.strip()
                
                
                # Extract area from the second div in sw-restaurant-card-descriptions-container
                area_div = card.select_one("div.sw-restaurant-card-descriptions-container > div:nth-child(2)")
                if area_div and area_div.text:
                    restaurant['area'] = area_div.text.strip()
                
                # Extract image URL and URL-encode it
                img_tag = card.select_one("img")
                if img_tag and 'src' in img_tag.attrs:
                    raw_url = img_tag['src']
                    # URL encode the image URL, preserving URL structure
                    if '://' in raw_url:
                        # Split URL into parts and encode only the path portion
                        url_parts = raw_url.split('://', 1)
                        protocol = url_parts[0]
                        rest = url_parts[1]
                        if '/' in rest:
                            domain, path = rest.split('/', 1)
                            encoded_path = quote(path)
                            restaurant['image_url'] = f"{protocol}://{domain}/{encoded_path}"
                        else:
                            restaurant['image_url'] = raw_url  # No path to encode
                    else:
                        # If it's not a standard URL format, encode the whole thing
                        restaurant['image_url'] = quote(raw_url, safe=':/?=&')
                
                # Only add restaurant if we have at least a name
                if restaurant.get('name'):
                    restaurants.append(restaurant)

                time.sleep(random.randint(1, 3))

            return restaurants
            
        except Exception as e:
            print(f"Error scraping restaurants: {e}")
            return []
        
    def get_url_by_clicking(self, element_index):
        try:
            # Get the element from the list
            restaurant_cards = self.driver.find_elements(By.XPATH, "//div[@data-testid='restaurant_list_card']")
            if element_index >= len(restaurant_cards):
                return None
            
            element = restaurant_cards[element_index]
            
            # First try to find any anchor tag with href
            link = element.find_element(By.TAG_NAME, "a")
            href = link.get_attribute('href')
            
            # If we have a direct href, just use that
            if href and self.base_url in href:
                return href  
            
            # Click the element directly
            element.click()
 
            time.sleep(random.uniform(1.5, 3))
            
            # Get the current URL after clicking
            restaurant_url = self.driver.current_url
            
            # Go back to the restaurant list
            self.driver.back()
  
            time.sleep(random.uniform(1, 2.5))
            
            return restaurant_url
            
        except Exception as e:
            print(f"Error getting URL: {e}")
            # Try to go back if something went wrong
            try:
                self.driver.back()
            except:
                pass
            
            return None