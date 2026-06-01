import Link from "next/link";
import {ArrowRight} from "lucide-react";

export default function DashboardCard({
  title,
  value,
  services,
}) {
  return (
    <div className="min-w-[260px] bg-white rounded-xl shadow-lg px-6 py-7 flex flex-col">
      <h3 className="text-lg text-custom-blue font-anton tracking-wider font-normal">
        {title}
      </h3>

      <p className="mt-3 text-3xl font-semibold font-lato text-custom-blue">
        {value}
        <span className="text-base font-lato font-bold ml-2 text-letter1">
          {services}
        </span>
      </p>

      <Link
        href="#"
        className="mt-6 text-[#F7631B] text-sm font-bold"
      >
        <button
              
              className="mt-6 inline-flex items-center px-6 py-2 rounded-full font-anton font-normal tracking-wide
                         bg-starttext text-white shadow 
                         hover:shadow-lg hover:scale-105 
                         transition-all duration-300"
            >
              View
              <ArrowRight className="ml-2 w-6 h-6" />
            </button>
      </Link>
    </div>
  );
}
