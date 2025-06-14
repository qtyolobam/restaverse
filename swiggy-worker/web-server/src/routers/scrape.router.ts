import { Router } from "express";
import { scrape } from "../controllers/scrape.controller";

// Initing a router
const router = Router();

router.post("/", scrape);

export default router;
