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
        <AuthVisualPanel
          headline="Your next opportunity is waiting"
          subline="Personalized matches, AI guidance, and every deadline in one place."
        />
      }
    >
      <ResetPasswordForm token={typeof token === "string" && token ? token : null} />
    </AuthLayout>
  );
}
