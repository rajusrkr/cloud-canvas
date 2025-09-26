import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Form,
  Input,
  addToast,
} from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import { useCanvasStore } from "../store/useCanvasStore";
import { ArrowUpRight, PencilLine, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import CustomLoader from "./custom-loader";
import { BACKEND_URI } from "../lib/utils";
import { useUserStore } from "../store/useUserStore";

export const DeleteIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

// Edit canvas title
export function EditTitleModal({
  canvasTitle,
  canvasId,
}: {
  canvasTitle: string;
  canvasId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { editCanvasName, isEditingName, isError, errorMessage } =
    useCanvasStore();
  const [newCanvasTitle, setNewCanvasTitle] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <Tooltip content="Edit title" color="primary">
        <span className="cursor-pointer active:opacity-50">
          <PencilLine size={14} className="text-primary" onClick={onOpen} />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit canvas title
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await editCanvasName({
                      newName: newCanvasTitle,
                      id: canvasId,
                      navigate,
                    });
                    onClose();
                  }}
                >
                  <Input
                    type="text"
                    defaultValue={canvasTitle}
                    variant="faded"
                    placeholder="Enter canvas title"
                    label="Canvas title"
                    labelPlacement="outside"
                    onChange={(e) => setNewCanvasTitle(e.target.value)}
                  />

                  <div>
                    <p className="text-red-500 text-sm font-semibold">
                      {isError && `Error: ${errorMessage}`}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    color="primary"
                    variant="flat"
                    size="sm"
                  >
                    {isEditingName ? (
                      <CustomLoader height={1} width={1} />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  size="sm"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
// Delete canvas
export function DeleteCanvas({
  canvasTitle,
  canvasId,
}: {
  canvasTitle: string;
  canvasId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { deleteCanvas, isCanvasDeleting, isError, errorMessage } =
    useCanvasStore();

  const navigate = useNavigate();

  return (
    <>
      <Tooltip content="Delete" color="danger">
        <span className="cursor-pointer active:opacity-50">
          <Trash2 size={14} className="text-danger" onClick={onOpen} />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit canvas title
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-1">
                  <span className="text-danger font-semibold">
                    Are you sure you want delete:-
                  </span>
                  <span className="capitalize underline">{canvasTitle}</span>
                </div>
                <div>
                  <p className="text-red-500 text-sm font-semibold">
                    {isError && `Error: ${errorMessage}`}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  size="sm"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  color="warning"
                  variant="flat"
                  size="sm"
                  isDisabled={isCanvasDeleting}
                  onPress={async () => {
                    await deleteCanvas({ canvasId, navigate });
                    onClose();
                  }}
                >
                  {isCanvasDeleting ? (
                    <CustomLoader height={1} width={1} />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
// Create new canvas
export function CreateNewCanvasModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [canvasTitle, setCanvasTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { fetchCanvas, canvasIdsAndNames } = useCanvasStore();
  const { logout } = useUserStore();

  return (
    <div>
      <Button
        size="md"
        radius="md"
        color="primary"
        variant="flat"
        onPress={onOpen}
        className="w-full"
      >
        <span className="flex items-center">
          Create new canvas <Plus size={20} />
        </span>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Canvas title
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    if (
                      canvasIdsAndNames.find(
                        (canvas) =>
                          canvas.canvasName.toLowerCase() ===
                          canvasTitle.toLowerCase()
                      )
                    ) {
                      setIsError(true);
                      setErrorMessage("Canvas with same title already exists");
                      return;
                    }

                    try {
                      setIsLoading(true);
                      const sendReq = await fetch(
                        `${BACKEND_URI}/api/v1/canvas/create`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                          body: JSON.stringify({ canvasTitle }),
                        }
                      );
                      const res = await sendReq.json();
                      if (res.success) {
                        await fetchCanvas({ navigate });
                        setIsLoading(false);
                        navigate(`/canvas/${res.canvasId}`);
                      } else if (res.message === "JsonWebTokenError") {
                        setIsLoading(false);
                        useCanvasStore.setState({ canvasIdsAndNames: [] });
                        await logout({ navigate });
                        addToast({
                          title: "You have been loged out",
                          description: res.message,
                          color: "warning",
                        });
                      } else {
                        setIsLoading(false);
                        console.log(res);
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Input
                    type="text"
                    isRequired
                    placeholder="Enter canvas title"
                    label="Give your canvas a title"
                    labelPlacement="outside"
                    variant="faded"
                    defaultValue={canvasTitle}
                    onChange={(e) => setCanvasTitle(e.target.value)}
                  />
                  <p className="text-sm font-semibold text-red-500">
                    {isError && errorMessage}
                  </p>
                  <Button
                    type="submit"
                    size="sm"
                    color="primary"
                    variant="flat"
                  >
                    <span className="flex items-center gap-1">
                      {isLoading ? (
                        <CustomLoader height={1} width={1} />
                      ) : (
                        <>
                          Create new canvas <ArrowUpRight size={16} />
                        </>
                      )}
                    </span>
                  </Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function CanvasListTable() {
  const { canvasIdsAndNames } = useCanvasStore();
  const navigate = useNavigate();

  const dateFormatter = new Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  });

  return (
    <div className="max-w-5xl mx-auto mt-2">
      <Table selectionMode="single" aria-label="List of canvases">
        <TableHeader>
          <TableColumn>Title</TableColumn>
          <TableColumn>Updated</TableColumn>
          <TableColumn>Actons</TableColumn>
        </TableHeader>
        <TableBody className="space-y-3">
          {canvasIdsAndNames.map((canvas, i) => (
            <TableRow key={i} className="hover:cursor-pointer">
              <TableCell
                className="text-primary font-semibold"
                onClick={() => {
                  navigate(`/canvas/${canvas._id}`);
                }}
              >
                <span className="capitalize">{canvas.canvasName}</span>
              </TableCell>
              <TableCell>
                {dateFormatter.format(new Date(canvas.updatedAt))}
              </TableCell>
              <TableCell className="flex items-center gap-8">
                <Tooltip content="Open" color="default">
                  <span className="cursor-pointer active:opacity-50">
                    <ArrowUpRight
                      size={20}
                      className="text-default-700"
                      onClick={() => {
                        navigate(`/canvas/${canvas._id}`);
                      }}
                    />
                  </span>
                </Tooltip>
                <EditTitleModal
                  canvasId={canvas._id}
                  canvasTitle={canvas.canvasName}
                />
                <DeleteCanvas
                  canvasId={canvas._id}
                  canvasTitle={canvas.canvasName}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-2">
        <CreateNewCanvasModal />
      </div>
    </div>
  );
}
