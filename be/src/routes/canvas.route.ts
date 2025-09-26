import { Router } from "express";
import { create, deleteCanvas, editCanvasName, fetch, fetchCanvasIdsAndName } from "../controllers/canvas.controller";
import { userSession } from "../middlewares/userSession";

const router = Router()

router.post("/canvas/create", userSession, create)
router.put("/canvas/fetch", userSession, fetch)
router.get("/canvas/get-all-canvas", userSession, fetchCanvasIdsAndName)
router.delete("/canvas/delete", userSession, deleteCanvas)
router.put("/canvas/edit-name", userSession, editCanvasName)

export default router