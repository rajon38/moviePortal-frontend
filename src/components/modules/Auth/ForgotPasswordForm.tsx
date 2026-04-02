"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { forgotPasswordAction } from "@/app/(commonLayout)/(auth)/forgot-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import AuthWrapper from "@/components/shared/AuthWrapper";

const ForgotPasswordForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload),
    });

    const form = useForm({
        defaultValues: {
            email: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);

            try {
                const result = await mutateAsync(value as IForgotPasswordPayload) as any;

                if (result?.success === false) {
                    setServerError(result.message || "Could not send reset code");
                }
            } catch (error: any) {
                setServerError(`Could not send reset code: ${error?.message || "Unknown error"}`);
            }
        },
    });

    return (
        <AuthWrapper>
            <Card className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">Forgot Password</CardTitle>
                    <CardDescription className="text-gray-400">
                        Enter your email to receive a reset code
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">

                        <form.Field name="email" validators={{ onChange: forgotPasswordZodSchema.shape.email }}>
                            {(field) => (
                                <AppField field={field} label="Email" type="email" />
                            )}
                        </form.Field>

                        {serverError && <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>}

                        <AppSubmitButton isPending={isPending}>
                            Send Reset Code
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </AuthWrapper>
    );
};

export default ForgotPasswordForm;