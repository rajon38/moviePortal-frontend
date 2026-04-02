"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { resetPasswordAction } from "@/app/(commonLayout)/(auth)/reset-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import AuthWrapper from "@/components/shared/AuthWrapper";

interface ResetPasswordFormProps {
    email?: string;
}

const ResetPasswordForm = ({ email = "" }: ResetPasswordFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload),
    });

    const form = useForm({
        defaultValues: {
            email,
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);

            try {
                const result = await mutateAsync(value as IResetPasswordPayload) as any;

                if (result?.success === false) {
                    setServerError(result.message || "Reset password failed");
                }
            } catch (error: any) {
                setServerError(`Reset password failed: ${error?.message || "Unknown error"}`);
            }
        },
    });

     return (
        <AuthWrapper>
            <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-white">Reset Password</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">

                        <form.Field name="email">{(f) => <AppField field={f} label="Email" />}</form.Field>
                        <form.Field name="otp">{(f) => <AppField field={f} label="OTP" />}</form.Field>
                        <form.Field name="newPassword">{(f) => <AppField field={f} label="New Password" type="password" />}</form.Field>
                        <form.Field name="confirmPassword">{(f) => <AppField field={f} label="Confirm Password" type="password" />}</form.Field>

                        {serverError && <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>}

                        <AppSubmitButton isPending={isPending}>
                            Reset Password
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </AuthWrapper>
    );
};

export default ResetPasswordForm;