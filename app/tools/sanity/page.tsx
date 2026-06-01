import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Sanity Tracker",
  description:
    "Theo dõi sanity hiện tại, tốc độ hồi phục và mốc full sanity cho tài khoản Arknights.",
  alternates: {
    canonical: "/tools/sanity",
  },
};

export default function SanityPage() {
  return <GameUserPage initialActiveTab="tools" initialToolsTab="sanity" standaloneToolPage />;
}
