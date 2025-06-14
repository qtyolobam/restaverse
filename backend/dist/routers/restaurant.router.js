"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Local imports
const auth_middleware_1 = require("../middlewares/auth.middleware");
const restaurant_controller_1 = require("../controllers/restaurant.controller");
// Initializing the router
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.authMiddleware, restaurant_controller_1.createRestaurant);
exports.default = router;
