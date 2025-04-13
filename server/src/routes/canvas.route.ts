import { Router } from "express";
import { create, fetch } from "../controllers/canvas.controller";

const router = Router()

router.post("/canvas/create", create)
router.put("/canvas/fetch", fetch)

export default router