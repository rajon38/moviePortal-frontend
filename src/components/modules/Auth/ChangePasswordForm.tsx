"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { changePasswordAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/change-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

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
        <Card className="w-full max-w-xl mx-auto shadow-md">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password securely.</CardDescription>
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
                    <form.Field name="currentPassword" validators={{ onChange: changePasswordZodSchema.shape.currentPassword }}>
                        {(field) => (
                            <AppField field={field} label="Current Password" type="password" placeholder="Enter current password" />
                        )}
                    </form.Field>

                    <form.Field name="newPassword" validators={{ onChange: changePasswordZodSchema.shape.newPassword }}>
                        {(field) => (
                            <AppField field={field} label="New Password" type="password" placeholder="Enter new password" />
                        )}
                    </form.Field>

                    <form.Field name="confirmPassword" validators={{ onChange: changePasswordZodSchema.shape.confirmPassword }}>
                        {(field) => (
                            <AppField field={field} label="Confirm New Password" type="password" placeholder="Re-enter new password" />
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
                                pendingLabel="Saving..."
                                disabled={!canSubmit}
                            >
                                Save Password
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangePasswordForm;
