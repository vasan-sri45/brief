import { redirect } from "next/navigation";

export const metadata = {
  title: "Our Legal Services",
  alternates: {
    canonical: "/serviced",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ServicesIndexPage() {
  redirect("/serviced");
}
