import Image from "next/image";

export function HeroMedia() {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#F6F5F0]"
      aria-hidden="true"
    >
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-bottom opacity-90 mix-blend-multiply select-none"
      />
    </div>
  );
}
