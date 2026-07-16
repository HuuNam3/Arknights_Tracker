"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { AlertCircle, Diamond, History, Loader2, Search, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

type PullEntry = {
  index: number;
  item: { atStr: string; charName: string; poolName: string; typeName: string };
  pityCount: number | null;
  starValue: number;
  bannerTotalPulls: number | null;
};

type GachaGroup = {
  bannerName: string;
  totalPulls: number;
  pulls: PullEntry[];
};

type GachaTabContentProps = {
  cookieToken: string;
  errorMessage: string;
  filteredGachaData: any[];
  gachaAttempted: boolean;
  gachaData: any;
  gachaGroupedData: GachaGroup[];
  gachaHasMore: boolean;
  gachaStarFilter: string[];
  getWikiImageName: (value: string) => string;
  handleGachaKeyPress: (e: KeyboardEvent) => void;
  handleGachaLoadMore: () => void;
  handleSearchGacha: () => void;
  isGachaLoading: boolean;
  setCookieToken: (value: string) => void;
  setGachaStarFilter: (value: string[] | ((prev: string[]) => string[])) => void;
};

function StarRow({ count, size = "sm" }: { count: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${
            count === 6
              ? "fill-orange-500 text-orange-500"
              : count === 5
                ? "fill-yellow-500 text-yellow-500"
                : count === 4
                  ? "fill-purple-500 text-purple-500"
                  : "fill-slate-400 text-slate-400"
          }`}
        />
      ))}
    </div>
  );
}

export function GachaTabContent({
  cookieToken,
  errorMessage,
  filteredGachaData,
  gachaAttempted,
  gachaData,
  gachaGroupedData,
  gachaHasMore,
  gachaStarFilter,
  getWikiImageName,
  handleGachaKeyPress,
  handleGachaLoadMore,
  handleSearchGacha,
  isGachaLoading,
  setCookieToken,
  setGachaStarFilter,
}: GachaTabContentProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(handleGachaLoadMore);

  loadMoreRef.current = handleGachaLoadMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && gachaHasMore && !isGachaLoading) {
          loadMoreRef.current();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [gachaHasMore, isGachaLoading]);

  return (
    <TabsContent value="gacha" className="mt-0 focus-visible:outline-none space-y-6">
      <Card className="glass-card border-0 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <div className="rounded-lg border border-amber-200 bg-amber-100 p-2">
              <Diamond className="h-6 w-6 text-amber-600" />
            </div>
            Tra cứu lịch sử gacha
          </CardTitle>
          <CardDescription className="text-slate-500">
            Kiểm tra lịch sử roll, lọc banner và theo dõi pity từ dữ liệu gacha của
            tài khoản. Dán cookie lấy từ{" "}
            <a
              href="https://account.yo-star.com/login"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-600 underline underline-offset-2 hover:text-cyan-700"
            >
              https://account.yo-star.com/login
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                placeholder="Nhập cookie hoặc token của bạn"
                value={cookieToken}
                onChange={(e) => setCookieToken(e.target.value)}
                onKeyPress={handleGachaKeyPress}
                className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-lg text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20"
              />
            </div>
            <Button
              onClick={handleSearchGacha}
              disabled={isGachaLoading}
              className="h-12 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-orange-600"
            >
              {isGachaLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Tải lịch sử
            </Button>
          </div>
          <div className="space-y-1 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Cách lấy token nhanh</p>
            <p>1. Đăng nhập vào trang Yostar ở link bên trên.</p>
            <p>2. Nhấn `F12`.</p>
            <p>3. Chuyển sang tab `Network` hoặc `Mạng`.</p>
            <p>4. Nhấn `F5` để tải lại trang.</p>
            <p>5. Chọn request có `Name` là `detail`.</p>
            <p>6. Vào `Headers`, kéo xuống tìm `Cookie`, copy hết và dán vào ô nhập.</p>
          </div>
        </CardContent>
      </Card>

      {gachaAttempted && gachaData ? (
        <div className="animate-fade-in space-y-6">
          <Card className="glass-card overflow-hidden border-0 bg-white shadow-sm">
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500" />
            <CardHeader className="border-b border-slate-100 bg-white pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-700">
                <History className="h-5 w-5 text-slate-500" />
                Lich su gan day
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="flex flex-wrap gap-2">
                {["6", "5", "4"].map((star) => {
                  const isActive = gachaStarFilter.includes(star);
                  const isLocked = star === "6";
                  const colorClass = star === "6"
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : star === "5"
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-purple-500 text-white hover:bg-purple-600";

                  return (
                    <Button
                      key={star}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (isLocked) return;
                        setGachaStarFilter((prev) =>
                          prev.includes(star)
                            ? prev.filter((s) => s !== star)
                            : [...prev, star],
                        );
                      }}
                      className={
                        isActive
                          ? `rounded-lg ${colorClass}`
                          : "rounded-lg border-slate-200 text-slate-600"
                      }
                    >
                      {star}★
                    </Button>
                  );
                })}

              </div>

              {filteredGachaData.length === 0 ? (
                <div className="p-4 text-center text-slate-500">Không tìm thấy dữ liệu gacha.</div>
              ) : (
                <div className="space-y-8">
                  {gachaGroupedData.map((group, groupIdx) => {
                    const firstDate = group.pulls[0]?.item.atStr?.split(" ")[0] || "";
                    const lastDate = group.pulls[group.pulls.length - 1]?.item.atStr?.split(" ")[0] || "";
                    const sixStarCount = group.pulls.filter((p) => p.starValue === 6).length;
                    const fiveStarCount = group.pulls.filter((p) => p.starValue === 5).length;

                    const isNotLast = groupIdx < gachaGroupedData.length - 1;

                    return (
                      <div key={group.bannerName} className="relative">
                        {isNotLast ? (
                          <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-200" />
                        ) : null}

                        <div className="flex items-start gap-4">
                          <div className="relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-100">
                            <Diamond className="h-3 w-3 text-amber-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <h3 className="text-base font-bold text-slate-800">
                                {group.bannerName}
                              </h3>
                              <Badge
                                variant="outline"
                                className="border-slate-200 bg-slate-50 text-sm text-slate-500"
                              >
                                {group.totalPulls} tổng số lượt rút
                              </Badge>
                              {sixStarCount > 0 ? (
                                <Badge className="border-orange-200 bg-orange-100 text-sm text-orange-700">
                                  {sixStarCount} ★6
                                </Badge>
                              ) : null}
                              {fiveStarCount > 0 ? (
                                <Badge className="border-yellow-200 bg-yellow-100 text-sm text-yellow-700">
                                  {fiveStarCount} ★5
                                </Badge>
                              ) : null}
                              <span className="text-xs text-slate-400">
                                {firstDate === lastDate ? firstDate : `${firstDate} → ${lastDate}`}
                              </span>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-slate-100 bg-slate-50 text-sm font-semibold text-slate-500">
                                    <th className="px-3 py-2.5 text-left">Operator</th>
                                    <th className="px-3 py-2.5 text-left">Độ hiếm</th>
                                    <th className="px-3 py-2.5 text-right">Lần rút</th>
                                    <th className="px-3 py-2.5 text-right">Tổng</th>
                                    <th className="px-3 py-2.5 text-right">Ngày</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group.pulls.map((entry, rowIdx) => {
                                    const isSixStar = entry.starValue === 6;
                                    const isFiveStar = entry.starValue === 5;
                                    const isFourStar = entry.starValue === 4;
                                    const nameColor = isSixStar
                                      ? "text-orange-600"
                                      : isFiveStar
                                        ? "text-yellow-600"
                                        : isFourStar
                                          ? "text-purple-600"
                                          : "text-slate-700";

                                    return (
                                      <tr
                                        key={`${entry.item.charName}-${entry.item.atStr}-${entry.index}`}
                                        className={`border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-200/50 ${rowIdx % 2 === 0 ? "bg-white" : "bg-slate-100"}`}
                                      >
                                        <td className="px-3 py-2.5">
                                          <div className="flex items-center gap-2.5">
                                            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100">
                                              <img
                                                src={`https://arknights.wiki.gg/images/${getWikiImageName(entry.item.charName)}_icon.png`}
                                                alt={entry.item.charName}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = "none";
                                                }}
                                              />
                                            </div>
                                            <span className={`text-sm font-bold ${nameColor}`}>
                                              {entry.item.charName}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                          <StarRow count={entry.starValue} size="sm" />
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                          {isSixStar && entry.pityCount !== null ? (
                                            <span className="text-sm font-bold text-orange-600">
                                              {entry.pityCount}
                                            </span>
                                          ) : (
                                            <span className="text-sm text-slate-300">-</span>
                                          )}
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                          {isSixStar && entry.bannerTotalPulls !== null ? (
                                            <span className="text-sm font-semibold text-sky-600">
                                              {entry.bannerTotalPulls}
                                            </span>
                                          ) : (
                                            <span className="text-sm text-slate-300">-</span>
                                          )}
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                          <span className="text-sm text-slate-400">
                                            {entry.item.atStr?.split(" ")[0] || entry.item.atStr}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div ref={sentinelRef} className="h-4" />

              {isGachaLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  <span className="ml-3 text-slate-500">Đang tải thêm...</span>
                </div>
              ) : gachaHasMore ? (
                <div className="flex items-center justify-center py-6">
                  <Button
                    onClick={handleGachaLoadMore}
                    variant="outline"
                    className="rounded-xl border-slate-200 text-slate-600"
                  >
                    Tải thêm
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {gachaAttempted && !gachaData && !isGachaLoading ? (
        <Alert className="animate-fade-in rounded-xl border-red-200 bg-red-50 text-red-800 shadow-sm backdrop-blur-md">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <AlertDescription className="ml-2 text-base font-medium">
            {errorMessage || "Cookie không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."}
          </AlertDescription>
        </Alert>
      ) : null}

      {isGachaLoading && !gachaData ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
          <p className="animate-pulse font-medium text-slate-500">Đang tải lịch sử gacha...</p>
        </div>
      ) : null}
    </TabsContent>
  );
}
