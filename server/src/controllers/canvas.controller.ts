import { Request } from "express";
import { Canvas } from "../db/models/canvas.model";

// create a new canvas
const create = async (req: Request, res: any) => {
  //@ts-ignore
  const user = req.userId;

  try {
    const createNewCanvas = await Canvas.create({
      canvasElements: [],
      canvasName: `untitled-${new Date().getTime()}`,
      canvasCreatedBy: user,
    });
    return res.status(200).json({
      success: true,
      message: "Canvas created",
      canvasId: createNewCanvas._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again...",
    });
  }
};
// delete a canvas by id
const deleteCanvas = async (req: Request, res: any) => {
  const urlParams = req.query;
  const canvasId = urlParams.canvasId;

  //@ts-ignore
  const user = req.userId;

  try {
    const deleteCanvas = await Canvas.findOneAndDelete(
      { _id: canvasId },
      { createdBy: user }
    );
    if (typeof deleteCanvas !== "object") {
      return res.status(400).json({
        success: false,
        message: "Failed to delete",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// edit canvas name
const editCanvasName = async (req: Request, res: any) => {
  const { data } = req.body;

  //@ts-ignore
  const user = req.userId;

  try {
    const update = await Canvas.findByIdAndUpdate(
      { _id: data.id, createdBy: user },
      { canvasName: data.newName }
    );
    if (typeof update !== "object") {
      return res.status(400).json({
        success: false,
        message: "Unable to update the name"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Name updated successfully."
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false, 
      message: "Internal server error."
    })
  }
};
// fetch a specific canvas by id
const fetch = async (req: Request, res: any) => {
  const urlParams = req.query;
  try {
    const getCanvasData = await Canvas.findById(urlParams.canvasId);
    if (!getCanvasData) {
      return res.status({
        success: false,
        message: "Canvas not found with provied id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Fetch",
      canvasElements: getCanvasData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error, please try again.",
    });
  }
};
// fetch all canvas for a perticular user
const fetchCanvasIdsAndName = async (req: Request, res: any) => {
  //@ts-ignore
  const user = req.userId;

  try {
    const getCanvases = await Canvas.find({ canvasCreatedBy: user }).select(
      "-createdAt -canvasCreatedBy"
    );

    if (getCanvases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No canvas/s found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Canvases fetched",
      canvases: getCanvases,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { create, fetch, fetchCanvasIdsAndName, deleteCanvas, editCanvasName };
