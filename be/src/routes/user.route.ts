import { Router } from "express";
import { handleSession, otpVerify, signin } from "../controllers/user.controller";
import { userSession } from "../middlewares/userSession";
import otpVerifyTokenSession from "../middlewares/otpVerifyToken";

const router = Router()

router.post("/user/signin", signin)
router.post("/user/otp-verify", otpVerifyTokenSession, otpVerify)
router.delete("/user/handle-session", userSession, handleSession)

export default router