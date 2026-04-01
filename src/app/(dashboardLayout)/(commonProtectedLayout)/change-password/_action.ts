/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const changePasswordAction = async (payload: IChangePasswordPayload): Promise<ApiErrorResponse | void> => {
    const parsedPayload = changePasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0]?.message || "Invalid input",
        };
    }

    try {
        await httpClient.post("/auth/change-password", {
            currentPassword: parsedPayload.data.currentPassword,
            newPassword: parsedPayload.data.newPassword,
        });

        redirect("/my-profile");
    } catch (error: any) {
        if (
            error &&
            typeof error === "object" &&
            "digest" in error &&
            typeof error.digest === "string" &&
            error.digest.startsWith("NEXT_REDIRECT")
        ) {
            throw error;
        }

        const serverMessage = error?.response?.data?.message;

        return {
            success: false,
            message: serverMessage || `Change password failed: ${error?.message || "Unknown error"}`,
        };
    }
};
