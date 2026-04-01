"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { verifyEmailAction } from "@/app/(commonLayout)/(auth)/verify-email/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

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
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
                <CardDescription>
                    Enter the 6-digit OTP sent to your email.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="email" validators={{ onChange: verifyEmailZodSchema.shape.email }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        )}
                    </form.Field>

                    <form.Field name="otp" validators={{ onChange: verifyEmailZodSchema.shape.otp }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="OTP"
                                type="text"
                                placeholder="Enter 6-digit OTP"
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Verifying..."
                                disabled={!canSubmit}
                            >
                                Verify Email
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4 text-sm text-muted-foreground">
                Back to{" "}
                <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
                    Sign in
                </Link>
            </CardFooter>
        </Card>
    );
};

export default VerifyEmailForm;
