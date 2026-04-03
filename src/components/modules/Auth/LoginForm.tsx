"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { loginAction } from "@/app/(commonLayout)/(auth)/login/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
  redirectPath?: string;
  oauthError?: string;
}

const LoginForm = ({ redirectPath, oauthError }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) =>
      loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }
      } catch (error: any) {
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 🎬 Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600"
          className="object-cover"
          alt="background"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* 🔥 Login Card */}
      <div className="relative w-full max-w-md bg-black/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
        
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          🎬 CinePlex
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Sign in to continue watching
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
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
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-red-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

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
                pendingLabel="Signing in..."
                disabled={!canSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Sign In
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

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full border-gray-600 text-red hover:bg-white/10 hover:text-red-400"
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const fallbackRedirect = "/dashboard";
            const nextRedirect = redirectPath || fallbackRedirect;

            window.location.href = `${baseUrl}/auth/login/google?redirect=${encodeURIComponent(
              nextRedirect
            )}`;
          }}
        >
          Sign in with Google
        </Button>

        {oauthError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              Google login failed: {oauthError}
            </AlertDescription>
          </Alert>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          New to CinePlex?{" "}
          <Link href="/register" className="text-red-500 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;