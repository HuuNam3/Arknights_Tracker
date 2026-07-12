"use client";

import React, { useState, useCallback } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Diamond, Undo2 } from "lucide-react";
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
const DAILY_SIGNIN_PERMIT_DAY = 17;
const DISTINCTION_SHOP_BATCH_PERMITS = [1, 2, 5, 10, 20] as const;
const CUSTOM_PULL_PLANNER_TARGET_KEY = "custom-target-date";
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
    title: "Paid pack permit (Có trả phí)",
    description:
      "Starter/Monthly Headhunting Pack có Ten-pull Permit; chỉ tính nếu bạn thật sự mua pack, không phải nguồn F2P.",
  },
  {
    title: "Pro Enhancement Pack (Có thể trả phí)",
    description:
      "Nếu còn pack level mua bằng OP, pack trả Orundum ngang lượng OP quy đổi kèm vật liệu, thường tốt hơn đổi OP thẳng.",
  },
] as const;

type PullPlannerTabContentProps = {
  TOOL_ICON_URLS: Record<string, string>;
  handlePullPlannerChange: (field: string, value: string | boolean) => void;
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
  plannerEventRewardEntries: Array<{
    bannerId: string;
    bannerName: string;
    date: string;
    bonus: {
      confidence: "high" | "medium" | "low";
      label: string;
      note: string;
      targetOnlyFreePulls: number;
      targetOnlyPermits: number;
      transferableOrundum: number;
      transferablePermits: number;
    };
  }>;
  plannerEventShopEntries: Array<{
    bannerName: string;
    bannerType: string;
    date: string;
    pulls: number;
  }>;
  plannerIntelligenceCertificates: number;
  plannerIntelligenceOrundum: number;
  plannerCurrentOrundum: number;
  plannerCurrentPulls: number;
  plannerDaysUntilBanner: number;
  plannerOrundum: number;
  plannerPermits: number;
  plannerPrime: number;
  plannerProjectedBannerLeftoverOrundum: number;
  plannerProjectedBannerPulls: number;
  plannerReachableCommendationShopMonths: number;
  plannerReachableDistinctionShopMonths: number;
  plannerShardOrundum: number;
  plannerShards: number;
  plannerTargetOnlyPulls: number;
  pullPlanner: any;
  pullPlannerTargets: any[];
  selectedPullPlannerTarget: any | null;
};

