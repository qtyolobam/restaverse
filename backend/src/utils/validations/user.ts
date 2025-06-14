import z from "zod";

export const userScrapeSchema = z.object({
  pincode: z.string().min(6).max(6),
  limit: z.number().min(1).max(100),
  cuisines: z.array(z.string()),
});
