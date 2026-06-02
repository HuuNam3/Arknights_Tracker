"use client";

import { AlertCircle, Diamond } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { TabsContent } from "@/components/ui/tabs";

const MIN_WEEKLY_ANNIHILATION_ORUNDUM = 1200;
const MAX_WEEKLY_ANNIHILATION_ORUNDUM = 1800;
const WEEKLY_ANNIHILATION_ORUNDUM_STEP = 50;
const COMMENDATION_ORUNDUM_BUNDLE_SIZE = 100;
const COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_SIZE = 30;
const DISTINCTION_SHOP_BATCH_PERMITS = [1, 2, 5, 10, 20] as const;
const WEEKDAY_LABELS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
] as const;

const ORUNDUM_FARMING_SUGGESTIONS = [
  {
    title: "OP first-clear",
    description:
      "Clear stage mới hoặc stage còn sót để lấy Originite Prime lần đầu; nếu cần pull gấp có thể quy đổi 1 OP = 180 Orundum.",
  },
  {
    title: "Challenge Mode OP",
    description:
      "Rà lại story/event stage có Challenge Mode chưa clear; mỗi CM thường cho thêm 1 OP để quy đổi khi thiếu pull.",
  },
  {
    title: "Terminal event cũ",
    description:
      "Các event đã vào Terminal vẫn còn OP first-clear nếu bạn chưa đánh hết normal/ex/challenge stage.",
  },
  {
    title: "Annihilation chưa clear",
    description:
      "Vào Annihilation kiểm tra map nào chưa lấy hết mốc first-clear; nếu còn thì đánh đủ mốc kill để nhận Orundum một lần.",
  },
  {
    title: "Paradox Simulation",
    description:
      "Vào hồ sơ operator đã đủ điều kiện mở Paradox Simulation; clear lần đầu nhận 200 Orundum mỗi màn.",
  },
  {
    title: "Tutorial / Training",
    description:
      "Rà lại các màn hướng dẫn, Training Grounds hoặc tutorial stage còn dấu thưởng; nếu chưa clear lần đầu thì vào lấy phần thưởng còn sót.",
  },
  {
    title: "Distinction Store permit",
    description:
      "Yellow cert shop có Headhunting Permit và Ten-pull Permit reset theo tháng; mua đủ cả chuỗi khi có nhiều Distinction Certificate.",
  },
  {
    title: "Monthly sign-in permit",
    description:
      "Lịch đăng nhập tháng thường có Headhunting Permit; nhớ claim đều vì đây là permit trực tiếp, không cần đổi Orundum.",
  },
  {
    title: "Event shop permit",
    description:
      "Nhiều event shop bán Headhunting Permit bằng event currency, thường là nguồn permit dễ bỏ sót nếu chỉ farm vật liệu.",
  },
  {
    title: "Limited-banner freebies",
    description:
      "Limited/Celebration banner hay có free daily pull, vé 10-pull riêng banner hoặc mini-game Orundum như mining/lucky strip.",
  },
  {
    title: "Maintenance mail",
    description:
      "Nhận mail bồi thường bảo trì, lỗi hoặc downtime; phần thưởng thường là Orundum và có thể hết hạn nếu để quá lâu.",
  },
  {
    title: "Web event / livestream",
    description:
      "Theo dõi web event, survey, livestream reward và redeem code vì đôi khi có Orundum, OP, permit hoặc mail quà.",
  },
  {
    title: "Kernel permit",
    description:
      "Universal Certificate từ Kernel banner đổi được Kernel Headhunting Permit, nhưng chỉ dùng cho Kernel/rate-up tương ứng.",
  },
  {
    title: "Paid pack permit",
    description:
      "Starter/Monthly Headhunting Pack có Ten-pull Permit; chỉ tính nếu bạn thật sự mua pack, không phải nguồn F2P.",
  },
  {
    title: "Pro Enhancement Pack",
    description:
      "Nếu còn pack level mua bằng OP, pack trả Orundum ngang lượng OP quy đổi kèm vật liệu, thường tốt hơn đổi OP thẳng.",
  },
] as const;

