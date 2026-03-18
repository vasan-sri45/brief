"use client";
import { useSelector } from "react-redux";
import Image from "next/image";
import TopBar from "./TopBar";
import MegaMenu from "./MegaMenu";
import HeroStrip from "./HeroStrip";

const Navbar = () => {
  
  return (
    <header
      className="
        relative
        w-full
        lg:max-w-[98vw]
        mx-auto
        mt-0 lg:mt-5
        rounded-none lg:rounded-2xl
        z-50
        bg-white
        min-h-fit lg:h-[340px] xl:h-[321px]
        overflow-hidden
      "
    >
      
      <div className="absolute inset-0 bg-custom-blue lg:hidden -z-10" />

      <div className="absolute inset-0 hidden lg:block -z-10">
        <Image
          src="/assets/brief_banner2.png" 
          alt="Briefcasse banner"
          fill
          priority
          className=""
        />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative h-full max-w-[1800px] mx-auto px-3 lg:px-6 flex flex-col justify-start">
        {/* TopBar */}
        <TopBar />

        {/* MegaMenu */}
        <MegaMenu />

        {/* HeroStrip */}
        <div className="mt-auto pb-2">
          <HeroStrip />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
