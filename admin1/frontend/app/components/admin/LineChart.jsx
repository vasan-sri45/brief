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

const shortLabel = (label) =>
  label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 4);

export default function BarChart({
  revenueData = {},
  selectedCategory,
  onSelect,
}) {
  const values = CATEGORY_LABELS.map((label) => revenueData[label] || 0);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="h-[380px] rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_10px_35px_rgba(37,99,235,0.08)] sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-custom-blue">
            Monthly Revenue Overview
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Bar chart by service category
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
          Monthly
        </span>
      </div>

      <div className="flex h-[255px] items-end gap-3 overflow-x-auto pb-2">
        {CATEGORY_LABELS.map((label) => {
          const value = revenueData[label] || 0;
          const height = Math.max((value / maxValue) * 210, value ? 20 : 8);
          const active = selectedCategory === label;

          return (
            <button
              type="button"
              key={label}
              onClick={() => onSelect?.(label)}
              className="flex min-w-[82px] flex-1 flex-col items-center justify-end gap-2"
              title={label}
            >
              <span className="text-xs font-bold text-blue-700">
                Rs. {value.toLocaleString()}
              </span>
              <span
                className={`w-12 rounded-t-2xl transition-all ${
                  active
                    ? "bg-gradient-to-t from-indigo-700 to-blue-500"
                    : "bg-gradient-to-t from-blue-500 to-blue-300"
                }`}
                style={{ height }}
              />
              <span className="text-xs font-bold text-slate-500">
                {shortLabel(label)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
