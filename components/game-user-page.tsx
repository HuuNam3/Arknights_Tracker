"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
  Check,
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
  Wrench,
  Users,
  GalleryHorizontal,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { MainTab, ToolTab } from "@/lib/site-navigation";
import {
  findTierNameIssue,
  findTierListNameIssue,
  TIER_NAME_MAX_LENGTH,
  TIER_LIST_NAME_MAX_LENGTH,
} from "@/lib/tier-list-validation";
import { BannersTabContent } from "@/components/game-user-page/tabs/banners-tab-content";
import { CharactersTabContent } from "@/components/game-user-page/tabs/characters-tab-content";
import { GachaTabContent } from "@/components/game-user-page/tabs/gacha-tab-content";
import { NewsTabContent } from "@/components/game-user-page/tabs/news-tab-content";
import { TierListTabContent } from "@/components/game-user-page/tabs/tier-list-tab-content";
import { ToolsTabContent } from "@/components/game-user-page/tabs/tools-tab-content";

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

const RECRUITMENT_TAGS = [
  "Top Operator",
  "Senior Operator",
  "Crowd-Control",
  "Nuker",
  "Robot",
  "Starter",
  "Shift",
  "Fast-Redeploy",
  "Debuff",
  "Specialist",
  "Summon",
  "Healing",
  "DP-Recovery",
  "Vanguard",
  "Defender",
  "Guard",
  "Medic",
  "Sniper",
  "Caster",
  "Support",
  "AoE",
  "Slow",
  "Elemental",
  "Supporter",
  "Melee",
  "Ranged",
  "Defense",
  "Survival",
  "DPS",
] as const;

type RecruitmentTag = (typeof RECRUITMENT_TAGS)[number];
type RecruitmentTagCategory =
  | "qualification"
  | "position"
  | "class"
  | "specialization";

type RecruitmentOperator = {
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5 | 6;
  tags: RecruitmentTag[];
};

type RecruitmentComboResult = {
  isSpecial: boolean;
  minRarity: number;
  operators: RecruitmentOperator[];
  recommendation: string;
  tags: RecruitmentTag[];
};

type RecruitmentTagGroup = {
  category: RecruitmentTagCategory;
  label: string;
  tags: RecruitmentTag[];
};

const RECRUITMENT_TAG_CATEGORY: Record<RecruitmentTag, RecruitmentTagCategory> = {
  "Top Operator": "qualification",
  "Senior Operator": "qualification",
  "Crowd-Control": "specialization",
  Nuker: "specialization",
  Robot: "qualification",
  Starter: "qualification",
  Shift: "specialization",
  "Fast-Redeploy": "specialization",
  Debuff: "specialization",
  Specialist: "class",
  Summon: "specialization",
  Healing: "specialization",
  "DP-Recovery": "specialization",
  Vanguard: "class",
  Defender: "class",
  Guard: "class",
  Medic: "class",
  Sniper: "class",
  Caster: "class",
  Support: "specialization",
  AoE: "specialization",
  Slow: "specialization",
  Elemental: "specialization",
  Supporter: "class",
  Melee: "position",
  Ranged: "position",
  Defense: "specialization",
  Survival: "specialization",
  DPS: "specialization",
};

const RECRUITMENT_SPECIAL_TAGS = new Set<RecruitmentTag>([
  "Top Operator",
  "Senior Operator",
  "Robot",
  "Specialist",
  "Crowd-Control",
  "Nuker",
  "Summon",
  "Fast-Redeploy",
  "Shift",
  "Elemental",
]);

const RECRUITMENT_PRIORITY_TAGS: RecruitmentTag[] = [
  "Top Operator",
  "Senior Operator",
  "Robot",
  "Specialist",
  "Crowd-Control",
  "Nuker",
  "Summon",
  "Fast-Redeploy",
  "Shift",
  "Elemental",
];

const RECRUITMENT_PRIORITY_SCORE = new Map(
  RECRUITMENT_PRIORITY_TAGS.map((tag, index) => [
    tag,
    RECRUITMENT_PRIORITY_TAGS.length - index,
  ]),
);

const RECRUITMENT_TAG_GROUPS: RecruitmentTagGroup[] = [
  {
    category: "qualification",
    label: "Tag đặc biệt",
    tags: RECRUITMENT_TAGS.filter(
      (tag) => RECRUITMENT_TAG_CATEGORY[tag] === "qualification",
    ),
  },
  {
    category: "position",
    label: "Vị trí",
    tags: RECRUITMENT_TAGS.filter(
      (tag) => RECRUITMENT_TAG_CATEGORY[tag] === "position",
    ),
  },
  {
    category: "class",
    label: "Class",
    tags: RECRUITMENT_TAGS.filter((tag) => RECRUITMENT_TAG_CATEGORY[tag] === "class"),
  },
  {
    category: "specialization",
    label: "Chuyên môn",
    tags: RECRUITMENT_TAGS.filter(
      (tag) => RECRUITMENT_TAG_CATEGORY[tag] === "specialization",
    ),
  },
] as const;

