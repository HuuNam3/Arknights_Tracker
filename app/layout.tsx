import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arknights-tool.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arknights Tracker",
    template: "%s | Arknights Tracker",
  },
  description:
    "Công cụ Arknights gồm pull planner, recruitment calculator, banner tracker, operator releases, tier list và lịch sử gacha trong một nơi.",
  applicationName: "Arknights Tracker",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Arknights Tracker",
    title: "Arknights Tracker",
    description:
      "Công cụ Arknights gồm pull planner, recruitment calculator, banner tracker, operator releases, tier list và lịch sử gacha trong một nơi.",
    locale: "vi_VN",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Arknights Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arknights Tracker",
    description:
      "Công cụ Arknights gồm pull planner, recruitment calculator, banner tracker, operator releases, tier list và lịch sử gacha trong một nơi.",
    images: ["/placeholder-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const copyrightYear = new Date().getFullYear();

  return (
    <html lang="vi" className="dark">
      <body className="bg-slate-50 font-sans antialiased">
        <div className="min-h-screen md:flex">
          <SiteHeader />
          <main className="flex min-h-screen min-w-0 flex-1 flex-col">
            <div className="flex-1">{children}</div>
            <footer className="border-t border-slate-200 bg-white p-2 text-center text-sm text-slate-500">
              © {copyrightYear} Nam. All rights reserved.
            </footer>
          </main>
        </div>
        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
