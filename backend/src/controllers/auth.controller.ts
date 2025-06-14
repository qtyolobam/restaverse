import { Request, Response } from "express";

import prisma from "../clients/database";
import { verifyGoogle } from "../clients/auth/google";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth/token";
import { authGoogleSchema } from "../utils/validations/auth";

// Google authentication controller
export const googleAuth = async (req: Request, res: Response) => {
  try {
    // Input validation
    const { success, data } = authGoogleSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { credential } = data;

    // Verifying token from Google
    const ticket = await verifyGoogle(credential);
    const payload = ticket?.getPayload();
    if (!payload?.email) {
      res.status(400).json({ error: "Invalid token" });
      return;
    }

    // Upserting the user
    const user = await prisma.user.upsert({
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
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
    return;
  }
};

// Refresh access token generator
export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies["refresh_token"];
  if (!token) {
    res.status(401).json({ error: "No refresh token" });
    return;
  }

  try {
    const payload = verifyRefreshToken(token) as { userId: string };

    const accessToken = generateAccessToken(payload.userId);

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: "Refreshed access token" });
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Invalid refresh token" });
    return;
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ message: "Logged out" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging out" });
    return;
  }
};
