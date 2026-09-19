import { Mail } from "lucide-react";
import { GoogleIcon, LinkedInIcon } from "@/src/shared/ui/icons/SocialIcons";
import { SignupMethod } from "../types/user";

export function SignupMethodIcon({ method, className = "w-4 h-4" }: { method: SignupMethod; className?: string }) {
  if (method === "Google") return <GoogleIcon className={className} />;
  if (method === "LinkedIn") return <LinkedInIcon className={className} />;
  return <Mail size={16} strokeWidth={1.75} className={className} />;
}
