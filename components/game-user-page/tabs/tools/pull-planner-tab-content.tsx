"use client";

import { AlertCircle, Diamond } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

type PullPlannerTabContentProps = {
  TOOL_ICON_URLS: Record<string, string>;
  getPlannerResourceCardClassName: (resource: string) => string;
  getPlannerSourceCardClassName: (label: string) => string;
  handlePullPlannerChange: (field: string, value: string | boolean) => void;
  plannerAnnihilationUndoneMaps: number;
  plannerCurrentLeftoverOrundum: number;
  plannerIntelligenceCertificates: number;
  plannerIntelligenceOrundum: number;
  plannerCurrentOrundum: number;
  plannerCurrentPulls: number;
  plannerDaysUntilBanner: number;
  plannerMonthsUntilBanner: number;
  plannerOrundum: number;
  plannerPermits: number;
  plannerPrime: number;
  plannerProjectedBannerLeftoverOrundum: number;
  plannerProjectedBannerPulls: number;
  plannerProjectedTransferableLeftoverOrundum: number;
  plannerProjectedTransferablePulls: number;
  plannerReachableShopMonths: number;
  plannerShardOrundum: number;
  plannerShards: number;
  plannerStableBreakdown: Array<{
    detail: string;
    freePulls: number;
    label: string;
    orundum: number;
    permits: number;
    scope: string;
  }>;
  plannerTargetOnlyPulls: number;
  plannerWeeksUntilBanner: number;
  pullPlanner: any;
  pullPlannerTargets: any[];
  selectedPullPlannerTarget: any | null;
};

