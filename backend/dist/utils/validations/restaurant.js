"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantCreateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.restaurantCreateSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    pincode: zod_1.default.string().min(1),
    menuItems: zod_1.default.array(zod_1.default.object({
        name: zod_1.default.string().min(1),
        price: zod_1.default.string().min(1),
    })),
});
