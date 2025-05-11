import { Excalidraw, Footer, Sidebar } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { isEqual } from "lodash";
import { Link, useNavigate, useParams } from "react-router";
import { BACKEND_URI } from "@/utils/config";
import { Loader, PanelRight } from "lucide-react";
import { useCloudCanvasUserStore } from "@/store/user_store";
import Cookies from "js-cookie";
import { useCloudCanvasCanvasNamesAndIds } from "@/store/canvas_store";
import { Button } from "@/components/ui/button";

const Canvas = () => {
  const [canvasElements, setCanvasElements] = useState<string[] | any>();
  const [currentCanvasName, setCurrentCanvasName] = useState("")
  const [loading, setLoading] = useState(false);
  const [docked, setDocked] = useState(false);
  const params = useParams();

  const cookie = Cookies.get("canvas_cloud_auth");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !useCloudCanvasUserStore.getState().isUserAuthenticated &&
      typeof cookie !== "string" &&
      typeof useCloudCanvasUserStore.getState().userName !== "string"
    ) {
      navigate("/signin");
    }

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
        setCurrentCanvasName(res.canvasElements.canvasName)
        setLoading(false);
      }
    })();
  }, [params.id]);

  // ws connection for render
  const { sendJsonMessage } = useWebSocket(`wss://cloud-canvas.onrender.com`, {
    onMessage: (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  // for local

  // handle canvas change
  const handleChange = async (drawings: string[] | any) => {
    const drawingCopy = drawings.map((drawing: string[] | any) => ({
      ...drawing,
    }));

    if (!isEqual(canvasElements, drawingCopy)) {
      setCanvasElements(drawingCopy);

      sendJsonMessage({
        type: "New drawings",
        data: drawingCopy,
        canvasId: params.id,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <Loader className="animate-spin" />
      </div>
    );
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
        <Sidebar name="custom" docked={docked} onDock={setDocked}>
          <Sidebar.Header />
          <Sidebar.Tabs>
            <div className="px-4">
              {useCloudCanvasCanvasNamesAndIds
                .getState()
                .canvasIdsAndNames?.map((canvas) => (
                  <Sidebar.Tab tab="canvases" key={canvas._id}>
                    <Button
                      onClick={() =>
                        navigate(
                          `/canvas/${canvas._id}`
                        )
                      }
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
              <span className="font-bold">You are on:</span> {currentCanvasName} / <span><Link to={"/dashboard"} className="hover:underline hover:text-blue-600">Home</Link></span>
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
