import { useEffect } from "react";
import { useCanvasStore } from "../store/useCanvasStore";
import CanvasListTable from "../components/canvas-list-table";
import { useUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { fetchCanvas } = useCanvasStore();
  const {isUserAuthenticated} = useUserStore()

  const navigate = useNavigate()
  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate("/signin")
    }
    (async () => {
      await fetchCanvas({navigate});
    })();
  }, []);

  return (
    <div>
        <CanvasListTable />
    </div>
  )
}
