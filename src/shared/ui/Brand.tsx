import Image from "next/image";

export default function Brand() {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <span className="flex justify-center items-center">
        <Image
          src="/afaq.png"
          alt=""
          className="w-[50px] sm:w-[60px] h-[50px] sm:h-[60px]"
          width={60}
          height={60}
        />
      </span>
      <span className="font-extrabold text-primary-800 text-2xl sm:text-4xl">
        Afaq
      </span>
    </div>
  );
}
