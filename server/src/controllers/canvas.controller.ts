import { Request } from "express";
import { Canvas } from "../db/models/canvas.model";

const create = async (req: Request, res: any) => {
    
  try {
    const createNewCanvas = await Canvas.create({
        canvasElements: []
    });
    return res.status(200).json({
        success: true,
        message: "Canvas created",
        canvasId: createNewCanvas._id
    })
  } catch (error) {
    console.log(error);
  }
};

export { create };
