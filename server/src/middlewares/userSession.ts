import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export function userSession(req: Request, res: any, next: NextFunction) {
  const authHeader = req.headers["authorization"] ?? "";
  if (!authHeader) {
    return;
  }

  try {
    const decode = jwt.verify(authHeader, `${process.env.JWT_SECRET_SESSION}`);
    //@ts-ignore
    const user = decode.userId;
    //@ts-ignore
    req.userId = user;
    return next();
  } catch (error) {
    console.log(error);
  }
}
