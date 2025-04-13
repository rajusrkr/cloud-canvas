import { Router } from "express";
import { create } from "../controllers/canvas.controller";

const router = Router()

router.post("/canvas/create", create)

export default router