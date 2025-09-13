import { Router } from "express";
import { signin, verify } from "../controllers/user.controller";
import { userSession } from "../middlewares/userSession";

const router = Router()

router.post("/user/signin", signin)
router.post("/user/verify", userSession, verify)

export default router