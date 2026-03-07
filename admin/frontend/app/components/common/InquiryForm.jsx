"use client";

import { Mail, Phone, User, Building, MessageSquare } from "lucide-react";

export default function InquiryForm() {
  return (
    <div className="max-w-4xl mx-auto">

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-anton font-normal text-starttext mb-10 tracking-wider">
        Or fill out the form below
      </h2>

      <form className="space-y-6">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormSelect
            label="Inquiry Purpose*"
            options={["Business", "Support", "General Inquiry"]}
          />

          <FormSelect
            label="Description that fits you*"
            options={["Startup", "Enterprise", "Individual"]}
          />

        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormInput
            label="Full Name"
            icon={<User size={18} />}
            placeholder="Enter your full name..."
          />

          <FormInput
            label="Email"
            icon={<Mail size={18} />}
            placeholder="Enter your email address..."
          />

        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormInput
            label="Organization"
            icon={<Building size={18} />}
            placeholder="Enter your organization..."
          />

          <FormInput
            label="Phone Number"
            icon={<Phone size={18} />}
            placeholder="Enter your phone number..."
          />

        </div>

        {/* Message */}
        <div>
          <label className="block font-bold text-custom-blue mb-2 font-lato text-md">
            Message*
          </label>

          <div className="relative">
            <MessageSquare
              className="absolute left-4 top-4 text-letter1 text-md font-lato font-bold"
              size={18}
            />
            <textarea
              rows="5"
              placeholder="Enter your message here..."
              className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-custom-blue text-letter1 font-bold font-lato"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="bg-custom-blue text-white px-10 py-3 rounded-md hover:bg-starttext transition duration-300 flex items-center gap-2 font-lato font-bold"
          >
            Submit Form →
          </button>
        </div>

      </form>
    </div>
  );
}

/* ================= Reusable Components ================= */

function FormInput({ label, icon, placeholder }) {
  return (
    <div>
      <label className="block text-md font-lato font-bold text-custom-blue mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-4 text-letter1 font-lato font-bold">
          {icon}
        </div>

        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-custom-blue text-letter1 font-lato font-bold"
        />
      </div>
    </div>
  );
}

function FormSelect({ label, options }) {
  return (
    <div>
      <label className="block text-md font-lato font-bold text-custom-blue mb-2">
        {label}
      </label>

      <select className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-custom-blue">
        <option className="font-lato font-bold text-letter1">Choose one option...</option>
        {options.map((opt, i) => (
          <option key={i} className="font-lato font-bold text-letter1">{opt}</option>
        ))}
      </select>
    </div>
  );
}
