import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
}

declare global {
    namespace Express {
      export interface Request {
        userId: number;
      }
    }
}