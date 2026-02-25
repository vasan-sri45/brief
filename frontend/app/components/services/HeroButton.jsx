import React from 'react';
import { ArrowRight } from "lucide-react";

const HeroButton = ({handleStartService}) => {
  return (
    <button
              onClick={handleStartService}
              className="mt-6 inline-flex items-center px-6 py-2 rounded-full font-lato font-bold
                         bg-starttext text-custom-blue shadow 
                         hover:shadow-lg hover:scale-105 
                         transition-all duration-300"
            >
              START THE SERVICE
              <ArrowRight className="ml-2 w-5 h-5" />
    </button>
  )
}

export default HeroButton;