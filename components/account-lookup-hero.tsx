"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  Crown,
  Loader2,
  Search,
  Shield,
  Star,
  Sword,
  Trophy,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function AccountLookupHero() {
  const [uid, setUid] = useState("");
  const [userInfo, setUserInfo] = useState<{
    uid: string;
    name: string;
    level: number;
  } | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedUid = localStorage.getItem("arknights_uid");
    if (savedUid) {
      setUid(savedUid);
    }
  }, []);

  const handleSearch = async () => {
    const targetUid = uid.trim();
    if (!targetUid) return;

    setIsLoading(true);
    setSearchAttempted(true);
    setErrorMessage("");
    setUserInfo(null);

    try {
      const res = await fetch(`/api/arknights/gift/playerinfo?uid=${targetUid}`);
      const result = await res.json();

      if (result.code === 0 && result.data) {
        const nextUserInfo = {
          uid: result.data.uid,
          name: result.data.nickname,
          level: result.data.level,
        };
        setUserInfo(nextUserInfo);
        setUid(nextUserInfo.uid);
        localStorage.setItem("arknights_uid", nextUserInfo.uid);
        localStorage.setItem("arknights_doctor_profile", JSON.stringify(nextUserInfo));
        window.dispatchEvent(
          new CustomEvent("arkreview-doctor-profile-updated", {
            detail: nextUserInfo,
          }),
        );
      } else if (result.message === "Incorrect User ID") {
        setErrorMessage("UID không hợp lệ. Vui lòng kiểm tra lại.");
      } else {
        setErrorMessage(result.message || "Không tìm thấy thông tin Doctor.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-sky-100/80 bg-white shadow-[0_16px_40px_-18px_rgba(39,94,122,0.28)]">
      <CardHeader className="p-2">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
          <div className="rounded-lg border border-cyan-200 bg-cyan-100 p-2">
            <Search className="h-6 w-6 text-cyan-600" />
          </div>
          <span>Tra cứu tài khoản</span>
        </CardTitle>
        <CardDescription className="text-base text-slate-500">
          Nhập UID để lấy thông tin Doctor và mở các công cụ liên quan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pb-2">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Shield className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              placeholder="Nhập UID của bạn"
              value={uid}
              onChange={(event) => setUid(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSearch();
                }
              }}
              className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-lg text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>
          <Button
            onClick={() => void handleSearch()}
            disabled={isLoading}
            className="flex h-12 items-center gap-2 rounded-xl border border-white/50 bg-[linear-gradient(135deg,#0f766e_0%,#0284c7_100%)] px-8 text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(2,132,199,0.28)] disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Tra cứu</span>
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {searchAttempted && userInfo ? (
          <>
            <Separator className="bg-slate-200/80" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-indigo-200 bg-indigo-100 p-2">
                  <Crown className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800">Hồ sơ Doctor</p>
                  <p className="text-sm text-slate-500">Kết quả tra cứu theo UID vừa nhập.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                <div className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-cyan-300 hover:shadow-md">
                  <div className="absolute -right-3 -top-3 opacity-[0.03] transition-opacity group-hover:opacity-10">
                    <Shield className="h-16 w-16 text-cyan-600" />
                  </div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    UID
                  </p>
                  <p className="font-mono text-lg font-black tracking-tight text-cyan-600">
                    {userInfo.uid}
                  </p>
                </div>
                <div className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md">
                  <div className="absolute -right-3 -top-3 opacity-[0.03] transition-opacity group-hover:opacity-10">
                    <Sword className="h-16 w-16 text-indigo-600" />
                  </div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Tên hiển thị
                  </p>
                  <p className="text-lg font-black tracking-tight text-indigo-600">
                    {userInfo.name}
                  </p>
                </div>
                <div className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-purple-300 hover:shadow-md">
                  <div className="absolute -right-3 -top-3 opacity-[0.03] transition-opacity group-hover:opacity-10">
                    <Trophy className="h-16 w-16 text-purple-600" />
                  </div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Cấp Doctor
                    </p>
                    <Star className="h-3 w-3 fill-amber-500/20 text-amber-500" />
                  </div>
                  <p className="text-lg font-black tracking-tight text-purple-600">
                    Lv. {userInfo.level}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : errorMessage ? (
          <Alert className="animate-fade-in rounded-xl border-red-200 bg-red-50 text-red-800 shadow-sm backdrop-blur-md">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2 text-base font-medium">
              {errorMessage}
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
