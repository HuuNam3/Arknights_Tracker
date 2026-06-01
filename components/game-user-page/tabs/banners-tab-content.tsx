"use client";

import { AlertCircle, GalleryHorizontal, Loader2, Search } from "lucide-react";
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

type BannersTabContentProps = {
  bannerError: string;
  bannerPage: number;
  bannerSearch: string;
  bannerTotalPages: number;
  bannerPredictionDetailsByKey: Map<string, any>;
  earliestReleasedBannerDateByOperator: Map<string, string>;
  filteredBanners: any[];
  formatDisplayDate: (value: string | null | undefined) => string | null;
  getBannerKey: (banner: any) => string;
  getNormalizedBannerOperatorNames: (banner: any) => string[];
  getWikiImageName: (value: string) => string;
  isBannerLimited: (banner: any) => boolean;
  isBannerLoading: boolean;
  paginatedBanners: any[];
  setBannerPage: (value: any) => void;
  setBannerSearch: (value: string) => void;
  upcomingNewOperatorsByBanner: Map<string, Set<string>>;
};

export function BannersTabContent({
  bannerError,
  bannerPage,
  bannerPredictionDetailsByKey,
  bannerSearch,
  bannerTotalPages,
  earliestReleasedBannerDateByOperator,
  filteredBanners,
  formatDisplayDate,
  getBannerKey,
  getNormalizedBannerOperatorNames,
  getWikiImageName,
  isBannerLimited,
  isBannerLoading,
  paginatedBanners,
  setBannerPage,
  setBannerSearch,
  upcomingNewOperatorsByBanner,
}: BannersTabContentProps) {
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
            Xem banner đã ra và sắp ra, kèm character xuất hiện trong từng banner
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
                placeholder="Tim theo ten banner, category hoac character"
                value={bannerSearch}
                onChange={(e) => setBannerSearch(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-base text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-400/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                {filteredBanners.length} banner
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                Trang {bannerPage}/{bannerTotalPages}
              </Badge>
            </div>
          </div>

          {isBannerLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
              <p className="font-medium text-slate-500">Đang tải danh sách banner...</p>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedBanners.map((banner) => {
                  const isReleased = Boolean(banner.enStartDate);
                  const bannerIsLimited = isBannerLimited(banner);
                  const visibleBannerOperators = getNormalizedBannerOperatorNames(banner);
                  const predictionDetails =
                    bannerPredictionDetailsByKey.get(getBannerKey(banner)) ?? null;
                  const estimatedReleaseDate = !isReleased ? predictionDetails?.date ?? null : null;

                  return (
                    <Card
                      key={`${banner.name}-${banner.releaseDate}`}
                      className="overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                      title={banner.name}
                    >
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <Badge
                            className={
                              isReleased
                                ? "border-sky-200 bg-sky-100 text-sky-700 hover:bg-sky-100"
                                : "border-cyan-200 bg-cyan-100 text-cyan-700 hover:bg-cyan-100"
                            }
                          >
                            {isReleased ? formatDisplayDate(banner.enStartDate) ?? "Đã ra" : "Chưa ra"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              bannerIsLimited
                                ? "border-rose-200 bg-rose-100 text-rose-700"
                                : "border-slate-200 bg-slate-50 text-slate-500"
                            }
                          >
                            {bannerIsLimited ? "Limited" : banner.category}
                          </Badge>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <p className="flex min-h-[3rem] items-center justify-center text-base font-bold leading-tight text-slate-800">
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

                          <p className="flex min-h-[3rem] items-center font-bold leading-tight text-slate-800">
                            {visibleBannerOperators.length} character
                          </p>

                          {visibleBannerOperators.length > 0 ? (
                            <div className="mt-3 grid w-full grid-cols-2 gap-2">
                              {visibleBannerOperators.map((operatorName) => {
                                const isNewOperator = banner.enStartDate
                                  ? earliestReleasedBannerDateByOperator.get(operatorName) ===
                                    banner.enStartDate
                                  : upcomingNewOperatorsByBanner
                                      .get(getBannerKey(banner))
                                      ?.has(operatorName) ?? false;

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
                                      <span className="block line-clamp-2 text-[11px] leading-tight text-slate-600">
                                        {operatorName}
                                      </span>
                                      {isNewOperator ? (
                                        <span className="text-[10px] font-bold text-emerald-600">
                                          NEW
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}

                          {!isReleased && estimatedReleaseDate ? (
                            <>
                              <p className="mt-2 text-[11px] font-medium text-amber-600">
                                Dự đoán: {formatDisplayDate(estimatedReleaseDate)}
                              </p>
                              {predictionDetails ? (
                                <p className="mt-1 text-[10px] text-slate-500">
                                  Dựa trên {predictionDetails.sampleSize} banner {predictionDetails.reason}.
                                </p>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {filteredBanners.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bannerPage <= 1}
                    onClick={() => setBannerPage(1)}
                    className="rounded-lg"
                  >
                    «
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bannerPage <= 1}
                    onClick={() => setBannerPage((page: number) => Math.max(1, page - 1))}
                    className="rounded-lg"
                  >
                    ‹
                  </Button>
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white px-3 py-1.5 text-slate-600"
                  >
                    Trang {bannerPage} / {bannerTotalPages}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bannerPage >= bannerTotalPages}
                    onClick={() =>
                      setBannerPage((page: number) => Math.min(bannerTotalPages, page + 1))
                    }
                    className="rounded-lg"
                  >
                    ›
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={bannerPage >= bannerTotalPages}
                    onClick={() => setBannerPage(bannerTotalPages)}
                    className="rounded-lg"
                  >
                    »
                  </Button>
                </div>
              ) : null}
              {filteredBanners.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  Không có banner nào khớp với từ khóa tìm kiếm.
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
