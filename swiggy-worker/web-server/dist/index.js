"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
// Local imports
const scrape_router_1 = __importDefault(require("./routers/scrape.router"));
const job_controller_1 = require("./controllers/job.controller");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
// Routers
app.use("/scrape", scrape_router_1.default);
// Jobs
app.post("/jobs", job_controller_1.jobController);
// Running the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
