import { useLocation, useNavigate, useParams } from "react-router";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { BACKEND_URI } from "@/utils/config";
import { FilePlus, Loader, SquareChevronRight } from "lucide-react";
import {useState} from "react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

export default function Header() {
  const currentPath = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)

  const cookie = Cookies.get("canvas_cloud_auth");

  // for dashboard layout
  if (currentPath.pathname === `/dashboard/${params.userId}`) {
    return (
      <div className=" bg-gray-100 dark:bg-gray-950 border border-b-white/20 shadow">
        <div className="mx-auto max-w-7xl flex justify-between px-4 items-center h-14">
          <div>
            <h2 className="sm:text-2xl text-xl font-bold">Cloud Canvas</h2>
          </div>
          <div className="space-x-4">
            <Button
              className="rounded-full items-center font-bold hover:cursor-pointer"
              onClick={async () => {
                try {
                  setLoading(true)
                  const sendReq = await fetch(
                    `${BACKEND_URI}/api/v1/canvas/create`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `${cookie}`,
                      },
                    }
                  );
                  const res = await sendReq.json();
                  if (res.success) {
                    setLoading(false)
                    navigate(`/canvas/${res.canvasId}`);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              {
                loading ? (<div className="animate-spin"><Loader /></div>) : (<>New Canvas <FilePlus /></>)
              }
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <SquareChevronRight />
                </Button>
              </SheetTrigger>
              <SheetContent>
              
                <div className="grid gap-4 py-4 ml-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <ThemeToggle />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Button variant={"destructive"}
                    onClick={() => {
                      Cookies.remove("canvas_cloud_auth")
                      navigate("/")
                    }}
                    
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* <ThemeToggle /> */}
        </div>
      </div>
    );
  }
  // for home
  return (
    <div className=" bg-gray-100 dark:bg-gray-950 border border-b-white/20 shadow">
      <div className="mx-auto max-w-7xl flex justify-between px-4 items-center h-14">
        <div>
          <h2 className="text-3xl font-bold">Cloud Canvas</h2>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
