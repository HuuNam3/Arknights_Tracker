import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Recruitment Calculator",
  description:
    "Chọn tag recruitment, xem combo hợp lệ và operator có thể ra trong recruitment Arknights.",
  alternates: {
    canonical: "/tools/recruitment-calculator",
  },
};

export default function RecruitmentCalculatorPage() {
  return (
    <GameUserPage
      initialActiveTab="tools"
      initialToolsTab="recruitment"
      standaloneToolPage
    />
  );
}
