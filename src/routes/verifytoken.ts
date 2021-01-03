import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user: any;
    // success: (code: number, message: string, result: any) => Response
  }
}

export const verify = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET!);
    req.user = verified;
    //(req as any).user = verified;    //!!
    next();
  } catch (err) {
    res.status(400).send("Invalid Token"); 
  }
};
