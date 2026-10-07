import AuthFeatureItem from "./AuthFeatureItem";
import { AUTH_FEATURES } from "./authFeatures";

/**
 * Frosted-glass card listing the product's three core features.
 * Decorative and non-interactive; falls back to solid white where backdrop-filter is unsupported.
 */
export default function AuthFeatureList() {
  return (
    <ul
      className="bg-white/85 supports-[not(backdrop-filter:blur(0))]:bg-white shadow-sm backdrop-blur-lg backdrop-saturate-140 py-2 border border-white/60 rounded-lg max-w-[440px] animate-auth-card"
    >
      {AUTH_FEATURES.map((feature, index) => (
        <AuthFeatureItem key={feature.title} feature={feature} index={index} />
      ))}
    </ul>
  );
}
