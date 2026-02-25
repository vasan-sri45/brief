"use client";
import { useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


const HeroStrip = () => {

    const { user } = useSelector((state) => state.auth);
  const router = useRouter();

   const handleService = () => {

    if(user){
      router.push(`/user/contact`);
    }else{
      router.push(`/login`);
    }
  };
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


