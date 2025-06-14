// Basic zod validations
import z from "zod";

export const scrapeSchema = z.object({
  userId: z.string(),
  pincode: z.string().min(6).max(6),
  limit: z.number().min(1).max(100),
  cuisines: z.array(z.string()),
});
