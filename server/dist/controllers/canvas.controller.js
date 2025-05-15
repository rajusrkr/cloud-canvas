"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCanvasName = exports.deleteCanvas = exports.fetchCanvasIdsAndName = exports.fetch = exports.create = void 0;
const canvas_model_1 = require("../db/models/canvas.model");
// create a new canvas
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.userId;
    try {
        const createNewCanvas = yield canvas_model_1.Canvas.create({
            canvasElements: [],
            canvasName: `untitled-${new Date().getTime()}`,
            canvasCreatedBy: user,
        });
        return res.status(200).json({
            success: true,
            message: "Canvas created",
            canvasId: createNewCanvas._id,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, please try again...",
        });
    }
});
exports.create = create;
// delete a canvas by id
const deleteCanvas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlParams = req.query;
    const canvasId = urlParams.canvasId;
    //@ts-ignore
    const user = req.userId;
    try {
        const deleteCanvas = yield canvas_model_1.Canvas.findOneAndDelete({ _id: canvasId }, { createdBy: user });
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
exports.deleteCanvas = deleteCanvas;
// edit canvas name
const editCanvasName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    //@ts-ignore
    const user = req.userId;
    try {
        const update = yield canvas_model_1.Canvas.findByIdAndUpdate({ _id: data.id, createdBy: user }, { canvasName: data.newName });
        if (typeof update !== "object") {
            return res.status(400).json({
                success: false,
                message: "Unable to update the name"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Name updated successfully."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});
exports.editCanvasName = editCanvasName;
// fetch a specific canvas by id
const fetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlParams = req.query;
    try {
        const getCanvasData = yield canvas_model_1.Canvas.findById(urlParams.canvasId).select("-canvasCreatedBy -createdAt");
        if (!getCanvasData) {
            return res.status({
                success: false,
                message: "Canvas not found with provied id",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Fetched",
            canvasElements: getCanvasData,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error, please try again.",
        });
    }
});
exports.fetch = fetch;
// fetch all canvas for a perticular user
const fetchCanvasIdsAndName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const user = req.userId;
    try {
        const getCanvases = yield canvas_model_1.Canvas.find({ canvasCreatedBy: user }).select("-createdAt -canvasCreatedBy -canvasElements");
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.fetchCanvasIdsAndName = fetchCanvasIdsAndName;
