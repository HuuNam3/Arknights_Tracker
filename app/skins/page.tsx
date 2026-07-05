import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Skins sắp ra mắt",
  description:
    "Xem danh sách outfit sắp được mở bán tại Outfit Store trên Global server, bao gồm new arrivals và re-edition.",
  alternates: {
    canonical: "/skins",
  },
};

export default function SkinsPage() {
  return <GameUserPage initialActiveTab="skins" initialToolsTab="pull-planner" />;
}
