/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (payload: IVerifyEmailPayload): Promise<ApiErrorResponse | void> => {
    const parsedPayload = verifyEmailZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0]?.message || "Invalid input",
        };
    }

    try {
        await httpClient.post("/auth/verify-email", parsedPayload.data, {
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
            message: serverMessage || `Email verification failed: ${error?.message || "Unknown error"}`,
        };
    }
};
