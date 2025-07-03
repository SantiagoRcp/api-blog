import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface  AutenticationRequest extends Request {
  user?: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

export function authMiddleware(req: AutenticationRequest, res: Response, next: NextFunction) {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ ok: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "qwsdfghjklsdfghjklqweasdfm"
    ) as { id: number; name: string; username: string; role: string };

    req.user = decoded;
    next();

  } catch {
    return res.status(500).json({ ok: false, message: "Invalid token" });
  }
}
