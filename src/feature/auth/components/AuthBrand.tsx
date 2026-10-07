import Image from "next/image";

/** Compact logo + wordmark used on the auth pages. */
export default function AuthBrand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/afaq.png" alt="" width={32} height={32} priority />
      <span className="font-semibold text-primary-800 text-h2">Afaq</span>
    </div>
  );
}
