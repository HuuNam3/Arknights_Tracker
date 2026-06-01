import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Characters",
  description:
    "Theo dõi danh sách operator Arknights, ngày release Global, độ hiếm và tìm kiếm nhanh theo tên.",
  alternates: {
    canonical: "/characters",
  },
};

export default function CharactersPage() {
  return <GameUserPage initialActiveTab="characters" initialToolsTab="pull-planner" />;
}
