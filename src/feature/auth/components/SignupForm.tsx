"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "@/src/shared/ui/Input";
import PasswordInput from "@/src/shared/ui/PasswordInput";
import AuthForm from "./AuthForm";
import TextLink from "./TextLink";
import { PRIVACY_HREF, TERMS_HREF } from "./authLinks";
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
    <AuthForm
      title="Sign up"
      subtitle="Create your account to start finding opportunities."
      onSubmit={handleSubmit(onSubmit)}
      beforeSubmit={
        <>
          By creating an account, you agree to our{" "}
          <TextLink href={TERMS_HREF} inline>
            Terms
          </TextLink>{" "}
          and{" "}
          <TextLink href={PRIVACY_HREF} inline>
            Privacy policy
          </TextLink>
        </>
      }
      submitLabel="Create account"
      submittingLabel="Creating account…"
      isSubmitting={isSubmitting}
      errorId="signup-error"
      error={formError}
      switchPrompt="Already have an account?"
      switchLabel="Sign in"
      switchHref="/login"
    >
      <div className="gap-4 grid grid-cols-2">
        <Input
          id="firstName"
          type="text"
          label="First name"
          autoComplete="given-name"
          placeholder="John"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          id="lastName"
          type="text"
          label="Last name"
          autoComplete="family-name"
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <Input
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordInput
        id="password"
        label="Password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
    </AuthForm>
  );
}
