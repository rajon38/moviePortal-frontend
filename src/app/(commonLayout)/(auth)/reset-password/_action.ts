/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (payload: IResetPasswordPayload): Promise<ApiErrorResponse | void> => {
    const parsedPayload = resetPasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0]?.message || "Invalid input",
        };
    }

    try {
        await httpClient.post("/auth/reset-password", {
            email: parsedPayload.data.email,
            otp: parsedPayload.data.otp,
            newPassword: parsedPayload.data.newPassword,
        }, {
            withAuthCookie: false,
        });

        redirect("/login");
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
            message: serverMessage || `Reset password failed: ${error?.message || "Unknown error"}`,
        };
    }
};
