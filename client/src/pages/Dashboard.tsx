import DashboardActionButton from "@/components/dashboard-action-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCloudCanvasCanvasNamesAndIds } from "@/store/canvas_store";
import { useCloudCanvasUserStore } from "@/store/user_store";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const cookie = Cookies.get("canvas_cloud_auth");
  const navigate = useNavigate();
  const { fetchCanvas, isLoading, canvasIdsAndNames } = useCloudCanvasCanvasNamesAndIds();

  useEffect(() => {
    if (
      !useCloudCanvasUserStore.getState().isUserAuthenticated &&
      typeof cookie !== "string" &&
      typeof useCloudCanvasUserStore.getState().userName !== "string"
    ) {
      navigate("/signin");
    }

    (async () => {
      await fetchCanvas({ authCookie: cookie! });
    })();

    document.title = "Cloud Canvas - Dashboard"
  }, []);

  if (isLoading && canvasIdsAndNames.length===0) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (
    useCloudCanvasCanvasNamesAndIds.getState().canvasIdsAndNames.length === 0
  ) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <h2 className="font-semibold text-2xl">
          You dont have any canvas yet.
        </h2>
      </div>
    );
  }

  const dateFormatter = new Intl.DateTimeFormat("en-us", {
    dateStyle: "full"
  })

  return (
    <Table className="max-w-7xl mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Serial</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Last updated</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {useCloudCanvasCanvasNamesAndIds
          .getState()
          .canvasIdsAndNames.map((canvas, index) => (
            <TableRow
              key={canvas._id}
              className="hover:shadow transition-all hover:bg-yellow-100 dark:hover:bg-yellow-950"
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell
                className="hover:cursor-pointer hover:underline underline-offset-2"
                onClick={() => {
                  navigate(`/canvas/${canvas._id}`);
                }}
              >
                {canvas.canvasName}
              </TableCell>
              <TableCell>{dateFormatter.format(new Date(canvas.updatedAt))}</TableCell>
              <TableCell className="text-right">
                <DashboardActionButton
                  canvasId={canvas._id}
                  canvasName={canvas.canvasName}
                  authCookie={cookie!}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
