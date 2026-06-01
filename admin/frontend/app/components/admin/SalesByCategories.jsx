// "use client";

// export default function SalesByCategories({ revenueData = {} }) {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border-3 border-custom-blue">
//       <h3 className="font-anton text-lg font-normal tracking-wider text-custom-blue mb-4">
//         Monthly Revenue by Service
//       </h3>

//       <ul className="space-y-3">
//         {Object.entries(revenueData).map(([title, value]) => (
//           <li key={title} className="flex justify-between font-lato text-md font-bold text-letter1 tracking-wide">
//             <span>{title}</span>
//             <span className="font-bold text-startbtn">
//               ₹ {value.toLocaleString()}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

const CATEGORY_LABELS = [
  "Startup",
  "Intellectual Property",
  "Tax Filing",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services",
];

export default function SalesByCategories({
  revenueData = {},
  selectedCategory,
  onSelect,
}) {
  return (
    <div
      className="
        w-full
        h-[350px]

        bg-white
        border border-blue-100
        rounded-3xl

        shadow-[0_10px_35px_rgba(37,99,235,0.08)]

        p-5 sm:p-6

        overflow-y-auto
      "
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h3 className="text-xl font-bold text-custom-blue">
          Monthly Revenue by Service
        </h3>

        <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
          Monthly
        </div>

      </div>

      {/* LIST */}
      <div className="space-y-4">

        {CATEGORY_LABELS.map(
          (title) => {

            const value =
              revenueData[title] || 0;

            return (
              <button
                type="button"
                onClick={() => onSelect?.(title)}
                key={title}
                className={`
                  flex items-center justify-between

                  rounded-2xl

                  border border-gray-100

                  bg-gray-50/70

                  px-4 py-3

                  hover:bg-blue-50
                  hover:border-blue-100

                  transition-all duration-300
                  ${selectedCategory === title ? "border-blue-200 bg-blue-50" : ""}
                `}
              >

                <span className="text-sm sm:text-base font-semibold text-gray-700">
                  {title}
                </span>

                <span className="font-bold text-custom-blue text-sm sm:text-base">
                  ₹{" "}
                  {value.toLocaleString()}
                </span>

              </button>
            );
          }
        )}

      </div>
    </div>
  );
}
