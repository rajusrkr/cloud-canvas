import dotenv from "dotenv";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { db } from "./db";
import { ws } from "./handle-ws";
import cookiesParser from "cookie-parser";
import cors from "cors";


dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
app.use(
  cors({
    origin: ["https://cloud-canvas.vercel.app","https://cloud-canvas-ybpm.onrender.com", "http://localhost:5173", "http://localhost:5174", "http://localhost"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookiesParser());
app.use(express.json());

// http server
export const server = http.createServer(app);
// websocket server
export const wss = new WebSocketServer({ server });

db()
  .then(() => {
    server.listen(8080,"0.0.0.0", () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
    ws()
  })
  .catch((error) => {
    console.log(error);
  });


app.get("/", (req, res) => {
  res.send({ message: `Srever is up and running on port ${PORT}` });
});

// setInterval(async () => {
//   const sendReqBe = await fetch("https://api-cloud-canvas.onrender.com");
//   const sendReqFe = await fetch("https://cloud-canvas-ybpm.onrender.com");
//   console.log(`Server status: ${sendReqBe.status};`);
//   console.log(`Server status: ${sendReqFe.status};`);
// }, 12 * 60 * 1000);

import canvasRouter from "./routes/canvas.route";
app.use("/api/v1", canvasRouter);

import userRouter from "./routes/user.route";
app.use("/api/v1", userRouter);
