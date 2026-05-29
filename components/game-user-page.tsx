"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  Gamepad2,
  Zap,
  Crown,
  Sword,
  Star,
  Trophy,
  Clock,
  ChevronRight,
  Diamond,
  Search,
  Shield,
  ScrollText,
  Loader2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  History,
  Users,
  GalleryHorizontal,
  Plus,
  X,
} from "lucide-react";

// Mock gacha data
const mockGachas: Record<
  string,
  { normal: string[]; limited: string[]; special: string[] }
> = {
  gacha001: {
    normal: [
      "Common Sword",
      "Iron Shield",
      "Leather Armor",
      "Wooden Staff",
      "Bronze Helmet",
    ],
    limited: ["Legendary Bow", "Sacred Tome", "Mystic Ring", "Enchanted Cloak"],
    special: ["Dragon Scale Armor", "God of War Hammer", "Phoenix Wing Cape"],
  },
  gacha002: {
    normal: ["Basic Potion", "Health Elixir", "Mana Stone", "Recovery Scroll"],
    limited: ["Immortal Potion", "Divine Elixir", "Celestial Stone"],
    special: ["Eternal Life Potion", "Wish Crystal"],
  },
  gacha003: {
    normal: ["Copper Coin", "Silver Medal", "Gold Token", "Gem Dust"],
    limited: ["Platinum Crown", "Diamond Seal", "Sapphire Gem"],
    special: ["Infinity Stone", "Cosmic Pearl"],
  },
};

const NEWS_MONTHS: Record<string, string> = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

const NEWS_PHRASE_REPLACEMENTS: Array<[string, string]> = [
  ["UNLOCK REQUIREMENT:", "ĐIỀU KIỆN MỞ:"],
  ["UPDATE TIME:", "THỜI GIAN CẬP NHẬT:"],
  ["EVENT STAGE DURATION:", "THỜI GIAN MỞ MÀN SỰ KIỆN:"],
  ["DURATION:", "THỜI GIAN:"],
  ["DETAILS:", "CHI TIẾT:"],
  ["REWARDS:", "PHẦN THƯỞNG:"],
  ["CONTENTS:", "NỘI DUNG:"],
  ["HOW TO OBTAIN:", "CÁCH NHẬN:"],
  ["NOTE:", "LƯU Ý:"],
  ["Note:", "LƯU Ý:"],
  ["Phase 1", "Giai đoạn 1"],
  ["Phase 2", "Giai đoạn 2"],
  ["Phase 3", "Giai đoạn 3"],
  ["Event Stages will open in 2 phases:", "Màn sự kiện sẽ mở theo 2 giai đoạn:"],
  ["SPECIAL LOGIN EVENT OPEN", "SỰ KIỆN ĐĂNG NHẬP ĐẶC BIỆT MỞ"],
  ["NEW OPERATORS NOW AVAILABLE", "OPERATOR MỚI ĐÃ CÓ MẶT"],
  ["NEW ARRIVAL AT THE OUTFIT STORE", "TRANG PHỤC MỚI TẠI CỬA HÀNG OUTFIT"],
  ["NEW ARRIVALS AT THE OUTFIT STORE", "TRANG PHỤC MỚI TẠI CỬA HÀNG OUTFIT"],
  ["RE-EDITION OUTFITS AT THE OUTFIT STORE", "TRANG PHỤC TÁI PHÁT HÀNH TẠI CỬA HÀNG OUTFIT"],
  ["LIMITED-TIME PACKS AVAILABLE", "CÁC GÓI GIỚI HẠN ĐANG MỞ BÁN"],
  ["RE-EDITION FURNITURE SET", "BỘ NỘI THẤT TÁI PHÁT HÀNH"],
  ["NEW FURNITURE SET", "BỘ NỘI THẤT MỚI"],
  ["NEW REDEEMABLE AVAILABLE IN", "VẬT PHẨM ĐỔI MỚI TRONG"],
  ["at the Outfit Store", "tại Cửa hàng Outfit"],
  ["from the Store", "từ cửa hàng"],
  ["at the Store", "trong cửa hàng"],
  ["During the event,", "Trong thời gian sự kiện,"],
  ["After this event ends,", "Sau khi sự kiện kết thúc,"],
  ["After the event ends,", "Sau khi sự kiện kết thúc,"],
  ["After this rerun event ends,", "Sau khi đợt rerun này kết thúc,"],
  ["For this rerun event,", "Trong đợt rerun này,"],
  ["This rerun event is a lightweight rerun;", "Đây là một đợt rerun dạng nhẹ;"],
  ["During this event,", "Trong thời gian sự kiện,"],
  ["players can obtain", "người chơi có thể nhận"],
  ["players can complete", "người chơi có thể hoàn thành"],
  ["players can claim", "người chơi có thể nhận"],
  ["you can collect", "bạn có thể thu thập"],
  ["by participating in the event", "khi tham gia sự kiện"],
  ["by clearing event stages", "bằng cách vượt các màn sự kiện"],
  ["clearing event stages", "vượt các màn sự kiện"],
  ["completing event missions", "hoàn thành nhiệm vụ sự kiện"],
  ["and completing", "và hoàn thành"],
  ["to gain rewards", "để nhận thưởng"],
  ["to redeem items for rewards", "để đổi vật phẩm nhận thưởng"],
  ["can be used to redeem items from", "có thể được dùng để đổi vật phẩm từ"],
  ["redeeming from Event Store", "đổi thưởng trong Cửa hàng sự kiện"],
  ["redeeming from", "đổi thưởng từ"],
  ["will be open for a limited time.", "sẽ mở trong thời gian giới hạn."],
  ["will be available again during the event.", "sẽ mở lại trong thời gian sự kiện."],
  ["will be available at the Outfit Store:", "sẽ được mở bán tại Cửa hàng Outfit:"],
  ["will be available at the Outfit Store, including:", "sẽ được mở bán tại Cửa hàng Outfit, gồm:"],
  ["will be available from the Store for a limited time.", "sẽ được bán giới hạn từ cửa hàng."],
  ["will be available at the Store for a limited time.", "sẽ được bán giới hạn trong cửa hàng."],
  ["The following new Outfit", "Outfit mới sau"],
  ["The following new Outfits", "Các Outfit mới sau"],
  ["The following Re-edition Outfit", "Outfit tái phát hành sau"],
  ["The following Re-edition Outfits", "Các Outfit tái phát hành sau"],
  ["the following packs", "các gói sau"],
  ["the following Operators", "các Operator sau"],
  ["the following new Outfits", "các Outfit mới sau"],
  ["the following Re-edition Outfits", "các Outfit tái phát hành sau"],
  ["the following new Outfit", "Outfit mới sau"],
  ["the following Re-edition Outfit", "Outfit tái phát hành sau"],
  ["The following Operators will be added to the game:", "Các Operator sau sẽ được thêm vào game:"],
  ["The profile theme can be viewed and used in Profile.", "Profile theme có thể được xem và sử dụng trong Profile."],
  ["Please refer to the in-game info for the expiration time of", "Vui lòng xem thông tin trong game để biết thời gian hết hạn của"],
  ["the event stories cannot be reviewed in [Public Affairs].", "cốt truyện sự kiện chưa thể xem lại trong [Public Affairs]."],
  ["this event will be included in [Public Affairs].", "sự kiện này sẽ được thêm vào [Public Affairs]."],
  ["the Limited-time Headhunting,", "banner Headhunting giới hạn"],
  ["opens and the following Operators will appear at a higher rate:", "mở và các Operator sau sẽ có tỉ lệ xuất hiện cao hơn:"],
  ["This is a [Standard Headhunting].", "Đây là [Standard Headhunting]."],
  ["If you make 150 headhunting attempts without receiving the current rate-up 6-star Operator, the next 6-star operator received is guaranteed to be the current rate-up 6-star Operator.", "Nếu bạn thực hiện 150 lượt headhunt mà chưa nhận được Operator 6 sao rate-up hiện tại, Operator 6 sao tiếp theo chắc chắn sẽ là Operator 6 sao rate-up hiện tại."],
  ["is currently ONLY available from the", "hiện CHỈ có thể nhận từ"],
  ["and is NOT available in", "và KHÔNG có trong"],
  ["will become available in other", "sẽ xuất hiện trong các"],
  ["will gain more trust in the", "sẽ nhận thêm trust trong"],
  ["For this rerun event, some of the engraved medals in the corresponding Engraved Medal Set will have their acquisition conditions adjusted.", "Trong đợt rerun này, một số huy chương khắc trong Engraved Medal Set tương ứng sẽ được điều chỉnh điều kiện nhận."],
  ["Players who meet the updated conditions will be able to obtain the event's engraved medals.", "Người chơi đáp ứng điều kiện mới sẽ có thể nhận các huy chương khắc của sự kiện."],
  ["Due to these adjustments, players who previously participated in the event and already meet the new acquisition conditions will receive the corresponding engraved medals immediately upon the update.", "Do các điều chỉnh này, người chơi đã từng tham gia sự kiện và đã đáp ứng điều kiện mới sẽ nhận ngay các huy chương tương ứng khi bản cập nhật được áp dụng."],
  ["the engraved medals from the event's Engraved Medal Set cannot be obtained again through [Score] or any other channels.", "các huy chương trong Engraved Medal Set của sự kiện sẽ không thể nhận lại qua [Score] hoặc bất kỳ kênh nào khác."],
  ["event stages will inherit the player's previous event stage progress and first-time drop progress.", "các màn sự kiện sẽ kế thừa tiến độ màn và tiến độ first-time drop trước đó của người chơi."],
  ["Some non-repeatable event rewards during this rerun can be converted into [Intelligence Certificate] at a corresponding ratio when obtained again.", "Một số phần thưởng sự kiện không thể nhận lặp lại trong đợt rerun này sẽ được chuyển thành [Intelligence Certificate] theo tỉ lệ tương ứng nếu nhận lại."],
  ["The conversion rates can be found in the event's Intelligence Certificate Conversion Rules.", "Tỉ lệ chuyển đổi có thể xem trong quy tắc chuyển đổi Intelligence Certificate của sự kiện."],
  ["The [Intelligence Certificate] shop will restock additional quantities of existing items and add new items when the event starts.", "Cửa hàng [Intelligence Certificate] sẽ bổ sung thêm số lượng cho vật phẩm hiện có và thêm vật phẩm mới khi sự kiện bắt đầu."],
  ["After this event ends, the event stages will be permanently added to [Score]", "Sau khi sự kiện kết thúc, các màn sự kiện sẽ được thêm vĩnh viễn vào [Score]"],
  ["cannot be used to redeem the above outfits.", "không thể dùng để đổi các outfit ở trên."],
  ["Please stay tuned for more information!", "Vui lòng chờ thêm thông tin chi tiết!"],
  ["Brand new set of themed furniture,", "Bộ nội thất chủ đề mới,"],
];

const NEWS_TERM_REPLACEMENTS: Array<[string, string]> = [
  ["[Maintenance Checklist]", "[Danh sách bảo trì]"],
  ["[Stratosphere Estate Agency]", "[Cơ quan bất động sản tầng bình lưu]"],
  ["[Commissione di Fuochi d'Artificio]", "[Ủy ban pháo hoa]"],
  ["[Programma della Parata]", "[Chương trình diễu hành]"],
  ["[Fiera delle Meraviglie Notturne]", "[Hội chợ kỳ thú ban đêm]"],
  ["Clear Main Storyline", "Hoàn thành Main Story"],
  ["event rewards", "phần thưởng sự kiện"],
  ["event stages", "màn sự kiện"],
  ["event stage", "màn sự kiện"],
  ["event missions", "nhiệm vụ sự kiện"],
  ["missions", "nhiệm vụ"],
  ["and more.", "và nhiều hơn nữa."],
  ["etc.", "v.v."],
  [" and ", " và "],
  ["Daily Commissions", "Nhiệm vụ hằng ngày"],
  ["Event Store", "Cửa hàng sự kiện"],
  ["Outfit Store", "Cửa hàng Outfit"],
  ["Headhunting Permits", "Vé Headhunting"],
  ["Module Materials", "Nguyên liệu Module"],
  ["Elite Materials", "Nguyên liệu Elite"],
  ["Battle Records", "Battle Record"],
  ["Furniture Part", "Phụ tùng nội thất"],
  ["Profile Theme", "Profile Theme"],
  ["profile theme", "profile theme"],
  ["Emergency Sanity Concentrate", "Emergency Sanity Concentrate"],
  ["Intelligence Certificate", "Intelligence Certificate"],
  ["Standard Headhunting", "Standard Headhunting"],
  ["Kernel Headhunting", "Kernel Headhunting"],
  ["Trust gain", "Trust nhận được"],
  ["rerun event", "đợt rerun"],
  ["lightweight rerun", "rerun dạng nhẹ"],
  ["provides random materials", "cho nguyên liệu ngẫu nhiên"],
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const translateNewsDates = (value: string) =>
  value.replace(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})/g,
    (_, month: string, day: string, year: string) =>
      `${day.padStart(2, "0")}/${NEWS_MONTHS[month]}/${year}`,
  );

