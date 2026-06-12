"use client";
import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import InquiryForm from "./InquiryForm";

export default function Contact() {
  return (
    <section className="bg-white py-14 md:py-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">

        {/* ================= TITLE ================= */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-anton text-custom-blue tracking-wide">
            Let’s Get In Touch
          </h1>
          <div className="mt-3 h-[3px] w-16 bg-custom-blue"></div>
        </div>

        {/* ================= CONTACT CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <ContactCard
            icon={<Phone size={28} />}
            text="+91 84898 29227 / 80988 88087"
          />

          <ContactCard
            icon={<Mail size={28} />}
            text="admin@briefcase.com"
          />

          <ContactCard
            icon={<MapPin size={28} />}
            text="296, 10th Street, 3rd Main Road, Astalakshmi Nagar, Valasaravakam, Chennai - 116"
          />

        </div>

        <div className="border-b border-gray-300 mb-12"></div>

        {/* ================= FORM ================= */}
        <InquiryForm />

      </div>
    </section>
  );
}

function ContactCard({ icon, text }) {
  return (
    <div className="border border-custom-blue p-6 text-center bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-center mb-3 text-custom-blue">
        {icon}
      </div>
      <p className="text-sm leading-relaxed font-lato font-bold text-letter1 tracking-wider">{text}</p>
    </div>
  );
}
