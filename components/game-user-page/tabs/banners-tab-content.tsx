"use client";

import { useState } from "react";
import { AlertCircle, ArrowUp, GalleryHorizontal, Loader2, Search, ShoppingCart, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

type BannersTabContentProps = {
  bannerError: string;
  bannerSearch: string;
  bannerPredictionDetailsByKey: Map<string, any>;
  filteredBanners: any[];
  formatDisplayDate: (value: string | null | undefined) => string | null;
  getBannerKey: (banner: any) => string;
  getNormalizedBannerOperatorNames: (banner: any) => string[];
  getWikiImageName: (value: string) => string;
  isBannerLimited: (banner: any) => boolean;
  isBannerLoading: boolean;
  setBannerSearch: (value: string) => void;
  upcomingNewOperatorsByBanner: Map<string, Set<string>>;
};

const CATEGORIES = ["Tất cả", "Limited", "Special", "Standard Pool", "Kernel"] as const;

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1.5 w-full bg-slate-200 animate-pulse" />
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 w-32 rounded-md bg-slate-200 animate-pulse" />
          <div className="h-6 w-16 rounded-md bg-slate-200 animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="aspect-[16/9] w-full rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-5 w-48 rounded-md bg-slate-200 animate-pulse" />
          <div className="grid w-full grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-100 px-2 py-1.5">
                <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                  <div className="h-3 w-12 rounded bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BannersTabContent({
  bannerError,
  bannerPredictionDetailsByKey,
  bannerSearch,
  filteredBanners,
  formatDisplayDate,
  getBannerKey,
  getNormalizedBannerOperatorNames,
  getWikiImageName,
  isBannerLimited,
  isBannerLoading,
  setBannerSearch,
  upcomingNewOperatorsByBanner,
}: BannersTabContentProps) {
  const [expandedBanners, setExpandedBanners] = useState<Set<string>>(new Set());
  const [bannerCategoryFilter, setBannerCategoryFilter] = useState<string>("Tất cả");

  const toggleBannerExpand = (key: string) => {
    setExpandedBanners((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const categoryFilteredBanners = filteredBanners.filter((banner) =>
    bannerCategoryFilter === "Tất cả"
      ? true
      : (banner.category ?? "Standard Pool") === bannerCategoryFilter,
  );

  return (
    <TabsContent value="banners" className="mt-0 focus-visible:outline-none space-y-6">
      <Card className="glass-card overflow-hidden border-0 shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
        <CardHeader className="border-b border-slate-100 bg-white pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <div className="rounded-lg border border-sky-200 bg-sky-100 p-2">
              <GalleryHorizontal className="h-6 w-6 text-sky-600" />
            </div>
            Banners
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Xem banner hiện tại và sắp ra, kèm character xuất hiện trong từng banner
            để tra cứu nhanh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-xl flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                placeholder="Tìm theo tên banner hoặc operator"
                value={bannerSearch}
                onChange={(e) => setBannerSearch(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-base text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-400/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setBannerCategoryFilter(cat)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    bannerCategoryFilter === cat
                      ? "border-sky-400 bg-sky-500 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  {cat === "Standard Pool" ? "Standard" : cat}
                </button>
              ))}
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                {categoryFilteredBanners.length} banner
              </Badge>
            </div>
          </div>

          {isBannerLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : bannerError ? (
            <Alert className="rounded-xl border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="ml-2 text-base font-medium">
                {bannerError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {categoryFilteredBanners.map((banner, index) => {
                  const isReleased = Boolean(banner.enStartDate);
                  const isUpcoming = !banner.enStartDate || (() => {
                    const today = new Date();
                    const todayStart = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
                    const bannerTs = Date.parse(`${banner.enStartDate}T00:00:00Z`);
                    return Number.isFinite(bannerTs) && bannerTs >= todayStart;
                  })();
                  const isCurrentBanner = Boolean(banner.current);
                  const bannerIsLimited = isBannerLimited(banner);
                  const bannerCategoryLabel = banner.category ?? "Standard Pool";
                  const visibleBannerOperators = getNormalizedBannerOperatorNames(banner);
                  const predictionDetails =
                    bannerPredictionDetailsByKey.get(getBannerKey(banner)) ?? null;
                  const estimatedReleaseDate = isUpcoming ? predictionDetails?.date ?? null : null;
                  const estimatedEndDate = isUpcoming ? predictionDetails?.endDate ?? null : null;

                  return (
                    <Card
                      key={`${banner.name}-${banner.releaseDate}`}
                      className={`animate-[fade-in-up_0.4s_ease-out_both] overflow-hidden border shadow-sm transition-all hover:shadow-md ${
                        isCurrentBanner
                          ? "border-emerald-300 bg-emerald-50/80"
                          : bannerCategoryLabel === "Limited"
                            ? "border-rose-200 bg-rose-50/60"
                            : bannerCategoryLabel === "Special"
                              ? "border-amber-200 bg-amber-50/60"
                              : bannerCategoryLabel === "Kernel"
                                ? "border-purple-200 bg-purple-50/60"
                                : "border-slate-200 bg-white"
                      }`}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className={`h-1.5 w-full ${
                        isCurrentBanner
                          ? "bg-gradient-to-r from-emerald-400 to-green-500"
                          : bannerCategoryLabel === "Limited"
                            ? "bg-gradient-to-r from-rose-400 to-pink-500"
                            : bannerCategoryLabel === "Special"
                              ? "bg-gradient-to-r from-amber-400 to-orange-500"
                              : bannerCategoryLabel === "Kernel"
                                ? "bg-gradient-to-r from-purple-400 to-violet-500"
                                : "bg-gradient-to-r from-slate-300 to-slate-400"
                      }`} />
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <Badge
                            className={
                              !banner.enStartDate && estimatedReleaseDate
                                ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-50"
                                : isUpcoming
                                  ? "border-cyan-200 bg-cyan-100 text-cyan-700 hover:bg-cyan-100"
                                  : "border-sky-200 bg-sky-100 text-sky-700 hover:bg-sky-100"
                            }
                          >
                            {banner.enStartDate
                              ? (banner.enEndDate
                                  ? `${formatDisplayDate(banner.enStartDate)} → ${formatDisplayDate(banner.enEndDate)}`
                                  : formatDisplayDate(banner.enStartDate))
                              : estimatedReleaseDate
                                ? `${formatDisplayDate(estimatedReleaseDate)}${estimatedEndDate ? ` → ${formatDisplayDate(estimatedEndDate)}` : ""}`
                                : "Chưa ra"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              bannerIsLimited
                                ? "border-rose-200 bg-rose-100 text-rose-700"
                                : "border-slate-200 bg-slate-50 text-slate-500"
                            }
                          >
                            {bannerCategoryLabel}
                          </Badge>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <p className="mb-3 text-base font-bold leading-tight text-slate-800">
                            {banner.name}
                          </p>

                          <div className="mb-3 w-full">
                            {banner.bannerImageUrl ? (
                              <div className="overflow-hidden rounded-2xl border border-sky-200 bg-slate-100 shadow-sm">
                                <img
                                  src={banner.bannerImageUrl}
                                  alt={banner.name}
                                  className="aspect-[16/9] w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : visibleBannerOperators.length > 0 ? (
                              <div className="grid grid-cols-3 gap-2">
                                {visibleBannerOperators.map((operatorName) => (
                                  <div
                                    key={`${banner.name}-${operatorName}`}
                                    className="mx-auto h-14 w-14 overflow-hidden rounded-2xl border-2 border-white bg-slate-200 shadow-sm"
                                  >
                                    <img
                                      src={`https://arknights.wiki.gg/images/${getWikiImageName(operatorName)}_icon.png`}
                                      alt={operatorName}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-100 to-indigo-100 shadow-sm">
                                <GalleryHorizontal className="h-9 w-9 text-sky-600" />
                              </div>
                            )}
                          </div>

                          {visibleBannerOperators.length > 0 ? (
                            <div className="mt-3 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                              {(expandedBanners.has(getBannerKey(banner))
                                ? visibleBannerOperators
                                : visibleBannerOperators.slice(0, 6)
                              ).map((operatorName) => {
                                const isNewOperator =
                                  isUpcoming &&
                                  (upcomingNewOperatorsByBanner
                                    .get(getBannerKey(banner))
                                    ?.has(operatorName) ??
                                    false);

                                return (
                                  <div
                                    key={`${banner.name}-list-${operatorName}`}
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5"
                                  >
                                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                                      <img
                                        src={`https://arknights.wiki.gg/images/${getWikiImageName(operatorName)}_icon.png`}
                                        alt={operatorName}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                      <span
                                        className="block line-clamp-2 text-[11px] leading-tight text-slate-600"
                                        title={operatorName}
                                      >
                                        {operatorName}
                                      </span>
                                      <div className="flex items-center gap-0.5">
                                        {Array.from({
                                          length: Number(banner.operatorRarities?.[operatorName] ?? 0),
                                        }).map((_, starIndex) => {
                                          const rarity = Number(banner.operatorRarities?.[operatorName] ?? 0);
                                          return (
                                            <Star
                                              key={starIndex}
                                              className={`h-3 w-3 ${
                                                rarity === 6
                                                  ? "fill-orange-500 text-orange-500"
                                                  : rarity === 5
                                                    ? "fill-yellow-500 text-yellow-500"
                                                    : "fill-slate-400 text-slate-400"
                                                }`}
                                            />
                                          );
                                        })}
                                        {banner.operatorRateUp?.[operatorName] === "primary" || banner.operatorRateUp?.[operatorName] === "secondary" ? (
                                          <span
                                            className={`ml-1 inline-flex items-center gap-0.5 text-[10px] font-bold ${
                                              banner.operatorRateUp[operatorName] === "primary"
                                                ? "text-red-500"
                                                : "text-orange-500"
                                            }`}
                                            title={
                                              banner.operatorRateUp[operatorName] === "primary"
                                                ? "Tướng chính đang tăng tỉ lệ xuất hiện"
                                                : "Tướng phụ đang tăng tỉ lệ xuất hiện"
                                            }
                                          >
                                            <ArrowUp className="h-3 w-3" />
                                            UP
                                          </span>
                                        ) : banner.operatorRateUp?.[operatorName] === "shop" ? (
                                          <span
                                            className="ml-1 inline-flex items-center gap-0.5 text-[10px] font-bold text-yellow-600"
                                            title="Tướng này sẽ được bán trong shop"
                                          >
                                            <ShoppingCart className="h-3 w-3" />
                                            SHOP
                                          </span>
                                        ) : null}
                                        {isNewOperator ? (
                                          <span className="ml-1 text-[10px] font-bold text-emerald-600">
                                            NEW
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                          {visibleBannerOperators.length > 6 ? (
                            <button
                              type="button"
                              onClick={() => toggleBannerExpand(getBannerKey(banner))}
                              className="mt-2 w-full rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
                            >
                              {expandedBanners.has(getBannerKey(banner))
                                ? "Thu gọn"
                                : `Xem thêm ${visibleBannerOperators.length - 6} operator`}
                            </button>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {categoryFilteredBanners.length === 0 && !isBannerLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full border border-sky-200 bg-sky-50 p-4">
                    <GalleryHorizontal className="h-10 w-10 text-sky-400" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700">
                    Không tìm thấy banner
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {bannerSearch
                      ? `Không có banner nào khớp với "${bannerSearch}"${
                          bannerCategoryFilter !== "Tất cả"
                            ? ` trong mục ${bannerCategoryFilter}`
                            : ""
                        }.`
                      : `Không có banner nào trong mục "${bannerCategoryFilter}".`}
                  </p>
                  {(bannerSearch || bannerCategoryFilter !== "Tất cả") ? (
                    <button
                      type="button"
                      onClick={() => {
                        setBannerSearch("");
                        setBannerCategoryFilter("Tất cả");
                      }}
                      className="mt-4 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition-colors hover:border-sky-300 hover:bg-sky-50"
                    >
                      Xóa bộ lọc
                    </button>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
