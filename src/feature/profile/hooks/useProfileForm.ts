import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/src/shared/lib/validation/profile-schemas";
import type { UserProfile } from "../types";

export function useProfileForm(
  currentProfile: UserProfile,
  onSave?: (data: UserProfile) => Promise<void> | void,
) {
  const form = useForm<UserProfile>({
    resolver: zodResolver(profileSchema) as unknown as Resolver<UserProfile>,
    values: currentProfile,
    mode: "onBlur",
  });

  const handleSave = form.handleSubmit(async (validatedValues) => {
    if (onSave) {
      await onSave(validatedValues);
    }
  });

  return {
    form,
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    handleSave,
    setValue: form.setValue,
    reset: form.reset,
  };
}
