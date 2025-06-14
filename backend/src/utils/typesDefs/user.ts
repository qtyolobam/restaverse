import z from "zod";

// Local imports
import { userScrapeSchema } from "../validations/user";

export type UserScrapeBody = z.infer<typeof userScrapeSchema>;
