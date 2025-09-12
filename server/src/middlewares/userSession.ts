import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export function userSession(req: Request, res: any, next: NextFunction) {
  const cookie = req.cookies.ccSession;
  console.log(cookie);


  if (!cookie || typeof cookie === "undefined") {
    res.status(401).json({ message: "No auth cookie available" })
    return;
  }

  try {
    const decode = jwt.verify(cookie.authToken, `${process.env.JWT_SECRET_SESSION}`);
    //@ts-ignore
    const user = decode.userId;
    //@ts-ignore
    req.userId = user;
    return next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error })
    return
  }
}
