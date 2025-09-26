/**
 * otp
 * otpFor
 * expired
 * isUsed
 * createdAt
 */

import mongoose, { Schema } from "mongoose";

const OtpSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    otpFor: {
        type: String,
        required: true
    },
    expiry: {
        type: Number,
        required: true
    },
    isUsed: {
        type: Boolean,
        required: true
    },
    isExpired: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

export const OTP = mongoose.models.OTP || mongoose.model("OTP", OtpSchema)