import type { Metadata } from "next";
import { OperatorPlannerPage } from "@/components/operator-planner-page";

export const metadata: Metadata = {
  title: "Arknights Operator Planner",
  description:
    "Chọn operator Arknights, đặt mục tiêu Elite, skill và mastery rồi tính vật liệu cần farm hoặc còn thiếu.",
  alternates: {
    canonical: "/tools/operator-planner",
  },
};

export default function OperatorPlannerRoute() {
  return <OperatorPlannerPage />;
}
