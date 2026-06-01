import type { Metadata } from "next";
import { GameUserPage } from "@/components/game-user-page";

export const metadata: Metadata = {
  title: "Arknights Pull Planner",
  description:
    "Tính pull hiện có, orundum, permit, cert shop và nguồn tích lũy trước banner mục tiêu trong Arknights.",
  alternates: {
    canonical: "/tools/pull-planner",
  },
};

export default function PullPlannerPage() {
  return (
    <GameUserPage
      initialActiveTab="tools"
      initialToolsTab="pull-planner"
      standaloneToolPage
    />
  );
}
