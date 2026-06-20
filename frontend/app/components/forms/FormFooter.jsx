// components/auth/FormFooter.jsx
"use client";
import { RiFacebookCircleFill, RiYoutubeFill } from "react-icons/ri";
import { FiInstagram } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import "./styles/formfooter.css";

const socialLinks = {
  instagram:
    "https://www.instagram.com/briefcasse_?igsh=bGQ3MnhvNnRxa3M3&utm_source=qr",
  facebook: "https://www.facebook.com/share/14ntuxkHGuT/?mibextid=wwXIfr",
  youtube: "https://youtube.com/@briefcasse?si=pZhvMj-20eOo7jv6",
};

const FormFooter = () => {
  return (
    <div className="flex items-center justify-center h-full gap-1.5 custom-class">
      {/* Social Buttons + Text */}
      <div className="flex items-center gap-2">
        {/* Social Media Buttons */}
        <div className="flex -space-x-2">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-inner flex justify-center items-center">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-custom-blue lg:text-lg"
            >
              <FiInstagram />
            </a>
          </div>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-inner flex justify-center items-center">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-custom-blue lg:text-lg"
            >
              <RiFacebookCircleFill />
            </a>
          </div>
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-inner flex justify-center items-center">
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-custom-blue lg:text-lg"
            >
              <RiYoutubeFill />
            </a>
          </div>
        </div>
        <p className="text-white font-anton font-normal tracking-wider get-connected">
          Get Connected
        </p>
      </div>

      {/* Arrow Button */}
      <button
        aria-label="Go"
        type="button"
        className="w-9 h-9 lg:w-[60px] lg:h-[60px] xl:w-[68px] xl:h-[68px] rounded-full border-2 border-white mt-1 flex justify-center items-center text-white text-lg lg:text-3xl xl:text-4xl"
      >
        <MdArrowOutward />
      </button>
    </div>
  );
};

export default FormFooter;
