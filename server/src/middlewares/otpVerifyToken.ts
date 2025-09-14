import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export default function otpVerifyTokenSession(req: Request, res: any, next: NextFunction) {
    const cookie = req.cookies;




    if (!cookie) {
        return res.status(401).json({ success: false, message: "Invalid session, try again." })
    }

    try {
        const decode = jwt.verify(cookie.otpVerifyToken, `${process.env.JWT_SECRET_SESSION}`);
        //@ts-ignore
        const userId = decode.userId;
        // @ts-ignore
        req.userId = userId;
        // @ts-ignore
        const otpId = decode.otpId;
        //@ts-ignore
        req.otpId = otpId;
        // @ts-ignore
        const user = decode.user;
        // @ts-ignore
        req.user = user
        return next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}