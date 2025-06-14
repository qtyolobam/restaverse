import json
import os

# Simple exporter for saving locally
class Exporter:
    def __init__(self, base_filename="", reqId=""):
        self.base_filename = base_filename
        self.reqId = reqId

    def export_as_json(self, data, flag="menu", restaurantName=None):
        if restaurantName is None and flag == "menu":
            raise ValueError("Restaurant name is required while saving menu")
        
        if flag == "menu":
            os.makedirs(f"{os.path.dirname(os.path.abspath(__file__))}/../restaurants/{self.base_filename}_{self.reqId}_{restaurantName}",exist_ok=True)
            filename = f"{os.path.dirname(os.path.abspath(__file__))}/../restaurants/{self.base_filename}_{self.reqId}_{restaurantName}/menu.json"

        elif flag == "restaurant":
            os.makedirs(f"{os.path.dirname(os.path.abspath(__file__))}/../restaurants", exist_ok=True)
            filename = f"{os.path.dirname(os.path.abspath(__file__))}/../restaurants/{self.base_filename}_{self.reqId}_restaurants.json"
        else:
            raise ValueError("Flag be either of these values: menu || restaurant")
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"Exported data to JSON file: {filename}")

