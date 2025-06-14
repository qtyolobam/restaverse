import z from "zod";

// Jobs
import { jobSchema } from "../../validations/jobRoutes";

export type JobParams = z.infer<typeof jobSchema>;
