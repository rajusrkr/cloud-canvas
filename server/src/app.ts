import dotenv from "dotenv";
import express from "express"
import http from "http"
import { WebSocket } from "ws";
import { db } from "./db";
import cors from "cors"
dotenv.config()

const app = express()
app.use(cors({
    origin: "http://localhost:5173"
}))

const server = http.createServer(app)
const webSocket = new WebSocket.Server({server})

webSocket.on("connection", async (ws) => {
    console.log("new connection...");
    // on message
    ws.on("message", async (ms) => {
        try {
            const message = JSON.parse(ms.toString())
            console.log(message.canvasId);

            const update = await Canvas.findByIdAndUpdate(message.canvasId, {
                canvasElements: message.data
            })
            console.log(update);
            
        } catch (error) {
            console.log(error);
        }
    })
    // on disconnection
    ws.on("close", () => {
        console.log("disconnected");
    })
    // on error
    ws.on("error", (error) => {
        console.log(error);
    })
    // send
    ws.send(JSON.stringify({
        type: "Connection_ack",
        message: "ws connection success"
    }))
})

db()
  .then(() => {
    server.listen(5000, () => {
      console.log(`Server is listening on port: 5000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

import canvasRouter from "./routes/canvas.route"
import { Canvas } from "./db/models/canvas.model";
app.use("/api/v1", canvasRouter)


