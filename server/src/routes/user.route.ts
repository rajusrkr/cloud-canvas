import { Router } from "express";
import { signin } from "../controllers/user.controller";

const router = Router()

router.post("/user/signin", signin)

export default router