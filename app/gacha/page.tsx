import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Gacha History",
  description:
    "Tra cứu lịch sử gacha Arknights, lọc kết quả 6 sao và xem thống kê quay trên tài khoản của bạn.",
  alternates: {
    canonical: "/gacha",
  },
};

export default function GachaPage() {
  return <GameUserPage initialActiveTab="gacha" initialToolsTab="pull-planner" />;
}
