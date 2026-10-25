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
import { useTranslations } from "next-intl";
import { useErrorText } from "@/src/shared/lib/validation/useErrorText";


export default function SignupForm() {
  const t = useTranslations("auth");
  const errorText = useErrorText();
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
      title={t("signup.title")}
      subtitle={t("signup.subtitle")}
      onSubmit={handleSubmit(onSubmit)}
      beforeSubmit={
        t.rich("signup.consent", {
          terms: (chunks) => (
            <TextLink href={TERMS_HREF} inline>
              {chunks}
            </TextLink>
          ),
          privacy: (chunks) => (
            <TextLink href={PRIVACY_HREF} inline>
              {chunks}
            </TextLink>
          ),
        })
      }
      submitLabel={t("signup.submit")}
      submittingLabel={t("signup.submitting")}
      isSubmitting={isSubmitting}
      errorId="signup-error"
      error={formError}
      switchPrompt={t("signup.haveAccount")}
      switchLabel={t("signup.signIn")}
      switchHref="/login"
    >
      <div className="gap-4 grid grid-cols-2">
        <Input
          id="firstName"
          type="text"
          label={t("signup.firstName")}
          autoComplete="given-name"
          placeholder={t("signup.firstNamePlaceholder")}
          error={errorText(errors.firstName?.message)}
          {...register("firstName")}
        />
        <Input
          id="lastName"
          type="text"
          label={t("signup.lastName")}
          autoComplete="family-name"
          placeholder={t("signup.lastNamePlaceholder")}
          error={errorText(errors.lastName?.message)}
          {...register("lastName")}
        />
      </div>

      <Input
        id="email"
        type="email"
        label={t("email")}
        autoComplete="email"
        placeholder={t("emailPlaceholder")}
        error={errorText(errors.email?.message)}
        {...register("email")}
      />

      <PasswordInput
        id="password"
        label={t("password")}
        autoComplete="new-password"
        error={errorText(errors.password?.message)}
        {...register("password")}
      />
    </AuthForm>
  );
}
