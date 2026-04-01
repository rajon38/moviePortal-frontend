/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload): Promise<ApiErrorResponse | void> => {
    const parsedPayload = registerZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0]?.message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const { name, email, password } = parsedPayload.data;

        await httpClient.post("/auth/register", {
            name,
            email,
            password,
        }, {
            withAuthCookie: false,
        });

        redirect(`/verify-email?email=${encodeURIComponent(email)}`);
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
            message: serverMessage || `Registration failed: ${error?.message || "Unknown error"}`,
        };
    }
};
