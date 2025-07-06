import dotenv from "dotenv";
import express from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { db } from "./db";
import { Canvas } from "./db/models/canvas.model";
import cookiesParser from "cookie-parser";
import cors from "cors";
dotenv.config();

interface CustomSocket extends WebSocket {
  isAlive: boolean
}


const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: ["https://cloud-canvas.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookiesParser());
app.use(express.json());

// http server
const server = http.createServer(app);
// websocket server
const webSocket = new WebSocketServer({ server });

webSocket.on("connection", async (socket: WebSocket) => {
  console.log("new connection...");

  const ws = socket as CustomSocket;

  ws.on("pong", () => {
    console.log("pong received");
    
    ws.isAlive = true
  })


  const interval = setInterval(() => {
    webSocket.clients.forEach((socket) => {
      const ws = socket as CustomSocket;
      if (!ws.isAlive) {
        console.log("Terminating dead connection");
        return ws.terminate()
      }

      // mark the ping dead
      ws.isAlive =  false;

      socket.ping()
    })
  }, 30000)


  
  // on message
  ws.on("message", async (ms) => {
    try {
      const message = JSON.parse(ms.toString());
      await Canvas.findByIdAndUpdate(message.canvasId, {
        canvasElements: message.data,
      });
    } catch (error) {
      console.log(error);
    }
  });
  // on disconnection
  ws.on("close", () => {
    console.log("disconnected");
    clearInterval(interval)
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

setInterval(async () => {
  const sendReq = await fetch("https://cloud-canvas.onrender.com");
  console.log(`Server status: ${sendReq.status};`);
}, 12 * 60 * 1000);

import canvasRouter from "./routes/canvas.route";
app.use("/api/v1", canvasRouter);

import userRouter from "./routes/user.route";
import { log } from "console";
app.use("/api/v1", userRouter);
