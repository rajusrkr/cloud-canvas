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
import {
  EllipsisVertical,
  ExternalLink,
  FolderPen,
  Loader,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useCanvasNamesAndIds } from "@/store/canvasStore";

export default function DashboardActionButton({
  canvasId,
  canvasName,
  authCookie,
}: {
  canvasId: any;
  canvasName: string;
  authCookie: string;
}) {
  const navigate = useNavigate();
  const { editCanvasName, deleteCanvas } = useCanvasNamesAndIds();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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

            {/* edit canvas */}
            <DropdownMenuItem
              onSelect={() => {
                setDropdownOpen(false);
                setDialogOpen(true);
              }}
              className="hover:cursor-pointer hover:font-extrabold transition-all flex items-center"
            >
              Edit <FolderPen />
            </DropdownMenuItem>

            {/* DELETE CANVAS */}
            <DropdownMenuItem
              onClick={async () => {
                await deleteCanvas({authCookie, canvasId})
              }}
              className="hover:cursor-pointer hover:font-extrabold transition-all flex items-center text-red-500"
            >
              Delete <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*edit DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit canvas name</DialogTitle>
          <DialogDescription>Give canvas a new name</DialogDescription>
          <div className="space-y-2">
            <Label>Current name</Label>
            <Input defaultValue={canvasName} id="currentName" disabled={true} />
          </div>
          <div className="space-y-2">
            <Label>New name</Label>
            <Input
              placeholder="Enter new name"
              id="newName"
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div>
            {useCanvasNamesAndIds.getState().isEditingName ? (
              <Button className="w-full hover:cursor-pointer" disabled={true}>
                <Loader className="animate-spin" />
              </Button>
            ) : (
              <Button
                className="w-full hover:cursor-pointer"
                onClick={async () => {
                  await editCanvasName({ id: canvasId, newName });
                  if (
                    useCanvasNamesAndIds.getState()
                      .isNameEditingSuccess
                  ) {
                    setDialogOpen(false);
                  }
                }}
              >
                Save Chnages
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
