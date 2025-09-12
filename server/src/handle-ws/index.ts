import { WebSocket } from "ws"
import { wss } from "../app"
import { v4 as uuidV4 } from "uuid"
import { Canvas } from "../db/models/canvas.model"

interface ExtendedWebsocket extends WebSocket {
    isAlive: boolean,
    clientId: string
}

const connections = new Map<ExtendedWebsocket, string>()
const time = new Date().toTimeString()


function ws() {
    // Heart beat interval
    setInterval(() => {
        wss.clients.forEach((clnt) => {
            const client = clnt as ExtendedWebsocket;

            // If not responding disconnect the user
            if (!client.isAlive) {
                console.log(`Closing connection for ${client.clientId}, Time: ${time}`);
                connections.delete(client)
                console.log(`Connection closed for ${client.clientId}, pong not received, Time: ${time}`);
                console.log(`${connections.size}, Time: ${time}`);
                return client.terminate();
            }

            client.isAlive = false;
            clnt.ping()
        })
    }, 15000)
    // On connection open
    wss.on("connection", (ws: ExtendedWebsocket) => {
        ws.isAlive = true;
        ws.on("pong", () => {
            ws.isAlive = true;
            console.log(`Pong received from- ${connections.get(ws)}, Time: ${time}`);
            console.log(`Connected clients- ${connections.size}, Time: ${time}`);
        })

        // send auth message
        ws.send(JSON.stringify({ message: "Hey you are connected ws." }))

        // Set client
        const clientId = uuidV4()
        connections.set(ws, clientId)


        // handle message
        ws.on("message", async (msg) => {
            const data = JSON.parse(msg.toString());
            // console.log(data.data);

            try {
                console.log("going for update");
                await Canvas.findByIdAndUpdate(data.canvasId, { canvasElements: data.data })
                console.log("update done");

            } catch (error) {
                console.log(error);
            }

        })

        // handle close
        ws.on("close", () => {
            console.log(`Connection closed for ${connections.get(ws)}`);
            connections.delete(ws)
            console.log(connections.size);
        })
    })
}


export { ws };

