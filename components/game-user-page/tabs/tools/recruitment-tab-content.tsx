"use client";

import type { MutableRefObject } from "react";
import { useState } from "react";
import { Check, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

type RecruitmentTabContentProps = {
  RECRUITMENT_SPECIAL_TAGS: Set<string>;
  RECRUITMENT_TAG_GROUPS: Array<{ category: string; label: string; tags: string[] }>;
  getOperatorAvatarUrl: (name: string) => string;
  getRecruitmentTagClassName: (
    tag: string,
    options?: { active?: boolean; highlighted?: boolean; subtle?: boolean },
  ) => string;
  handleToggleRecruitmentTag: (tag: string, buttonElement: HTMLButtonElement) => void;
  normalizedRecruitmentTargetInput: string;
  recruitmentComboResults: Array<{
    isSpecial: boolean;
    operators: Array<{ name: string; rarity: number }>;
    recommendation: string;
    tags: string[];
  }>;
  recruitmentTagButtonRefs: MutableRefObject<Partial<Record<string, HTMLButtonElement | null>>>;
  recruitmentTargetInput: string;
  recruitmentTargetSuggestions: Array<{
    operators: Array<{ name: string; rarity: number; tags: string[] }>;
    recommendation: string;
    tags: string[];
  }>;
  selectedRecruitmentTags: string[];
  selectedRecruitmentTargetOperator: { name: string; rarity: number; tags: string[] } | null;
  setRecruitmentTargetInput: (value: string) => void;
  setSelectedRecruitmentTags: (value: string[]) => void;
};

const RECRUITMENT_RARITY_FILTERS = [6, 5, 4, 3, 2, 1] as const;

const getRecruitmentOperatorCardClassName = (rarity: number) => {
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

const getRecruitmentRarityBadgeClassName = (rarity: number, active = true) => {
  if (!active) {
    return "border-slate-200 bg-white text-slate-400 hover:border-slate-300";
  }

  switch (rarity) {
    case 6:
      return "border-orange-300 bg-orange-100 text-orange-700";
    case 5:
      return "border-amber-300 bg-amber-100 text-amber-700";
    case 4:
      return "border-violet-300 bg-violet-100 text-violet-700";
    case 3:
      return "border-sky-300 bg-sky-100 text-sky-700";
    case 2:
      return "border-emerald-300 bg-emerald-100 text-emerald-700";
    default:
      return "border-slate-300 bg-slate-100 text-slate-700";
  }
};

export function RecruitmentTabContent({
  RECRUITMENT_SPECIAL_TAGS,
  RECRUITMENT_TAG_GROUPS,
  getOperatorAvatarUrl,
  getRecruitmentTagClassName,
  handleToggleRecruitmentTag,
  normalizedRecruitmentTargetInput,
  recruitmentComboResults,
  recruitmentTagButtonRefs,
  recruitmentTargetInput,
  recruitmentTargetSuggestions,
  selectedRecruitmentTags,
  selectedRecruitmentTargetOperator,
  setRecruitmentTargetInput,
  setSelectedRecruitmentTags,
}: RecruitmentTabContentProps) {
  const getComboMinRarity = (operators: Array<{ rarity: number }>) =>
    operators.length > 0
      ? Math.min(...operators.map((operator) => operator.rarity))
      : 0;
  const [selectedRecruitmentRarities, setSelectedRecruitmentRarities] = useState<number[]>(
    [1, 2, 3, 4, 5, 6],
  );
  const isRecruitmentRaritySelected = (rarity: number) =>
    selectedRecruitmentRarities.includes(rarity);
  const toggleRecruitmentRarity = (rarity: number) => {
    setSelectedRecruitmentRarities((current) =>
      current.includes(rarity)
        ? current.filter((value) => value !== rarity)
        : [...current, rarity].sort((a, b) => a - b),
    );
  };
  const filterRecruitmentOperatorsByRarity = <TOperator extends { rarity: number }>(
    operators: TOperator[],
  ) => operators.filter((operator) => isRecruitmentRaritySelected(operator.rarity));
  const visibleRecruitmentComboCount = recruitmentComboResults.filter(
    (combo) => filterRecruitmentOperatorsByRarity(combo.operators).length > 0,
  ).length;
  const visibleHighRarityComboCount = recruitmentComboResults.filter((combo) => {
    const visibleOperators = filterRecruitmentOperatorsByRarity(combo.operators);

    return visibleOperators.length > 0 && getComboMinRarity(visibleOperators) >= 5;
  }).length;

  return (
    <TabsContent value="recruitment" className="mt-0 focus-visible:outline-none">
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-indigo-200 bg-indigo-100 p-2.5">
              <Users className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">Recruitment Calculator</p>
              <p className="mt-1 text-sm text-slate-500">
              Chọn các tag bạn đang có, tối đa 6 tag, để xem combo hợp lệ và
              operator có thể ra từ recruitment pool hiện có.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRecruitmentTags([]);
              setRecruitmentTargetInput("");
              setSelectedRecruitmentRarities([1, 2, 3, 4, 5, 6]);
            }}
            className="rounded-lg"
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Tag đã chọn</p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {selectedRecruitmentTags.length}/6
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Chọn đúng các tag đang thấy trong game.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-xs font-semibold uppercase text-cyan-700">Combo hợp lệ</p>
            <p className="mt-1 text-2xl font-black text-cyan-800">
              {visibleRecruitmentComboCount}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Tự thử các tổ hợp 1-3 tag từ tag đã chọn.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase text-amber-700">Guarantee 5★+</p>
            <p className="mt-1 text-2xl font-black text-amber-800">
              {visibleHighRarityComboCount}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Nếu có combo hiếm, nên đặt recruitment 9 giờ.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-800">Lọc operator trong combo</p>
              <p className="mt-1 text-xs text-slate-500">
                Bật/tắt rarity để chỉ hiện operator từ 1★ đến 6★ bạn muốn xem.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {RECRUITMENT_RARITY_FILTERS.map((rarity) => {
                const active = isRecruitmentRaritySelected(rarity);

                return (
                  <button
                    key={`recruitment-rarity-filter-${rarity}`}
                    type="button"
                    onClick={() => toggleRecruitmentRarity(rarity)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${getRecruitmentRarityBadgeClassName(
                      rarity,
                      active,
                    )}`}
                  >
                    {rarity}★
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {RECRUITMENT_TAG_GROUPS.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {group.label}
                </p>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-500">
                  {group.tags.length}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => {
                  const active = selectedRecruitmentTags.includes(tag);
                  const highlighted = RECRUITMENT_SPECIAL_TAGS.has(tag);

                  return (
                    <Button
                      key={tag}
                      type="button"
                      size="sm"
                      variant="outline"
                      ref={(element) => {
                        recruitmentTagButtonRefs.current[tag] = element;
                      }}
                      onClick={(event) =>
                        handleToggleRecruitmentTag(tag, event.currentTarget)
                      }
                      className={`${getRecruitmentTagClassName(tag, {
                        active,
                        highlighted,
                      })} h-10 px-3 py-2`}
                    >
                      <span className="flex items-center gap-1.5 leading-tight">
                        {active ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
                        <span className="font-semibold">{tag}</span>
                        {highlighted ? (
                          <span className="text-[10px] opacity-80">Nên để ý</span>
                        ) : null}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
          <div>
            <p className="font-bold text-slate-800">Gợi ý theo operator mục tiêu</p>
            <p className="mt-1 text-sm text-slate-500">
              Nhập tên operator muốn ra để xem các combo tag phù hợp.
            </p>
          </div>
          <Input
            value={recruitmentTargetInput}
            onChange={(e) => setRecruitmentTargetInput(e.target.value)}
            placeholder="Ví dụ: Saria, Myrtle, Phantom..."
            className="rounded-xl border-indigo-200 bg-white focus-visible:ring-indigo-200"
          />
          {normalizedRecruitmentTargetInput ? (
            selectedRecruitmentTargetOperator ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <img
                        src={getOperatorAvatarUrl(selectedRecruitmentTargetOperator.name)}
                        alt={selectedRecruitmentTargetOperator.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-800">
                          Mục tiêu: {selectedRecruitmentTargetOperator.name}
                        </p>
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-50 text-amber-700"
                        >
                          {"★".repeat(selectedRecruitmentTargetOperator.rarity)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Các combo dưới đây đều có thể ra operator này. Tôi ưu tiên
                        combo hẹp pool hơn để bạn dễ quyết định.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selectedRecruitmentTargetOperator.tags.map((tag) => (
                          <span
                            key={`${selectedRecruitmentTargetOperator.name}-${tag}`}
                            className={`${getRecruitmentTagClassName(tag, {
                              subtle: true,
                            })} px-2 py-1 text-[11px] font-semibold`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {recruitmentTargetSuggestions.slice(0, 6).map((combo) => {
                    const visibleOperators = filterRecruitmentOperatorsByRarity(
                      combo.operators,
                    );
                    if (visibleOperators.length === 0) return null;

                    const minRarity = getComboMinRarity(visibleOperators);
                    const isHighRarity = minRarity >= 5;

                    return (
                    <div
                      key={`target-${selectedRecruitmentTargetOperator.name}-${combo.tags.join("|")}`}
                      className={`rounded-2xl border p-3 shadow-sm ${
                        isHighRarity
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                            isHighRarity
                              ? "border-amber-300 bg-white text-amber-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Tối thiểu {minRarity}★
                        </span>
                        {combo.tags.map((tag) => (
                          <span
                            key={`target-${selectedRecruitmentTargetOperator.name}-${tag}`}
                            className={`${getRecruitmentTagClassName(tag, {
                              active: true,
                            })} px-2 py-1 text-[11px] font-semibold`}
                          >
                            {tag}
                          </span>
                        ))}
                        {visibleOperators.length === 1 ? (
                          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                            Khóa đúng 1 operator
                          </span>
                        ) : null}
                      </div>
                      {/*<p className="mt-1 text-xs text-slate-500">{combo.recommendation}.</p>*/}
                    </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-indigo-100 bg-white p-4 text-sm text-slate-500">
                Không tìm thấy operator recruitable nào khớp tên bạn nhập.
              </div>
            )
          ) : null}
        </div>

        <div className="space-y-3">
          {selectedRecruitmentTags.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
              Chọn từ 2 đến 6 tag bạn đang có để hiện combo hợp lệ và operator phù hợp.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-bold text-slate-800">Tất cả combo hợp lệ</p>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                  {visibleRecruitmentComboCount} combo
                </Badge>
              </div>
              {visibleRecruitmentComboCount > 0 ? (
                <div className="space-y-2">
                  {recruitmentComboResults.map((combo) => {
                    const visibleOperators = filterRecruitmentOperatorsByRarity(
                      combo.operators,
                    );
                    if (visibleOperators.length === 0) return null;

                    const minRarity = getComboMinRarity(visibleOperators);
                    const isHighRarity = minRarity >= 5;

                    return (
                    <div
                      key={combo.tags.join("|")}
                      className={`rounded-2xl border p-3 shadow-sm ${
                        isHighRarity
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${
                            isHighRarity
                              ? "border-amber-300 bg-white text-amber-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Tối thiểu {minRarity}★
                        </span>
                        {combo.tags.map((tag) => (
                          <span
                            key={`${combo.tags.join("|")}-${tag}`}
                            className={`${getRecruitmentTagClassName(tag, {
                              active: true,
                            })} px-2 py-1 text-[11px] font-semibold`}
                          >
                            {tag}
                          </span>
                        ))}
                        {combo.isSpecial ? (
                          <span className="rounded-full border border-rose-200 bg-rose-100 px-2 py-1 text-[11px] font-semibold text-rose-700">
                            Khuyên chọn
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{combo.recommendation}.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {visibleOperators.map((operator) => (
                          <div
                            key={`${combo.tags.join("|")}-${operator.name}`}
                            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${getRecruitmentOperatorCardClassName(
                              operator.rarity,
                            )}`}
                          >
                            <div className="size-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                              <img
                                src={getOperatorAvatarUrl(operator.name)}
                                alt={operator.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold leading-tight text-slate-900">
                                {operator.name}
                              </p>
                              <div className="mt-1 flex items-center gap-0.5">
                                {Array.from({ length: operator.rarity }).map((_, index) => {
                                  const starColor =
                                    operator.rarity === 6
                                      ? "fill-orange-500 text-orange-500"
                                      : operator.rarity === 5
                                        ? "fill-yellow-500 text-yellow-500"
                                        : operator.rarity === 4
                                          ? "fill-purple-500 text-purple-500"
                                          : "fill-slate-400 text-slate-400";
                                  return (
                                    <Star
                                      key={`${combo.tags.join("|")}-${operator.name}-star-${index}`}
                                      className={`h-3 w-3 ${starColor}`}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
                  Chưa có combo hợp lệ. Chọn thêm tag để hệ thống gợi ý.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
}