const applyTranslationMap = (
  value: string,
  replacements: Array<[string, string]>,
) =>
  replacements
    .sort((left, right) => right[0].length - left[0].length)
    .reduce((translated, [source, target]) => {
      const regex = new RegExp(escapeRegExp(source), "gi");
      return translated.replace(regex, target);
    }, value);

const translateGameTerms = (html: string) => {
  if (!html) return "";

  let translated = translateNewsDates(html);
  translated = applyTranslationMap(translated, NEWS_PHRASE_REPLACEMENTS);
  translated = applyTranslationMap(translated, NEWS_TERM_REPLACEMENTS);

  return translated;
};

// Helper: Operators with Japanese-style name order (Family Given) that need reversal for wiki URLs
const REVERSED_NAME_OPERATORS = new Set([
  "Sakiko Togawa",
  "Uika Misumi",
  "Mutsumi Wakaba",
  "Umiri Yahata",
  "Nyamu Y\u016btenji",
  "Nyamu Yutenji",
]);

const getWikiImageName = (charName: string): string => {
  if (REVERSED_NAME_OPERATORS.has(charName)) {
    // Reverse word order: "Togawa Sakiko" => "Sakiko_Togawa"
    const parts = charName.trim().split(" ");
    return parts.reverse().join("_");
  }
  return charName.replace(/ /g, "_");
};

const getOperatorAvatarUrl = (name: string) =>
  `https://arknights.wiki.gg/images/${getWikiImageName(name)}_icon.png`;

const getOperatorAvatarFallback = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const normalizeTierOrder = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  const normalized = value
    .map((tier) => (typeof tier === "string" ? tier.trim() : ""))
    .filter(Boolean);

  return [...new Set(normalized)];
};

const normalizeTierAssignments = (value: unknown): TierAssignmentMap => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, TierRank | ""] =>
        typeof entry[0] === "string" && typeof entry[1] === "string",
    ),
  );
};

const buildTierOrderFromAssignments = (assignments: TierAssignmentMap) => {
  const assignedTiers = [...new Set(Object.values(assignments).filter(Boolean))];
  if (assignedTiers.length === 0) {
    return [...DEFAULT_TIER_ORDER];
  }

  const legacyTierOrder = LEGACY_TIER_ORDER as readonly string[];

  return assignedTiers.sort((left, right) => {
    const leftIndex = legacyTierOrder.indexOf(left);
    const rightIndex = legacyTierOrder.indexOf(right);

    if (leftIndex !== -1 && rightIndex !== -1) {
      return leftIndex - rightIndex;
    }

    if (leftIndex !== -1) {
      return -1;
    }

    if (rightIndex !== -1) {
      return 1;
    }

    return left.localeCompare(right);
  });
};

const resolveTierOrder = (tiers: unknown, assignments: TierAssignmentMap) => {
  const normalizedTiers = normalizeTierOrder(tiers);
  if (normalizedTiers.length > 0) {
    return normalizedTiers;
  }

  return buildTierOrderFromAssignments(assignments);
};

const hydrateSavedTierList = (value: unknown): SavedTierList | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SavedTierList> & {
    assignments?: unknown;
    tiers?: unknown;
  };
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const id = typeof candidate.id === "string" ? candidate.id : "";
  const createdAt =
    typeof candidate.createdAt === "number" ? candidate.createdAt : Date.now();
  const assignments = normalizeTierAssignments(candidate.assignments);
  const tiers = resolveTierOrder(candidate.tiers, assignments);

  if (!name || !id) {
    return null;
  }

  return {
    assignments,
    createdAt,
    id,
    name,
    tiers,
  };
};

const MIN_DOCTOR_LEVEL = 1;
const MAX_DOCTOR_LEVEL = 120;
const GLOBAL_SANITY_BONUS = 45;

const clampDoctorLevel = (level: number) =>
  Math.min(MAX_DOCTOR_LEVEL, Math.max(MIN_DOCTOR_LEVEL, Math.floor(level)));

const getBaseSanityCap = (level: number) => {
  const doctorLevel = clampDoctorLevel(level);

  if (doctorLevel === 1) return 82;
  if (doctorLevel <= 5) return 82 + (doctorLevel - 1) * 2;
  if (doctorLevel <= 35) return 90 + (doctorLevel - 5);
  if (doctorLevel <= 85) return 120 + Math.floor((doctorLevel - 35) / 5);
  if (doctorLevel <= 100) return 130;

  return Math.min(135, 131 + Math.floor((doctorLevel - 101) / 4));
};

const getGlobalSanityCap = (level: number) =>
  getBaseSanityCap(level) + GLOBAL_SANITY_BONUS;

const formatRecoveryDuration = (minutes: number) => {
  if (minutes <= 0) return "Đã đầy";

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  const parts = [];

  if (days > 0) parts.push(`${days} ngày`);
  if (hours > 0) parts.push(`${hours} giờ`);
  if (mins > 0) parts.push(`${mins} phút`);

  return parts.join(" ");
};

const formatRecoveryDateTime = (minutes: number) =>
  new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(Date.now() + minutes * 60 * 1000));

const SANITY_RECOVERY_MS = 6 * 60 * 1000;

type SanitySnapshot = {
  recordedAt: number;
  value: number;
};

type OperatorRelease = {
  cnReleaseDate: string | null;
  enReleaseDate: string | null;
  event: string;
  globalReleased: boolean;
  limited: boolean;
  name: string;
  rarity: string;
  releaseDate: string;
  releaseTs: number;
};

type BannerRelease = {
  bannerImageUrl: string | null;
  category: string;
  cnStartDate: string | null;
  enStartDate: string | null;
  globalReleased: boolean;
  limited: boolean;
  name: string;
  operators: string[];
  releaseDate: string;
  releaseTs: number;
};

const DEFAULT_TIER_ORDER = ["S", "A", "B", "C", "D", "E"] as const;
const LEGACY_TIER_ORDER = ["OP+", "OP", "OP-", ...DEFAULT_TIER_ORDER] as const;
type TierRank = string;
type TierAssignmentMap = Record<string, TierRank | "">;
type SavedTierList = {
  assignments: TierAssignmentMap;
  createdAt: number;
  id: string;
  name: string;
  tiers: string[];
};

const DEFAULT_SAVED_TIER_LISTS: SavedTierList[] = [
  {
    assignments: {
      "Exusiai the New Covenant": "OP+",
      Haruka: "OP+",
      "Wiš'adel": "OP+",
      Exusiai: "S",
      Ash: "A+",
      Archetto: "A+",
      "Pozëmka": "S-",
      Schwarz: "A+",
      Lemuen: "S+",
      Fartooth: "A",
      Fiammetta: "S-",
      W: "A+",
      "Ch'en the Dawnstreak": "",
      "Ch'en the Holungday": "OP-",
      Rosa: "S",
      Typhon: "S+",
      Rosmontis: "A",
      Ray: "A+",
      Narantuya: "S",
      Logos: "OP",
      Eyjafjalla: "S",
      Ceobe: "S",
      "Ho'olheyak": "A",
      Dusk: "A+",
      Mostima: "S-",
      Marcille: "A+",
      Passenger: "S-",
      "Astgenne the Lightchaser": "A-",
      Ebenholz: "S-",
      Ifrit: "S",
      Lin: "S",
      Carnelian: "A",
      Goldenglow: "S+",
      "Lappland the Decadenza": "S-",
      "Hoshiguma the Breacher": "OP",
      "Blaze the Igniting Spark": "S",
      Nymph: "S+",
      Necrass: "S+",
      SilverAsh: "S",
      Thorns: "S",
      Qiubai: "S",
      Pallas: "A",
      "Ch'en": "A+",
      Irene: "S-",
      Degenbrecher: "OP",
      Blaze: "S-",
      "Gavial the Invincible": "S",
      Lessing: "A",
      Skadi: "A+",
      "Nearl the Radiant Knight": "S",
      Mountain: "S",
      Chongyue: "S",
      "Zuo Le": "S+",
      Hellagur: "A",
      Surtr: "S+",
      "Vina Victoria": "S-",
      Viviana: "S",
      "Executor the Ex Foedere": "S+",
      Entelechia: "S+",
      "Młynar": "OP",
      "Leizi the Thunderbringer": "OP",
      Ulpianus: "S+",
      Hoederer: "S-",
      Pepe: "S-",
      Hoshiguma: "S-",
      Nian: "S-",
      "Sankta Miksaparato": "A+",
      "Jessica the Liberated": "S-",
      Mudrock: "S",
      Penance: "S",
      Eunectes: "A+",
      Saria: "S",
      Shu: "OP-",
      Blemishine: "A+",
      Horn: "S",
      Yu: "S-",
      Siege: "A",
      Vulpisfoglia: "S-",
      Saga: "S-",
      Flametail: "S-",
      Saileach: "S",
      Bagpipe: "S+",
      Muelsyse: "S",
      Vigil: "A-",
      Ines: "OP",
      Shining: "A+",
      Nightingale: "S",
      Lumen: "S-",
      "Reed the Flame Shadow": "S+",
      Mon3tr: "OP-",
      Suzuran: "S+",
      "Skadi the Corrupting Heart": "S",
      "Civilight Eterna": "S",
      Gnosis: "S",
      "Silence the Paradigmatic": "A+",
      Magallan: "A+",
      Ling: "A+",
      "Kal'tsit": "S",
      Tragodia: "OP",
      Virtuosa: "S+",
      Phantom: "A+",
      "Texas the Omertosa": "OP-",
      "Kirin R Yato": "OP-",
      Crownslayer: "A",
      "Swire the Elegant Wit": "A+",
      Lee: "A+",
      Ela: "OP-",
      Dorothy: "S-",
      Ascalon: "S+",
      Mizuki: "A+",
      Gladiia: "S-",
      Weedy: "S",
      "Specter the Unchained": "S",
      "Thorns the Lodestar": "A+",
      Aak: "A+",
      Angelina: "A+",
      "Eyjafjalla the Hvít Aska": "OP-",
      "Pramanix the Prerita": "OP",
      "SilverAsh the Reignfrost": "OP",
      Nasti: "S",
      Mantra: "S",
      "Togawa Sakiko": "OP",
    },
    createdAt: 1779985894777,
    id: "1779985894777",
    name: "2026 only 6s",
    tiers: ["OP+", "OP", "OP-", "S+", "S", "S-", "A+", "A", "A-"],
  },
];

