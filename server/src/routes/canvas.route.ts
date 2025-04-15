import { Router } from "express";
import { create, fetch, fetchCanvasIdsAndName } from "../controllers/canvas.controller";
import { userSession } from "../middlewares/userSession";

const router = Router()

router.post("/canvas/create", userSession, create)
router.put("/canvas/fetch", fetch)
router.get("/canvas/get-all-canvas", userSession, fetchCanvasIdsAndName)

export default router