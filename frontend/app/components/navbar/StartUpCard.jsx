

// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";

// const StartUpCard = ({
//   title,
//   description,
//   buttonText,
//   navigatePath,
//   onClose
// }) => {

//   const router = useRouter();

//   return (
//     <div className="w-[320px] bg-custom-blue text-white p-8 flex flex-col justify-between rounded-r-xl">

//       <div>
//         <h3 className="text-xl font-anton font-normal mb-3 uppercase tracking-wider">
//           {title}
//         </h3>

//         <p className="text-sm opacity-90 mb-6">
//           {description}
//         </p>

//         <ul className="space-y-2 text-sm">
//           <li>✔ Fast Registration</li>
//           <li>✔ 100% Online</li>
//           <li>✔ Expert Support</li>
//           <li>✔ Affordable Pricing</li>
//         </ul>
//       </div>

//       <button
//         onClick={() => {
//           onClose?.();
//           router.push(navigatePath);
//         }}
//         className="mt-8 bg-white text-custom-blue font-bold py-3 rounded-full hover:scale-105 transition uppercase"
//       >
//         {buttonText}
//       </button>

//     </div>
//   );
// };

// export default StartUpCard;


"use client";
import React from "react";
import { useRouter } from "next/navigation";

const StartUpCard = ({
  title,
  description,
  buttonText,
  navigatePath,
  onClose,
}) => {

  const router = useRouter();

  const handleClick = () => {
    onClose?.();
    router.push(navigatePath);
  };

  return (
    <div
      className="
      w-full lg:w-[320px]
      bg-custom-blue text-white
      p-5 lg:p-8
      flex flex-col
      justify-between
      rounded-xl lg:rounded-r-xl
      mt-4 lg:mt-0
      "
    >
      <div>

        <h3 className="text-lg lg:text-xl font-anton mb-3 uppercase tracking-wide">
          {title}
        </h3>

        <p className="text-sm opacity-90 mb-4">
          {description}
        </p>

        <ul className="space-y-1 text-sm">
          <li>✔ Fast Registration</li>
          <li>✔ 100% Online</li>
          <li>✔ Expert Support</li>
          <li>✔ Affordable Pricing</li>
        </ul>

      </div>

      <button
        onClick={handleClick}
        className="
        mt-6
        bg-white text-custom-blue
        font-bold
        py-2 lg:py-3
        px-4
        rounded-full
        text-sm
        hover:scale-105
        transition
        w-full
        "
      >
        {buttonText}
      </button>

    </div>
  );
};

export default StartUpCard;