import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Link from "next/link";
import FormHeader from "./FormHeader";
import SocialAuth from "./SocialAuth";

export default function SignupForm() {
  return (
    <div className="flex flex-1 justify-center items-center bg-white px-4 py-16">
      <div className="w-full max-w-md">
        <FormHeader />
        <form className="flex flex-col gap-4 mt-8">
          <Input
            id="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            required
          />

          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="name@company.com"
            required
          />

          <div className="flex flex-col gap-1.5">
            <Input
              id="password"
              type="password"
              label="Password"
              minLength={8}
              required
            />
            <p className="text-neutral-400 text-xs">
              Must be at least 8 characters
            </p>
          </div>

          <Button
            type="submit"
            className="mt-2 w-full h-12 font-semibold text-base"
          >
            Create Account
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-neutral-200 border-t" />
          <span className="text-neutral-400 text-xs">Or register via</span>
          <div className="flex-1 border-neutral-200 border-t" />
        </div>

        <SocialAuth />

        <p className="mt-6 text-neutral-600 text-sm text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
