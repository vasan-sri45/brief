// components/auth/FormFooter.jsx
"use client";
import { RiFacebookCircleFill, RiYoutubeFill } from "react-icons/ri";
import { FiInstagram } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import "./styles/formfooter.css";

const FormFooter = () => {
  return (
    <div className="flex items-center justify-center h-full gap-1.5 custom-class">
      {/* Social Buttons + Text */}
      <div className="flex items-center gap-2">
        {/* Social Media Buttons */}
        <div className="flex -space-x-2">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-inner flex justify-center items-center">
            <button aria-label="Instagram" className="text-custom-blue lg:text-lg">
              <FiInstagram />
            </button>
          </div>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-inner flex justify-center items-center">
            <button aria-label="Facebook" className="text-custom-blue lg:text-lg">
              <RiFacebookCircleFill />
            </button>
          </div>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-inner flex justify-center items-center">
            <button aria-label="YouTube" className="text-custom-blue lg:text-lg">
              <RiYoutubeFill />
            </button>
          </div>
        </div>
        <p className="text-custom-blue font-anton font-normal tracking-wider get-connected">
          Get Connected
        </p>
      </div>

      {/* Arrow Button */}
      <button
        aria-label="Go"
        type="button"
        className="w-9 h-9 lg:w-[60px] lg:h-[60px] xl:w-[68px] xl:h-[68px] rounded-full border-2 border-custom-blue mt-1 flex justify-center items-center text-custom-blue text-lg lg:text-3xl xl:text-4xl"
      >
        <MdArrowOutward />
      </button>
    </div>
  );
};

export default FormFooter;
