"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { changePasswordAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/change-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IChangePasswordPayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import AuthWrapper from "@/components/shared/AuthWrapper";

const ChangePasswordForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IChangePasswordPayload) => changePasswordAction(payload),
    });

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);

            try {
                const result = await mutateAsync(value as IChangePasswordPayload) as any;

                if (result?.success === false) {
                    setServerError(result.message || "Change password failed");
                }
            } catch (error: any) {
                setServerError(`Change password failed: ${error?.message || "Unknown error"}`);
            }
        },
    });

    return (
        <AuthWrapper>
            <Card className="w-full max-w-xl mx-auto bg-black/60 backdrop-blur-xl border border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Change Password</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">

                        <form.Field name="currentPassword">{(f) => <AppField field={f} label="Current Password" type="password" />}</form.Field>
                        <form.Field name="newPassword">{(f) => <AppField field={f} label="New Password" type="password" />}</form.Field>
                        <form.Field name="confirmPassword">{(f) => <AppField field={f} label="Confirm Password" type="password" />}</form.Field>

                        {serverError && <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>}

                        <AppSubmitButton isPending={isPending}>
                            Save Password
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </AuthWrapper>
    );
};

export default ChangePasswordForm;