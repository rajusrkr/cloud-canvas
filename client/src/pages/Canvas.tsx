import { Excalidraw} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import {isEqual} from "lodash"
import { useParams } from "react-router";

const Canvas = () => {
  const [canvasElements, setCanvasElements] = useState<string[] | any>()
  const [loading, setLoading] =  useState(false)
  const params = useParams()

  
  useEffect(() => {
      (async () => {
        setLoading(true)
        const sendReq = await fetch(`http://localhost:5000/api/v1/canvas/fetch?canvasId=${params.id}`, {
            method: "PUT"
        })

        const res = await sendReq.json()

        if (res.success) {
            setCanvasElements(res.canvasElements.canvasElements)
            setLoading(false)
        }
    })()
  }, [params.id])
  

  // ws connection
  const { sendJsonMessage } = useWebSocket("ws://localhost:5000", {
    onMessage: (e) => {
        try {
            const data = JSON.parse(e.data)
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
  })

  
  // handle canvas change
  const handleChange = async (drawings: string[] | any) => {
    const drawingCopy = drawings.map((drawing: string[] | any) => ({
        ...drawing
    }))

    if (!isEqual(canvasElements, drawingCopy)) {
        setCanvasElements(drawingCopy)
        
        sendJsonMessage({
            type: "New drawings",
            data: drawingCopy,
            canvasId: params.id
        })
    }

  }

  if (loading) {
    return (
        <div>
            <p>Loding.....</p>
        </div>
    )
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        initialData={{
          elements: canvasElements,
          appState: { theme: "dark" },
        }}
        onChange={handleChange}
      >
      </Excalidraw>
    </div>
  );
};

export default Canvas;
