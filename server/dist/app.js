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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const db_1 = require("./db");
const canvas_model_1 = require("./db/models/canvas.model");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["https://cloud-canvas.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// http server
const server = http_1.default.createServer(app);
// websocket server
const webSocket = new ws_1.WebSocketServer({ server });
webSocket.on("connection", (ws) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("new connection...");
    // on message
    ws.on("message", (ms) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = JSON.parse(ms.toString());
            yield canvas_model_1.Canvas.findByIdAndUpdate(message.canvasId, {
                canvasElements: message.data,
            });
        }
        catch (error) {
            console.log(error);
        }
    }));
    // on disconnection
    ws.on("close", () => {
        console.log("disconnected");
    });
    // on error
    ws.on("error", (error) => {
        console.log(error);
    });
    // send
    ws.send(JSON.stringify({
        type: "Connection_ack",
        message: "ws connection success",
    }));
}));
(0, db_1.db)()
    .then(() => {
    server.listen(PORT, () => {
        console.log(`Server is listening on port: ${PORT}`);
    });
})
    .catch((error) => {
    console.log(error);
});
app.get("/", (req, res) => {
    res.send({ message: `Srever is up and running on port ${PORT}` });
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const sendReq = yield fetch("https://cloud-canvas.onrender.com");
    console.log(`Server status: ${sendReq.status};`);
}), 12 * 60 * 1000);
const canvas_route_1 = __importDefault(require("./routes/canvas.route"));
app.use("/api/v1", canvas_route_1.default);
const user_route_1 = __importDefault(require("./routes/user.route"));
app.use("/api/v1", user_route_1.default);
