import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router";
import BgImgAndSignin from "../components/bg-image-and-signin";

export default function Signin() {
  const { isUserAuthenticated } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserAuthenticated) {
      navigate("/dashboard");
    }
  }, []);
  return <BgImgAndSignin />;
}
