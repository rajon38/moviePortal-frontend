/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (payload: IForgotPasswordPayload): Promise<ApiErrorResponse | void> => {
    const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0]?.message || "Invalid input",
        };
    }

    try {
        await httpClient.post("/auth/forget-password", parsedPayload.data, {
            withAuthCookie: false,
        });

        redirect(`/reset-password?email=${encodeURIComponent(parsedPayload.data.email)}`);
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
            message: serverMessage || `Forgot password failed: ${error?.message || "Unknown error"}`,
        };
    }
};
