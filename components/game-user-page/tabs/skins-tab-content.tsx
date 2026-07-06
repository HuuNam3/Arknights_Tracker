"use client";

import {
  AlertCircle,
  Loader2,
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
import { Button } from "@/components/ui/button";
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
  paginatedSkins: UpcomingSkin[];
  showReleasedSkins: boolean;
  setShowReleasedSkins: (value: boolean) => void;
  setSkinPage: (value: any) => void;
  setSkinSearch: (value: string) => void;
  skinError: string;
  skinPage: number;
  skinSearch: string;
  skinTotalPages: number;
};

const formatDate = (ts: number) => {
  if (!ts) return "";
  const d = new Date(ts);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export function SkinsTabContent({
  filteredSkins,
  isSkinLoading,
  paginatedSkins,
  showReleasedSkins,
  setShowReleasedSkins,
  setSkinPage,
  setSkinSearch,
  skinError,
  skinPage,
  skinSearch,
  skinTotalPages,
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
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <button
                type="button"
                onClick={() => setShowReleasedSkins(!showReleasedSkins)}
                className={
                  showReleasedSkins
                    ? "h-10 rounded-xl border border-slate-900 bg-slate-900 px-3 text-sm font-bold text-white transition-colors"
                    : "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                }
              >
                Hiện skin đã ra
              </button>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                {filteredSkins.length} skin
              </Badge>
              {skinTotalPages > 1 ? (
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                  Trang {skinPage}/{skinTotalPages}
                </Badge>
              ) : null}
            </div>
          </div>

          {isSkinLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              <p className="font-medium text-slate-500">Đang tải danh sách skin...</p>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedSkins.map((skin) => (
                  <Card
                    key={skin.id}
                    className="overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <Badge
                          className={
                            skin.source === "cn"
                              ? "border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-100"
                              : skin.category === "new"
                                ? "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100"
                          }
                        >
                          {skin.source === "cn" ? "CN" : skin.category === "new" ? "New" : "Re-edition"}
                        </Badge>
                        <Badge
                          className={
                            skin.source === "cn" || (skin.durationStart > 0 && skin.durationStart > Date.now())
                              ? "border-cyan-200 bg-cyan-100 text-cyan-700 hover:bg-cyan-100"
                              : "border-sky-200 bg-sky-100 text-sky-700 hover:bg-sky-100"
                          }
                        >
                          {skin.source === "cn"
                            ? "Chưa ra"
                            : skin.durationStart > 0 && skin.durationStart <= Date.now()
                              ? formatDate(skin.durationStart)
                              : "Chưa ra"}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          {skin.price ? (
                            <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 flex items-center gap-1">
                              <img
                                src="https://arknights.wiki.gg/images/Originite_Prime.png"
                                alt="OP"
                                className="h-3.5 w-3.5 object-contain"
                              />
                              {skin.price}
                            </Badge>
                          ) : null}
                          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-500">
                            {skin.brand}
                          </Badge>
                        </div>
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

                        {skin.source === "cn" && skin.durationStart > 0 ? (
                          <p className="mt-2 text-[11px] font-medium text-purple-600">
                            Dự kiến: {formatDate(skin.durationStart)}
                          </p>
                        ) : skin.durationStart > 0 && skin.durationEnd > 0 && skin.durationStart <= Date.now() ? (
                          <p className="mt-2 text-[11px] font-medium text-purple-600">
                            Đang bán: {formatDate(skin.durationStart)} - {formatDate(skin.durationEnd)}
                          </p>
                        ) : skin.durationStart > 0 && skin.durationEnd > 0 && skin.durationStart > Date.now() ? (
                          <p className="mt-2 text-[11px] font-medium text-purple-600">
                            {formatDate(skin.durationStart)} - {formatDate(skin.durationEnd)}
                          </p>
                        ) : null}

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredSkins.length > 0 && skinTotalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={skinPage <= 1}
                    onClick={() => setSkinPage(1)}
                    className="rounded-lg"
                  >
                    «
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={skinPage <= 1}
                    onClick={() => setSkinPage((page: number) => Math.max(1, page - 1))}
                    className="rounded-lg"
                  >
                    ‹
                  </Button>
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white px-3 py-1.5 text-slate-600"
                  >
                    Trang {skinPage} / {skinTotalPages}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={skinPage >= skinTotalPages}
                    onClick={() =>
                      setSkinPage((page: number) => Math.min(skinTotalPages, page + 1))
                    }
                    className="rounded-lg"
                  >
                    ›
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={skinPage >= skinTotalPages}
                    onClick={() => setSkinPage(skinTotalPages)}
                    className="rounded-lg"
                  >
                    »
                  </Button>
                </div>
              ) : null}

              {filteredSkins.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  Không có skin nào khớp với từ khóa tìm kiếm.
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
