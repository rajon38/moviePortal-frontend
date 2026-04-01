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
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                    Enter OTP and your new password.
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
                    <form.Field name="email" validators={{ onChange: resetPasswordZodSchema.shape.email }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                            />
                        )}
                    </form.Field>

                    <form.Field name="otp" validators={{ onChange: resetPasswordZodSchema.shape.otp }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="OTP"
                                type="text"
                                placeholder="Enter 6-digit OTP"
                            />
                        )}
                    </form.Field>

                    <form.Field name="newPassword" validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="New Password"
                                type="password"
                                placeholder="Enter new password"
                            />
                        )}
                    </form.Field>

                    <form.Field name="confirmPassword" validators={{ onChange: resetPasswordZodSchema.shape.confirmPassword }}>
                        {(field) => (
                            <AppField
                                field={field}
                                label="Confirm Password"
                                type="password"
                                placeholder="Re-enter new password"
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
                                pendingLabel="Updating password..."
                                disabled={!canSubmit}
                            >
                                Reset Password
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

export default ResetPasswordForm;
