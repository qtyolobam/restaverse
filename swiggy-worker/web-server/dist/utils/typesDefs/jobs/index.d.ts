import z from "zod";
import { jobSchema } from "../../validations/jobRoutes";
export type JobParams = z.infer<typeof jobSchema>;
