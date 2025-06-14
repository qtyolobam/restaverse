"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const token_1 = require("../utils/auth/token");
// Middleware to check if the user is authenticated, router protector
const authMiddleware = (req, res, next) => {
    const token = req.cookies["access_token"];
    if (!token) {
        res.status(401).json({ error: "No access token" });
        return;
    }
    try {
        const payload = (0, token_1.verifyAccessToken)(token);
        req.user = { id: payload.userId };
        next();
        return;
    }
    catch (_a) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }
};
exports.authMiddleware = authMiddleware;
