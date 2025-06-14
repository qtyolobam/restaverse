"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Some dependencies
const database_1 = __importDefault(require("../database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_cron_1 = __importDefault(require("node-cron"));
const seederJob = () => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantsDir = path_1.default.join(__dirname, "worker-script", "restaurants");
    try {
        // Check if directory exists
        if (!fs_1.default.existsSync(restaurantsDir)) {
            throw new Error("Restaurants directory does not exist");
        }
        // Read directory contents
        const files = fs_1.default.readdirSync(restaurantsDir);
        // Check if directory is empty
        if (files.length === 0) {
            throw new Error("Restaurants directory is empty");
        }
        // Check for restaurants.json file
        let restaurantsJsonFile = files.find((file) => file.endsWith("restaurants.json"));
        if (!restaurantsJsonFile) {
            console.log();
            throw new Error("Restaurants.json file does not exist");
        }
        let restaurantsFile = fs_1.default.readFileSync(path_1.default.join(restaurantsDir, restaurantsJsonFile), "utf8");
        let restaurants = JSON.parse(restaurantsFile);
        let swiggyRestaurantIds = [];
        let existingRestaurantsIds = [];
        // Scrape Id
        let scrapeRequestId = "";
        for (const restaurant of restaurants) {
            restaurant.cuisines = restaurant.cuisines.split(",");
            const fileName = restaurantsJsonFile.split("_");
            restaurant.pincode = fileName[0];
            restaurant.scrapeRequestId = fileName[1];
            scrapeRequestId = restaurant.scrapeRequestId;
            const existingRestaurant = yield database_1.default.swiggyRestaurant.findFirst({
                where: {
                    name: restaurant.name,
                },
            });
            if (existingRestaurant) {
                console.log(`Restaurant ${restaurant.name} already exists in db, skipping...`);
                existingRestaurantsIds.push(existingRestaurant.id);
                swiggyRestaurantIds.push(existingRestaurant.id);
                continue;
            }
            const scrapeRequest = yield database_1.default.scrapeRequest.findFirst({
                where: {
                    id: restaurant.scrapeRequestId,
                },
            });
            if (!scrapeRequest) {
                console.log(`Scrape request ${restaurant.scrapeRequestId} not found, skipping...`);
                continue;
            }
            const swiggyRestaurant = yield database_1.default.swiggyRestaurant.create({
                data: {
                    name: restaurant.name || "",
                    url: restaurant.url || "",
                    rating: restaurant.rating || "",
                    deliveryTime: restaurant.delivery_time || "",
                    cuisines: restaurant.cuisines || [],
                    pincode: restaurant.pincode || "",
                    area: restaurant.area || "",
                    scrapeRequestId: scrapeRequest.id,
                },
            });
            swiggyRestaurantIds.push(swiggyRestaurant.id);
        }
        console.log(`Seeded ${restaurants.length} restaurants`);
        console.log(swiggyRestaurantIds);
        // Delete the file after seeding
        fs_1.default.unlinkSync(path_1.default.join(restaurantsDir, restaurantsJsonFile));
        let idx = 0;
        // Seeding menu items
        files.forEach((folder) => __awaiter(void 0, void 0, void 0, function* () {
            if (fs_1.default.existsSync(path_1.default.join(restaurantsDir, folder)) &&
                fs_1.default.lstatSync(path_1.default.join(restaurantsDir, folder)).isDirectory()) {
                if (existingRestaurantsIds.includes(swiggyRestaurantIds[idx])) {
                    console.log(`Restaurant ${swiggyRestaurantIds[idx]} already exists in db, skipping its menu...`);
                    idx++;
                    return;
                }
                const menuFile = fs_1.default.readFileSync(path_1.default.join(restaurantsDir, folder, "menu.json"), "utf8");
                const menuItems = JSON.parse(menuFile);
                console.log(menuItems.length);
                for (const menuItem of menuItems) {
                    yield database_1.default.swiggyMenuItem.create({
                        data: {
                            swiggyRestaurantId: swiggyRestaurantIds[idx],
                            imageUrl: menuItem.image_url || "",
                            rating: menuItem.rating || "",
                            name: menuItem.name || "",
                            price: menuItem.price || "0",
                            description: menuItem.description || "",
                        },
                    });
                }
                console.log(`Seeded ${menuItems.length} menu items`);
                fs_1.default.unlinkSync(path_1.default.join(restaurantsDir, folder, "menu.json"));
                fs_1.default.rmdirSync(path_1.default.join(restaurantsDir, folder));
                console.log(`Deleted ${folder} and its contents`);
                idx++;
            }
        }));
        // Update scrape request status to completed
        yield database_1.default.scrapeRequest.update({
            where: {
                id: scrapeRequestId,
            },
            data: { status: "completed" },
        });
    }
    catch (error) {
        console.log("Error in seeder job", error instanceof Error ? error.message : "Unknown error");
    }
});
let seederTask = null;
// Scheduling 5 min interval cron job
seederTask = node_cron_1.default.schedule("*/5 * * * *", () => {
    console.log("Seeder job started");
    seederJob();
});
exports.default = seederTask;
