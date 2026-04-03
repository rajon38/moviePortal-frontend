"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { registerAction } from "@/app/(commonLayout)/(auth)/register/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = (await mutateAsync(value as IRegisterPayload)) as any;

        if (result?.success === false) {
          setServerError(result.message || "Registration failed");
        }
      } catch (error: any) {
        setServerError(
          `Registration failed: ${error?.message || "Unknown error"}`
        );
      }
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 🎬 Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1600"
          className="object-cover"
          alt="background"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* 🧊 Glass Card */}
      <div className="relative w-full max-w-md bg-black/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          🎬 CinePlex
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Create your account to start streaming
        </p>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: registerZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-white" />
                    ) : (
                      <Eye className="size-4 text-white" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: registerZodSchema.shape.confirmPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                append={
                  <Button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((v) => !v)
                    }
                    variant="ghost"
                    size="icon"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4 text-white" />
                    ) : (
                      <Eye className="size-4 text-white" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Creating account..."
                disabled={!canSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Up
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="border-t border-gray-700"></div>
          <p className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-2 text-sm text-gray-400">
            OR
          </p>
        </div>

        {/* Google Register */}
        <Button
          variant="outline"
          className="w-full border-gray-600 text-red-500 hover:bg-white/10 hover:text-white"
        >
          Continue with Google
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-red-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;