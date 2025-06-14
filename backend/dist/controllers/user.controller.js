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
exports.fetchPreviousScrapedData = exports.fetchUser = exports.requestScrape = void 0;
const database_1 = __importDefault(require("../clients/database"));
const user_1 = require("../utils/validations/user");
const axios_1 = __importDefault(require("axios"));
const requestScrape = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        const { success, data } = user_1.userScrapeSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const { pincode, limit, cuisines } = data;
        // Fetching the restaurants
        // Checking if has been a previous scrape for this pincode
        const previousScrape = yield database_1.default.scrapeRequest.findFirst({
            where: {
                pincode,
            },
        });
        // If previous scrape exists, return it
        if (previousScrape) {
            // If both are true, return the previous scrape
            if (previousScrape.status === "completed") {
                const restaurants = yield database_1.default.swiggyRestaurant.findMany({
                    where: {
                        scrapeRequestId: previousScrape.id,
                    },
                    select: {
                        id: true,
                        url: true,
                        name: true,
                        rating: true,
                        deliveryTime: true,
                        cuisines: true,
                        pincode: true,
                        area: true,
                        swiggyMenuItems: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                description: true,
                                imageUrl: true,
                            },
                        },
                    },
                });
                res.status(200).json({ message: "Scrape already exists", restaurants });
                return;
            }
            else {
                // TODO : if the scrape had more than the current limit (ideally the scraper should only scrpae what it hasnt scraped before but that needs a external
                // source of truth, can try a hash based check where the restro name and area or some field can be hashed stored in redis and then checked by the scraper
                // for now, we will just send the scrape request with new limit
                res.status(200).json({ message: "Similar scrape request in progress" });
                return;
            }
        }
        else {
            // If no previous scrape exists, create a new one
            // Calling the scraper service
            yield axios_1.default.post(`${process.env.SCRAPER_SERVICE_URL}/scrape`, {
                userId: req.user.id,
                pincode,
                limit,
                cuisines,
            });
            // Returning the new scrape
            res.json({ message: "Scrape request sent" });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error requesting a scrape" });
        return;
    }
});
exports.requestScrape = requestScrape;
const fetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetching the user
        const user = yield database_1.default.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                onboarded: true,
                restaurants: {
                    select: {
                        id: true,
                        name: true,
                        pincode: true,
                        menuItems: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
        // If user not found, return 404
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Returning the user
        res.status(200).json({ message: "User fetched", user });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying user" });
        return;
    }
});
exports.fetchUser = fetchUser;
const fetchPreviousScrapedData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield database_1.default.user.findUnique({
            where: { id: req.user.id },
            select: {
                scrapeRequests: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (user.scrapeRequests.length === 0) {
            res.status(200).json({ error: "No scrape requests found", msgCode: 404 });
            return;
        }
        const lastScrapeRequest = user.scrapeRequests[user.scrapeRequests.length - 1];
        if (lastScrapeRequest.status !== "completed") {
            res.status(200).json({
                error: "Scrape request not completed yet",
                msgCode: 400,
            });
            return;
        }
        const restaurants = yield database_1.default.swiggyRestaurant.findMany({
            where: {
                scrapeRequestId: lastScrapeRequest.id,
            },
            select: {
                id: true,
                url: true,
                name: true,
                rating: true,
                deliveryTime: true,
                cuisines: true,
                pincode: true,
                area: true,
                swiggyMenuItems: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        rating: true,
                        description: true,
                        imageUrl: true,
                    },
                },
            },
        });
        res.status(200).json({
            message: "Previous scraped data fetched",
            restaurants,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching previous scraped data" });
        return;
    }
});
exports.fetchPreviousScrapedData = fetchPreviousScrapedData;
