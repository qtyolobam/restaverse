import z from "zod";
import { authGoogleSchema } from "../validations/auth";
export type AuthGoogleBody = z.infer<typeof authGoogleSchema>;
