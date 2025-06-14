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
exports.createRestaurant = void 0;
const database_1 = __importDefault(require("../clients/database"));
const restaurant_1 = require("../utils/validations/restaurant");
const createRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        const { success, data } = restaurant_1.restaurantCreateSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ message: "Invalid input" });
            return;
        }
        // Creating the restaurant
        const restaurant = yield database_1.default.restaurant.create({
            data: Object.assign(Object.assign({}, data), { userId: req.user.id, menuItems: {
                    create: data.menuItems,
                } }),
        });
        const user = yield database_1.default.user.update({
            where: { id: req.user.id },
            data: {
                onboarded: true,
            },
        });
        // Returning the restaurant
        res.status(201).json({ message: "Restaurant created", restaurant });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating restaurant" });
        return;
    }
});
exports.createRestaurant = createRestaurant;
