"use client";

import React from "react";
import { useSelector } from "react-redux";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const { user, hydrated } = useSelector((state) => state.auth);

  // Show footer ONLY for logged-in users
  if (!hydrated || !user || user.role !== "user") return null;

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/yourpage",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/briefcasse_?igsh=emI0MW1mcGdnMzVj",
      label: "Instagram",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/yourprofile",
      label: "Twitter",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@yourchannel",
      label: "YouTube",
    },
  ];

  return (
    <footer className="w-full bg-custom-blue text-white">
      <div className="mx-auto p-6 max-w-[1800px] mt-5 md:mt-14">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* LOGO */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/assets/brief_white.png"
                alt="logo"
                width={32}
                height={32}
                className="mr-3"
              />
              <h2 className="text-xl font-anton font-semibold tracking-widest">
                BRIEFCASE.
              </h2>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed font-lato font-semibold">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Curabitur interdum mollis orci.
            </p>
          </div>

          {/* MAIN MENU */}
          <div>
            <h3 className="text-lg font-lato font-bold mb-4">Main Menu</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Start Ups",
                "Intellectual Properties",
                "Tax Filing",
                "MCA Compliance",
                "Registration",
                "Legal Advisory & Agreement",
                "Other Services",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white font-poppins font-semibold"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-lato font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["About Us", "Career", "Blogs", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white font-poppins font-semibold"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg mb-4 font-lato font-bold">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-300 font-lato font-semibold">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
               +91 84898 29227 / 80988 88087
              </div>

              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                admin@briefcasse.com
              </div>

              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <div>
                  <p>296, 10th Street, 3rd Main Road,
                    Astalakshmi Nagar, Valasaravakam, Chennai - 116</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm font-lato font-bold">
            © 2025 Briefcase. All rights reserved
          </p>

          <div className="flex gap-4 mt-4 md:mt-0">
            {socialLinks.map(({ icon: Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-full hover:bg-gray-700 transition hover:scale-110"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
