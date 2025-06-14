import z from "zod";
import { scrapeSchema } from "../validations/scrapingRoutes";
export type ScrapeParams = z.infer<typeof scrapeSchema>;
