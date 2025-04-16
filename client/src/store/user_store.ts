import { BACKEND_URI } from "@/utils/config"
import Cookies from "js-cookie"
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
    signin: ({email, password}: {email: string, password: string}) => Promise<void>
}

const useCloudCanvasUserStore = create(persist<CanvasIdsAndName>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,
    isUserAuthenticated: false,
    userName: null,
    signin: async ({email, password}) => {
        set({isLoading: true, isError: false, errorMessage: null, isUserAuthenticated: false, userName: null})
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
                set({isLoading: false, isUserAuthenticated: true, userName: res.username})
                Cookies.set("canvas_cloud_auth", res.token, {
                    secure: true,
                    domain: "cloud-canvas.vercel.app",
                    expires: 5 * 60 * 1000,
                    sameSite: "Lax",
                  });
             } else {
                set({isLoading: false, isError: true, errorMessage: res.message})
             }
        } catch (error) {
            console.log(error);
            set({isLoading: false, isError: true, errorMessage: "Something is broken, please try agin later."})
        }
    }
}), {name: "cloud_canvas_user_store"}))

export {useCloudCanvasUserStore}