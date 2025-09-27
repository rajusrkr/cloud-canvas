import { Excalidraw, Footer, Sidebar } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useRef, useState } from "react";
import { isEqual } from "lodash";
import { Link, useNavigate, useParams } from "react-router";
import { LogOut, PanelRight } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { addToast, Button, Listbox, ListboxItem } from "@heroui/react";
import CustomLoader from "../components/custom-loader";
import { CreateNewCanvasModal } from "../components/canvas-list-table";

const Canvas = () => {
  const [canvasElements, setCanvasElements] = useState<string[] | any>();
  const [currentCanvasName, setCurrentCanvasName] = useState("");
  const [loading, setLoading] = useState(false);
  const [docked, setDocked] = useState(true);
  const params = useParams();

  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  const { isUserAuthenticated, logout } = useUserStore();

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate("/signin");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const sendReq = await fetch(
          `/api/v1/canvas/fetch?canvasId=${params.id}`,
          {
            method: "PUT",
            credentials: "include",
          }
        );

        const res = await sendReq.json();

        if (res.success) {
          setCanvasElements(res.canvasElements.canvasElements);
          setCurrentCanvasName(res.canvasElements.canvasName);
          document.title = `Cloud Canvas - ${res.canvasElements.canvasName}`;
          setLoading(false);
        } else if (res.message === "JsonWebTokenError") {
          await logout({ navigate });
          addToast({
            title: "Error",
            description: res.message,
            color: "warning",
          });
        } else {
          navigate("/dashboard");
          addToast({
            title: "Error",
            description: res.message,
            color: "warning",
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();

    const wss = new WebSocket(`ws://${window.location.host}/ws`);
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
    };
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
      <div className="flex justify-center items-center min-h-[40vh]">
        <CustomLoader height={1} width={1} />
      </div>
    );
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
            <div>
              <p className="ml-4 text-3xl font-semibold">Menues</p>
            </div>
            <div className="border border-default rounded-xl m-4 p-2">
              {useCanvasStore.getState().canvasIdsAndNames?.map((canvas, i) => (
                <Sidebar.Tab tab="canvases" key={i}>
                  <Listbox
                    disallowEmptySelection
                    aria-label="Single selection example"
                    variant="flat"
                    selectionMode="single"
                    hideSelectedIcon
                    className={`${
                      params.id === canvas._id && "text-primary"
                    } ${Excalidraw}`}
                  >
                    <ListboxItem
                      key="text"
                      onClick={() => {
                        navigate(`/canvas/${canvas._id}`);
                      }}
                    >
                      <div>
                        <span className="capitalize font-semibold">{`${canvas.canvasName}`}</span>
                      </div>
                    </ListboxItem>
                  </Listbox>
                </Sidebar.Tab>
              ))}
            </div>
            <div className="m-4">
              <CreateNewCanvasModal />
            </div>
          </Sidebar.Tabs>

          <div className="mx-4 mb-2">
            <Button
              color="danger"
              className="font-semibold w-full"
              variant="flat"
              onPress={async () => {
                await logout({ navigate });
              }}
            >
              Logout
              <LogOut size={14} />
            </Button>
          </div>
        </Sidebar>

        <Footer>
          <div className="bg-gray-200 rounded flex justify-center items-center px-4 ml-2">
            <p className="text-black capitalize">
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
