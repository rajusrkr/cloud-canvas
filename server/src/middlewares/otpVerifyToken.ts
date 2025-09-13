import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export default function otpVerifyTokenSession(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies.otpVerifyToken

    if (!cookie) {
        return res.status(401).json({ success: false, message: "Invalid cookie session." })
    }

    try {
        const decode = jwt.verify(cookie.otpVerifyToken, `${process.env.JWT_SECRET_SESSION}`);
        //@ts-ignore
        const userId = decode.userId;
        // @ts-ignore
        req.userId = userId
        return next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}