import z from "zod";

// Local imports
import { authGoogleSchema } from "../validations/auth";

export type AuthGoogleBody = z.infer<typeof authGoogleSchema>;
