import { useCloudCanvasUserStore } from "@/store/user_store";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const RedirectToDashboardOrSignin = () => {
  const authCookie = Cookies.get("canvas_cloud_auth");

  const navigate = useNavigate();

  useEffect(() => {
    if (
      useCloudCanvasUserStore.getState().isUserAuthenticated &&
      typeof authCookie === "string" &&
      typeof useCloudCanvasUserStore.getState().userName === "string"
    ) {
      navigate(`/dashboard/${useCloudCanvasUserStore.getState().userName}`);
    } else {
      navigate("/signin");
    }
  });

  return (
    <div className="flex justify-center items-center min-h-[20vh]">
      <Loader className="animate-spin" />
    </div>
  );
};

export default RedirectToDashboardOrSignin;
