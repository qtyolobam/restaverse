import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth/token";

// Middleware to check if the user is authenticated, router protector
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["access_token"];
  if (!token) {
    res.status(401).json({ error: "No access token" });
    return;
  }

  try {
    const payload = verifyAccessToken(token) as { userId: string };
    req.user = { id: payload.userId };
    next();
    return;
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};
