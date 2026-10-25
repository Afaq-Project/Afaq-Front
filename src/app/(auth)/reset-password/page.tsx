import AuthLayout from "@/src/feature/auth/components/AuthLayout";
import AuthVisualPanel from "@/src/feature/auth/components/AuthVisualPanel";
import ResetPasswordForm from "@/src/feature/auth/components/ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

/** Opened from the reset email: /reset-password?token=… */
export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <AuthLayout
      visual={
        <AuthVisualPanel />
      }
    >
      <ResetPasswordForm token={typeof token === "string" && token ? token : null} />
    </AuthLayout>
  );
}
