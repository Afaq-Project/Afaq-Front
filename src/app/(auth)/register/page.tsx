import AuthLayout from "@/src/feature/auth/components/AuthLayout";
import AuthVisualPanel from "@/src/feature/auth/components/AuthVisualPanel";
import SignupForm from "@/src/feature/auth/components/SignupForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      visual={
        <AuthVisualPanel variant="register" />
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
