import { Request } from "express";
import { Canvas } from "../db/models/canvas.model";
import { Session } from "../db/models/session.model";
import { handleSession } from "../lib/handlSession";

// create a new canvas
const create = async (req: Request, res: any) => {
  const data = req.body;
  const canvasName = data.canvasTitle.toLowerCase();
  // Get user id and session id
  // @ts-ignore
  const user = req.user;
  // @ts-ignore
  const sessionId = req.sessionId

  try {
    if (!handleSession({ sessionId })) {
      console.log("Invalid session");
      return res.status(401).json({ success: false, message: "JsonWebTokenError" })
    }

    const createNewCanvas = await Canvas.create({
      canvasElements: [],
      canvasName,
      canvasCreatedBy: user,
    });
    return res.status(200).json({
      success: true,
      message: "Canvas created successfully",
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
  // @ts-ignore
  const sessionId = req.userId;

  try {
    if (!handleSession({ sessionId })) {
      console.log("Invalid session");
      return res.status(401).json({ success: false, message: "JsonWebTokenError" })
    }

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
// edit canvas title
const editCanvasName = async (req: Request, res: any) => {
  const { data } = req.body;

  //@ts-ignore
  const user = req.userId;
  // @ts-ignore
  const sessionId = req.userId;
  try {

    if (!handleSession({ sessionId })) {
      console.log("Invalid session");
      return res.status(401).json({ success: false, message: "JsonWebTokenError" })
    }

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
  // @ts-ignore
  const user = req.user;
  // @ts-ignore
  const sessionId = req.sessionId

  try {
    if (!handleSession({ sessionId })) {
      console.log("Invalid session");
      return res.status(401).json({ success: false, message: "JsonWebTokenError" })
    }
    const getCanvas = await Canvas.findOne({ _id: urlParams.canvasId, canvasCreatedBy: user }).select("-canvasCreatedBy -createdAt")

    if (!getCanvas) {
      return res.status(401).json({
        success: false,
        message: "Invalid canvas id or invalid session, try by login again",
      })
    }
    return res.status(200).json({
      success: true,
      message: "Fetched",
      canvasElements: getCanvas,
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
  const user = req.user;
  // @ts-ignore
  const sessionId = req.userId;
  try {

    if (!handleSession({ sessionId })) {
      console.log("Invalid session");
      return res.status(401).json({ success: false, message: "JsonWebTokenError" })
    }

    const getCanvases = await Canvas.find({ canvasCreatedBy: user }).select(
      "-createdAt -canvasCreatedBy -canvasElements"
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
