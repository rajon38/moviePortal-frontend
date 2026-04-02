"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { logoutAction, updateProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IUserProfile } from "@/types/auth.types";
import { IUpdateProfilePayload } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useState } from "react";
import AuthWrapper from "@/components/shared/AuthWrapper";

interface MyProfileFormProps {
    user: IUserProfile;
}

const MyProfileForm = ({ user }: MyProfileFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(user.image || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
                const payload: any = { ...value };
                
                // Handle file upload if a new file was selected
                if (selectedFile) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        payload.image = e.target?.result as string;
                        const result = await mutateAsync(payload as IUpdateProfilePayload) as any;
                        
                        if (result && typeof result === 'object' && 'success' in result && result.success === false) {
                            setServerError(result.message || "Profile update failed");
                            return;
                        }
                        setServerSuccess("Profile updated successfully");
                    };
                    reader.readAsDataURL(selectedFile);
                } else {
                    const result = await mutateAsync(payload as IUpdateProfilePayload) as any;
                    
                    if (result && typeof result === 'object' && 'success' in result && result.success === false) {
                        setServerError(result.message || "Profile update failed");
                        return;
                    }
                    setServerSuccess("Profile updated successfully");
                }
            } catch (error: any) {
                setServerError(`Profile update failed: ${error?.message || "Unknown error"}`);
            }
        },
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name: string, email: string) => {
        if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        return email[0].toUpperCase();
    };

    return (
        <AuthWrapper>
            <Card className="w-full max-w-xl mx-auto bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">My Profile</CardTitle>
                    <CardDescription className="text-gray-400">Manage your account details and profile picture.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">

                        {/* Profile Picture Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-red-400">Profile Picture</h3>
                            
                            {/* Image Preview */}
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-2 border-slate-700">
                                    <AvatarImage src={imagePreview} alt={user.name || "User"} />
                                    <AvatarFallback className="bg-red-600 text-white text-lg">
                                        {getInitials(user.name || "", user.email || "")}
                                    </AvatarFallback>
                                </Avatar>
                                
                                {/* File Upload */}
                                <div className="flex-1">
                                    <label htmlFor="image-input" className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800 px-6 py-8 cursor-pointer hover:border-red-500 hover:bg-slate-800/80 transition-colors">
                                        <Upload className="h-5 w-5 text-gray-400" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-white">Upload Image</p>
                                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </label>
                                    <input
                                        id="image-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {selectedFile && (
                                <p className="text-xs text-gray-400">
                                    Selected: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {/* User Info Section */}
                        <div className="space-y-2 rounded-lg bg-slate-800 p-4 border border-slate-700">
                            <div className="text-sm">
                                <p className="text-gray-400">Email</p>
                                <p className="font-medium text-white">{user.email}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-gray-400">Role</p>
                                <p className="font-medium text-white">{user.role}</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <form.Field name="name">{(f) => <AppField field={f} label="Name" placeholder="Enter your name" />}</form.Field>

                        {serverError && <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>}
                        {serverSuccess && <Alert className="bg-green-900 border-green-800"><AlertDescription className="text-green-200">{serverSuccess}</AlertDescription></Alert>}

                        <AppSubmitButton isPending={isPending} pendingLabel="Saving...">
                            Save Profile
                        </AppSubmitButton>
                    </form>
                </CardContent>
            </Card>
        </AuthWrapper>
    );
};

export default MyProfileForm;