import z from "zod";

export const authGoogleSchema = z.object({
  credential: z.string().min(1),
});
