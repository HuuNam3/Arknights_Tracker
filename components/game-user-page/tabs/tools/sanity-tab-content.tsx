"use client";

import { AlertCircle, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

type SanityTabContentProps = {
  currentSanity: number | null;
  currentSanityInput: string;
  formatRecoveryDateTime: (minutes: number) => string;
  formatRecoveryDuration: (minutes: number) => string;
  hydrateSanityFromInput: (value: string) => void;
  missingSanity: number | null;
  recoveryMinutes: number | null;
  sanityCap: number;
  userInfo: { level: number; name: string; uid: string } | null;
};

export function SanityTabContent({
  currentSanity,
  currentSanityInput,
  formatRecoveryDateTime,
  formatRecoveryDuration,
  hydrateSanityFromInput,
  missingSanity,
  recoveryMinutes,
  sanityCap,
  userInfo,
}: SanityTabContentProps) {
  return (
    <TabsContent value="sanity" className="mt-0 focus-visible:outline-none">
      {userInfo ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-violet-200 bg-violet-100 p-2.5">
                  <Zap className="h-5 w-5 text-violet-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Máy tính sanity</h3>
              </div>
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                Cap {sanityCap}
              </Badge>
            </div>
            <p className="mb-3 text-sm text-slate-500">
              Nhập lượng sanity hiện tại để tính số còn thiếu và thời gian hồi đầy
              với tốc độ 1 sanity mỗi 6 phút.
            </p>
            <Input
              type="number"
              min={0}
              max={sanityCap}
              inputMode="numeric"
              value={currentSanityInput}
              onChange={(e) => hydrateSanityFromInput(e.target.value)}
              placeholder={`Nhập sanity hiện tại (0 - ${sanityCap})`}
              className="h-12 rounded-xl border-slate-200 bg-white text-lg text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20"
            />
            <p className="mt-2 text-xs text-slate-400">
              Nếu nhập vượt giới hạn, hệ thống sẽ tự giới hạn về {sanityCap}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
                Sanity hiện tại
              </p>
              <p className="text-3xl font-black tracking-tight text-slate-800">
                {currentSanity !== null ? currentSanity : "--"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
                Còn thiếu
              </p>
              <p className="text-3xl font-black tracking-tight text-rose-500">
                {missingSanity !== null ? missingSanity : "--"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
                Đầy sau
              </p>
              <p className="text-2xl font-black tracking-tight text-emerald-600">
                {recoveryMinutes !== null ? formatRecoveryDuration(recoveryMinutes) : "--"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {recoveryMinutes !== null
                  ? recoveryMinutes === 0
                    ? "Đã đầy"
                    : `Đầy lúc ${formatRecoveryDateTime(recoveryMinutes)}`
                  : "Nhập sanity để bắt đầu tính"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Alert className="rounded-xl border-amber-200 bg-amber-50 text-amber-900">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="ml-2 text-base font-medium">
            Nhập UID ở phía trên để lấy level Doctor và dùng máy tính sanity.
          </AlertDescription>
        </Alert>
      )}
    </TabsContent>
  );
}
