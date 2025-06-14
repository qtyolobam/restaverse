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
exports.jobController = void 0;
const jobRoutes_1 = require("../utils/validations/jobRoutes");
const seederJob_1 = __importDefault(require("../jobs/seederJob"));
// A basic job controller for the seeder job
const jobController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = jobRoutes_1.jobSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: "Invalid command" });
        }
        const { command } = result.data;
        switch (command) {
            case "start":
                yield (seederJob_1.default === null || seederJob_1.default === void 0 ? void 0 : seederJob_1.default.start());
                break;
            case "stop":
                yield (seederJob_1.default === null || seederJob_1.default === void 0 ? void 0 : seederJob_1.default.stop());
                break;
            case "destroy":
                yield (seederJob_1.default === null || seederJob_1.default === void 0 ? void 0 : seederJob_1.default.destroy());
                break;
            default:
                res.status(400).json({ error: "Invalid command" });
        }
        res.status(200).json({ message: "Job modified" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.jobController = jobController;
