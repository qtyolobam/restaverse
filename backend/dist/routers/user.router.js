"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Local imports
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Initializing the router
const router = (0, express_1.Router)();
router.post("/scrape", auth_middleware_1.authMiddleware, user_controller_1.requestScrape);
router.get("/me", auth_middleware_1.authMiddleware, user_controller_1.fetchUser);
router.get("/previous-scraped-data", auth_middleware_1.authMiddleware, user_controller_1.fetchPreviousScrapedData);
exports.default = router;
