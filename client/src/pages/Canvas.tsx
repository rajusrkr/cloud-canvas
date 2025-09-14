import { Excalidraw, Footer, Sidebar } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { useEffect, useRef, useState } from "react";
import { isEqual } from "lodash";
import { Link, useNavigate, useParams } from "react-router";
import { BACKEND_URI } from "@/utils/config";
import { Loader, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasNamesAndIds } from "@/store/canvasStore";
import { useUserStore } from "@/store/userStore";

const Canvas = () => {
  const [canvasElements, setCanvasElements] = useState<string[] | any>();
  const [currentCanvasName, setCurrentCanvasName] = useState("");
  const [loading, setLoading] = useState(false);
  const [docked, setDocked] = useState(false);
  const params = useParams();

  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  const {verify, isUserAuthenticated} = useUserStore()
  


  useEffect(() => {
    (async () => {

     

      setLoading(true);
      const sendReq = await fetch(
        `${BACKEND_URI}/api/v1/canvas/fetch?canvasId=${params.id}`,
        {
          method: "PUT",
        }
      );

      const res = await sendReq.json();

      if (res.success) {
        setCanvasElements(res.canvasElements.canvasElements);
        setCurrentCanvasName(res.canvasElements.canvasName);
        document.title = `Cloud Canvas - ${res.canvasElements.canvasName}`;
        setLoading(false);
      }

       await verify()
    })();

    const wss = new WebSocket("ws://localhost:8080");
    if (socketRef.current !== null) return;

    wss.onopen = () => {
      socketRef.current = wss;
      setIsConnected(true);
      console.log("WS connection established.");
    };

    wss.onclose = () => {
      setIsConnected(false);
      // console.log("Connection closed, trying to reconnect...");
    };

    wss.onerror = (err) => {
      console.log(err);
      wss.close();
      setIsConnected(false);
    };

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    }

  }, [params.id]);

  const handleChange = async (drawings: string[] | any) => {
    const drawingCopy = drawings.map((drawing: string[] | any) => ({
      ...drawing,
    }));

    if (!isEqual(canvasElements, drawingCopy)) {
      setCanvasElements(drawingCopy);
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "New drawings",
            data: drawingCopy,
            canvasId: params.id,
          })
        );
      } else {
        setIsConnected(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!isUserAuthenticated) {
    navigate("/signin")
    return
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        initialData={{
          elements: canvasElements,
          appState: { currentItemFontFamily: 3, theme: "dark" },
        }}
        onChange={handleChange}
      >
        <Sidebar name="custom" docked={docked} onDock={setDocked}>
          <Sidebar.Header />
          <Sidebar.Tabs>
            <div className="px-4">
              {useCanvasNamesAndIds
                .getState()
                .canvasIdsAndNames?.map((canvas) => (
                  <Sidebar.Tab tab="canvases" key={canvas._id}>
                    <Button
                      onClick={() => navigate(`/canvas/${canvas._id}`)}
                      variant={"ghost"}
                    >
                      {canvas.canvasName}
                    </Button>
                  </Sidebar.Tab>
                ))}
            </div>
          </Sidebar.Tabs>
        </Sidebar>

        <Footer>
          <div className="bg-gray-200 rounded flex justify-center items-center px-4 ml-2">
            <p className="text-black">
              <span>
                <Link to={"/dashboard"}>
                  <span className="hover:underline text-blue-600 font-bold">
                    Dashboard
                  </span>
                </Link>
              </span>
              / {currentCanvasName} <span> - {isConnected ? "🟢" : "⚫"}</span>
            </p>
          </div>
          <Sidebar.Trigger
            name="custom"
            tab="canvases"
            style={{
              marginLeft: "0.5rem",
              background: "#222328",
              color: "white",
            }}
          >
            <PanelRight />
          </Sidebar.Trigger>
        </Footer>
      </Excalidraw>
    </div>
  );
};

export default Canvas;
