"use client";

const CATEGORY_LABELS = [
  "Startup",
  "Intellectual Property",
  "Tax Filling",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services",
];

const BarChart = ({ revenueData = {} }) => {
  const width = 600;
  const height = 200;
  const padding = 40;

  const values = CATEGORY_LABELS.map(
    (label) => revenueData[label] || 0
  );

  const maxValue = Math.max(...values, 1);

  const barWidth =
    (width - padding * 2) / CATEGORY_LABELS.length - 15;

  return (
    <div className="rounded-2xl shadow-lg p-8 w-[900px] bg-white border-3 border-custom-blue">
      <span className="text-custom-blue font-anton font-normal tracking-wider text-lg mb-4 block">
        Monthly Revenue Overview
      </span>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Bars */}
        {values.map((value, index) => {
          const barHeight =
            (value / maxValue) * (height - padding * 2);

          const x =
            padding +
            index *
              ((width - padding * 2) /
                CATEGORY_LABELS.length);

          const y =
            height - padding - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#325cda"
                rx="6"
              />

              {/* Value Label */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="12"
                fill="#3f3c3c"
              >
                ₹{value.toLocaleString()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Category Labels */}
      <div className="flex justify-between text-xs font-bold mt-4">
        {CATEGORY_LABELS.map((label, i) => (
          <div key={i} className="text-center w-full font-lato text-xs lg:text-sm text-letter1">
            {label.slice(0, 4)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;