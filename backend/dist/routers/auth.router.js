"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Local imports
const auth_controller_1 = require("../controllers/auth.controller");
// Initializing the router
const router = (0, express_1.Router)();
router.post("/google", auth_controller_1.googleAuth);
router.post("/refresh-token", auth_controller_1.refresh);
router.post("/logout", auth_controller_1.logout);
exports.default = router;
