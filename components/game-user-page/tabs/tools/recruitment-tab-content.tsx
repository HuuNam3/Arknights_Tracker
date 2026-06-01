"use client";

import type { MutableRefObject } from "react";
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
  return (
    <TabsContent value="recruitment" className="mt-0 focus-visible:outline-none">
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-rose-200 bg-rose-100 p-2.5">
              <Users className="h-5 w-5 text-rose-700" />
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
            }}
            className="rounded-lg"
          >
            Reset
          </Button>
        </div>

        <div className="space-y-3">
          {RECRUITMENT_TAG_GROUPS.map((group) => (
            <div
              key={group.category}
              className="rounded-xl border border-slate-100 bg-white p-3"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {group.label}
              </p>
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

        <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4">
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
            className="rounded-xl border-slate-200 bg-white"
          />
          {normalizedRecruitmentTargetInput ? (
            selectedRecruitmentTargetOperator ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-100 bg-white p-4">
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
                          className="border-slate-200 bg-white text-slate-600"
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
                  {recruitmentTargetSuggestions.slice(0, 6).map((combo) => (
                    <div
                      key={`target-${selectedRecruitmentTargetOperator.name}-${combo.tags.join("|")}`}
                      className="rounded-xl border border-slate-100 bg-white p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
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
                        {combo.operators.length === 1 ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                            Khóa đúng 1 operator
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-base font-bold text-slate-900">
                        {combo.operators.map((operator) => operator.name).join(", ")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{combo.recommendation}.</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
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
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-bold text-slate-800">Tất cả combo hợp lệ</p>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                  {recruitmentComboResults.length} combo
                </Badge>
              </div>
              {recruitmentComboResults.length > 0 ? (
                <div className="space-y-2">
                  {recruitmentComboResults.map((combo) => (
                    <div
                      key={combo.tags.join("|")}
                      className="rounded-xl border border-slate-100 bg-white p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
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
                          <span className="rounded-full bg-rose-100 px-2 py-1 text-[11px] font-semibold text-rose-700">
                            Khuyên chọn
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{combo.recommendation}.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {combo.operators.map((operator) => (
                          <div
                            key={`${combo.tags.join("|")}-${operator.name}`}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2"
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
                                {Array.from({ length: operator.rarity }).map((_, index) => (
                                  <Star
                                    key={`${combo.tags.join("|")}-${operator.name}-star-${index}`}
                                    className="h-3 w-3 fill-amber-500 text-amber-500"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
