// Basic zod validations
import z from "zod";

export const jobSchema = z.object({
  command: z.enum(["start", "stop", "destroy"]),
});
