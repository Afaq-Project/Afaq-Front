export default function Brand() {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <span className="flex justify-center items-center">
        <img
          src="/afaq.png"
          alt=""
          className="w-[25px] sm:w-[50px] h-[25px] sm:h-[50px]"
          width={50}
          height={50}
        />
      </span>
      <span className="font-extrabold text-primary-800 text-2xl sm:text-3xl">
        Afaq
      </span>
    </div>
  );
}
