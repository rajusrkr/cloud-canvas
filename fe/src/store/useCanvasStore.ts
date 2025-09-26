import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BACKEND_URI } from "../lib/utils";
import { useUserStore } from "./useUserStore";

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
    isCanvasDeleting: boolean;
    isCanvasDeleted: boolean;
    errorMessage: null | string;
    canvasIdsAndNames: CanvasNameAndId[];
    // fetch all canvases
    fetchCanvas: ({navigate} : {navigate: (path: string) => void}) => Promise<void>;
    // edit canvas title
    editCanvasName: ({
        id,
        newName,
        navigate
    }: {
        id: string;
        newName: string;
        navigate: (path: string) => void
    }) => Promise<void>;
    // delete canvas
    deleteCanvas: ({
        canvasId,
        navigate
    }: {
        canvasId: string;
        navigate: (path: string) => void
    }) => Promise<void>;
    // Create new canvas
}


const useCanvasStore = create(
    persist<CanvasNamesAndIds>(
        (set) => ({
            isLoading: false,
            isError: false,
            errorMessage: null,
            isEditingName: false,
            isNameEditingSuccess: false,
            isCanvasDeleted: false,
            isCanvasDeleting: false,
            canvasIdsAndNames: [],
            fetchCanvas: async ({navigate}) => {
                set({ isLoading: true, isError: false, errorMessage: null });

                try {
                    const sendReq = await fetch(
                        `${BACKEND_URI}/api/v1/canvas/get-all-canvas`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include"
                        }
                    );
                    const res = await sendReq.json();

                    if (res.success) {
                        set({ isLoading: false, canvasIdsAndNames: res.canvases });
                    }
                    else if (res.message === "JsonWebTokenError") {
                        useUserStore.setState({ isUserAuthenticated: false, isCredentialsCorrect: false })
                        set({ isLoading: false, errorMessage: res.message, isError: true, canvasIdsAndNames: [] })
                        await useUserStore.getState().logout({navigate})
                    }
                    else {
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
            editCanvasName: async ({ id, newName, navigate }) => {
                set({
                    isEditingName: true,
                    isError: false,
                    isNameEditingSuccess: false,
                    errorMessage: null,
                });

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
                            },
                            credentials: "include",
                            body: JSON.stringify({ data }),
                        }
                    );
                    const res = await sendReq.json();
                    if (res.success) {
                        const index = useCanvasStore
                            .getState()
                            .canvasIdsAndNames.findIndex((canvas) => canvas._id === id);
                        useCanvasStore.setState((prev) => {
                            const update = [...prev.canvasIdsAndNames];
                            update[index] = {
                                ...update[index],
                                canvasName: newName,
                            };
                            return { canvasIdsAndNames: update };
                        });
                        set({ isEditingName: false, isNameEditingSuccess: true });
                    }
                    else if (res.message === "JsonWebTokenError") {
                        set({ isError: true, errorMessage: res.message, isEditingName: false, canvasIdsAndNames: [] })
                        await useUserStore.getState().logout({navigate})
                    }
                    else {
                        set({
                            isEditingName: false,
                            isError: true,
                            errorMessage: res.message,
                            isNameEditingSuccess: false,
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
            deleteCanvas: async ({ canvasId, navigate }) => {
                set({
                    isCanvasDeleted: false,
                    isCanvasDeleting: true,
                    isError: false,
                    errorMessage: null,
                });

                try {
                    const sendReq = await fetch(
                        `${BACKEND_URI}/api/v1/canvas/delete?canvasId=${canvasId}`,
                        {
                            method: "DELETE",
                            credentials: "include"
                        },

                    );
                    const res = await sendReq.json();
                    if (res.success) {
                        const filter = useCanvasStore
                            .getState()
                            .canvasIdsAndNames.filter((canvas) => canvas._id !== canvasId);

                        useCanvasStore.setState(() => {
                            return { canvasIdsAndNames: filter };
                        });
                        set({ isCanvasDeleted: true, isCanvasDeleting: false })
                    }
                    else if (res.message === "JsonWebTokenError") {
                        set({ isError: true, errorMessage: res.message, isCanvasDeleting: false, canvasIdsAndNames: [] })
                        await useUserStore.getState().logout({navigate})
                    }
                    else {
                        set({ isCanvasDeleting: false, isError: true, errorMessage: res.message })
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        { name: "useCanvasStore" }
    )
);

export { useCanvasStore };
