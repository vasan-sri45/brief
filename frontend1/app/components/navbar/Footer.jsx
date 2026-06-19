"use client";

import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import {
  Facebook, Instagram, Youtube,
  Phone, Mail, MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // ✅ Next.js Link

const Footer = () => {

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/14ntuxkHGuT/?mibextid=wwXIfr", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/briefcasse_?igsh=bGQ3MnhvNnRxa3M3&utm_source=qr", label: "Instagram" },
    { icon: FaXTwitter, href: "https://x.com/yourprofile", label: "X" },
    { icon: Youtube, href: "https://www.youtube.com/@yourchannel", label: "YouTube" },
  ];

  // ✅ Main Menu - சரியான Routes சேர்க்கவும்
  const mainMenuLinks = [
    { name: "Start Ups", href: "/" },
    { name: "Intellectual Properties", href: "/" },
    { name: "Tax Filing", href: "/" },
    { name: "MCA Compliance", href: "/" },
    { name: "Registration", href: "/" },
    { name: "Legal Advisory & Agreement", href: "/" },
    { name: "Other Services", href: "/" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/user/about" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/user/contact" },
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
                src="/assets/brief_white.webp"
                alt="Briefcasse logo"
                width={36}
                height={36}
                unoptimized
                className="h-auto mr-1"
              />
              <h2 className="text-2xl font-anton font-normal tracking-wider mt-1.5">
                BRIEFCASSE
              </h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-lato font-semibold">
              Briefcasse is your trusted partner for legal, tax, compliance, and
              business registration services, delivering reliable solutions for
              individuals, startups, and enterprises.
            </p>
          </div>

          {/* MAIN MENU ✅ Fixed */}
          <div>
            <h3 className="text-lg font-lato font-bold mb-4">Main Menu</h3>
            <ul className="space-y-2 text-sm">
              {mainMenuLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white font-poppins font-semibold"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS ✅ Fixed */}
          <div>
            <h3 className="text-lg font-lato font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white font-poppins font-semibold"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg mb-4 font-lato font-bold">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-300 font-lato font-semibold">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 shrink-0" />
                <a href="tel:+919600606897" className="hover:text-white">
                  +91 9600606897
                </a>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 shrink-0" />
                <a href="mailto:admin@briefcasse.com" className="hover:text-white">
                  admin@briefcasse.com
                </a>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 shrink-0" />
                <p>296, 10th Street, 3rd Main Road,
                  Astalakshmi Nagar, Valasaravakam, Chennai - 116</p>
              </div>
              <div className="flex gap-4 pt-4">
                {socialLinks.map(({ icon: Icon, href, label }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="rounded-full p-2 text-white transition hover:bg-white/10 hover:scale-110"
                  >
                    <Icon size={21} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ✅ Dynamic Year */}
        <div className="border-t border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm font-lato font-bold">
            © {new Date().getFullYear()} Briefcasse. All rights reserved
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
