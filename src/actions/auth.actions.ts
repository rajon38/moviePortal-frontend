"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { deleteCookie } from "@/lib/cookieUtils";
import { redirect } from "next/navigation";

export const logoutAction = async (): Promise<void> => {
    try {
        await httpClient.post("/auth/logout", {});
    } catch (error) {
        console.error("Logout request failed:", error);
    }

    await Promise.all([
        deleteCookie("accessToken"),
        deleteCookie("refreshToken"),
        deleteCookie("better-auth.session_token"),
    ]);

    redirect("/login");
};
