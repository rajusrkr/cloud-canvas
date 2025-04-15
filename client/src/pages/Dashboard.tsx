import DashboardActionButton from "@/components/dashboard-action-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BACKEND_URI } from "@/utils/config";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Canvas {
  canvasElements: string[];
  canvasName: string;
  updatedAt: string;
  _id: string;
}

export default function Dashboard() {
  const cookie = Cookies.get("canvas_cloud_auth");
  const navigate = useNavigate();

  const [allCanvas, setAllCanvas] = useState<Canvas[]>([]);

  useEffect(() => {
    (async () => {
      const sendReq = await fetch(
        `${BACKEND_URI}/api/v1/canvas/get-all-canvas`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${cookie}`,
          },
        }
      );

      const res = await sendReq.json();

      if (res.success) {
        setAllCanvas(res.canvases);
      }
    })();
  }, []);

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
        {allCanvas.map((canvas, index) => (
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
            <TableCell>{canvas.updatedAt}</TableCell>
            <TableCell className="text-right">
              <DashboardActionButton canvasId={canvas._id} authCookie={cookie!} allCanvas={allCanvas}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