export function PullPlannerTabContent({
  TOOL_ICON_URLS,
  handlePullPlannerChange,
  plannerCurrentLeftoverOrundum,
  plannerCommendationShopBreakdown,
  plannerDistinctionShopBreakdown,
  plannerEventRewardEntries,
  plannerEventShopEntries,
  plannerIntelligenceCertificates,
  plannerIntelligenceOrundum,
  plannerCurrentOrundum,
  plannerCurrentPulls,
  plannerDaysUntilBanner,
  plannerOrundum,
  plannerPermits,
  plannerPrime,
  plannerProjectedBannerLeftoverOrundum,
  plannerProjectedBannerPulls,
  plannerReachableCommendationShopMonths,
  plannerReachableDistinctionShopMonths,
  plannerShardOrundum,
  plannerShards,
  plannerTargetOnlyPulls,
  pullPlanner,
  pullPlannerTargets,
  selectedPullPlannerTarget,
}: PullPlannerTabContentProps) {
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [spentPulls, setSpentPulls] = useState(0);
  const [timelineView, setTimelineView] = useState<"weekly" | "daily">("weekly");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    resources: false,
    income: false,
    timeline: false,
  });
  const toggleSection = (key: string) =>
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
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
  const parsedTargetPullGoal = Number.parseInt(pullPlanner.targetPulls, 10);
  const plannerTargetPullGoal = Number.isNaN(parsedTargetPullGoal)
    ? 0
    : Math.max(0, Math.floor(parsedTargetPullGoal));
  const hasPlannerTargetPullGoal = plannerTargetPullGoal > 0;
  const plannerTargetPullGap = plannerProjectedBannerPulls - plannerTargetPullGoal;

  const plannerResourceInputs = [
    {
      field: "orundum",
      label: "Orundum",
      icon: TOOL_ICON_URLS.orundum,
      cardClassName: "border-rose-200 bg-rose-50",
      inputClassName: "border-rose-200 bg-white focus-visible:ring-rose-200",
    },
    {
      field: "originitePrime",
      label: "Originite Prime",
      icon: TOOL_ICON_URLS.originitePrime,
      cardClassName: "border-amber-200 bg-amber-50",
      inputClassName: "border-amber-200 bg-white focus-visible:ring-amber-200",
    },
    {
      field: "permits",
      label: "Headhunting Permit",
      icon: TOOL_ICON_URLS.headhuntingPermit,
      cardClassName: "border-emerald-200 bg-emerald-50",
      inputClassName: "border-emerald-200 bg-white focus-visible:ring-emerald-200",
    },
    {
      field: "originiumShards",
      label: "Originium Shard",
      icon: TOOL_ICON_URLS.originiumShard,
      cardClassName: "border-violet-200 bg-violet-50",
      inputClassName: "border-violet-200 bg-white focus-visible:ring-violet-200",
    },
  ] as const;

  type WeeklyPullTimelineRow = {
    detail: string;
    orundum: number;
    permits: number;
    targetOnlyPulls?: number;
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
  const getMonthlyDayOffsets = (dayOfMonth: number) => {
    if (!selectedPullPlannerTarget?.date) return [];

    const target = new Date(`${selectedPullPlannerTarget.date}T00:00:00`);
    const offsets: number[] = [];
    let cursor = new Date(plannerToday.getFullYear(), plannerToday.getMonth(), dayOfMonth);

    while (cursor <= target) {
      const offset = getLocalDayOffset(cursor);
      if (offset >= 0 && offset <= plannerDaysUntilBanner) {
        offsets.push(offset);
      }

      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, dayOfMonth);
    }

    return offsets;
  };
  const monthlySignInOffsets = pullPlanner.monthlySignInEnabled
    ? getMonthlyDayOffsets(DAILY_SIGNIN_PERMIT_DAY)
    : [];
  const getDateOffset = (date: string) => getLocalDayOffset(new Date(`${date}T00:00:00`));
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
    targetOnlyPulls: number;
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

    monthlySignInOffsets.forEach((offset) => {
      const isInSegment =
        offset >= weeklypullTimelineStartOffset &&
        (offset <= segmentEndOffset || (isLastSegment && offset === plannerDaysUntilBanner));
      if (!isInSegment) return;

      rows.push({
        task: "Monthly sign-in",
        detail: `Ngày ${DAILY_SIGNIN_PERMIT_DAY}: 1 permit = 600 Orundum = 1 pull`,
        orundum: 0,
        permits: 1,
      });
    });

    plannerEventRewardEntries.forEach(({ bannerName, date, bonus }) => {
      const offset = getDateOffset(date);
      const isInSegment =
        offset >= weeklypullTimelineStartOffset &&
        (offset <= segmentEndOffset || (isLastSegment && offset === plannerDaysUntilBanner));
      if (!isInSegment) return;

      const targetOnlyPulls = bonus.targetOnlyPermits + bonus.targetOnlyFreePulls;
      const detailParts = [
        bonus.transferableOrundum > 0 ? `${bonus.transferableOrundum} Orundum` : null,
        bonus.transferablePermits > 0 ? `${bonus.transferablePermits} permit` : null,
        targetOnlyPulls > 0
          ? `${targetOnlyPulls} pull khóa banner (${bonus.targetOnlyPermits} permit + ${bonus.targetOnlyFreePulls} free pull)`
          : null,
      ].filter((part): part is string => part !== null);

      rows.push({
        task: `Event reward: ${bannerName}`,
        detail: detailParts.join(" | ") || bonus.label,
        orundum: bonus.transferableOrundum,
        permits: bonus.transferablePermits,
        targetOnlyPulls,
      });
    });

    plannerEventShopEntries.forEach(({ bannerName, date, pulls }) => {
      const offset = getDateOffset(date);
      const isInSegment =
        offset >= weeklypullTimelineStartOffset &&
        (offset <= segmentEndOffset || (isLastSegment && offset === plannerDaysUntilBanner));
      if (!isInSegment) return;

      rows.push({
        task: `Event shop: ${bannerName}`,
        detail: `${pulls} permit = ${pulls} pull = ${pulls * 600} Orundum quy đổi`,
        orundum: 0,
        permits: pulls,
      });
    });

    const orundum = rows.reduce((sum, row) => sum + row.orundum, 0);
    const permits = rows.reduce((sum, row) => sum + row.permits, 0);
    const targetOnlyPulls = rows.reduce((sum, row) => sum + (row.targetOnlyPulls ?? 0), 0);

    weeklypullTimeline.push({
      label: `Tuần ${weeklypullTimeline.length + 1}`,
      note: buildWeekRangeNote(weeklypullTimelineStartOffset, dayCount),
      rows,
      orundum,
      permits,
      targetOnlyPulls,
    });

    weeklypullTimelineRemainingDays -= dayCount;
    weeklypullTimelineStartOffset += dayCount;
  }
  const weeklypullTimelineTotalOrundum = weeklypullTimeline.reduce(
    (sum, week) => sum + week.orundum + (week.permits + week.targetOnlyPulls) * 600,
    0,
  );
  const weeklypullTimelineTotalPulls = Math.floor(weeklypullTimelineTotalOrundum / 600);
  const weeklypullTimelineLeftoverOrundum = weeklypullTimelineTotalOrundum % 600;

  const dailyTimeline: Array<{
    date: Date;
    dayLabel: string;
    offset: number;
    totalPulls: number;
    isToday: boolean;
    isWeekend: boolean;
    events: string[];
  }> = [];
  if (plannerDaysUntilBanner > 0) {
    for (let i = 0; i <= plannerDaysUntilBanner; i++) {
      const date = new Date(plannerToday);
      date.setDate(plannerToday.getDate() + i);
      const dayOfWeek = date.getDay();
      const isMonday = dayOfWeek === 1;
      let orundum = 0;
      let permits = 0;
      const events: string[] = [];

      if (pullPlanner.dailyMissionEnabled) {
        orundum += 100;
      }
      if (pullPlanner.monthlyCardEnabled) {
        orundum += 200;
      }
      if (isMonday) {
        if (pullPlanner.weeklyMissionEnabled) {
          orundum += 500;
          events.push("Weekly mission");
        }
        orundum += normalizedWeeklyRegularOrundum;
        events.push("Annihilation");
      }
      if (
        pullPlanner.monthlySignInEnabled &&
        date.getDate() === DAILY_SIGNIN_PERMIT_DAY
      ) {
        permits += 1;
        events.push("Sign-in permit");
      }

      commendationShopMonthOffsets.forEach((offset, index) => {
        if (offset === i) {
          const b = plannerCommendationShopBreakdown[index];
          if (b && b.spent > 0) {
            orundum += b.orundum;
            permits += b.permits;
            events.push("Commendation");
          }
        }
      });
      distinctionShopMonthOffsets.forEach((offset, index) => {
        if (offset === i) {
          const b = plannerDistinctionShopBreakdown[index];
          if (b && b.spent > 0) {
            permits += b.permits;
            events.push("Distinction");
          }
        }
      });
      monthlySignInOffsets.forEach((offset) => {
        if (offset === i) {
          permits += 1;
          if (!events.includes("Sign-in permit")) events.push("Sign-in permit");
        }
      });
      plannerEventRewardEntries.forEach(({ bannerName, date, bonus }) => {
        const offset = getDateOffset(date);
        if (offset === i) {
          orundum += bonus.transferableOrundum;
          permits += bonus.transferablePermits;
          events.push(`Event: ${bannerName}`);
        }
      });
      plannerEventShopEntries.forEach(({ bannerName, date, pulls }) => {
        const offset = getDateOffset(date);
        if (offset === i) {
          permits += pulls;
          events.push(`Shop: ${bannerName}`);
        }
      });

      const totalPulls = orundum / 600 + permits;
      dailyTimeline.push({
        date,
        dayLabel: WEEKDAY_LABELS[dayOfWeek],
        offset: i,
        totalPulls: Math.round(totalPulls * 100) / 100,
        isToday: i === 0,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        events,
      });
    }
  }

  return (
    <TabsContent value="pull-planner" className="mt-0 focus-visible:outline-none">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }
        @keyframes slideUp {
          from { opacity: 1; max-height: 2000px; }
          to { opacity: 0; max-height: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .section-collapsible {
          overflow: hidden;
          transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
        }
      `}</style>
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-cyan-200 bg-cyan-100 p-2.5">
              <Diamond className="h-5 w-5 text-cyan-700" />
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
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Banner mục tiêu</label>
              <select
                value={pullPlanner.currentBannerKey || selectedPullPlannerTarget?.id || ""}
                onChange={(e) => handlePullPlannerChange("currentBannerKey", e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800"
              >
                {pullPlannerTargets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name} - {target.dateLabel}
                    {target.isPredicted ? " (Dự đoán)" : " (Đã xác nhận)"}
                  </option>
                ))}
                <option value={CUSTOM_PULL_PLANNER_TARGET_KEY}>Ngày tự chọn</option>
              </select>
            </div>
            {pullPlanner.currentBannerKey === CUSTOM_PULL_PLANNER_TARGET_KEY ? (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="text-sm font-semibold text-slate-700">Ngày muốn tính tới</label>
                <Input
                  type="date"
                  value={pullPlanner.customTargetDate ?? ""}
                  onChange={(e) => handlePullPlannerChange("customTargetDate", e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Alert className="border-0 bg-transparent p-0 text-slate-700 shadow-none">
              <AlertCircle className="h-5 w-5 text-slate-500" />
              <AlertDescription className="ml-2 text-sm">
                Chưa có banner tương lai để lên kế hoạch. Nhập ngày bạn muốn để planner tự tính.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Ngày muốn tính tới</label>
              <Input
                type="date"
                value={pullPlanner.customTargetDate ?? ""}
                onChange={(e) => handlePullPlannerChange("customTargetDate", e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-white"
              />
            </div>
          </div>
        )}

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mục tiêu pull</label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                value={pullPlanner.targetPulls ?? ""}
                onChange={(e) => handlePullPlannerChange("targetPulls", e.target.value)}
                placeholder="Ví dụ: 300"
                className="h-12 rounded-xl border-emerald-200 bg-white pr-14 focus-visible:ring-emerald-200"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-emerald-600">
                pull
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg border border-white bg-white/80 px-4 py-3 text-sm">
              <p className="font-semibold text-slate-800">
                {!hasPlannerTargetPullGoal
                  ? "Nhập mục tiêu pull để so sánh"
                  : plannerTargetPullGap >= 0
                    ? `Đủ mục tiêu, dư ${plannerTargetPullGap} pull`
                    : `Còn thiếu ${Math.abs(plannerTargetPullGap)} pull`}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {hasPlannerTargetPullGoal
                  ? `Dự kiến ${plannerProjectedBannerPulls} / mục tiêu ${plannerTargetPullGoal} pull.`
                  : `Dự kiến hiện tại: ${plannerProjectedBannerPulls} pull.`}
              </p>
            </div>
          </div>
        </div>
            {hasPlannerTargetPullGoal && (
              <div className="mt-3 space-y-1">
                <div className="flex h-3 overflow-hidden rounded-full bg-white/80">
                  <div
                    className={`rounded-full transition-all duration-500 ${
                      plannerTargetPullGap >= 0
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }`}
                    style={{
                      width: `${Math.min(100, (plannerProjectedBannerPulls / plannerTargetPullGoal) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-right text-[11px] text-slate-500">
                  {Math.min(100, Math.round((plannerProjectedBannerPulls / plannerTargetPullGoal) * 100))}%
                </p>
              </div>
            )}
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => toggleSection("resources")}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:shadow-sm"
        >
          <span className="flex items-center gap-2">
            <span className={`inline-block transition-transform duration-300 ${collapsedSections.resources ? "" : "rotate-90"}`}>📦</span>
            Tài nguyên hiện có
          </span>
          <span className={`text-slate-400 transition-transform duration-300 ${collapsedSections.resources ? "" : "rotate-180"}`}>{collapsedSections.resources ? "+" : "−"}</span>
          </button>
          {collapsedSections.resources ? null : (
            <div className="animate-slideDown"><React.Fragment>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {plannerResourceInputs.map(
              ({ field, label, icon, cardClassName, inputClassName }) => (
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
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm">
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
                className="rounded-xl border-emerald-200 bg-white focus-visible:ring-emerald-200"
              />
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  ["phase1", "P1"],
                  ["phase2", "P2"],
                  ["phase3", "P3"],
                ] as const).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handlePullPlannerChange("commendationShopMode", mode)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      pullPlanner.commendationShopMode === mode
                        ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                        : "border-emerald-200 bg-white text-slate-500 hover:border-emerald-300"
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

            <div className="space-y-2 rounded-2xl border border-cyan-200 bg-cyan-50 p-3 shadow-sm">
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
                className="rounded-xl border-cyan-200 bg-white focus-visible:ring-cyan-200"
              />
            </div>

            <div className="space-y-2 rounded-2xl border border-teal-200 bg-teal-50 p-3 shadow-sm">
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
                className="rounded-xl border-teal-200 bg-white focus-visible:ring-teal-200"
              />
            </div>

            <div className="space-y-2 rounded-2xl border border-cyan-200 bg-cyan-50 p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={TOOL_ICON_URLS.annihilationOperation}
                    alt="Annihilation Operation"
                    className="size-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <p className="text-sm font-semibold text-slate-800">Annihilation mỗi tuần</p>
                </div>
                <Badge variant="outline" className="border-cyan-200 bg-white text-cyan-700">
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
                className="py-2"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{MIN_WEEKLY_ANNIHILATION_ORUNDUM}</span>
                <span>{MAX_WEEKLY_ANNIHILATION_ORUNDUM}</span>
              </div>
              </div>
          </div>
            </React.Fragment></div>)}</div>

        <button
          type="button"
          onClick={() => toggleSection("income")}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:shadow-sm"
        >
          <span className="flex items-center gap-2">
            <span className={`inline-block transition-transform duration-300 ${collapsedSections.income ? "" : "rotate-90"}`}>📅</span>
            Nguồn thu nhập
          </span>
          <span className={`text-slate-400 transition-transform duration-300 ${collapsedSections.income ? "" : "rotate-180"}`}>{collapsedSections.income ? "+" : "−"}</span>
        </button>
        {collapsedSections.income ? null : (
        <div className="animate-slideDown grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
              "Có trả phí - 200 Orundum / ngày",
              `Phí theo Store trong game. Nếu bật: ${plannerDaysUntilBanner} ngày x 200 = ${
                plannerDaysUntilBanner * 200
              } Orundum = ${Math.floor((plannerDaysUntilBanner * 200) / 600)} pull${
                (plannerDaysUntilBanner * 200) % 600 > 0
                  ? ` + dư ${(plannerDaysUntilBanner * 200) % 600} Orundum`
                  : ""
              }.`,
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
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:shadow-sm ${
                pullPlanner[field]
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={pullPlanner[field]}
                onChange={(e) => handlePullPlannerChange(field, e.target.checked)}
                className="size-4 accent-emerald-600"
              />
              <div>
                <p className="font-semibold text-slate-800">{title}</p>
                <p className="text-sm text-slate-500">{subtitle}</p>
                <p className="mt-1 text-xs text-slate-400">{detail}</p>
              </div>
            </label>
          ))}

          <label
            className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
              pullPlanner.commendationShopCurrentMonthClaimed
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-100 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={pullPlanner.commendationShopCurrentMonthClaimed}
              onChange={(e) =>
                handlePullPlannerChange(
                  "commendationShopCurrentMonthClaimed",
                  e.target.checked,
                )
              }
              className="size-4 accent-emerald-600"
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

          <label
            className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
              pullPlanner.distinctionShopCurrentMonthClaimed
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-100 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={pullPlanner.distinctionShopCurrentMonthClaimed}
              onChange={(e) =>
                handlePullPlannerChange(
                  "distinctionShopCurrentMonthClaimed",
                  e.target.checked,
                )
              }
              className="size-4 accent-emerald-600"
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

          <label
            className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
              pullPlanner.eventShopEnabled
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-100 bg-white"
            } ${!pullPlanner.eventRewardsEnabled ? "opacity-70" : ""}`}
          >
            <input
              type="checkbox"
              checked={pullPlanner.eventShopEnabled}
              disabled={!pullPlanner.eventRewardsEnabled}
              onChange={(e) => handlePullPlannerChange("eventShopEnabled", e.target.checked)}
              className="size-4 accent-emerald-600 disabled:opacity-50"
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
        )}

        <button
          type="button"
          onClick={() => toggleSection("timeline")}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:shadow-sm"
        >
          <span className="flex items-center gap-2">
            <span className={`inline-block transition-transform duration-300 ${collapsedSections.timeline ? "" : "rotate-90"}`}>📊</span>
            Dòng thời gian tích pull
          </span>
          <span className={`text-slate-400 transition-transform duration-300 ${collapsedSections.timeline ? "" : "rotate-180"}`}>{collapsedSections.timeline ? "+" : "−"}</span>
        </button>
        {collapsedSections.timeline ? null : (
        <div className="animate-slideDown rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800">Các tuần tích pull đều đặn</p>
              <p className="mt-1 text-xs text-slate-500">
                Liệt kê từng tuần từ hôm nay tới banner; shop, permit sự kiện và quà không đều sẽ nằm ở bảng bên dưới.
              </p>
            </div>
            <div className="flex rounded-lg border border-cyan-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setTimelineView("weekly")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  timelineView === "weekly"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Theo tuần
              </button>
              <button
                type="button"
                onClick={() => setTimelineView("daily")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  timelineView === "daily"
                    ? "bg-cyan-100 text-cyan-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Theo ngày
              </button>
            </div>
          </div>
           <div className="mt-3 pr-1">
            {timelineView === "weekly" && (
              <div className="space-y-2">
              {weeklypullTimeline.length > 0 ? (
              weeklypullTimeline.map((week) => {
                const weeklyTotalOrundum =
                  week.orundum + (week.permits + week.targetOnlyPulls) * 600;

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
            )}
            {timelineView === "daily" && dailyTimeline.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-[4rem_repeat(7,1fr)] gap-px overflow-hidden rounded-lg border border-cyan-200 bg-white text-xs">
                <div className="bg-cyan-100 p-2 font-semibold text-cyan-800">Tuần</div>
                {WEEKDAY_LABELS.map((d) => (
                  <div key={d} className="bg-cyan-100 p-2 text-center font-semibold text-cyan-800">
                    {d}
                  </div>
                ))}
                {(() => {
                  const weeks: { days: typeof dailyTimeline }[] = [];
                  let currentWeek: typeof dailyTimeline = [];
                  dailyTimeline.forEach((day) => {
                    if (day.offset > 0 && day.date.getDay() === 1 && currentWeek.length > 0) {
                      weeks.push({ days: currentWeek });
                      currentWeek = [];
                    }
                    currentWeek.push(day);
                  });
                  if (currentWeek.length > 0) weeks.push({ days: currentWeek });
                  return weeks.map((week, wi) => (
                    <React.Fragment key={wi}>
                      <div className="flex items-center justify-center bg-cyan-50 p-2 font-medium text-cyan-700">
                        {wi + 1}
                      </div>
                      {(() => {
                        const cells: React.ReactNode[] = [];
                        const firstDay = week.days[0].date.getDay();
                        const startPad = firstDay === 0 ? 6 : firstDay - 1;
                        for (let p = 0; p < startPad; p++) {
                          cells.push(<div key={`pad-${wi}-${p}`} className="bg-slate-50" />);
                        }
                        week.days.forEach((day, di) => {
                          const cellPulls = Math.floor(day.totalPulls);
                          const colorClass =
                            cellPulls >= 5
                              ? "bg-emerald-100 text-emerald-800"
                              : cellPulls >= 2
                                ? "bg-amber-50 text-amber-700"
                                : cellPulls > 0
                                  ? "bg-slate-100 text-slate-600"
                                  : "text-slate-400";
                          cells.push(
                            <div
                              key={di}
                              className={`flex flex-col items-center justify-center p-1.5 ${colorClass} ${day.isToday ? "ring-2 ring-inset ring-cyan-400" : ""}`}
                            >
                              <span className="text-[10px] font-bold">{day.date.getDate()}</span>
                              <span className="text-[9px] font-semibold">{cellPulls}</span>
                            </div>,
                          );
                        });
                        const endPad = 7 - (startPad + week.days.length);
                        for (let p = 0; p < endPad; p++) {
                          cells.push(<div key={`pad-end-${wi}-${p}`} className="bg-slate-50" />);
                        }
                        return cells;
                      })()}
                    </React.Fragment>
                  ));
                })()}
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Mỗi ô hiển thị ngày và số pull tích được. Ô khoanh viền là hôm nay.
              </p>
            </div>
            )}
          </div>
        </div>
        )}

        {(plannerEventRewardEntries.length > 0 || plannerEventShopEntries.length > 0) && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 shadow-sm">
            <p className="font-semibold text-slate-800">Nguồn event đã cộng vào kế hoạch</p>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              {plannerEventRewardEntries.map(({ bannerId, bannerName, bonus }) => {
                const transferablePulls =
                  bonus.transferablePermits + Math.floor(bonus.transferableOrundum / 600);
                const targetOnlyPulls =
                  bonus.targetOnlyPermits + bonus.targetOnlyFreePulls;

                return (
                  <div key={bannerId} className="rounded-lg border border-white bg-white/80 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800">{bannerName}</p>
                        <p className="mt-1 text-slate-500">{bonus.label}</p>
                      </div>
                      <Badge variant="outline" className="border-indigo-200 bg-white text-indigo-700">
                        {bonus.confidence === "high"
                          ? "Tin cậy cao"
                          : bonus.confidence === "medium"
                            ? "Ước tính"
                            : "Tham khảo"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p>
                        Tài nguyên dùng được mọi banner: {bonus.transferableOrundum} Orundum +{" "}
                        {bonus.transferablePermits} permit = {transferablePulls} pull
                        {bonus.transferableOrundum % 600 > 0
                          ? ` + dư ${bonus.transferableOrundum % 600} Orundum`
                          : ""}
                        .
                      </p>
                      <p>
                        Khóa riêng banner target: {bonus.targetOnlyPermits} permit +{" "}
                        {bonus.targetOnlyFreePulls} free pull = {targetOnlyPulls} pull.
                      </p>
                      <p className="text-slate-500">{bonus.note}</p>
                    </div>
                  </div>
                );
              })}

              {plannerEventShopEntries.map((entry) => (
                <div
                  key={`${entry.bannerName}-${entry.bannerType}`}
                  className="rounded-lg border border-white bg-white/80 p-3"
                >
                  <p className="font-semibold text-slate-800">{entry.bannerName}</p>
                  <p className="mt-1">
                    Event shop ({entry.bannerType}): {entry.pulls} permit = {entry.pulls} pull ={" "}
                    {entry.pulls * 600} Orundum quy đổi.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sticky top-4 z-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <p className="text-xs font-semibold uppercase text-slate-500">Pull hiện có</p>
            <p className="mt-2 text-5xl font-black text-slate-800 transition-all duration-300 hover:scale-110">{plannerCurrentPulls}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Pull tích tuần ({weeklypullTimeline.length})
            </p>
            <p className="mt-2 text-5xl font-black text-cyan-800 transition-all duration-300 hover:scale-110">{weeklypullTimelineTotalPulls}</p>
          </div>
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <p className="text-xs font-semibold uppercase text-slate-500">Dự kiến đến banner</p>
            <button
              type="button"
              onClick={() => {
                const amount = window.prompt("Nhập số pull muốn chi tiêu (mô phỏng):", "10");
                if (amount !== null) {
                  const num = Number.parseInt(amount, 10);
                  if (!Number.isNaN(num) && num > 0) {
                    setSpentPulls((prev) => Math.min(prev + num, plannerProjectedBannerPulls));
                  }
                }
              }}
              className="mt-2 text-5xl font-black text-emerald-800 transition-all duration-300 hover:scale-110 hover:cursor-pointer"
              title="Click để mô phỏng chi tiêu pull"
            >
              {Math.max(0, plannerProjectedBannerPulls - spentPulls)}
            </button>
            {spentPulls > 0 && (
              <button
                type="button"
                onClick={() => setSpentPulls(0)}
                className="absolute right-2 top-2 rounded-full border border-emerald-200 bg-white p-1 text-emerald-600 transition-all duration-300 hover:bg-emerald-50 hover:shadow-sm"
                title="Reset đã chi tiêu"
              >
                <Undo2 className="size-3.5" />
              </button>
            )}
            {spentPulls > 0 && (
              <p className="mt-1 text-[11px] text-emerald-600">
                Đã chi {spentPulls} pull, còn {Math.max(0, plannerProjectedBannerPulls - spentPulls)}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-semibold text-slate-800">Gợi ý kiếm thêm Orundum</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            {(showAllSuggestions
              ? ORUNDUM_FARMING_SUGGESTIONS
              : ORUNDUM_FARMING_SUGGESTIONS.slice(0, 6)
            ).map(({ title, description }, i) => {
              const bgColors = [
                "bg-rose-50 border-rose-100",
                "bg-amber-50 border-amber-100",
                "bg-emerald-50 border-emerald-100",
                "bg-cyan-50 border-cyan-100",
                "bg-violet-50 border-violet-100",
                "bg-orange-50 border-orange-100",
              ];
              return (
                <p key={title} className={`rounded-lg border p-3 ${bgColors[i % bgColors.length]}`}>
                  <span className="font-semibold text-slate-800">{title}:</span> {description}
                </p>
              );
            })}
          </div>
          {ORUNDUM_FARMING_SUGGESTIONS.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllSuggestions(!showAllSuggestions)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              {showAllSuggestions ? (
                <>Thu gọn <ChevronUp className="size-4" /></>
              ) : (
                <>Xem thêm ({ORUNDUM_FARMING_SUGGESTIONS.length - 6}) <ChevronDown className="size-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </TabsContent>
  );
}
