"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSchema = void 0;
// Basic zod validations
const zod_1 = __importDefault(require("zod"));
exports.jobSchema = zod_1.default.object({
    command: zod_1.default.enum(["start", "stop", "destroy"]),
});
