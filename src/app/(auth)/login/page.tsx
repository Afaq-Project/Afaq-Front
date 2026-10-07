import AuthLayout from "@/src/feature/auth/components/AuthLayout";
import AuthVisualPanel from "@/src/feature/auth/components/AuthVisualPanel";
import LoginForm from "@/src/feature/auth/components/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ session?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // TODO: nothing sets this yet — the axios-client 401 redirect should send
  // users to /login?session=expired so this banner shows.
  const { session } = await searchParams;

  return (
    <AuthLayout
      visual={
        <AuthVisualPanel
          headline="Your next opportunity is waiting"
          subline="Personalized matches, AI guidance, and every deadline in one place."
        />
      }
    >
      <LoginForm sessionExpired={session === "expired"} />
    </AuthLayout>
  );
}
