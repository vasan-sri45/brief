"use client";
import { useSelector } from "react-redux";
import { ArrowRight, Mail, Phone } from "lucide-react";
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
    <div className="hidden lg:flex py-4 text-white justify-between">
      <div>
      <h1 className="text-3xl font-anton font-normal tracking-wider">BRIEFCASSE</h1>
      <p className="text-lg mt-1 font-lato font-bold tracking-wide">
        The Legal Auto-Pilot For Your Business
      </p>
      
        <button
        onClick={handleService}
              className="mt-2 inline-flex items-center px-6 py-2 rounded-full font-lato font-bold
                         bg-starttext text-custom-blue shadow 
                         hover:shadow-lg hover:scale-105 
                         transition-all duration-300"
            >
              START THE SERVICE
              <ArrowRight className="ml-2 w-7 h-7" />
            </button>
      </div>
    
      <div className="hidden lg:flex items-center gap-6 mr-10 text-white text-xl font-medium">

  {/* Phone */}
  <div className="flex items-center gap-2">
    <Phone size={16} />
    <a href="tel:+919600606897" className="hover:underline">
      +91 9600606897
    </a>
  </div>

  {/* Divider */}
  <span className="text-white/70">|</span>

  {/* Email */}
  <div className="flex items-center gap-2">
    <Mail size={16} />
    <a href="mailto:admin@briefcasse.com" className="hover:underline">
      admin@briefcasse.com
    </a>
  </div>

</div>
    </div>
  );
};

export default HeroStrip;


