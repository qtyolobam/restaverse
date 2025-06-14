# Importing all the dependencies
import argparse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from scraper.restaurant_scraper import SwiggyRestaurantScraper
from scraper.menu_scraper import MenuScraper
from exporters.json_exporter import Exporter
import time
import random


# [Helper] CLI args parser setup
def parse_arguments():
    parser = argparse.ArgumentParser(description='Swiggy Data Scraper Script')
    
    # Location arguments
    parser.add_argument('--pincode', type=str, help="Enter the targets pincode ( e.g. 400097 )")
    # Dont have proxies to go through so keep it like 10, have scraped like 50 at a time, fine for a mvp
    parser.add_argument('--limit', type=int, default=50,
                        help='Limit number of restaurants to scrape')
    # TODO Seed db with options available at swiggy
    parser.add_argument('--cuisine', type=str,
                        help='Cuisine to scrape ( e.g. "American, Italian, Mexican" )')
    # Required Param
    parser.add_argument('--reqId', type=str,
                        help='Scrape request id')
    
    # Default ts
    parser.add_argument('--format', choices=['json'], 
                        default='json', help='Output format')
    parser.add_argument('--headless', action='store_true', 
                        help='Run browser in headless mode')
    parser.add_argument('--delay', type=float, default=2.0,
                        help='Delay between actions in seconds')
    
    return parser.parse_args()

# [Helper] Chrome driver setup
def setup_driver(headless=True):
    chrome_options = Options()
    if headless:
        chrome_options.add_argument("--headless")

    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-notifications")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    return driver

# [Helper] Json exporter [Future enchancements: use redis/kafka ong than this janky setup, this wont work parallelly let alone single threaded]
def get_exporter(args):
    output_base = f"{args.pincode}".strip()
    
    if args.format in ['json']:
        return Exporter(output_base, args.reqId)
    return Exporter(output_base, args.reqId)

def main():
    # args obj init
    args = parse_arguments()
    
    if not args.pincode:
        print("Error: --pincode argument is required.")
        return
    if not args.reqId:
        print("Error: --reqId argument is required.")
        return
    
    print("Setting up WebDriver...")
    driver = setup_driver(args.headless)
    
    try:
        # Initialize scrapers with the driver
        restaurant_scraper = SwiggyRestaurantScraper(driver, args.delay)
        menu_scraper = MenuScraper(driver, args.delay)

        # Get exporter
        exporter = get_exporter(args)
        
        print(f"Starting Swiggy scraper for pincode: {args.pincode}")
        
        # TODO: Needs update (there are city based urls no need for this interaction)
        # UPDATE: No need since this allows for much more precise location, through pincode
        success = restaurant_scraper.set_location(args.pincode)
        if not success:
            print("Failed to set location. Please check pincode.")
            return
        
        # Get restaurant data
        print("Scraping restaurants...")
        restaurants = restaurant_scraper.get_restaurants(args.cuisine.split(","),max_restaurants=args.limit,scroll_pause_time=args.delay)
        
        if not restaurants:
            print("No restaurants found!")
            return

        # Export restaurants
        exporter.export_as_json(data=restaurants,flag="restaurant")

        # Scrape menu for each restaurant
        for restaurant in restaurants:
            print(f"Scraping menu for {restaurant['name']}")
            menu = menu_scraper.get_menu(restaurant['url'])
            exporter.export_as_json(data=menu,restaurantName=f"{restaurant['name']}", flag="menu")  
            time.sleep(random.uniform(1.5, 3.5))  
       
    except Exception as e:
        print(f"An error occurred: {e}")
        driver.quit()
    finally:
        print("Closing browser...")
        driver.quit()


try:
    main()
    exit(1)
except Exception as e:
    print(f"An error occurred: {e}")
    exit(0)