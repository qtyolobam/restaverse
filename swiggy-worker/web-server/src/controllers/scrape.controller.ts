// Some dependencies
import { Request, Response } from "express";
import path from "path";
import { spawn } from "child_process";
import prisma from "../database/index";

// Local imports
import { scrapeSchema } from "../utils/validations/scrapingRoutes";

export const scrape = async (req: Request, res: Response) => {
  try {
    const scrapeParams = req.body;
    // Input validation
    if (!scrapeSchema.safeParse(scrapeParams).success) {
      res.status(400).json({ message: "Invalid parameters" });
      return;
    }

    let { userId, pincode, limit, cuisines } = scrapeParams;
    console.log("Scrape Request Received", scrapeParams);

    // Create a scrape entry
    const scrapeRequest = await prisma.scrapeRequest.create({
      data: {
        userId: userId,
        status: "pending",
        pincode: pincode,
        limit: limit,
        cuisines: cuisines,
      },
    });

    cuisines = cuisines.join(",");

    const scriptPath = path.join(
      __dirname,
      "..",
      "jobs",
      "worker-script",
      "main.py"
    );

    // Calling the script in a child process
    const pythonProcess = spawn("python", [
      scriptPath,
      `--pincode=${pincode}`,
      `--headless`,
      `--limit=${limit}`,
      `--cuisine=${cuisines}`,
      `--reqId=${scrapeRequest.id}`,
    ]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
    });

    res.status(200).json({ message: "Scraping started" });
    return;
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
