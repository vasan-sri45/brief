"use client";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

/* ================= DATA ================= */

const incorporationOptions = [
"Private Limited Company Registration",
"Limited Liability Partnership Registration",
"One Person Company Registration",
"Partnership Firm Registration",
"Sole Proprietorship Firm Registration",
"Register on Indian Subsidiary",
"Section 8 Company Registration",
"Producer Company Registration",
"Association Registration",
"Trust Registration",
"Society Registration",
];

const extraServices = [
"GST Registration",
"PAN Registration",
"TAN Registration",
"Bank Current A/C",
"Start Up India Registration",
"MSME Udyam Registration",
"Trademark Registration",
];

export default function StartupPackages() {
const [open, setOpen] = useState(true);
const [selectedIncorp, setSelectedIncorp] = useState([]);
const [extras, setExtras] = useState([]);

const router = useRouter();
const { user } = useSelector((state) => state.auth);

/* ================= HANDLERS ================= */

const toggleIncorp = (item) => {
setSelectedIncorp((prev) =>
prev.includes(item)
? prev.filter((x) => x !== item)
: [...prev, item]
);
};

const toggleExtra = (item) => {
setExtras((prev) =>
prev.includes(item)
? prev.filter((x) => x !== item)
: [...prev, item]
);
};

/* ================= SUBMIT ================= */

const handleSubmit = () => {
if (!user) {
router.push("/login");
return;
}


// encode selected packages to URL
const incorpParam = encodeURIComponent(selectedIncorp.join("|"));
const extrasParam = encodeURIComponent(extras.join("|"));

router.push(`/user/contact?incorp=${incorpParam}&extras=${extrasParam}`);

};

return ( <div className="max-w-6xl mx-auto p-6 font-lato">
  <div className="flex justify-between items-center">
    <h2 className="text-xl md:text-3xl font-anton text-custom-blue mb-8">
      Start Up Packages
    </h2>
    <p className="hidden md:flex text-letter1 font-lato font-bold">
      <span className="text-custom-blue">[</span>
      Select Services as per your Requirements
      <span className="text-custom-blue">]</span></p>
  </div>
  

  {/* INCORPORATION */}
  <div className="border-2 border-custom-blue rounded-lg overflow-hidden shadow-sm mb-6">

    <button
      onClick={() => setOpen(!open)}
      className="w-full flex items-center justify-between px-5 py-4 bg-white font-bold"
    >
      <span className="text-xl text-letter1">INCORPORATION</span>
      <ChevronDown className={`transition text-custom-blue ${open ? "rotate-180" : ""}`} />
    </button>

    {open && (
      <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {incorporationOptions.map((item) => {
          const selected = selectedIncorp.includes(item);

          return (
            <div
              key={item}
              onClick={() => toggleIncorp(item)}
              className={`cursor-pointer rounded-lg p-4 border-2 text-letter1 font-lato font-bold
              ${selected ? "border-custom-blue bg-blue-50" : "border-letter1"}`}
            >
              {item}
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* EXTRA SERVICES */}
  <div className="space-y-4">
    {extraServices.map((service) => {
      const selected = extras.includes(service);

      return (
        <label
          key={service}
          className={`flex items-center gap-3 border-2 rounded-md px-5 py-4 cursor-pointer text-letter1 font-lato font-bold
          ${selected ? "border-custom-blue bg-blue-50" : "border-gray-400"}`}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggleExtra(service)}
          />
          {service}
        </label>
      );
    })}
  </div>

  <div className="flex justify-center mt-10">
    <button
      onClick={handleSubmit}
      className="bg-custom-blue text-white px-10 py-4 rounded-lg font-bold flex items-center justify-center"
    >
      Continue 
      <ArrowRight className="text-xl mt-1 ml-2"/>
    </button>
  </div>
</div>

);
}
