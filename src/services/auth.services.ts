"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const getBaseApiUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

export async function getNewTokensWithRefreshToken(refreshToken  : string, sessionToken?: string) : Promise<boolean> {
    try {
        const baseApiUrl = getBaseApiUrl();

        if(!baseApiUrl){
            console.error("NEXT_PUBLIC_API_BASE_URL (or API_BASE_URL) is not defined");
            return false;
        }

        const cookieHeader = sessionToken
            ? `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`
            : `refreshToken=${refreshToken}`;

        const res = await fetch(`${baseApiUrl}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            }
        })
        if (!res.ok) {
            return false;
        }
        const {data} = await res.json();
        const { accessToken, refreshToken: newRefreshToken, token} = data;

        if (accessToken){
            await setTokenInCookies('accessToken', accessToken);
        }
        if (newRefreshToken){
            await setTokenInCookies('refreshToken', newRefreshToken);
        }
        if(token){
            await setTokenInCookies('better-auth.session_token', token, 24 * 60 * 60);
        }
        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    try {
        const baseApiUrl = getBaseApiUrl();

        if(!baseApiUrl){
            console.error("NEXT_PUBLIC_API_BASE_URL (or API_BASE_URL) is not defined");
            return null;
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${baseApiUrl}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error: unknown) {
        if (
            error &&
            typeof error === "object" &&
            "digest" in error &&
            typeof error.digest === "string" &&
            error.digest.includes("DYNAMIC_SERVER_USAGE")
        ) {
            return null;
        }

        console.error("Error fetching user info:", error);
        return null;
    }
}