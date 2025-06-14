# Some dependencies
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import quote

# Module class for menu scraping
class MenuScraper:
    def __init__(self, driver, delay=2):
        self.driver = driver
        self.delay = delay
        self.wait = WebDriverWait(driver, 15)
    
    def get_menu(self, restaurant_url):
        # Global menu store
        menu_items_list = []
        
        try:
            # Navigate to restaurant page
            self.driver.get(restaurant_url)
            time.sleep(self.delay)
            
            # Wait for menu items to load using Selenium
            self.wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@id, 'cid-')]")))
            # Random delay for dropdown
            time.sleep(self.delay)  

            # Static parsing
            page_source = self.driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')

            # Find all menu categories 
            menu_categories = soup.select("div[id^='cid-']")


            for category in menu_categories:
                category_name = category['id'].replace('cid-', '')
                category_name = re.sub(r'_+', ' ', category_name)
                category_name = category_name.strip()
                
                # Find the category heading button
                buttons = category.select("button[data-role='category-heading']")

                # Voodoo block incoming
                # Will need constant update, probably main stream it to an ai 
                # or create a diff pipeline that keeps up with the update 
                # too much work tbh just reverse engineer the api atp, if ssr then the above thing
                # might be worth a shot
                if len(buttons) > 0:
                    for button in buttons:
                        menu_items_container = button.find_next_sibling("div")
                        if menu_items_container:
                            # Get all menu items within the container
                            # very specific stuff, tried to make it generic by searching with content
                            menu_items = list(menu_items_container.children)
                            
                            for item in menu_items:
                                item_dict = {}
                                p_tag = item.select_one("p")
                                details_div_parent = p_tag.find_next_sibling("div")
                                image_div_parent = details_div_parent.find_next_sibling("div")
                                image = image_div_parent.select_one("img")
                                if(image and 'src' in image.attrs):
                                    image_url = image['src']
                                    image_url = quote(image_url, safe=':/?=&')
                                else:
                                    image_url = None
                                item_dict['image_url'] = image_url
                                details_div = list(details_div_parent.children)
                                for idx, detail in enumerate(details_div):
                                    if idx == 1:
                                        name = detail.get_text(strip=True)
                                        item_dict['name'] = name
                                    elif idx == 2:
                                        price_spans = detail.select("span")
                                        if(len(price_spans) > 1):
                                            price = price_spans[1].get_text(strip=True)
                                        else:
                                            price = price_spans[0].get_text(strip=True)
                                        item_dict['price'] = price
                                    elif idx == 3:
                                        thirdDiv = detail.get_text(strip=True)
                                        if re.search(r'^\d+\.\d+\(\d+\)$', thirdDiv):
                                            rating = thirdDiv.strip() if thirdDiv.strip() else None
                                            item_dict['rating'] = rating
                                        else:
                                            description = thirdDiv.strip() if thirdDiv.strip() else None
                                            description = description.replace("\n", " ")
                                            if(description.endswith("more")):
                                                description = description[:-4]
                                            item_dict['description'] = description
                                    elif idx == 4:
                                        description = detail.get_text(strip=True) if detail.get_text(strip=True) else None
                                        description = description.replace("\n", " ")
                                        if(description.endswith("more")):
                                            description = description[:-4]
                                        item_dict['description'] = description
                                    item_dict['category'] = category_name
                                menu_items_list.append(item_dict)
                                
            return menu_items_list
            
        except Exception as e:
            print(f"Error scraping menu: {e}")
            return []
