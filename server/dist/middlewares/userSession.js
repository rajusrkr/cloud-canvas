"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSession = userSession;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function userSession(req, res, next) {
    var _a;
    const authHeader = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : "";
    if (!authHeader) {
        return;
    }
    try {
        const decode = jsonwebtoken_1.default.verify(authHeader, `${process.env.JWT_SECRET_SESSION}`);
        //@ts-ignore
        const user = decode.userId;
        //@ts-ignore
        req.userId = user;
        return next();
    }
    catch (error) {
        console.log(error);
    }
}
