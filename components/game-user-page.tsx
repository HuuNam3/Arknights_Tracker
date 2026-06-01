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
  "Crowd-Control",
  "Nuker",
  "Summon",
  "Fast-Redeploy",
  "Shift",
  "Elemental",
]);

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
  { name: "Exusiai", rarity: 6, tags: ["Top Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Siege", rarity: 6, tags: ["Top Operator", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Shining", rarity: 6, tags: ["Top Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Nightingale", rarity: 6, tags: ["Top Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "SilverAsh", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Support"] },
  { name: "Hoshiguma", rarity: 6, tags: ["Top Operator", "Defender", "Melee", "Defense", "DPS"] },
  { name: "Saria", rarity: 6, tags: ["Top Operator", "Defender", "Melee", "Defense", "Healing", "Support"] },
  { name: "Ifrit", rarity: 6, tags: ["Top Operator", "Caster", "Ranged", "AoE", "Debuff", "DPS"] },
  { name: "Mostima", rarity: 6, tags: ["Top Operator", "Caster", "Ranged", "AoE", "Support", "Crowd-Control"] },
  { name: "Schwarz", rarity: 6, tags: ["Top Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Hellagur", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "DPS", "Survival"] },
  { name: "Aak", rarity: 6, tags: ["Top Operator", "Specialist", "Ranged", "Support", "Debuff", "DPS"] },
  { name: "Blaze", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "AoE", "DPS", "Survival"] },
  { name: "Ceobe", rarity: 6, tags: ["Top Operator", "Caster", "Ranged", "DPS"] },
  { name: "Bagpipe", rarity: 6, tags: ["Top Operator", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Ch'en", rarity: 6, tags: ["Top Operator", "Guard", "Melee", "Nuker", "DPS"] },
  { name: "Weedy", rarity: 6, tags: ["Top Operator", "Specialist", "Melee", "Shift", "DPS", "Crowd-Control"] },
  { name: "Phantom", rarity: 6, tags: ["Top Operator", "Specialist", "Melee", "Fast-Redeploy", "Crowd-Control", "DPS"] },
  { name: "Magallan", rarity: 6, tags: ["Top Operator", "Supporter", "Ranged", "Support", "Slow", "DPS"] },
  { name: "Suzuran", rarity: 6, tags: ["Top Operator", "Supporter", "Ranged", "Support", "Slow", "DPS"] },
  { name: "Kal'tsit", rarity: 6, tags: ["Top Operator", "Medic", "Ranged", "Healing", "Summon"] },

  { name: "Texas", rarity: 5, tags: ["Senior Operator", "Vanguard", "Melee", "DP-Recovery", "Crowd-Control"] },
  { name: "Ptilopsis", rarity: 5, tags: ["Senior Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Silence", rarity: 5, tags: ["Senior Operator", "Medic", "Ranged", "Healing"] },
  { name: "Warfarin", rarity: 5, tags: ["Senior Operator", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Nearl", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Healing"] },
  { name: "Liskarm", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Support", "DPS"] },
  { name: "Croissant", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Shift"] },
  { name: "Projekt Red", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Fast-Redeploy", "Crowd-Control", "DPS"] },
  { name: "Cliffheart", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Shift", "DPS"] },
  { name: "FEater", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Shift", "Support"] },
  { name: "Mayer", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Support", "Summon", "Crowd-Control"] },
  { name: "Pramanix", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Debuff", "Support"] },
  { name: "Blue Poison", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS"] },
  { name: "Meteorite", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "AoE", "DPS"] },
  { name: "Firewatch", rarity: 5, tags: ["Senior Operator", "Sniper", "Ranged", "DPS", "Nuker"] },
  { name: "Manticore", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Survival", "DPS", "Crowd-Control"] },
  { name: "Lappland", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "DPS", "Debuff"] },
  { name: "Specter", rarity: 5, tags: ["Senior Operator", "Guard", "Melee", "AoE", "DPS", "Survival"] },
  { name: "Vulcan", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Survival", "DPS"] },
  { name: "Leonhardt", rarity: 5, tags: ["Senior Operator", "Caster", "Ranged", "AoE", "Nuker"] },
  { name: "Glaucus", rarity: 5, tags: ["Senior Operator", "Supporter", "Ranged", "Slow", "Crowd-Control"] },
  { name: "Hung", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "Healing"] },
  { name: "Asbestos", rarity: 5, tags: ["Senior Operator", "Defender", "Melee", "Defense", "DPS"] },
  { name: "Waai Fu", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Fast-Redeploy", "Debuff"] },
  { name: "Kafka", rarity: 5, tags: ["Senior Operator", "Specialist", "Melee", "Fast-Redeploy", "Crowd-Control"] },

  { name: "Myrtle", rarity: 4, tags: ["Vanguard", "Melee", "DP-Recovery", "Healing", "Support"] },
  { name: "Gravel", rarity: 4, tags: ["Specialist", "Melee", "Fast-Redeploy", "Defense"] },
  { name: "Rope", rarity: 4, tags: ["Specialist", "Melee", "Shift"] },
  { name: "Shaw", rarity: 4, tags: ["Specialist", "Melee", "Shift"] },
  { name: "Courier", rarity: 4, tags: ["Vanguard", "Melee", "DP-Recovery", "Defense"] },
  { name: "Scavenger", rarity: 4, tags: ["Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Perfumer", rarity: 4, tags: ["Medic", "Ranged", "Healing", "Support"] },
  { name: "Gavial", rarity: 4, tags: ["Medic", "Ranged", "Healing"] },
  { name: "Haze", rarity: 4, tags: ["Caster", "Ranged", "DPS", "Debuff"] },
  { name: "Gitano", rarity: 4, tags: ["Caster", "Ranged", "AoE", "DPS"] },
  { name: "Shirayuki", rarity: 4, tags: ["Sniper", "Ranged", "AoE", "Slow"] },
  { name: "Meteor", rarity: 4, tags: ["Sniper", "Ranged", "DPS", "Debuff"] },
  { name: "Vermeil", rarity: 4, tags: ["Sniper", "Ranged", "DPS"] },
  { name: "Cuora", rarity: 4, tags: ["Defender", "Melee", "Defense"] },
  { name: "Gummy", rarity: 4, tags: ["Defender", "Melee", "Defense", "Healing"] },
  { name: "Deepcolor", rarity: 4, tags: ["Supporter", "Ranged", "Support", "Summon"] },
  { name: "Earthspirit", rarity: 4, tags: ["Supporter", "Ranged", "Slow", "Support"] },
  { name: "Mousse", rarity: 4, tags: ["Guard", "Melee", "DPS", "Debuff"] },
  { name: "Estelle", rarity: 4, tags: ["Guard", "Melee", "AoE", "Survival"] },
  { name: "Frostleaf", rarity: 4, tags: ["Guard", "Melee", "DPS", "Slow"] },
  { name: "Jessica", rarity: 4, tags: ["Sniper", "Ranged", "DPS", "Survival"] },
  { name: "Click", rarity: 4, tags: ["Caster", "Ranged", "DPS", "Crowd-Control"] },
  { name: "May", rarity: 4, tags: ["Sniper", "Ranged", "DPS", "Slow"] },
  { name: "Jaye", rarity: 4, tags: ["Specialist", "Melee", "Fast-Redeploy", "DPS"] },
  { name: "Podenco", rarity: 4, tags: ["Supporter", "Ranged", "Slow", "Healing"] },
  { name: "Cutter", rarity: 4, tags: ["Guard", "Melee", "Nuker", "DPS"] },

  { name: "Fang", rarity: 3, tags: ["Starter", "Vanguard", "Melee", "DP-Recovery", "Defense"] },
  { name: "Vanilla", rarity: 3, tags: ["Starter", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Plume", rarity: 3, tags: ["Starter", "Vanguard", "Melee", "DP-Recovery", "DPS"] },
  { name: "Kroos", rarity: 3, tags: ["Starter", "Sniper", "Ranged", "DPS"] },
  { name: "Adnachiel", rarity: 3, tags: ["Starter", "Sniper", "Ranged", "DPS"] },
  { name: "Catapult", rarity: 3, tags: ["Starter", "Sniper", "Ranged", "AoE"] },
  { name: "Steward", rarity: 3, tags: ["Starter", "Caster", "Ranged", "DPS"] },
  { name: "Lava", rarity: 3, tags: ["Starter", "Caster", "Ranged", "AoE"] },
  { name: "Orchid", rarity: 3, tags: ["Starter", "Supporter", "Ranged", "Slow"] },
  { name: "Melantha", rarity: 3, tags: ["Starter", "Guard", "Melee", "DPS"] },
  { name: "Midnight", rarity: 3, tags: ["Starter", "Guard", "Melee", "DPS"] },
  { name: "Popukar", rarity: 3, tags: ["Starter", "Guard", "Melee", "AoE"] },
  { name: "Beagle", rarity: 3, tags: ["Starter", "Defender", "Melee", "Defense"] },
  { name: "Spot", rarity: 3, tags: ["Starter", "Defender", "Melee", "Defense", "Healing"] },
  { name: "Cardigan", rarity: 3, tags: ["Starter", "Defender", "Melee", "Defense", "Survival"] },
  { name: "Ansel", rarity: 3, tags: ["Starter", "Medic", "Ranged", "Healing"] },
  { name: "Hibiscus", rarity: 3, tags: ["Starter", "Medic", "Ranged", "Healing"] },

  { name: "Yato", rarity: 2, tags: ["Starter", "Vanguard", "Melee", "DP-Recovery"] },
  { name: "Rangers", rarity: 2, tags: ["Starter", "Sniper", "Ranged", "DPS"] },
  { name: "Durin", rarity: 2, tags: ["Starter", "Caster", "Ranged", "DPS"] },
  { name: "12F", rarity: 2, tags: ["Starter", "Caster", "Ranged", "AoE"] },
  { name: "Noir Corne", rarity: 2, tags: ["Starter", "Defender", "Melee", "Defense"] },

  { name: "Lancet-2", rarity: 1, tags: ["Robot", "Medic", "Ranged", "Healing", "Support"] },
  { name: "Castle-3", rarity: 1, tags: ["Robot", "Guard", "Melee", "Support", "DPS"] },
  { name: "THRM-EX", rarity: 1, tags: ["Robot", "Specialist", "Melee", "Fast-Redeploy", "Nuker"] },
  { name: "Justice Knight", rarity: 1, tags: ["Robot", "Sniper", "Ranged", "Support"] },
  { name: "Friston-3", rarity: 1, tags: ["Robot", "Defender", "Melee", "Defense"] },
  { name: "PhonoR-0", rarity: 1, tags: ["Robot", "Supporter", "Ranged", "Elemental"] },
  { name: "CONFESS-47", rarity: 1, tags: ["Robot", "Vanguard", "Melee", "Crowd-Control"] },
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
      return "rounded-md border-2 border-amber-100 bg-white/80 text-amber-600 opacity-70";
    }
    if (category === "position") {
      return "rounded-md border-2 border-cyan-100 bg-white/80 text-cyan-600 opacity-70";
    }
    if (category === "class") {
      return "rounded-md border-2 border-indigo-100 bg-white/80 text-indigo-600 opacity-70";
    }

    return "rounded-md border-2 border-emerald-100 bg-white/80 text-emerald-600 opacity-70";
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
        comboTags.every((tag) => operator.tags.includes(tag)),
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
    minSize: 2,
  });

  const combos = combinations
    .map((comboTags) => {
      const operators = RECRUITMENT_OPERATORS.filter((candidate) =>
        comboTags.every((tag) => candidate.tags.includes(tag)),
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

const TOOL_ICON_URLS = {
  commendationCertificate:
    "https://arknights.wiki.gg/images/Commendation_Certificate.png",
  distinctionCertificate:
    "https://arknights.wiki.gg/images/Distinction_Certificate.png",
  headhuntingPermit:
    "https://arknights.wiki.gg/images/Headhunting_Permit.png",
  originiumShard:
    "https://arknights.wiki.gg/images/Originium_Shard.png",
  originitePrime:
    "https://arknights.wiki.gg/images/Originite_Prime.png",
  orundum: "https://arknights.wiki.gg/images/Orundum.png",
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
  commendationShopMode: CommendationShopMode;
  currentBannerKey: string;
  dailyMissionEnabled: boolean;
  distinctions: string;
  eventRewardsEnabled: boolean;
  eventShopEnabled: boolean;
  monthlyCardEnabled: boolean;
  monthlySignInEnabled: boolean;
  originiumShards: string;
  originitePrime: string;
  orundum: string;
  permits: string;
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

type PlannerStableBreakdownEntry = {
  detail: string;
  freePulls: number;
  label: string;
  orundum: number;
  permits: number;
  scope: "target-only" | "transferable";
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
const MONTH_MS = 30.4375 * DAY_MS;
const PULL_PLANNER_STORAGE_KEY = "arkreview_pull_planner_v1";
const TIER_DRAFT_KEY = "arkreview_tierlist_draft_v1";
const TIER_LISTS_KEY = "arkreview_tierlists_v1";
const LIMITED_LUCKY_BOARD_EXPECTED_ORUNDUM = 8170;
const COMMENDATION_SHOP_MONTHLY_PERMITS = 2;
const DAILY_SIGNIN_PERMIT_DAY = 17;
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
  commendationShopMode: "phase1",
  currentBannerKey: "",
  dailyMissionEnabled: false,
  distinctions: "0",
  eventRewardsEnabled: false,
  eventShopEnabled: false,
  monthlyCardEnabled: false,
  monthlySignInEnabled: false,
  originiumShards: "0",
  originitePrime: "0",
  orundum: "0",
  permits: "0",
  weeklyMissionEnabled: false,
  weeklyRegularOrundum: "1800",
};

const parseIsoDate = (value: string | null) => {
  if (!value) return null;

  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) ? timestamp : null;
};

const formatOrundumPullSummary = (orundum: number) => {
  const pulls = Math.floor(orundum / 600);
  const leftover = orundum % 600;

  return leftover > 0
    ? `${orundum} Orundum = ${pulls} pull + dư ${leftover} Orundum`
    : `${orundum} Orundum = ${pulls} pull`;
};

const formatCombinedPullSummary = (
  orundum: number,
  permits: number,
  freePulls = 0,
) => {
  const orundumPulls = Math.floor(orundum / 600);
  const leftover = orundum % 600;
  const totalPulls = orundumPulls + permits + freePulls;
  const parts: string[] = [];

  if (permits > 0) {
    parts.push(`${permits} permit`);
  }

  if (freePulls > 0) {
    parts.push(`${freePulls} free pull`);
  }

  if (orundum > 0) {
    parts.push(`${orundum} Orundum`);
  }

  if (parts.length === 0) {
    parts.push("0");
  }

  return `${parts.join(" + ")} = ${totalPulls} pull${
    leftover > 0 ? ` + dư ${leftover} Orundum` : ""
  }`;
};

const formatDistinctionMonthBreakdown = (
  breakdown: DistinctionShopMonthBreakdown[],
) =>
  breakdown
    .map((entry) => {
      const batchSummary = entry.batches
        .map((count, batchIndex) =>
          count > 0
            ? `${DISTINCTION_SHOP_BATCHES[batchIndex]?.permits}p x${count}`
            : null,
        )
        .filter((value): value is string => value !== null)
        .join(", ");

      return `K${entry.month}: ${entry.permits} permit${
        batchSummary ? ` (${batchSummary})` : ""
      }, tốn ${entry.spent} cert`;
    })
    .join(" | ");

const formatCommendationMonthBreakdown = (
  breakdown: CommendationShopMonthBreakdown[],
) =>
  breakdown
    .map((entry) => {
      const parts: string[] = [];

      if (entry.phase1Permits > 0 || entry.phase1OrundumBundles > 0) {
        const phaseOneOrundum = entry.phase1OrundumBundles * COMMENDATION_ORUNDUM_BUNDLE_SIZE;
        parts.push(
          `P1 ${entry.phase1Permits} permit${
            phaseOneOrundum > 0 ? ` + ${phaseOneOrundum} Orundum` : ""
          }`,
        );
      }

      if (entry.phase2Permits > 0) {
        parts.push(`P2 ${entry.phase2Permits} permit`);
      }

      if (entry.phase3Bundles > 0) {
        parts.push(
          `P3 ${entry.phase3Bundles * COMMENDATION_PHASE_THREE_ORUNDUM_BUNDLE_SIZE} Orundum`,
        );
      }

      if (parts.length === 0 && entry.permits > 0) {
        parts.push(`${entry.permits} permit`);
      }

      return `K${entry.month}: ${parts.join(" + ") || "0"}, tốn ${entry.spent} cert`;
    })
    .join(" | ");

const formatIsoDate = (timestamp: number) =>
  new Date(timestamp).toISOString().slice(0, 10);

const formatLocalIsoDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value: string | null) => {
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
    dailyMissionEnabled:
      typeof candidate.dailyMissionEnabled === "boolean"
        ? candidate.dailyMissionEnabled
        : DEFAULT_PULL_PLANNER.dailyMissionEnabled,
    distinctions:
      typeof candidate.distinctions === "string"
        ? candidate.distinctions
        : DEFAULT_PULL_PLANNER.distinctions,
    eventRewardsEnabled:
      typeof candidate.eventRewardsEnabled === "boolean"
        ? candidate.eventRewardsEnabled
        : DEFAULT_PULL_PLANNER.eventRewardsEnabled,
    eventShopEnabled:
      typeof candidate.eventShopEnabled === "boolean"
        ? candidate.eventShopEnabled
        : DEFAULT_PULL_PLANNER.eventShopEnabled,
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

const getPlannerResourceCardClassName = (resource: string) => {
  if (resource === "Orundum") {
    return "rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2";
  }
  if (resource === "Originite Prime") {
    return "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2";
  }
  if (resource === "Headhunting Permit") {
    return "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2";
  }

  return "rounded-lg border border-violet-200 bg-violet-50 px-3 py-2";
};

const getPlannerSourceCardClassName = (label: string) => {
  if (/daily|weekly|annihilation/i.test(label)) {
    return "flex items-start justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2";
  }
  if (/sign-in|thẻ tháng/i.test(label)) {
    return "flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2";
  }
  if (/commendation|distinction/i.test(label)) {
    return "flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2";
  }

  return "flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2";
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
  const [activeTab, setActiveTab] = useState("tools");
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
  const plannerOrundum = Math.max(0, parseNumberInput(pullPlanner.orundum));
  const plannerPrime = Math.max(0, parseNumberInput(pullPlanner.originitePrime));
  const plannerPermits = Math.max(0, parseNumberInput(pullPlanner.permits));
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
    plannerOrundum + plannerPrime * 180 + plannerShardOrundum;
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
      const predictedDate =
        banner.enStartDate ??
        bannerPredictionDetailsByKey.get(getBannerKey(banner))?.date ??
        null;

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
        details:
          !banner.enStartDate
            ? bannerPredictionDetailsByKey.get(getBannerKey(banner)) ?? null
            : null,
        id: getBannerKey(banner),
        isPredicted: !banner.enStartDate,
        name: banner.name,
      };
    })
    .filter((target): target is NonNullable<typeof target> => target !== null)
    .sort((left, right) => left.date.localeCompare(right.date));
  const selectedPullPlannerTarget =
    pullPlannerTargets.find((target) => target.id === pullPlanner.currentBannerKey) ??
    pullPlannerTargets[0] ??
    null;
  const plannerDaysUntilBanner = selectedPullPlannerTarget
    ? Math.max(
        0,
        Math.ceil(
          ((parseIsoDate(selectedPullPlannerTarget.date) ?? plannerTodayTs) -
            plannerTodayTs) /
            DAY_MS,
        ),
      )
    : 0;
  const plannerWeeksUntilBanner = Math.floor(plannerDaysUntilBanner / 7);
  const plannerMonthsUntilBanner = plannerDaysUntilBanner / (MONTH_MS / DAY_MS);
  const plannerTargetTs =
    selectedPullPlannerTarget
      ? parseIsoDate(selectedPullPlannerTarget.date) ?? plannerTodayTs
      : plannerTodayTs;
  const plannerReachableShopMonths = countReachableShopMonths(
    plannerTodayTs,
    plannerTargetTs,
  );
  const plannerReachableSignInPermits = countReachableMonthlyDay(
    plannerTodayTs,
    plannerTargetTs,
    DAILY_SIGNIN_PERMIT_DAY,
  );
  const plannerWeeklyRegularOrundum = Math.min(
    1800,
    Math.max(0, parseNumberInput(pullPlanner.weeklyRegularOrundum)),
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
              pulls: number;
            } => entry !== null,
          )
      : [];
  const plannerCommendationShopPurchases = calculateCommendationShopPurchases(
    plannerCommendations,
    plannerReachableShopMonths,
    plannerCommendationShopMode,
  );
  const plannerDistinctionShopPurchases = calculateDistinctionShopPurchases(
    plannerDistinctions,
    plannerReachableShopMonths,
  );
  const plannerFutureCommendationShopOrundum =
    plannerCommendationShopPurchases.orundum;
  const plannerFutureCommendationShopPermits =
    plannerCommendationShopPurchases.permits;
  const plannerFutureDistinctionShopPermits =
    plannerDistinctionShopPurchases.permits;
  const plannerCommendationShopModeLabel =
    plannerCommendationShopMode === "phase1"
      ? "P1"
      : plannerCommendationShopMode === "phase2"
        ? "P2"
        : "P3";
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
  const plannerEventShopLimitedCount = plannerTimelineEventShopEntries.filter(
    (entry) => entry.pulls === 5,
  ).length;
  const plannerEventShopStandardCount = plannerTimelineEventShopEntries.filter(
    (entry) => entry.pulls === 3,
  ).length;
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
  const plannerTransferableEventRewardSummary = formatCombinedPullSummary(
    plannerTransferableEventOrundum,
    plannerTransferableEventPermits,
    0,
  );
  const plannerTargetOnlyRewardSummary = formatCombinedPullSummary(
    0,
    plannerTargetOnlyEventPermits,
    plannerTargetOnlyEventFreePulls,
  );
  const plannerTargetOnlyRewardLabel = plannerTargetOnlyEventEntries
    .map((entry) => entry.bonus.label)
    .join(", ");
  const plannerTargetOnlyRewardNote = plannerTargetOnlyEventEntries
    .map((entry) => entry.bonus.note)
    .join(" ");
  const plannerProjectedBannerLeftoverOrundum =
    plannerProjectedTransferableLeftoverOrundum;
  const plannerEventShopSummary = formatCombinedPullSummary(
    plannerEventShopOrundum,
    plannerEventShopPermits,
    0,
  );
  const plannerStableBreakdown = [
    pullPlanner.dailyMissionEnabled
      ? {
          detail: `${plannerDaysUntilBanner} ngày x 100 = ${formatOrundumPullSummary(plannerFutureDailyOrundum)}`,
          freePulls: 0,
          label: "Daily mission",
          orundum: plannerFutureDailyOrundum,
          permits: 0,
          scope: "transferable",
        }
      : null,
    pullPlanner.weeklyMissionEnabled
      ? {
          detail: `${plannerWeeksUntilBanner} tuần x 500 = ${formatOrundumPullSummary(plannerFutureWeeklyMissionOrundum)}`,
          freePulls: 0,
          label: "Weekly mission",
          orundum: plannerFutureWeeklyMissionOrundum,
          permits: 0,
          scope: "transferable",
        }
      : null,
    {
      detail: `${plannerWeeksUntilBanner} tuần x ${plannerWeeklyRegularOrundum} = ${formatOrundumPullSummary(plannerFutureRegularOrundum)}`,
      freePulls: 0,
      label: "Annihilation / weekly cap",
      orundum: plannerFutureRegularOrundum,
      permits: 0,
      scope: "transferable",
    },
    pullPlanner.monthlyCardEnabled
      ? {
          detail: `${plannerDaysUntilBanner} ngày x 200 = ${formatOrundumPullSummary(plannerFutureMonthlyCardOrundum)}`,
          freePulls: 0,
          label: "Thẻ tháng",
          orundum: plannerFutureMonthlyCardOrundum,
          permits: 0,
          scope: "transferable",
        }
      : null,
    plannerCommendationShopPurchases.spent > 0
      ? {
          detail: `${plannerCommendationShopPurchases.spent}/${plannerCommendations} cert (${plannerCommendationShopModeLabel}, ${plannerReachableShopMonths} kỳ) = ${formatCombinedPullSummary(
            plannerFutureCommendationShopOrundum,
            plannerFutureCommendationShopPermits,
          )}, dư ${plannerCommendationShopPurchases.remaining} cert. ${formatCommendationMonthBreakdown(
            plannerCommendationShopPurchases.breakdown,
          )}`,
          freePulls: 0,
          label: "Commendation shop",
          orundum: plannerFutureCommendationShopOrundum,
          permits: plannerFutureCommendationShopPermits,
          scope: "transferable",
        }
      : null,
    plannerDistinctionShopPurchases.spent > 0
      ? {
          detail: `${plannerDistinctionShopPurchases.spent}/${plannerDistinctions} cert (${plannerDistinctionShopPurchases.monthsUsed}/${plannerReachableShopMonths} kỳ) = ${formatCombinedPullSummary(
            0,
            plannerFutureDistinctionShopPermits,
          )}, dư ${plannerDistinctionShopPurchases.remaining} cert. ${formatDistinctionMonthBreakdown(
            plannerDistinctionShopPurchases.breakdown,
          )}`,
          freePulls: 0,
          label: "Distinction shop",
          orundum: 0,
          permits: plannerFutureDistinctionShopPermits,
          scope: "transferable",
        }
      : null,
    pullPlanner.eventRewardsEnabled &&
    (plannerTransferableEventOrundum > 0 || plannerTransferableEventPermits > 0)
      ? {
          detail: `${plannerTimelineEventBonuses.length} banner/event trước hoặc tại target = ${plannerTransferableEventRewardSummary}`,
          freePulls: 0,
          label: "Quà sự kiện tích trữ",
          orundum: plannerTransferableEventOrundum,
          permits: plannerTransferableEventPermits,
          scope: "transferable",
        }
      : null,
    pullPlanner.eventRewardsEnabled && plannerTargetOnlyPulls > 0
      ? {
          detail: `${selectedPullPlannerTarget?.name ?? "Banner target"} = ${plannerTargetOnlyRewardSummary}${
            plannerTargetOnlyRewardLabel ? ` (${plannerTargetOnlyRewardLabel})` : ""
          }. ${plannerTargetOnlyRewardNote}`.trim(),
          freePulls: plannerTargetOnlyEventFreePulls,
          label: "Free pull riêng banner target",
          orundum: 0,
          permits: plannerTargetOnlyEventPermits,
          scope: "target-only",
        }
      : null,
    pullPlanner.eventShopEnabled && plannerEventShopPermits > 0
      ? {
          detail: `${plannerEventShopStandardCount} event thường x 3 + ${plannerEventShopLimitedCount} event limit/collab x 5 = ${plannerEventShopSummary}`,
          freePulls: 0,
          label: "Đổi shop sự kiện",
          orundum: plannerEventShopOrundum,
          permits: plannerEventShopPermits,
          scope: "transferable",
        }
      : null,
    pullPlanner.monthlySignInEnabled
      ? {
          detail: `${plannerReachableSignInPermits} mốc ngày ${DAILY_SIGNIN_PERMIT_DAY} = ${plannerFutureMonthlySignInPermits} permit = ${plannerFutureMonthlySignInPermits} pull`,
          freePulls: 0,
          label: "Daily sign-in",
          orundum: 0,
          permits: plannerFutureMonthlySignInPermits,
          scope: "transferable",
        }
      : null,
  ].filter((entry): entry is PlannerStableBreakdownEntry => entry !== null);
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
    localStorage.setItem(TIER_LISTS_KEY, JSON.stringify(savedTierLists));
  }, [savedTierLists]);

  useEffect(() => {
    if (!hasHydratedPullPlanner) return;

    localStorage.setItem(PULL_PLANNER_STORAGE_KEY, JSON.stringify(pullPlanner));
  }, [hasHydratedPullPlanner, pullPlanner]);

  useEffect(() => {
    if (!hasHydratedPullPlanner) return;

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

  return (
    <div className="min-h-screen bg-transparent text-slate-800 p-4 md:p-8 relative overflow-hidden font-sans selection:bg-sky-300/40">
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
          background: linear-gradient(180deg, rgba(249, 253, 255, 0.84), rgba(243, 249, 250, 0.74));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
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
          background: linear-gradient(180deg, rgba(250, 253, 255, 0.9), rgba(242, 248, 250, 0.84));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
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

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="hero-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Gamepad2 className="w-12 h-12 text-sky-700 animate-pulse-glow animate-float" />
              <h1 className="hero-title text-5xl md:text-7xl font-black tracking-tight">
                Arknights Tracker
              </h1>
              <Crown
                className="w-12 h-12 text-amber-600 animate-pulse-glow animate-float"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <p className="text-slate-700 text-lg md:text-xl font-medium max-w-3xl mx-auto">
              Theo dõi Characters, Banners, Tier List, Tools, Tin tức và lịch sử
              Gacha cho Arknights trong một nơi.
            </p>
          </div>
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

            {searchAttempted && userInfo ? (
              <>
                <Separator className="bg-slate-200/80" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg border border-indigo-200">
                      <Crown className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-slate-800 text-xl font-bold">Hồ sơ Doctor</p>
                      <p className="text-slate-500 text-sm">
                        Kết quả tra cứu theo UID vừa nhập.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white/60 rounded-xl p-3 border border-slate-100 hover:border-cyan-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                      <div className="absolute -right-3 -top-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Shield className="w-16 h-16 text-cyan-600" />
                      </div>
                      <p className="text-slate-500 text-[10px] mb-1 font-semibold tracking-[0.18em] uppercase">
                        UID
                      </p>
                      <p className="text-cyan-600 text-lg font-black font-mono tracking-tight">
                        {userInfo.uid}
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-3 border border-slate-100 hover:border-indigo-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                      <div className="absolute -right-3 -top-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Sword className="w-16 h-16 text-indigo-600" />
                      </div>
                      <p className="text-slate-500 text-[10px] mb-1 font-semibold tracking-[0.18em] uppercase">
                        Tên hiển thị
                      </p>
                      <p className="text-indigo-600 text-lg font-black tracking-tight">
                        {userInfo.name}
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-3 border border-slate-100 hover:border-purple-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                      <div className="absolute -right-3 -top-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Trophy className="w-16 h-16 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-slate-500 text-[10px] font-semibold tracking-[0.18em] uppercase">
                          Cấp Doctor
                        </p>
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                      </div>
                      <p className="text-purple-600 text-lg font-black tracking-tight">
                        Lv. {userInfo.level}
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-3 border border-slate-100 hover:border-amber-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                      <div className="absolute -right-3 -top-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Zap className="w-16 h-16 text-amber-500" />
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="text-slate-500 text-[10px] font-semibold tracking-[0.18em] uppercase">
                          Sanity tối đa
                        </p>
                        <Zap className="w-3 h-3 text-amber-500" />
                      </div>
                      <p className="text-amber-600 text-lg font-black tracking-tight">
                        {sanityCap}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1.5">
                        Tính theo mốc Global hiện tại
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : errorMessage ? (
              <Alert className="border-red-200 bg-red-50 backdrop-blur-md text-red-800 rounded-xl animate-fade-in shadow-sm">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="ml-2 font-medium text-base">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <div className="animate-fade-in stagger-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-[#f7fbff]/85 backdrop-blur-xl border border-sky-200/70 p-1.5 rounded-2xl shadow-[0_18px_45px_-24px_rgba(14,116,144,0.35)] mb-6 h-auto gap-1.5">
                <TabsTrigger
                  value="tools"
                  className="py-3 text-slate-500 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                >
                  <Wrench className="w-5 h-5 mr-2" />
                  Tools
                </TabsTrigger>
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
                value="tools"
                className="mt-0 focus-visible:outline-none space-y-6"
              >
                <Card className="glass-card border-0 shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500" />
                    <CardHeader className="pb-4 bg-gradient-to-r from-sky-50/75 to-white/55 border-b border-sky-100/80">
                    <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                      <div className="p-2 bg-amber-100 rounded-lg border border-amber-200">
                        <Wrench className="w-6 h-6 text-amber-600" />
                      </div>
                      Tools
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-base">
                      Tập hợp các công cụ tính toán và theo dõi nhanh để hỗ trợ
                      quá trình chơi Arknights mỗi ngày.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="pull-planner" className="w-full space-y-6">
                      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-[#f9fcff]/85 backdrop-blur-xl border border-sky-200/70 p-1.5 rounded-2xl shadow-[0_18px_45px_-24px_rgba(14,116,144,0.28)] h-auto gap-1.5">
                        <TabsTrigger
                          value="pull-planner"
                          className="py-3 text-slate-500 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                        >
                          <Diamond className="w-5 h-5 mr-2" />
                          Pull Planner
                        </TabsTrigger>
                        <TabsTrigger
                          value="sanity"
                          className="py-3 text-slate-500 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                        >
                          <Zap className="w-5 h-5 mr-2" />
                          Sanity
                        </TabsTrigger>
                        <TabsTrigger
                          value="recruitment"
                          className="py-3 text-slate-500 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 border border-transparent rounded-xl transition-all font-bold text-base shadow-sm data-[state=active]:shadow-md"
                        >
                          <Users className="w-5 h-5 mr-2" />
                          Recruitment
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="pull-planner" className="mt-0 focus-visible:outline-none">
                        <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-slate-800 font-bold text-lg">Pull Planner</p>
                            <p className="text-slate-500 text-sm mt-1">
                              Tính pull hiện có và ước tính số pull tích lũy được
                              tới banner mục tiêu.
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-600"
                          >
                            Banner planner
                          </Badge>
                        </div>

                        {pullPlannerTargets.length > 0 ? (
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                              Banner mục tiêu
                            </label>
                            <select
                              value={selectedPullPlannerTarget?.id ?? ""}
                              onChange={(e) =>
                                handlePullPlannerChange("currentBannerKey", e.target.value)
                              }
                              className="w-full h-12 rounded-xl border border-slate-200 bg-white/80 px-4 text-slate-800"
                            >
                              {pullPlannerTargets.map((target) => (
                                <option key={target.id} value={target.id}>
                                  {target.name} - {target.dateLabel}
                                  {target.isPredicted ? " (Dự đoán)" : " (Đã xác nhận)"}
                                </option>
                              ))}
                            </select>
                            {selectedPullPlannerTarget ? (
                              <p className="text-xs text-slate-500">
                                {selectedPullPlannerTarget.isPredicted
                                  ? selectedPullPlannerTarget.details
                                    ? `Ngày trên là ngày dự đoán từ CN sang Global, dựa trên ${selectedPullPlannerTarget.details.sampleSize} banner ${selectedPullPlannerTarget.details.reason}.`
                                    : "Ngày trên là ngày dự đoán từ CN sang Global."
                                  : "Ngày trên là ngày banner đã có lịch Global."}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <Alert className="border-slate-200 bg-slate-50 text-slate-700 rounded-xl">
                            <AlertCircle className="h-5 w-5 text-slate-500" />
                            <AlertDescription className="ml-2 text-sm">
                              Chưa có banner tương lai để lên kế hoạch.
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <p className="text-sm text-slate-600">
                            Nhập tài nguyên hiện có của bạn, gồm cả cert, để quy đổi pull
                            hiện tại và tính phần shop trước banner.
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                            <div className="bg-white/60 rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={TOOL_ICON_URLS.orundum}
                                  alt="Orundum"
                                  className="size-5 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <p className="font-semibold text-sm text-slate-800">Orundum</p>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                value={pullPlanner.orundum}
                                onChange={(e) =>
                                  handlePullPlannerChange("orundum", e.target.value)
                                }
                                placeholder="Orundum"
                                className="bg-white/80 border-slate-200 rounded-xl"
                              />
                              <p className="text-[11px] leading-4 text-slate-500">
                                600 Orundum = 1 pull
                              </p>
                            </div>
                            <div className="bg-white/60 rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={TOOL_ICON_URLS.originitePrime}
                                  alt="Originite Prime"
                                  className="size-5 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <p className="font-semibold text-sm text-slate-800">
                                  Originite Prime
                                </p>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                value={pullPlanner.originitePrime}
                                onChange={(e) =>
                                  handlePullPlannerChange("originitePrime", e.target.value)
                                }
                                placeholder="Originite Prime"
                                className="bg-white/80 border-slate-200 rounded-xl"
                              />
                              <p className="text-[11px] leading-4 text-slate-500">
                                1 OP = 180 Orundum
                              </p>
                            </div>
                            <div className="bg-white/60 rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={TOOL_ICON_URLS.headhuntingPermit}
                                  alt="Headhunting Permit"
                                  className="size-5 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <p className="font-semibold text-sm text-slate-800">
                                  Headhunting Permit
                                </p>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                value={pullPlanner.permits}
                                onChange={(e) =>
                                  handlePullPlannerChange("permits", e.target.value)
                                }
                                placeholder="Headhunting Permit"
                                className="bg-white/80 border-slate-200 rounded-xl"
                              />
                              <p className="text-[11px] leading-4 text-slate-500">
                                1 permit = 1 pull
                              </p>
                            </div>
                            <div className="bg-white/60 rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={TOOL_ICON_URLS.originiumShard}
                                  alt="Originium Shard"
                                  className="size-5 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <p className="font-semibold text-sm text-slate-800">
                                  Originium Shard
                                </p>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                value={pullPlanner.originiumShards}
                                onChange={(e) =>
                                  handlePullPlannerChange("originiumShards", e.target.value)
                                }
                                placeholder="Originium Shard"
                                className="bg-white/80 border-slate-200 rounded-xl"
                              />
                              <p className="text-[11px] leading-4 text-slate-500">
                                60 shard = 1 pull
                              </p>
                            </div>
                            <div className="bg-white/60 rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={TOOL_ICON_URLS.commendationCertificate}
                                  alt="Commendation Certificate"
                                  className="size-5 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <p className="font-semibold text-sm text-slate-800">
                                  Commendations
                                </p>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                value={pullPlanner.commendations}
                                onChange={(e) =>
                                  handlePullPlannerChange("commendations", e.target.value)
                                }
                                placeholder="Commendations"
                                className="bg-white/80 border-slate-200 rounded-xl"
                              />
                              <p className="text-[11px] leading-4 text-slate-500">
                                Tính phần mua roll trong Commendation shop
                              </p>
                              <div className="grid grid-cols-3 gap-1">
                                {([
                                  ["phase1", "P1"],
                                  ["phase2", "P2"],
                                  ["phase3", "P3"],
                                ] as const).map(([mode, label]) => (
                                  <button
                                    key={mode}
                                    type="button"
                                    onClick={() =>
                                      handlePullPlannerChange(
                                        "commendationShopMode",
                                        mode,
                                      )
                                    }
                                    className={`rounded-lg border px-2 py-1 text-[10px] font-semibold transition-colors ${
                                      pullPlanner.commendationShopMode === mode
                                        ? "border-amber-300 bg-amber-50 text-amber-700"
                                        : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                              <p className="text-[11px] leading-4 text-slate-500">
                                {pullPlanner.commendationShopMode === "phase1"
                                  ? "Chỉ lấy phần roll ở Phase 1 mỗi tháng."
                                  : pullPlanner.commendationShopMode === "phase2"
                                    ? "Nếu đủ clear shop tháng đó, planner sẽ xuống Phase 2 để lấy thêm permit."
                                    : "Nếu đủ clear hết Phase 1 và 2, phần cert dư sẽ đổi Orundum ở Phase 3."}
                              </p>
                            </div>
                            <div className="bg-white/60 rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={TOOL_ICON_URLS.distinctionCertificate}
                                  alt="Distinction Certificate"
                                  className="size-5 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <p className="font-semibold text-sm text-slate-800">
                                  Distinctions
                                </p>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                value={pullPlanner.distinctions}
                                onChange={(e) =>
                                  handlePullPlannerChange("distinctions", e.target.value)
                                }
                                placeholder="Distinctions"
                                className="bg-white/80 border-slate-200 rounded-xl"
                              />
                              <p className="text-[11px] leading-4 text-slate-500">
                                Tính permit mua được trong Distinction shop
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                          <label className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={pullPlanner.dailyMissionEnabled}
                              onChange={(e) =>
                                handlePullPlannerChange(
                                  "dailyMissionEnabled",
                                  e.target.checked,
                                )
                              }
                              className="size-4 accent-amber-600"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">
                                Daily mission
                              </p>
                              <p className="text-sm text-slate-500">
                                100 Orundum / ngày
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Bật nếu bạn sẽ làm đủ daily mỗi ngày tới banner.
                              </p>
                            </div>
                          </label>

                          <label className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={pullPlanner.weeklyMissionEnabled}
                              onChange={(e) =>
                                handlePullPlannerChange(
                                  "weeklyMissionEnabled",
                                  e.target.checked,
                                )
                              }
                              className="size-4 accent-amber-600"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">
                                Weekly mission
                              </p>
                              <p className="text-sm text-slate-500">
                                500 Orundum / tuần
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Bật nếu bạn sẽ làm đủ weekly mỗi tuần tới banner.
                              </p>
                            </div>
                          </label>

                          <label className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={pullPlanner.monthlySignInEnabled}
                              onChange={(e) =>
                                handlePullPlannerChange(
                                  "monthlySignInEnabled",
                                  e.target.checked,
                                )
                              }
                              className="size-4 accent-amber-600"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">
                                Sign-in tháng
                              </p>
                              <p className="text-sm text-slate-500">
                                1 permit ở mốc ngày 17
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Bật nếu bạn đăng nhập đủ 17 ngày trong một tháng trước banner.
                              </p>
                            </div>
                          </label>

                          <label className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={pullPlanner.monthlyCardEnabled}
                              onChange={(e) =>
                                handlePullPlannerChange(
                                  "monthlyCardEnabled",
                                  e.target.checked,
                                )
                              }
                              className="size-4 accent-amber-600"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">
                                Thẻ tháng
                              </p>
                              <p className="text-sm text-slate-500">
                                200 Orundum / ngày
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Bật nếu Monthly Card của bạn còn hiệu lực tới banner.
                              </p>
                            </div>
                          </label>

                          <label className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={pullPlanner.eventRewardsEnabled}
                              onChange={(e) =>
                                handlePullPlannerChange(
                                  "eventRewardsEnabled",
                                  e.target.checked,
                                )
                              }
                              className="size-4 accent-amber-600"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">
                                Đăng nhập sự kiện limit
                              </p>
                              <p className="text-sm text-slate-500">
                                Tách riêng free pull/vé khóa banner và Orundum tích trữ được
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Bật nếu bạn sẽ đăng nhập trong các sự kiện limit/collab trước và tới banner target.
                              </p>
                            </div>
                          </label>

                          <label className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={pullPlanner.eventShopEnabled}
                              disabled={!pullPlanner.eventRewardsEnabled}
                              onChange={(e) =>
                                handlePullPlannerChange(
                                  "eventShopEnabled",
                                  e.target.checked,
                                )
                              }
                              className="size-4 accent-amber-600 disabled:opacity-50"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">
                                Đổi shop sự kiện
                              </p>
                              <p className="text-sm text-slate-500">
                                Event thường 3 roll, limit/collab 5 roll
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Bật nếu bạn sẽ farm đủ currency để lấy phần roll trong shop sự kiện.
                              </p>
                            </div>
                          </label>

                          <div className="bg-white rounded-xl border border-slate-100 p-4">
                            <p className="font-semibold text-slate-800 mb-2">
                              Annihilation mỗi tuần
                            </p>
                            <Input
                              type="number"
                              min={0}
                              max={1800}
                              value={pullPlanner.weeklyRegularOrundum}
                              onChange={(e) =>
                                handlePullPlannerChange(
                                  "weeklyRegularOrundum",
                                  e.target.value,
                                )
                              }
                              placeholder="0 - 1800"
                              className="bg-white/80 border-slate-200 rounded-xl"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                              Nhập lượng Orundum mỗi tuần bạn chắc chắn lấy được, tối đa 1800.
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-slate-800">
                              Chi tiết nguồn tích lũy trước banner
                            </p>
                            <Badge
                              variant="outline"
                              className="bg-white border-slate-200 text-slate-600"
                            >
                              {plannerReachableShopMonths} kỳ shop trước banner
                            </Badge>
                          </div>
                          <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium text-slate-800">
                                Tài nguyên hiện tại
                              </p>
                              <p className="text-xs text-slate-600 whitespace-nowrap">
                                {plannerCurrentPulls} pull hiện có
                              </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
                              <div className={getPlannerResourceCardClassName("Orundum")}>
                                <p className="text-slate-500">Orundum</p>
                                <p className="font-semibold text-slate-800">
                                  {plannerOrundum}
                                </p>
                                <p className="text-slate-500 mt-1">
                                  = {Math.floor(plannerOrundum / 600)} pull
                                </p>
                              </div>
                              <div className={getPlannerResourceCardClassName("Originite Prime")}>
                                <p className="text-slate-500">Originite Prime</p>
                                <p className="font-semibold text-slate-800">
                                  {plannerPrime} OP = {plannerPrime * 180} Orundum
                                </p>
                                <p className="text-slate-500 mt-1">
                                  = {Math.floor((plannerPrime * 180) / 600)} pull
                                </p>
                              </div>
                              <div className={getPlannerResourceCardClassName("Headhunting Permit")}>
                                <p className="text-slate-500">Headhunting Permit</p>
                                <p className="font-semibold text-slate-800">
                                  {plannerPermits} permit
                                </p>
                                <p className="text-slate-500 mt-1">
                                  = {plannerPermits} pull
                                </p>
                              </div>
                              <div className={getPlannerResourceCardClassName("Originium Shard")}>
                                <p className="text-slate-500">Originium Shard</p>
                                <p className="font-semibold text-slate-800">
                                  {plannerShards} shard = {plannerShardOrundum} Orundum
                                </p>
                                <p className="text-slate-500 mt-1">
                                  = {Math.floor(plannerShardOrundum / 600)} pull
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">
                              Tổng quy đổi hiện tại: {plannerCurrentOrundum} Orundum +{" "}
                              {plannerPermits} permit, còn dư {plannerCurrentLeftoverOrundum} Orundum sau quy đổi pull.
                            </p>
                          </div>
                          <div className="space-y-2">
                            {plannerStableBreakdown.map((source) => (
                              <div
                                key={`${source.label}-${source.detail}`}
                                className={getPlannerSourceCardClassName(source.label)}
                              >
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-slate-800">
                                      {source.label}
                                    </p>
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        source.scope === "target-only"
                                          ? "bg-rose-100 text-rose-700"
                                          : "bg-sky-100 text-sky-700"
                                      }`}
                                    >
                                      {source.scope === "target-only"
                                        ? "Chỉ banner target"
                                        : "Mang sang được"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    {source.detail}
                                  </p>
                                </div>
                                <div className="text-right text-xs text-slate-600 whitespace-nowrap">
                                  <p>+{source.orundum} Orundum</p>
                                  <p>+{source.permits} permit</p>
                                  {source.freePulls > 0 ? (
                                    <p>+{source.freePulls} free pull</p>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                              Pull hiện có
                            </p>
                            <p className="text-2xl font-black text-slate-800 mt-1">
                              {plannerCurrentPulls}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              Từ kho hiện tại, chưa tính phần farm thêm.
                            </p>
                          </div>
                          <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                              Pull mang sang được
                            </p>
                            <p className="text-2xl font-black text-sky-700 mt-1">
                              {plannerProjectedTransferablePulls}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              Bao gồm Orundum/permit tích trữ tới banner, còn dư{" "}
                              {plannerProjectedTransferableLeftoverOrundum} Orundum sau quy đổi.
                            </p>
                          </div>
                          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
                            <p className="text-xs text-slate-500 uppercase font-semibold">
                              Tổng dùng trên banner target
                            </p>
                            <p className="text-2xl font-black text-amber-600 mt-1">
                              {plannerProjectedBannerPulls}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              Gồm {plannerProjectedTransferablePulls} pull mang sang được +{" "}
                              {plannerTargetOnlyPulls} pull khóa trên banner target, còn dư{" "}
                              {plannerProjectedBannerLeftoverOrundum} Orundum quy đổi.
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-500">
                          {selectedPullPlannerTarget
                            ? `Tính từ hôm nay tới ${selectedPullPlannerTarget.name} còn ${plannerDaysUntilBanner} ngày, tương đương ${plannerWeeksUntilBanner} tuần tròn và xấp xỉ ${plannerMonthsUntilBanner.toFixed(1)} tháng để cộng nguồn ổn định. Pull "mang sang được" là số an toàn để quyết định save; free pull hoặc vé khóa banner chỉ được cộng ở ô tổng dùng trên banner target.`
                            : "Chọn một banner tương lai để bắt đầu tính."}
                        </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="sanity" className="mt-0 focus-visible:outline-none">
                        {userInfo ? (
                          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6">
                            <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 shadow-sm">
                              <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                  <Zap className="w-5 h-5 text-amber-500" />
                                  <h3 className="text-slate-800 font-bold text-lg">
                                    Máy tính sanity
                                  </h3>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-white border-slate-200 text-slate-600"
                                >
                                  Cap {sanityCap}
                                </Badge>
                              </div>
                              <p className="text-slate-500 text-sm mb-3">
                                Nhập lượng sanity hiện tại để tính số còn thiếu và thời gian
                                hồi đầy với tốc độ 1 sanity mỗi 6 phút.
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
                        ) : (
                          <Alert className="border-amber-200 bg-amber-50 text-amber-900 rounded-xl">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <AlertDescription className="ml-2 font-medium text-base">
                              Nhập UID ở phía trên để lấy level Doctor và dùng máy tính sanity.
                            </AlertDescription>
                          </Alert>
                        )}
                      </TabsContent>

                      <TabsContent value="recruitment" className="mt-0 focus-visible:outline-none">
                        <div className="bg-white/60 rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-slate-800 font-bold text-lg">
                              Recruitment Calculator
                            </p>
                            <p className="text-slate-500 text-sm mt-1">
                              Chọn các tag bạn đang có, tối đa 6 tag, để xem combo hợp lệ
                              và operator có thể ra từ recruitment pool hiện có.
                            </p>
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
                              className="rounded-xl border border-slate-100 bg-white/70 p-3"
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
                                        {active ? (
                                          <Check className="h-3.5 w-3.5 shrink-0" />
                                        ) : null}
                                        <span className="font-semibold">{tag}</span>
                                        {highlighted ? (
                                          <span className="text-[10px] opacity-80">
                                            Nên để ý
                                          </span>
                                        ) : null}
                                      </span>
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
                          <div>
                            <p className="font-bold text-slate-800">Gợi ý theo operator mục tiêu</p>
                            <p className="text-sm text-slate-500 mt-1">
                              Nhập tên operator muốn ra để xem các combo tag phù hợp.
                            </p>
                          </div>
                          <Input
                            value={recruitmentTargetInput}
                            onChange={(e) => setRecruitmentTargetInput(e.target.value)}
                            placeholder="Ví dụ: Saria, Myrtle, Phantom..."
                            className="bg-white/80 border-slate-200 rounded-xl"
                          />
                          {normalizedRecruitmentTargetInput ? (
                            selectedRecruitmentTargetOperator ? (
                              <div className="space-y-3">
                                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="size-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shrink-0">
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
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {recruitmentTargetSuggestions.slice(0, 6).map((combo) => (
                                    <div
                                      key={`target-${selectedRecruitmentTargetOperator.name}-${combo.tags.join("|")}`}
                                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
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
                                        Operator:{" "}
                                        {combo.operators.map((operator) => operator.name).join(", ")}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-500">
                                Không tìm thấy operator recruitable nào khớp tên bạn nhập.
                              </div>
                            )
                          ) : null}
                        </div>

                        <div className="space-y-3">
                          {selectedRecruitmentTags.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
                              Chọn từ 2 đến 6 tag bạn đang có để hiện combo hợp lệ và operator phù hợp.
                            </div>
                          ) : (
                            <>
                              <div className="bg-white rounded-xl border border-slate-100 p-4">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                  <p className="font-bold text-slate-800">
                                    Tất cả combo hợp lệ
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="bg-white border-slate-200 text-slate-600"
                                  >
                                    {recruitmentComboResults.length} combo
                                  </Badge>
                                </div>
                                {recruitmentComboResults.length > 0 ? (
                                  <div className="space-y-2">
                                    {recruitmentComboResults.map((combo) => (
                                      <div
                                        key={combo.tags.join("|")}
                                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
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
                                        <p className="mt-2 text-sm text-slate-700">
                                          {combo.recommendation}.
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                          {combo.operators.map((operator) => (
                                            <div
                                              key={`${combo.tags.join("|")}-${operator.name}`}
                                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2"
                                            >
                                              <div className="size-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shrink-0">
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
                                                  {Array.from({ length: operator.rarity }).map(
                                                    (_, index) => (
                                                      <Star
                                                        key={`${combo.tags.join("|")}-${operator.name}-star-${index}`}
                                                        className="h-3 w-3 fill-amber-500 text-amber-500"
                                                      />
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-500">
                                    Chưa có combo hợp lệ. Chọn thêm tag để hệ thống gợi ý.
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

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
                    <CardDescription className="text-slate-500 text-base">
                      Theo dõi danh sách operator, ngày ra mắt Global và lọc nhanh
                      theo tên hoặc độ hiếm.
                    </CardDescription>
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
                    <CardDescription className="text-slate-500 text-base">
                      Xem banner đã ra và sắp ra, kèm character xuất hiện trong
                      từng banner để tra cứu nhanh.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                      <div className="relative flex-1 max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          placeholder="Tìm theo tên banner, category hoặc character"
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
                            const bannerIsLimited = isBannerLimited(banner);
                            const visibleBannerOperators =
                              getNormalizedBannerOperatorNames(banner);
                            const predictionDetails =
                              bannerPredictionDetailsByKey.get(getBannerKey(banner)) ??
                              null;
                            const estimatedReleaseDate =
                              !isReleased ? predictionDetails?.date ?? null : null;

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
                                        bannerIsLimited
                                          ? "bg-rose-100 text-rose-700 border-rose-200"
                                          : "bg-slate-50 border-slate-200 text-slate-500"
                                      }
                                    >
                                      {bannerIsLimited ? "Limited" : banner.category}
                                    </Badge>
                                  </div>

                                  <div className="flex flex-col items-center text-center">
                                    <p className="font-bold text-slate-800 leading-tight text-base min-h-[3rem] flex items-center justify-center">
                                      {banner.name}
                                    </p>

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
                                      <>
                                        <p className="text-[11px] text-amber-600 mt-2 font-medium">
                                          Dự đoán: {formatDisplayDate(estimatedReleaseDate)}
                                        </p>
                                        {predictionDetails && (
                                          <p className="text-[10px] text-slate-500 mt-1">
                                            Dựa trên {predictionDetails.sampleSize} banner{" "}
                                            {predictionDetails.reason}.
                                          </p>
                                        )}
                                      </>
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
                    <CardDescription className="text-slate-500 text-base">
                      Xem tier list mặc định, tạo tier list riêng và sắp xếp operator
                      theo cách đánh giá của bạn.
                    </CardDescription>
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
                <Card className="glass-card border-0 shadow-sm overflow-hidden mb-4">
                  <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                  <CardHeader className="pb-4 bg-white/30 border-b border-slate-100">
                    <CardTitle className="text-slate-800 flex items-center gap-3 text-xl">
                      <div className="p-2 bg-cyan-100 rounded-lg border border-cyan-200">
                        <Gamepad2 className="w-6 h-6 text-cyan-600" />
                      </div>
                      Tin tức
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-base">
                      Theo dõi thông báo mới từ Yostar, nội dung event, banner,
                      outfit và pack đang mở trong game.
                    </CardDescription>
                  </CardHeader>
                </Card>
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
                      Kiểm tra lịch sử roll, lọc banner và theo dõi pity từ dữ
                      liệu gacha của tài khoản. Dán cookie lấy từ{" "}
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
