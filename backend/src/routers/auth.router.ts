import { Router } from "express";

// Local imports
import {
  googleAuth,
  refresh,
  logout,
} from "../controllers/auth.controller";

// Initializing the router
const router = Router();

router.post("/google", googleAuth);
router.post("/refresh-token", refresh);
router.post("/logout", logout);

export default router;
