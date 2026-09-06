import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Link from "next/link";
import FormHeader from "./FormHeader";
import SocialAuth from "./SocialAuth";
export default function LoginForm() {
  return (
    <div className="flex flex-1 justify-center items-center bg-white px-4 py-16">
      <div className="w-full max-w-md">
        <FormHeader />

        <form className="flex flex-col gap-4 mt-8">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="name@example.com"
            required
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="font-medium text-neutral-800 text-xs"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-primary-600 text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full h-12 font-semibold text-base"
          >
            Login
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-neutral-200 border-t" />
          <span className="text-neutral-400 text-xs">Or sign in with</span>
          <div className="flex-1 border-neutral-200 border-t" />
        </div>

        <SocialAuth />

        <p className="pt-6 text-neutral-600 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
