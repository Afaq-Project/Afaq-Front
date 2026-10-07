import AuthLayout from "@/src/feature/auth/components/AuthLayout";
import AuthVisualPanel from "@/src/feature/auth/components/AuthVisualPanel";
import SignupForm from "@/src/feature/auth/components/SignupForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      visual={
        <AuthVisualPanel
          headline="Find scholarships and internships that fit you"
          subline="Personalized matches, AI guidance, and every deadline in one place."
        />
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
