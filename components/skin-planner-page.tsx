"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Package,
  RotateCcw,
  Search,
  Shirt,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "arkreview_skin_planner";
const PRIME_TO_ORUNDUM = 180;
const ORUNDUM_PER_PULL = 600;

type SkinEntry = {
  brand: string;
  id: string;
  imageUrl: string | null;
  obtainMethod: string;
  operator: string;
  price: number;
  release: string;
  skinName: string;
  sourcePage: string;
};

type SkinPlannerState = {
  ownedPrime: number;
  selectedIds: string[];
  vouchers: number;
};

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const loadSavedState = (): SkinPlannerState => {
  if (typeof window === "undefined") {
    return { ownedPrime: 0, selectedIds: [], vouchers: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      ownedPrime: Math.max(0, Number(parsed?.ownedPrime ?? 0) || 0),
      selectedIds: Array.isArray(parsed?.selectedIds)
        ? parsed.selectedIds.filter((id: unknown): id is string => typeof id === "string")
        : [],
      vouchers: Math.max(0, Number(parsed?.vouchers ?? 0) || 0),
    };
  } catch (error) {
    console.error(error);
    return { ownedPrime: 0, selectedIds: [], vouchers: 0 };
  }
};

export function SkinPlannerPage() {
  const [skins, setSkins] = useState<SkinEntry[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ownedPrime, setOwnedPrime] = useState(0);
  const [vouchers, setVouchers] = useState(0);

  useEffect(() => {
    const saved = loadSavedState();
    setSelectedIds(saved.selectedIds);
    setOwnedPrime(saved.ownedPrime);
    setVouchers(saved.vouchers);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSkins = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/skins");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message ?? "Không tải được dữ liệu skin.");
        }

        if (!cancelled) {
          setSkins(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Không tải được dữ liệu skin.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadSkins();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ownedPrime, selectedIds, vouchers }),
    );
  }, [ownedPrime, selectedIds, vouchers]);

  const selectedSkins = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    return skins.filter((skin) => selectedSet.has(skin.id));
  }, [selectedIds, skins]);

  const brands = useMemo(
    () => ["all", ...Array.from(new Set(skins.map((skin) => skin.brand))).sort()],
    [skins],
  );

  const filteredSkins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return skins
      .filter((skin) => (brandFilter === "all" ? true : skin.brand === brandFilter))
      .filter((skin) => {
        if (!normalizedQuery) return true;

        return `${skin.operator} ${skin.skinName} ${skin.brand} ${skin.obtainMethod}`
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .slice(0, 120);
  }, [brandFilter, query, skins]);

  const paidSelectedSkins = selectedSkins.filter((skin) => skin.price > 0);
  const totalPrime = paidSelectedSkins.reduce((sum, skin) => sum + skin.price, 0);
  const voucherDiscount = paidSelectedSkins
    .map((skin) => skin.price)
    .sort((left, right) => right - left)
    .slice(0, Math.floor(vouchers))
    .reduce((sum, price) => sum + price, 0);
  const payablePrime = Math.max(0, totalPrime - voucherDiscount);
  const missingPrime = Math.max(0, payablePrime - ownedPrime);
  const pullEquivalent = Math.floor((payablePrime * PRIME_TO_ORUNDUM) / ORUNDUM_PER_PULL);

  const toggleSkin = (skinId: string) => {
    setSelectedIds((current) =>
      current.includes(skinId)
        ? current.filter((id) => id !== skinId)
        : [...current, skinId],
    );
  };

  const resetPlanner = () => {
    setSelectedIds([]);
    setOwnedPrime(0);
    setVouchers(0);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-2 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-2 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-2">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Shirt className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-950">Skin Planner</h1>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                  Chọn outfit muốn mua, tính OP cần giữ và số pull tương đương.
                </p>
              </div>
            </div>
          </section>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="owned-prime" className="text-xs font-black uppercase text-slate-500">
                    OP đang có
                  </Label>
                  <Input
                    id="owned-prime"
                    type="number"
                    min={0}
                    value={ownedPrime || ""}
                    onChange={(event) =>
                      setOwnedPrime(Math.max(0, Number(event.target.value) || 0))
                    }
                    className="mt-2 h-11 border-slate-200 text-right font-black"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="skin-vouchers" className="text-xs font-black uppercase text-slate-500">
                    Voucher
                  </Label>
                  <Input
                    id="skin-vouchers"
                    type="number"
                    min={0}
                    value={vouchers || ""}
                    onChange={(event) =>
                      setVouchers(Math.max(0, Number(event.target.value) || 0))
                    }
                    className="mt-2 h-11 border-slate-200 text-right font-black"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase text-slate-500">Tổng giá</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {formatNumber(totalPrime)} OP
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-black uppercase text-emerald-700">Sau voucher</p>
                  <p className="mt-1 text-2xl font-black text-emerald-900">
                    {formatNumber(payablePrime)} OP
                  </p>
                </div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                  <p className="text-xs font-black uppercase text-rose-600">Còn thiếu</p>
                  <p className="mt-1 text-2xl font-black text-rose-900">
                    {formatNumber(missingPrime)} OP
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center gap-2 text-amber-900">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-sm font-black">Tương đương {formatNumber(pullEquivalent)} pull</p>
                </div>
                <p className="mt-1 text-xs font-semibold leading-5 text-amber-800">
                  1 OP = 180 Orundum, 1 pull = 600 Orundum.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={resetPlanner}
                className="w-full border-slate-200"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Xóa kế hoạch
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-slate-900">Đã chọn</p>
                <Badge className="border-slate-200 bg-white text-slate-600">
                  {selectedSkins.length} skin
                </Badge>
              </div>
              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                {selectedSkins.length ? (
                  selectedSkins.map((skin) => (
                    <button
                      key={`selected-${skin.id}`}
                      type="button"
                      onClick={() => toggleSkin(skin.id)}
                      className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 text-left hover:bg-slate-50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black text-slate-900">
                          {skin.skinName}
                        </span>
                        <span className="block truncate text-xs font-semibold text-slate-500">
                          {skin.operator}
                        </span>
                      </span>
                      <span className="text-sm font-black text-slate-900">{skin.price} OP</span>
                    </button>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-500">
                    Chưa chọn skin nào.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-2">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tìm theo operator, tên skin, brand..."
                    className="h-11 border-slate-200 bg-white pl-9 font-semibold"
                  />
                </div>
                <select
                  value={brandFilter}
                  onChange={(event) => setBrandFilter(event.target.value)}
                  className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand === "all" ? "Tất cả brand" : brand}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-3 text-slate-600">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="font-bold">Đang tải outfit từ wiki.gg...</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {filteredSkins.map((skin) => {
                const selected = selectedIds.includes(skin.id);
                const freeSkin = skin.price <= 0;

                return (
                  <button
                    key={skin.id}
                    type="button"
                    onClick={() => toggleSkin(skin.id)}
                    className={cn(
                      "overflow-hidden rounded-lg border bg-white text-left shadow-sm transition-colors",
                      selected
                        ? "border-slate-900 ring-2 ring-slate-900/10"
                        : "border-slate-200 hover:border-sky-200 hover:bg-sky-50/30",
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {skin.imageUrl ? (
                        <img
                          src={skin.imageUrl}
                          alt=""
                          className="h-full w-full object-cover object-top"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-10 w-10 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute left-2 top-2 flex gap-2">
                        <Badge
                          className={
                            freeSkin
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-amber-200 bg-amber-50 text-amber-900"
                          }
                        >
                          {freeSkin ? "Free / Event" : `${skin.price} OP`}
                        </Badge>
                      </div>
                      {selected ? (
                        <div className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-slate-900 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-2 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-black text-slate-950">
                            {skin.skinName}
                          </p>
                          <p className="truncate text-sm font-bold text-slate-600">
                            {skin.operator}
                          </p>
                        </div>
                        <Badge className="shrink-0 border-slate-200 bg-slate-50 text-slate-600">
                          {skin.brand}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 min-h-10 text-xs font-semibold leading-5 text-slate-500">
                        {skin.obtainMethod || skin.release || "Không rõ cách nhận"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!isLoading && filteredSkins.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center">
              <Ticket className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 font-black text-slate-900">Không tìm thấy skin</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
