import { Router } from "express";
import { otpVerify, signin, verify } from "../controllers/user.controller";
import { userSession } from "../middlewares/userSession";
import otpVerifyTokenSession from "../middlewares/otpVerifyToken";

const router = Router()

router.post("/user/signin", signin)
router.post("/user/verify", userSession, verify)
router.post("/user/otp-verify", otpVerifyTokenSession, otpVerify)

export default router