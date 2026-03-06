// "use client";
// import { useSelector } from "react-redux";
// import Image from "next/image";
// import TopBar from "./TopBar";
// import MegaMenu from "./MegaMenu";
// import HeroStrip from "./HeroStrip";

// const Navbar = () => {
//   const { user, hydrated } = useSelector((state) => state.auth);

//   if (!hydrated) return null;
//   if (!user || user.role !== "user") return null;

//   return (
//     <header
//       className="
//         relative
//         w-full
//         lg:max-w-[98vw]
//         mx-auto
//         mt-0 lg:mt-5
//         rounded-none lg:rounded-2xl
//         z-50
//         /* Set explicit height for desktop */
//         min-h-fit lg:h-[340px] xl:h-[321px]
//       "
//     >
//       {/* 🔵 MOBILE & TABLET BACKGROUND */}
//       <div className="absolute inset-0 bg-[#1E4484] lg:hidden -z-10" />

//       {/* 🖼️ DESKTOP BANNER IMAGE */}
//       <div className="absolute inset-0 hidden lg:block -z-10 bg-none">
//         <Image
//           // src="/assets/brief_banner.jpeg"
//           alt="Briefcasse banner"
//           fill
//           priority
//           /* Ensure image covers the full 150px height */
//           className=""
//         />
//       </div>

//       {/* Desktop overlay */}
//       <div className="absolute inset-0 hidden lg:block bg-black/10 -z-10 rounded-2xl" />

//       {/* CONTENT CONTAINER */}
//       <div className="relative h-full max-w-[1800px] mx-auto px-3 lg:px-6 flex flex-col justify-start">
//         {/* TopBar: Briefcasse & User Info */}
//         <TopBar />
        
//         {/* MegaMenu: Navigation links (Startup, IP, etc.) */}
//         <MegaMenu />
        
//         {/* HeroStrip: Breadcrumbs or extra info at the bottom of the 150px zone */}
//         <div className="mt-auto pb-2">
//           <HeroStrip />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import TopBar from "./TopBar";
import MegaMenu from "./MegaMenu";
import HeroStrip from "./HeroStrip";

const Navbar = () => {
  // const { user, hydrated } = useSelector((state) => state.auth);

  // if (!hydrated) return null;
  // if (!user || user.role !== "user") return null;

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
      {/* 🔵 MOBILE & TABLET BACKGROUND */}
      <div className="absolute inset-0 bg-custom-blue lg:hidden -z-10" />

      {/* 🖼️ DESKTOP BANNER IMAGE (OPTIONAL) */}
      {/* 👉 If you don’t want image, you can delete this block safely */}
      <div className="absolute inset-0 hidden lg:block -z-10">
        <Image
          src="/assets/navbarImage.png" 
          alt="Briefcasse banner"
          fill
          priority
          className=""
        />
      </div>

      {/* ❌ REMOVED dark overlay completely */}
      {/* ❌ NO bg-black/10 */}
      {/* ❌ NO gray layer */}

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
