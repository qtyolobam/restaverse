import z from "zod";
import { userScrapeSchema } from "../validations/user";
export type UserScrapeBody = z.infer<typeof userScrapeSchema>;
