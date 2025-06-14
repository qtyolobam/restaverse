import z from "zod";

// Scraping
import { scrapeSchema } from "../../validations/scrapingRoutes";

export type ScrapeParams = z.infer<typeof scrapeSchema>;
