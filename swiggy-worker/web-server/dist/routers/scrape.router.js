"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scrape_controller_1 = require("../controllers/scrape.controller");
// Initing a router
const router = (0, express_1.Router)();
router.post("/", scrape_controller_1.scrape);
exports.default = router;
