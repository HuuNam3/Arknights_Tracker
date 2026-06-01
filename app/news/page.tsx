import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights News",
  description:
    "Tổng hợp tin tức Arknights, sự kiện sắp tới, login rewards và cập nhật mới nhất trên Global.",
  alternates: {
    canonical: "/news",
  },
};

export default function NewsPage() {
  return <GameUserPage initialActiveTab="events" initialToolsTab="pull-planner" />;
}
