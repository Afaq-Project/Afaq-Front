"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";

import Button from "@/src/shared/ui/Button";
import Input from "@/src/shared/ui/Input";
import {
  updatePasswordSchema,
  type UpdatePasswordFormValues,
} from "@/src/shared/lib/validation/auth-schemas";

export function SecurityPasswordCard() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = () => {
    reset();
    setSuccessMessage("Your password has been updated.");
  };

  return (
    <div className="bg-white shadow-sm p-5 border border-neutral-100 rounded-lg h-full">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="flex justify-center items-center bg-primary-50 rounded-md w-9 h-9 text-primary-700">
          <Lock size={18} strokeWidth={1.75} />
        </span>
        <h2 className="font-semibold text-neutral-900 text-body">
          Security & Password
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => setSuccessMessage(null)}
        noValidate
        className="flex flex-col gap-4"
      >
        {successMessage && (
          <p className="bg-success-50 px-3 py-2 rounded-sm text-success-800 text-sm">
            {successMessage}
          </p>
        )}

        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <Input
            id="currentPassword"
            type="password"
            label="Current Password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <Input
            id="newPassword"
            type="password"
            label="New Password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
