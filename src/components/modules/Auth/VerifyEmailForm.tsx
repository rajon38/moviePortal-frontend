"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { verifyEmailAction } from "@/app/(commonLayout)/(auth)/verify-email/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IVerifyEmailPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import AuthWrapper from "@/components/shared/AuthWrapper";

interface VerifyEmailFormProps {
    email?: string;
}

const VerifyEmailForm = ({ email = "" }: VerifyEmailFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload),
    });

    const form = useForm({
        defaultValues: {
            email,
            otp: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);

            try {
                const result = await mutateAsync(value as IVerifyEmailPayload) as any;

                if (result?.success === false) {
                    setServerError(result.message || "Email verification failed");
                }
            } catch (error: any) {
                setServerError(`Email verification failed: ${error?.message || "Unknown error"}`);
            }
        },
    });

    return (
        <AuthWrapper>
            <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-white">Verify Email</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">

                        <form.Field name="email">{(f) => <AppField field={f} label="Email" />}</form.Field>
                        <form.Field name="otp">{(f) => <AppField field={f} label="OTP" />}</form.Field>

                        {serverError && <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>}

                        <AppSubmitButton isPending={isPending}>
                            Verify Email
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </AuthWrapper>
    );
};

export default VerifyEmailForm;
