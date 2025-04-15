import dotenv from "dotenv";
import express from "express";
import http from "http";
import { WebSocket } from "ws";
import { db } from "./db";
import { Canvas } from "./db/models/canvas.model";
import cookiesParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://cloud-canvas.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookiesParser());
app.use(express.json());

const server = http.createServer(app);
const webSocket = new WebSocket.Server({ server });

webSocket.on("connection", async (ws) => {
  console.log("new connection...");
  // on message
  ws.on("message", async (ms) => {
    try {
      const message = JSON.parse(ms.toString());
      console.log(message.canvasId);

      const update = await Canvas.findByIdAndUpdate(message.canvasId, {
        canvasElements: message.data,
      });
      console.log(update);
    } catch (error) {
      console.log(error);
    }
  });
  // on disconnection
  ws.on("close", () => {
    console.log("disconnected");
  });
  // on error
  ws.on("error", (error) => {
    console.log(error);
  });
  // send
  ws.send(
    JSON.stringify({
      type: "Connection_ack",
      message: "ws connection success",
    })
  );
});

db()
  .then(() => {
    server.listen(5000, () => {
      console.log(`Server is listening on port: 5000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

import canvasRouter from "./routes/canvas.route";
app.use("/api/v1", canvasRouter);

import userRouter from "./routes/user.route";
app.use("/api/v1", userRouter);
