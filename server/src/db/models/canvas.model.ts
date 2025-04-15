import mongoose, { Schema } from "mongoose";

const CanvasSchema = new Schema({
    canvasElements: {
      type: [],
      default: null,
    },
    canvasName: {
      type: String,
      required: true
    },
    canvasCreatedBy: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Canvas =
  mongoose.models.Canvas || mongoose.model("Canvas", CanvasSchema);
