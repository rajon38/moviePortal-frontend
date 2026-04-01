import LoginForm from "@/components/modules/Auth/LoginForm";
import React from "react";

interface LoginParams {
    searchParams : Promise<{redirect ?: string; error?: string}>
}

const LoginPage = async ({ searchParams } : LoginParams) => {
    const params = await searchParams;
    const redirectPath = params.redirect;
    const oauthError = params.error;
    return (
        <LoginForm redirectPath={redirectPath} oauthError={oauthError} />
    );
}

export default LoginPage;