"use client";

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

type GachaTabContentProps = {
  cookieToken: string;
  effectiveGachaTotalPages: number;
  errorMessage: string;
  filteredGachaData: any[];
  gachaAttempted: boolean;
  gachaData: any;
  gachaPage: number;
  gachaPageSize: number;
  gachaTypeFilter: string;
  getWikiImageName: (value: string) => string;
  handleGachaKeyPress: (e: KeyboardEvent) => void;
  handleGachaPageChange: (page: number) => void;
  handleGachaSizeChange: (size: number) => void;
  handleSearchGacha: (page: number) => void;
  isGachaLoading: boolean;
  paginatedGachaData: Array<{
    index: number;
    item: { atStr: string; charName: string; poolName: string; typeName: string };
    pityCount: number | null;
    starValue: number;
  }>;
  setCookieToken: (value: string) => void;
  setGachaTypeFilter: (value: string) => void;
  setShowGachaSixStarOnly: (value: any) => void;
  showGachaSixStarOnly: boolean;
};

export function GachaTabContent({
  cookieToken,
  effectiveGachaTotalPages,
  errorMessage,
  filteredGachaData,
  gachaAttempted,
  gachaData,
  gachaPage,
  gachaPageSize,
  gachaTypeFilter,
  getWikiImageName,
  handleGachaKeyPress,
  handleGachaPageChange,
  handleGachaSizeChange,
  handleSearchGacha,
  isGachaLoading,
  paginatedGachaData,
  setCookieToken,
  setGachaTypeFilter,
  setShowGachaSixStarOnly,
  showGachaSixStarOnly,
}: GachaTabContentProps) {
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
              onClick={() => handleSearchGacha(1)}
              className="h-12 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-orange-600"
            >
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

      {isGachaLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
          <p className="animate-pulse font-medium text-slate-500">Đang tải lịch sử gacha...</p>
        </div>
      ) : gachaAttempted && gachaData ? (
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
                {[
                  "all",
                  "Special Headhunting",
                  "Regular Headhunting",
                  "Limited Headhunting",
                ].map((typeValue) => (
                  <Button
                    key={typeValue}
                    type="button"
                    variant={gachaTypeFilter === typeValue ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGachaTypeFilter(typeValue)}
                    className={
                      gachaTypeFilter === typeValue
                        ? "rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                        : "rounded-lg border-slate-200 text-slate-600"
                    }
                  >
                    {typeValue === "all" ? "Tất cả" : typeValue}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={showGachaSixStarOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowGachaSixStarOnly((current: boolean) => !current)}
                  className={
                    showGachaSixStarOnly
                      ? "rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                      : "rounded-lg border-slate-200 text-slate-600"
                  }
                >
                  Chỉ 6★
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {paginatedGachaData.map(({ item, pityCount, starValue, index }) => {
                  const isSixStar = starValue === 6;
                  const isFiveStar = starValue === 5;
                  const isFourStar = starValue === 4;

                  return (
                    <Card
                      key={`${item.charName}-${item.atStr}-${index}`}
                      className="overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                      title={item.poolName}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-3 h-20 w-20 overflow-hidden rounded-2xl border border-slate-100 bg-slate-200 shadow-sm">
                            <img
                              src={`https://arknights.wiki.gg/images/${getWikiImageName(item.charName)}_icon.png`}
                              alt={item.charName}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>

                          <p
                            className={`flex min-h-[2.5rem] items-center font-bold leading-tight ${
                              isSixStar
                                ? "text-orange-600"
                                : isFiveStar
                                  ? "text-yellow-600"
                                  : isFourStar
                                    ? "text-purple-600"
                                    : "text-slate-700"
                            }`}
                          >
                            {item.charName}
                          </p>

                          <div className="mb-3 mt-2 flex items-center gap-0.5">
                            {Array.from({ length: starValue }).map((_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-3.5 w-3.5 ${
                                  isSixStar
                                    ? "fill-orange-500 text-orange-500"
                                    : isFiveStar
                                      ? "fill-yellow-500 text-yellow-500"
                                      : isFourStar
                                        ? "fill-purple-500 text-purple-500"
                                        : "fill-slate-400 text-slate-400"
                                }`}
                              />
                            ))}
                          </div>

                          <Badge
                            variant="outline"
                            className="max-w-full border-slate-200 bg-slate-50 text-slate-500"
                          >
                            <span className="block max-w-[140px] truncate">{item.typeName}</span>
                          </Badge>
                          {isSixStar && pityCount !== null ? (
                            <Badge className="mt-2 border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-100">
                              {pityCount} lần rút
                            </Badge>
                          ) : null}
                          <p className="mt-2 text-xs text-slate-400">{item.atStr}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {filteredGachaData.length === 0 ? (
                <div className="p-4 text-center text-slate-500">Không tìm thấy dữ liệu gacha.</div>
              ) : null}
              {effectiveGachaTotalPages >= 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                      Trang <strong>{gachaPage}</strong> / <strong>{effectiveGachaTotalPages}</strong>
                    </span>
                    {!showGachaSixStarOnly ? (
                      <div className="ml-4 flex items-center gap-1">
                        <span className="text-xs text-slate-400">Hiển thị:</span>
                        {[10, 20, 50, 100].map((size) => (
                          <button
                            key={size}
                            disabled={isGachaLoading}
                            onClick={() => handleGachaSizeChange(size)}
                            className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                              gachaPageSize === size
                                ? "bg-amber-500 text-white"
                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={gachaPage <= 1 || isGachaLoading}
                      onClick={() => handleGachaPageChange(1)}
                      className="h-8 w-8 p-0 text-slate-600"
                    >
                      «
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={gachaPage <= 1 || isGachaLoading}
                      onClick={() => handleGachaPageChange(gachaPage - 1)}
                      className="h-8 w-8 p-0 text-slate-600"
                    >
                      ‹
                    </Button>
                    {Array.from({ length: Math.min(5, effectiveGachaTotalPages) }, (_, i) => {
                      const start = Math.max(
                        1,
                        Math.min(gachaPage - 2, effectiveGachaTotalPages - 4),
                      );
                      const page = start + i;

                      return (
                        <Button
                          key={page}
                          variant={page === gachaPage ? "default" : "ghost"}
                          size="sm"
                          disabled={isGachaLoading}
                          onClick={() => handleGachaPageChange(page)}
                          className={`h-8 w-8 p-0 text-sm ${
                            page === gachaPage
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "text-slate-600"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={gachaPage >= effectiveGachaTotalPages || isGachaLoading}
                      onClick={() => handleGachaPageChange(gachaPage + 1)}
                      className="h-8 w-8 p-0 text-slate-600"
                    >
                      ›
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={gachaPage >= effectiveGachaTotalPages || isGachaLoading}
                      onClick={() => handleGachaPageChange(effectiveGachaTotalPages)}
                      className="h-8 w-8 p-0 text-slate-600"
                    >
                      »
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : gachaAttempted && !gachaData && !isGachaLoading ? (
        <Alert className="animate-fade-in rounded-xl border-red-200 bg-red-50 text-red-800 shadow-sm backdrop-blur-md">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <AlertDescription className="ml-2 text-base font-medium">
            {errorMessage || "Cookie không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."}
          </AlertDescription>
        </Alert>
      ) : null}
    </TabsContent>
  );
}
