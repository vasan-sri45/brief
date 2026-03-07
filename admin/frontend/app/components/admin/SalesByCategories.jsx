"use client";

export default function SalesByCategories({ revenueData = {} }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border-3 border-custom-blue">
      <h3 className="font-anton text-lg font-normal tracking-wider text-custom-blue mb-4">
        Monthly Revenue by Service
      </h3>

      <ul className="space-y-3">
        {Object.entries(revenueData).map(([title, value]) => (
          <li key={title} className="flex justify-between font-lato text-md font-bold text-letter1 tracking-wide">
            <span>{title}</span>
            <span className="font-bold text-startbtn">
              ₹ {value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}