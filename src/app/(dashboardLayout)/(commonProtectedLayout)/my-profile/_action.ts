/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { logoutAction as sharedLogoutAction } from "@/actions/auth.actions";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IUpdateProfileResponse, IUserProfile } from "@/types/auth.types";
import { IUpdateProfilePayload, updateProfileZodSchema } from "@/zod/auth.validation";

export const updateProfileAction = async (payload: IUpdateProfilePayload): Promise<IUpdateProfileResponse | ApiErrorResponse> => {
    const parsedPayload = updateProfileZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0]?.message || "Invalid input",
        };
    }

    try {
        const response = await httpClient.patch<IUpdateProfileResponse>("/auth/updateProfile", {
            name: parsedPayload.data.name,
            image: parsedPayload.data.image || undefined,
        });

        return response.data;
    } catch (error: any) {
        const serverMessage = error?.response?.data?.message;

        return {
            success: false,
            message: serverMessage || `Update profile failed: ${error?.message || "Unknown error"}`,
        };
    }
};

export const logoutAction = async (): Promise<void> => {
    await sharedLogoutAction();
};

export const getMyProfileAction = async (): Promise<IUserProfile | null> => {
    try {
        const response = await httpClient.get<IUserProfile>("/auth/me");
        return response.data;
    } catch (error) {
        console.error("Failed to load profile:", error);
        return null;
    }
};
