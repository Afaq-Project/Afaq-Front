import Button from "@/src/shared/ui/Button";
import { GoogleIcon, LinkedInIcon } from "@/src/shared/ui/icons/SocialIcons";

// TODO: no OAuth handlers exist yet — wire onClick to the Google/LinkedIn flows when available.
export default function SocialAuthButtons() {
  return (
    <div>
      <div className="flex items-center gap-3 my-8 short:my-4">
        <div className="flex-1 border-neutral-100 border-t" />
        <span className="text-caption text-neutral-600">Or continue with</span>
        <div className="flex-1 border-neutral-100 border-t" />
      </div>

      <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
        <Button type="button" variant="secondary" className="rounded-md! w-full">
          <GoogleIcon className="w-5 h-5" />
          Google
        </Button>
        <Button type="button" variant="secondary" className="rounded-md! w-full">
          <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
