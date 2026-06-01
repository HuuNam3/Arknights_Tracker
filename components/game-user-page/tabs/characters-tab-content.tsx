"use client";

import { AlertCircle, Loader2, Search, Star, Users } from "lucide-react";
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

type CharactersTabContentProps = {
  filteredOperators: any[];
  formatDisplayDate: (value: string | null | undefined) => string | null;
  getOperatorRarityValue: (operator: any) => number | null;
  getWikiImageName: (value: string) => string;
  isOperatorLoading: boolean;
  operatorError: string;
  operatorPage: number;
  operatorSearch: string;
  operatorStarFilter: string;
  operatorTotalPages: number;
  paginatedOperators: any[];
  setOperatorPage: (value: any) => void;
  setOperatorSearch: (value: string) => void;
  setOperatorStarFilter: (value: string) => void;
};

export function CharactersTabContent({
  filteredOperators,
  formatDisplayDate,
  getOperatorRarityValue,
  getWikiImageName,
  isOperatorLoading,
  operatorError,
  operatorPage,
  operatorSearch,
  operatorStarFilter,
  operatorTotalPages,
  paginatedOperators,
  setOperatorPage,
  setOperatorSearch,
  setOperatorStarFilter,
}: CharactersTabContentProps) {
  return (
    <TabsContent value="characters" className="mt-0 focus-visible:outline-none space-y-6">
      <Card className="glass-card overflow-hidden border-0 shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
        <CardHeader className="border-b border-slate-100 bg-white pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <div className="rounded-lg border border-emerald-200 bg-emerald-100 p-2">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            Characters
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Theo dõi danh sách operator, ngày ra mắt Global và lọc nhanh theo tên
            hoặc độ hiếm.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-3xl flex-1 flex-col gap-3 md:flex-row">
              <div className="relative max-w-xl flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  placeholder="Tim theo ten"
                  value={operatorSearch}
                  onChange={(e) => setOperatorSearch(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-base text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", "6", "5", "4", "3", "2", "1"].map((starValue) => (
                  <Button
                    key={starValue}
                    type="button"
                    variant={operatorStarFilter === starValue ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOperatorStarFilter(starValue)}
                    className={
                      operatorStarFilter === starValue
                        ? "rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                        : "rounded-lg border-slate-200 text-slate-600"
                    }
                  >
                    {starValue === "all" ? "Tất cả" : `${starValue}★`}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                {filteredOperators.length} character
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                Trang {operatorPage}/{operatorTotalPages}
              </Badge>
            </div>
          </div>

          {isOperatorLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
              <p className="font-medium text-slate-500">Đang tải danh sách character...</p>
            </div>
          ) : operatorError ? (
            <Alert className="rounded-xl border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertDescription className="ml-2 text-base font-medium">
                {operatorError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {paginatedOperators.map((operator) => {
                  const rarity = getOperatorRarityValue(operator) ?? 0;
                  const isSixStar = rarity === 6;
                  const isFiveStar = rarity === 5;
                  const isReleased = operator.globalReleased;
                  const globalReleaseLabel = formatDisplayDate(
                    operator.enReleaseDate ?? operator.releaseDate,
                  );

                  return (
                    <Card
                      key={`${operator.name}-${operator.releaseDate}`}
                      className="overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                      title={operator.event}
                    >
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <Badge
                            className={
                              isReleased
                                ? "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "border-cyan-200 bg-cyan-100 text-cyan-700 hover:bg-cyan-100"
                            }
                          >
                            {isReleased ? globalReleaseLabel ?? "Đã ra" : "Chưa ra"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              operator.limited
                                ? "border-rose-200 bg-rose-100 text-rose-700"
                                : "border-slate-200 bg-slate-50 text-slate-500"
                            }
                          >
                            {operator.limited ? "Limited" : "Thuong"}
                          </Badge>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className="mb-3 h-20 w-20 overflow-hidden rounded-2xl border border-slate-100 bg-slate-200 shadow-sm">
                            <img
                              src={`https://arknights.wiki.gg/images/${getWikiImageName(operator.name)}_icon.png`}
                              alt={operator.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>

                          <p className="flex min-h-[2.5rem] items-center font-bold leading-tight text-slate-800">
                            {operator.name}
                          </p>

                          <div className="mb-3 mt-2 flex items-center gap-0.5">
                            {Array.from({
                              length: Number.isFinite(rarity) ? rarity : 0,
                            }).map((_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-3.5 w-3.5 ${
                                  isSixStar
                                    ? "fill-orange-500 text-orange-500"
                                    : isFiveStar
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "fill-slate-400 text-slate-400"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {filteredOperators.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={operatorPage <= 1}
                    onClick={() => setOperatorPage(1)}
                    className="rounded-lg"
                  >
                    «
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={operatorPage <= 1}
                    onClick={() => setOperatorPage((page: number) => Math.max(1, page - 1))}
                    className="rounded-lg"
                  >
                    ‹
                  </Button>
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-white px-3 py-1.5 text-slate-600"
                  >
                    Trang {operatorPage} / {operatorTotalPages}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={operatorPage >= operatorTotalPages}
                    onClick={() =>
                      setOperatorPage((page: number) => Math.min(operatorTotalPages, page + 1))
                    }
                    className="rounded-lg"
                  >
                    ›
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={operatorPage >= operatorTotalPages}
                    onClick={() => setOperatorPage(operatorTotalPages)}
                    className="rounded-lg"
                  >
                    »
                  </Button>
                </div>
              ) : null}
              {filteredOperators.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  Không có character nào khớp với từ khóa tìm kiếm.
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
