"use client";

import { Wrench } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { PullPlannerTabContent } from "@/components/game-user-page/tabs/tools/pull-planner-tab-content";
import { RecruitmentTabContent } from "@/components/game-user-page/tabs/tools/recruitment-tab-content";

type ToolsTabContentProps = {
  initialToolsTab: string;
  pullPlannerProps: any;
  recruitmentProps: any;
  renderStandaloneToolPage: boolean;
};

export function ToolsTabContent({
  initialToolsTab,
  pullPlannerProps,
  recruitmentProps,
  renderStandaloneToolPage,
}: ToolsTabContentProps) {
  return (
    <>
      <Card
        className={
          renderStandaloneToolPage
            ? "border-0 bg-transparent shadow-none overflow-visible"
            : "glass-card border-0 shadow-sm overflow-hidden"
        }
      >
        {!renderStandaloneToolPage ? (
          <>
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500" />
            <CardHeader className="border-b border-sky-100/80 bg-gradient-to-r from-sky-50/75 to-white/55 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                <div className="rounded-lg border border-amber-200 bg-amber-100 p-2">
                  <Wrench className="h-6 w-6 text-amber-600" />
                </div>
                Tools
              </CardTitle>
              <CardDescription className="text-base text-slate-500">
                Tập hợp các công cụ tính toán và theo dõi nhanh để hỗ trợ quá trình chơi Arknights mỗi ngày.
              </CardDescription>
            </CardHeader>
          </>
        ) : null}
        <CardContent className={renderStandaloneToolPage ? "p-0" : "pt-4"}>
          <Tabs value={initialToolsTab} className={renderStandaloneToolPage ? "w-full" : "w-full space-y-6"}>
            {initialToolsTab === "pull-planner" ? (
              <PullPlannerTabContent {...pullPlannerProps} />
            ) : null}
            {initialToolsTab === "recruitment" ? (
              <RecruitmentTabContent {...recruitmentProps} />
            ) : null}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
