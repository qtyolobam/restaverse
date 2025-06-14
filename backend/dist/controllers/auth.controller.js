"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.googleAuth = void 0;
const database_1 = __importDefault(require("../clients/database"));
const google_1 = require("../clients/auth/google");
const token_1 = require("../utils/auth/token");
const auth_1 = require("../utils/validations/auth");
// Google authentication controller
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        const { success, data } = auth_1.authGoogleSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const { credential } = data;
        // Verifying token from Google
        const ticket = yield (0, google_1.verifyGoogle)(credential);
        const payload = ticket === null || ticket === void 0 ? void 0 : ticket.getPayload();
        if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
            res.status(400).json({ error: "Invalid token" });
            return;
        }
        // Upserting the user
        const user = yield database_1.default.user.upsert({
            where: { email: payload.email },
            update: {
                name: payload.name || "",
                image: payload.picture || "",
            },
            create: {
                email: payload.email,
                name: payload.name || "",
                image: payload.picture || "",
            },
        });
        // Generating tokens
        const accessToken = (0, token_1.generateAccessToken)(user.id);
        const refreshToken = (0, token_1.generateRefreshToken)(user.id);
        res
            .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "PROD",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        })
            .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "PROD",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })
            .json({ message: "Logged in" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
        return;
    }
});
exports.googleAuth = googleAuth;
// Refresh access token generator
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies["refresh_token"];
    if (!token) {
        res.status(401).json({ error: "No refresh token" });
        return;
    }
    try {
        const payload = (0, token_1.verifyRefreshToken)(token);
        const accessToken = (0, token_1.generateAccessToken)(payload.userId);
        res
            .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        })
            .json({ message: "Refreshed access token" });
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ error: "Invalid refresh token" });
        return;
    }
});
exports.refresh = refresh;
// Logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .json({ message: "Logged out" });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging out" });
        return;
    }
});
exports.logout = logout;
