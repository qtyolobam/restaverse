import { Request, Response } from "express";
import { jobSchema } from "../utils/validations/jobRoutes";
import seederTask from "../jobs/seederJob";

// A basic job controller for the seeder job
export const jobController = async (req: Request, res: Response) => {
  try {
    const result = jobSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid command" });
    }
    const { command } = result.data!;

    switch (command) {
      case "start":
        await seederTask?.start();
        break;
      case "stop":
        await seederTask?.stop();
        break;
      case "destroy":
        await seederTask?.destroy();
        break;
      default:
        res.status(400).json({ error: "Invalid command" });
    }

    res.status(200).json({ message: "Job modified" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