export function PullPlannerTabContent({
  TOOL_ICON_URLS,
  getPlannerResourceCardClassName,
  getPlannerSourceCardClassName,
  handlePullPlannerChange,
  plannerAnnihilationUndoneMaps,
  plannerCurrentLeftoverOrundum,
  plannerIntelligenceCertificates,
  plannerIntelligenceOrundum,
  plannerCurrentOrundum,
  plannerCurrentPulls,
  plannerDaysUntilBanner,
  plannerMonthsUntilBanner,
  plannerOrundum,
  plannerPermits,
  plannerPrime,
  plannerProjectedBannerLeftoverOrundum,
  plannerProjectedBannerPulls,
  plannerProjectedTransferableLeftoverOrundum,
  plannerProjectedTransferablePulls,
  plannerReachableShopMonths,
  plannerShardOrundum,
  plannerShards,
  plannerStableBreakdown,
  plannerTargetOnlyPulls,
  plannerWeeksUntilBanner,
  pullPlanner,
  pullPlannerTargets,
  selectedPullPlannerTarget,
}: PullPlannerTabContentProps) {
  const plannerResourceInputs = [
    {
      field: "orundum",
      label: "Orundum",
      icon: TOOL_ICON_URLS.orundum,
      note: "600 Orundum = 1 pull",
      cardClassName: "border-cyan-200 bg-cyan-50",
      inputClassName: "border-cyan-200 bg-white",
    },
    {
      field: "originitePrime",
      label: "Originite Prime",
      icon: TOOL_ICON_URLS.originitePrime,
      note: "1 OP = 180 Orundum",
      cardClassName: "border-amber-200 bg-amber-50",
      inputClassName: "border-amber-200 bg-white",
    },
    {
      field: "permits",
      label: "Headhunting Permit",
      icon: TOOL_ICON_URLS.headhuntingPermit,
      note: "1 permit = 1 pull",
      cardClassName: "border-emerald-200 bg-emerald-50",
      inputClassName: "border-emerald-200 bg-white",
    },
    {
      field: "originiumShards",
      label: "Originium Shard",
      icon: TOOL_ICON_URLS.originiumShard,
      note: "60 shard = 1 pull",
      cardClassName: "border-violet-200 bg-violet-50",
      inputClassName: "border-violet-200 bg-white",
    },
  ] as const;

  return (
    <TabsContent value="pull-planner" className="mt-0 focus-visible:outline-none">
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-amber-200 bg-amber-100 p-2.5">
              <Diamond className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">Pull Planner</p>
              <p className="mt-1 text-sm text-slate-500">
              Tính pull hiện có và ước tính số pull tích lũy được tới banner mục tiêu.
              </p>
            </div>
          </div>
        </div>

        {pullPlannerTargets.length > 0 ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Banner mục tiêu</label>
            <select
              value={selectedPullPlannerTarget?.id ?? ""}
              onChange={(e) => handlePullPlannerChange("currentBannerKey", e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800"
            >
              {pullPlannerTargets.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.name} - {target.dateLabel}
                  {target.isPredicted ? " (Dự đoán)" : " (Đã xác nhận)"}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Alert className="rounded-xl border-slate-200 bg-slate-50 text-slate-700">
            <AlertCircle className="h-5 w-5 text-slate-500" />
            <AlertDescription className="ml-2 text-sm">
              Chưa có banner tương lai để lên kế hoạch.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            Nhập tài nguyên hiện có của bạn, gồm cả cert, để quy đổi pull hiện tại và
            tính phần shop trước banner.
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-7">
            {plannerResourceInputs.map(
              ({ field, label, icon, note, cardClassName, inputClassName }) => (
              <div
                key={field}
                className={`space-y-2 rounded-2xl border p-3 shadow-sm ${cardClassName}`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={icon}
                    alt={label}
                    className="size-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                </div>
                <Input
                  type="number"
                  min={0}
                  value={pullPlanner[field]}
                  onChange={(e) => handlePullPlannerChange(field, e.target.value)}
                  placeholder={label}
                  className={`rounded-xl ${inputClassName}`}
                />
                <p className="text-[11px] leading-4 text-slate-500">{note}</p>
              </div>
              ),
            )}

            <div className="space-y-2 rounded-2xl border border-lime-200 bg-lime-50 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <img
                  src={TOOL_ICON_URLS.commendationCertificate}
                  alt="Commendation Certificate"
                  className="size-5 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-sm font-semibold text-slate-800">Commendations</p>
              </div>
              <Input
                type="number"
                min={0}
                value={pullPlanner.commendations}
                onChange={(e) => handlePullPlannerChange("commendations", e.target.value)}
                placeholder="Commendations"
                className="rounded-xl border-lime-200 bg-white"
              />
              <p className="text-[11px] leading-4 text-slate-500">
                Tính phần mua roll trong Commendation shop
              </p>
              <div className="grid grid-cols-3 gap-1">
                {([
                  ["phase1", "P1"],
                  ["phase2", "P2"],
                  ["phase3", "P3"],
                ] as const).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handlePullPlannerChange("commendationShopMode", mode)}
                    className={`rounded-lg border px-2 py-1 text-[10px] font-semibold transition-colors ${
                      pullPlanner.commendationShopMode === mode
                        ? "border-lime-300 bg-lime-100 text-lime-700"
                        : "border-lime-200 bg-white text-slate-500 hover:border-lime-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] leading-4 text-slate-500">
                {pullPlanner.commendationShopMode === "phase1"
                  ? "Chỉ lấy phần roll ở Phase 1 mỗi tháng."
                  : pullPlanner.commendationShopMode === "phase2"
                    ? "Nếu đủ clear shop tháng đó, planner sẽ xuống Phase 2 để lấy thêm permit."
                    : "Nếu đủ clear hết Phase 1 và 2, phần cert dư sẽ đổi Orundum ở Phase 3."}
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-yellow-200 bg-yellow-50 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <img
                  src={TOOL_ICON_URLS.distinctionCertificate}
                  alt="Distinction Certificate"
                  className="size-5 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-sm font-semibold text-slate-800">Distinctions</p>
              </div>
              <Input
                type="number"
                min={0}
                value={pullPlanner.distinctions}
                onChange={(e) => handlePullPlannerChange("distinctions", e.target.value)}
                placeholder="Distinctions"
                className="rounded-xl border-yellow-200 bg-white"
              />
              <p className="text-[11px] leading-4 text-slate-500">
                Tính permit mua được trong Distinction shop
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <img
                  src={TOOL_ICON_URLS.intelligenceCertificate}
                  alt="Intelligence Certificate"
                  className="size-5 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-sm font-semibold text-slate-800">Intelligence Certificate</p>
              </div>
              <Input
                type="number"
                min={0}
                value={pullPlanner.intelligenceCertificates}
                onChange={(e) =>
                  handlePullPlannerChange("intelligenceCertificates", e.target.value)
                }
                placeholder="Intelligence Certificate"
                className="rounded-xl border-rose-200 bg-white"
              />
              <p className="text-[11px] leading-4 text-slate-500">
                Orundum in Stock: 20 cert = 100 Orundum
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-sky-200 bg-sky-50 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800">Annihilation mỗi tuần</p>
              </div>
              <Input
                type="number"
                min={0}
                max={1800}
                value={pullPlanner.weeklyRegularOrundum}
                onChange={(e) => handlePullPlannerChange("weeklyRegularOrundum", e.target.value)}
                placeholder="0 - 1800"
                className="rounded-xl border-sky-200 bg-white"
              />
              <p className="text-[11px] leading-4 text-slate-500">
                Nhập lượng Orundum mỗi tuần bạn chắc chắn lấy được, tối đa 1800.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "dailyMissionEnabled",
              "Daily mission",
              "100 Orundum / ngày",
              "Bật nếu bạn sẽ làm đủ daily mỗi ngày tới banner.",
            ],
            [
              "weeklyMissionEnabled",
              "Weekly mission",
              "500 Orundum / tuần",
              "Bật nếu bạn sẽ làm đủ weekly mỗi tuần tới banner.",
            ],
            [
              "monthlySignInEnabled",
              "Sign-in tháng",
              "1 permit ở mốc ngày 17",
              "Bật nếu bạn đăng nhập đủ 17 ngày trong một tháng trước banner.",
            ],
            [
              "monthlyCardEnabled",
              "Thẻ tháng",
              "200 Orundum / ngày",
              "Bật nếu Monthly Card của bạn còn hiệu lực tới banner.",
            ],
            [
              "eventRewardsEnabled",
              "Đăng nhập sự kiện limit",
              "Tách riêng free pull/vé khóa banner và Orundum tích trữ được",
              "Bật nếu bạn sẽ đăng nhập trong các sự kiện limit/collab trước và tới banner target.",
            ],
          ].map(([field, title, subtitle, detail]) => (
            <label
              key={field}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4"
            >
              <input
                type="checkbox"
                checked={pullPlanner[field]}
                onChange={(e) => handlePullPlannerChange(field, e.target.checked)}
                className="size-4 accent-amber-600"
              />
              <div>
                <p className="font-semibold text-slate-800">{title}</p>
                <p className="text-sm text-slate-500">{subtitle}</p>
                <p className="mt-1 text-xs text-slate-400">{detail}</p>
              </div>
            </label>
          ))}

          <label className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
            <input
              type="checkbox"
              checked={pullPlanner.eventShopEnabled}
              disabled={!pullPlanner.eventRewardsEnabled}
              onChange={(e) => handlePullPlannerChange("eventShopEnabled", e.target.checked)}
              className="size-4 accent-amber-600 disabled:opacity-50"
            />
            <div>
              <p className="font-semibold text-slate-800">Đổi shop sự kiện</p>
              <p className="text-sm text-slate-500">Event thường 3 roll, limit/collab 5 roll</p>
              <p className="mt-1 text-xs text-slate-400">
                Bật nếu bạn sẽ farm đủ currency để lấy phần roll trong shop sự kiện.
              </p>
            </div>
          </label>

          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="hidden">
            <p className="mb-2 font-semibold text-slate-800">Annihilation mỗi tuần</p>
            <Input
              type="number"
              min={0}
              max={1800}
              value={pullPlanner.weeklyRegularOrundum}
              onChange={(e) => handlePullPlannerChange("weeklyRegularOrundum", e.target.value)}
              placeholder="0 - 1800"
              className="rounded-xl border-slate-200 bg-white"
            />
            <p className="mt-2 text-xs text-slate-500">
              Nhập lượng Orundum mỗi tuần bạn chắc chắn lấy được, tối đa 1800.
            </p>
            </div>
            <div className="pt-0">
              <p className="mb-2 font-semibold text-slate-800">Map Annihilation chưa đánh</p>
              <Input
                type="number"
                min={0}
                value={pullPlanner.annihilationUndoneMaps}
                onChange={(e) =>
                  handlePullPlannerChange("annihilationUndoneMaps", e.target.value)
                }
                placeholder="Số map chưa clear lần đầu"
                className="rounded-xl border-slate-200 bg-white"
              />
              <p className="mt-2 text-xs text-slate-500">
                Tính 1500 Orundum cho mỗi map Annihilation chưa clear lần đầu.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-slate-800">Chi tiet nguon tich luy truoc banner</p>
            <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
              {plannerReachableShopMonths} ky shop truoc banner
            </Badge>
          </div>
          <div className="space-y-2 rounded-xl border border-slate-100 bg-white px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-800">Tài nguyên hiện tại</p>
              <p className="whitespace-nowrap text-xs text-slate-600">{plannerCurrentPulls} pull hiện có</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 md:grid-cols-5">
              <div className={getPlannerResourceCardClassName("Orundum")}>
                <p className="text-slate-500">Orundum</p>
                <p className="font-semibold text-slate-800">{plannerOrundum}</p>
                <p className="mt-1 text-slate-500">= {Math.floor(plannerOrundum / 600)} pull</p>
              </div>
              <div className={getPlannerResourceCardClassName("Originite Prime")}>
                <p className="text-slate-500">Originite Prime</p>
                <p className="font-semibold text-slate-800">{plannerPrime} OP = {plannerPrime * 180} Orundum</p>
                <p className="mt-1 text-slate-500">
                  = {Math.floor((plannerPrime * 180) / 600)} pull
                </p>
              </div>
              <div className={getPlannerResourceCardClassName("Headhunting Permit")}>
                <p className="text-slate-500">Headhunting Permit</p>
                <p className="font-semibold text-slate-800">{plannerPermits} permit</p>
                <p className="mt-1 text-slate-500">= {plannerPermits} pull</p>
              </div>
              <div className={getPlannerResourceCardClassName("Originium Shard")}>
                <p className="text-slate-500">Originium Shard</p>
                <p className="font-semibold text-slate-800">
                  {plannerShards} shard = {plannerShardOrundum} Orundum
                </p>
                <p className="mt-1 text-slate-500">
                  = {Math.floor(plannerShardOrundum / 600)} pull
                </p>
              </div>
              <div className={getPlannerResourceCardClassName("Intelligence Certificate")}>
                <p className="text-slate-500">Intelligence Certificate</p>
                <p className="font-semibold text-slate-800">
                  {plannerIntelligenceCertificates} cert = {plannerIntelligenceOrundum} Orundum
                </p>
                <p className="mt-1 text-slate-500">
                  = {Math.floor(plannerIntelligenceOrundum / 600)} pull
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Tổng quy đổi hiện tại: {plannerCurrentOrundum} Orundum + {plannerPermits} permit,
              còn dư {plannerCurrentLeftoverOrundum} Orundum sau quy đổi pull.
            </p>
          </div>
          <div className="space-y-2">
            {plannerStableBreakdown.map((source) => (
              <div
                key={`${source.label}-${source.detail}`}
                className={getPlannerSourceCardClassName(source.label)}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-800">{source.label}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        source.scope === "target-only"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {source.scope === "target-only" ? "Chỉ banner target" : "Mang sang được"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{source.detail}</p>
                </div>
                <div className="whitespace-nowrap text-right text-xs text-slate-600">
                  <p>+{source.orundum} Orundum</p>
                  <p>+{source.permits} permit</p>
                  {source.freePulls > 0 ? <p>+{source.freePulls} free pull</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Pull hiện có</p>
            <p className="mt-1 text-2xl font-black text-slate-800">{plannerCurrentPulls}</p>
            <p className="mt-2 text-xs text-slate-500">Từ kho hiện tại, chưa tính phần farm thêm.</p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Pull mang sang được</p>
            <p className="mt-1 text-2xl font-black text-sky-700">{plannerProjectedTransferablePulls}</p>
            <p className="mt-2 text-xs text-slate-500">
              Bao gồm Orundum/permit tích trữ tới banner, còn dư {plannerProjectedTransferableLeftoverOrundum} Orundum sau quy đổi.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Tổng dùng trên banner target</p>
            <p className="mt-1 text-2xl font-black text-amber-600">{plannerProjectedBannerPulls}</p>
            <p className="mt-2 text-xs text-slate-500">
              Gồm {plannerProjectedTransferablePulls} pull mang sang được + {plannerTargetOnlyPulls} pull khóa trên banner target, còn dư {plannerProjectedBannerLeftoverOrundum} Orundum quy đổi.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-slate-800">Gợi ý kiếm thêm Orundum</p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Paradox Simulation:</span> vào hồ sơ
              operator đủ điều kiện mở Paradox Simulation, clear lần đầu để nhận 200 Orundum mỗi
              màn. Nguồn này không tự dự đoán theo thời gian, nên khi nhận xong bạn cộng tay vào ô
              Orundum hiện có.
            </p>
            <p>
              <span className="font-semibold text-slate-800">Orundum in Stock:</span> là gói
              Orundum trong <span className="font-semibold">Store &gt; Certificate &gt; Intelligence</span>.
              Bạn dùng Intelligence Certificate kiếm từ rerun event để đổi; planner này đang tính
              theo tỷ lệ 20 cert = 100 Orundum.
            </p>
            <p>
              <span className="font-semibold text-slate-800">Annihilation chưa clear:</span> nếu
              còn map Annihilation chưa đánh lần đầu, nhập số map vào ô phía trên để planner cộng
              thêm 1500 Orundum mỗi map.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          {selectedPullPlannerTarget
            ? `Tính từ hôm nay tới ${selectedPullPlannerTarget.name} còn ${plannerDaysUntilBanner} ngày, tương đương ${plannerWeeksUntilBanner} tuần tròn và xấp xỉ ${plannerMonthsUntilBanner.toFixed(1)} tháng để cộng nguồn ổn định. Pull "mang sang được" là số an toàn để quyết định save; free pull hoặc vé khóa banner chỉ được cộng ở ô tổng dùng trên banner target.`
            : "Chọn một banner tương lai để bắt đầu tính."}
        </p>
      </div>
    </TabsContent>
  );
}
