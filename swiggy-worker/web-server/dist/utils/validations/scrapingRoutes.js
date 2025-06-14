"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeSchema = void 0;
// Basic zod validations
const zod_1 = __importDefault(require("zod"));
exports.scrapeSchema = zod_1.default.object({
    userId: zod_1.default.string(),
    pincode: zod_1.default.string().min(6).max(6),
    limit: zod_1.default.number().min(1).max(100),
    cuisines: zod_1.default.array(zod_1.default.string()),
});
