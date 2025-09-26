import { create } from "zustand"
import { persist } from "zustand/middleware"
import { BACKEND_URI } from "../lib/utils"
import { useCanvasStore } from "./useCanvasStore"
import { addToast } from "@heroui/react"


interface UserStoreStates {
    isLoading: boolean,
    isError: boolean,
    errorMessage: null | string,
    // userAuthStatus
    isCredentialsCorrect: boolean,
    isUserAuthenticated: boolean,
    isLoggingOut: boolean,
    userName: null | string,
    // signin func
    signin: ({ email, password }: { email: string, password: string }) => Promise<void>
    // Verify otp
    verifyOtp: ({ otp, navigate }: { otp: string, navigate: (path: string) => void }) => Promise<void>
    // Handle session
    logout: ({ navigate }: { navigate: (path: string) => void }) => Promise<void>
}


const useUserStore = create(persist<UserStoreStates>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,
    isUserAuthenticated: false,
    isCredentialsCorrect: false,
    isLoggingOut: false,
    userName: null,

    signin: async ({ email, password }) => {
        set({
            isLoading: true, isError: false, errorMessage: null, isUserAuthenticated: false, userName: null, isCredentialsCorrect: false
        })
        const data = {
            email,
            password
        }
        try {
            const sendReq = await fetch(`${BACKEND_URI}/api/v1/user/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data }),
                credentials: "include",
            });
            const res = await sendReq.json()
            if (res.success) {
                set({ isLoading: false, isCredentialsCorrect: true })

            } else {
                set({ isLoading: false, isError: true, errorMessage: res.message })
            }
        } catch (error) {
            console.log(error);
            set({ isLoading: false, isError: true, errorMessage: "Something is broken, please try agin later." })
        }
    },
    verifyOtp: async ({ otp, navigate }) => {
        try {
            set({ isLoading: true, isError: false, errorMessage: null });

            const sendReq = await fetch(`${BACKEND_URI}/api/v1/user/otp-verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ otp })
            })

            const res = await sendReq.json();

            if (res.success) {
                set({ isLoading: false, userName: res.user, isUserAuthenticated: true, isCredentialsCorrect: false })
                navigate(`/dashboard`)
            } else if (res.message === "JsonWebTokenError") {
                set({ isLoading: false, isCredentialsCorrect: false })
                await useUserStore.getState().logout({ navigate })
            }
            else {
                set({ isLoading: false, isError: true, errorMessage: res.message })
            }

        } catch (error) {
            console.log(error);
        }
    },

    logout: async ({ navigate }) => {
        try {
            set({ isLoggingOut: true, isError: false, errorMessage: null })
            const sendReq = await fetch(`${BACKEND_URI}/api/v1/user/handle-session`, {
                method: "DELETE",
                credentials: "include"
            })

            const res = await sendReq.json()

            if (res.success) {
                set({ isLoggingOut: false, isUserAuthenticated: false, userName: null })
                useCanvasStore.setState({ canvasIdsAndNames: [] })
                navigate("/")
                addToast({
                    title: "You have been loged out",
                    description: res.message,
                    color: "warning",
                });
            }
            else if (res.message === "JsonWebTokenError") {
                set({ isLoggingOut: false, isUserAuthenticated: false, isCredentialsCorrect: false, userName: null })
                useCanvasStore.setState({ canvasIdsAndNames: [] })
                navigate("/")
                addToast({
                    title: "You have been loged out with error",
                    description: res.message,
                    color: "warning",
                });
            }
            else {
                addToast({
                    title: "Error",
                    description: res.message,
                    color: "warning",
                });
            }

        } catch (error) {
            console.log(error);
        }
    }
}), { name: "userStore" }))


export { useUserStore }