"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/src/shared/ui/Button";
import Input from "@/src/shared/ui/Input";
import Link from "next/link";
import FormHeader from "./FormHeader";
import SocialAuth from "./SocialAuth";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import {
  loginSchema,
  type LoginFormValues,
} from "@/src/shared/lib/validation/auth-schemas";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-1 justify-center items-center bg-white px-4 py-16">
      <div className="w-full max-w-md">
        <FormHeader />

        <form
          className="flex flex-col gap-4 mt-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {formError && (
            <p className="bg-danger-50 px-3 py-2 rounded-sm text-danger-800 text-sm">
              {formError}
            </p>
          )}

          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="font-medium text-neutral-800 text-xs"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-primary-600 text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full h-12 font-semibold text-base"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-neutral-200 border-t" />
          <span className="text-neutral-400 text-xs">Or sign in with</span>
          <div className="flex-1 border-neutral-200 border-t" />
        </div>

        <SocialAuth />

        <p className="pt-6 text-neutral-600 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
