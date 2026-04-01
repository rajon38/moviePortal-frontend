"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { logoutAction, updateProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IUserProfile } from "@/types/auth.types";
import { IUpdateProfilePayload, updateProfileZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface MyProfileFormProps {
    user: IUserProfile;
}

const MyProfileForm = ({ user }: MyProfileFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IUpdateProfilePayload) => updateProfileAction(payload),
    });

    const { mutateAsync: logoutMutate, isPending: isLogoutPending } = useMutation({
        mutationFn: () => logoutAction(),
    });

    const form = useForm({
        defaultValues: {
            name: user.name || "",
            image: user.image || "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setServerSuccess(null);

            try {
                const result = await mutateAsync(value as IUpdateProfilePayload) as any;

                if (result?.success === false) {
                    setServerError(result.message || "Profile update failed");
                    return;
                }

                setServerSuccess("Profile updated successfully");
            } catch (error: any) {
                setServerError(`Profile update failed: ${error?.message || "Unknown error"}`);
            }
        },
    });

    return (
        <Card className="w-full max-w-xl mx-auto shadow-md">
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your account details.</CardDescription>
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
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-medium">{user.role}</p>
                        </div>
                    </div>

                    <form.Field name="name" validators={{ onChange: updateProfileZodSchema.shape.name }}>
                        {(field) => (
                            <AppField field={field} label="Name" type="text" placeholder="Enter your name" />
                        )}
                    </form.Field>

                    <form.Field name="image">
                        {(field) => (
                            <AppField field={field} label="Image URL" type="text" placeholder="https://example.com/avatar.png" />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    {serverSuccess && (
                        <Alert>
                            <AlertDescription>{serverSuccess}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton
                                isPending={isSubmitting || isPending}
                                pendingLabel="Saving..."
                                disabled={!canSubmit}
                            >
                                Save Profile
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>

            <CardFooter className="justify-end border-t pt-4">
                <Button
                    variant="outline"
                    onClick={async () => {
                        await logoutMutate();
                    }}
                    disabled={isLogoutPending}
                >
                    {isLogoutPending ? "Logging out..." : "Logout"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default MyProfileForm;