type PullPlannerTabContentProps = {
  TOOL_ICON_URLS: Record<string, string>;
  getPlannerResourceCardClassName: (resource: string) => string;
  getPlannerSourceCardClassName: (label: string) => string;
  handlePullPlannerChange: (field: string, value: string | boolean) => void;
  plannerAnnihilationUndoneMaps: number;
  plannerCurrentLeftoverOrundum: number;
  plannerCommendationShopBreakdown: Array<{
    month: number;
    orundum: number;
    phase1OrundumBundles: number;
    phase1Permits: number;
    phase2Permits: number;
    phase3Bundles: number;
    permits: number;
    spent: number;
  }>;
  plannerDistinctionShopBreakdown: Array<{
    batches: number[];
    month: number;
    permits: number;
    spent: number;
  }>;
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
  plannerReachableCommendationShopMonths: number;
  plannerReachableDistinctionShopMonths: number;
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
  plannerCommendationShopBreakdown,
  plannerDistinctionShopBreakdown,
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
  plannerReachableCommendationShopMonths,
  plannerReachableDistinctionShopMonths,
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
  const parsedWeeklyRegularOrundum = Number.parseInt(
    pullPlanner.weeklyRegularOrundum,
    10,
  );
  const normalizedWeeklyRegularOrundum = Number.isNaN(parsedWeeklyRegularOrundum)
    ? MAX_WEEKLY_ANNIHILATION_ORUNDUM
    : Math.min(
        MAX_WEEKLY_ANNIHILATION_ORUNDUM,
        Math.max(
          MIN_WEEKLY_ANNIHILATION_ORUNDUM,
          Math.round(parsedWeeklyRegularOrundum / WEEKLY_ANNIHILATION_ORUNDUM_STEP) *
            WEEKLY_ANNIHILATION_ORUNDUM_STEP,
        ),
      );

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

  type WeeklyPullTimelineRow = {
    detail: string;
    orundum: number;
    permits: number;
    task: string;
  };

  const buildWeeklypullRows = (dayCount: number, includeWeeklyReset: boolean) =>
    [
      pullPlanner.dailyMissionEnabled
        ? {
            task: "Daily mission",
            detail: `${dayCount} ngày x 100 = ${dayCount * 100} Orundum`,
            orundum: dayCount * 100,
            permits: 0,
          }
        : null,
      includeWeeklyReset && pullPlanner.weeklyMissionEnabled
        ? {
            task: "Weekly mission",
            detail: "Hoàn thành mốc tuần = 500 Orundum",
            orundum: 500,
            permits: 0,
          }
        : null,
      includeWeeklyReset
        ? {
            task: "Annihilation weekly cap",
            detail: `Lấy đủ cap tuần đang chọn = ${normalizedWeeklyRegularOrundum} Orundum`,
            orundum: normalizedWeeklyRegularOrundum,
            permits: 0,
          }
        : null,
      pullPlanner.monthlyCardEnabled
        ? {
            task: "Monthly card",
            detail: `${dayCount} ngày x 200 = ${dayCount * 200} Orundum`,
            orundum: dayCount * 200,
            permits: 0,
          }
        : null,
    ].filter((row): row is WeeklyPullTimelineRow => row !== null);

  const formatCommendationWeekDetail = (
    breakdown: PullPlannerTabContentProps["plannerCommendationShopBreakdown"][number],
  ) => {
    const parts: string[] = [];

    if (breakdown.phase1Permits > 0 || breakdown.phase1OrundumBundles > 0) {
      const phase1Orundum =
        breakdown.phase1OrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
      parts.push(
        `P1: ${breakdown.phase1Permits} permit${
          phase1Orundum > 0 ? ` + ${phase1Orundum} Orundum` : ""
        }`,
      );
    }

    if (breakdown.phase2Permits > 0) {
      parts.push(`P2: ${breakdown.phase2Permits} permit`);
    }

    if (breakdown.phase3Bundles > 0) {
      parts.push(
        `P3: ${
          breakdown.phase3Bundles * COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_SIZE
        } Orundum`,
      );
    }

    const totalOrundum = breakdown.orundum + breakdown.permits * 600;

    return `Kỳ ${breakdown.month}: ${parts.join(" | ") || "không có mục mua"}; tốn ${
      breakdown.spent
    } cert; quy đổi ${totalOrundum} Orundum = ${Math.floor(totalOrundum / 600)} pull${
      totalOrundum % 600 > 0 ? ` + dư ${totalOrundum % 600} Orundum` : ""
    }`;
  };

  const formatDistinctionWeekDetail = (
    breakdown: PullPlannerTabContentProps["plannerDistinctionShopBreakdown"][number],
  ) => {
    const batches = breakdown.batches
      .map((count, index) => {
        const permits = DISTINCTION_SHOP_BATCH_PERMITS[index] ?? 0;

        return count > 0 ? `${permits} permit x${count}` : null;
      })
      .filter((value): value is string => value !== null)
      .join(" | ");
    const totalOrundum = breakdown.permits * 600;

    return `Kỳ ${breakdown.month}: ${batches || `${breakdown.permits} permit`}; tốn ${
      breakdown.spent
    } cert; quy đổi ${totalOrundum} Orundum = ${breakdown.permits} pull`;
  };

  const plannerToday = new Date();
  const getLocalDayOffset = (value: Date) => {
    const todayMidnight = new Date(
      plannerToday.getFullYear(),
      plannerToday.getMonth(),
      plannerToday.getDate(),
    ).getTime();
    const valueMidnight = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
    ).getTime();

    return Math.round((valueMidnight - todayMidnight) / (24 * 60 * 60 * 1000));
  };
  const getShopMonthOffsets = (currentMonthClaimed: boolean, monthCount: number) => {
    if (monthCount <= 0) return [];

    const offsets: number[] = [];
    if (!currentMonthClaimed) {
      offsets.push(0);
    }

    let cursor = new Date(plannerToday.getFullYear(), plannerToday.getMonth() + 1, 1);
    while (offsets.length < monthCount) {
      const offset = getLocalDayOffset(cursor);
      if (offset > plannerDaysUntilBanner) break;

      offsets.push(offset);
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    return offsets;
  };
  const commendationShopMonthOffsets = getShopMonthOffsets(
    pullPlanner.commendationShopCurrentMonthClaimed,
    plannerReachableCommendationShopMonths,
  );
  const distinctionShopMonthOffsets = getShopMonthOffsets(
    pullPlanner.distinctionShopCurrentMonthClaimed,
    plannerReachableDistinctionShopMonths,
  );
  const buildWeekRangeNote = (startOffset: number, dayCount: number) => {
    const start = new Date(plannerToday);
    start.setDate(plannerToday.getDate() + startOffset);
    const end = new Date(start);
    end.setDate(start.getDate() + dayCount - 1);

    if (dayCount === 1) {
      return startOffset === 0
        ? `${WEEKDAY_LABELS[start.getDay()]} hôm nay`
        : `${WEEKDAY_LABELS[start.getDay()]} (1 ngày)`;
    }

    return `${WEEKDAY_LABELS[start.getDay()]} - ${WEEKDAY_LABELS[end.getDay()]} (${dayCount} ngày)`;
  };

  let weeklypullTimelineRemainingDays = Math.max(0, plannerDaysUntilBanner);
  let weeklypullTimelineStartOffset = 0;
  const weeklypullTimeline: Array<{
    label: string;
    note: string;
    orundum: number;
    permits: number;
    rows: WeeklyPullTimelineRow[];
  }> = [];

  while (weeklypullTimelineRemainingDays > 0) {
    const segmentStart = new Date(plannerToday);
    segmentStart.setDate(plannerToday.getDate() + weeklypullTimelineStartOffset);
    const segmentStartDay = segmentStart.getDay();
    const daysUntilNextMonday = segmentStartDay === 0 ? 1 : 8 - segmentStartDay;
    const dayCount = Math.min(weeklypullTimelineRemainingDays, daysUntilNextMonday);
    const rows = buildWeeklypullRows(dayCount, true);
    const segmentEndOffset = weeklypullTimelineStartOffset + dayCount - 1;
    const isLastSegment = weeklypullTimelineRemainingDays === dayCount;

    commendationShopMonthOffsets.forEach((offset, index) => {
      const isInSegment =
        offset >= weeklypullTimelineStartOffset &&
        (offset <= segmentEndOffset || (isLastSegment && offset === plannerDaysUntilBanner));
      const breakdown = plannerCommendationShopBreakdown[index];
      if (!isInSegment || !breakdown || breakdown.spent <= 0) return;

      rows.push({
        task: "Commendation shop",
        detail: formatCommendationWeekDetail(breakdown),
        orundum: breakdown.orundum,
        permits: breakdown.permits,
      });
    });

    distinctionShopMonthOffsets.forEach((offset, index) => {
      const isInSegment =
        offset >= weeklypullTimelineStartOffset &&
        (offset <= segmentEndOffset || (isLastSegment && offset === plannerDaysUntilBanner));
      const breakdown = plannerDistinctionShopBreakdown[index];
      if (!isInSegment || !breakdown || breakdown.spent <= 0) return;

      rows.push({
        task: "Distinction shop",
        detail: formatDistinctionWeekDetail(breakdown),
        orundum: 0,
        permits: breakdown.permits,
      });
    });

    const orundum = rows.reduce((sum, row) => sum + row.orundum, 0);
    const permits = rows.reduce((sum, row) => sum + row.permits, 0);

    weeklypullTimeline.push({
      label: `Tuần ${weeklypullTimeline.length + 1}`,
      note: buildWeekRangeNote(weeklypullTimelineStartOffset, dayCount),
      rows,
      orundum,
      permits,
    });

    weeklypullTimelineRemainingDays -= dayCount;
    weeklypullTimelineStartOffset += dayCount;
  }
  const weeklypullTimelineTotalOrundum = weeklypullTimeline.reduce(
    (sum, week) => sum + week.orundum + week.permits * 600,
    0,
  );
  const weeklypullTimelineTotalPulls = Math.floor(weeklypullTimelineTotalOrundum / 600);
  const weeklypullTimelineLeftoverOrundum = weeklypullTimelineTotalOrundum % 600;

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
                  ? "Chỉ lấy phần pull ở Phase 1 mỗi tháng."
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
            </div>

            <div className="space-y-2 rounded-2xl border border-sky-200 bg-sky-50 p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">Annihilation mỗi tuần</p>
                <Badge variant="outline" className="border-sky-200 bg-white text-sky-700">
                  {normalizedWeeklyRegularOrundum}
                </Badge>
              </div>
              <Slider
                min={MIN_WEEKLY_ANNIHILATION_ORUNDUM}
                max={MAX_WEEKLY_ANNIHILATION_ORUNDUM}
                step={WEEKLY_ANNIHILATION_ORUNDUM_STEP}
                value={[normalizedWeeklyRegularOrundum]}
                onValueChange={([value]) =>
                  handlePullPlannerChange("weeklyRegularOrundum", `${value}`)
                }
                className="py-2 bg-cyan-300"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{MIN_WEEKLY_ANNIHILATION_ORUNDUM}</span>
                <span>{MAX_WEEKLY_ANNIHILATION_ORUNDUM}</span>
              </div>
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

          <label className="flex items-center gap-3 rounded-xl border border-lime-100 bg-white p-4">
            <input
              type="checkbox"
              checked={pullPlanner.commendationShopCurrentMonthClaimed}
              onChange={(e) =>
                handlePullPlannerChange(
                  "commendationShopCurrentMonthClaimed",
                  e.target.checked,
                )
              }
              className="size-4 accent-lime-600"
            />
            <div>
              <p className="font-semibold text-slate-800">Đã đổi Commendation tháng này</p>
              <p className="text-sm text-slate-500">
                Bỏ qua kỳ shop hiện tại nếu bạn đã đổi permit/Orundum tháng này.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Planner sẽ chỉ tính {plannerReachableCommendationShopMonths} kỳ Commendation còn lại.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-yellow-100 bg-white p-4">
            <input
              type="checkbox"
              checked={pullPlanner.distinctionShopCurrentMonthClaimed}
              onChange={(e) =>
                handlePullPlannerChange(
                  "distinctionShopCurrentMonthClaimed",
                  e.target.checked,
                )
              }
              className="size-4 accent-yellow-600"
            />
            <div>
              <p className="font-semibold text-slate-800">Đã đổi Distinction tháng này</p>
              <p className="text-sm text-slate-500">
                Bỏ qua kỳ shop hiện tại nếu bạn đã mua permit bằng yellow cert tháng này.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Planner sẽ chỉ tính {plannerReachableDistinctionShopMonths} kỳ Distinction còn lại.
              </p>
            </div>
          </label>

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
              <p className="text-sm text-slate-500">Event thường 3 pull, limit/collab 5 pull</p>
              <p className="mt-1 text-xs text-slate-400">
                Bật nếu bạn sẽ farm đủ currency để lấy phần pull trong shop sự kiện.
              </p>
            </div>
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-slate-800">Chi tiết tích pull đến banner bạn muốn</p>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">Các tuần tích pull đều đặn</p>
                <p className="mt-1 text-xs text-slate-500">
                  Liệt kê từng tuần từ hôm nay tới banner; shop, permit sự kiện và quà không đều sẽ nằm ở bảng bên dưới.
                </p>
              </div>
            </div>
            <div className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
              {weeklypullTimeline.length > 0 ? (
                weeklypullTimeline.map((week) => {
                  const weeklyTotalOrundum = week.orundum + week.permits * 600;

                  return (
                  <div key={week.label} className="rounded-lg border border-white bg-white/80 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800">{week.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{week.note}</p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      {week.rows.map((row) => (
                        <div key={`${week.label}-${row.task}`} className="flex justify-between gap-3">
                          <span>{row.task}</span>
                          <span className="text-right">{row.detail}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-cyan-100 pt-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800">Tổng tuần</span>
                        <span className="text-right font-semibold text-cyan-700">
                          {weeklyTotalOrundum} Orundum ={" "}
                          {Math.floor(weeklyTotalOrundum / 600)} pull
                          {weeklyTotalOrundum % 600 > 0
                            ? ` + dư ${weeklyTotalOrundum % 600} Orundum`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  );
                })
              ) : (
                <p className="rounded-lg border border-white bg-white/80 p-3 text-sm text-slate-500">
                  Banner đã quá gần hoặc chưa có ngày để chia tuần tích pull.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Pull hiện có</p>
            <p className="mt-1 text-2xl font-black text-slate-800">{plannerCurrentPulls}</p>
            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <p>Orundum đang có: {plannerOrundum} = {Math.floor(plannerOrundum / 600)} pull.</p>
              <p>Originite Prime: {plannerPrime} OP = {plannerPrime * 180} Orundum.</p>
              <p>Headhunting Permit: {plannerPermits} permit = {plannerPermits} pull.</p>
              <p>Originium Shard: {plannerShards} shard = {plannerShardOrundum} Orundum.</p>
              <p>
                Intelligence Certificate: {plannerIntelligenceCertificates} cert ={" "}
                {plannerIntelligenceOrundum} Orundum.
              </p>
              <p className="font-semibold text-slate-700">
                Tổng quy đổi: {plannerCurrentOrundum} Orundum + {plannerPermits} permit,
                còn dư {plannerCurrentLeftoverOrundum} Orundum.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Pull tích được trong {weeklypullTimeline.length} tuần
            </p>
            <p className="mt-1 text-2xl font-black text-sky-700">{weeklypullTimelineTotalPulls}</p>
            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <p>
                Lấy tổng từ các dòng <span className="font-semibold">Tổng tuần</span> trong bảng chi tiết phía trên.
              </p>
              <p>
                Mỗi permit trong Commendation/Distinction/event được quy đổi thành 600 Orundum trước khi cộng.
              </p>
              <p>
                Tổng tích theo tuần: {weeklypullTimelineTotalOrundum} Orundum ={" "}
                {weeklypullTimelineTotalPulls} pull
                {weeklypullTimelineLeftoverOrundum > 0
                  ? ` + dư ${weeklypullTimelineLeftoverOrundum} Orundum`
                  : ""}.
              </p>
              <p>Không cộng tài nguyên đang có sẵn trong kho của bạn.</p>
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Pull dự kiến khi đến banner</p>
            <p className="mt-1 text-2xl font-black text-amber-600">{plannerProjectedBannerPulls}</p>
            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <p>Đây là số pull dự kiến dùng được khi banner bắt đầu.</p>
              <p>
                Gồm {plannerCurrentPulls} pull hiện có + phần tích lũy tới banner +{" "}
                {plannerTargetOnlyPulls} pull khóa riêng trên banner target.
              </p>
              <p>
                Pull tích lũy có thể bao gồm daily, weekly, Annihilation, monthly card, sign-in,
                shop cert, event shop và quà sự kiện nếu bạn bật các mục đó.
              </p>
              <p className="font-semibold text-slate-700">
                Sau quy đổi còn dư {plannerProjectedBannerLeftoverOrundum} Orundum.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-slate-800">Gợi ý kiếm thêm Orundum</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            {ORUNDUM_FARMING_SUGGESTIONS.map(({ title, description }) => (
              <p key={title} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <span className="font-semibold text-slate-800">{title}:</span> {description}
              </p>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
