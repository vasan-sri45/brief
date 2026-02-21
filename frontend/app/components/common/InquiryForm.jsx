// "use client";

// import { Mail, Phone, User, Building, MessageSquare } from "lucide-react";

// export default function InquiryForm() {
//   return (
//     <div className="max-w-4xl mx-auto">

//       {/* Title */}
//       <h2 className="text-3xl md:text-4xl font-anton font-normal text-starttext mb-10 tracking-wider">
//         Or fill out the form below
//       </h2>

//       <form className="space-y-6">

//         {/* Row 1 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <FormSelect
//             label="Inquiry Purpose*"
//             options={["Business", "Support", "General Inquiry"]}
//           />

//           <FormSelect
//             label="Description that fits you*"
//             options={["Startup", "Enterprise", "Individual"]}
//           />

//         </div>

//         {/* Row 2 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <FormInput
//             label="Full Name"
//             icon={<User size={18} />}
//             placeholder="Enter your full name..."
//           />

//           <FormInput
//             label="Email"
//             icon={<Mail size={18} />}
//             placeholder="Enter your email address..."
//           />

//         </div>

//         {/* Row 3 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <FormInput
//             label="Organization"
//             icon={<Building size={18} />}
//             placeholder="Enter your organization..."
//           />

//           <FormInput
//             label="Phone Number"
//             icon={<Phone size={18} />}
//             placeholder="Enter your phone number..."
//           />

//         </div>

//         {/* Message */}
//         <div>
//           <label className="block font-bold text-custom-blue mb-2 font-lato text-md">
//             Message*
//           </label>

//           <div className="relative">
//             <MessageSquare
//               className="absolute left-4 top-4 text-letter1 text-md font-lato font-bold"
//               size={18}
//             />
//             <textarea
//               rows="5"
//               placeholder="Enter your message here..."
//               className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-custom-blue text-letter1 font-bold font-lato"
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="pt-6">
//           <button
//             type="submit"
//             className="bg-custom-blue text-white px-10 py-3 rounded-md hover:bg-starttext transition duration-300 flex items-center gap-2 font-lato font-bold"
//           >
//             Submit Form →
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// }

// /* ================= Reusable Components ================= */

// function FormInput({ label, icon, placeholder }) {
//   return (
//     <div>
//       <label className="block text-md font-lato font-bold text-custom-blue mb-2">
//         {label}
//       </label>

//       <div className="relative">
//         <div className="absolute left-4 top-4 text-letter1 font-lato font-bold">
//           {icon}
//         </div>

//         <input
//           type="text"
//           placeholder={placeholder}
//           className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-custom-blue text-letter1 font-lato font-bold"
//         />
//       </div>
//     </div>
//   );
// }

// function FormSelect({ label, options }) {
//   return (
//     <div>
//       <label className="block text-md font-lato font-bold text-custom-blue mb-2">
//         {label}
//       </label>

//       <select className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-custom-blue">
//         <option className="font-lato font-bold text-letter1">Choose one option...</option>
//         {options.map((opt, i) => (
//           <option key={i} className="font-lato font-bold text-letter1">{opt}</option>
//         ))}
//       </select>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Mail, Phone, User, Building, MessageSquare } from "lucide-react";
import {api} from "../../api/api";

export default function InquiryForm() {

  const [form, setForm] = useState({
    inquiryPurpose: "",
    description: "",
    fullName: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

   const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccess("");

  try {
    const { data } = await api.post("/contact", form);

    if (data.success) {
      setSuccess("Message sent successfully!");
      setForm({
        inquiryPurpose: "",
        description: "",
        fullName: "",
        email: "",
        organization: "",
        phone: "",
        message: "",
      });
    } else {
      setSuccess("Failed to send message");
    }

  } catch (err) {
    console.error(err);
    setSuccess("Server error");
  }

  setLoading(false);
};

  return (
    <div className="max-w-4xl mx-auto">

      <h2 className="text-3xl md:text-4xl font-anton text-starttext mb-10 tracking-wider">
        fill out the form below
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormSelect name="inquiryPurpose" label="Inquiry Purpose*" value={form.inquiryPurpose} onChange={handleChange}
            options={["Business", "Support", "General Inquiry"]}
          />

          <FormSelect name="description" label="Description that fits you*" value={form.description} onChange={handleChange}
            options={["Startup", "Enterprise", "Individual"]}
          />

        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormInput name="fullName" label="Full Name" icon={<User size={18} />} value={form.fullName} onChange={handleChange}
            placeholder="Enter your full name..."
          />

          <FormInput name="email" label="Email" icon={<Mail size={18} />} value={form.email} onChange={handleChange}
            placeholder="Enter your email address..."
          />

        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormInput name="organization" label="Organization" icon={<Building size={18} />} value={form.organization} onChange={handleChange}
            placeholder="Enter your organization..."
          />

          <FormInput name="phone" label="Phone Number" icon={<Phone size={18} />} value={form.phone} onChange={handleChange}
            placeholder="Enter your phone number..."
          />

        </div>

        {/* Message */}
        <div>
          <label className="block font-bold text-custom-blue mb-2">Message*</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 text-letter1" size={18} />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              placeholder="Enter your message here..."
              className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:ring-2 focus:ring-custom-blue"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-custom-blue text-white px-10 py-3 rounded-md hover:bg-starttext transition font-bold"
          >
            {loading ? "Sending..." : "Submit Form →"}
          </button>

          {success && (
            <p className="mt-4 text-green-600 font-semibold">{success}</p>
          )}
        </div>

      </form>
    </div>
  );
}


/* Inputs */

function FormInput({ name, label, icon, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-md font-bold text-custom-blue mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-4 text-letter1">{icon}</div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type="text"
          placeholder={placeholder}
          className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:ring-2 focus:ring-custom-blue"
        />
      </div>
    </div>
  );
}

function FormSelect({ name, label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-md font-bold text-custom-blue mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md px-4 py-4 focus:ring-2 focus:ring-custom-blue"
      >
        <option value="">Choose one option...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
