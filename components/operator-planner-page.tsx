"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Hammer,
  Loader2,
  Package,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const INVENTORY_STORAGE_KEY = "arkreview_operator_planner_inventory";
const PLANNER_STORAGE_KEY = "arkreview_operator_planner_goal";

type PlannerCost = {
  count: number;
  id: string;
  type: string;
};

type PlannerPhase = {
  elite: number;
  maxLevel: number;
  promotionCosts: PlannerCost[];
};

type PlannerSkill = {
  id: string;
  name: string;
  masteryCosts: PlannerCost[][];
};

type PlannerOperator = {
  avatarUrl: string;
  dataSource: "gamedata" | "wiki";
  event: string;
  globalReleased: boolean;
  hasUpgradeData: boolean;
  id: string;
  maxElite: number;
  name: string;
  phases: PlannerPhase[];
  profession: string;
  rarity: number;
  skillLevelCosts: PlannerCost[][];
  skills: PlannerSkill[];
};

type PlannerItem = {
  iconUrl: string | null;
  id: string;
  name: string;
  rarity: number;
};

type PlannerData = {
  items: Record<string, PlannerItem>;
  operators: PlannerOperator[];
  sources: string[];
  sourceUpdatedAt: string;
};

type RequirementRow = {
  id: string;
  missing: number;
  name: string;
  owned: number;
  required: number;
  sources: string[];
};

type SavedGoal = {
  currentElite?: number;
  currentSkillLevel?: number;
  masteryCurrent?: Record<string, number>;
  masteryTargets?: Record<string, number>;
  operatorId?: string;
  targetElite?: number;
  targetSkillLevel?: number;
};

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getRarityTone = (rarity: number) => {
  if (rarity >= 6) return "border-amber-300 bg-amber-50 text-amber-900";
  if (rarity === 5) return "border-rose-300 bg-rose-50 text-rose-900";
  if (rarity === 4) return "border-violet-300 bg-violet-50 text-violet-900";
  return "border-slate-300 bg-slate-50 text-slate-800";
};

const getItemTone = (rarity: number) => {
  if (rarity >= 5) return "border-amber-200 bg-amber-50";
  if (rarity === 4) return "border-rose-200 bg-rose-50";
  if (rarity === 3) return "border-sky-200 bg-sky-50";
  return "border-slate-200 bg-slate-50";
};

const normalizeStorageNumberMap = (value: unknown) => {
  if (!value || typeof value !== "object") return {};

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, number>>(
    (result, [key, entry]) => {
      const amount = Number(entry);
      if (key && Number.isFinite(amount) && amount > 0) {
        result[key] = Math.floor(amount);
      }
      return result;
    },
    {},
  );
};

const loadJsonFromStorage = (key: string) => {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const addRequirement = (
  map: Map<string, { required: number; sources: Set<string> }>,
  cost: PlannerCost,
  source: string,
) => {
  const existing = map.get(cost.id) ?? { required: 0, sources: new Set<string>() };
  existing.required += cost.count;
  existing.sources.add(source);
  map.set(cost.id, existing);
};

const buildRequirementRows = ({
  currentElite,
  currentSkillLevel,
  data,
  inventory,
  masteryCurrent,
  masteryTargets,
  operator,
  targetElite,
  targetSkillLevel,
}: {
  currentElite: number;
  currentSkillLevel: number;
  data: PlannerData | null;
  inventory: Record<string, number>;
  masteryCurrent: Record<string, number>;
  masteryTargets: Record<string, number>;
  operator: PlannerOperator | null;
  targetElite: number;
  targetSkillLevel: number;
}) => {
  if (!data || !operator?.hasUpgradeData) return [];

  const requirements = new Map<string, { required: number; sources: Set<string> }>();

  for (let elite = currentElite + 1; elite <= targetElite; elite += 1) {
    for (const cost of operator.phases[elite]?.promotionCosts ?? []) {
      addRequirement(requirements, cost, `E${elite}`);
    }
  }

  for (let level = currentSkillLevel; level < targetSkillLevel; level += 1) {
    for (const cost of operator.skillLevelCosts[level - 1] ?? []) {
      addRequirement(requirements, cost, `Skill ${level + 1}`);
    }
  }

  for (const skill of operator.skills) {
    const currentMastery = clampNumber(masteryCurrent[skill.id] ?? 0, 0, 3);
    const targetMastery = clampNumber(masteryTargets[skill.id] ?? 0, 0, 3);

    for (let mastery = currentMastery; mastery < targetMastery; mastery += 1) {
      for (const cost of skill.masteryCosts[mastery] ?? []) {
        addRequirement(requirements, cost, `${skill.name} M${mastery + 1}`);
      }
    }
  }

  return [...requirements.entries()]
    .map(([id, entry]) => {
      const item = data.items[id];
      const owned = inventory[id] ?? 0;
      const required = entry.required;

      return {
        id,
        missing: Math.max(0, required - owned),
        name: item?.name ?? id,
        owned,
        required,
        sources: [...entry.sources],
      };
    })
    .sort((left, right) => {
      if (right.missing !== left.missing) return right.missing - left.missing;
      return left.name.localeCompare(right.name);
    });
};

function OperatorImage({
  className,
  operator,
}: {
  className?: string;
  operator: PlannerOperator;
}) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-100",
        className,
      )}
    >
      <Package className="h-5 w-5 text-slate-400" />
      <img
        src={operator.avatarUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}

