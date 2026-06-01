import type { Metadata } from "next";
import Script from "next/script";
import { HomeLanding } from "@/components/home-landing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arknights-tool.vercel.app";

export const metadata: Metadata = {
  title: "Arknights Tools Home",
  description:
    "Trang chủ tổng hợp các công cụ Arknights như Pull Planner, Recruitment Calculator, Banner Tracker, Characters, Tier List và Gacha History.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arknights Tracker",
    url: siteUrl,
    description:
      "Trang chủ tổng hợp các công cụ Arknights như Pull Planner, Recruitment Calculator, Banner Tracker, Characters, Tier List và Gacha History.",
    inLanguage: "vi-VN",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Arknights Tracker",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Pull Planner",
        "Recruitment Calculator",
        "Banner Tracker",
        "Operator Releases",
        "Tier List",
        "Gacha History",
      ],
    },
  };

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeLanding />
    </>
  );
}
