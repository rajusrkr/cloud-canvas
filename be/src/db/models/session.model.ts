import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
    state: {
        type: String,
        enum: ["active", "inactive"]
    }
})

export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema)