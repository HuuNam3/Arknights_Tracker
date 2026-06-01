"use client";

import { ChevronDown, ChevronUp, Plus, Search, Trophy, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

type TierListTabContentProps = {
  getTierBadgeClassName: (tier: string) => string;
  handleAddTier: () => void;
  handleAssignOperatorToTier: (operatorName: string, tier: string) => void;
  handleDeleteSavedTierList: (id: string) => void;
  handleDeleteTier: (tier: string) => void;
  handleLoadSavedTierListToEditor: (tierList: any) => void;
  handleMoveTier: (index: number, direction: number) => void;
  handleOpenSavedTierList: (tierList: any) => void;
  handleSaveTierList: () => void;
  newTierName: string;
  paginatedTierPoolCandidates: any[];
  savedTierLists: any[];
  selectedTierBoard: Array<{ operators: any[]; tier: string }>;
  selectedTierList: any | null;
  setNewTierName: (value: string) => void;
  setTierAssignments: (value: Record<string, string>) => void;
  setTierListName: (value: string) => void;
  setTierListView: (value: string) => void;
  setTierPoolPage: (value: any) => void;
  setTierSearch: (value: string) => void;
  setTierStarFilter: (value: string) => void;
  tierAssignments: Record<string, string>;
  tierBoard: Array<{ operators: any[]; tier: string }>;
  tierListName: string;
  tierListView: string;
  tierOrder: string[];
  tierPoolPage: number;
  tierPoolTotalPages: number;
  tierSearch: string;
  tierStarFilter: string;
  unassignedOperatorCount: number;
  unassignedTierCandidates: any[];
  TierAssignmentAvatar: any;
  TierOperatorAvatar: any;
};

export function TierListTabContent({
  getTierBadgeClassName,
  handleAddTier,
  handleAssignOperatorToTier,
  handleDeleteSavedTierList,
  handleDeleteTier,
  handleLoadSavedTierListToEditor,
  handleMoveTier,
  handleOpenSavedTierList,
  handleSaveTierList,
  newTierName,
  paginatedTierPoolCandidates,
  savedTierLists,
  selectedTierBoard,
  selectedTierList,
  setNewTierName,
  setTierAssignments,
  setTierListName,
  setTierListView,
  setTierPoolPage,
  setTierSearch,
  setTierStarFilter,
  tierBoard,
  tierListName,
  tierListView,
  tierOrder,
  tierPoolPage,
  tierPoolTotalPages,
  tierSearch,
  tierStarFilter,
  unassignedOperatorCount,
  unassignedTierCandidates,
  TierAssignmentAvatar,
  TierOperatorAvatar,
}: TierListTabContentProps) {
  return (
    <TabsContent value="tierlist" className="mt-0 focus-visible:outline-none space-y-6">
      <Card className="glass-card overflow-hidden border-0 shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-orange-500 to-amber-400" />
        <CardHeader className="border-b border-slate-100 bg-white pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
            <div className="rounded-lg border border-rose-200 bg-rose-100 p-2">
              <Trophy className="h-6 w-6 text-rose-600" />
            </div>
            Tier List
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Xem tier list mặc định, tạo tier list riêng và sắp xếp operator theo cách
            đánh giá của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={tierListView === "browse" ? "default" : "outline"}
              onClick={() => setTierListView("browse")}
              className={
                tierListView === "browse"
                  ? "rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                  : "rounded-xl border-slate-200 text-slate-600"
              }
            >
              Xem tier list
            </Button>
            <Button
              type="button"
              variant={tierListView === "create" ? "default" : "outline"}
              onClick={() => setTierListView("create")}
              className={
                tierListView === "create"
                  ? "rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                  : "rounded-xl border-slate-200 text-slate-600"
              }
            >
              Tự tạo
            </Button>
          </div>

          {tierListView === "browse" ? (
            <div className="space-y-4">
              {savedTierLists.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {savedTierLists.map((tierList) => (
                    <button
                      key={tierList.id}
                      type="button"
                      onClick={() => handleOpenSavedTierList(tierList)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        selectedTierList?.id === tierList.id
                          ? "border-rose-300 bg-white shadow-sm"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">{tierList.name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(tierList.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  Chưa có tier list nào để xem.
                </div>
              )}

              <div className="space-y-3">
                {selectedTierList ? (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-lg font-bold text-slate-800">{selectedTierList.name}</p>
                    </div>
                    {selectedTierBoard.map(({ tier, operators }) => (
                      <div
                        key={`selected-tier-board-${tier}`}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                          <Badge className={getTierBadgeClassName(tier)}>{tier}</Badge>
                          <span className="text-sm text-slate-500">{operators.length} character</span>
                        </div>
                        {operators.length > 0 ? (
                          <div className="flex flex-wrap gap-3 p-4">
                            {operators.map((operator) => (
                              <TierOperatorAvatar
                                key={`selected-tier-card-${tier}-${operator.name}`}
                                operator={operator}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-sm text-slate-400">
                            Chưa có character trong tier này.
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                    Chọn một tier list ở trên để xem.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-slate-800">Tierlist da tao</p>
                  <p className="text-xs text-slate-400">Chọn để sửa, xem hoặc xóa.</p>
                </div>
                {savedTierLists.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {savedTierLists.map((tierList) => (
                      <div
                        key={`create-tier-list-${tierList.id}`}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">{tierList.name}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(tierList.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSavedTierList(tierList)}
                              className="rounded-lg border-slate-200 text-slate-600"
                            >
                              Xem
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleLoadSavedTierListToEditor(tierList)}
                              className="rounded-lg border-slate-200 text-slate-600"
                            >
                              Sua
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSavedTierList(tierList.id)}
                              className="rounded-lg border-red-200 text-red-600"
                            >
                              Xoa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-400">
                    Chưa có tierlist nào đã lưu.
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 xl:flex-row">
                <Input
                  placeholder="Đặt tên tier list"
                  value={tierListName}
                  onChange={(e) => setTierListName(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20 xl:max-w-[320px]"
                />
                <Input
                  placeholder="Tạo tier mới, ví dụ SS hoặc Meme"
                  value={newTierName}
                  onChange={(e) => setNewTierName(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20 xl:max-w-[320px]"
                />
                <Button
                  type="button"
                  onClick={handleAddTier}
                  className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Plus className="size-4" />
                  Thêm tier
                </Button>
              </div>

              <div className="flex flex-col gap-3 xl:flex-row">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                  placeholder="Tìm character để xếp tier"
                    value={tierSearch}
                    onChange={(e) => setTierSearch(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-base text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSaveTierList}
                  className="rounded-xl bg-rose-500 text-white hover:bg-rose-600"
                >
                  Lưu tier list
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTierAssignments({})}
                  className="rounded-xl border-slate-200 text-slate-600"
                >
                  Xóa xếp hạng
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tierOrder.map((tier, tierIndex) => (
                  <div
                    key={`tier-config-${tier}`}
                    className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1.5"
                  >
                    <Badge className={getTierBadgeClassName(tier)}>{tier}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleMoveTier(tierIndex, -1)}
                      disabled={tierIndex === 0}
                      className="rounded-full text-slate-500"
                      aria-label={`Đưa ${tier} lên trên`}
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleMoveTier(tierIndex, 1)}
                      disabled={tierIndex === tierOrder.length - 1}
                      className="rounded-full text-slate-500"
                      aria-label={`Đưa ${tier} xuống dưới`}
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteTier(tier)}
                      disabled={tierOrder.length <= 1}
                      className="rounded-full text-rose-500 hover:text-rose-600"
                      aria-label={`Xóa tier ${tier}`}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Pool character</p>
                    <p className="text-xs text-slate-400">Bấm avatar để chọn tier ngay tại chỗ.</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-slate-200 text-slate-500"
                  >
                    {unassignedOperatorCount} chua xep
                  </Badge>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {["all", "6", "5", "4", "3", "2", "1"].map((starValue) => (
                    <Button
                      key={`tier-star-filter-${starValue}`}
                      type="button"
                      variant={tierStarFilter === starValue ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTierStarFilter(starValue)}
                      className={
                        tierStarFilter === starValue
                          ? "rounded-lg bg-rose-500 text-white hover:bg-rose-600"
                          : "rounded-lg border-slate-200 text-slate-600"
                      }
                    >
                      {starValue === "all" ? "Tất cả" : `${starValue}★`}
                    </Button>
                  ))}
                </div>
                {unassignedTierCandidates.length > 0 ? (
                  <>
                    <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10">
                      {paginatedTierPoolCandidates.map((operator) => (
                        <TierAssignmentAvatar
                          key={`tier-editor-${operator.name}`}
                          currentTier=""
                          onAssign={(tier: string) => handleAssignOperatorToTier(operator.name, tier)}
                          operator={operator}
                          tierOrder={tierOrder}
                        />
                      ))}
                    </div>
                    {tierPoolTotalPages > 1 ? (
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={tierPoolPage <= 1}
                          onClick={() => setTierPoolPage(1)}
                          className="rounded-lg"
                        >
                          «
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={tierPoolPage <= 1}
                          onClick={() => setTierPoolPage((page: number) => Math.max(1, page - 1))}
                          className="rounded-lg"
                        >
                          ‹
                        </Button>
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-white px-3 py-1.5 text-slate-600"
                        >
                          Trang {tierPoolPage} / {tierPoolTotalPages}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={tierPoolPage >= tierPoolTotalPages}
                          onClick={() =>
                            setTierPoolPage((page: number) => Math.min(tierPoolTotalPages, page + 1))
                          }
                          className="rounded-lg"
                        >
                          ›
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={tierPoolPage >= tierPoolTotalPages}
                          onClick={() => setTierPoolPage(tierPoolTotalPages)}
                          className="rounded-lg"
                        >
                          »
                        </Button>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="py-4 text-sm text-slate-400">
                    Không còn character nào chưa xếp hạng.
                  </div>
                )}
              </div>

              {tierBoard.map(({ tier, operators }) => (
                <div
                  key={`tier-board-${tier}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                    <Badge className={getTierBadgeClassName(tier)}>{tier}</Badge>
                    <span className="text-sm text-slate-500">{operators.length} character</span>
                  </div>
                  {operators.length > 0 ? (
                    <div className="flex flex-wrap gap-3 p-4">
                      {operators.map((operator) => (
                        <TierAssignmentAvatar
                          key={`tier-card-${tier}-${operator.name}`}
                          currentTier={tier}
                          onAssign={(nextTier: string) =>
                            handleAssignOperatorToTier(operator.name, nextTier)
                          }
                          operator={operator}
                          tierOrder={tierOrder}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-slate-400">
                      Chưa có character trong tier này.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
