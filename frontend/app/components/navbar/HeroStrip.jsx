"use client";

import { ArrowRight } from "lucide-react";

const HeroStrip = () => {
  return (
    <div className="hidden lg:block py-4 text-white">
      <h1 className="text-3xl font-anton font-normal tracking-wider">BRIEFCASSE</h1>
      <p className="text-lg mt-1 font-lato font-bold tracking-wide">
        The Legal Auto-Piolot For Your Bussiness
      </p>
      
        <button
              className="mt-2 inline-flex items-center px-6 py-2 rounded-full font-lato font-bold
                         bg-starttext text-custom-blue shadow 
                         hover:shadow-lg hover:scale-105 
                         transition-all duration-300"
            >
              START THE SERVICE
              <ArrowRight className="ml-2 w-7 h-7" />
            </button>
    </div>
  );
};

export default HeroStrip;


