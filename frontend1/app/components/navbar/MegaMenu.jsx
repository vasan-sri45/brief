"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowRight, Check, ChevronDown, Home, Menu, X } from "lucide-react";
import { useLogout } from "../../hooks/useAuthMutations";
import { useServiceMenu } from "../../hooks/useServices";

const normalizeTitle = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .trim()
    .replace(/\s+/g, " ");

const STATIC_NAV_TITLES = [
  "Startup",
  "Intellectual Property",
  "Tax Filing",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services",
];

const MENU_LAYOUTS = {
  startup: {
    promoTitle: "STARTUP PACKAGES",
    promoHeading: "Private Limited Company Registration",
    promoText: "Register your company quickly with expert legal support.",
    buttonLabel: "Custom Startup Package",
    promoHref: "/startup",
  },
  "intellectual property": {
    promoTitle: "TRADEMARK SEARCH",
    promoHeading: "Trademark Search",
    promoText: "Search and protect your brand with expert legal support.",
    buttonLabel: "Start Search",
  },
  "legal advisory & agreement": {
    promoTitle: "CUSTOM AGREEMENT",
    promoHeading: "Customized Agreement",
    promoText: "Create legally valid agreements with expert legal guidance.",
    buttonLabel: "Custom Agreement",
  },
  "other services": {
    promoTitle: "OTHER SERVICES",
    promoHeading: "Proprietorship to Private Limited Company",
    promoText: "Convert, update, or close your business with guided support.",
    buttonLabel: "Explore Service",
    showPromo: false,
  },
  "tax filing": {
    promoTitle: "TAX FILING",
    promoHeading: "GST Return Filling",
    promoText: "File GST, ITR, TDS, and tax documents with expert support.",
    buttonLabel: "Start Filing",
    showPromo: false,
  },
  "mca compliance": {
    promoTitle: "MCA COMPLIANCE",
    promoHeading: "Annual Compliance for Private Limited Company",
    promoText: "Keep company and LLP compliance filings current.",
    buttonLabel: "Start Compliance",
    showPromo: false,
  },
  registration: {
    promoTitle: "REGISTRATION",
    promoHeading: "GST Registration",
    promoText: "Get business registrations and certificates done online.",
    buttonLabel: "Start Registration",
    showPromo: false,
  },
};

const findServiceByHeading = (services = [], entry) => {
  const candidates = Array.isArray(entry) ? entry : [entry];

  return services.find((service) =>
    candidates.some(
      (candidate) => normalizeTitle(service.heading) === normalizeTitle(candidate)
    )
  );
};

const buildMenuGroups = (title, services = []) => {
  const layout = MENU_LAYOUTS[normalizeTitle(title)];
  const menuLayout = layout || {
    promoTitle: title,
    promoHeading: services[0]?.heading,
    promoText: "Explore Briefcasse services and open the exact page you need.",
    buttonLabel: "Explore Service",
  };

  const usedSlugs = new Set();
  const promoService = findServiceByHeading(services, menuLayout.promoHeading);
  const hiddenColumnServices = new Set(
    menuLayout.showPromo !== false && promoService
      ? [normalizeTitle("Trademark Search"), normalizeTitle("Customized Agreement")]
      : []
  );

  if (promoService && hiddenColumnServices.has(normalizeTitle(promoService.heading))) {
    usedSlugs.add(promoService.slug);
  }

  const groupedBySubTitle = services.reduce((groups, service) => {
    if (usedSlugs.has(service.slug)) return groups;

    const label = service.subTitle?.trim() || title;

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label).push(service);
    usedSlugs.add(service.slug);

    return groups;
  }, new Map());

  const groups = Array.from(groupedBySubTitle.entries()).map(
    ([label, groupServices]) => ({
      label,
      services: groupServices,
    })
  );

  const remaining = services.filter((service) => !usedSlugs.has(service.slug));

  if (remaining.length > 0) {
    groups.push({
      label: "MORE SERVICES",
      services: remaining,
    });
  }

  return { layout: menuLayout, groups };
};

const getPromoService = (layout, services, groups) =>
  findServiceByHeading(services, layout.promoHeading) ||
  groups.flatMap((group) => group.services)[0];

const getPromoHref = (layout, promoService) =>
  layout.promoHref || (promoService ? `/services/${promoService.slug}` : null);

