import { BACKEND_URI } from "@/utils/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CanvasNameAndId {
  canvasElements: string[];
  canvasName: string;
  updatedAt: string;
  _id: string;
}

// MAIN types
interface CanvasNamesAndIds {
  isLoading: boolean;
  isError: boolean;
  isEditingName: boolean;
  isNameEditingSuccess: boolean;
  errorMessage: null | string;
  canvasIdsAndNames: CanvasNameAndId[];
  // fetch all canvases
  fetchCanvas: ({ authCookie }: { authCookie: string }) => Promise<void>;
  // edit canvas name
  editCanvasName: ({
    id,
    newName,
    authCookie,
  }: {
    id: string;
    newName: string;
    authCookie: string;
  }) => Promise<void>;
  // delete canvas
  
}

const useCloudCanvasCanvasNamesAndIds = create(
  persist<CanvasNamesAndIds>(
    (set) => ({
      isLoading: false,
      isError: false,
      errorMessage: null,
      isEditingName: false,
      isNameEditingSuccess: false,
      canvasIdsAndNames: [],
      fetchCanvas: async ({ authCookie }) => {
        set({ isLoading: true, isError: false, errorMessage: null });

        try {
          const sendReq = await fetch(
            `${BACKEND_URI}/api/v1/canvas/get-all-canvas`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${authCookie}`,
              },
            }
          );
          const res = await sendReq.json();

          if (res.success) {
            set({ isLoading: false, canvasIdsAndNames: res.canvases });
          } else {
            set({
              isLoading: false,
              isError: true,
              errorMessage: res.message,
              canvasIdsAndNames: [],
            });
          }
        } catch (error) {
          console.log(error);
          set({
            isLoading: false,
            isError: true,
            errorMessage: "Something is broken please try agian later",
            canvasIdsAndNames: [],
          });
        }
      },
      editCanvasName: async ({ id, newName, authCookie }) => {
        set({ isEditingName: true, isError: false, isNameEditingSuccess: false, errorMessage: null });

        const data = {
          newName,
          id,
        };
        try {
          const sendReq = await fetch(
            `${BACKEND_URI}/api/v1/canvas/edit-name`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: authCookie,
              },
              body: JSON.stringify({ data }),
            }
          );
          const res = await sendReq.json();
          if (res.success) {
            const index = useCloudCanvasCanvasNamesAndIds
              .getState()
              .canvasIdsAndNames.findIndex((canvas) => canvas._id === id);
            useCloudCanvasCanvasNamesAndIds.setState((prev) => {
              const update = [...prev.canvasIdsAndNames];
              update[index] = {
                ...update[index],
                canvasName: newName,
              };
              return { canvasIdsAndNames: update };
            });
            set({ isEditingName: false, isNameEditingSuccess: true, });
          } else {
            set({
              isEditingName: false,
              isError: true,
              errorMessage: res.message,
              isNameEditingSuccess: false
            });
          }
        } catch (error) {
          console.log(error);
          set({
            isEditingName: false,
            isError: true,
            errorMessage: "Something is broken",
          });
        }
      },
    }),
    { name: "cloud_canvas_canvas_names_ids" }
  )
);

export { useCloudCanvasCanvasNamesAndIds };
