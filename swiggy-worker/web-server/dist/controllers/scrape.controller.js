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
exports.scrape = void 0;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const index_1 = __importDefault(require("../database/index"));
// Local imports
const scrapingRoutes_1 = require("../utils/validations/scrapingRoutes");
const scrape = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scrapeParams = req.body;
        if (!scrapingRoutes_1.scrapeSchema.safeParse(scrapeParams).success) {
            res.status(400).json({ message: "Invalid parameters" });
            return;
        }
        let { userId, pincode, limit, cuisines } = scrapeParams;
        console.log("Scrape Request Received", scrapeParams);
        const scrapeRequest = yield index_1.default.scrapeRequest.create({
            data: {
                userId: userId,
                status: "pending",
                pincode: pincode,
                limit: limit,
                cuisines: cuisines,
            },
        });
        cuisines = cuisines.join(",");
        // Call the script
        const scriptPath = path_1.default.join(__dirname, "..", "jobs", "worker-script", "main.py");
        const pythonProcess = (0, child_process_1.spawn)("python", [
            scriptPath,
            `--pincode=${pincode}`,
            `--headless`,
            `--limit=${limit}`,
            `--cuisine=${cuisines}`,
            `--reqId=${scrapeRequest.id}`,
        ]);
        pythonProcess.stdout.on("data", (data) => {
            console.log(data.toString());
        });
        pythonProcess.stderr.on("data", (data) => {
            console.error(data.toString());
        });
        pythonProcess.on("close", (code) => {
            console.log(`Python process exited with code ${code}`);
        });
        res.status(200).json({ message: "Scraping started" });
        return;
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.scrape = scrape;
