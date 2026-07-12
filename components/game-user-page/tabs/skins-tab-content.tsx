"use client";

import {
  AlertCircle,
  Search,
  Shirt,
} from "lucide-react";
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

export type UpcomingSkin = {
  brand: string;
  category: "new" | "re-edition";
  durationEnd: number;
  durationStart: number;
  fallbackImageUrl: string | null;
  id: string;
  imageUrl: string | null;
  operator: string;
  price: number | null;
  skinName: string;
  source?: string;
};

type SkinsTabContentProps = {
  filteredSkins: UpcomingSkin[];
  isSkinLoading: boolean;
  setSkinSearch: (value: string) => void;
  skinError: string;
  skinSearch: string;
};

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
          <div className="h-4 w-32 rounded-md bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

const formatDate = (ts: number) => {
  if (!ts) return "";
  const d = new Date(ts);
  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export function SkinsTabContent({
  filteredSkins,
  isSkinLoading,
  setSkinSearch,
  skinError,
  skinSearch,
}: SkinsTabContentProps) {
  return (
    <TabsContent value="skins" className="mt-0 focus-visible:outline-none space-y-6">
      <Card className="glass-card overflow-hidden border-0 shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-pink-400 via-purple-500 to-violet-500" />
        <CardHeader className="border-b border-slate-100 bg-white pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <div className="rounded-lg border border-purple-200 bg-purple-100 p-2">
              <Shirt className="h-6 w-6 text-purple-600" />
            </div>
            Skins sắp ra mắt
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Danh sách outfit sắp được mở bán tại Outfit Store trên Global server.
          </CardDescription>
          <p className="text-xs text-amber-600 font-medium">
            Một số skin có thể là từ CN server với ngày bán khác nhau, thời gian hiển thị chỉ mang tính ước lượng.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-xl flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                placeholder="Tim theo ten skin, operator hoac brand"
                value={skinSearch}
                onChange={(e) => setSkinSearch(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-base text-slate-800 placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                {filteredSkins.length} skin
              </Badge>
            </div>
          </div>

          {isSkinLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : skinError ? (
            <Alert className="rounded-xl border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="ml-2 text-base font-medium">
                {skinError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredSkins.map((skin, index) => {
                  const isCn = skin.source === "cn";
                  const isActive = skin.durationStart > 0 && skin.durationStart <= Date.now() && skin.durationEnd > Date.now();

                  return (
                    <Card
                      key={skin.id}
                      className="animate-[fade-in-up_0.4s_ease-out_both] overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="h-1.5 w-full bg-gradient-to-r from-purple-400 to-violet-500" />
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <Badge
                            className={
                              isCn && skin.durationStart > 0
                                ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-50"
                                : isActive
                                  ? "border-cyan-200 bg-cyan-100 text-cyan-700 hover:bg-cyan-100"
                                  : "border-sky-200 bg-sky-100 text-sky-700 hover:bg-sky-100"
                            }
                          >
                            {skin.durationStart > 0
                              ? `${formatDate(skin.durationStart)} → ${formatDate(skin.durationEnd)}`
                              : "Chưa ra"}
                          </Badge>

                        </div>

                        <div className="flex flex-col items-center text-center">
                          {skin.imageUrl ? (
                            <div className="mb-3 w-full overflow-hidden rounded-2xl border border-purple-200 bg-slate-100 shadow-sm">
                              <img
                                src={skin.imageUrl}
                                alt={skin.skinName}
                                className="aspect-[16/9] w-full object-cover"
                                onError={(e) => {
                                  if (skin.fallbackImageUrl) {
                                    (e.currentTarget as HTMLImageElement).src = skin.fallbackImageUrl;
                                  } else {
                                    e.currentTarget.style.display = "none";
                                  }
                                }}
                              />
                            </div>
                          ) : skin.fallbackImageUrl ? (
                            <div className="mb-3 w-full overflow-hidden rounded-2xl border border-purple-200 bg-slate-100 shadow-sm">
                              <img
                                src={skin.fallbackImageUrl}
                                alt={skin.skinName}
                                className="aspect-[16/9] w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="mx-auto mb-3 flex h-36 w-full items-center justify-center rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-100 to-pink-100 shadow-sm">
                              <Shirt className="h-12 w-12 text-purple-400" />
                            </div>
                          )}

                          <p className="text-base font-bold leading-tight text-slate-800">
                            {skin.skinName}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {skin.operator}
                          </p>

                          <p className="mt-2 text-[11px] font-medium text-slate-500">
                            {skin.brand}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredSkins.length === 0 && !isSkinLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full border border-purple-200 bg-purple-50 p-4">
                    <Shirt className="h-10 w-10 text-purple-400" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700">
                    Không tìm thấy skin
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {skinSearch
                      ? `Không có skin nào khớp với "${skinSearch}".`
                      : "Không có skin nào."}
                  </p>
                  {skinSearch ? (
                    <button
                      type="button"
                      onClick={() => setSkinSearch("")}
                      className="mt-4 rounded-lg border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-600 transition-colors hover:border-purple-300 hover:bg-purple-50"
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
