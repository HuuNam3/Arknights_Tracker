export type MainTab = "tools" | "characters" | "banners" | "skins" | "tierlist" | "events" | "gacha";

export type ToolTab = "pull-planner" | "recruitment" | "operator-planner" | "skin-planner";

export type HeaderNavTone =
  | "slate"
  | "amber"
  | "rose"
  | "sky"
  | "purple"
  | "emerald"
  | "cyan";

export type HeaderNavIcon =
  | "home"
  | "diamond"
  | "hammer"
  | "shirt"
  | "users"
  | "gallery"
  | "trophy"
  | "scroll";

export const TOOL_TAB_PATHS: Record<ToolTab, string> = {
  "pull-planner": "/tools/pull-planner",
  "operator-planner": "/tools/operator-planner",
  "skin-planner": "/tools/skin-planner",
  recruitment: "/tools/recruitment-calculator",
};

export const MAIN_TAB_PATHS: Record<Exclude<MainTab, "tools">, string> = {
  characters: "/characters",
  banners: "/banners",
  skins: "/skins",
  tierlist: "/tier-list",
  events: "/news",
  gacha: "/gacha",
};

export const getMainTabPath = (tab: MainTab, toolTab: ToolTab = "pull-planner") =>
  tab === "tools" ? TOOL_TAB_PATHS[toolTab] : MAIN_TAB_PATHS[tab];

export const HEADER_NAV_ITEMS = [
  { href: "/", label: "Trang chủ", icon: "home", tone: "slate" },
  { href: "/banners", label: "Banners", icon: "gallery", tone: "sky" },
  { href: "/skins", label: "Skins", icon: "shirt", tone: "purple" },
  { href: "/tools/pull-planner", label: "Pull Planner", icon: "diamond", tone: "amber" },
  { href: "/tools/recruitment-calculator", label: "Recruitment", icon: "users", tone: "rose" },
  { href: "/characters", label: "Characters", icon: "users", tone: "emerald" },
  { href: "/tier-list", label: "Tier List", icon: "trophy", tone: "amber" },
  { href: "/news", label: "Tin tức", icon: "scroll", tone: "cyan" },
  { href: "/gacha", label: "Gacha", icon: "diamond", tone: "rose" },
] as const;
