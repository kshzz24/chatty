import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to allow user object
export interface AuthRequest extends Request {
  user?: any;
}

export interface InviteRequest extends Request {
  id?: string[];
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  console.log(authHeader, "authHeader @@@@@@@@");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Add user to request safely
    (req as AuthRequest).user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
