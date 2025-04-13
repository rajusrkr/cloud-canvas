import mongoose, { Schema } from "mongoose";

const CanvasSchema = new Schema({
    canvasElements: {
      type: [],
      default: null,
    },
  },
  { timestamps: true }
);

export const Canvas =
  mongoose.models.Canvas || mongoose.model("Canvas", CanvasSchema);