export default function MegaMenuNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTitle, setMobileTitle] = useState(null);
  const [activeTitle, setActiveTitle] = useState(null);
  const closeTimerRef = useRef(null);

  const router = useRouter();
  const logout = useLogout();
  const user = useSelector((state) => state.auth.user);

  const {
    data: menu = {},
    isLoading,
    isError,
    error,
  } = useServiceMenu();

  const titles = STATIC_NAV_TITLES;

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMenu = (title) => {
    clearTimeout(closeTimerRef.current);
    setActiveTitle(title);
  };

  const toggleMenu = (title) => {
    clearTimeout(closeTimerRef.current);
    setActiveTitle((current) => (current === title ? null : title));
  };

  const closeMenu = () => {
    closeTimerRef.current = setTimeout(() => setActiveTitle(null), 120);
  };

  const handleLogin = () => {
    router.push("/login");
    setMobileOpen(false);
  };

  const renderState = (title, colorClass = "text-white/90") => {
    if (isLoading) {
      return (
        <div className={`px-4 py-3 text-center text-sm font-bold ${colorClass}`}>
          Loading services...
        </div>
      );
    }

    if (isError) {
      return (
        <div className="px-4 py-3 text-center text-sm font-bold text-red-100">
          {error?.response?.data?.message || "Unable to load services"}
        </div>
      );
    }

    if (!menu[title]?.length) {
      return (
        <div className={`px-4 py-3 text-center text-sm font-bold ${colorClass}`}>
          No services available
        </div>
      );
    }

    return null;
  };

  return (
    <nav className="relative w-full">
      <div className="lg:hidden flex justify-between items-center px-2 py-4 bg-custom-blue">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/brief_white.webp"
            alt="Briefcasse logo"
            width={32}
            height={32}
            unoptimized
            className="h-auto"
          />
          <span className="text-white font-anton ml-1 text-2xl mt-1.5">
            BRIEFCASSE
          </span>
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="text-white" size={28} />
        </button>
      </div>

      <ul className="hidden lg:flex justify-center gap-10 py-4 bg-custom-blue text-white font-bold border-b-2 border-white">
        {titles.map((title) => {
            const menuItems = menu[title] || [];
            const titleStateContent = renderState(title, "text-custom-blue");
            const { layout, groups } = buildMenuGroups(title, menuItems);
            const promoService = getPromoService(layout, menuItems, groups);
            const promoHref = getPromoHref(layout, promoService);
            const showPromo = layout.showPromo !== false && promoHref;

            return (
              <li
                key={title}
                onMouseLeave={closeMenu}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => toggleMenu(title)}
                  className="flex items-center gap-1"
                >
                  {title}
                  <ChevronDown
                    size={16}
                    className={activeTitle === title ? "rotate-180" : ""}
                  />
                </button>

                {activeTitle === title && (
                  <div
                    className="fixed left-1/2 top-[148px] z-[100] flex w-[92vw] max-w-[1450px] -translate-x-1/2 overflow-hidden rounded-xl border border-custom-blue/10 bg-white text-custom-blue shadow-2xl"
                    onMouseEnter={() => openMenu(title)}
                    onMouseLeave={closeMenu}
                  >
                    <div className="flex-1 overflow-x-auto bg-white px-10 py-10">
                      {titleStateContent || (
                        <div className="flex min-w-max items-start gap-x-10 gap-y-8">
                          {groups.map((group) => (
                            <div
                              key={group.label}
                              className="w-max min-w-[220px] max-w-[340px] shrink-0"
                            >
                              <div className="mb-5 whitespace-nowrap rounded-full bg-custom-blue px-5 py-2 text-center font-lato text-sm font-extrabold uppercase tracking-tight text-white">
                                {group.label}
                              </div>

                              <div className="space-y-4">
                                {group.services.map((service) => (
                                  <Link
                                    key={service.slug}
                                    href={`/services/${service.slug}`}
                                    onClick={() => setActiveTitle(null)}
                                    className="block whitespace-nowrap font-lato text-sm font-extrabold leading-5 text-custom-blue transition hover:translate-x-1 hover:text-starttext"
                                  >
                                    {service.heading}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {showPromo && (
                      <div className="hidden w-[320px] shrink-0 flex-col justify-between rounded-r-xl bg-custom-blue p-8 text-white xl:flex">
                        <div>
                          <h3 className="font-anton text-2xl font-normal uppercase tracking-wide">
                            {layout.promoTitle}
                          </h3>

                          <p className="mt-5 font-lato text-sm font-extrabold leading-7 text-white/90">
                            {layout.promoText}
                          </p>

                          <div className="mt-7 space-y-3 font-lato text-sm font-extrabold text-white">
                            {[
                              "Fast Registration",
                              "100% Online",
                              "Expert Support",
                              "Affordable Pricing",
                            ].map((item) => (
                              <div key={item} className="flex items-center gap-2">
                                <Check size={16} strokeWidth={3} />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Link
                          href={promoHref}
                          onClick={() => setActiveTitle(null)}
                          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-center font-lato text-sm font-extrabold text-custom-blue transition hover:bg-starttext"
                        >
                          {layout.buttonLabel}
                          <ArrowRight size={17} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
      </ul>

      <div
        className={`fixed inset-0 z-[9999] lg:hidden ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/70"
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-[340px] flex-col bg-custom-blue text-white transition-transform ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-5 py-5 border-b border-white/10">
            <span className="font-bold">{user?.name || "User"}</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {titles.map((title) => {
                const menuItems = menu[title] || [];
                const titleStateContent = renderState(title, "text-custom-blue");
                const { layout, groups } = buildMenuGroups(title, menuItems);
                const promoService = getPromoService(layout, menuItems, groups);
                const promoHref = getPromoHref(layout, promoService);
                const showMobilePromo =
                  [
                    "startup",
                    "intellectual property",
                    "legal advisory & agreement",
                  ].includes(normalizeTitle(title)) &&
                  layout.showPromo !== false &&
                  promoHref;

                return (
                <div key={title} className="mb-2">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center py-3 font-bold"
                    onClick={() =>
                      setMobileTitle(
                        normalizeTitle(mobileTitle) === normalizeTitle(title)
                          ? null
                          : title
                      )
                    }
                  >
                    {title}
                    <ChevronDown
                      size={20}
                      className={
                        normalizeTitle(mobileTitle) === normalizeTitle(title)
                          ? "rotate-180"
                          : ""
                      }
                    />
                  </button>

                  {normalizeTitle(mobileTitle) === normalizeTitle(title) && (
                    <div className="max-h-[48vh] overflow-y-auto rounded-xl bg-white p-4 text-custom-blue shadow-inner">
                      {titleStateContent ||
                        groups.map((group) => (
                          <div key={group.label} className="mb-5 last:mb-0">
                            <div className="mb-3 rounded-full bg-custom-blue px-4 py-2 text-center font-lato text-xs font-extrabold uppercase text-white">
                              {group.label}
                            </div>

                            <div className="space-y-1">
                              {group.services.map((service) => (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-md px-3 py-2 font-lato text-sm font-extrabold leading-5 hover:bg-blue-50"
                                >
                                  {service.heading}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      {showMobilePromo && (
                        <div className="mt-5 rounded-2xl bg-custom-blue p-5 text-white">
                          <h3 className="font-anton text-2xl font-normal uppercase tracking-wide">
                            {layout.promoTitle}
                          </h3>

                          <p className="mt-4 font-lato text-sm font-extrabold leading-7 text-white/90">
                            {layout.promoText}
                          </p>

                          <div className="mt-5 space-y-2 font-lato text-sm font-extrabold">
                            {[
                              "Fast Registration",
                              "100% Online",
                              "Expert Support",
                              "Affordable Pricing",
                            ].map((item) => (
                              <div key={item} className="flex items-center gap-2">
                                <Check size={15} strokeWidth={3} />
                                {item}
                              </div>
                            ))}
                          </div>

                          <Link
                            href={promoHref}
                            onClick={() => setMobileOpen(false)}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-center font-lato text-sm font-extrabold text-custom-blue transition hover:bg-starttext"
                          >
                            {layout.buttonLabel}
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                );
              })}
          </div>

          <div className="border-t border-white/10 p-4 space-y-3">
            <button
              type="button"
              className="flex w-full items-center gap-2 text-left text-sm font-bold"
              onClick={() => {
                router.push("/");
                setMobileOpen(false);
              }}
            >
              <Home size={18} />
              Home
            </button>
            <button
              type="button"
              className="w-full text-left text-sm font-bold"
              onClick={() => {
                router.push("/blogs");
                setMobileOpen(false);
              }}
            >
              Blogs
            </button>
            <button
              type="button"
              className="w-full text-left text-sm font-bold"
              onClick={() => {
                router.push("/user/about");
                setMobileOpen(false);
              }}
            >
              About
            </button>
            <button
              type="button"
              className="w-full text-left text-sm font-bold"
              onClick={() => {
                router.push("/user/contact");
                setMobileOpen(false);
              }}
            >
              Contact
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout.mutate();
                  setMobileOpen(false);
                }}
                className="font-bold text-red-200"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="font-bold text-red-200"
              >
                Login
              </button>
            )}
          </div>
        </aside>
      </div>
    </nav>
  );
}
