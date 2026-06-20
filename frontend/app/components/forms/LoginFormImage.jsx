"use client";

import Image from "next/image";

export default function LoginFormImage() {
  return (
    <div className="hidden md:flex md:w-6/12 md:max-w-[550px] md:h-[700px] justify-center items-center">
      <div className="relative h-full w-full border-[3px] border-blue-600 rounded-3xl overflow-hidden bg-white">
        <Image
          src="/assets/blueDog.webp"
          alt="Briefcasse login illustration"
          fill
          priority
          unoptimized
          sizes="50vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
