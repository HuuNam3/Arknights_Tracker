"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Heart, Plus, Search, Star, Trophy, X } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TierListTabContentProps = {
  currentUid: string;
  getTierBadgeClassName: (tier: string) => string;
  handleAddTier: () => void;
  handleAssignOperatorToTier: (operatorName: string, tier: string) => void;
  handleDeleteSavedTierList: (id: string, source?: "public" | "local") => void;
  handleDeleteTier: (tier: string) => void;
  handleLoadSavedTierListToEditor: (tierList: any, source?: "public" | "local") => void;
  handleMoveTier: (index: number, direction: number) => void;
  handleOpenSavedTierList: (tierList: any, source?: "public" | "local") => void;
  handleResetTierListEditor: () => void;
  handleSaveTierList: (target?: "public" | "local") => void;
  handleToggleSavedTierListLike: (tierListId: string) => void;
  isTierListLoading: boolean;
  localTierLists: any[];
  newTierName: string;
  paginatedTierPoolCandidates: any[];
  savedTierLists: any[];
  selectedTierBoard: Array<{ operators: any[]; tier: string }>;
  selectedTierList: any | null;
  selectedTierListSource: "public" | "local";
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
  tierListNameIssue: string;
  tierListNameMaxLength: number;
  tierNameMaxLength: number;
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
  currentUid,
  getTierBadgeClassName,
  handleAddTier,
  handleAssignOperatorToTier,
  handleDeleteSavedTierList,
  handleDeleteTier,
  handleLoadSavedTierListToEditor,
  handleMoveTier,
  handleOpenSavedTierList,
  handleResetTierListEditor,
  handleSaveTierList,
  handleToggleSavedTierListLike,
  isTierListLoading,
  localTierLists,
  newTierName,
  paginatedTierPoolCandidates,
  savedTierLists,
  selectedTierBoard,
  selectedTierList,
  selectedTierListSource,
  setNewTierName,
  setTierAssignments,
  setTierListName,
  setTierListView,
  setTierPoolPage,
  setTierSearch,
  setTierStarFilter,
  tierBoard,
  tierListName,
  tierListNameIssue,
  tierListNameMaxLength,
  tierNameMaxLength,
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
  const [selectedTierSearch, setSelectedTierSearch] = useState("");
  const [savedTierListPage, setSavedTierListPage] = useState(1);
  const normalizedSelectedTierSearch = selectedTierSearch.trim().toLowerCase();
  const SAVED_TIER_LISTS_PAGE_SIZE = 12;
  const savedTierListCardThemes = [
    "border-rose-200 bg-rose-50/70 hover:border-rose-300 hover:bg-rose-50",
    "border-orange-200 bg-orange-50/70 hover:border-orange-300 hover:bg-orange-50",
    "border-amber-200 bg-amber-50/70 hover:border-amber-300 hover:bg-amber-50",
    "border-yellow-200 bg-yellow-50/70 hover:border-yellow-300 hover:bg-yellow-50",
    "border-lime-200 bg-lime-50/70 hover:border-lime-300 hover:bg-lime-50",
    "border-emerald-200 bg-emerald-50/70 hover:border-emerald-300 hover:bg-emerald-50",
    "border-teal-200 bg-teal-50/70 hover:border-teal-300 hover:bg-teal-50",
    "border-cyan-200 bg-cyan-50/70 hover:border-cyan-300 hover:bg-cyan-50",
    "border-sky-200 bg-sky-50/70 hover:border-sky-300 hover:bg-sky-50",
    "border-indigo-200 bg-indigo-50/70 hover:border-indigo-300 hover:bg-indigo-50",
    "border-violet-200 bg-violet-50/70 hover:border-violet-300 hover:bg-violet-50",
    "border-fuchsia-200 bg-fuchsia-50/70 hover:border-fuchsia-300 hover:bg-fuchsia-50",
  ];
  const getTierListLikes = (tierList: any) =>
    Array.isArray(tierList.likes)
      ? tierList.likes.filter((likedUid: unknown): likedUid is string => typeof likedUid === "string")
      : [];
  const getOperatorRarityNumber = (operator: any) => {
    const rarity = Number.parseInt(String(operator.rarity ?? ""), 10);

    return Number.isFinite(rarity) ? rarity : 0;
  };
  const getOperatorRarityCardClassName = (rarity: number) => {
    switch (rarity) {
      case 6:
        return "border-orange-200 bg-orange-50";
      case 5:
        return "border-amber-200 bg-amber-50";
      case 4:
        return "border-violet-200 bg-violet-50";
      case 3:
        return "border-sky-200 bg-sky-50";
      case 2:
        return "border-emerald-200 bg-emerald-50";
      default:
        return "border-slate-200 bg-slate-50";
    }
  };
  const sortedSavedTierLists = useMemo(
    () =>
      [...savedTierLists].sort((left, right) => {
        const likeDifference = getTierListLikes(right).length - getTierListLikes(left).length;

        if (likeDifference !== 0) {
          return likeDifference;
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }),
    [savedTierLists],
  );
  const editablePublicTierLists = useMemo(
    () =>
      currentUid
        ? savedTierLists.filter((tierList) => tierList.authorUid === currentUid)
        : [],
    [currentUid, savedTierLists],
  );
  const savedTierListTotalPages = Math.max(
    1,
    Math.ceil(sortedSavedTierLists.length / SAVED_TIER_LISTS_PAGE_SIZE),
  );
  const paginatedSavedTierLists = sortedSavedTierLists.slice(
    (savedTierListPage - 1) * SAVED_TIER_LISTS_PAGE_SIZE,
    savedTierListPage * SAVED_TIER_LISTS_PAGE_SIZE,
  );
  const selectedTierSearchResults = useMemo(
    () =>
      normalizedSelectedTierSearch
        ? selectedTierBoard
            .flatMap(({ tier, operators }) =>
              operators.map((operator) => ({
                operator,
                tier,
              })),
            )
            .filter(({ operator }) =>
              operator.name.toLowerCase().includes(normalizedSelectedTierSearch),
            )
            .sort((left, right) => left.operator.name.localeCompare(right.operator.name))
        : [],
    [normalizedSelectedTierSearch, selectedTierBoard],
  );
  useEffect(() => {
    setSavedTierListPage((current) => Math.min(current, savedTierListTotalPages));
  }, [savedTierListTotalPages]);

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
              Tierlist của mọi người
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
              {isTierListLoading ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">Đang tải tier list...</p>
                    <Badge variant="outline" className="border-slate-200 bg-white text-slate-500">
                      MongoDB
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: SAVED_TIER_LISTS_PAGE_SIZE }).map((_, index) => (
                      <div
                        key={`tier-list-loading-${index}`}
                        className={`min-h-28 animate-pulse rounded-2xl border p-4 ${
                          savedTierListCardThemes[index % savedTierListCardThemes.length]
                        }`}
                      >
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                        <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
                        <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : savedTierLists.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {paginatedSavedTierLists.map((tierList, tierListIndex) => (
                      (() => {
                        const likes = getTierListLikes(tierList);
                        const isLiked = currentUid ? likes.includes(currentUid) : false;
                        const cardTheme =
                          savedTierListCardThemes[tierListIndex % savedTierListCardThemes.length];

                        return (
                          <button
                            key={tierList.id}
                            type="button"
                            onClick={() => handleOpenSavedTierList(tierList)}
                            className={`min-h-28 w-full rounded-2xl border p-4 text-left transition-all ${
                              selectedTierList?.id === tierList.id
                                ? `${cardTheme} shadow-sm ring-2 ring-rose-200`
                                : cardTheme
                            }`}
                          >
                            <div className="flex h-full items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-800">{tierList.name}</p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {new Date(tierList.createdAt).toLocaleDateString("vi-VN")}
                                </p>
                                <p className="mt-1 truncate text-xs text-slate-400">
                                  {tierList.authorName || "Chưa có tên"}
                                  {tierList.authorUid ? ` · UID ${tierList.authorUid}` : ""}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-rose-500">
                                <Heart
                                  className={`size-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                                />
                                {likes.length}
                              </div>
                            </div>
                          </button>
                        );
                      })()
                    ))}
                  </div>
                  {savedTierListTotalPages > 1 ? (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={savedTierListPage <= 1}
                        onClick={() => setSavedTierListPage((page) => Math.max(1, page - 1))}
                        className="rounded-lg border-slate-200 text-slate-600"
                      >
                        Trước
                      </Button>
                      <Badge variant="outline" className="border-slate-200 bg-white px-3 py-1.5 text-slate-600">
                        Trang {savedTierListPage} / {savedTierListTotalPages}
                      </Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={savedTierListPage >= savedTierListTotalPages}
                        onClick={() =>
                          setSavedTierListPage((page) =>
                            Math.min(savedTierListTotalPages, page + 1),
                          )
                        }
                        className="rounded-lg border-slate-200 text-slate-600"
                      >
                        Sau
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  Chưa có tier list nào để xem.
                </div>
              )}

              <div className="space-y-3">
                {selectedTierList ? (
                  (() => {
                    const selectedLikes = getTierListLikes(selectedTierList);
                    const isSelectedLiked = currentUid
                      ? selectedLikes.includes(currentUid)
                      : false;

                    return (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-bold text-slate-800">
                            {selectedTierList.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            Người tạo: {selectedTierList.authorName || "Chưa có tên"}
                            {selectedTierList.authorUid ? ` · UID ${selectedTierList.authorUid}` : ""}
                          </p>
                        </div>
                        {selectedTierListSource === "public" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSelectedLiked}
                            onClick={() => handleToggleSavedTierListLike(selectedTierList.id)}
                            className={`rounded-xl border-rose-200 ${
                              isSelectedLiked
                                ? "bg-rose-50 text-rose-600"
                                : "bg-white text-slate-600"
                            }`}
                          >
                            <Heart
                              className={`size-4 ${
                                isSelectedLiked ? "fill-rose-500 text-rose-500" : ""
                              }`}
                            />
                            {selectedLikes.length}
                          </Button>
                        ) : null}
                      </div>
                      <p className="mb-3 text-xs text-slate-400">
                        Tìm character để xem nhanh avatar, tên và sao trong list này.
                      </p>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          value={selectedTierSearch}
                          onChange={(e) => setSelectedTierSearch(e.target.value)}
                          placeholder="Tìm character trong tier list này"
                          className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-base text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20"
                        />
                      </div>

                      {normalizedSelectedTierSearch ? (
                        <div className="mt-3">
                          {selectedTierSearchResults.length > 0 ? (
                            <div className="max-h-[330px] overflow-y-auto pr-1">
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                {selectedTierSearchResults.map(({ operator, tier }) => {
                                  const rarity = getOperatorRarityNumber(operator);

                                  return (
                              <div
                                key={`selected-tier-search-${operator.name}-${tier}`}
                                className={`min-h-[102px] rounded-xl border p-3 ${getOperatorRarityCardClassName(
                                  rarity,
                                )}`}
                              >
                                <div className="flex min-w-0 items-start gap-3">
                                  <TierOperatorAvatar operator={operator} sizeClassName="size-12" />
                                  <div className="min-w-0 flex-1">
                                    <div className="min-w-0">
                                      <p className="truncate font-semibold text-slate-800">
                                        {operator.name}
                                      </p>
                                    </div>
                                    <div className="mt-1">
                                      <Badge className={getTierBadgeClassName(tier)}>{tier}</Badge>
                                    </div>
                                    {rarity > 0 ? (
                                      <div className="mt-2 flex items-center gap-0.5">
                                        {Array.from({ length: rarity }).map((_, starIndex) => (
                                          <Star
                                            key={`selected-tier-search-${operator.name}-${tier}-star-${starIndex}`}
                                            className="h-3.5 w-3.5 fill-amber-500 text-amber-500"
                                          />
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="mt-2 text-xs text-slate-500">Không rõ sao</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                              Không tìm thấy character trong tier list này.
                            </div>
                          )}
                        </div>
                      ) : null}
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
                    );
                  })()
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
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Tier cho mọi người xem</p>
                    <p className="text-xs text-slate-400">Bấm vào card để xem, hoặc sửa/xóa bằng nút bên phải.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-slate-200 text-slate-600"
                      >
                        <Plus className="size-4" />
                        Tạo tierlist mới
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tạo tierlist mới?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bản nháp hiện tại sẽ được xóa để bắt đầu một tierlist mới.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleResetTierListEditor}
                          className="bg-slate-900 text-white hover:bg-slate-800"
                        >
                          Tạo mới
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {editablePublicTierLists.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {editablePublicTierLists.map((tierList) => (
                      <div
                        key={`create-tier-list-${tierList.id}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOpenSavedTierList(tierList, "public")}
                        onKeyDown={(event) => {
                          if (
                            event.target === event.currentTarget &&
                            (event.key === "Enter" || event.key === " ")
                          ) {
                            event.preventDefault();
                            handleOpenSavedTierList(tierList, "public");
                          }
                        }}
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-rose-200 hover:bg-rose-50/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">{tierList.name}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(tierList.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div
                            className="flex items-center gap-2"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-slate-200 text-slate-600"
                                >
                                  Sửa
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Mở tier list để sửa?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bản nháp hiện tại sẽ được thay bằng tier list này.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleLoadSavedTierListToEditor(tierList, "public")}
                                    className="bg-slate-900 text-white hover:bg-slate-800"
                                  >
                                    Mở để sửa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-red-200 text-red-600"
                                >
                                  Xóa
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xóa tier list này?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tier list công khai sẽ bị xóa khỏi danh sách mọi người xem.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSavedTierList(tierList.id, "public")}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-400">
                    Chưa có tier list public nào.
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-slate-800">Tier list cá nhân tạo ở máy</p>
                  <p className="text-xs text-slate-400">Chỉ lưu trên trình duyệt/máy hiện tại của bạn.</p>
                </div>
                {localTierLists.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {localTierLists.map((tierList) => (
                      <div
                        key={`local-tier-list-${tierList.id}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOpenSavedTierList(tierList, "local")}
                        onKeyDown={(event) => {
                          if (
                            event.target === event.currentTarget &&
                            (event.key === "Enter" || event.key === " ")
                          ) {
                            event.preventDefault();
                            handleOpenSavedTierList(tierList, "local");
                          }
                        }}
                        className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">{tierList.name}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(tierList.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <div
                            className="flex items-center gap-2"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-slate-200 text-slate-600"
                                >
                                  Sửa
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Mở tier list để sửa?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bản nháp hiện tại sẽ được thay bằng tier list tạo ở máy này.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleLoadSavedTierListToEditor(tierList, "local")}
                                    className="bg-slate-900 text-white hover:bg-slate-800"
                                  >
                                    Mở để sửa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg border-red-200 text-red-600"
                                >
                                  Xóa
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xóa tier list tạo ở máy?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tier list này sẽ bị xóa khỏi trình duyệt hiện tại.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSavedTierList(tierList.id, "local")}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-400">
                    Chưa có tier list tạo ở máy nào.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1fr)_minmax(220px,0.8fr)_auto] lg:items-start">
                <div className="space-y-1">
                  <Input
                    placeholder="Đặt tên tier list"
                    value={tierListName}
                    maxLength={tierListNameMaxLength}
                    onChange={(e) => setTierListName(e.target.value)}
                    className={`h-12 rounded-xl bg-white text-base text-slate-800 placeholder:text-slate-400 focus:ring-rose-400/20 ${
                      tierListNameIssue
                        ? "border-red-300 focus:border-red-400"
                        : "border-slate-200 focus:border-rose-400"
                    }`}
                  />
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className={tierListNameIssue ? "text-red-500" : "text-slate-400"}>
                      {tierListNameIssue || `Tên tier list tối đa ${tierListNameMaxLength} ký tự.`}
                    </span>
                    <span className="shrink-0 text-slate-400">
                      {tierListName.length}/{tierListNameMaxLength}
                    </span>
                  </div>
                </div>
                <Input
                  placeholder="Tạo tier mới, ví dụ SS hoặc Meme"
                  value={newTierName}
                  maxLength={tierNameMaxLength}
                  onChange={(e) => setNewTierName(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20"
                />
                <Button
                  type="button"
                  onClick={handleAddTier}
                  className="h-12 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
                >
                  <Plus className="size-4" />
                  Thêm tier
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1fr)_auto_auto_auto] lg:items-center">
                <div className="relative">
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      className="h-12 rounded-xl bg-rose-500 px-6 text-white hover:bg-rose-600"
                    >
                      Lưu tier list
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Lưu tier list cho mọi người xem?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Mỗi UID chỉ được có một tier list công khai. Tier list tạo ở máy không bị giới hạn.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleSaveTierList("public")}
                        className="bg-rose-500 text-white hover:bg-rose-600"
                      >
                        Lưu công khai
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-xl border-sky-200 px-6 text-sky-700 hover:bg-sky-50"
                    >
                      Lưu tạo ở máy
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Lưu tier list tạo ở máy?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tier list này chỉ lưu trên trình duyệt/máy hiện tại và không giới hạn số lượng.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleSaveTierList("local")}
                        className="border border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
                      >
                        Lưu tạo ở máy
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-xl border-slate-200 px-6 text-slate-600"
                    >
                      Xóa xếp hạng
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xóa toàn bộ xếp hạng hiện tại?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tất cả operator đang được xếp tier trong bản nháp sẽ quay lại pool character.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => setTierAssignments({})}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Xóa xếp hạng
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={tierOrder.length <= 1}
                          className="rounded-full text-rose-500 hover:text-rose-600"
                          aria-label={`Xóa tier ${tier}`}
                        >
                          <X className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa tier {tier}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Operator trong tier này sẽ bị bỏ xếp hạng và quay lại pool character.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTier(tier)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Xóa tier
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

