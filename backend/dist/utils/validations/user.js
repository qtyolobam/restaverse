"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userScrapeSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userScrapeSchema = zod_1.default.object({
    pincode: zod_1.default.string().min(6).max(6),
    limit: zod_1.default.number().min(1).max(100),
    cuisines: zod_1.default.array(zod_1.default.string()),
});