const RECRUITMENT_OPERATORS: RecruitmentOperator[] = [
  { name: "Aak", rarity: 6, tags: ["Top Operator", "Specialist", "Ranged", "Support", "DPS"] },
  { name: "Archetto", rarity: 6, tags: ["Top Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Bagpipe", rarity: 6, tags: ["Top Operator", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Blaze", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Survival"] },
  { name: "Blemishine", rarity: 6, tags: ["Top Operator", "Defender", "Melee", "Defense", "Healing", "DPS"] },
  { name: "Ceobe", rarity: 6, tags: ["Top Operator", "Caster", "Ranged", "DPS", "Crowd-Control"] },
  { name: "Ch'en", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "Nuker", "DPS"] },
  { name: "Eunectes", rarity: 6, tags: ["Top Operator", "Defender", "Melee", "DPS", "Survival", "Defense"] },
  { name: "Exusiai", rarity: 6, tags: ["Top Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Hellagur", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Survival"] },
  { name: "Hoshiguma", rarity: 6, tags: ["Top Operator", "Defender", "Melee", "Defense", "DPS"] },
  { name: "Ifrit", rarity: 6, tags: ["Top Operator", "Caster", "Ranged", "AoE", "Debuff"] },
  { name: "Kal'tsit", rarity: 6, tags: ["Top Operator", "Medic", "Ranged", "Summon", "Healing"] },
  { name: "Magallan", rarity: 6, tags: ["Top Operator", "Supporter", "Ranged", "Support", "Slow", "DPS"] },
  { name: "Mostima", rarity: 6, tags: ["Top Operator", "Caster", "Ranged", "AoE", "Support", "Crowd-Control"] },
  { name: "Mountain", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Survival"] },
  { name: "Mudrock", rarity: 6, tags: ["Top Operator", "Defender", "Melee", "Survival", "Defense", "DPS"] },
  { name: "Nightingale", rarity: 6, tags: ["Top Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Passenger", rarity: 6, tags: ["Top Operator", "Caster", "Ranged", "DPS"] },
  { name: "Phantom", rarity: 6, tags: ["Top Operator", "Specialist", "Melee", "Fast-Redeploy", "Crowd-Control", "DPS"] },
  { name: "Rosa", rarity: 6, tags: ["Top Operator", "Sniper", "Ranged", "DPS", "Crowd-Control"] },
  { name: "Saga", rarity: 6, tags: ["Top Operator", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Saria", rarity: 6, tags: ["Top Operator", "Defender", "Melee", "Defense", "Healing", "Support"] },
  { name: "Schwarz", rarity: 6, tags: ["Top Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Shining", rarity: 6, tags: ["Top Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Siege", rarity: 6, tags: ["Top Operator", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "SilverAsh", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Support"] },
  { name: "Skadi", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Survival"] },
  { name: "Surtr", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS"] },
  { name: "Suzuran", rarity: 6, tags: ["Top Operator", "Supporter", "Ranged", "Support", "Slow", "DPS"] },
  { name: "Thorns", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Defense"] },
  { name: "Weedy", rarity: 6, tags: ["Top Operator", "Specialist", "Melee", "Shift", "DPS", "Crowd-Control"] },

  { name: "Akafuyu", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "Survival", "DPS"] },
  { name: "Andreana", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS", "Slow"] },
  { name: "Aosta", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "AoE"] },
  { name: "April", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Asbestos", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "DPS"] },
  { name: "Astesia", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "DPS", "Defense"] },
  { name: "Ayerscarpe", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "DPS", "AoE"] },
  { name: "Beeswax", rarity: 5, tags: ["Senior Operator", "Caster", "Ranged", "AoE", "Defense"] },
  { name: "Blue Poison", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Broca", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "AoE", "Survival"] },
  { name: "Chiave", rarity: 5, tags: ["Senior Operator", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Cliffheart", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Shift", "DPS"] },
  { name: "Croissant", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Shift"] },
  { name: "Elysium", rarity: 5, tags: ["Senior Operator", "Vanguard", "Melee", "DP-Recovery", "Support"] },
  { name: "Executor", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "AoE"] },
  { name: "FEater", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Shift", "Slow"] },
  { name: "Firewatch", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS", "Nuker"] },
  { name: "Flint", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "DPS"] },
  { name: "Glaucus", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Slow", "Crowd-Control"] },
  { name: "GreyThroat", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Hung", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Healing"] },
  { name: "Indra", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "DPS", "Survival"] },
  { name: "Iris", rarity: 5, tags: ["Senior Operator", "Caster", "Ranged", "DPS"] },
  { name: "Kafka", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Fast-Redeploy", "Crowd-Control"] },
  { name: "Leizi", rarity: 5, tags: ["Senior Operator", "Caster", "Ranged", "DPS"] },
  { name: "Leonhardt", rarity: 5, tags: ["Senior Operator", "Caster", "Ranged", "AoE", "Nuker"] },
  { name: "Liskarm", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "DPS"] },
  { name: "Manticore", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "DPS", "Survival"] },
  { name: "Mayer", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Summon", "Crowd-Control"] },
  { name: "Meteorite", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "AoE", "Debuff"] },
  { name: "Mr.Nothing", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Fast-Redeploy", "DPS"] },
  { name: "Nearl", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Healing"] },
  { name: "Nightmare", rarity: 5, tags: ["Senior Operator", "Caster", "Ranged", "DPS", "Healing", "Slow"] },
  { name: "Platinum", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Pramanix", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Debuff", "Support"] },
  { name: "Projekt Red", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Fast-Redeploy", "Crowd-Control"] },
  { name: "Provence", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Texas", rarity: 5, tags: ["Senior Operator", "Vanguard", "Melee", "DP-Recovery", "Crowd-Control"] },
  { name: "Ptilopsis", rarity: 5, tags: ["Senior Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Silence", rarity: 5, tags: ["Senior Operator", "Medic", "Ranged", "Healing"] },
  { name: "Reed", rarity: 5, tags: ["Senior Operator", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Sesa", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "AoE", "Debuff"] },
  { name: "Shamare", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Debuff", "Support"] },
  { name: "Specter", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "AoE", "DPS", "Survival"] },
  { name: "Swire", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "DPS", "Support"] },
  { name: "Toddifons", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Tsukinogi", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Support", "Survival"] },
  { name: "Vulcan", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Survival", "DPS"] },
  { name: "Waai Fu", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Fast-Redeploy", "Debuff"] },
  { name: "Warfarin", rarity: 5, tags: ["Senior Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Whisperain", rarity: 5, tags: ["Senior Operator", "Medic", "Ranged", "Healing"] },
  { name: "Zima", rarity: 5, tags: ["Senior Operator", "Vanguard", "Melee", "DP-Recovery", "Support"] },
  { name: "Istina", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Slow", "DPS"] },

  { name: "Aciddrop", rarity: 4, tags: ["Sniper", "Ranged", "DPS"] },
  { name: "Ambriel", rarity: 4, tags: ["Sniper", "Ranged", "DPS", "Slow"] },
  { name: "Arene", rarity: 4, tags: ["Guard", "Melee", "DPS"] },
  { name: "Beanstalk", rarity: 4, tags: ["Vanguard", "Ranged", "DP-Recovery", "Summon"] },
  { name: "Beehunter", rarity: 4, tags: ["Guard", "Melee", "DPS"] },
  { name: "Bubble", rarity: 4, tags: ["Defender", "Melee", "Defense"] },
  { name: "Click", rarity: 4, tags: ["Caster", "Ranged", "DPS", "Crowd-Control"] },
  { name: "Cuora", rarity: 4, tags: ["Defender", "Melee", "Defense"] },
  { name: "Cutter", rarity: 4, tags: ["Guard", "Melee", "Nuker", "DPS"] },
  { name: "Dobermann", rarity: 4, tags: ["Guard", "Melee", "DPS", "Support"] },
  { name: "Earthspirit", rarity: 4, tags: ["Supporter", "Ranged", "Slow", "Support"] },
  { name: "Estelle", rarity: 4, tags: ["Guard", "Melee", "AoE", "Survival"] },
  { name: "Frostleaf", rarity: 4, tags: ["Guard", "Melee", "Slow", "DPS"] },
  { name: "Gitano", rarity: 4, tags: ["Caster", "Ranged", "AoE"] },
  { name: "Gravel", rarity: 4, tags: ["Specialist", "Melee", "Fast-Redeploy", "Defense"] },
  { name: "Greyy", rarity: 4, tags: ["Caster", "Ranged", "AoE", "Slow"] },
  { name: "Haze", rarity: 4, tags: ["Caster", "Ranged", "DPS", "Debuff"] },
  { name: "Jackie", rarity: 4, tags: ["Guard", "Melee", "DPS"] },
  { name: "Jaye", rarity: 4, tags: ["Specialist", "Melee", "Fast-Redeploy", "DPS"] },
  { name: "Jessica", rarity: 4, tags: ["Sniper", "Ranged", "DPS", "Survival"] },
  { name: "Matoimaru", rarity: 4, tags: ["Guard", "Melee", "Survival", "DPS"] },
  { name: "Matterhorn", rarity: 4, tags: ["Defender", "Melee", "Defense"] },
  { name: "May", rarity: 4, tags: ["Sniper", "Ranged", "DPS", "Slow"] },
  { name: "Meteor", rarity: 4, tags: ["Sniper", "Ranged", "DPS", "Debuff"] },
  { name: "Mousse", rarity: 4, tags: ["Guard", "Melee", "DPS"] },
  { name: "Myrrh", rarity: 4, tags: ["Medic", "Ranged", "Healing"] },
  { name: "Myrtle", rarity: 4, tags: ["Vanguard", "Melee", "DP-Recovery", "Healing"] },
  { name: "Perfumer", rarity: 4, tags: ["Medic", "Ranged", "Healing"] },
  { name: "Pinecone", rarity: 4, tags: ["Sniper", "Ranged", "AoE", "DPS"] },
  { name: "Podenco", rarity: 4, tags: ["Supporter", "Ranged", "Slow", "Healing"] },
  { name: "Purestream", rarity: 4, tags: ["Medic", "Ranged", "Healing", "Support"] },
  { name: "Rope", rarity: 4, tags: ["Specialist", "Melee", "Shift"] },
  { name: "Scavenger", rarity: 4, tags: ["Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Shaw", rarity: 4, tags: ["Specialist", "Melee", "Shift"] },
  { name: "Shirayuki", rarity: 4, tags: ["Sniper", "Ranged", "AoE", "Slow"] },
  { name: "Sussurro", rarity: 4, tags: ["Medic", "Ranged", "Healing"] },
  { name: "Utage", rarity: 4, tags: ["Guard", "Melee", "DPS", "Survival"] },
  { name: "Vermeil", rarity: 4, tags: ["Sniper", "Ranged", "DPS"] },
  { name: "Vigna", rarity: 4, tags: ["Vanguard", "Melee", "DPS", "DP-Recovery"] },
  { name: "Gummy", rarity: 4, tags: ["Defender", "Melee", "Defense", "Healing"] },

  { name: "Adnachiel", rarity: 3, tags: ["Starter", "Sniper", "Ranged", "DPS"] },
  { name: "Ansel", rarity: 3, tags: ["Starter", "Medic", "Ranged", "Healing"] },
  { name: "Beagle", rarity: 3, tags: ["Starter", "Defender", "Melee", "Defense"] },
  { name: "Catapult", rarity: 3, tags: ["Starter", "Sniper", "Ranged", "AoE"] },
  { name: "Fang", rarity: 3, tags: ["Starter", "Vanguard", "Melee", "DP-Recovery"] },
  { name: "Hibiscus", rarity: 3, tags: ["Starter", "Medic", "Ranged", "Healing"] },
  { name: "Kroos", rarity: 3, tags: ["Starter", "Sniper", "Ranged", "DPS"] },
  { name: "Lava", rarity: 3, tags: ["Starter", "Caster", "Ranged", "AoE"] },
  { name: "Melantha", rarity: 3, tags: ["Starter", "Guard", "Melee", "DPS", "Survival"] },
  { name: "Midnight", rarity: 3, tags: ["Starter", "Guard", "Melee", "DPS"] },
  { name: "Orchid", rarity: 3, tags: ["Starter", "Supporter", "Ranged", "Slow"] },
  { name: "Plume", rarity: 3, tags: ["Starter", "Vanguard", "Melee", "DPS", "DP-Recovery"] },
  { name: "Popukar", rarity: 3, tags: ["Starter", "Guard", "Melee", "AoE", "Survival"] },
  { name: "Spot", rarity: 3, tags: ["Starter", "Defender", "Melee", "Defense", "Healing"] },
  { name: "Steward", rarity: 3, tags: ["Starter", "Caster", "Ranged", "DPS"] },
  { name: "Vanilla", rarity: 3, tags: ["Starter", "Vanguard", "Melee", "DP-Recovery"] },

  { name: "12F", rarity: 2, tags: ["Starter", "Caster", "Ranged", "AoE"] },
  { name: "Durin", rarity: 2, tags: ["Starter", "Caster", "Ranged"] },
  { name: "Noir Corne", rarity: 2, tags: ["Starter", "Defender", "Melee", "Defense"] },
  { name: "Rangers", rarity: 2, tags: ["Starter", "Sniper", "Ranged"] },
  { name: "Yato", rarity: 2, tags: ["Starter", "Vanguard", "Melee"] },

  { name: "Justice Knight", rarity: 1, tags: ["Robot", "Sniper", "Ranged", "Support"] },
  { name: "Castle-3", rarity: 1, tags: ["Robot", "Guard", "Melee", "Support"] },
  { name: "CONFESS-47", rarity: 1, tags: ["Robot", "Vanguard", "Melee", "Crowd-Control"] },
  { name: "Friston-3", rarity: 1, tags: ["Robot", "Defender", "Melee", "Defense"] },
  { name: "Lancet-2", rarity: 1, tags: ["Robot", "Medic", "Ranged", "Healing"] },
  { name: "PhonoR-0", rarity: 1, tags: ["Robot", "Supporter", "Ranged", "Elemental"] },
  { name: "THRM-EX", rarity: 1, tags: ["Robot", "Specialist", "Melee", "Nuker"] },
];

const getRecruitmentTagClassName = (
  tag: RecruitmentTag,
  options?: { active?: boolean; highlighted?: boolean; subtle?: boolean },
) => {
  const { active = false, highlighted = false, subtle = false } = options ?? {};
  const category = RECRUITMENT_TAG_CATEGORY[tag];

  if (active) {
    if (category === "qualification") {
      return "rounded-lg border-2 border-amber-500 bg-amber-200 text-amber-950 shadow-[0_10px_30px_-18px_rgba(217,119,6,0.8)]";
    }
    if (category === "position") {
      return "rounded-lg border-2 border-cyan-500 bg-cyan-200 text-cyan-950 shadow-[0_10px_30px_-18px_rgba(6,182,212,0.8)]";
    }
    if (category === "class") {
      return "rounded-lg border-2 border-indigo-500 bg-indigo-200 text-indigo-950 shadow-[0_10px_30px_-18px_rgba(99,102,241,0.8)]";
    }

    return "rounded-lg border-2 border-emerald-500 bg-emerald-200 text-emerald-950 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.8)]";
  }

  if (highlighted) {
    return "rounded-lg border-2 border-rose-200 bg-rose-50 text-rose-700 opacity-95";
  }

  if (subtle) {
    if (category === "qualification") {
      return "rounded-md border-2 border-amber-100 bg-white text-amber-600 opacity-70";
    }
    if (category === "position") {
      return "rounded-md border-2 border-cyan-100 bg-white text-cyan-600 opacity-70";
    }
    if (category === "class") {
      return "rounded-md border-2 border-indigo-100 bg-white text-indigo-600 opacity-70";
    }

    return "rounded-md border-2 border-emerald-100 bg-white text-emerald-600 opacity-70";
  }

  if (category === "qualification") {
    return "rounded-lg border-2 border-amber-200 bg-white text-amber-700";
  }
  if (category === "position") {
    return "rounded-lg border-2 border-cyan-200 bg-white text-cyan-700";
  }
  if (category === "class") {
    return "rounded-lg border-2 border-indigo-200 bg-white text-indigo-700";
  }

  return "rounded-lg border-2 border-emerald-200 bg-white text-emerald-700";
};

const getRecruitmentRecommendationText = (
  tags: RecruitmentTag[],
  minRarity: number,
  operators: RecruitmentOperator[],
) => {
  if (tags.includes("Top Operator")) {
    return "Tag đặc biệt, nên chọn ngay";
  }
  if (tags.includes("Senior Operator")) {
    return "Tag hiếm, nên ưu tiên giữ";
  }
  if (tags.includes("Robot")) {
    return "Tag đặc biệt để farm robot";
  }
  if (minRarity >= 5) {
    return "Combo hiếm, rất nên giữ";
  }
  if (minRarity >= 4) {
    return operators.length === 1
      ? "Combo đẹp, khóa vào operator cụ thể"
      : "Combo tốt, nên cân nhắc chọn";
  }

  return "Combo thường";
};

const isRecruitmentOperatorEligibleForTags = (
  operator: RecruitmentOperator,
  tags: RecruitmentTag[],
) => {
  if (operator.rarity === 6 && !tags.includes("Top Operator")) {
    return false;
  }

  return tags.every((tag) => operator.tags.includes(tag));
};

const getRecruitmentComboAttentionScore = (tags: RecruitmentTag[]) =>
  tags.reduce((score, tag) => score + (RECRUITMENT_PRIORITY_SCORE.get(tag) ?? 0), 0);

const buildRecruitmentTagSubsets = (
  tags: RecruitmentTag[],
  options?: { maxSize?: number; minSize?: number },
) => {
  const minSize = options?.minSize ?? 1;
  const maxSize = Math.min(options?.maxSize ?? 3, tags.length);
  const subsets: RecruitmentTag[][] = [];

  for (let size = minSize; size <= maxSize; size += 1) {
    const stack: RecruitmentTag[] = [];
    const dfs = (startIndex: number) => {
      if (stack.length === size) {
        subsets.push([...stack]);
        return;
      }

      for (let index = startIndex; index < tags.length; index += 1) {
        const tag = tags[index];
        if (!tag) continue;
        stack.push(tag);
        dfs(index + 1);
        stack.pop();
      }
    };

    dfs(0);
  }

  return subsets;
};

const filterRedundantRecruitmentCombos = (
  combos: RecruitmentComboResult[],
) =>
  combos.filter((combo, comboIndex) => {
    const comboOperatorKey = combo.operators.map((operator) => operator.name).join("|");

    return !combos.some((candidate, candidateIndex) => {
      if (candidateIndex === comboIndex) return false;
      if (candidate.tags.length <= combo.tags.length) return false;

      const candidateOperatorKey = candidate.operators
        .map((operator) => operator.name)
        .join("|");

      if (candidateOperatorKey !== comboOperatorKey) return false;

      return combo.tags.every((tag) => candidate.tags.includes(tag));
    });
  });

const getRecruitmentComboMaxRarity = (combo: RecruitmentComboResult) =>
  combo.operators.reduce(
    (maxRarity, operator) => Math.max(maxRarity, operator.rarity),
    0,
  );

const getRecruitmentComboResults = (
  tags: RecruitmentTag[],
): RecruitmentComboResult[] => {
  const combinations = buildRecruitmentTagSubsets(tags, {
    maxSize: 3,
    minSize: 1,
  });

  const combos = combinations
    .map((comboTags) => {
      const operators = RECRUITMENT_OPERATORS.filter((operator) =>
        isRecruitmentOperatorEligibleForTags(operator, comboTags),
      ).sort((left, right) => {
        if (left.rarity !== right.rarity) {
          return right.rarity - left.rarity;
        }

        return left.name.localeCompare(right.name);
      });

      if (operators.length === 0) {
        return null;
      }

      const minRarity = Math.min(...operators.map((operator) => operator.rarity));
      const hasSpecialTag = comboTags.some((tag) => RECRUITMENT_SPECIAL_TAGS.has(tag));

      return {
        isSpecial: hasSpecialTag || minRarity >= 5,
        minRarity,
        operators,
        recommendation: getRecruitmentRecommendationText(
          comboTags,
          minRarity,
          operators,
        ),
        tags: comboTags,
      } satisfies RecruitmentComboResult;
    })
    .filter((entry): entry is RecruitmentComboResult => entry !== null);

  return filterRedundantRecruitmentCombos(combos).sort((left, right) => {
    const leftAttentionScore = getRecruitmentComboAttentionScore(left.tags);
    const rightAttentionScore = getRecruitmentComboAttentionScore(right.tags);

    if (leftAttentionScore !== rightAttentionScore) {
      return rightAttentionScore - leftAttentionScore;
    }
    if (left.tags.length !== right.tags.length) {
      return right.tags.length - left.tags.length;
    }
    const leftMaxRarity = getRecruitmentComboMaxRarity(left);
    const rightMaxRarity = getRecruitmentComboMaxRarity(right);

    if (leftMaxRarity !== rightMaxRarity) {
      return rightMaxRarity - leftMaxRarity;
    }
    if (left.minRarity !== right.minRarity) {
      return right.minRarity - left.minRarity;
    }
    if (left.operators.length !== right.operators.length) {
      return left.operators.length - right.operators.length;
    }

    return left.tags.join("|").localeCompare(right.tags.join("|"));
  });
};

const getRecruitmentSuggestionsForOperator = (
  operator: RecruitmentOperator | null,
): RecruitmentComboResult[] => {
  if (!operator) return [];

  const candidateTags = operator.tags.filter(
    (tag): tag is RecruitmentTag => RECRUITMENT_TAGS.includes(tag),
  );
  const combinations = buildRecruitmentTagSubsets(candidateTags, {
    maxSize: 3,
    minSize: 1,
  });

  const combos = combinations
    .map((comboTags) => {
      const operators = RECRUITMENT_OPERATORS.filter((candidate) =>
        isRecruitmentOperatorEligibleForTags(candidate, comboTags),
      ).sort((left, right) => {
        if (left.rarity !== right.rarity) {
          return right.rarity - left.rarity;
        }

        return left.name.localeCompare(right.name);
      });

      if (!operators.some((candidate) => candidate.name === operator.name)) {
        return null;
      }

      const minRarity = Math.min(...operators.map((candidate) => candidate.rarity));
      const hasSpecialTag = comboTags.some((tag) => RECRUITMENT_SPECIAL_TAGS.has(tag));

      return {
        isSpecial: hasSpecialTag || minRarity >= 5 || operators.length === 1,
        minRarity,
        operators,
        recommendation: getRecruitmentRecommendationText(
          comboTags,
          minRarity,
          operators,
        ),
        tags: comboTags,
      } satisfies RecruitmentComboResult;
    })
    .filter((entry): entry is RecruitmentComboResult => entry !== null)

  return filterRedundantRecruitmentCombos(combos).sort((left, right) => {
    const leftAttentionScore = getRecruitmentComboAttentionScore(left.tags);
    const rightAttentionScore = getRecruitmentComboAttentionScore(right.tags);

    if (leftAttentionScore !== rightAttentionScore) {
      return rightAttentionScore - leftAttentionScore;
    }
    if (left.operators.length !== right.operators.length) {
      return left.operators.length - right.operators.length;
    }
    if (left.minRarity !== right.minRarity) {
      return right.minRarity - left.minRarity;
    }
    if (left.tags.length !== right.tags.length) {
      return right.tags.length - left.tags.length;
    }

    return left.tags.join("|").localeCompare(right.tags.join("|"));
  });
};

const parseNumberInput = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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

const SPECIAL_WIKI_IMAGE_NAMES = new Map([
  ["Mr.Nothing", "Mr._Nothing"],
]);

const getWikiImageName = (value: string | null | undefined): string => {
  if (!value) {
    return "";
  }

  const charName = value;
  const specialImageName = SPECIAL_WIKI_IMAGE_NAMES.get(charName);
  if (specialImageName) {
    return specialImageName;
  }

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

const TOOL_ICON_URLS = {
  commendationCertificate:
    "https://arknights.wiki.gg/images/Commendation_Certificate.png",
  distinctionCertificate:
    "https://arknights.wiki.gg/images/Distinction_Certificate.png",
  headhuntingPermit:
    "https://arknights.wiki.gg/images/Headhunting_Permit.png",
  intelligenceCertificate:
    "https://arknights.wiki.gg/images/Intelligence_Certificate.png",
  originiumShard:
    "https://arknights.wiki.gg/images/Originium_Shard.png",
  originitePrime:
    "https://arknights.wiki.gg/images/Originite_Prime.png",
  orundum: "https://arknights.wiki.gg/images/Orundum.png",
  annihilationOperation:
    "https://arknights.wiki.gg/images/Annihilation_Operation.png",
} as const;

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
    authorName: typeof candidate.authorName === "string" ? candidate.authorName : "",
    authorUid: typeof candidate.authorUid === "string" ? candidate.authorUid : "",
    createdAt,
    id,
    likes: Array.isArray(candidate.likes)
      ? candidate.likes.filter((likedUid): likedUid is string => typeof likedUid === "string")
      : [],
    name,
    tiers,
  };
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
  current?: boolean;
  enStartDate: string | null;
  globalReleased: boolean;
  limited: boolean;
  name: string;
  operators: string[];
  operatorRarities: Record<string, string>;
  releaseDate: string;
  releaseTs: number;
};

type BannerLagSample = {
  enTs: number;
  lagDays: number;
  limited: boolean;
  newOperatorCount: number;
  operatorCount: number;
  type: string;
};

type BannerPredictionDetails = {
  confidence: "high" | "medium" | "low";
  date: string;
  lagDays: number;
  reason: string;
  sampleSize: number;
};

type PullPlannerEventBonus = {
  confidence: "high" | "medium" | "low";
  label: string;
  note: string;
  targetOnlyFreePulls: number;
  targetOnlyPermits: number;
  transferableOrundum: number;
  transferablePermits: number;
};

type CommendationShopMode = "phase1" | "phase2" | "phase3";

type PullPlannerState = {
  commendations: string;
  commendationShopCurrentMonthClaimed: boolean;
  commendationShopMode: CommendationShopMode;
  currentBannerKey: string;
  customTargetDate: string;
  dailyMissionEnabled: boolean;
  distinctions: string;
  distinctionShopCurrentMonthClaimed: boolean;
  eventRewardsEnabled: boolean;
  eventShopEnabled: boolean;
  intelligenceCertificates: string;
  monthlyCardEnabled: boolean;
  monthlySignInEnabled: boolean;
  originiumShards: string;
  originitePrime: string;
  orundum: string;
  permits: string;
  targetPulls: string;
  weeklyMissionEnabled: boolean;
  weeklyRegularOrundum: string;
};

type CommendationShopMonthBreakdown = {
  month: number;
  orundum: number;
  phase1OrundumBundles: number;
  phase1Permits: number;
  phase2Permits: number;
  phase3Bundles: number;
  permits: number;
  spent: number;
};

type CommendationShopPurchases = {
  breakdown: CommendationShopMonthBreakdown[];
  permits: number;
  phase1Months: number;
  phase2Permits: number;
  phase3Bundles: number;
  orundum: number;
  remaining: number;
  spent: number;
};

type DistinctionShopMonthBreakdown = {
  batches: number[];
  month: number;
  permits: number;
  spent: number;
};

type DistinctionShopPurchases = {
  batchCounts: number[];
  breakdown: DistinctionShopMonthBreakdown[];
  monthsUsed: number;
  permits: number;
  remaining: number;
  spent: number;
};

const DEFAULT_TIER_ORDER = ["S", "A", "B", "C", "D", "E"] as const;
const LEGACY_TIER_ORDER = ["OP+", "OP", "OP-", ...DEFAULT_TIER_ORDER] as const;
type TierRank = string;
type TierAssignmentMap = Record<string, TierRank | "">;
type SavedTierList = {
  assignments: TierAssignmentMap;
  authorName?: string;
  authorUid?: string;
  createdAt: number;
  id: string;
  likes?: string[];
  name: string;
  tiers: string[];
};

const DEFAULT_SAVED_TIER_LISTS: SavedTierList[] = [];

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
const MONTH_MS = 30.4375 * DAY_MS;
const PULL_PLANNER_STORAGE_KEY = "arkreview_pull_planner_v1";
const CUSTOM_PULL_PLANNER_TARGET_KEY = "custom-target-date";
const TIER_DRAFT_KEY = "arkreview_tierlist_draft_v1";
const LOCAL_TIER_LISTS_KEY = "arkreview_local_tierlists_v1";
const LIMITED_LUCKY_BOARD_EXPECTED_ORUNDUM = 8170;
const MIN_WEEKLY_ANNIHILATION_ORUNDUM = 1200;
const MAX_WEEKLY_ANNIHILATION_ORUNDUM = 1800;
const WEEKLY_ANNIHILATION_ORUNDUM_STEP = 50;
const COMMENDATION_SHOP_MONTHLY_PERMITS = 2;
const DAILY_SIGNIN_PERMIT_DAY = 17;
const INTELLIGENCE_CERTIFICATE_ORUNDUM_COST = 20;
const INTELLIGENCE_CERTIFICATE_ORUNDUM_REWARD = 100;
const COMMENDATION_PERMIT_COST = 240;
const COMMENDATION_ORUNDUM_BUNDLE_COST = 40;
const COMMENDATION_ORUNDUM_BUNDLE_SIZE = 100;
const COMMENDATION_PHASE_ONE_CLEAR_COST = 1490;
const COMMENDATION_PHASE_TWO_CLEAR_COST = 11025;
const COMMENDATION_PHASE_TWO_PERMIT_COSTS = [200, 450, 450, 750] as const;
const COMMENDATION_PHASE_TWO_PERMIT_TOTAL_COST = 1850;
const COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_COST = 50;
const COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_SIZE = 30;
const DISTINCTION_SHOP_BATCHES = [
  { cost: 10, permits: 1 },
  { cost: 18, permits: 2 },
  { cost: 40, permits: 5 },
  { cost: 70, permits: 10 },
  { cost: 120, permits: 20 },
] as const;

const DEFAULT_PULL_PLANNER: PullPlannerState = {
  commendations: "0",
  commendationShopCurrentMonthClaimed: false,
  commendationShopMode: "phase1",
  currentBannerKey: "",
  customTargetDate: "",
  dailyMissionEnabled: false,
  distinctions: "0",
  distinctionShopCurrentMonthClaimed: false,
  eventRewardsEnabled: false,
  eventShopEnabled: false,
  intelligenceCertificates: "0",
  monthlyCardEnabled: false,
  monthlySignInEnabled: false,
  originiumShards: "0",
  originitePrime: "0",
  orundum: "0",
  permits: "0",
  targetPulls: "300",
  weeklyMissionEnabled: false,
  weeklyRegularOrundum: "1800",
};

const parseIsoDate = (value: string | null) => {
  if (!value) return null;

  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const formatIsoDate = (timestamp: number) =>
  new Date(timestamp).toISOString().slice(0, 10);

const formatLocalIsoDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value: string | null | undefined) => {
  if (!value) return null;

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;

  return `${month}-${day}-${year}`;
};

const normalizeSearchText = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const hydratePullPlannerState = (value: unknown): PullPlannerState | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Record<keyof PullPlannerState, unknown>>;

  return {
    commendations:
      typeof candidate.commendations === "string"
        ? candidate.commendations
        : DEFAULT_PULL_PLANNER.commendations,
    commendationShopCurrentMonthClaimed:
      typeof candidate.commendationShopCurrentMonthClaimed === "boolean"
        ? candidate.commendationShopCurrentMonthClaimed
        : DEFAULT_PULL_PLANNER.commendationShopCurrentMonthClaimed,
    commendationShopMode:
      candidate.commendationShopMode === "phase1" ||
      candidate.commendationShopMode === "phase2" ||
      candidate.commendationShopMode === "phase3"
        ? candidate.commendationShopMode
        : DEFAULT_PULL_PLANNER.commendationShopMode,
    currentBannerKey:
      typeof candidate.currentBannerKey === "string"
        ? candidate.currentBannerKey
        : DEFAULT_PULL_PLANNER.currentBannerKey,
    customTargetDate:
      typeof candidate.customTargetDate === "string"
        ? candidate.customTargetDate
        : DEFAULT_PULL_PLANNER.customTargetDate,
    dailyMissionEnabled:
      typeof candidate.dailyMissionEnabled === "boolean"
        ? candidate.dailyMissionEnabled
        : DEFAULT_PULL_PLANNER.dailyMissionEnabled,
    distinctions:
      typeof candidate.distinctions === "string"
        ? candidate.distinctions
        : DEFAULT_PULL_PLANNER.distinctions,
    distinctionShopCurrentMonthClaimed:
      typeof candidate.distinctionShopCurrentMonthClaimed === "boolean"
        ? candidate.distinctionShopCurrentMonthClaimed
        : DEFAULT_PULL_PLANNER.distinctionShopCurrentMonthClaimed,
    eventRewardsEnabled:
      typeof candidate.eventRewardsEnabled === "boolean"
        ? candidate.eventRewardsEnabled
        : DEFAULT_PULL_PLANNER.eventRewardsEnabled,
    eventShopEnabled:
      typeof candidate.eventShopEnabled === "boolean"
        ? candidate.eventShopEnabled
        : DEFAULT_PULL_PLANNER.eventShopEnabled,
    intelligenceCertificates:
      typeof candidate.intelligenceCertificates === "string"
        ? candidate.intelligenceCertificates
        : DEFAULT_PULL_PLANNER.intelligenceCertificates,
    monthlyCardEnabled:
      typeof candidate.monthlyCardEnabled === "boolean"
        ? candidate.monthlyCardEnabled
        : DEFAULT_PULL_PLANNER.monthlyCardEnabled,
    monthlySignInEnabled:
      typeof candidate.monthlySignInEnabled === "boolean"
        ? candidate.monthlySignInEnabled
        : DEFAULT_PULL_PLANNER.monthlySignInEnabled,
    originiumShards:
      typeof candidate.originiumShards === "string"
        ? candidate.originiumShards
        : DEFAULT_PULL_PLANNER.originiumShards,
    originitePrime:
      typeof candidate.originitePrime === "string"
        ? candidate.originitePrime
        : DEFAULT_PULL_PLANNER.originitePrime,
    orundum:
      typeof candidate.orundum === "string"
        ? candidate.orundum
        : DEFAULT_PULL_PLANNER.orundum,
    permits:
      typeof candidate.permits === "string"
        ? candidate.permits
        : DEFAULT_PULL_PLANNER.permits,
    targetPulls:
      typeof candidate.targetPulls === "string"
        ? candidate.targetPulls
        : DEFAULT_PULL_PLANNER.targetPulls,
    weeklyMissionEnabled:
      typeof candidate.weeklyMissionEnabled === "boolean"
        ? candidate.weeklyMissionEnabled
        : DEFAULT_PULL_PLANNER.weeklyMissionEnabled,
    weeklyRegularOrundum:
      typeof candidate.weeklyRegularOrundum === "string"
        ? candidate.weeklyRegularOrundum
        : DEFAULT_PULL_PLANNER.weeklyRegularOrundum,
  };
};

const countReachableShopMonths = (startTs: number, endTs: number) => {
  if (endTs < startTs) return 0;

  const startDate = new Date(startTs);
  const endDate = new Date(endTs);
  const monthDiff =
    (endDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    (endDate.getUTCMonth() - startDate.getUTCMonth());

  return Math.max(0, monthDiff + 1);
};

const countReachableMonthlyDay = (
  startTs: number,
  endTs: number,
  dayOfMonth: number,
) => {
  if (endTs < startTs) return 0;

  const startDate = new Date(startTs);
  const endDate = new Date(endTs);
  const results: number[] = [];
  let year = startDate.getUTCFullYear();
  let month = startDate.getUTCMonth();

  while (
    year < endDate.getUTCFullYear() ||
    (year === endDate.getUTCFullYear() && month <= endDate.getUTCMonth())
  ) {
    const candidateTs = Date.UTC(year, month, dayOfMonth);
    if (candidateTs >= startTs && candidateTs <= endTs) {
      results.push(candidateTs);
    }

    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return results.length;
};

const calculateCommendationShopPurchases = (
  balance: number,
  reachableMonths: number,
  mode: CommendationShopMode,
): CommendationShopPurchases => {
  if (balance <= 0 || reachableMonths <= 0) {
    return {
      breakdown: [],
      permits: 0,
      phase1Months: 0,
      phase2Permits: 0,
      phase3Bundles: 0,
      orundum: 0,
      remaining: balance,
      spent: 0,
    };
  }

  let remaining = balance;
  let spent = 0;
  let permits = 0;
  let orundum = 0;
  let phase1Months = 0;
  let phase2Permits = 0;
  let phase3Bundles = 0;
  const breakdown: CommendationShopMonthBreakdown[] = [];

  for (let monthIndex = 0; monthIndex < reachableMonths; monthIndex += 1) {
    const monthBreakdown: CommendationShopMonthBreakdown = {
      month: monthIndex + 1,
      orundum: 0,
      phase1OrundumBundles: 0,
      phase1Permits: 0,
      phase2Permits: 0,
      phase3Bundles: 0,
      permits: 0,
      spent: 0,
    };

    if (mode === "phase1") {
      const monthPermits = Math.min(
        COMMENDATION_SHOP_MONTHLY_PERMITS,
        Math.floor(remaining / COMMENDATION_PERMIT_COST),
      );
      remaining -= monthPermits * COMMENDATION_PERMIT_COST;
      spent += monthPermits * COMMENDATION_PERMIT_COST;
      permits += monthPermits;
      monthBreakdown.phase1Permits = monthPermits;
      monthBreakdown.permits += monthPermits;
      monthBreakdown.spent += monthPermits * COMMENDATION_PERMIT_COST;

      const monthOrundumBundles = Math.min(
        6,
        Math.floor(remaining / COMMENDATION_ORUNDUM_BUNDLE_COST),
      );
      remaining -= monthOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_COST;
      spent += monthOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_COST;
      orundum += monthOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
      monthBreakdown.phase1OrundumBundles = monthOrundumBundles;
      monthBreakdown.orundum +=
        monthOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
      monthBreakdown.spent +=
        monthOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_COST;
      if (monthBreakdown.spent > 0) {
        breakdown.push(monthBreakdown);
      }
      continue;
    }

    if (remaining < COMMENDATION_PHASE_ONE_CLEAR_COST) {
      const fallbackPermits = Math.min(
        COMMENDATION_SHOP_MONTHLY_PERMITS,
        Math.floor(remaining / COMMENDATION_PERMIT_COST),
      );
      remaining -= fallbackPermits * COMMENDATION_PERMIT_COST;
      spent += fallbackPermits * COMMENDATION_PERMIT_COST;
      permits += fallbackPermits;
      monthBreakdown.phase1Permits = fallbackPermits;
      monthBreakdown.permits += fallbackPermits;
      monthBreakdown.spent += fallbackPermits * COMMENDATION_PERMIT_COST;

      const fallbackOrundumBundles = Math.min(
        6,
        Math.floor(remaining / COMMENDATION_ORUNDUM_BUNDLE_COST),
      );
      remaining -= fallbackOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_COST;
      spent += fallbackOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_COST;
      orundum += fallbackOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
      monthBreakdown.phase1OrundumBundles = fallbackOrundumBundles;
      monthBreakdown.orundum +=
        fallbackOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
      monthBreakdown.spent +=
        fallbackOrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_COST;
      if (monthBreakdown.spent > 0) {
        breakdown.push(monthBreakdown);
      }
      continue;
    }

    remaining -= COMMENDATION_PHASE_ONE_CLEAR_COST;
    spent += COMMENDATION_PHASE_ONE_CLEAR_COST;
    permits += COMMENDATION_SHOP_MONTHLY_PERMITS;
    orundum += 6 * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
    phase1Months += 1;
    monthBreakdown.phase1Permits = COMMENDATION_SHOP_MONTHLY_PERMITS;
    monthBreakdown.phase1OrundumBundles = 6;
    monthBreakdown.permits += COMMENDATION_SHOP_MONTHLY_PERMITS;
    monthBreakdown.orundum += 6 * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
    monthBreakdown.spent += COMMENDATION_PHASE_ONE_CLEAR_COST;

    for (const permitCost of COMMENDATION_PHASE_TWO_PERMIT_COSTS) {
      if (remaining < permitCost) {
        break;
      }

      remaining -= permitCost;
      spent += permitCost;
      permits += 1;
      phase2Permits += 1;
      monthBreakdown.phase2Permits += 1;
      monthBreakdown.permits += 1;
      monthBreakdown.spent += permitCost;
    }

    const extraPhaseTwoUnlockCost =
      COMMENDATION_PHASE_TWO_CLEAR_COST -
      COMMENDATION_PHASE_TWO_PERMIT_TOTAL_COST;

    if (mode !== "phase3" || remaining < extraPhaseTwoUnlockCost) {
      if (monthBreakdown.spent > 0) {
        breakdown.push(monthBreakdown);
      }
      continue;
    }

    remaining -= extraPhaseTwoUnlockCost;
    spent += extraPhaseTwoUnlockCost;
    monthBreakdown.spent += extraPhaseTwoUnlockCost;

    const monthPhase3Bundles = Math.floor(
      remaining / COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_COST,
    );
    remaining -=
      monthPhase3Bundles * COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_COST;
    spent += monthPhase3Bundles * COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_COST;
    orundum +=
      monthPhase3Bundles * COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_SIZE;
    phase3Bundles += monthPhase3Bundles;
    monthBreakdown.phase3Bundles = monthPhase3Bundles;
    monthBreakdown.orundum +=
      monthPhase3Bundles * COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_SIZE;
    monthBreakdown.spent +=
      monthPhase3Bundles * COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_COST;
    if (monthBreakdown.spent > 0) {
      breakdown.push(monthBreakdown);
    }
  }

  return {
    breakdown,
    permits,
    phase1Months,
    phase2Permits,
    phase3Bundles,
    orundum,
    remaining,
    spent,
  };
};

const calculateDistinctionShopPurchases = (
  balance: number,
  reachableMonths: number,
): DistinctionShopPurchases => {
  if (balance <= 0 || reachableMonths <= 0) {
    return {
      batchCounts: DISTINCTION_SHOP_BATCHES.map(() => 0),
      breakdown: [],
      monthsUsed: 0,
      permits: 0,
      remaining: balance,
      spent: 0,
    };
  }

  let remaining = balance;
  let spent = 0;
  let permits = 0;
  let monthsUsed = 0;
  const batchCounts = DISTINCTION_SHOP_BATCHES.map(() => 0);
  const breakdown: DistinctionShopMonthBreakdown[] = [];

  for (let monthIndex = 0; monthIndex < reachableMonths; monthIndex += 1) {
    let boughtThisMonth = false;
    const monthBreakdown: DistinctionShopMonthBreakdown = {
      batches: DISTINCTION_SHOP_BATCHES.map(() => 0),
      month: monthIndex + 1,
      permits: 0,
      spent: 0,
    };

    for (const [batchIndex, batch] of DISTINCTION_SHOP_BATCHES.entries()) {
      if (remaining < batch.cost) {
        break;
      }

      remaining -= batch.cost;
      spent += batch.cost;
      permits += batch.permits;
      batchCounts[batchIndex] += 1;
      monthBreakdown.batches[batchIndex] += 1;
      monthBreakdown.permits += batch.permits;
      monthBreakdown.spent += batch.cost;
      boughtThisMonth = true;
    }

    if (boughtThisMonth) {
      monthsUsed += 1;
      breakdown.push(monthBreakdown);
    }
  }

  return { batchCounts, breakdown, monthsUsed, permits, remaining, spent };
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

const LIMITED_BANNER_KEYWORD_REGEX =
  /limited|celebration|festival|carnival|crossover|collaboration|vision/i;

const getNormalizedBannerOperatorNames = (banner: BannerRelease) =>
  banner.operators.filter((name) => !isBannerArtifactName(name));

const getBannerKey = (banner: BannerRelease) =>
  `${banner.name}-${banner.cnStartDate ?? "cn"}-${banner.enStartDate ?? "en"}`;

const getMedianValue = (values: number[]) => {
  if (values.length === 0) return null;

  const sortedValues = [...values].sort((left, right) => left - right);
  return sortedValues[Math.floor(sortedValues.length / 2)] ?? null;
};

const getPullPlannerEventBonus = (
  banner: BannerRelease | null,
  bannerType: string | null,
): PullPlannerEventBonus | null => {
  if (!banner || !bannerType) return null;

  const normalizedText = normalizeSearchText(`${banner.category} ${banner.name}`);

  if (normalizedText.includes("sealed with time")) {
    return {
      confidence: "high",
      label: "Critical Phase Transition / Sealed With Time",
      note:
        "Tách riêng 1 vé 10-pull sự kiện và 14 free pull chỉ dùng cho banner này; 8,170 Orundum từ Wishing Tickets vẫn được tính là tài nguyên thường.",
      targetOnlyFreePulls: 14,
      targetOnlyPermits: 10,
      transferableOrundum: LIMITED_LUCKY_BOARD_EXPECTED_ORUNDUM,
      transferablePermits: 0,
    };
  }

  if (
    bannerType === "limited" &&
    /celebration|festival|carnival|vision/.test(normalizedText)
  ) {
    return {
      confidence: "medium",
      label: "Limited celebration-style event",
      note:
        "Ước tính theo pattern limited gần đây: 1 vé 10-pull và 14 free pull khóa trên banner target; Wishing Tickets/Lucky Strips trung bình 8,170 Orundum vẫn cộng như tài nguyên thường.",
      targetOnlyFreePulls: 14,
      targetOnlyPermits: 10,
      transferableOrundum: LIMITED_LUCKY_BOARD_EXPECTED_ORUNDUM,
      transferablePermits: 0,
    };
  }

  if (
    bannerType === "collab" &&
    /bang dream|ave mujica|cantilena puppae/.test(normalizedText)
  ) {
    return {
      confidence: "high",
      label: "BanG Dream collaboration sign-in",
      note:
        "Đã cộng 2 vé 10-pull sự kiện và 600 Orundum từ sign-in collab.",
      targetOnlyFreePulls: 0,
      targetOnlyPermits: 20,
      transferableOrundum: 600,
      transferablePermits: 0,
    };
  }

  return null;
};

const getEventShopPullsForBannerType = (bannerType: string | null) => {
  if (!bannerType) return 0;
  if (bannerType === "limited" || bannerType === "collab") return 5;
  if (bannerType === "event") {
    return 3;
  }

  return 0;
};

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

const getTierButtonClassName = (tier: TierRank, active = false) => {
  if (active) {
    return getTierBadgeClassName(tier);
  }

  switch (tier) {
    case "OP+":
      return "border-rose-200 text-rose-600 hover:border-rose-400 hover:bg-rose-500 hover:text-white";
    case "OP":
      return "border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-400 hover:text-white";
    case "OP-":
      return "border-orange-200 text-orange-600 hover:border-orange-300 hover:bg-orange-400 hover:text-white";
    case "S":
      return "border-amber-200 text-amber-600 hover:border-amber-300 hover:bg-amber-400 hover:text-white";
    case "A":
      return "border-emerald-200 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-400 hover:text-white";
    case "B":
      return "border-sky-200 text-sky-600 hover:border-sky-300 hover:bg-sky-400 hover:text-white";
    case "C":
      return "border-indigo-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-400 hover:text-white";
    case "D":
      return "border-violet-200 text-violet-600 hover:border-violet-300 hover:bg-violet-400 hover:text-white";
    case "E":
      return "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-500 hover:text-white";
    default: {
      const fallbackClasses = [
        "border-pink-200 text-pink-600 hover:border-pink-400 hover:bg-pink-500 hover:text-white",
        "border-cyan-200 text-cyan-600 hover:border-cyan-400 hover:bg-cyan-500 hover:text-white",
        "border-lime-200 text-lime-600 hover:border-lime-400 hover:bg-lime-500 hover:text-white",
        "border-fuchsia-200 text-fuchsia-600 hover:border-fuchsia-400 hover:bg-fuchsia-500 hover:text-white",
        "border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-500 hover:text-white",
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
      <HoverCardContent className="w-auto min-w-[180px] rounded-2xl border-slate-200 bg-white p-3 shadow-xl">
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
      <PopoverContent className="w-auto min-w-[220px] rounded-2xl border-slate-200 bg-white p-3 shadow-xl">
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
              className={`rounded-xl ${getTierButtonClassName(tier, currentTier === tier)}`}
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

const UI_TEXT = {
  appTagline:
    "Tra cứu tài khoản, theo dõi tin tức và kiểm tra lịch sử gacha Arknights.",
  searchTitle: "Tra cứu tài khoản",
  searchDescription:
    "Nhập UID để lấy thông tin Doctor và mở các công cụ liên quan.",
  uidPlaceholder: "Nhập UID của bạn",
  searchButton: "Tra cứu",
  profileTitle: "Hồ sơ Doctor",
  uidLabel: "UID",
  nicknameLabel: "Tên hiển thị",
  levelLabel: "Cấp Doctor",
  eventsTab: "Tin tức",
  rewardsTab: "Đổi quà",
  gachaTab: "Gacha",
  detailsButton: "Xem bài gốc",
  rewardsTitle: "Cổng đổi quà chính thức",
  rewardsDescription:
    "Mở trang redeem của Arknights Global để nhập code và nhận quà.",
  redeemButton: "Mở trang đổi quà",
  codesTitle: "Code hiện có",
  copyButton: "Sao chép",
  gachaTitle: "Tra cứu lịch sử gacha",
  gachaDescription: "Dán cookie lấy từ",
  cookiePlaceholder: "Nhập cookie hoặc token của bạn",
  gachaSearchButton: "Tải lịch sử",
  gachaLoading: "Đang tải lịch sử gacha...",
  totalPullsLabel: "Tổng lượt kéo",
  recentHistoryTitle: "Lịch sử gần đây",
  timeColumn: "Thời gian",
  operatorColumn: "Nhân vật",
  rarityColumn: "Độ hiếm",
  typeColumn: "Loại",
  poolColumn: "Banner",
  noGachaData: "Không tìm thấy dữ liệu gacha.",
  perPageLabel: "Hiển thị",
  previousNews: "Tin trước",
  nextNews: "Tin sau",
  translateIdle: "Dịch nhanh",
  translateActive: "Đang dịch",
  invalidUidError: "UID không hợp lệ. Vui lòng kiểm tra lại.",
  playerInfoMissing: "Không tìm thấy thông tin Doctor.",
  connectionError: "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.",
  invalidCookieError: "Cookie không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.",
} as const;

type GameUserPageProps = {
  initialActiveTab?: MainTab;
  initialToolsTab?: ToolTab;
  standaloneToolPage?: boolean;
};

export function GameUserPage({
  initialActiveTab = "tools",
  initialToolsTab = "pull-planner",
  standaloneToolPage = false,
}: GameUserPageProps) {
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
  const [pullPlanner, setPullPlanner] =
    useState<PullPlannerState>(DEFAULT_PULL_PLANNER);
  const [hasHydratedPullPlanner, setHasHydratedPullPlanner] = useState(false);
  const [selectedRecruitmentTags, setSelectedRecruitmentTags] = useState<RecruitmentTag[]>(
    [],
  );
  const recruitmentTagButtonRefs = useRef<
    Partial<Record<RecruitmentTag, HTMLButtonElement | null>>
  >({});
  const pendingRecruitmentScrollAnchorRef = useRef<{
    tag: RecruitmentTag;
    top: number;
  } | null>(null);
  const [recruitmentTargetInput, setRecruitmentTargetInput] = useState("");
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
  const [localTierLists, setLocalTierLists] = useState<SavedTierList[]>([]);
  const [hasHydratedLocalTierLists, setHasHydratedLocalTierLists] = useState(false);
  const [isTierListLoading, setIsTierListLoading] = useState(false);
  const [selectedTierListId, setSelectedTierListId] = useState(
    DEFAULT_SAVED_TIER_LISTS[0]?.id ?? "",
  );
  const [selectedTierListSource, setSelectedTierListSource] = useState<"public" | "local">(
    "public",
  );
  const [editingTierListId, setEditingTierListId] = useState("");
  const [editingTierListSource, setEditingTierListSource] = useState<"public" | "local">(
    "public",
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
  const [showReleasedBanners, setShowReleasedBanners] = useState(false);
  const tierListNameIssue = tierListName.trim()
    ? findTierListNameIssue(tierListName)
    : "";
  const showTierListError = (message: string) => {
    setErrorMessage(message);
    toast.error(message);
  };
  const plannerOrundum = Math.max(0, parseNumberInput(pullPlanner.orundum));
  const plannerPrime = Math.max(0, parseNumberInput(pullPlanner.originitePrime));
  const plannerPermits = Math.max(0, parseNumberInput(pullPlanner.permits));
  const plannerIntelligenceCertificates = Math.max(
    0,
    Math.floor(parseNumberInput(pullPlanner.intelligenceCertificates)),
  );
  const plannerIntelligenceOrundum =
    Math.floor(
      plannerIntelligenceCertificates / INTELLIGENCE_CERTIFICATE_ORUNDUM_COST,
    ) * INTELLIGENCE_CERTIFICATE_ORUNDUM_REWARD;
  const plannerCommendations = Math.max(
    0,
    Math.floor(parseNumberInput(pullPlanner.commendations)),
  );
  const plannerDistinctions = Math.max(
    0,
    Math.floor(parseNumberInput(pullPlanner.distinctions)),
  );
  const plannerCommendationShopMode = pullPlanner.commendationShopMode;
  const plannerShards = Math.max(0, Math.floor(parseNumberInput(pullPlanner.originiumShards)));
  const plannerShardOrundum = Math.floor(plannerShards / 2) * 20;
  const plannerCurrentOrundum =
    plannerOrundum +
    plannerPrime * 180 +
    plannerShardOrundum +
    plannerIntelligenceOrundum;
  const plannerCurrentPulls =
    plannerPermits + Math.floor(plannerCurrentOrundum / 600);
  const plannerCurrentLeftoverOrundum = plannerCurrentOrundum % 600;
  const limitedOperatorNames = new Set(
    operatorData
      .filter((operator) => operator.limited)
      .map((operator) => operator.name.toLowerCase()),
  );
  const isBannerLimited = (banner: BannerRelease) =>
    banner.limited ||
    LIMITED_BANNER_KEYWORD_REGEX.test(`${banner.category} ${banner.name}`) ||
    getNormalizedBannerOperatorNames(banner).some((operatorName) =>
      limitedOperatorNames.has(operatorName.toLowerCase()),
    );
  const getBannerTypeBucket = (banner: BannerRelease) => {
    const text = `${banner.category} ${banner.name}`.toLowerCase();

    if (/collab|crossover|collaboration/i.test(text)) return "collab";
    if (/kernel/i.test(text)) return "kernel";
    if (/joint operation/i.test(text)) return "joint-operation";
    if (/standard/i.test(text)) return "standard";
    if (isBannerLimited(banner)) return "limited";
    if (/special/i.test(text)) return "special";

    return "event";
  };
  const recruitmentComboResults = getRecruitmentComboResults(selectedRecruitmentTags);
  useLayoutEffect(() => {
    const pendingAnchor = pendingRecruitmentScrollAnchorRef.current;

    if (!pendingAnchor) {
      return;
    }

    const buttonElement = recruitmentTagButtonRefs.current[pendingAnchor.tag];

    if (!buttonElement) {
      pendingRecruitmentScrollAnchorRef.current = null;
      return;
    }

    const nextTop = buttonElement.getBoundingClientRect().top;
    const delta = nextTop - pendingAnchor.top;

    if (Math.abs(delta) > 0.5) {
      window.scrollTo({
        top: window.scrollY + delta,
        behavior: "auto",
      });
    }

    pendingRecruitmentScrollAnchorRef.current = null;
  }, [selectedRecruitmentTags]);
  const normalizedRecruitmentTargetInput = normalizeSearchText(recruitmentTargetInput);
  const recruitmentTargetMatches = normalizedRecruitmentTargetInput
    ? RECRUITMENT_OPERATORS.filter((operator) =>
        normalizeSearchText(operator.name).includes(normalizedRecruitmentTargetInput),
      ).sort((left, right) => {
        const leftExact =
          normalizeSearchText(left.name) === normalizedRecruitmentTargetInput;
        const rightExact =
          normalizeSearchText(right.name) === normalizedRecruitmentTargetInput;

        if (leftExact !== rightExact) {
          return leftExact ? -1 : 1;
        }
        if (left.rarity !== right.rarity) {
          return right.rarity - left.rarity;
        }

        return left.name.localeCompare(right.name);
      })
    : [];
  const selectedRecruitmentTargetOperator = recruitmentTargetMatches[0] ?? null;
  const recruitmentTargetSuggestions = getRecruitmentSuggestionsForOperator(
    selectedRecruitmentTargetOperator,
  );
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
          limited: knownOperator?.limited ?? isBannerLimited(banner),
          name: operatorName,
          rarity: knownOperator?.rarity ?? banner.operatorRarities[operatorName] ?? "?",
          releaseDate: nextReleaseDate,
          releaseTs: nextReleaseTs,
        });
      }
    }

    return [...merged.values()];
  })();
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
  const bannerPredictionDetailsByKey = (() => {
    const historicalSamples = bannerData
      .map((banner) => {
        const cnTs = parseIsoDate(banner.cnStartDate);
        const enTs = parseIsoDate(banner.enStartDate);

        if (cnTs === null || enTs === null || enTs < cnTs) {
          return null;
        }

        const visibleOperators = getNormalizedBannerOperatorNames(banner);
        const newOperatorCount = visibleOperators.filter(
          (operatorName) =>
            banner.enStartDate !== null &&
            earliestReleasedBannerDateByOperator.get(operatorName) ===
              banner.enStartDate,
        ).length;

        return {
          enTs,
          lagDays: Math.round((enTs - cnTs) / DAY_MS),
          limited: isBannerLimited(banner),
          newOperatorCount,
          operatorCount: visibleOperators.length,
          type: getBannerTypeBucket(banner),
        } satisfies BannerLagSample;
      })
      .filter((sample): sample is BannerLagSample => sample !== null)
      .sort((left, right) => right.enTs - left.enTs);
    const defaultLagDays =
      getMedianValue(historicalSamples.slice(0, 12).map((sample) => sample.lagDays)) ??
      180;
    const predictionStrategies: Array<{
      confidence: BannerPredictionDetails["confidence"];
      matches: (sample: BannerLagSample, target: BannerLagSample) => boolean;
      minSamples: number;
      reason: string;
    }> = [
      {
        confidence: "high",
        matches: (sample, target) =>
          sample.type === target.type &&
          sample.limited === target.limited &&
          Math.abs(sample.operatorCount - target.operatorCount) <= 2 &&
          Math.abs(sample.newOperatorCount - target.newOperatorCount) <= 1,
        minSamples: 2,
        reason: "cùng loại banner, quy mô rate-up và số operator mới gần giống",
      },
      {
        confidence: "high",
        matches: (sample, target) =>
          sample.type === target.type && sample.limited === target.limited,
        minSamples: 3,
        reason: "cùng loại banner",
      },
      {
        confidence: "medium",
        matches: (sample, target) =>
          sample.limited === target.limited &&
          Math.abs(sample.newOperatorCount - target.newOperatorCount) <= 1,
        minSamples: 4,
        reason: "cùng nhóm limited và độ mới tương đương",
      },
      {
        confidence: "medium",
        matches: (sample, target) => sample.limited === target.limited,
        minSamples: 4,
        reason: "cùng nhóm limited hoặc non-limited",
      },
      {
        confidence: "low",
        matches: (sample, target) =>
          Math.abs(sample.newOperatorCount - target.newOperatorCount) <= 1,
        minSamples: 4,
        reason: "số operator mới tương đương",
      },
      {
        confidence: "low",
        matches: () => true,
        minSamples: 1,
        reason: "mặt bằng banner gần đây",
      },
    ];
    const predictions = new Map<string, BannerPredictionDetails>();

    for (const banner of bannerData) {
      if (banner.enStartDate || !banner.cnStartDate) continue;

      const cnTs = parseIsoDate(banner.cnStartDate);
      if (cnTs === null) continue;

      const targetSample = {
        enTs: cnTs,
        lagDays: defaultLagDays,
        limited: isBannerLimited(banner),
        newOperatorCount:
          upcomingNewOperatorsByBanner.get(getBannerKey(banner))?.size ?? 0,
        operatorCount: getNormalizedBannerOperatorNames(banner).length,
        type: getBannerTypeBucket(banner),
      } satisfies BannerLagSample;

      let chosenSamples = historicalSamples.slice(0, 8);
      let chosenReason = "mặt bằng banner gần đây";
      let chosenConfidence: BannerPredictionDetails["confidence"] = "low";

      for (const strategy of predictionStrategies) {
        const matchedSamples = historicalSamples
          .filter((sample) => strategy.matches(sample, targetSample))
          .slice(0, 8);

        if (matchedSamples.length < strategy.minSamples) continue;

        chosenSamples = matchedSamples;
        chosenReason = strategy.reason;
        chosenConfidence = strategy.confidence;
        break;
      }

      const lagDays =
        getMedianValue(chosenSamples.map((sample) => sample.lagDays)) ??
        defaultLagDays;

      predictions.set(getBannerKey(banner), {
        confidence: chosenConfidence,
        date: formatIsoDate(cnTs + lagDays * DAY_MS),
        lagDays,
        reason: chosenReason,
        sampleSize: chosenSamples.length,
      });
    }

    return predictions;
  })();
  const plannerTodayIso = formatLocalIsoDate(new Date());
  const plannerTodayTs = parseIsoDate(plannerTodayIso) ?? Date.now();
  const pullPlannerTargets = bannerData
    .map((banner) => {
      if (banner.enStartDate) {
        return null;
      }

      const predictedDate =
        bannerPredictionDetailsByKey.get(getBannerKey(banner))?.date ?? null;

      if (!predictedDate) {
        return null;
      }

      const predictedTs = parseIsoDate(predictedDate);
      if (predictedTs === null || predictedTs < plannerTodayTs) {
        return null;
      }

      return {
        date: predictedDate,
        dateLabel: formatDisplayDate(predictedDate) ?? predictedDate,
        details: bannerPredictionDetailsByKey.get(getBannerKey(banner)) ?? null,
        id: getBannerKey(banner),
        isPredicted: true,
        name: banner.name,
      };
    })
    .filter((target): target is NonNullable<typeof target> => target !== null)
    .sort((left, right) => left.date.localeCompare(right.date));
  const customPullPlannerTargetTs = parseIsoDate(pullPlanner.customTargetDate);
  const customPullPlannerTarget =
    customPullPlannerTargetTs !== null && customPullPlannerTargetTs >= plannerTodayTs
      ? {
          date: pullPlanner.customTargetDate,
          dateLabel: formatDisplayDate(pullPlanner.customTargetDate) ?? pullPlanner.customTargetDate,
          details: null,
          id: CUSTOM_PULL_PLANNER_TARGET_KEY,
          isPredicted: false,
          name: "Ngày tự chọn",
        }
      : null;
  const selectedPullPlannerTarget =
    pullPlanner.currentBannerKey === CUSTOM_PULL_PLANNER_TARGET_KEY
      ? customPullPlannerTarget
      : pullPlannerTargets.find((target) => target.id === pullPlanner.currentBannerKey) ??
        pullPlannerTargets[0] ??
        customPullPlannerTarget;
  const effectivePullPlannerTarget = selectedPullPlannerTarget;
  const plannerDaysUntilBanner = effectivePullPlannerTarget
    ? Math.max(
        0,
        Math.ceil(
          ((parseIsoDate(effectivePullPlannerTarget.date) ?? plannerTodayTs) -
            plannerTodayTs) /
            DAY_MS,
        ),
      )
    : 0;
  const plannerWeeksUntilBanner = Math.floor(plannerDaysUntilBanner / 7);
  const plannerTargetTs =
    effectivePullPlannerTarget
      ? parseIsoDate(effectivePullPlannerTarget.date) ?? plannerTodayTs
      : plannerTodayTs;
  const plannerReachableShopMonths = countReachableShopMonths(
    plannerTodayTs,
    plannerTargetTs,
  );
  const plannerReachableCommendationShopMonths = Math.max(
    0,
    plannerReachableShopMonths -
      (pullPlanner.commendationShopCurrentMonthClaimed ? 1 : 0),
  );
  const plannerReachableDistinctionShopMonths = Math.max(
    0,
    plannerReachableShopMonths -
      (pullPlanner.distinctionShopCurrentMonthClaimed ? 1 : 0),
  );
  const plannerReachableSignInPermits = countReachableMonthlyDay(
    plannerTodayTs,
    plannerTargetTs,
    DAILY_SIGNIN_PERMIT_DAY,
  );
  const plannerWeeklyRegularOrundum = Math.min(
    MAX_WEEKLY_ANNIHILATION_ORUNDUM,
    Math.max(
      MIN_WEEKLY_ANNIHILATION_ORUNDUM,
      Math.round(
        parseNumberInput(pullPlanner.weeklyRegularOrundum) /
          WEEKLY_ANNIHILATION_ORUNDUM_STEP,
      ) * WEEKLY_ANNIHILATION_ORUNDUM_STEP,
    ),
  );
  const plannerFutureDailyOrundum = pullPlanner.dailyMissionEnabled
    ? plannerDaysUntilBanner * 100
    : 0;
  const plannerFutureWeeklyMissionOrundum = pullPlanner.weeklyMissionEnabled
    ? plannerWeeksUntilBanner * 500
    : 0;
  const plannerFutureMonthlyCardOrundum = pullPlanner.monthlyCardEnabled
    ? plannerDaysUntilBanner * 200
    : 0;
  const plannerFutureRegularOrundum =
    plannerWeeksUntilBanner * plannerWeeklyRegularOrundum;
  const plannerTimelineEventBonuses = pullPlanner.eventRewardsEnabled
    ? pullPlannerTargets
        .filter(
          (target) =>
            selectedPullPlannerTarget !== null &&
            target.date <= selectedPullPlannerTarget.date,
        )
        .map((target) => {
          const banner =
            bannerData.find((entry) => getBannerKey(entry) === target.id) ?? null;
          if (!banner) {
            return null;
          }

          const bannerType = getBannerTypeBucket(banner);
          const bonus = getPullPlannerEventBonus(banner, bannerType);

          return bonus
            ? {
                bannerId: target.id,
                bannerName: target.name,
                date: target.date,
                bonus,
              }
            : null;
        })
        .filter(
          (
            entry,
          ): entry is {
            bannerId: string;
            bannerName: string;
            date: string;
            bonus: NonNullable<ReturnType<typeof getPullPlannerEventBonus>>;
          } => entry !== null,
        )
    : [];
  const plannerTimelineEventShopEntries =
    pullPlanner.eventShopEnabled &&
    pullPlanner.eventRewardsEnabled &&
    selectedPullPlannerTarget !== null
      ? pullPlannerTargets
          .filter((target) => target.date <= selectedPullPlannerTarget.date)
          .map((target) => {
            const banner =
              bannerData.find((entry) => getBannerKey(entry) === target.id) ?? null;
            if (!banner) {
              return null;
            }

            const bannerType = getBannerTypeBucket(banner);
            const pulls = getEventShopPullsForBannerType(bannerType);

            return pulls > 0
              ? {
                  bannerName: target.name,
                  bannerType,
                  date: target.date,
                  pulls,
                }
              : null;
          })
          .filter(
            (
              entry,
            ): entry is {
              bannerName: string;
              bannerType: string;
              date: string;
              pulls: number;
            } => entry !== null,
          )
      : [];
  const plannerCommendationShopPurchases = calculateCommendationShopPurchases(
    plannerCommendations,
    plannerReachableCommendationShopMonths,
    plannerCommendationShopMode,
  );
  const plannerDistinctionShopPurchases = calculateDistinctionShopPurchases(
    plannerDistinctions,
    plannerReachableDistinctionShopMonths,
  );
  const plannerFutureCommendationShopOrundum =
    plannerCommendationShopPurchases.orundum;
  const plannerFutureCommendationShopPermits =
    plannerCommendationShopPurchases.permits;
  const plannerFutureDistinctionShopPermits =
    plannerDistinctionShopPurchases.permits;
  const plannerFutureMonthlySignInPermits = pullPlanner.monthlySignInEnabled
    ? plannerReachableSignInPermits
    : 0;
  const plannerFutureStableOrundum =
    plannerFutureDailyOrundum +
    plannerFutureWeeklyMissionOrundum +
    plannerFutureMonthlyCardOrundum +
    plannerFutureRegularOrundum +
    plannerFutureCommendationShopOrundum;
  const plannerProjectedStartOrundum =
    plannerCurrentOrundum + plannerFutureStableOrundum;
  const plannerProjectedStartPermits =
    plannerPermits +
    plannerFutureCommendationShopPermits +
    plannerFutureDistinctionShopPermits +
    plannerFutureMonthlySignInPermits;
  const plannerTransferableEventOrundum = plannerTimelineEventBonuses.reduce(
    (sum, entry) => sum + entry.bonus.transferableOrundum,
    0,
  );
  const plannerTransferableEventPermits = plannerTimelineEventBonuses.reduce(
    (sum, entry) => sum + entry.bonus.transferablePermits,
    0,
  );
  const plannerTargetOnlyEventEntries =
    selectedPullPlannerTarget === null
      ? []
      : plannerTimelineEventBonuses.filter(
          (entry) =>
            entry.bannerId === selectedPullPlannerTarget.id &&
            (entry.bonus.targetOnlyPermits > 0 || entry.bonus.targetOnlyFreePulls > 0),
        );
  const plannerTargetOnlyEventPermits = plannerTargetOnlyEventEntries.reduce(
    (sum, entry) => sum + entry.bonus.targetOnlyPermits,
    0,
  );
  const plannerTargetOnlyEventFreePulls = plannerTargetOnlyEventEntries.reduce(
    (sum, entry) => sum + entry.bonus.targetOnlyFreePulls,
    0,
  );
  const plannerEventShopOrundum = 0;
  const plannerEventShopPermits = plannerTimelineEventShopEntries.reduce(
    (sum, entry) => sum + entry.pulls,
    0,
  );
  const plannerProjectedTransferableOrundum =
    plannerProjectedStartOrundum +
    plannerTransferableEventOrundum +
    plannerEventShopOrundum;
  const plannerProjectedTransferablePermits =
    plannerProjectedStartPermits +
    plannerTransferableEventPermits +
    plannerEventShopPermits;
  const plannerProjectedTransferablePulls =
    plannerProjectedTransferablePermits +
    Math.floor(plannerProjectedTransferableOrundum / 600);
  const plannerProjectedTransferableLeftoverOrundum =
    plannerProjectedTransferableOrundum % 600;
  const plannerTargetOnlyPulls =
    plannerTargetOnlyEventPermits + plannerTargetOnlyEventFreePulls;
  const plannerProjectedBannerPulls =
    plannerProjectedTransferablePulls + plannerTargetOnlyPulls;
  const plannerProjectedBannerLeftoverOrundum =
    plannerProjectedTransferableLeftoverOrundum;
  const getBannerDisplaySortTs = (banner: BannerRelease) => {
    const isReleased = Boolean(banner.enStartDate);
    const predictionDetails =
      bannerPredictionDetailsByKey.get(getBannerKey(banner)) ?? null;
    const sortDate = isReleased
      ? banner.enStartDate ?? banner.releaseDate
      : predictionDetails?.date ?? banner.cnStartDate ?? banner.releaseDate;
    const sortTs = Date.parse(`${sortDate}T00:00:00Z`);

    return Number.isFinite(sortTs) ? sortTs : Number.MAX_SAFE_INTEGER;
  };
  const filteredBanners = [...bannerData]
    .filter((banner) => showReleasedBanners || !banner.enStartDate)
    .sort((a, b) => {
      const aSortTs = getBannerDisplaySortTs(a);
      const bSortTs = getBannerDisplaySortTs(b);

      if (aSortTs !== bSortTs) {
        return aSortTs - bSortTs;
      }

      return a.name.localeCompare(b.name);
    })
    .filter((banner) => {
      const keyword = normalizeSearchText(bannerSearch);
      if (!keyword) return true;

      const searchableValues = [
        banner.name,
        banner.category,
        `[${banner.category}] ${banner.name}`,
        ...getNormalizedBannerOperatorNames(banner),
      ];

      return searchableValues.some((value) =>
        normalizeSearchText(value).includes(keyword),
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
  const selectedTierListPool =
    selectedTierListSource === "local" ? localTierLists : savedTierLists;
  const selectedTierList =
    selectedTierListPool.find((tierList) => tierList.id === selectedTierListId) ??
    selectedTierListPool[0] ??
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

  const readJsonResponse = async (res: Response) => {
    const raw = await res.text();
    const contentType = res.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return {
        data: null as { data?: unknown; message?: string } | null,
        message: res.ok
          ? "API trả về nội dung không hợp lệ."
          : `API lỗi ${res.status}: ${raw.slice(0, 120)}`,
      };
    }

    try {
      return {
        data: JSON.parse(raw) as { data?: unknown; message?: string },
        message: null,
      };
    } catch {
      return {
        data: null as { data?: unknown; message?: string } | null,
        message: "Không thể đọc dữ liệu JSON từ API.",
      };
    }
  };

  const fetchWithTimeout = async (input: RequestInfo | URL, timeoutMs = 20000) => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(input, { signal: controller.signal });
    } finally {
      window.clearTimeout(timer);
    }
  };

  useEffect(() => {
    const fetchOperatorReleases = async () => {
      setIsOperatorLoading(true);
      setOperatorError("");

      try {
        const res = await fetchWithTimeout("/api/operators");
        const { data: result, message } = await readJsonResponse(res);

        if (!res.ok) {
          setOperatorError(
            result?.message || message || "Không thể tải danh sách character.",
          );
          setOperatorData([]);
          return;
        }

        setOperatorData(Array.isArray(result?.data) ? result.data : []);
      } catch (error) {
        console.error("Failed to fetch operator releases", error);
        setOperatorError(
          error instanceof Error && error.name === "AbortError"
            ? "Tải danh sách character quá lâu, vui lòng thử lại."
            : "Không thể tải danh sách character.",
        );
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
        const res = await fetchWithTimeout("/api/banners");
        const { data: result, message } = await readJsonResponse(res);

        if (!res.ok) {
          setBannerError(
            result?.message || message || "Không thể tải danh sách banner.",
          );
          setBannerData([]);
          return;
        }

        setBannerData(Array.isArray(result?.data) ? result.data : []);
      } catch (error) {
        console.error("Failed to fetch banner releases", error);
        setBannerError(
          error instanceof Error && error.name === "AbortError"
            ? "Tải danh sách banner quá lâu, vui lòng thử lại."
            : "Không thể tải danh sách banner.",
        );
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
  }, [bannerSearch, showReleasedBanners]);

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
    const savedLocalTierLists = localStorage.getItem(LOCAL_TIER_LISTS_KEY);
    if (savedLocalTierLists) {
      try {
        const parsed = JSON.parse(savedLocalTierLists);
        const hydratedLocalTierLists = Array.isArray(parsed)
          ? parsed
              .map((tierList: unknown) => hydrateSavedTierList(tierList))
              .filter((tierList: SavedTierList | null): tierList is SavedTierList => tierList !== null)
          : [];

        setLocalTierLists(hydratedLocalTierLists);
      } catch (error) {
        console.error(error);
      }
    }
    setHasHydratedLocalTierLists(true);
    void loadSavedTierListsFromMongo();
    const savedPullPlannerRaw = localStorage.getItem(PULL_PLANNER_STORAGE_KEY);
    if (savedPullPlannerRaw) {
      try {
        const parsed = JSON.parse(savedPullPlannerRaw) as unknown;
        const hydratedPullPlanner = hydratePullPlannerState(parsed);
        if (hydratedPullPlanner) {
          setPullPlanner(hydratedPullPlanner);
        }
      } catch (error) {
        console.error(error);
      }
    }
    setHasHydratedPullPlanner(true);
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
    if (!hasHydratedLocalTierLists) return;

    localStorage.setItem(LOCAL_TIER_LISTS_KEY, JSON.stringify(localTierLists));
  }, [hasHydratedLocalTierLists, localTierLists]);

  useEffect(() => {
    if (!hasHydratedPullPlanner) return;

    localStorage.setItem(PULL_PLANNER_STORAGE_KEY, JSON.stringify(pullPlanner));
  }, [hasHydratedPullPlanner, pullPlanner]);

  useEffect(() => {
    if (!hasHydratedPullPlanner) return;
    if (pullPlanner.currentBannerKey === CUSTOM_PULL_PLANNER_TARGET_KEY) return;

    const hasCurrentTarget = pullPlannerTargets.some(
      (target) => target.id === pullPlanner.currentBannerKey,
    );

    if ((!pullPlanner.currentBannerKey || !hasCurrentTarget) && pullPlannerTargets[0]) {
      setPullPlanner((current) => ({
        ...current,
        currentBannerKey: pullPlannerTargets[0].id,
      }));
    }
  }, [hasHydratedPullPlanner, pullPlanner.currentBannerKey, pullPlannerTargets]);

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
    const tierNameIssue = findTierNameIssue(trimmedTierName);
    if (tierNameIssue) {
      showTierListError(tierNameIssue);
      return;
    }

    const hasDuplicateTier = tierOrder.some(
      (tier) => tier.toLowerCase() === trimmedTierName.toLowerCase(),
    );
    if (hasDuplicateTier) {
      showTierListError("Tier này đã tồn tại.");
      return;
    }

    setTierOrder((current) => [...current, trimmedTierName]);
    setNewTierName("");
    setErrorMessage("");
    toast.success("Đã thêm tier.");
  };

  const handleDeleteTier = (tierToDelete: string) => {
    if (tierOrder.length <= 1) {
      showTierListError("Cần giữ lại ít nhất 1 tier.");
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
    toast.success(`Đã xóa tier ${tierToDelete}.`);
  };

  const handleMoveTier = (tierIndex: number, direction: number) => {
    if (direction !== -1 && direction !== 1) {
      return;
    }

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

  const handleSaveTierList = async () => {
    const trimmedName = tierListName.trim();
    if (!trimmedName) {
      setErrorMessage("Vui lòng nhập tên tier list trước khi lưu.");
      return;
    }

    const nextTierList: SavedTierList = {
      assignments: tierAssignments,
      authorName: userInfo?.name ?? "",
      authorUid: userInfo?.uid ?? uid.trim(),
      createdAt: Date.now(),
      id: `${Date.now()}`,
      likes: [],
      name: trimmedName,
      tiers: [...tierOrder],
    };

    try {
      const res = await fetch("/api/tierlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextTierList),
      });
      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.message || "Không thể lưu tier list.");
        return;
      }

      const savedTierList = hydrateSavedTierList(result.tierList) ?? nextTierList;
      setSavedTierLists((current) => [
        savedTierList,
        ...current.filter((tierList) => tierList.id !== savedTierList.id),
      ]);
      setSelectedTierListId(savedTierList.id);
      setTierListView("browse");
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Không thể lưu tier list.");
    }
  };

  const handleOpenSavedTierList = (tierList: SavedTierList) => {
    setSelectedTierListId(tierList.id);
  };

  const handleToggleSavedTierListLike = async (tierListId: string) => {
    const likedUid = userInfo?.uid ?? uid.trim();
    if (!likedUid) {
      showTierListError("Vui lòng nhập UID trước khi thích tier list.");
      return;
    }

    try {
      const res = await fetch("/api/tierlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tierListId, uid: likedUid }),
      });
      const result = await res.json();

      if (!res.ok || !Array.isArray(result.likes)) {
        showTierListError(result.message || "Không thể cập nhật lượt thích.");
        return;
      }

      setSavedTierLists((current) =>
        current.map((tierList) =>
          tierList.id === tierListId ? { ...tierList, likes: result.likes } : tierList,
        ),
      );
      setErrorMessage("");
      toast.success("Đã thích tier list.");
    } catch (error) {
      console.error(error);
      showTierListError("Không thể cập nhật lượt thích.");
    }
  };

  const handleLoadSavedTierListToEditor = (tierList: SavedTierList) => {
    setTierAssignments(tierList.assignments);
    setTierListName(tierList.name);
    setTierOrder([...tierList.tiers]);
    setTierListView("create");
  };

  const handleDeleteSavedTierList = async (id: string) => {
    const currentAuthorUid = userInfo?.uid ?? uid.trim();
    if (!currentAuthorUid) {
      showTierListError("Vui lòng nhập UID trước khi xóa tier list công khai.");
      return;
    }

    try {
      const res = await fetch("/api/tierlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, uid: currentAuthorUid }),
      });
      const result = await res.json();

      if (!res.ok) {
        showTierListError(result.message || "Không thể xóa tier list.");
        return;
      }

      setSavedTierLists((current) => current.filter((tierList) => tierList.id !== id));
      setSelectedTierListId((current) => (current === id ? "" : current));
      setErrorMessage("");
      toast.success("Đã xóa tier list công khai.");
    } catch (error) {
      console.error(error);
      showTierListError("Không thể xóa tier list.");
    }
  };

  const handleResetTierListEditor = () => {
    setTierAssignments({});
    setTierListName("");
    setNewTierName("");
    setTierOrder([...DEFAULT_TIER_ORDER]);
    setEditingTierListId("");
    setEditingTierListSource("public");
    setTierListView("create");
    setErrorMessage("");
    toast.success("Đã tạo bản nháp tierlist mới.");
  };

  const handleOpenTierListForView = (
    tierList: SavedTierList,
    source: "public" | "local" = "public",
  ) => {
    setSelectedTierListId(tierList.id);
    setSelectedTierListSource(source);
    setTierListView("browse");
  };

  const handleEditTierListWithConfirm = (
    tierList: SavedTierList,
    source: "public" | "local" = "public",
  ) => {
    setTierAssignments(tierList.assignments);
    setTierListName(tierList.name.slice(0, TIER_LIST_NAME_MAX_LENGTH));
    setTierOrder([...tierList.tiers]);
    setEditingTierListId(tierList.id);
    setEditingTierListSource(source);
    setTierListView("create");
    setErrorMessage("");
    toast.success("Đã mở tier list để sửa.");
  };

  const handleDeleteTierListWithConfirm = async (
    id: string,
    source: "public" | "local" = "public",
  ) => {
    if (source === "local") {
      setLocalTierLists((current) => current.filter((tierList) => tierList.id !== id));
      setSelectedTierListId((current) =>
        current === id && selectedTierListSource === "local" ? "" : current,
      );
      setErrorMessage("");
      toast.success("Đã xóa tier list tạo ở máy.");
      return;
    }

    await handleDeleteSavedTierList(id);
  };

  const handleSaveTierListWithConfirm = async (target: "public" | "local" = "public") => {
    const trimmedName = tierListName.trim();
    const nameIssue = findTierListNameIssue(trimmedName);
    if (nameIssue) {
      showTierListError(nameIssue);
      return;
    }

    const tierNameIssue = tierOrder.map((tier) => findTierNameIssue(tier)).find(Boolean);
    if (tierNameIssue) {
      showTierListError(tierNameIssue);
      return;
    }

    const currentAuthorUid = userInfo?.uid ?? uid.trim();
    if (target === "public" && !currentAuthorUid) {
      showTierListError("Vui lòng nhập UID trước khi lưu tier list công khai.");
      return;
    }

    const existingTierList =
      target === "local"
        ? localTierLists.find((tierList) => tierList.id === editingTierListId)
        : savedTierLists.find((tierList) => tierList.id === editingTierListId);
    const shouldUpdateExisting = Boolean(
      editingTierListId &&
        editingTierListSource === target &&
        (target === "local" || existingTierList?.authorUid === currentAuthorUid),
    );

    if (
      target === "public" &&
      !shouldUpdateExisting &&
      savedTierLists.some((tierList) => tierList.authorUid === currentAuthorUid)
    ) {
      showTierListError("Mỗi UID chỉ được tạo một tier list cho mọi người xem. Bạn vẫn có thể lưu không giới hạn ở mục tạo ở máy.");
      return;
    }

    const nextTierList: SavedTierList = {
      assignments: tierAssignments,
      authorName: userInfo?.name ?? "",
      authorUid: currentAuthorUid,
      createdAt: shouldUpdateExisting ? existingTierList?.createdAt ?? Date.now() : Date.now(),
      id: shouldUpdateExisting ? editingTierListId : `${target}-${Date.now()}`,
      likes: target === "public" ? existingTierList?.likes ?? [] : [],
      name: trimmedName,
      tiers: [...tierOrder],
    };

    if (target === "local") {
      setLocalTierLists((current) => [
        nextTierList,
        ...current.filter((tierList) => tierList.id !== nextTierList.id),
      ]);
      setSelectedTierListId(nextTierList.id);
      setSelectedTierListSource("local");
      setEditingTierListId(nextTierList.id);
      setEditingTierListSource("local");
      setTierListView("browse");
      setErrorMessage("");
      toast.success("Đã lưu tier list tạo ở máy.");
      return;
    }

    try {
      const res = await fetch("/api/tierlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextTierList),
      });
      const result = await res.json();

      if (!res.ok) {
        showTierListError(result.message || "Không thể lưu tier list.");
        return;
      }

      const savedTierList = hydrateSavedTierList(result.tierList) ?? nextTierList;
      setSavedTierLists((current) => [
        savedTierList,
        ...current.filter((tierList) => tierList.id !== savedTierList.id),
      ]);
      setSelectedTierListId(savedTierList.id);
      setSelectedTierListSource("public");
      setEditingTierListId(savedTierList.id);
      setEditingTierListSource("public");
      setTierListView("browse");
      setErrorMessage("");
      toast.success("Đã lưu tier list cho mọi người xem.");
    } catch (error) {
      console.error(error);
      showTierListError("Không thể lưu tier list.");
    }
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

  async function loadSavedTierListsFromMongo() {
    setIsTierListLoading(true);
    try {
      const res = await fetch("/api/tierlist");
      const result = await res.json();
      const hydratedTierLists = Array.isArray(result.tierLists)
        ? result.tierLists
            .map((tierList: unknown) => hydrateSavedTierList(tierList))
            .filter((tierList: SavedTierList | null): tierList is SavedTierList => tierList !== null)
        : [];

      setSavedTierLists(hydratedTierLists);
      setSelectedTierListId((current) =>
        current && hydratedTierLists.some((tierList: SavedTierList) => tierList.id === current)
          ? current
          : hydratedTierLists[0]?.id ?? "",
      );
    } catch (error) {
      console.error("Failed to load tier lists from MongoDB", error);
      setSavedTierLists([]);
      setSelectedTierListId("");
    } finally {
      setIsTierListLoading(false);
    }
  }

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

  const handlePullPlannerChange = (
    field: keyof PullPlannerState,
    value: string | boolean,
  ) => {
    setPullPlanner((current) => ({
      ...current,
      ...(field === "eventRewardsEnabled" && value === false
        ? { eventShopEnabled: false }
        : {}),
      [field]: value,
    }));
  };

  const handleToggleRecruitmentTag = (
    tag: RecruitmentTag,
    buttonElement: HTMLButtonElement,
  ) => {
    pendingRecruitmentScrollAnchorRef.current = {
      tag,
      top: buttonElement.getBoundingClientRect().top,
    };

    setSelectedRecruitmentTags((current) => {
      if (current.includes(tag)) {
        return current.filter((value) => value !== tag);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, tag];
    });
  };

  const renderStandaloneToolPage = standaloneToolPage && initialActiveTab === "tools";

  return (
    <div
      className={`min-h-screen bg-transparent text-slate-800 relative overflow-hidden font-sans selection:bg-sky-300/40 ${
        renderStandaloneToolPage ? "p-0" : "p-4"
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200/45 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-amber-200/35 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:32px_32px]" />

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
          background: #ffffff;
          border: 1px solid rgba(143, 188, 214, 0.42);
          box-shadow: 0 16px 40px -18px rgba(39, 94, 122, 0.28);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
          border: 1px solid rgba(14, 165, 233, 0.42);
          box-shadow: 0 20px 46px -14px rgba(46, 116, 148, 0.28), 0 0 24px rgba(125, 211, 252, 0.14);
          transform: translateY(-4px);
        }
        .hero-panel {
          background: #ffffff;
          border: 1px solid rgba(148, 184, 204, 0.42);
          box-shadow: 0 18px 50px -24px rgba(15, 23, 42, 0.28);
        }
        .hero-title {
          background: linear-gradient(135deg, #0f172a 0%, #155e75 42%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 18px rgba(255, 255, 255, 0.22);
        }
        .btn-primary {
          background: linear-gradient(135deg, #0f766e 0%, #0284c7 100%);
          background-size: 200% auto;
          transition: 0.5s;
          border: 1px solid rgba(255,255,255,0.5);
        }
        .btn-primary:hover {
          background-position: right center;
          box-shadow: 0 0 24px rgba(2, 132, 199, 0.28);
          border-color: rgba(255,255,255,0.8);
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      <div
        className={`relative z-10 ${renderStandaloneToolPage ? "w-full" : "mx-auto max-w-5xl"}`}
      >
        {/* Main Content */}
        <div className="animate-fade-in stagger-2">
            <Tabs value={initialActiveTab} className="w-full">

              <TabsContent
                value="tools"
                className="mt-0 focus-visible:outline-none space-y-6"
              >
                <ToolsTabContent
                  initialToolsTab={initialToolsTab}
                  renderStandaloneToolPage={renderStandaloneToolPage}
                  pullPlannerProps={{
                    TOOL_ICON_URLS,
                    handlePullPlannerChange,
                    plannerCommendationShopBreakdown:
                      plannerCommendationShopPurchases.breakdown,
                    plannerCurrentLeftoverOrundum,
                    plannerDistinctionShopBreakdown:
                      plannerDistinctionShopPurchases.breakdown,
                    plannerEventRewardEntries: plannerTimelineEventBonuses,
                    plannerEventShopEntries: plannerTimelineEventShopEntries,
                    plannerIntelligenceCertificates,
                    plannerIntelligenceOrundum,
                    plannerCurrentOrundum,
                    plannerCurrentPulls,
                    plannerDaysUntilBanner,
                    plannerOrundum,
                    plannerPermits,
                    plannerPrime,
                    plannerProjectedBannerLeftoverOrundum,
                    plannerProjectedBannerPulls,
                    plannerReachableCommendationShopMonths,
                    plannerReachableDistinctionShopMonths,
                    plannerShardOrundum,
                    plannerShards,
                    plannerTargetOnlyPulls,
                    pullPlanner,
                    pullPlannerTargets,
                    selectedPullPlannerTarget: effectivePullPlannerTarget,
                  }}
                  recruitmentProps={{
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
                  }}
                />
              </TabsContent>

              <CharactersTabContent
                filteredOperators={filteredOperators}
                formatDisplayDate={formatDisplayDate}
                getOperatorRarityValue={getOperatorRarityValue}
                getWikiImageName={getWikiImageName}
                isOperatorLoading={isOperatorLoading}
                operatorError={operatorError}
                operatorPage={operatorPage}
                operatorSearch={operatorSearch}
                operatorStarFilter={operatorStarFilter}
                operatorTotalPages={operatorTotalPages}
                paginatedOperators={paginatedOperators}
                setOperatorPage={setOperatorPage}
                setOperatorSearch={setOperatorSearch}
                setOperatorStarFilter={setOperatorStarFilter}
              />

              <BannersTabContent
                bannerError={bannerError}
                bannerPage={bannerPage}
                bannerPredictionDetailsByKey={bannerPredictionDetailsByKey}
                bannerSearch={bannerSearch}
                bannerTotalPages={bannerTotalPages}
                earliestReleasedBannerDateByOperator={earliestReleasedBannerDateByOperator}
                filteredBanners={filteredBanners}
                formatDisplayDate={formatDisplayDate}
                getBannerKey={getBannerKey}
                getNormalizedBannerOperatorNames={getNormalizedBannerOperatorNames}
                getWikiImageName={getWikiImageName}
                isBannerLimited={isBannerLimited}
                isBannerLoading={isBannerLoading}
                paginatedBanners={paginatedBanners}
                setBannerPage={setBannerPage}
                setBannerSearch={setBannerSearch}
                setShowReleasedBanners={setShowReleasedBanners}
                showReleasedBanners={showReleasedBanners}
                upcomingNewOperatorsByBanner={upcomingNewOperatorsByBanner}
              />

              <TierListTabContent
                getTierBadgeClassName={getTierBadgeClassName}
                currentUid={userInfo?.uid ?? uid.trim()}
                handleAddTier={handleAddTier}
                handleAssignOperatorToTier={handleAssignOperatorToTier}
                handleDeleteSavedTierList={handleDeleteTierListWithConfirm}
                handleDeleteTier={handleDeleteTier}
                handleLoadSavedTierListToEditor={handleEditTierListWithConfirm}
                handleMoveTier={handleMoveTier}
                handleOpenSavedTierList={handleOpenTierListForView}
                handleResetTierListEditor={handleResetTierListEditor}
                handleSaveTierList={handleSaveTierListWithConfirm}
                handleToggleSavedTierListLike={handleToggleSavedTierListLike}
                isTierListLoading={isTierListLoading}
                localTierLists={localTierLists}
                newTierName={newTierName}
                paginatedTierPoolCandidates={paginatedTierPoolCandidates}
                savedTierLists={savedTierLists}
                selectedTierBoard={selectedTierBoard}
                selectedTierList={selectedTierList}
                selectedTierListSource={selectedTierListSource}
                setNewTierName={setNewTierName}
                setTierAssignments={setTierAssignments}
                setTierListName={(value) =>
                  setTierListName(value.slice(0, TIER_LIST_NAME_MAX_LENGTH))
                }
                setTierListView={setTierListView}
                setTierPoolPage={setTierPoolPage}
                setTierSearch={setTierSearch}
                setTierStarFilter={setTierStarFilter}
                tierAssignments={tierAssignments}
                tierBoard={tierBoard}
                tierListName={tierListName}
                tierListNameIssue={tierListNameIssue}
                tierListNameMaxLength={TIER_LIST_NAME_MAX_LENGTH}
                tierNameMaxLength={TIER_NAME_MAX_LENGTH}
                tierListView={tierListView}
                tierOrder={tierOrder}
                tierPoolPage={tierPoolPage}
                tierPoolTotalPages={tierPoolTotalPages}
                tierSearch={tierSearch}
                tierStarFilter={tierStarFilter}
                unassignedOperatorCount={unassignedOperatorCount}
                unassignedTierCandidates={unassignedTierCandidates}
                TierAssignmentAvatar={TierAssignmentAvatar}
                TierOperatorAvatar={TierOperatorAvatar}
              />

              <NewsTabContent
                isNewsLoading={isNewsLoading}
                newsData={newsData}
                translateGameTerms={translateGameTerms}
              />

              <GachaTabContent
                cookieToken={cookieToken}
                effectiveGachaTotalPages={effectiveGachaTotalPages}
                errorMessage={errorMessage}
                filteredGachaData={filteredGachaData}
                gachaAttempted={gachaAttempted}
                gachaData={gachaData}
                gachaPage={gachaPage}
                gachaPageSize={gachaPageSize}
                gachaTypeFilter={gachaTypeFilter}
                getWikiImageName={getWikiImageName}
                handleGachaKeyPress={handleGachaKeyPress}
                handleGachaPageChange={handleGachaPageChange}
                handleGachaSizeChange={handleGachaSizeChange}
                handleSearchGacha={handleSearchGacha}
                isGachaLoading={isGachaLoading}
                paginatedGachaData={paginatedGachaData}
                setCookieToken={setCookieToken}
                setGachaTypeFilter={setGachaTypeFilter}
                setShowGachaSixStarOnly={setShowGachaSixStarOnly}
                showGachaSixStarOnly={showGachaSixStarOnly}
              />
            </Tabs>
          </div>
      </div>

      {/* Floating Pagination Bar */}
      {initialActiveTab === "events" && newsTotalPages > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg">
          <div className="flex items-center justify-between bg-white border border-slate-200/60 p-3 sm:p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
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
