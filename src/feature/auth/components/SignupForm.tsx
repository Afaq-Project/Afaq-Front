"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/src/shared/ui/Button";
import Input from "@/src/shared/ui/Input";
import PasswordInput from "@/src/shared/ui/PasswordInput";
import Link from "next/link";
import FormHeader from "./FormHeader";
import SocialAuth from "./SocialAuth";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/src/shared/lib/validation/auth-schemas";

export default function SignupForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    try {
      await registerUser(values);
      router.push("/onboarding/step-1");
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

          <div className="gap-4 grid grid-cols-2">
            <Input
              id="firstName"
              type="text"
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              id="lastName"
              type="text"
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="flex flex-col gap-1.5">
            <PasswordInput
              id="password"
              label="Password"
              error={errors.password?.message}
              {...register("password")}
            />
            <p className="text-neutral-400 text-xs">
              Must be at least 8 characters, with a letter and a number
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full h-12 font-semibold text-base"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-neutral-200 border-t" />
          <span className="text-neutral-400 text-xs">Or register via</span>
          <div className="flex-1 border-neutral-200 border-t" />
        </div>

        <SocialAuth />

        <p className="mt-6 text-neutral-600 text-sm text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
