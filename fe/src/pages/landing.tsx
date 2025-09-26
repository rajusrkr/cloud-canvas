import { useEffect } from "react";
import CustomLoader from "../components/custom-loader";
import { useNavigate } from "react-router";
import { useUserStore } from "../store/useUserStore";

export default function Landing() {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useUserStore();
  useEffect(() => {
    if (isUserAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signin");
    }
  }, []);
  return <CustomLoader height={20} width={20} />;
}
