import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];

    if (!token) {
      res.status(404).json({
        message: "Please signin first"
      })
      return
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
      req.userId = decoded.userId
      next();
    } catch(e) {
      res.status(404).json({
        message: "Token was incorrect"
      })
      return
    }
}
 
declare global {
    namespace Express {
      export interface Request {
        userId: string;
      }
    }
}