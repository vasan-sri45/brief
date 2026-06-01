// import Link from "next/link";
// import {ArrowRight} from "lucide-react";

// export default function DashboardCard({
//   title,
//   value,
//   services,
// }) {
//   return (
//     <div className="min-w-[260px] bg-white rounded-xl shadow-lg px-6 py-7 flex flex-col">
//       <h3 className="text-lg text-custom-blue font-anton tracking-wider font-normal">
//         {title}
//       </h3>

//       <p className="mt-3 text-3xl font-semibold font-lato text-custom-blue">
//         {value}
//         <span className="text-base font-lato font-bold ml-2 text-letter1">
//           {services}
//         </span>
//       </p>

//       <Link
//         href="/admin/srv_form"
//         className="mt-6 text-[#F7631B] text-sm font-bold"
//       >
//         <button
              
//               className="mt-6 inline-flex items-center px-6 py-2 rounded-full font-anton font-normal tracking-wide
//                          bg-starttext text-white shadow 
//                          hover:shadow-lg hover:scale-105 
//                          transition-all duration-300"
//             >
//               View
//               <ArrowRight className="ml-2 w-6 h-6" />
//             </button>
//       </Link>
//     </div>
//   );
// }

import { ArrowRight } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  services,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-[210px]
        w-full

        border border-blue-100
        rounded-3xl
        ${active ? "bg-blue-50 ring-2 ring-blue-200" : "bg-white"}

        shadow-[0_10px_35px_rgba(37,99,235,0.08)]
        hover:shadow-[0_14px_45px_rgba(37,99,235,0.14)]

        p-6

        flex flex-col justify-between

        transition-all duration-300
        hover:-translate-y-1
      `}
    >

      {/* TOP CONTENT */}
      <div>

        <h3 className={`min-h-[52px] text-left text-lg font-semibold leading-snug ${active ? "text-blue-700" : "text-gray-500"}`}>
          {title}
        </h3>

        <div className="mt-5 flex items-end gap-2">

          <p className="text-5xl font-bold text-custom-blue leading-none">
            {value}
          </p>

          <span className="text-xl font-semibold text-gray-500 mb-1">
            {services}
          </span>

        </div>
      </div>

      {/* BUTTON */}
      <span
        className="
          w-full

          inline-flex items-center justify-center gap-3

          px-6 py-4

          rounded-2xl

          bg-gradient-to-r from-blue-600 to-indigo-600

          text-white
          text-lg
          font-semibold

          shadow-lg shadow-blue-200

          hover:scale-[1.02]

          transition-all duration-300
        "
      >

        View

        <ArrowRight className="w-5 h-5" />

      </span>

    </button>
  );
}