const mergeDefaultTierLists = (tierLists: SavedTierList[]) => {
  const existingNames = new Set(
    tierLists.map((tierList) => tierList.name.trim().toLowerCase()),
  );
  const missingDefaults = DEFAULT_SAVED_TIER_LISTS.filter(
    (tierList) => !existingNames.has(tierList.name.trim().toLowerCase()),
  );

  return [...missingDefaults, ...tierLists];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const TIER_DRAFT_KEY = "arkreview_tierlist_draft_v1";
const TIER_LISTS_KEY = "arkreview_tierlists_v1";

const parseIsoDate = (value: string | null) => {
  if (!value) return null;

  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const formatIsoDate = (timestamp: number) =>
  new Date(timestamp).toISOString().slice(0, 10);

const formatDisplayDate = (value: string | null) => {
  if (!value) return null;

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${month}-${day}-${year}`;
};

const isWithinDays = (
  leftDate: string | null,
  rightDate: string | null,
  maxDays: number,
) => {
  const leftTs = parseIsoDate(leftDate);
  const rightTs = parseIsoDate(rightDate);

  if (leftTs === null || rightTs === null) return false;

  return Math.abs(leftTs - rightTs) <= maxDays * DAY_MS;
};

const isBannerArtifactName = (value: string) => /banner\.png$/i.test(value);

const getOperatorRarityValue = (operator: OperatorRelease) => {
  const parsedRarity = parseInt(operator.rarity, 10);
  if (Number.isFinite(parsedRarity)) {
    return parsedRarity;
  }

  return null;
};

const isLikelyCharacterBannerName = (value: string) =>
  !/Joint Operation|Kernel|Celebration|Orienteering|Locating|Vision|Banner/i.test(
    value,
  ) && !/#\d+/.test(value);

const getNormalizedBannerOperatorNames = (banner: BannerRelease) => {
  const operators =
    isLikelyCharacterBannerName(banner.name) &&
    !banner.operators.includes(banner.name)
      ? [banner.name, ...banner.operators]
      : banner.operators;

  return operators.filter((name) => !isBannerArtifactName(name));
};

const getBannerKey = (banner: BannerRelease) =>
  `${banner.name}-${banner.cnStartDate ?? "cn"}-${banner.enStartDate ?? "en"}`;

const getMedianLagDays = <T,>(
  items: T[],
  getCnDate: (item: T) => string | null,
  getEnDate: (item: T) => string | null,
  maxSamples: number,
) => {
  const lagValues = items
    .map((item) => {
      const cnTs = parseIsoDate(getCnDate(item));
      const enTs = parseIsoDate(getEnDate(item));
      if (cnTs === null || enTs === null || enTs < cnTs) return null;

      return {
        enTs,
        lagDays: Math.round((enTs - cnTs) / DAY_MS),
      };
    })
    .filter((value): value is { enTs: number; lagDays: number } => value !== null)
    .sort((a, b) => b.enTs - a.enTs)
    .slice(0, maxSamples)
    .map((value) => value.lagDays)
    .sort((a, b) => a - b);

  if (lagValues.length === 0) return 180;

  return lagValues[Math.floor(lagValues.length / 2)];
};

const getTierBadgeClassName = (tier: TierRank) => {
  switch (tier) {
    case "OP+":
      return "bg-rose-500 text-white border-rose-400";
    case "OP":
      return "bg-rose-400 text-white border-rose-300";
    case "OP-":
      return "bg-orange-400 text-white border-orange-300";
    case "S":
      return "bg-amber-400 text-white border-amber-300";
    case "A":
      return "bg-emerald-400 text-white border-emerald-300";
    case "B":
      return "bg-sky-400 text-white border-sky-300";
    case "C":
      return "bg-indigo-400 text-white border-indigo-300";
    case "D":
      return "bg-violet-400 text-white border-violet-300";
    case "E":
      return "bg-slate-500 text-white border-slate-400";
    default: {
      const fallbackClasses = [
        "bg-pink-500 text-white border-pink-400",
        "bg-cyan-500 text-white border-cyan-400",
        "bg-lime-500 text-white border-lime-400",
        "bg-fuchsia-500 text-white border-fuchsia-400",
        "bg-stone-500 text-white border-stone-400",
      ];
      const colorIndex =
        [...tier].reduce((sum, character) => sum + character.charCodeAt(0), 0) %
        fallbackClasses.length;

      return fallbackClasses[colorIndex];
    }
  }
};

const OperatorAvatarPreview = ({
  operator,
  className = "size-14",
}: {
  operator: OperatorRelease;
  className?: string;
}) => (
  <Avatar
    className={`${className} rounded-2xl border border-slate-200 bg-slate-100 shadow-sm`}
  >
    <AvatarImage src={getOperatorAvatarUrl(operator.name)} alt={operator.name} />
    <AvatarFallback className="rounded-2xl bg-slate-200 text-[11px] font-semibold text-slate-600">
      {getOperatorAvatarFallback(operator.name)}
    </AvatarFallback>
  </Avatar>
);

const TierOperatorAvatar = ({
  operator,
  sizeClassName = "size-14",
}: {
  operator: OperatorRelease;
  sizeClassName?: string;
}) => {
  const rarity = getOperatorRarityValue(operator) ?? 0;

  return (
    <HoverCard openDelay={120}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
          aria-label={operator.name}
        >
          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <OperatorAvatarPreview operator={operator} className={sizeClassName} />
          </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto min-w-[180px] rounded-2xl border-slate-200 bg-white/95 p-3 shadow-xl">
        <div className="flex items-center gap-3">
          <OperatorAvatarPreview operator={operator} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {operator.name}
            </p>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: rarity }).map((_, starIndex) => (
                <Star
                  key={`${operator.name}-hover-star-${starIndex}`}
                  className="size-3.5 fill-amber-500 text-amber-500"
                />
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const TierAssignmentAvatar = ({
  currentTier = "",
  onAssign,
  onClick,
  operator,
  tierOrder,
}: {
  currentTier?: string;
  onAssign: (tier: string) => void;
  onClick?: () => void;
  operator: OperatorRelease;
  tierOrder: string[];
}) => {
  const rarity = getOperatorRarityValue(operator) ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          title={operator.name}
          className="rounded-2xl p-0.5 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
          aria-label={operator.name}
        >
          <OperatorAvatarPreview operator={operator} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[220px] rounded-2xl border-slate-200 bg-white/95 p-3 shadow-xl">
        <div className="flex items-center gap-3">
          <OperatorAvatarPreview operator={operator} className="size-12" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {operator.name}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: rarity }).map((_, starIndex) => (
                  <Star
                    key={`${operator.name}-popover-star-${starIndex}`}
                    className="size-3.5 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>
              <Badge
                variant="outline"
                className={`rounded-full ${
                  currentTier
                    ? getTierBadgeClassName(currentTier)
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {currentTier || "Chưa xếp"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tierOrder.map((tier) => (
            <Button
              key={`${operator.name}-assign-${tier}`}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAssign(tier)}
              className={`rounded-xl ${
                currentTier === tier
                  ? getTierBadgeClassName(tier)
                  : "border-slate-200 text-slate-700"
              }`}
            >
              {tier}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAssign("")}
            className="rounded-xl border-slate-200 text-slate-600"
          >
            Bỏ xếp hạng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const clampSanityValue = (value: number, cap: number) =>
  Math.min(cap, Math.max(0, Math.floor(value)));

const getSanityStorageKey = (uid: string) => `arknights_sanity:${uid}`;

const getRecoveredSanityValue = (
  snapshot: SanitySnapshot,
  cap: number,
  now: number,
) => {
  const elapsedSteps = Math.max(
    0,
    Math.floor((now - snapshot.recordedAt) / SANITY_RECOVERY_MS),
  );

  return Math.min(cap, snapshot.value + elapsedSteps);
};

const normalizeSanitySnapshot = (
  snapshot: SanitySnapshot,
  cap: number,
  now: number,
): SanitySnapshot => {
  const recoveredValue = getRecoveredSanityValue(snapshot, cap, now);
  if (recoveredValue >= cap) {
    return { recordedAt: now, value: cap };
  }

  const remainder = Math.max(0, (now - snapshot.recordedAt) % SANITY_RECOVERY_MS);
  return {
    recordedAt: now - remainder,
    value: recoveredValue,
  };
};

const UI_TEXT = {
  appTagline:
    "Tra cá»©u tÃ i khoáº£n, theo dÃµi tin tá»©c vÃ  kiá»ƒm tra lá»‹ch sá»­ gacha Arknights.",
  searchTitle: "Tra cá»©u tÃ i khoáº£n",
  searchDescription:
    "Nháº­p UID Ä‘á»ƒ láº¥y thÃ´ng tin Doctor vÃ  má»Ÿ cÃ¡c cÃ´ng cá»¥ liÃªn quan.",
  uidPlaceholder: "Nháº­p UID cá»§a báº¡n",
  searchButton: "Tra cá»©u",
  profileTitle: "Há»“ sÆ¡ Doctor",
  uidLabel: "UID",
  nicknameLabel: "TÃªn hiá»ƒn thá»‹",
  levelLabel: "Cáº¥p Doctor",
  sanityCapLabel: "Sanity tá»‘i Ä‘a",
  sanityCapHint: "TÃ­nh theo má»‘c Global hiá»‡n táº¡i",
  sanityCalcTitle: "MÃ¡y tÃ­nh sanity",
  sanityCalcDescription:
    "Nháº­p lÆ°á»£ng sanity hiá»‡n táº¡i Ä‘á»ƒ tÃ­nh sá»‘ cÃ²n thiáº¿u vÃ  thá»i gian há»“i Ä‘áº§y vá»›i tá»‘c Ä‘á»™ 1 sanity má»—i 6 phÃºt.",
  sanityInputPlaceholder: "Nháº­p sanity hiá»‡n táº¡i",
  sanityClampHint: "Náº¿u nháº­p vÆ°á»£t giá»›i háº¡n, há»‡ thá»‘ng sáº½ tá»± giá»›i háº¡n vá»",
  currentSanityLabel: "Sanity hiá»‡n táº¡i",
  missingSanityLabel: "CÃ²n thiáº¿u",
  fullRecoveryLabel: "Äáº§y sau",
  fullNowLabel: "ÄÃ£ Ä‘áº§y",
  fullAtPrefix: "Äáº§y lÃºc",
  inputToCalculate: "Nháº­p sanity Ä‘á»ƒ báº¯t Ä‘áº§u tÃ­nh",
  eventsTab: "Tin tá»©c",
  rewardsTab: "Äá»•i quÃ ",
  gachaTab: "Gacha",
  detailsButton: "Xem bÃ i gá»‘c",
  rewardsTitle: "Cá»•ng Ä‘á»•i quÃ  chÃ­nh thá»©c",
  rewardsDescription:
    "Má»Ÿ trang redeem cá»§a Arknights Global Ä‘á»ƒ nháº­p code vÃ  nháº­n quÃ .",
  redeemButton: "Má»Ÿ trang Ä‘á»•i quÃ ",
  codesTitle: "Code hiá»‡n cÃ³",
  copyButton: "Sao chÃ©p",
  gachaTitle: "Tra cá»©u lá»‹ch sá»­ gacha",
  gachaDescription: "DÃ¡n cookie láº¥y tá»«",
  cookiePlaceholder: "Nháº­p cookie hoáº·c token cá»§a báº¡n",
  gachaSearchButton: "Táº£i lá»‹ch sá»­",
  gachaLoading: "Äang táº£i lá»‹ch sá»­ gacha...",
  totalPullsLabel: "Tá»•ng lÆ°á»£t kÃ©o",
  recentHistoryTitle: "Lá»‹ch sá»­ gáº§n Ä‘Ã¢y",
  timeColumn: "Thá»i gian",
  operatorColumn: "NhÃ¢n váº­t",
  rarityColumn: "Äá»™ hiáº¿m",
  typeColumn: "Loáº¡i",
  poolColumn: "Banner",
  noGachaData: "KhÃ´ng tÃ¬m tháº¥y dá»¯ liá»‡u gacha.",
  perPageLabel: "Hiá»ƒn thá»‹",
  previousNews: "Tin trÆ°á»›c",
  nextNews: "Tin sau",
  translateIdle: "Dá»‹ch nhanh",
  translateActive: "Äang dá»‹ch",
  invalidUidError: "UID khÃ´ng há»£p lá»‡. Vui lÃ²ng kiá»ƒm tra láº¡i.",
  playerInfoMissing: "KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin Doctor.",
  connectionError: "KhÃ´ng thá»ƒ káº¿t ná»‘i tá»›i mÃ¡y chá»§. Vui lÃ²ng thá»­ láº¡i sau.",
  invalidCookieError: "Cookie khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n. Vui lÃ²ng thá»­ láº¡i.",
} as const;

export function GameUserPage() {
  const [uid, setUid] = useState("");
  const [userInfo, setUserInfo] = useState<{
    uid: string;
    name: string;
    level: number;
  } | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newsData, setNewsData] = useState<any[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [newsPage, setNewsPage] = useState(1);
  const [newsTotalPages, setNewsTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("characters");
  const [cookieToken, setCookieToken] = useState("");
  const [gachaData, setGachaData] = useState<any[] | null>(null);
  const [gachaAllData, setGachaAllData] = useState<any[] | null>(null);
  const [gachaStats, setGachaStats] = useState<{
    total: number;
    sixStar: number;
    fiveStar: number;
  } | null>(null);
  const [isGachaLoading, setIsGachaLoading] = useState(false);
  const [gachaAttempted, setGachaAttempted] = useState(false);
  const [gachaPage, setGachaPage] = useState(1);
  const [gachaTotalPages, setGachaTotalPages] = useState(1);
  const [gachaPageSize, setGachaPageSize] = useState(10);
  const [gachaTypeFilter, setGachaTypeFilter] = useState("all");
  const [showGachaSixStarOnly, setShowGachaSixStarOnly] = useState(false);
  const [tierListView, setTierListView] = useState("browse");
  const [tierAssignments, setTierAssignments] = useState<TierAssignmentMap>({});
  const [tierOrder, setTierOrder] = useState<string[]>([...DEFAULT_TIER_ORDER]);
  const [tierListName, setTierListName] = useState("");
  const [newTierName, setNewTierName] = useState("");
  const [savedTierLists, setSavedTierLists] = useState<SavedTierList[]>(
    DEFAULT_SAVED_TIER_LISTS,
  );
  const [selectedTierListId, setSelectedTierListId] = useState(
    DEFAULT_SAVED_TIER_LISTS[0]?.id ?? "",
  );
  const [tierSearch, setTierSearch] = useState("");
  const [tierStarFilter, setTierStarFilter] = useState("all");
  const [tierPoolPage, setTierPoolPage] = useState(1);
  const [operatorData, setOperatorData] = useState<OperatorRelease[]>([]);
  const [isOperatorLoading, setIsOperatorLoading] = useState(false);
  const [operatorError, setOperatorError] = useState("");
  const [operatorSearch, setOperatorSearch] = useState("");
  const [operatorStarFilter, setOperatorStarFilter] = useState("all");
  const [operatorPage, setOperatorPage] = useState(1);
  const [bannerData, setBannerData] = useState<BannerRelease[]>([]);
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [bannerError, setBannerError] = useState("");
  const [bannerSearch, setBannerSearch] = useState("");
  const [bannerPage, setBannerPage] = useState(1);
  const [currentSanityInput, setCurrentSanityInput] = useState("");
  const [sanitySnapshot, setSanitySnapshot] = useState<SanitySnapshot | null>(
    null,
  );
  const [nowTs, setNowTs] = useState(() => Date.now());

  const sanityCap = userInfo ? getGlobalSanityCap(userInfo.level) : 0;
  const currentSanity =
    sanitySnapshot && userInfo
      ? getRecoveredSanityValue(sanitySnapshot, sanityCap, nowTs)
      : null;
  const missingSanity =
    currentSanity !== null ? Math.max(0, sanityCap - currentSanity) : null;
  const recoveryMinutes =
    missingSanity !== null ? missingSanity * 6 : null;
  const combinedOperatorData = (() => {
    const releasedOperators = operatorData.filter((operator) =>
      operator.globalReleased,
    );
    const merged = new Map(
      releasedOperators.map((operator) => [operator.name, operator] as const),
    );
    const allOperatorLookup = new Map(
      operatorData.map((operator) => [operator.name, operator] as const),
    );
    const upcomingBanners = bannerData
      .filter((banner) => !banner.enStartDate && banner.cnStartDate)
      .sort((a, b) => {
        const aTs = parseIsoDate(a.cnStartDate) ?? a.releaseTs;
        const bTs = parseIsoDate(b.cnStartDate) ?? b.releaseTs;
        return aTs - bTs;
      });
    const releasedOperatorNames = new Set(releasedOperators.map((operator) => operator.name));
    const upcomingNewOperatorsByBanner = (() => {
      const seenOperators = new Set(releasedOperatorNames);
      const nextMap = new Map<string, Set<string>>();

      for (const banner of upcomingBanners) {
        const bannerNewOperators = new Set<string>();

        for (const operatorName of getNormalizedBannerOperatorNames(banner)) {
          if (!seenOperators.has(operatorName)) {
            bannerNewOperators.add(operatorName);
          }

          seenOperators.add(operatorName);
        }

        nextMap.set(getBannerKey(banner), bannerNewOperators);
      }

      return nextMap;
    })();

    for (const banner of upcomingBanners) {
      const bannerCnStartDate = banner.cnStartDate as string;
      const normalizedBannerOperators = [
        ...(upcomingNewOperatorsByBanner.get(getBannerKey(banner)) ?? []),
      ];

      for (const operatorName of normalizedBannerOperators) {
        const knownOperator = allOperatorLookup.get(operatorName);
        const isNewUpcomingOperator = !knownOperator?.globalReleased;
        const nextReleaseDate =
          knownOperator?.releaseDate ?? knownOperator?.cnReleaseDate ?? bannerCnStartDate;
        const nextReleaseTs =
          parseIsoDate(nextReleaseDate ?? null) ??
          parseIsoDate(bannerCnStartDate) ??
          banner.releaseTs;

        if (!isNewUpcomingOperator) {
          continue;
        }

        const existingOperator = merged.get(operatorName);
        if (existingOperator) {
          continue;
        }

        merged.set(operatorName, {
          cnReleaseDate: knownOperator?.cnReleaseDate ?? bannerCnStartDate,
          enReleaseDate: null,
          event: knownOperator?.event ?? banner.name,
          globalReleased: false,
          limited: knownOperator?.limited ?? banner.limited,
          name: operatorName,
          rarity: knownOperator?.rarity ?? "?",
          releaseDate: nextReleaseDate,
          releaseTs: nextReleaseTs,
        });
      }
    }

    return [...merged.values()];
  })();
  const releaseLagDays = getMedianLagDays(
    combinedOperatorData,
    (operator) => operator.cnReleaseDate,
    (operator) => operator.enReleaseDate,
    12,
  );
  const filteredOperators = [...combinedOperatorData]
    .sort((a, b) => {
      const aIsReleased = a.globalReleased;
      const bIsReleased = b.globalReleased;

      if (aIsReleased !== bIsReleased) {
        return aIsReleased ? 1 : -1;
      }

      const aSortTs = aIsReleased
        ? Date.parse(`${a.enReleaseDate ?? a.releaseDate}T00:00:00Z`)
        : Date.parse(`${a.cnReleaseDate ?? a.releaseDate}T00:00:00Z`);
      const bSortTs = bIsReleased
        ? Date.parse(`${b.enReleaseDate ?? b.releaseDate}T00:00:00Z`)
        : Date.parse(`${b.cnReleaseDate ?? b.releaseDate}T00:00:00Z`);

      return bSortTs - aSortTs;
    })
    .filter((operator) => {
      const keyword = operatorSearch.trim().toLowerCase();
      const rarityValue = getOperatorRarityValue(operator);
      const starMatches =
        operatorStarFilter === "all"
          ? true
          : rarityValue === Number(operatorStarFilter);

      if (!keyword) return starMatches;

      return starMatches && operator.name.toLowerCase().includes(keyword);
    });
  const bannerReleaseLagDays = getMedianLagDays(
    bannerData,
    (banner) => banner.cnStartDate,
    (banner) => banner.enStartDate,
    12,
  );
  const earliestReleasedBannerDateByOperator = (() => {
    const dates = new Map<string, string>();

    for (const banner of bannerData) {
      if (!banner.enStartDate) continue;

      for (const operatorName of getNormalizedBannerOperatorNames(banner)) {
        const existingDate = dates.get(operatorName);
        if (!existingDate || banner.enStartDate < existingDate) {
          dates.set(operatorName, banner.enStartDate);
        }
      }
    }

    return dates;
  })();
  const upcomingNewOperatorsByBanner = (() => {
    const releasedOperatorNames = new Set(
      operatorData
        .filter((operator) => operator.globalReleased)
        .map((operator) => operator.name),
    );
    const seenOperators = new Set(releasedOperatorNames);
    const nextMap = new Map<string, Set<string>>();
    const upcomingBanners = bannerData
      .filter((banner) => !banner.enStartDate && banner.cnStartDate)
      .sort((a, b) => {
        const aTs = parseIsoDate(a.cnStartDate) ?? a.releaseTs;
        const bTs = parseIsoDate(b.cnStartDate) ?? b.releaseTs;
        return aTs - bTs;
      });

    for (const banner of upcomingBanners) {
      const bannerNewOperators = new Set<string>();

      for (const operatorName of getNormalizedBannerOperatorNames(banner)) {
        if (!seenOperators.has(operatorName)) {
          bannerNewOperators.add(operatorName);
        }

        seenOperators.add(operatorName);
      }

      nextMap.set(getBannerKey(banner), bannerNewOperators);
    }

    return nextMap;
  })();
  const bannerPredictionMap = (() => {
    const predictions = new Map<string, string>();

    for (const banner of bannerData) {
      if (banner.enStartDate || !banner.cnStartDate) continue;

      const cnTs = parseIsoDate(banner.cnStartDate);
      if (cnTs === null) continue;

      const predictedDate = formatIsoDate(cnTs + bannerReleaseLagDays * DAY_MS);
      for (const operatorName of banner.operators) {
        if (isBannerArtifactName(operatorName)) continue;
        if (!predictions.has(operatorName)) {
          predictions.set(operatorName, predictedDate);
        }
      }
    }

    return predictions;
  })();
  const filteredBanners = [...bannerData]
    .sort((a, b) => {
      const aIsReleased = Boolean(a.enStartDate);
      const bIsReleased = Boolean(b.enStartDate);

      if (aIsReleased !== bIsReleased) {
        return aIsReleased ? 1 : -1;
      }

      const aSortTs = aIsReleased
        ? Date.parse(`${a.enStartDate ?? a.releaseDate}T00:00:00Z`)
        : Date.parse(`${a.cnStartDate ?? a.releaseDate}T00:00:00Z`);
      const bSortTs = bIsReleased
        ? Date.parse(`${b.enStartDate ?? b.releaseDate}T00:00:00Z`)
        : Date.parse(`${b.cnStartDate ?? b.releaseDate}T00:00:00Z`);

      return bSortTs - aSortTs;
    })
    .filter((banner) => {
      const keyword = bannerSearch.trim().toLowerCase();
      if (!keyword) return true;

      return getNormalizedBannerOperatorNames(banner).some((operatorName) =>
        operatorName.toLowerCase().includes(keyword),
      );
    });
  const activeGachaSource = showGachaSixStarOnly
    ? (gachaAllData ?? [])
    : (gachaData ?? []);
  const filteredGachaData = (() => {
    const entries =
      activeGachaSource.map((item: any, index: number) => ({
        index,
        item,
        starValue: Number.parseInt(String(item.star), 10) || 0,
      })) ?? [];

    const chronologicalEntries = [...entries].sort((a, b) => {
      const aTs = Date.parse(a.item.atStr);
      const bTs = Date.parse(b.item.atStr);

      if (Number.isNaN(aTs) || Number.isNaN(bTs)) {
        return b.index - a.index;
      }

      if (aTs === bTs) {
        return b.index - a.index;
      }

      return aTs - bTs;
    });

    let pityCount = 0;
    const pityByIndex = new Map<number, number>();

    for (const entry of chronologicalEntries) {
      pityCount += 1;

      if (entry.starValue === 6) {
        pityByIndex.set(entry.index, pityCount);
        pityCount = 0;
      }
    }

    return entries
      .filter((entry) =>
        gachaTypeFilter === "all"
          ? true
          : String(entry.item.typeName)
              .toLowerCase()
              .includes(gachaTypeFilter.toLowerCase()),
      )
      .filter((entry) => (showGachaSixStarOnly ? entry.starValue === 6 : true))
      .map((entry) => ({
        ...entry,
        pityCount: pityByIndex.get(entry.index) ?? null,
      }));
  })();
  const effectiveGachaPageSize = showGachaSixStarOnly ? 15 : gachaPageSize;
  const effectiveGachaTotalPages = showGachaSixStarOnly
    ? Math.max(1, Math.ceil(filteredGachaData.length / effectiveGachaPageSize))
    : gachaTotalPages;
  const paginatedGachaData = showGachaSixStarOnly
    ? filteredGachaData.slice(
        (gachaPage - 1) * effectiveGachaPageSize,
        gachaPage * effectiveGachaPageSize,
      )
    : filteredGachaData;
  const tierCandidates = [...combinedOperatorData]
    .filter((operator) =>
      operator.name.toLowerCase().includes(tierSearch.trim().toLowerCase()),
    )
    .filter((operator) => {
      if (tierStarFilter === "all") {
        return true;
      }

      return String(getOperatorRarityValue(operator) ?? "") === tierStarFilter;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const tierBoard = tierOrder.map((tier) => ({
    tier,
    operators: combinedOperatorData
      .filter((operator) => tierAssignments[operator.name] === tier)
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
  const unassignedTierCandidates = tierCandidates.filter(
    (operator) => !tierAssignments[operator.name],
  );
  const TIER_POOL_PAGE_SIZE = 30;
  const tierPoolTotalPages = Math.max(
    1,
    Math.ceil(unassignedTierCandidates.length / TIER_POOL_PAGE_SIZE),
  );
  const paginatedTierPoolCandidates = unassignedTierCandidates.slice(
    (tierPoolPage - 1) * TIER_POOL_PAGE_SIZE,
    tierPoolPage * TIER_POOL_PAGE_SIZE,
  );
  const operatorLookup = new Map(
    combinedOperatorData.map((operator) => [operator.name, operator] as const),
  );
  const unassignedOperatorCount = combinedOperatorData.filter(
    (operator) => !tierAssignments[operator.name],
  ).length;
  const selectedTierList =
    savedTierLists.find((tierList) => tierList.id === selectedTierListId) ??
    savedTierLists[0] ??
    null;
  const selectedTierBoard = selectedTierList
    ? selectedTierList.tiers.map((tier) => ({
        tier,
        operators: combinedOperatorData
          .filter((operator) => selectedTierList.assignments[operator.name] === tier)
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
    : [];
  const OPERATORS_PER_PAGE = 15;
  const operatorTotalPages = Math.max(
    1,
    Math.ceil(filteredOperators.length / OPERATORS_PER_PAGE),
  );
  const paginatedOperators = filteredOperators.slice(
    (operatorPage - 1) * OPERATORS_PER_PAGE,
    operatorPage * OPERATORS_PER_PAGE,
  );
  const BANNERS_PER_PAGE = 6;
  const bannerTotalPages = Math.max(
    1,
    Math.ceil(filteredBanners.length / BANNERS_PER_PAGE),
  );
  const paginatedBanners = filteredBanners.slice(
    (bannerPage - 1) * BANNERS_PER_PAGE,
    bannerPage * BANNERS_PER_PAGE,
  );

  const restoreSanitySnapshot = (
    targetUid: string,
    cap: number,
    fallbackValue?: number,
  ) => {
    const now = Date.now();
    try {
      const raw = localStorage.getItem(getSanityStorageKey(targetUid));
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SanitySnapshot>;
        if (
          typeof parsed?.value === "number" &&
          Number.isFinite(parsed.value) &&
          typeof parsed?.recordedAt === "number" &&
          Number.isFinite(parsed.recordedAt)
        ) {
          const normalized = normalizeSanitySnapshot(
            {
              recordedAt: parsed.recordedAt,
              value: clampSanityValue(parsed.value, cap),
            },
            cap,
            now,
          );
          setSanitySnapshot(normalized);
          setCurrentSanityInput(String(normalized.value));
          return;
        }
      }
    } catch (error) {
      console.error("Failed to restore sanity snapshot", error);
    }

    if (typeof fallbackValue === "number") {
      const initialSnapshot = {
        recordedAt: now,
        value: clampSanityValue(fallbackValue, cap),
      };
      setSanitySnapshot(initialSnapshot);
      setCurrentSanityInput(String(initialSnapshot.value));
    } else {
      setSanitySnapshot(null);
      setCurrentSanityInput("");
    }
  };

  const hydrateSanityFromInput = (nextValue: string) => {
    setCurrentSanityInput(nextValue);

    if (!userInfo || !nextValue.trim()) {
      setSanitySnapshot(null);
      return;
    }

    const parsedValue = Number(nextValue);
    if (!Number.isFinite(parsedValue)) {
      setSanitySnapshot(null);
      return;
    }

    setNowTs(Date.now());
    setSanitySnapshot({
      recordedAt: Date.now(),
      value: clampSanityValue(parsedValue, sanityCap),
    });
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTs(Date.now());
    }, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      setSanitySnapshot(null);
      setCurrentSanityInput("");
      return;
    }

    restoreSanitySnapshot(userInfo.uid, sanityCap, sanityCap);
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo || !sanitySnapshot) return;

    const displayValue = String(currentSanity ?? sanitySnapshot.value);
    if (currentSanityInput !== displayValue) {
      setCurrentSanityInput(displayValue);
    }
  }, [currentSanity, currentSanityInput, sanitySnapshot, userInfo]);

  useEffect(() => {
    if (!userInfo) return;

    if (!sanitySnapshot) {
      localStorage.removeItem(getSanityStorageKey(userInfo.uid));
      return;
    }

    const normalized = normalizeSanitySnapshot(sanitySnapshot, sanityCap, nowTs);
    localStorage.setItem(
      getSanityStorageKey(userInfo.uid),
      JSON.stringify(normalized),
    );
  }, [nowTs, sanityCap, sanitySnapshot, userInfo]);

  useEffect(() => {
    const fetchOperatorReleases = async () => {
      setIsOperatorLoading(true);
      setOperatorError("");

      try {
        const res = await fetch("/api/operators/releases");
        const result = await res.json();

        if (!res.ok) {
          setOperatorError(
            result.message || "Không thể tải danh sách character.",
          );
          setOperatorData([]);
          return;
        }

        setOperatorData(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Failed to fetch operator releases", error);
        setOperatorError("Không thể tải danh sách character.");
        setOperatorData([]);
      } finally {
        setIsOperatorLoading(false);
      }
    };

    void fetchOperatorReleases();
  }, []);

  useEffect(() => {
    const fetchBannerReleases = async () => {
      setIsBannerLoading(true);
      setBannerError("");

      try {
        const res = await fetch("/api/banners/releases");
        const result = await res.json();

        if (!res.ok) {
          setBannerError(result.message || "Không thể tải danh sách banner.");
          setBannerData([]);
          return;
        }

        setBannerData(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Failed to fetch banner releases", error);
        setBannerError("Không thể tải danh sách banner.");
        setBannerData([]);
      } finally {
        setIsBannerLoading(false);
      }
    };

    void fetchBannerReleases();
  }, []);

  useEffect(() => {
    setOperatorPage(1);
  }, [operatorSearch, operatorStarFilter]);

  useEffect(() => {
    setBannerPage(1);
  }, [bannerSearch]);

  useEffect(() => {
    setTierPoolPage(1);
  }, [tierSearch, tierStarFilter]);

  useEffect(() => {
    if (operatorPage > operatorTotalPages) {
      setOperatorPage(operatorTotalPages);
    }
  }, [operatorPage, operatorTotalPages]);

  useEffect(() => {
    if (tierPoolPage > tierPoolTotalPages) {
      setTierPoolPage(tierPoolTotalPages);
    }
  }, [tierPoolPage, tierPoolTotalPages]);

  useEffect(() => {
    if (bannerPage > bannerTotalPages) {
      setBannerPage(bannerTotalPages);
    }
  }, [bannerPage, bannerTotalPages]);

  useEffect(() => {
    if (userInfo) {
      const fetchNews = async () => {
        setIsNewsLoading(true);
        try {
          const res = await fetch(
            `/api/yostar/game/news?key=ark&index=${newsPage}&size=1`,
          );
          const result = await res.json();
          if (result.code === 0 && result.data && result.data.rows) {
            setNewsData(result.data.rows);
            if (result.data.count) {
              setNewsTotalPages(result.data.count);
            }
          }
        } catch (error) {
          console.error("Failed to fetch news", error);
        } finally {
          setIsNewsLoading(false);
        }
      };
      fetchNews();
      return;
    }

    const fetchNews = async () => {
      setIsNewsLoading(true);
      try {
        const res = await fetch(
          `/api/yostar/game/news?key=ark&index=${newsPage}&size=1`,
        );
        const result = await res.json();
        if (result.code === 0 && result.data && result.data.rows) {
          setNewsData(result.data.rows);
          if (result.data.count) {
            setNewsTotalPages(result.data.count);
          }
        }
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setIsNewsLoading(false);
      }
    };

    fetchNews();
  }, [userInfo, newsPage]);

  const lookupUserInfo = async (
    targetUid: string,
    options?: { showLoading?: boolean },
  ) => {
    if (!targetUid.trim()) return;

    const shouldShowLoading = options?.showLoading ?? true;
    if (shouldShowLoading) {
      setIsLoading(true);
    }

    setSearchAttempted(true);
    setErrorMessage("");
    setUserInfo(null);
    setNewsPage(1);
    setNewsData([]);

    try {
      const res = await fetch(`/api/arknights/gift/playerinfo?uid=${targetUid}`);
      const result = await res.json();
      if (result.code === 0 && result.data) {
        setUserInfo({
          uid: result.data.uid,
          name: result.data.nickname,
          level: result.data.level,
        });
        setUid(result.data.uid);
        localStorage.setItem("arknights_uid", result.data.uid);
      } else {
        if (result.message === "Incorrect User ID") {
          setErrorMessage(
            "UID không hợp lệ. Vui lòng kiểm tra lại.",
          );
        } else {
          setErrorMessage(
            result.message || "Không tìm thấy thông tin Doctor.",
          );
        }
      }
    } catch (error) {
      setErrorMessage("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
      console.log(error);
    } finally {
      if (shouldShowLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const savedUid = localStorage.getItem("arknights_uid");
    const savedCookie = localStorage.getItem("arknights_cookie");
    if (savedCookie) setCookieToken(savedCookie);
    const savedTierDraft = localStorage.getItem(TIER_DRAFT_KEY);
    if (savedTierDraft) {
      try {
        const parsed = JSON.parse(savedTierDraft) as {
          assignments?: unknown;
          name?: string;
          tiers?: unknown;
        };
        const nextAssignments = normalizeTierAssignments(parsed.assignments);
        setTierAssignments(nextAssignments);
        setTierListName(parsed.name ?? "");
        setTierOrder(resolveTierOrder(parsed.tiers, nextAssignments));
      } catch (error) {
        console.error(error);
      }
    }
    const savedTierListsRaw = localStorage.getItem(TIER_LISTS_KEY);
    if (savedTierListsRaw) {
      try {
        const parsed = JSON.parse(savedTierListsRaw) as unknown[];
        const hydratedTierLists = Array.isArray(parsed)
          ? parsed
              .map((tierList) => hydrateSavedTierList(tierList))
              .filter((tierList): tierList is SavedTierList => tierList !== null)
          : [];
        const mergedTierLists = mergeDefaultTierLists(hydratedTierLists);
        setSavedTierLists(mergedTierLists);
        if (mergedTierLists[0]) {
          setSelectedTierListId(mergedTierLists[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (DEFAULT_SAVED_TIER_LISTS[0]) {
      setSavedTierLists(DEFAULT_SAVED_TIER_LISTS);
      setSelectedTierListId(DEFAULT_SAVED_TIER_LISTS[0].id);
    }
    if (!savedUid) return;

    setUid(savedUid);
    void lookupUserInfo(savedUid, { showLoading: false });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      TIER_DRAFT_KEY,
      JSON.stringify({
        assignments: tierAssignments,
        name: tierListName,
        tiers: tierOrder,
      }),
    );
  }, [tierAssignments, tierListName, tierOrder]);

  useEffect(() => {
    localStorage.setItem(TIER_LISTS_KEY, JSON.stringify(savedTierLists));
  }, [savedTierLists]);

  useEffect(() => {
    setGachaPage(1);

    if (!gachaAttempted || !cookieToken.trim()) {
      return;
    }

    void handleSearchGacha(1, showGachaSixStarOnly ? 15 : gachaPageSize);
  }, [showGachaSixStarOnly]);

  useEffect(() => {
    if (gachaPage > effectiveGachaTotalPages) {
      setGachaPage(effectiveGachaTotalPages);
    }
  }, [gachaPage, effectiveGachaTotalPages]);

  const handleSearch = async () => {
    await lookupUserInfo(uid, { showLoading: true });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddTier = () => {
    const trimmedTierName = newTierName.trim();
    if (!trimmedTierName) {
      setErrorMessage("Vui lòng nhập tên tier trước khi thêm.");
      return;
    }

    const hasDuplicateTier = tierOrder.some(
      (tier) => tier.toLowerCase() === trimmedTierName.toLowerCase(),
    );
    if (hasDuplicateTier) {
      setErrorMessage("Tier này đã tồn tại.");
      return;
    }

    setTierOrder((current) => [...current, trimmedTierName]);
    setNewTierName("");
    setErrorMessage("");
  };

  const handleDeleteTier = (tierToDelete: string) => {
    if (tierOrder.length <= 1) {
      setErrorMessage("Cần giữ lại ít nhất 1 tier.");
      return;
    }

    setTierOrder((current) => current.filter((tier) => tier !== tierToDelete));
    setTierAssignments((current) =>
      Object.fromEntries(
        Object.entries(current).map(([operatorName, assignedTier]) => [
          operatorName,
          assignedTier === tierToDelete ? "" : assignedTier,
        ]),
      ),
    );
    setErrorMessage("");
  };

  const handleMoveTier = (tierIndex: number, direction: -1 | 1) => {
    const nextIndex = tierIndex + direction;
    if (nextIndex < 0 || nextIndex >= tierOrder.length) {
      return;
    }

    setTierOrder((current) => {
      const nextOrder = [...current];
      const [movedTier] = nextOrder.splice(tierIndex, 1);
      nextOrder.splice(nextIndex, 0, movedTier);
      return nextOrder;
    });
  };

  const handleAssignOperatorToTier = (operatorName: string, nextTier: string) => {
    setTierAssignments((current) => ({
      ...current,
      [operatorName]: nextTier,
    }));
    setErrorMessage("");
  };

  const handleSaveTierList = () => {
    const trimmedName = tierListName.trim();
    if (!trimmedName) {
      setErrorMessage("Vui lòng nhập tên tier list trước khi lưu.");
      return;
    }

    const nextTierList: SavedTierList = {
      assignments: tierAssignments,
      createdAt: Date.now(),
      id: `${Date.now()}`,
      name: trimmedName,
      tiers: [...tierOrder],
    };

    setSavedTierLists((current) => [nextTierList, ...current]);
    setSelectedTierListId(nextTierList.id);
    setTierListView("browse");
    setErrorMessage("");
  };

  const handleOpenSavedTierList = (tierList: SavedTierList) => {
    setSelectedTierListId(tierList.id);
  };

  const handleLoadSavedTierListToEditor = (tierList: SavedTierList) => {
    setTierAssignments(tierList.assignments);
    setTierListName(tierList.name);
    setTierOrder([...tierList.tiers]);
    setTierListView("create");
  };

  const handleDeleteSavedTierList = (id: string) => {
    setSavedTierLists((current) => current.filter((tierList) => tierList.id !== id));
    setSelectedTierListId((current) => (current === id ? "" : current));
  };

  const fetchGachaPageData = async (page: number, size: number) => {
    const res = await fetch(
      `/api/gacha?token=${encodeURIComponent(cookieToken)}&index=${page}&size=${size}`,
    );

    return res.json();
  };

  const fetchAllGachaData = async () => {
    const batchSize = 100;
    const firstPage = await fetchGachaPageData(1, batchSize);

    if (firstPage.code !== 0 || !firstPage.data?.rows) {
      return firstPage;
    }

    const total = firstPage.data.count || firstPage.data.rows.length;
    const totalPages = Math.max(1, Math.ceil(total / batchSize));
    const allRows = [...firstPage.data.rows];

    for (let page = 2; page <= totalPages; page += 1) {
      const pageResult = await fetchGachaPageData(page, batchSize);
      if (pageResult.code !== 0 || !pageResult.data?.rows) {
        return pageResult;
      }

      allRows.push(...pageResult.data.rows);
    }

    return {
      code: 0,
      data: {
        count: total,
        rows: allRows,
      },
    };
  };

  const handleSearchGacha = async (page: number = 1, size?: number) => {
    setGachaAttempted(true);
    if (!cookieToken.trim()) return;

    const pageSize = size ?? gachaPageSize;
    setIsGachaLoading(true);
    setErrorMessage("");
    try {
      const result = showGachaSixStarOnly
        ? await fetchAllGachaData()
        : await fetchGachaPageData(page, pageSize);
      if (result.code === 0 && result.data?.rows) {
        localStorage.setItem("arknights_cookie", cookieToken);
        if (showGachaSixStarOnly) {
          setGachaAllData(result.data.rows);
          setGachaPage(1);
          setGachaTotalPages(1);
        } else {
          setGachaData(result.data.rows);
          setGachaPage(page);
        }
        const total = result.data.count || result.data.rows.length;
        if (!showGachaSixStarOnly) {
          setGachaTotalPages(Math.ceil(total / pageSize));
        }
        const stats = {
          total,
          sixStar: result.data.rows.filter((r: any) => r.star === "6\u661f")
            .length,
          fiveStar: result.data.rows.filter((r: any) => r.star === "5\u661f")
            .length,
        };
        setGachaStats(stats);
      } else {
        setGachaData(null);
        setGachaAllData(null);
        setErrorMessage(result.message || "Failed to fetch gacha data");
      }
    } catch (e) {
      console.error(e);
      setGachaData(null);
      setGachaAllData(null);
    } finally {
      setIsGachaLoading(false);
    }
  };

  const handleGachaPageChange = (page: number) => {
    if (showGachaSixStarOnly) {
      setGachaPage(page);
      return;
    }

    handleSearchGacha(page);
  };

  const handleGachaSizeChange = (newSize: number) => {
    if (showGachaSixStarOnly) {
      return;
    }

    setGachaPageSize(newSize);
    handleSearchGacha(1, newSize);
  };

  const handleGachaKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchGacha(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-300/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-300/40 rounded-full blur-[100px] pointer-events-none" />

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.4)); }
          50% { filter: drop-shadow(0 0 30px rgba(34, 211, 238, 0.8)); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
          border: 1px solid rgba(34, 211, 238, 0.6);
          box-shadow: 0 20px 40px -10px rgba(34, 211, 238, 0.4), 0 0 20px rgba(34, 211, 238, 0.2);
          transform: translateY(-4px);
        }
        .gradient-text { 
          background: linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #c026d3 100%); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
        }
        .btn-primary {
          background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
          background-size: 200% auto;
          transition: 0.5s;
          border: 1px solid rgba(255,255,255,0.4);
        }
        .btn-primary:hover {
          background-position: right center;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
          border-color: rgba(255,255,255,0.8);
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Gamepad2 className="w-12 h-12 text-cyan-500 animate-pulse-glow animate-float" />
            <h1 className="text-5xl md:text-7xl font-black gradient-text tracking-tight">
              Arknights Tracker
            </h1>
            <Crown
              className="w-12 h-12 text-purple-500 animate-pulse-glow animate-float"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Tra cứu tài khoản, theo dõi tin tức và kiểm tra lịch sử gacha Arknights.
          </p>
        </div>

        {/* UID Search Section */}
        <Card className="mb-8 glass-card animate-fade-in stagger-1 border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800 flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-cyan-100 rounded-lg border border-cyan-200">
                <Search className="w-6 h-6 text-cyan-600" />
              </div>
              <span>Tra cứu tài khoản</span>
            </CardTitle>
            <CardDescription className="text-slate-500 text-base">
              Nhập UID để lấy thông tin Doctor và mở các công cụ liên quan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  placeholder="Nhập UID của bạn"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 pl-10 h-12 text-lg rounded-xl transition-all"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="btn-primary text-white px-8 h-12 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Tra cứu</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Info Display */}
        {searchAttempted && userInfo ? (
          <Card className="mb-8 glass-card animate-fade-in border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-300/20 rounded-full blur-[80px] pointer-events-none" />
            <CardHeader className="pb-2 border-b border-slate-100 bg-white/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-200">
                    <Crown className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-xl">Hồ sơ Doctor</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 hover:border-cyan-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Shield className="w-24 h-24 text-cyan-600" />
                  </div>
                  <p className="text-slate-500 text-sm mb-2 font-semibold tracking-widest uppercase">
                    UID
                  </p>
                  <p className="text-cyan-600 text-3xl font-black font-mono tracking-tight">
                    {userInfo.uid}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 hover:border-indigo-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Sword className="w-24 h-24 text-indigo-600" />
                  </div>
                  <p className="text-slate-500 text-sm mb-2 font-semibold tracking-widest uppercase">
                    Tên hiển thị
                  </p>
                  <p className="text-indigo-600 text-3xl font-black tracking-tight">
                    {userInfo.name}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 hover:border-purple-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Trophy className="w-24 h-24 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase">
                      Cấp Doctor
                    </p>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                  </div>
                  <p className="text-purple-600 text-3xl font-black tracking-tight">
                    Lv. {userInfo.level}
                  </p>
                </div>
                <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 hover:border-amber-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Zap className="w-24 h-24 text-amber-500" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase">
                      Sanity tối đa
                    </p>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-amber-600 text-3xl font-black tracking-tight">
                    {sanityCap}
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Tính theo mốc Global hiện tại
                  </p>
                </div>
              </div>

              <Separator className="my-6 bg-slate-200/80" />

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6">
                <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h3 className="text-slate-800 font-bold text-lg">
                      Máy tính sanity
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">
                    Nhập lượng sanity hiện tại để tính số còn thiếu và
                    thời gian hồi đầy với tốc độ 1 sanity mỗi 6 phút.
                  </p>
                  <Input
                    type="number"
                    min={0}
                    max={sanityCap}
                    inputMode="numeric"
                    value={currentSanityInput}
                    onChange={(e) => hydrateSanityFromInput(e.target.value)}
                    placeholder={`Nhập sanity hiện tại (0 - ${sanityCap})`}
                    className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 h-12 text-lg rounded-xl"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Nếu nhập vượt giới hạn, hệ thống sẽ tự giới hạn về {sanityCap}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-2">
                      Sanity hiện tại
                    </p>
                    <p className="text-slate-800 text-3xl font-black tracking-tight">
                      {currentSanity !== null ? currentSanity : "--"}
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-2">
                      Còn thiếu
                    </p>
                    <p className="text-rose-500 text-3xl font-black tracking-tight">
                      {missingSanity !== null ? missingSanity : "--"}
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase mb-2">
                      Đầy sau
                    </p>
                    <p className="text-emerald-600 text-2xl font-black tracking-tight">
                      {recoveryMinutes !== null
                        ? formatRecoveryDuration(recoveryMinutes)
                        : "--"}
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      {recoveryMinutes !== null
                        ? recoveryMinutes === 0
                          ? "Đã đầy"
                          : `Đầy lúc ${formatRecoveryDateTime(recoveryMinutes)}`
                        : "Nhập sanity để bắt đầu tính"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : errorMessage ? (
          <Alert className="mb-8 border-red-200 bg-red-50 backdrop-blur-md text-red-800 rounded-xl animate-fade-in shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2 font-medium text-base">
              {errorMessage}
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Main Content Tabs */}
        <div className="animate-fade-in stagger-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white/70 backdrop-blur-xl border border-slate-200/80 p-1.5 rounded-2xl shadow-sm mb-6 h-auto gap-1.5">
                <TabsTrigger
                  value="characters"
                  className="py-3 text-slate-500 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Characters
                </TabsTrigger>
                <TabsTrigger
                  value="banners"
                  className="py-3 text-slate-500 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700 data-[state=active]:border-sky-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                >
                  <GalleryHorizontal className="w-5 h-5 mr-2" />
                  Banners
                </TabsTrigger>
                <TabsTrigger
                  value="tierlist"
                  className="py-3 text-slate-500 data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 data-[state=active]:border-rose-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Tier List
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="py-3 text-slate-500 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700 data-[state=active]:border-cyan-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Tin tức
                </TabsTrigger>
                <TabsTrigger
                  value="gacha"
                  className="py-3 text-slate-500 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                >
                  <Diamond className="w-5 h-5 mr-2" />
                  Gacha
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="characters"
                className="mt-0 focus-visible:outline-none space-y-6"
              >
                <Card className="glass-card border-0 shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
                  <CardHeader className="pb-4 bg-white/30 border-b border-slate-100">
                    <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                      <div className="p-2 bg-emerald-100 rounded-lg border border-emerald-200">
                        <Users className="w-6 h-6 text-emerald-600" />
                      </div>
                      Characters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                      <div className="flex flex-col md:flex-row gap-3 flex-1 max-w-3xl">
                        <div className="relative flex-1 max-w-xl">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                          </div>
                          <Input
                            placeholder="Tìm theo tên"
                            value={operatorSearch}
                            onChange={(e) => setOperatorSearch(e.target.value)}
                            className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 pl-10 h-12 text-base rounded-xl"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["all", "6", "5", "4", "3", "2", "1"].map((starValue) => (
                            <Button
                              key={starValue}
                              type="button"
                              variant={operatorStarFilter === starValue ? "default" : "outline"}
                              size="sm"
                              onClick={() => setOperatorStarFilter(starValue)}
                              className={
                                operatorStarFilter === starValue
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                                  : "rounded-lg border-slate-200 text-slate-600"
                              }
                            >
                              {starValue === "all" ? "Tất cả" : `${starValue}★`}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                        <Badge
                          variant="outline"
                          className="bg-white border-slate-200 text-slate-600"
                        >
                          {filteredOperators.length} character
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white border-slate-200 text-slate-600"
                        >
                          Trang {operatorPage}/{operatorTotalPages}
                        </Badge>
                      </div>
                    </div>

                    {isOperatorLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                        <p className="text-slate-500 font-medium">
                          Đang tải danh sách character...
                        </p>
                      </div>
                    ) : operatorError ? (
                      <Alert className="border-red-200 bg-red-50 text-red-800 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <AlertDescription className="ml-2 font-medium text-base">
                          {operatorError}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {paginatedOperators.map((operator) => {
                            const rarity = getOperatorRarityValue(operator) ?? 0;
                            const isSixStar = rarity === 6;
                            const isFiveStar = rarity === 5;
                            const isReleased = operator.globalReleased;
                            const globalReleaseLabel = formatDisplayDate(
                              operator.enReleaseDate ?? operator.releaseDate,
                            );

                            return (
                              <Card
                                key={`${operator.name}-${operator.releaseDate}`}
                                className="border border-slate-200 bg-white/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                title={operator.event}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-2 mb-3">
                                    <Badge
                                      className={
                                        isReleased
                                          ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                          : "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-100"
                                      }
                                    >
                                      {isReleased
                                        ? globalReleaseLabel ?? "Đã ra"
                                        : "Chưa ra"}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={
                                        operator.limited
                                          ? "bg-rose-100 text-rose-700 border-rose-200"
                                          : "bg-slate-50 border-slate-200 text-slate-500"
                                      }
                                    >
                                      {operator.limited ? "Limited" : "Thường"}
                                    </Badge>
                                  </div>

                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border border-slate-100 shadow-sm mb-3">
                                      <img
                                        src={`https://arknights.wiki.gg/images/${getWikiImageName(operator.name)}_icon.png`}
                                        alt={operator.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    </div>

                                    <p className="font-bold text-slate-800 leading-tight min-h-[2.5rem] flex items-center">
                                      {operator.name}
                                    </p>

                                    <div className="flex items-center gap-0.5 mt-2 mb-3">
                                      {Array.from({
                                        length: Number.isFinite(rarity)
                                          ? rarity
                                          : 0,
                                      }).map((_, starIndex) => (
                                        <Star
                                          key={starIndex}
                                          className={`w-3.5 h-3.5 ${
                                            isSixStar
                                              ? "fill-orange-500 text-orange-500"
                                              : isFiveStar
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "fill-slate-400 text-slate-400"
                                          }`}
                                        />
                                      ))}
                                    </div>

                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        {filteredOperators.length > 0 && (
                          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={operatorPage <= 1}
                              onClick={() => setOperatorPage(1)}
                              className="rounded-lg"
                            >
                              «
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={operatorPage <= 1}
                              onClick={() =>
                                setOperatorPage((page) => Math.max(1, page - 1))
                              }
                              className="rounded-lg"
                            >
                              ‹
                            </Button>
                            <Badge
                              variant="outline"
                              className="bg-white border-slate-200 text-slate-600 px-3 py-1.5"
                            >
                              Trang {operatorPage} / {operatorTotalPages}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={operatorPage >= operatorTotalPages}
                              onClick={() =>
                                setOperatorPage((page) =>
                                  Math.min(operatorTotalPages, page + 1),
                                )
                              }
                              className="rounded-lg"
                            >
                              ›
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={operatorPage >= operatorTotalPages}
                              onClick={() => setOperatorPage(operatorTotalPages)}
                              className="rounded-lg"
                            >
                              »
                            </Button>
                          </div>
                        )}
                        {filteredOperators.length === 0 && (
                          <div className="p-8 text-center text-slate-500">
                            Không có character nào khớp với từ khóa tìm kiếm.
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="banners"
                className="mt-0 focus-visible:outline-none space-y-6"
              >
                <Card className="glass-card border-0 shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
                  <CardHeader className="pb-4 bg-white/30 border-b border-slate-100">
                    <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                      <div className="p-2 bg-sky-100 rounded-lg border border-sky-200">
                        <GalleryHorizontal className="w-6 h-6 text-sky-600" />
                      </div>
                      Banners
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                      <div className="relative flex-1 max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          placeholder="Tìm character có trong banner"
                          value={bannerSearch}
                          onChange={(e) => setBannerSearch(e.target.value)}
                          className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-400/20 pl-10 h-12 text-base rounded-xl"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                        <Badge
                          variant="outline"
                          className="bg-white border-slate-200 text-slate-600"
                        >
                          {filteredBanners.length} banner
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white border-slate-200 text-slate-600"
                        >
                          Trang {bannerPage}/{bannerTotalPages}
                        </Badge>
                      </div>
                    </div>

                    {isBannerLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                        <p className="text-slate-500 font-medium">
                          Đang tải danh sách banner...
                        </p>
                      </div>
                    ) : bannerError ? (
                      <Alert className="border-red-200 bg-red-50 text-red-800 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <AlertDescription className="ml-2 font-medium text-base">
                          {bannerError}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {paginatedBanners.map((banner) => {
                            const isReleased = Boolean(banner.enStartDate);
                            const visibleBannerOperators =
                              getNormalizedBannerOperatorNames(banner);
                            const estimatedReleaseDate =
                              !isReleased && banner.cnStartDate
                                ? formatIsoDate(
                                    parseIsoDate(banner.cnStartDate)! +
                                      bannerReleaseLagDays * DAY_MS,
                                  )
                                : null;

                            return (
                              <Card
                                key={`${banner.name}-${banner.releaseDate}`}
                                className="border border-slate-200 bg-white/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                title={banner.name}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-2 mb-3">
                                    <Badge
                                      className={
                                        isReleased
                                          ? "bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100"
                                          : "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-100"
                                      }
                                    >
                                      {isReleased
                                        ? formatDisplayDate(banner.enStartDate) ?? "Đã ra"
                                        : "Chưa ra"}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={
                                        banner.limited
                                          ? "bg-rose-100 text-rose-700 border-rose-200"
                                          : "bg-slate-50 border-slate-200 text-slate-500"
                                      }
                                    >
                                      {banner.limited ? "Limited" : banner.category}
                                    </Badge>
                                  </div>

                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-full mb-3">
                                      {banner.bannerImageUrl ? (
                                        <div className="rounded-2xl overflow-hidden border border-sky-200 shadow-sm bg-slate-100">
                                          <img
                                            src={banner.bannerImageUrl}
                                            alt={banner.name}
                                            className="w-full aspect-[16/9] object-cover"
                                            onError={(e) => {
                                              e.currentTarget.style.display =
                                                "none";
                                            }}
                                          />
                                        </div>
                                      ) : visibleBannerOperators.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                          {visibleBannerOperators.map((operatorName) => (
                                              <div
                                                key={`${banner.name}-${operatorName}`}
                                                className="w-14 h-14 mx-auto rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm"
                                              >
                                                <img
                                                  src={`https://arknights.wiki.gg/images/${getWikiImageName(operatorName)}_icon.png`}
                                                  alt={operatorName}
                                                  className="w-full h-full object-cover"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display =
                                                      "none";
                                                  }}
                                                />
                                              </div>
                                            ))}
                                        </div>
                                      ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 border border-sky-200 shadow-sm mx-auto flex items-center justify-center">
                                          <GalleryHorizontal className="w-9 h-9 text-sky-600" />
                                        </div>
                                      )}
                                    </div>

                                    <p className="font-bold text-slate-800 leading-tight min-h-[3rem] flex items-center">
                                      {visibleBannerOperators.length} character
                                    </p>

                                    {visibleBannerOperators.length > 0 && (
                                      <div className="w-full mt-3 grid grid-cols-2 gap-2">
                                        {visibleBannerOperators.map((operatorName) => (
                                          (() => {
                                            const isNewOperator = banner.enStartDate
                                              ? earliestReleasedBannerDateByOperator.get(
                                                  operatorName,
                                                ) === banner.enStartDate
                                              : upcomingNewOperatorsByBanner
                                                  .get(getBannerKey(banner))
                                                  ?.has(operatorName) ?? false;

                                            return (
                                          <div
                                            key={`${banner.name}-list-${operatorName}`}
                                            className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-2 py-1.5"
                                          >
                                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                                              <img
                                                src={`https://arknights.wiki.gg/images/${getWikiImageName(operatorName)}_icon.png`}
                                                alt={operatorName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.style.display =
                                                    "none";
                                                }}
                                              />
                                            </div>
                                            <div className="min-w-0 flex-1 text-left">
                                              <span className="text-[11px] text-slate-600 leading-tight line-clamp-2 block">
                                                {operatorName}
                                              </span>
                                              {isNewOperator && (
                                                <span className="text-[10px] font-bold text-emerald-600">
                                                  NEW
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                            );
                                          })()
                                        ))}
                                      </div>
                                    )}

                                    {!isReleased && estimatedReleaseDate && (
                                      <p className="text-[11px] text-amber-600 mt-2 font-medium">
                                        Dự đoán: {formatDisplayDate(estimatedReleaseDate)}
                                      </p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        {filteredBanners.length > 0 && (
                          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={bannerPage <= 1}
                              onClick={() => setBannerPage(1)}
                              className="rounded-lg"
                            >
                              «
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={bannerPage <= 1}
                              onClick={() =>
                                setBannerPage((page) => Math.max(1, page - 1))
                              }
                              className="rounded-lg"
                            >
                              ‹
                            </Button>
                            <Badge
                              variant="outline"
                              className="bg-white border-slate-200 text-slate-600 px-3 py-1.5"
                            >
                              Trang {bannerPage} / {bannerTotalPages}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={bannerPage >= bannerTotalPages}
                              onClick={() =>
                                setBannerPage((page) =>
                                  Math.min(bannerTotalPages, page + 1),
                                )
                              }
                              className="rounded-lg"
                            >
                              ›
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={bannerPage >= bannerTotalPages}
                              onClick={() => setBannerPage(bannerTotalPages)}
                              className="rounded-lg"
                            >
                              »
                            </Button>
                          </div>
                        )}
                        {filteredBanners.length === 0 && (
                          <div className="p-8 text-center text-slate-500">
                            Không có banner nào khớp với từ khóa tìm kiếm.
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="tierlist"
                className="mt-0 focus-visible:outline-none space-y-6"
              >
                <Card className="glass-card border-0 shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-orange-500 to-amber-400" />
                  <CardHeader className="pb-4 bg-white/30 border-b border-slate-100">
                    <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                      <div className="p-2 bg-rose-100 rounded-lg border border-rose-200">
                        <Trophy className="w-6 h-6 text-rose-600" />
                      </div>
                      Tier List
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant={tierListView === "browse" ? "default" : "outline"}
                        onClick={() => setTierListView("browse")}
                        className={
                          tierListView === "browse"
                            ? "bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                            : "rounded-xl border-slate-200 text-slate-600"
                        }
                      >
                        Xem tier list
                      </Button>
                      <Button
                        type="button"
                        variant={tierListView === "create" ? "default" : "outline"}
                        onClick={() => setTierListView("create")}
                        className={
                          tierListView === "create"
                            ? "bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                            : "rounded-xl border-slate-200 text-slate-600"
                        }
                      >
                        Tự tạo
                      </Button>
                    </div>

                    {tierListView === "browse" ? (
                      <div className="space-y-4">
                        {savedTierLists.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                            {savedTierLists.map((tierList) => (
                              <button
                                key={tierList.id}
                                type="button"
                                onClick={() => handleOpenSavedTierList(tierList)}
                                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                                  selectedTierList?.id === tierList.id
                                    ? "border-rose-300 bg-rose-50/80 shadow-sm"
                                    : "border-slate-200 bg-white/80"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">
                                      {tierList.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                      {new Date(tierList.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-500">
                            Chưa có tier list nào để xem.
                          </div>
                        )}

                        <div className="space-y-3">
                          {selectedTierList ? (
                            <>
                              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                                <p className="text-lg font-bold text-slate-800">
                                  {selectedTierList.name}
                                </p>
                              </div>
                              {selectedTierBoard.map(({ tier, operators }) => (
                                <div
                                  key={`selected-tier-board-${tier}`}
                                  className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm overflow-hidden"
                                >
                                  <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                                    <Badge className={getTierBadgeClassName(tier)}>
                                      {tier}
                                    </Badge>
                                    <span className="text-sm text-slate-500">
                                      {operators.length} character
                                    </span>
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
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-500">
                              Chọn một tier list ở trên để xem.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-slate-800">
                              Tierlist đã tạo
                            </p>
                            <p className="text-xs text-slate-400">
                              Chọn để sửa, xem hoặc xóa.
                            </p>
                          </div>
                          {savedTierLists.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                              {savedTierLists.map((tierList) => (
                                <div
                                  key={`create-tier-list-${tierList.id}`}
                                  className="rounded-2xl border border-slate-200 bg-white p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="truncate font-semibold text-slate-800">
                                        {tierList.name}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-400">
                                        {new Date(tierList.createdAt).toLocaleDateString("vi-VN")}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleOpenSavedTierList(tierList)}
                                        className="rounded-lg border-slate-200 text-slate-600"
                                      >
                                        Xem
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleLoadSavedTierListToEditor(tierList)}
                                        className="rounded-lg border-slate-200 text-slate-600"
                                      >
                                        Sửa
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteSavedTierList(tierList.id)}
                                        className="rounded-lg border-red-200 text-red-600"
                                      >
                                        Xóa
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-400">
                              Chưa có tierlist nào đã lưu.
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col xl:flex-row gap-3">
                          <Input
                            placeholder="Đặt tên tier list"
                            value={tierListName}
                            onChange={(e) => setTierListName(e.target.value)}
                            className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20 h-12 text-base rounded-xl xl:max-w-[320px]"
                          />
                          <Input
                            placeholder="Tạo tier mới, ví dụ SS hoặc Meme"
                            value={newTierName}
                            onChange={(e) => setNewTierName(e.target.value)}
                            className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20 h-12 text-base rounded-xl xl:max-w-[320px]"
                          />
                          <Button
                            type="button"
                            onClick={handleAddTier}
                            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                          >
                            <Plus className="size-4" />
                            Thêm tier
                          </Button>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-3">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                              placeholder="Tìm character để xếp tier"
                              value={tierSearch}
                              onChange={(e) => setTierSearch(e.target.value)}
                              className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:ring-rose-400/20 pl-10 h-12 text-base rounded-xl"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleSaveTierList}
                            className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                          >
                            Lưu tier list
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setTierAssignments({})}
                            className="rounded-xl border-slate-200 text-slate-600"
                          >
                            Xóa xếp hạng
                          </Button>
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
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDeleteTier(tier)}
                                disabled={tierOrder.length <= 1}
                                className="rounded-full text-rose-500 hover:text-rose-600"
                                aria-label={`Xóa tier ${tier}`}
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                Pool character
                              </p>
                              <p className="text-xs text-slate-400">
                                Bấm avatar để chọn tier ngay tại chỗ.
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="rounded-full border-slate-200 text-slate-500"
                            >
                              {unassignedOperatorCount} chưa xếp
                            </Badge>
                          </div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            {["all", "6", "5", "4", "3", "2", "1"].map((starValue) => (
                              <Button
                                key={`tier-star-filter-${starValue}`}
                                type="button"
                                variant={
                                  tierStarFilter === starValue ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setTierStarFilter(starValue)}
                                className={
                                  tierStarFilter === starValue
                                    ? "bg-rose-500 hover:bg-rose-600 text-white rounded-lg"
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
                                    onAssign={(tier) =>
                                      handleAssignOperatorToTier(operator.name, tier)
                                    }
                                    operator={operator}
                                    tierOrder={tierOrder}
                                  />
                                ))}
                              </div>
                              {tierPoolTotalPages > 1 ? (
                                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
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
                                    onClick={() =>
                                      setTierPoolPage((page) => Math.max(1, page - 1))
                                    }
                                    className="rounded-lg"
                                  >
                                    ‹
                                  </Button>
                                  <Badge
                                    variant="outline"
                                    className="bg-white border-slate-200 text-slate-600 px-3 py-1.5"
                                  >
                                    Trang {tierPoolPage} / {tierPoolTotalPages}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={tierPoolPage >= tierPoolTotalPages}
                                    onClick={() =>
                                      setTierPoolPage((page) =>
                                        Math.min(tierPoolTotalPages, page + 1),
                                      )
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
                            className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm overflow-hidden"
                          >
                            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                              <Badge className={getTierBadgeClassName(tier)}>{tier}</Badge>
                              <span className="text-sm text-slate-500">
                                {operators.length} character
                              </span>
                            </div>
                            {operators.length > 0 ? (
                              <div className="flex flex-wrap gap-3 p-4">
                                {operators.map((operator) => (
                                  <TierAssignmentAvatar
                                    key={`tier-card-${tier}-${operator.name}`}
                                    currentTier={tier}
                                    onAssign={(nextTier) =>
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

              {/* Game Events Tab */}
              <TabsContent
                value="events"
                className="mt-0 focus-visible:outline-none pb-28"
              >
                <div className="grid grid-cols-1 gap-4">
                  {newsData.map((news, idx) => {
                    return (
                      <Card
                        key={news.id}
                        className="glass-card border-0 overflow-hidden group shadow-sm hover:shadow-md"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                        <CardHeader className="pb-3 border-b border-slate-100/50">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-slate-800 text-xl font-bold mb-1 group-hover:text-cyan-600 transition-colors leading-tight">
                              {translateGameTerms(news.title)}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="bg-white/50 border-slate-200 text-slate-600 font-medium whitespace-nowrap ml-4"
                            >
                              <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
                              {new Date(news.publishTime).toLocaleDateString(
                                "vi-VN",
                              )}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-5">
                          <div
                            className="prose prose-sm max-w-none text-slate-600 prose-a:text-cyan-600 prose-img:rounded-xl mb-6 overflow-hidden"
                            dangerouslySetInnerHTML={{
                              __html: translateGameTerms(news.content),
                            }}
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {isNewsLoading && (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                  </div>
                )}
              </TabsContent>

              {/* Gacha Tab */}
              <TabsContent
                value="gacha"
                className="mt-0 focus-visible:outline-none space-y-6"
              >
                <Card className="glass-card border-0 shadow-sm">
                  <CardHeader className="pb-4 bg-white/30 border-b border-slate-100">
                    <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                      <div className="p-2 bg-amber-100 rounded-lg border border-amber-200">
                        <Diamond className="w-6 h-6 text-amber-600" />
                      </div>
                      Tra cứu lịch sử gacha
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Dán cookie lấy từ{" "}
                      <a
                        href="https://account.yo-star.com/login"
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-600 hover:text-cyan-700 underline underline-offset-2"
                      >
                        https://account.yo-star.com/login
                      </a>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          placeholder="Nhập cookie hoặc token của bạn"
                          value={cookieToken}
                          onChange={(e) => setCookieToken(e.target.value)}
                          onKeyPress={handleGachaKeyPress}
                          className="bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 pl-10 h-12 text-lg rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={() => handleSearchGacha(1)}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-amber-500/20"
                      >
                        Tải lịch sử
                      </Button>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 space-y-1">
                      <p className="font-semibold">Cách lấy token nhanh</p>
                      <p>1. Đăng nhập vào trang Yostar ở link bên trên.</p>
                      <p>2. Nhấn `F12`.</p>
                      <p>3. Chuyển sang tab `Network` hoặc `Mạng`.</p>
                      <p>4. Nhấn `F5` để tải lại trang.</p>
                      <p>5. Chọn request có `Name` là `detail`.</p>
                      <p>6. Vào `Headers`, kéo xuống tìm `Cookie`, copy hết và dán vào ô nhập.</p>
                    </div>
                  </CardContent>
                </Card>

                {isGachaLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                    <p className="text-slate-500 animate-pulse font-medium">
                      Đang tải lịch sử gacha...
                    </p>
                  </div>
                ) : gachaAttempted && gachaData ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Pulls List */}
                    <Card className="glass-card border-0 bg-white/80 shadow-sm overflow-hidden">
                      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500" />
                      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle className="text-slate-700 flex items-center gap-2 text-lg">
                          <History className="w-5 h-5 text-slate-500" />
                          Lịch sử gần đây
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {[
                            "all",
                            "Special Headhunting",
                            "Regular Headhunting",
                            "Limited Headhunting",
                          ].map((typeValue) => (
                            <Button
                              key={typeValue}
                              type="button"
                              variant={gachaTypeFilter === typeValue ? "default" : "outline"}
                              size="sm"
                              onClick={() => setGachaTypeFilter(typeValue)}
                              className={
                                gachaTypeFilter === typeValue
                                  ? "bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                                  : "rounded-lg border-slate-200 text-slate-600"
                              }
                            >
                              {typeValue === "all" ? "Tất cả" : typeValue}
                            </Button>
                          ))}
                          <Button
                            type="button"
                            variant={showGachaSixStarOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              setShowGachaSixStarOnly((current) => !current)
                            }
                            className={
                              showGachaSixStarOnly
                                ? "bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                                : "rounded-lg border-slate-200 text-slate-600"
                            }
                          >
                            Chỉ 6★
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {paginatedGachaData.map(({ item, pityCount, starValue, index }) => {
                            const isSixStar = starValue === 6;
                            const isFiveStar = starValue === 5;
                            const isFourStar = starValue === 4;

                            return (
                              <Card
                                key={`${item.charName}-${item.atStr}-${index}`}
                                className="border border-slate-200 bg-white/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                title={item.poolName}
                              >
                                <CardContent className="p-4">
                                  <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border border-slate-100 shadow-sm mb-3">
                                      <img
                                        src={`https://arknights.wiki.gg/images/${getWikiImageName(item.charName)}_icon.png`}
                                        alt={item.charName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    </div>

                                    <p
                                      className={`font-bold leading-tight min-h-[2.5rem] flex items-center ${
                                        isSixStar
                                          ? "text-orange-600"
                                          : isFiveStar
                                            ? "text-yellow-600"
                                            : isFourStar
                                              ? "text-purple-600"
                                              : "text-slate-700"
                                      }`}
                                    >
                                      {item.charName}
                                    </p>

                                    <div className="flex items-center gap-0.5 mt-2 mb-3">
                                      {Array.from({ length: starValue }).map((_, starIndex) => (
                                        <Star
                                          key={starIndex}
                                          className={`w-3.5 h-3.5 ${
                                            isSixStar
                                              ? "fill-orange-500 text-orange-500"
                                              : isFiveStar
                                                ? "fill-yellow-500 text-yellow-500"
                                                : isFourStar
                                                  ? "fill-purple-500 text-purple-500"
                                                  : "fill-slate-400 text-slate-400"
                                          }`}
                                        />
                                      ))}
                                    </div>

                                    <Badge
                                      variant="outline"
                                      className="bg-slate-50 border-slate-200 text-slate-500 max-w-full"
                                    >
                                      <span className="truncate max-w-[140px] block">
                                        {item.typeName}
                                      </span>
                                    </Badge>
                                    {isSixStar && pityCount !== null && (
                                      <Badge className="mt-2 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
                                        {pityCount} lần rút
                                      </Badge>
                                    )}
                                    <p className="text-xs text-slate-400 mt-2">
                                      {item.atStr}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        {filteredGachaData.length === 0 && (
                          <div className="p-8 text-center text-slate-500">
                            Không tìm thấy dữ liệu gacha.
                          </div>
                        )}
                        {/* Pagination */}
                        {effectiveGachaTotalPages >= 1 && (
                          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">
                                Trang <strong>{gachaPage}</strong> /{" "}
                                <strong>{effectiveGachaTotalPages}</strong>
                              </span>
                              {!showGachaSixStarOnly && (
                                <div className="flex items-center gap-1 ml-4">
                                  <span className="text-xs text-slate-400">
                                    Hiển thị:
                                  </span>
                                  {[10, 20, 50, 100].map((s) => (
                                    <button
                                      key={s}
                                      disabled={isGachaLoading}
                                      onClick={() => handleGachaSizeChange(s)}
                                      className={`px-2 py-1 text-xs rounded-md font-semibold transition-colors ${
                                        gachaPageSize === s
                                          ? "bg-amber-500 text-white"
                                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={gachaPage <= 1 || isGachaLoading}
                                onClick={() => handleGachaPageChange(1)}
                                className="text-slate-600 h-8 w-8 p-0"
                              >
                                «
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={gachaPage <= 1 || isGachaLoading}
                                onClick={() =>
                                  handleGachaPageChange(gachaPage - 1)
                                }
                                className="text-slate-600 h-8 w-8 p-0"
                              >
                                ‹
                              </Button>
                              {Array.from(
                                { length: Math.min(5, effectiveGachaTotalPages) },
                                (_, i) => {
                                  const start = Math.max(
                                    1,
                                    Math.min(
                                      gachaPage - 2,
                                      effectiveGachaTotalPages - 4,
                                    ),
                                  );
                                  const p = start + i;
                                  return (
                                    <Button
                                      key={p}
                                      variant={
                                        p === gachaPage ? "default" : "ghost"
                                      }
                                      size="sm"
                                      disabled={isGachaLoading}
                                      onClick={() => handleGachaPageChange(p)}
                                      className={`h-8 w-8 p-0 text-sm ${
                                        p === gachaPage
                                          ? "bg-amber-500 text-white hover:bg-amber-600"
                                          : "text-slate-600"
                                      }`}
                                    >
                                      {p}
                                    </Button>
                                  );
                                },
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={
                                  gachaPage >= effectiveGachaTotalPages || isGachaLoading
                                }
                                onClick={() =>
                                  handleGachaPageChange(gachaPage + 1)
                                }
                                className="text-slate-600 h-8 w-8 p-0"
                              >
                                ›
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={
                                  gachaPage >= effectiveGachaTotalPages || isGachaLoading
                                }
                                onClick={() =>
                                  handleGachaPageChange(effectiveGachaTotalPages)
                                }
                                className="text-slate-600 h-8 w-8 p-0"
                              >
                                »
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : gachaAttempted && !gachaData && !isGachaLoading ? (
                  <Alert className="border-red-200 bg-red-50 backdrop-blur-md text-red-800 rounded-xl animate-fade-in shadow-sm">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <AlertDescription className="ml-2 font-medium text-base">
                      {errorMessage ||
                        "Cookie không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."}
                    </AlertDescription>
                  </Alert>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>
      </div>

      {/* Floating Pagination Bar */}
      {activeTab === "events" && newsTotalPages > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl border border-slate-200/60 p-3 sm:p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <Button
              variant="outline"
              onClick={() => setNewsPage((p) => Math.max(1, p - 1))}
              disabled={newsPage === 1 || isNewsLoading}
              className="border-slate-300 text-slate-700 rounded-xl font-bold px-3 sm:px-4"
            >
              <ChevronLeft className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Tin trước</span>
            </Button>

            <div className="flex flex-col items-center">
              <span className="text-slate-800 font-bold px-2 sm:px-4 text-sm sm:text-base">
                Tin {newsPage} / {newsTotalPages}
              </span>
              {newsData[0]?.link ? (
                <a
                  href={newsData[0].link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-600 font-semibold hover:text-cyan-700 mt-1 flex items-center transition-colors"
                >
                  Xem bản tin gốc
                  <ChevronRight className="w-3 h-3 ml-1" />
                </a>
              ) : null}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setNewsPage((p) => Math.min(newsTotalPages, p + 1))
              }
              disabled={newsPage === newsTotalPages || isNewsLoading}
              className="border-slate-300 text-slate-700 rounded-xl font-bold px-3 sm:px-4"
            >
              <span className="hidden sm:inline">Tin sau</span>
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
