// "use client";
// import React from 'react'

// const StartUpCard = ({ onClose, onNavigate,  title, description, buttonText, }) => {
//   return (
//     <div className="w-[320px] bg-custom-blue text-white p-8 flex flex-col justify-between rounded-r-xl">

//               <div>
//                 <h3 className="text-xl font-anton font-normal mb-3 uppercase tracking-wider">
//                   {title}
//                 </h3>

//                 <p className="text-sm opacity-90 mb-6">
//                   Register your company quickly with expert legal support.
//                 </p>

//                 <ul className="space-y-2 text-sm">
//                   <li>✔ Fast Registration</li>
//                   <li>✔ 100% Online</li>
//                   <li>✔ Expert Support</li>
//                   <li>✔ Affordable Pricing</li>
//                 </ul>
//               </div>

//               <button
//                 onClick={() => {
//                   onClose?.();
//           onNavigate?.();
//                 }}
//                 className="mt-8 bg-white text-custom-blue font-bold py-3 rounded-full hover:scale-105 transition uppercase"
//               >
//                 {buttonText}
//               </button>
//             </div>
//   )
// }

// export default StartUpCard

"use client";
import React from "react";
import { useRouter } from "next/navigation";

const StartUpCard = ({
  title,
  description,
  buttonText,
  navigatePath,
  onClose
}) => {

  const router = useRouter();

  return (
    <div className="w-[320px] bg-custom-blue text-white p-8 flex flex-col justify-between rounded-r-xl">

      <div>
        <h3 className="text-xl font-anton font-normal mb-3 uppercase tracking-wider">
          {title}
        </h3>

        <p className="text-sm opacity-90 mb-6">
          {description}
        </p>

        <ul className="space-y-2 text-sm">
          <li>✔ Fast Registration</li>
          <li>✔ 100% Online</li>
          <li>✔ Expert Support</li>
          <li>✔ Affordable Pricing</li>
        </ul>
      </div>

      <button
        onClick={() => {
          onClose?.();
          router.push(navigatePath);
        }}
        className="mt-8 bg-white text-custom-blue font-bold py-3 rounded-full hover:scale-105 transition uppercase"
      >
        {buttonText}
      </button>

    </div>
  );
};

export default StartUpCard;