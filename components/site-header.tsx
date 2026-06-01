"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Crown,
  Diamond,
  GalleryHorizontal,
  Home,
  type LucideIcon,
  ScrollText,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import {
  HEADER_NAV_ITEMS,
  HeaderNavIcon,
  HeaderNavTone,
} from "@/lib/site-navigation";

const isNavItemActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const NAV_ICON_MAP: Record<HeaderNavIcon, LucideIcon> = {
  home: Home,
  diamond: Diamond,
  users: Users,
  zap: Zap,
  gallery: GalleryHorizontal,
  trophy: Trophy,
  scroll: ScrollText,
};

const getNavToneStyles = (tone: HeaderNavTone, active: boolean) => {
  const tones: Record<
    HeaderNavTone,
    {
      activeItem: string;
      activeIcon: string;
      idleIcon: string;
      idleItem: string;
    }
  > = {
    slate: {
      activeItem: "border-slate-300 bg-slate-50 text-slate-800 shadow-sm",
      activeIcon: "bg-slate-200 text-slate-800",
      idleItem: "bg-white/50 text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900",
      idleIcon: "bg-slate-100 text-slate-500",
    },
    amber: {
      activeItem: "border-amber-300 bg-amber-50 text-amber-800 shadow-sm",
      activeIcon: "bg-amber-200 text-amber-800",
      idleItem: "bg-white/50 text-slate-600 hover:border-amber-200 hover:bg-amber-50/70 hover:text-amber-900",
      idleIcon: "bg-amber-100 text-amber-600",
    },
    rose: {
      activeItem: "border-rose-300 bg-rose-50 text-rose-800 shadow-sm",
      activeIcon: "bg-rose-200 text-rose-800",
      idleItem: "bg-white/50 text-slate-600 hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-900",
      idleIcon: "bg-rose-100 text-rose-600",
    },
    violet: {
      activeItem: "border-violet-300 bg-violet-50 text-violet-800 shadow-sm",
      activeIcon: "bg-violet-200 text-violet-800",
      idleItem: "bg-white/50 text-slate-600 hover:border-violet-200 hover:bg-violet-50/70 hover:text-violet-900",
      idleIcon: "bg-violet-100 text-violet-600",
    },
    sky: {
      activeItem: "border-sky-300 bg-sky-50 text-sky-800 shadow-sm",
      activeIcon: "bg-sky-200 text-sky-800",
      idleItem: "bg-white/50 text-slate-600 hover:border-sky-200 hover:bg-sky-50/70 hover:text-sky-900",
      idleIcon: "bg-sky-100 text-sky-600",
    },
    emerald: {
      activeItem: "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm",
      activeIcon: "bg-emerald-200 text-emerald-800",
      idleItem: "bg-white/50 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/70 hover:text-emerald-900",
      idleIcon: "bg-emerald-100 text-emerald-600",
    },
    cyan: {
      activeItem: "border-cyan-300 bg-cyan-50 text-cyan-800 shadow-sm",
      activeIcon: "bg-cyan-200 text-cyan-800",
      idleItem: "bg-white/50 text-slate-600 hover:border-cyan-200 hover:bg-cyan-50/70 hover:text-cyan-900",
      idleIcon: "bg-cyan-100 text-cyan-600",
    },
  };

  return {
    item: active ? tones[tone].activeItem : tones[tone].idleItem,
    icon: active ? tones[tone].activeIcon : tones[tone].idleIcon,
  };
};

export function SiteHeader() {
  const pathname = usePathname();
  const [doctorProfile, setDoctorProfile] = useState<{
    uid: string;
    name: string;
    level: number;
  } | null>(null);

  useEffect(() => {
    const syncDoctorProfile = () => {
      const savedProfile = localStorage.getItem("arknights_doctor_profile");
      if (!savedProfile) {
        setDoctorProfile(null);
        return;
      }

      try {
        const parsed = JSON.parse(savedProfile) as {
          uid?: string;
          name?: string;
          level?: number;
        };

        if (parsed.uid && parsed.name && typeof parsed.level === "number") {
          setDoctorProfile({
            uid: parsed.uid,
            name: parsed.name,
            level: parsed.level,
          });
          return;
        }
      } catch (error) {
        console.error(error);
      }

      setDoctorProfile(null);
    };

    syncDoctorProfile();
    window.addEventListener("storage", syncDoctorProfile);
    window.addEventListener("arkreview-doctor-profile-updated", syncDoctorProfile as EventListener);

    return () => {
      window.removeEventListener("storage", syncDoctorProfile);
      window.removeEventListener(
        "arkreview-doctor-profile-updated",
        syncDoctorProfile as EventListener,
      );
    };
  }, []);

  return (
    <aside className="z-40 border-b border-sky-100/80 bg-[rgba(248,252,255,0.9)] backdrop-blur-xl md:sticky md:top-0 md:h-screen md:w-44 md:shrink-0 md:border-b-0 md:border-r lg:w-48">
      <div className="px-4 py-3 md:flex md:h-full md:flex-col md:px-2.5 md:py-3">
        <nav className="flex min-w-0 gap-1.5 overflow-x-auto pb-1 md:flex-col md:overflow-x-visible md:overflow-y-auto md:pb-0">
          {HEADER_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = NAV_ICON_MAP[item.icon];
            const toneStyles = getNavToneStyles(item.tone, active);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-base font-semibold transition-colors md:px-2.5 md:py-1.5 ${toneStyles.item}`}
              >
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${toneStyles.icon}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {doctorProfile ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm md:mt-auto">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                <Crown className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{doctorProfile.name}</p>
                <p className="text-xs text-slate-500">UID {doctorProfile.uid}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
