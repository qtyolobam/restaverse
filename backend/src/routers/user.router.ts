import { Router } from "express";

// Local imports
import {
  fetchPreviousScrapedData,
  fetchUser,
  requestScrape,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

// Initializing the router
const router = Router();

router.post("/scrape", authMiddleware, requestScrape);
router.get("/me", authMiddleware, fetchUser);
router.get("/previous-scraped-data", authMiddleware, fetchPreviousScrapedData);

export default router;
