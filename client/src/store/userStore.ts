import { BACKEND_URI } from "@/utils/config"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// MAIN STORE DATA TYPES
interface CanvasIdsAndName {
    isLoading: boolean,
    isError: boolean,
    errorMessage: null | string,
    // userAuthStatus
    isUserAuthenticated: boolean,
    userName: null | string,
    // signin func
    signin: ({ email, password, navigate }: { email: string, password: string, navigate:  (path: string) => void }) => Promise<void>
    // Verify user
    verify: () => Promise<void>
    // Verify otp
    verifyOtp: ({otp, navigate}:{otp:string, navigate: (path: string) => void}) => Promise<void>
}

const useUserStore = create(persist<CanvasIdsAndName>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,
    isUserAuthenticated: false,
    userName: null,
    signin: async ({ email, password, navigate }) => {
        set({ isLoading: true, isError: false, errorMessage: null, isUserAuthenticated: false, userName: null })
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
                set({ isLoading: false })
                navigate("/signin/otp-verify")
            } else {
                set({ isLoading: false, isError: true, errorMessage: res.message })
            }
        } catch (error) {
            console.log(error);
            set({ isLoading: false, isError: true, errorMessage: "Something is broken, please try agin later." })
        }
    },

    verify: async () => {
        try {
            const sendReq = await fetch(`${BACKEND_URI}/api/v1/user/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ userName: useUserStore.getState().userName })
            })

            const res = await sendReq.json();

            if (!res.success) {
                set({ isUserAuthenticated: false })
            } else {
                set({ isUserAuthenticated: true })
            }

        } catch (error) {
            console.log(error);
        }
    },

    verifyOtp: async({otp, navigate}) => {
        try {
            set({isLoading: true, isError: false, errorMessage:null});

            const sendReq = await fetch(`${BACKEND_URI}/api/v1/user/otp-verify`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                credentials: "include",
                body: JSON.stringify({otp})
            })

            const res = await sendReq.json();

            if (res.success) {
                set({isLoading: false, userName: res.user, isUserAuthenticated: true})
                navigate(`/dashboard/${useUserStore.getState().userName}`)
            } else {
                set({isLoading: false, isError: true, errorMessage: res.message})
            }

        } catch (error) {
            console.log(error);
        }
    }
}), { name: "canvasUser" }))

export { useUserStore }