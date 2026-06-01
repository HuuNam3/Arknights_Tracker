import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Banners",
  description:
    "Xem banner Arknights đã ra và sắp tới, so sánh limited, dự đoán release và tìm nhanh operator trên banner.",
  alternates: {
    canonical: "/banners",
  },
};

export default function BannersPage() {
  return <GameUserPage initialActiveTab="banners" initialToolsTab="pull-planner" />;
}