function StepButton({
  active,
  disabled,
  label,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-9 rounded-md border px-3 text-sm font-black transition-colors",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        disabled && "cursor-not-allowed opacity-40 hover:border-slate-200 hover:bg-white",
      )}
    >
      {label}
    </button>
  );
}

export function OperatorPlannerPage() {
  const [data, setData] = useState<PlannerData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [operatorQuery, setOperatorQuery] = useState("");
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [currentElite, setCurrentElite] = useState(0);
  const [targetElite, setTargetElite] = useState(2);
  const [currentSkillLevel, setCurrentSkillLevel] = useState(1);
  const [targetSkillLevel, setTargetSkillLevel] = useState(7);
  const [masteryCurrent, setMasteryCurrent] = useState<Record<string, number>>({});
  const [masteryTargets, setMasteryTargets] = useState<Record<string, number>>({});
  const [inventory, setInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedInventory = normalizeStorageNumberMap(loadJsonFromStorage(INVENTORY_STORAGE_KEY));
    const savedGoal = loadJsonFromStorage(PLANNER_STORAGE_KEY) as SavedGoal | null;

    setInventory(savedInventory);
    setCurrentElite(clampNumber(Number(savedGoal?.currentElite ?? 0), 0, 2));
    setTargetElite(clampNumber(Number(savedGoal?.targetElite ?? 2), 0, 2));
    setCurrentSkillLevel(clampNumber(Number(savedGoal?.currentSkillLevel ?? 1), 1, 7));
    setTargetSkillLevel(clampNumber(Number(savedGoal?.targetSkillLevel ?? 7), 1, 7));
    setMasteryCurrent(normalizeStorageNumberMap(savedGoal?.masteryCurrent));
    setMasteryTargets(normalizeStorageNumberMap(savedGoal?.masteryTargets));
    setSelectedOperatorId(typeof savedGoal?.operatorId === "string" ? savedGoal.operatorId : "");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/operator-planner/data");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? "Không tải được dữ liệu.");
        }

        if (!cancelled) {
          setData(payload as PlannerData);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không tải được dữ liệu nâng cấp operator.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedOperator = useMemo(() => {
    if (!data) return null;
    return data.operators.find((operator) => operator.id === selectedOperatorId) ?? null;
  }, [data, selectedOperatorId]);

  useEffect(() => {
    if (!data || selectedOperatorId) return;

    const firstOperator =
      data.operators.find((operator) => operator.hasUpgradeData && operator.rarity === 6) ??
      data.operators[0];

    if (firstOperator) {
      setSelectedOperatorId(firstOperator.id);
      setOperatorQuery(firstOperator.name);
    }
  }, [data, selectedOperatorId]);

  useEffect(() => {
    if (!selectedOperator) return;

    setOperatorQuery(selectedOperator.name);
    setCurrentElite((value) => clampNumber(value, 0, selectedOperator.maxElite));
    setTargetElite((value) =>
      clampNumber(Math.max(value, currentElite), 0, selectedOperator.maxElite),
    );
  }, [currentElite, selectedOperator]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      PLANNER_STORAGE_KEY,
      JSON.stringify({
        currentElite,
        currentSkillLevel,
        masteryCurrent,
        masteryTargets,
        operatorId: selectedOperatorId,
        targetElite,
        targetSkillLevel,
      }),
    );
  }, [
    currentElite,
    currentSkillLevel,
    masteryCurrent,
    masteryTargets,
    selectedOperatorId,
    targetElite,
    targetSkillLevel,
  ]);

  const filteredOperators = useMemo(() => {
    if (!data) return [];

    const query = operatorQuery.trim().toLowerCase();
    const source = query
      ? data.operators.filter((operator) =>
          `${operator.name} ${operator.profession} ${operator.event}`
            .toLowerCase()
            .includes(query),
        )
      : data.operators;

    return source.slice(0, 18);
  }, [data, operatorQuery]);

  const clampedTargetElite = selectedOperator
    ? clampNumber(Math.max(targetElite, currentElite), 0, selectedOperator.maxElite)
    : targetElite;
  const clampedTargetSkillLevel = clampNumber(Math.max(targetSkillLevel, currentSkillLevel), 1, 7);

  const requirementRows = useMemo(
    () =>
      buildRequirementRows({
        currentElite,
        currentSkillLevel,
        data,
        inventory,
        masteryCurrent,
        masteryTargets,
        operator: selectedOperator,
        targetElite: clampedTargetElite,
        targetSkillLevel: clampedTargetSkillLevel,
      }),
    [
      clampedTargetElite,
      clampedTargetSkillLevel,
      currentElite,
      currentSkillLevel,
      data,
      inventory,
      masteryCurrent,
      masteryTargets,
      selectedOperator,
    ],
  );

  const totalRequired = requirementRows.reduce((sum, row) => sum + row.required, 0);
  const totalMissing = requirementRows.reduce((sum, row) => sum + row.missing, 0);
  const readyCount = requirementRows.filter((row) => row.missing === 0).length;

  const selectOperator = (operator: PlannerOperator) => {
    setSelectedOperatorId(operator.id);
    setOperatorQuery(operator.name);
    setCurrentElite((value) => clampNumber(value, 0, operator.maxElite));
    setTargetElite((value) => clampNumber(Math.max(value, currentElite), 0, operator.maxElite));
  };

  const updateInventory = (itemId: string, value: string) => {
    const amount = Math.max(0, Math.floor(Number(value) || 0));
    setInventory((current) => ({
      ...current,
      [itemId]: amount,
    }));
  };

  const updateCurrentMastery = (skillId: string, value: number) => {
    setMasteryCurrent((current) => ({
      ...current,
      [skillId]: clampNumber(value, 0, 3),
    }));
  };

  const updateTargetMastery = (skillId: string, value: number) => {
    setMasteryTargets((current) => ({
      ...current,
      [skillId]: clampNumber(value, 0, 3),
    }));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-2 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-2 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-2">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Hammer className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-black text-slate-950">Operator Planner</h1>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge className="border-sky-200 bg-sky-50 text-sky-800">
                    <Database className="mr-1 h-3 w-3" />
                    wiki.gg list
                  </Badge>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800">
                    game data cost
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {error ? (
            <Alert className="border-rose-200 bg-rose-50 text-rose-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <Label htmlFor="operator-search" className="text-xs font-black uppercase text-slate-500">
                Character
              </Label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="operator-search"
                  value={operatorQuery}
                  onChange={(event) => setOperatorQuery(event.target.value)}
                  placeholder="Amiya, Surtr, Kal'tsit..."
                  className="h-11 border-slate-200 bg-white pl-9 font-semibold"
                />
              </div>

              <div className="mt-3 max-h-[360px] space-y-1 overflow-y-auto pr-1">
                {isLoading ? (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải operator...
                  </div>
                ) : null}

                {filteredOperators.map((operator) => {
                  const active = operator.id === selectedOperatorId;

                  return (
                    <button
                      key={operator.id}
                      type="button"
                      onClick={() => selectOperator(operator)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors",
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50",
                      )}
                    >
                      <OperatorImage operator={operator} className="size-12 rounded-md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black">{operator.name}</span>
                        <span
                          className={cn(
                            "mt-0.5 block truncate text-xs font-semibold",
                            active ? "text-slate-300" : "text-slate-500",
                          )}
                        >
                          {operator.profession || operator.event || "Wiki operator"}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        <Badge className={active ? "border-white/20 bg-white/10 text-white" : getRarityTone(operator.rarity)}>
                          {operator.rarity}
                          <Star className="ml-1 h-3 w-3 fill-current" />
                        </Badge>
                        {!operator.hasUpgradeData ? (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                              active ? "bg-white/10 text-slate-200" : "bg-cyan-50 text-cyan-700",
                            )}
                          >
                            wiki
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedOperator ? (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <OperatorImage operator={selectedOperator} className="size-20 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black text-slate-950">
                          {selectedOperator.name}
                        </h2>
                        <p className="truncate text-sm font-semibold text-slate-500">
                          {selectedOperator.profession || selectedOperator.event || "Wiki operator"}
                        </p>
                      </div>
                      <Badge className={getRarityTone(selectedOperator.rarity)}>
                        {selectedOperator.rarity}
                        <Star className="ml-1 h-3 w-3 fill-current" />
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                        <p className="text-[10px] font-black uppercase text-slate-500">Elite</p>
                        <p className="text-sm font-black">E{selectedOperator.maxElite}</p>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
                        <p className="text-[10px] font-black uppercase text-slate-500">Skill</p>
                        <p className="text-sm font-black">{selectedOperator.skills.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!selectedOperator.hasUpgradeData ? (
                  <Alert className="mt-3 border-amber-200 bg-amber-50 text-amber-900">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>
                      Character này lấy từ wiki.gg giống trang Characters, nhưng chưa có bảng vật liệu trong game data.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </aside>

        <section className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase text-slate-500">Tổng cần</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{formatNumber(totalRequired)}</p>
            </div>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 shadow-sm">
              <p className="text-xs font-black uppercase text-rose-600">Còn thiếu</p>
              <p className="mt-1 text-2xl font-black text-rose-900">{formatNumber(totalMissing)}</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <p className="text-xs font-black uppercase text-emerald-700">Đã đủ</p>
              <p className="mt-1 text-2xl font-black text-emerald-900">
                {readyCount}/{requirementRows.length}
              </p>
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="grid gap-5 p-4 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-xs font-black uppercase text-slate-500">Elite</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500">Hiện tại</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.from({ length: (selectedOperator?.maxElite ?? 2) + 1 }, (_, elite) => (
                        <StepButton
                          key={elite}
                          active={currentElite === elite}
                          label={`E${elite}`}
                          onClick={() => setCurrentElite(elite)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Mục tiêu</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.from({ length: (selectedOperator?.maxElite ?? 2) + 1 }, (_, elite) => (
                        <StepButton
                          key={elite}
                          active={clampedTargetElite === elite}
                          disabled={elite < currentElite}
                          label={`E${elite}`}
                          onClick={() => setTargetElite(elite)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-slate-500">Skill level</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-500">Hiện tại</Label>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {Array.from({ length: 7 }, (_, index) => index + 1).map((level) => (
                        <StepButton
                          key={level}
                          active={currentSkillLevel === level}
                          label={`${level}`}
                          onClick={() => setCurrentSkillLevel(level)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Mục tiêu</Label>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {Array.from({ length: 7 }, (_, index) => index + 1).map((level) => (
                        <StepButton
                          key={level}
                          active={clampedTargetSkillLevel === level}
                          disabled={level < currentSkillLevel}
                          label={`${level}`}
                          onClick={() => setTargetSkillLevel(level)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedOperator?.skills.length ? (
                <div className="lg:col-span-2">
                  <p className="text-xs font-black uppercase text-slate-500">Mastery</p>
                  <div className="mt-3 grid gap-2 lg:grid-cols-3">
                    {selectedOperator.skills.map((skill) => {
                      const currentMastery = masteryCurrent[skill.id] ?? 0;
                      const targetMastery = Math.max(masteryTargets[skill.id] ?? 0, currentMastery);

                      return (
                        <div key={skill.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="truncate text-sm font-black text-slate-900">{skill.name}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <select
                              value={currentMastery}
                              onChange={(event) =>
                                updateCurrentMastery(skill.id, Number(event.target.value))
                              }
                              className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-bold"
                            >
                              {[0, 1, 2, 3].map((mastery) => (
                                <option key={mastery} value={mastery}>
                                  {mastery === 0 ? "M0" : `M${mastery}`}
                                </option>
                              ))}
                            </select>
                            <select
                              value={targetMastery}
                              onChange={(event) =>
                                updateTargetMastery(skill.id, Number(event.target.value))
                              }
                              className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-bold"
                            >
                              {[0, 1, 2, 3].map((mastery) => (
                                <option key={mastery} value={mastery} disabled={mastery < currentMastery}>
                                  {mastery === 0 ? "M0" : `M${mastery}`}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
                <div>
                  <h2 className="text-lg font-black text-slate-950">Vật liệu</h2>
                  <p className="text-sm font-semibold text-slate-500">
                    {requirementRows.length ? `${requirementRows.length} loại cần kiểm` : "Chưa có vật liệu cần tính"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInventory({})}
                  className="border-slate-200"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Xóa kho
                </Button>
              </div>

              {requirementRows.length ? (
                <div className="divide-y divide-slate-200">
                  {requirementRows.map((row) => {
                    const item = data?.items[row.id];
                    const isReady = row.missing === 0;

                    return (
                      <div
                        key={row.id}
                        className="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_92px_112px_92px] md:items-center"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={cn(
                              "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
                              getItemTone(item?.rarity ?? 0),
                            )}
                          >
                            <Package className="h-5 w-5 text-slate-400" />
                            {item?.iconUrl ? (
                              <img
                                src={item.iconUrl}
                                alt=""
                                className="absolute inset-1 h-10 w-10 object-contain"
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : null}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-black text-slate-950">{row.name}</p>
                              {isReady ? (
                                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Đủ
                                </Badge>
                              ) : null}
                            </div>
                            <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                              {row.sources.join(", ")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:block md:text-right">
                          <span className="text-xs font-black uppercase text-slate-500 md:hidden">Cần</span>
                          <span className="font-black text-slate-900">{formatNumber(row.required)}</span>
                        </div>

                        <Input
                          type="number"
                          min={0}
                          value={inventory[row.id] ?? ""}
                          onChange={(event) => updateInventory(row.id, event.target.value)}
                          placeholder="0"
                          className="h-10 border-slate-200 text-right font-black"
                        />

                        <div className="flex items-center justify-between md:block md:text-right">
                          <span className="text-xs font-black uppercase text-slate-500 md:hidden">Thiếu</span>
                          <span className={cn("font-black", isReady ? "text-emerald-700" : "text-rose-700")}>
                            {formatNumber(row.missing)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
                  <Sparkles className="h-10 w-10 text-sky-500" />
                  <p className="mt-3 text-lg font-black text-slate-950">
                    {selectedOperator?.hasUpgradeData === false
                      ? "Chưa có bảng vật liệu"
                      : "Chưa có mục tiêu nâng cấp"}
                  </p>
                  <p className="mt-1 max-w-md text-sm font-semibold leading-6 text-slate-500">
                    {selectedOperator?.hasUpgradeData === false
                      ? "Operator này có trong wiki.gg giống trang Characters, nhưng game data chưa có cost để tính."
                      : "Chọn Elite, skill hoặc mastery mục tiêu cao hơn trạng thái hiện tại."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
