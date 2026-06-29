import type { Metadata } from "next";
import { SkinPlannerPage } from "@/components/skin-planner-page";

export const metadata: Metadata = {
  title: "Arknights Skin Planner",
  description:
    "Chọn outfit Arknights muốn mua, tính Originite Prime cần giữ, voucher áp dụng và số pull tương đương.",
  alternates: {
    canonical: "/tools/skin-planner",
  },
};

export default function SkinPlannerRoute() {
  return <SkinPlannerPage />;
}
