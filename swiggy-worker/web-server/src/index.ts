import express from "express";
import "dotenv/config";

// Local imports
import scrapeRouter from "./routers/scrape.router";
import { jobController } from "./controllers/job.controller";

const app = express();

// Middlewares
app.use(express.json());

// Routers
app.use("/scrape", scrapeRouter);

// Jobs
app.post("/jobs", jobController);

// Running the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
