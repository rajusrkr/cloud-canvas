import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { BACKEND_URI } from "@/utils/config";

export default function Header() {
  const currentPath = useLocation();
  const params = useParams();

  const navigate = useNavigate();

  const cookie = Cookies.get("canvas_cloud_auth");

  if (currentPath.pathname === `/dashboard/${params.userId}`) {
    return (
      <div className=" bg-gray-100 dark:bg-gray-950 border border-b-white/20 shadow">
        <div className="mx-auto max-w-7xl flex justify-between px-4 items-center h-14">
          <div>
            <h2 className="text-3xl font-bold">Cloud Canvas</h2>
          </div>
          <div className="space-x-4">
            <Link
              to={"/"}
              className="border p-2 rounded-full bg-orange-200 border-none px-4 hover:bg-amber-600 transition-all dark:bg-gray-500 text-xl font-semibold dark:hover:bg-gray-800"
            >
              Logout
            </Link>
            <Button
              className="rounded-full items-center font-bold"
              onClick={async () => {
                try {
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
                    navigate(`/canvas/${res.canvasId}`);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              New Canvas
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 dark:bg-gray-950 border border-b-white/20 shadow">
      <div className="mx-auto max-w-7xl flex justify-between px-4 items-center h-14">
        <div>
          <h2 className="text-3xl font-bold">Cloud Canvas</h2>
        </div>
        <div className="space-x-4">
          <Link
            to={"/signin"}
            className="border p-2 rounded-full bg-orange-200 border-none px-4 hover:bg-amber-600 transition-all dark:bg-gray-500 text-xl font-semibold dark:hover:bg-gray-800"
          >
            Signin
          </Link>
          <Link
            to={"/dashboard"}
            className="border p-2 rounded-full bg-orange-200 border-none px-4 hover:bg-amber-600 transition-all dark:bg-gray-500 text-xl font-semibold dark:hover:bg-gray-800"
          >
            Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
