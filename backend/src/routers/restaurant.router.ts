import { Router } from "express";

// Local imports
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createRestaurant,
} from "../controllers/restaurant.controller";

// Initializing the router
const router = Router();

router.post("/create", authMiddleware, createRestaurant);

export default router;
