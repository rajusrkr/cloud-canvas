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

const fetch = async (req: Request, res:any) => {
    const urlParams = req.query
    console.log(urlParams.canvasId);


    try {
        const getCanvasData = await Canvas.findById(urlParams.canvasId)
        console.log(getCanvasData);
        return res.status(200).json({
            success: true,
            message: "Fetch",
            canvasElements: getCanvasData
        })
    } catch (error) {
        
    }


    
}

export { create, fetch };
