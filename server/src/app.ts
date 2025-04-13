import mongoose from "mongoose";
import express from "express"
import http from "http"
import { WebSocket } from "ws";
const app = express()

const server = http.createServer(app)

const webSocket = new WebSocket.Server({server})

webSocket.on("connection", (ws) => {
    console.log("new connection...");
    // on message
    ws.on("message", (ms) => {
        try {
            const message = JSON.parse(ms.toString())
            console.log(message);
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


server.listen(5000, () => {
    console.log(`server is listening...., port 5000`);
})