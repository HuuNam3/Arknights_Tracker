import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Tier List",
  description:
    "Sắp xếp operator Arknights theo tier list, tìm nhanh theo rarity và lưu các bộ xếp hạng của bạn.",
  alternates: {
    canonical: "/tier-list",
  },
};

export default function TierListPage() {
  return <GameUserPage initialActiveTab="tierlist" initialToolsTab="pull-planner" />;
}
