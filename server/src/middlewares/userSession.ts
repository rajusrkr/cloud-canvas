import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export function userSession(req: Request, res: any, next: NextFunction) {
  const cookie = req.cookies || req.headers["authorization"];

  if (!cookie || typeof cookie === "undefined") {
    res.status(401).json({ message: "No auth cookie available" })
    return;
  }

  try {
    const decode = jwt.verify(cookie.ccSession, `${process.env.JWT_SECRET_SESSION}`);
    //@ts-ignore
    const user = decode.user;
    //@ts-ignore
    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error })
    return
  }
}
