import { useUserStore } from "@/store/userStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const RedirectToDashboardOrSignin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/dashboard/${useUserStore.getState().userName}`);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[20vh]">
      <Loader className="animate-spin" />
    </div>
  );
};

export default RedirectToDashboardOrSignin;
