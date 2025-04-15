import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKEND_URI } from "@/utils/config";
import {
  EllipsisVertical,
  ExternalLink,
  FolderPen,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";

interface Canvas {
  canvasElements: string[];
  canvasName: string;
  updatedAt: string;
  _id: string;
}

export default function DashboardActionButton({
  canvasId,
  authCookie,
  allCanvas,
}: {
  canvasId: any;
  authCookie: string;
  allCanvas: Canvas[];
}) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select one</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              navigate(`/canvas/${canvasId}`);
            }}
            className="hover:cursor-pointer hover:font-extrabold transition-all flex items-center"
          >
            Open <ExternalLink />
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer hover:font-extrabold transition-all flex items-center">
            Rename <FolderPen />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              try {
                const sendReq = await fetch(
                  `${BACKEND_URI}/api/v1/canvas/delete?canvasId=${canvasId}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: authCookie,
                    },
                  }
                );
                const res = await sendReq.json();
                if (res.success) {
                  allCanvas.map((canvas, index) => {
                    if (canvas._id === canvasId) {
                      console.log(canvasId);
                      console.log(index);
                      allCanvas.splice(index, 1);
                      console.log(allCanvas);
                    }
                  });
                }
              } catch (error) {}
            }}
            className="hover:cursor-pointer hover:font-extrabold transition-all flex items-center text-red-500"
          >
            Delete <Trash2 className="text-red-500" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
