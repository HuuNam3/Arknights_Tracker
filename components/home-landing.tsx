import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Diamond,
  Gamepad2,
  GalleryHorizontal,
  Hammer,
  ScrollText,
  Shirt,
  Trophy,
  Users,
} from "lucide-react";
import { AccountLookupHero } from "@/components/account-lookup-hero";

const primaryCards = [
  {
    href: "/tools/pull-planner",
    title: "Pull Planner",
    description:
      "Tính nhanh số pull hiện có, cert shop, orundum tích lũy và tổng khả năng đến banner mục tiêu.",
    icon: Diamond,
    accent: "from-amber-300 via-orange-300 to-yellow-200",
    surface: "border-amber-200 bg-white",
  },
  {
    href: "/tools/operator-planner",
    title: "Operator Planner",
    description:
      "Chọn operator, đặt mốc Elite, skill, mastery và tính vật liệu còn thiếu trước khi farm.",
    icon: Hammer,
    accent: "from-emerald-300 via-teal-300 to-sky-200",
    surface: "border-emerald-200 bg-white",
  },
  {
    href: "/tools/skin-planner",
    title: "Skin Planner",
    description:
      "Chọn outfit muốn mua, tính OP cần giữ, voucher áp dụng và số pull tương đương.",
    icon: Shirt,
    accent: "from-cyan-300 via-sky-300 to-indigo-200",
    surface: "border-cyan-200 bg-white",
  },
  {
    href: "/tools/recruitment-calculator",
    title: "Recruitment Calculator",
    description:
      "Chọn tag đang có, xem combo hợp lệ, operator có thể ra và gợi ý theo operator mục tiêu.",
    icon: Users,
    accent: "from-rose-300 via-pink-300 to-orange-200",
    surface: "border-rose-200 bg-white",
  },
  {
    href: "/banners",
    title: "Banner Tracker",
    description:
      "Theo dõi banner đã ra, sắp tới, limited status và các mốc dự đoán release Global.",
    icon: GalleryHorizontal,
    accent: "from-sky-300 via-cyan-300 to-teal-200",
    surface: "border-sky-200 bg-white",
  },
] as const;

const utilityCards = [
  {
    href: "/tier-list",
    title: "Tier List",
    description: "Sắp xếp operator theo cách bạn đánh giá và lưu bộ xếp hạng.",
    icon: Trophy,
    tone: "border-amber-200 bg-white text-amber-900",
  },
  {
    href: "/news",
    title: "Tin tức",
    description: "Tổng hợp sự kiện, login rewards và update mới nhất của Arknights.",
    icon: ScrollText,
    tone: "border-cyan-200 bg-white text-cyan-900",
  },
] as const;

export function HomeLanding() {
  return (
    <div className="min-h-screen p-2">
      <div className="mx-auto max-w-6xl space-y-2">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(249,252,255,0.96),rgba(237,246,248,0.94))] p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
          <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_top_left,rgba(125,211,252,0.34),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(253,186,116,0.22),transparent_24%)]" />
          <div className="relative space-y-6">
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Arknights Toolkit
            </div>
            <div className="space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center gap-4">
                <Gamepad2 className="h-10 w-10 animate-pulse-glow animate-float text-sky-700" />
                <h1 className="bg-[linear-gradient(135deg,#0f172a_0%,#155e75_42%,#b45309_100%)] bg-clip-text text-5xl font-black leading-[2] tracking-tight text-transparent md:text-7xl">
                  Arknights Tracker
                </h1>
                <Crown
                  className="h-10 w-10 animate-pulse-glow animate-float text-amber-600"
                  style={{ animationDelay: "1s" }}
                />
              </div>
              <p className="mx-auto max-w-4xl text-lg font-medium text-slate-700 md:text-xl lg:mx-0">
                Theo dõi Characters, Banners, Tier List, Pull Planner, Recruitment,
                Tin tức và lịch sử Gacha cho Arknights trong một nơi.
              </p>
            </div>
          </div>
        </section>

        <AccountLookupHero />

        <section className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {primaryCards
              .filter(
                (card) =>
                  card.href !== "/tools/operator-planner" &&
                  card.href !== "/tools/skin-planner",
              )
              .map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`group overflow-hidden rounded-[1.75rem] border ${card.surface} p-4 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] transition-transform hover:-translate-y-1`}
                >
                  <div className={`h-2 rounded-full bg-gradient-to-r ${card.accent}`} />
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-2xl font-black text-slate-900">{card.title}</p>
                      <p className="text-sm leading-6 text-slate-600">{card.description}</p>
                    </div>
                    <div className="rounded-2xl border border-white/70 bg-white p-3 shadow-sm">
                      <Icon className="h-5 w-5 text-slate-900" />
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
                    Đi đến trang này
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="mt-2 text-2xl font-black text-slate-900">Các trang bổ trợ</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {utilityCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`rounded-2xl border p-4 transition-transform hover:-translate-y-0.5 ${card.tone}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-white/70 bg-white p-2.5 shadow-sm">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-lg font-black">{card.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
