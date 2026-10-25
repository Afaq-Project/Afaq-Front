import AuthLayout from "@/src/feature/auth/components/AuthLayout";
import AuthVisualPanel from "@/src/feature/auth/components/AuthVisualPanel";
import ForgotPasswordForm from "@/src/feature/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      visual={
        <AuthVisualPanel />
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
