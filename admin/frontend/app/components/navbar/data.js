

// components/Navbar/data.js

export const navItems = [
  "Start Ups",
  "Intellectual Property",
  "Tax Filling",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services"
];

export const megaMenuData = {
  "Start Ups": {
    sections: [
      {
        title: "Company Registration",
        items: [
          { label: "Private Limited Company", slug: "company-incorporation" },
          { label: "Limited Liability Partnership", slug: "llp-incorporation" },
          { label: "One Person Company", slug: "company-incorporation" },
          { label: "Partnership Firm", slug: "company-incorporation" },
          { label: "Sole Proprietorship Firm", slug: "company-incorporation" },
        ],
      },
      {
        title: "Special Business Entities",
        items: [
          { label: "Register on Indian Subsidiary", slug: "company-incorporation" },
          { label: "Section 8 Company Registration", slug: "company-incorporation" },
          { label: "Producer Company Registration", slug: "company-incorporation" },
        ],
      },
      {
        title: "General Registration",
        items: [
          { label: "Association Registration", slug: "company-incorporation" },
          { label: "Trust Registration", slug: "company-incorporation" },
          { label: "Society Registration", slug: "company-incorporation" },
        ],
      },
    ],
    promotion: {
      title: "Start Up Package",
      description:
        "Get your business registered quickly with our comprehensive startup package including all necessary documentation and compliance.",
      buttonText: "Book Slot →",
    },
  },

  "Intellectual Property": {
    sections: [
      {
        title: "Tax Registration",
        items: [
          { label: "GST Registration", slug: "gst-registration" },
          { label: "Income Tax Registration", slug: "income-tax-filing" },
          {
            label: "Professional Tax Registration",
            slug: "professional-tax-registration",
          },
          { label: "TDS Registration", slug: "tds-filing" },
          { label: "Import Export Code", slug: "import-export-code" },
        ],
      },
      {
        title: "Tax Filing",
        items: [
          { label: "GST Return Filing", slug: "gst-filing" },
          { label: "Income Tax Return Filing", slug: "income-tax-filing" },
          { label: "TDS Return Filing", slug: "tds-filing" },
          { label: "Annual Compliance", slug: "roc-annual-filing" },
        ],
      },
      {
        title: "Compliance Services",
        items: [
          { label: "ROC Compliance", slug: "roc-annual-filing" },
          { label: "Labor Law Compliance", slug: "professional-tax-registration" },
          { label: "Environmental Compliance", slug: "roc-annual-filing" },
        ],
      },
    ],
    promotion: {
      title: "Tax Compliance Package",
      description:
        "Stay compliant with all tax regulations. Our experts handle GST, Income Tax, and all statutory filings for your business.",
      buttonText: "Get Started →",
    },
  },

  "Tax Filling": {
    sections: [
      {
        title: "Trademark Services",
        items: [
          { label: "Trademark Registration", slug: "trademark-registration" },
          { label: "Trademark Search", slug: "trademark-search" },
          { label: "Trademark Renewal", slug: "trademark-renewal" },
          { label: "Trademark Opposition", slug: "trademark-opposition" },
          { label: "Madrid Protocol Filing", slug: "madrid-protocol-filing" },
        ],
      },
      {
        title: "Copyright & Patents",
        items: [
          { label: "Copyright Registration", slug: "copyright-registration" },
          { label: "Patent Filing", slug: "patent-filing" },
          { label: "Design Registration", slug: "design-registration" },
          { label: "Patent Search", slug: "patent-search" },
        ],
      },
      {
        title: "IP Protection",
        items: [
          { label: "IP Portfolio Management", slug: "ip-portfolio-management" },
          { label: "Infringement Analysis", slug: "infringement-analysis" },
          { label: "Licensing Agreements", slug: "licensing-agreements" },
        ],
      },
    ],
    promotion: {
      title: "IP Protection Suite",
      description:
        "Protect your innovations and brand identity with our comprehensive intellectual property services and expert guidance.",
      buttonText: "Protect Now →",
    },
  },

  "MCA Compliance": {
    sections: [
      {
        title: "Business Agreements",
        items: [
          { label: "Partnership Agreements", slug: "service-agreement" },
          { label: "Service Agreements", slug: "service-agreement" },
          { label: "Employment Contracts", slug: "employment-agreement" },
          { label: "Non-Disclosure Agreements", slug: "mutual-nda" },
          { label: "Vendor Agreements", slug: "service-agreement" },
        ],
      },
      {
        title: "Corporate Documents",
        items: [
          { label: "Board Resolutions", slug: "service-agreement" },
          { label: "Shareholder Agreements", slug: "founders-agreement" },
          { label: "Articles of Association", slug: "service-agreement" },
          { label: "Memorandum of Association", slug: "service-agreement" },
        ],
      },
      {
        title: "Legal Notices",
        items: [
          { label: "Legal Notice Drafting", slug: "legal-consultation" },
          { label: "Demand Notices", slug: "legal-consultation" },
          { label: "Cease & Desist Letters", slug: "legal-consultation" },
        ],
      },
    ],
    promotion: {
      title: "Legal Document Package",
      description:
        "Get professionally drafted legal documents tailored to your business needs with expert legal review and guidance.",
      buttonText: "Draft Now →",
    },
  },

  "Registration": {
    sections: [
      {
        title: "Financial Services",
        items: [
          { label: "Business Loan Assistance" },
          { label: "Working Capital Finance" },
          { label: "Equipment Financing" },
          { label: "Invoice Discounting" },
          { label: "Credit Rating Services" },
        ],
      },
      {
        title: "Business Consulting",
        items: [
          { label: "Business Plan Development" },
          { label: "Market Research" },
          { label: "Financial Planning" },
          { label: "Risk Assessment" },
        ],
      },
      {
        title: "Digital Services",
        items: [
          { label: "Website Development" },
          { label: "Digital Marketing" },
          { label: "E-commerce Setup" },
        ],
      },
    ],
    promotion: {
      title: "Business Growth Package",
      description:
        "Accelerate your business growth with our comprehensive support services including financing, consulting, and digital solutions.",
      buttonText: "Grow Business →",
    },
  },

  "Legal Advisory & Agreement": {
    sections: [
      {
        title: "Our Company",
        items: [
          { label: "Company Overview" },
          { label: "Mission & Vision" },
          { label: "Leadership Team" },
          { label: "Awards & Recognition" },
          { label: "Client Testimonials" },
        ],
      },
      {
        title: "Our Services",
        items: [
          { label: "Service Portfolio" },
          { label: "Industry Expertise" },
          { label: "Success Stories" },
          { label: "Case Studies" },
        ],
      },
      {
        title: "Contact & Support",
        items: [
          { label: "Contact Information" },
          { label: "Office Locations" },
          { label: "Customer Support" },
          { label: "Career Opportunities" },
        ],
      },
    ],
    promotion: {
      title: "Why Choose Us?",
      description:
        "With over 10 years of experience, we have helped thousands of businesses achieve their goals with expert guidance and support.",
      buttonText: "Learn More →",
    },
  },

   "Other Services": {
    sections: [
      {
        title: "Our Company",
        items: [
          { label: "Company Overview" },
          { label: "Mission & Vision" },
          { label: "Leadership Team" },
          { label: "Awards & Recognition" },
          { label: "Client Testimonials" },
        ],
      },
      {
        title: "Our Services",
        items: [
          { label: "Service Portfolio" },
          { label: "Industry Expertise" },
          { label: "Success Stories" },
          { label: "Case Studies" },
        ],
      },
      {
        title: "Contact & Support",
        items: [
          { label: "Contact Information" },
          { label: "Office Locations" },
          { label: "Customer Support" },
          { label: "Career Opportunities" },
        ],
      },
    ],
    promotion: {
      title: "Why Choose Us?",
      description:
        "With over 10 years of experience, we have helped thousands of businesses achieve their goals with expert guidance and support.",
      buttonText: "Learn More →",
    },
  },
};
