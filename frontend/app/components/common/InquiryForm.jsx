// "use client";
// import { useState } from "react";
// import { Mail, Phone, User, Building, MessageSquare } from "lucide-react";
// import {api} from "../../api/api";

// export default function InquiryForm() {

//   const [form, setForm] = useState({
//     inquiryPurpose: "",
//     description: "",
//     fullName: "",
//     email: "",
//     organization: "",
//     phone: "",
//     message: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");

//    const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

  
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setSuccess("");

//   try {
//     const { data } = await api.post("/contact", form);

//     if (data.success) {
//       setSuccess("Message sent successfully!");
//       setForm({
//         inquiryPurpose: "",
//         description: "",
//         fullName: "",
//         email: "",
//         organization: "",
//         phone: "",
//         message: "",
//       });
//     } else {
//       setSuccess("Failed to send message");
//     }

//   } catch (err) {
//     console.error(err);
//     setSuccess("Server error");
//   }

//   setLoading(false);
// };

//   return (
//     <div className="max-w-4xl mx-auto">

//       <h2 className="text-3xl md:text-4xl font-anton text-custom-blue mb-10 tracking-wider">
//         fill out the form below
//       </h2>

//       <form className="space-y-6" onSubmit={handleSubmit}>

//         {/* Row 1 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <FormSelect name="inquiryPurpose" label="Inquiry Purpose*" value={form.inquiryPurpose} onChange={handleChange}
//             options={["Business", "Support", "General Inquiry"]}
//           />

//           <FormSelect name="description" label="Description that fits you*" value={form.description} onChange={handleChange}
//             options={["Startup", "Enterprise", "Individual"]}
//           />

//         </div>

//         {/* Row 2 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <FormInput name="fullName" label="Full Name" icon={<User size={18} />} value={form.fullName} onChange={handleChange}
//             placeholder="Enter your full name..."
//           />

//           <FormInput name="email" label="Email" icon={<Mail size={18} />} value={form.email} onChange={handleChange}
//             placeholder="Enter your email address..."
//           />

//         </div>

//         {/* Row 3 */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <FormInput name="organization" label="Organization" icon={<Building size={18} />} value={form.organization} onChange={handleChange}
//             placeholder="Enter your organization..."
//           />

//           <FormInput name="phone" label="Phone Number" icon={<Phone size={18} />} value={form.phone} onChange={handleChange}
//             placeholder="Enter your phone number..."
//           />

//         </div>

//         {/* Message */}
//         <div>
//           <label className="block font-bold text-custom-blue mb-2">Message*</label>
//           <div className="relative">
//             <MessageSquare className="absolute left-4 top-4 text-letter1" size={18} />
//             <textarea
//               name="message"
//               value={form.message}
//               onChange={handleChange}
//               rows="5"
//               placeholder="Enter your message here..."
//               className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:ring-2 focus:ring-custom-blue"
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="pt-6">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-custom-blue text-white px-10 py-3 rounded-md hover:bg-starttext transition font-bold"
//           >
//             {loading ? "Sending..." : "Submit Form →"}
//           </button>

//           {success && (
//             <p className="mt-4 text-green-600 font-semibold">{success}</p>
//           )}
//         </div>

//       </form>
//     </div>
//   );
// }


// /* Inputs */

// function FormInput({ name, label, icon, placeholder, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-md font-bold text-custom-blue mb-2">{label}</label>
//       <div className="relative">
//         <div className="absolute left-4 top-4 text-letter1">{icon}</div>
//         <input
//           name={name}
//           value={value}
//           onChange={onChange}
//           type="text"
//           placeholder={placeholder}
//           className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md pl-12 pr-4 py-4 focus:ring-2 focus:ring-custom-blue"
//         />
//       </div>
//     </div>
//   );
// }

// function FormSelect({ name, label, options, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-md font-bold text-custom-blue mb-2">{label}</label>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md px-4 py-4 focus:ring-2 focus:ring-custom-blue"
//       >
//         <option value="">Choose one option...</option>
//         {options.map((opt, i) => (
//           <option key={i} value={opt}>{opt}</option>
//         ))}
//       </select>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Mail, Phone, User, Building, MessageSquare } from "lucide-react";
import { api } from "../../api/api";

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

  /* ---------------- VALIDATIONS ---------------- */

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPhoneValid = /^[6-9]\d{9}$/.test(form.phone);

  const isFormValid =
    form.inquiryPurpose &&
    form.description &&
    form.fullName.trim().length >= 3 &&
    isEmailValid &&
    form.organization.trim().length >= 2 &&
    isPhoneValid;

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

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
      <h2 className="text-3xl md:text-4xl font-anton text-custom-blue mb-10 tracking-wider">
        Fill out the form below
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            name="inquiryPurpose"
            label="Inquiry Purpose*"
            value={form.inquiryPurpose}
            onChange={handleChange}
            options={["Business", "Support", "General Inquiry"]}
          />

          <FormSelect
            name="description"
            label="Description that fits you*"
            value={form.description}
            onChange={handleChange}
            options={["Startup", "Enterprise", "Individual"]}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="fullName"
            label="Full Name*"
            icon={<User size={18} />}
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name..."
          />

          <div>
            <FormInput
              name="email"
              label="Email*"
              icon={<Mail size={18} />}
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address..."
            />
            {form.email && !isEmailValid && (
              <p className="text-red-500 text-sm mt-1">Enter valid email</p>
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="organization"
            label="Organization*"
            icon={<Building size={18} />}
            value={form.organization}
            onChange={handleChange}
            placeholder="Enter your organization..."
          />

          <div>
            <FormInput
              name="phone"
              label="Phone Number*"
              icon={<Phone size={18} />}
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number..."
            />
            {form.phone && !isPhoneValid && (
              <p className="text-red-500 text-sm mt-1">
                Enter valid Indian mobile number
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block font-bold text-custom-blue mb-2">
            Message*
          </label>
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
          {form.message && form.message.length < 5 && (
            <p className="text-red-500 text-sm mt-1">
              Message must be at least 5 characters
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`px-10 py-3 rounded-md font-bold transition
              ${
                isFormValid
                  ? "bg-custom-blue text-white hover:bg-starttext"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
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

/* ---------- INPUT COMPONENT ---------- */
function FormInput({ name, label, icon, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-md font-bold text-custom-blue mb-2">
        {label}
      </label>
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

/* ---------- SELECT COMPONENT ---------- */
function FormSelect({ name, label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-md font-bold text-custom-blue mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#f9f9f9] border border-gray-300 rounded-md px-4 py-4 focus:ring-2 focus:ring-custom-blue"
      >
        <option value="">Choose one option...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}