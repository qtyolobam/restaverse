"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGoogleSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.authGoogleSchema = zod_1.default.object({
    credential: zod_1.default.string().min(1),
});
