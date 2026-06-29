import { NextResponse } from "next/server";

const GAME_DATA_BASE_URL =
  "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel";

const DATA_URLS = {
  characters: `${GAME_DATA_BASE_URL}/character_table.json`,
  items: `${GAME_DATA_BASE_URL}/item_table.json`,
  skills: `${GAME_DATA_BASE_URL}/skill_table.json`,
};

const WIKI_PARSE_API =
  "https://arknights.wiki.gg/api.php?action=parse&page=Operator/List&prop=text&formatversion=2&format=json";
const WIKI_PARSE_PAGE_API = (pageName: string) =>
  `https://arknights.wiki.gg/api.php?action=parse&page=${encodeURIComponent(
    pageName,
  )}&prop=text&formatversion=2&format=json`;
const WIKI_SOURCE_PAGE = "https://arknights.wiki.gg/wiki/Operator/List";

const ITEM_NAME_FALLBACKS: Record<string, string> = {
  "4001": "LMD",
  "3301": "Skill Summary - 1",
  "3302": "Skill Summary - 2",
  "3303": "Skill Summary - 3",
};

type RawCost = {
  count?: number;
  id?: string;
  type?: string;
};

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

type WikiOperator = {
  cnReleaseDate: string | null;
  enReleaseDate: string | null;
  event: string;
  globalReleased: boolean;
  name: string;
  pageName: string;
  rarity: number;
};

type PlannerItem = {
  iconUrl: string | null;
  id: string;
  name: string;
  rarity: number;
};

type WikiPromotionData = {
  items: Record<string, PlannerItem>;
  phases: PlannerPhase[];
};

const htmlEntityMap: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(
      /&(amp|lt|gt|quot|#39|nbsp);/g,
      (entity) => htmlEntityMap[entity] ?? entity,
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    );

const stripHtml = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractDate = (value: string) => {
  const match = value.match(/\b\d{4}-\d{2}-\d{2}\b/);
  return match?.[0] ?? null;
};

const extractRows = (tableHtml: string) =>
  tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

const getHtmlAttribute = (value: string, attribute: string) => {
  const match = value.match(new RegExp(`${attribute}="([^"]*)"`, "i"));
  return match?.[1] ? decodeHtmlEntities(match[1]) : "";
};

const extractOperatorsTable = (
  html: string,
  sectionId: string,
  fallbackLabel: string,
) => {
  const sectionStart =
    html.indexOf(`id="${sectionId}"`) >= 0
      ? html.indexOf(`id="${sectionId}"`)
      : html.indexOf(`>${fallbackLabel}<`);

  if (sectionStart < 0) {
    return "";
  }

  const tableStart = html.indexOf("<table", sectionStart);
  if (tableStart < 0) {
    return "";
  }

  const tableEnd = html.indexOf("</table>", tableStart);
  if (tableEnd < 0) {
    return "";
  }

  return html.slice(tableStart, tableEnd + "</table>".length);
};

const normalizeNameKey = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const toWikiItemId = (name: string) =>
  `wiki:${normalizeNameKey(name).replace(/\s+/g, "-")}`;

const cleanOperatorName = (value: string) =>
  value.trim().replace(/^['"]+|['"]+$/g, "");

const toAbsoluteWikiUrl = (value: string) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `https://arknights.wiki.gg${value}`;
  return `https://arknights.wiki.gg/${value}`;
};

const parseQuantity = (value: string) => {
  const normalized = stripHtml(value).replace(/,/g, "").trim().toUpperCase();
  const match = normalized.match(/^(\d+(?:\.\d+)?)([KM])?$/);
  if (!match) return 0;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;

  const multiplier = match[2] === "M" ? 1_000_000 : match[2] === "K" ? 1_000 : 1;
  return Math.round(amount * multiplier);
};

const estimateMaxElite = (rarity: number) => {
  if (rarity >= 4) return 2;
  if (rarity === 3) return 1;
  return 0;
};

const fetchGameData = async <TValue,>(url: string) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "ArkReview operator planner",
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`Game data request failed: ${response.status}`);
  }

  return (await response.json()) as TValue;
};

const fetchWikiOperators = async () => {
  const response = await fetch(WIKI_PARSE_API, {
    headers: {
      Accept: "application/json, text/html;q=0.9, */*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Wiki request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { parse?: { text?: string } };
  const html = payload.parse?.text ?? "";
  const operators = new Map<string, WikiOperator>();

  const parseTable = (tableHtml: string, isGlobalReleased: boolean) => {
    for (const row of extractRows(tableHtml)) {
      const cells = [...row.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map(
        (match) => match[1] ?? "",
      );

      if (cells.length < 8) continue;

      const name = stripHtml(cells[1]);
      const pageMatch = cells[1].match(/href="\/wiki\/([^"#?]+)[^"]*"/i);
      const rarity = parseRarity(stripHtml(cells[2]));
      const event = stripHtml(cells[isGlobalReleased ? 6 : 5]);
      const cnReleaseDate = isGlobalReleased ? null : extractDate(stripHtml(cells[6]));
      const enReleaseDate = isGlobalReleased ? extractDate(stripHtml(cells[7])) : null;

      if (!name) continue;

      const existing = operators.get(name);
      operators.set(name, {
        cnReleaseDate: cnReleaseDate ?? existing?.cnReleaseDate ?? null,
        enReleaseDate: enReleaseDate ?? existing?.enReleaseDate ?? null,
        event: event || existing?.event || "",
        globalReleased: isGlobalReleased || Boolean(existing?.enReleaseDate),
        name,
        pageName:
          pageMatch?.[1] ? decodeURIComponent(pageMatch[1]).replace(/ /g, "_") : existing?.pageName ?? name.replace(/\s+/g, "_"),
        rarity: rarity || existing?.rarity || 0,
      });
    }
  };

  parseTable(extractOperatorsTable(html, "CN_Operators", "CN Operators"), false);
  parseTable(extractOperatorsTable(html, "EN_Operators", "EN Operators"), true);

  return [...operators.values()];
};

const fetchWikiPageMarkup = async (pageName: string) => {
  const response = await fetch(WIKI_PARSE_PAGE_API(pageName), {
    headers: {
      Accept: "application/json, text/html;q=0.9, */*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Wiki page request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { parse?: { text?: string } };
  return payload.parse?.text ?? "";
};

const extractTableById = (html: string, tableId: string) => {
  const idIndex = html.indexOf(`id="${tableId}"`);
  if (idIndex < 0) return "";

  const tableStart = html.lastIndexOf("<table", idIndex);
  if (tableStart < 0) return "";

  const tableEnd = html.indexOf("</table>", idIndex);
  if (tableEnd < 0) return "";

  return html.slice(tableStart, tableEnd + "</table>".length);
};

const buildItemNameLookup = (itemTable: any) => {
  const tableItems = itemTable?.items ?? {};
  const lookup = new Map<string, string>();

  for (const [id, item] of Object.entries(tableItems)) {
    const name = typeof (item as any)?.name === "string" ? (item as any).name.trim() : "";
    if (name) {
      lookup.set(normalizeNameKey(name), id);
    }
  }

  for (const [id, name] of Object.entries(ITEM_NAME_FALLBACKS)) {
    lookup.set(normalizeNameKey(name), id);
  }

  return lookup;
};

const parseWikiPromotionData = (
  html: string,
  itemNameLookup: Map<string, string>,
): WikiPromotionData => {
  const tableHtml = extractTableById(html, "operator-promotion-table");
  const items: Record<string, PlannerItem> = {};
  const phases: PlannerPhase[] = [{ elite: 0, maxLevel: 0, promotionCosts: [] }];

  for (const row of extractRows(tableHtml)) {
    const eliteMatch = stripHtml(row).match(/\bElite\s+([12])\b/i);
    if (!eliteMatch) continue;

    const elite = Number(eliteMatch[1]);
    const maxLevelMatch = stripHtml(row).match(/Level\s+(\d+)/i);
    const maxLevel = maxLevelMatch ? Number(maxLevelMatch[1]) : 0;
    const costs: PlannerCost[] = [];
    const itemMatches = [
      ...row.matchAll(
        /<div class="item-tooltip"([^>]*)>[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<div class="quantity">([^<]+)<\/div>/gi,
      ),
    ];

    for (const match of itemMatches) {
      const attributes = match[1] ?? "";
      const name = getHtmlAttribute(attributes, "data-name");
      const count = parseQuantity(match[3] ?? "");

      if (!name || count <= 0) continue;

      const matchedItemId = itemNameLookup.get(normalizeNameKey(name));
      const id = matchedItemId ?? toWikiItemId(name);
      const rarity = parseRarity(getHtmlAttribute(attributes, "data-tier"));

      costs.push({
        count,
        id,
        type: "MATERIAL",
      });

      if (!matchedItemId) {
        items[id] = {
          iconUrl: toAbsoluteWikiUrl(match[2] ?? ""),
          id,
          name,
          rarity,
        };
      }
    }

    phases[elite] = {
      elite,
      maxLevel,
      promotionCosts: costs,
    };
  }

  return { items, phases };
};

const enrichWikiOnlyOperatorsWithPromotionData = async (
  operators: PlannerOperator[],
  wikiOperators: WikiOperator[],
  itemNameLookup: Map<string, string>,
) => {
  const wikiByName = new Map(
    wikiOperators.map((operator) => [normalizeNameKey(operator.name), operator]),
  );
  const wikiItems: Record<string, PlannerItem> = {};
  const wikiOnlyOperators = operators.filter((operator) => !operator.hasUpgradeData);

  await Promise.all(
    wikiOnlyOperators.map(async (operator) => {
      const wikiOperator = wikiByName.get(normalizeNameKey(operator.name));
      if (!wikiOperator?.pageName) return;

      try {
        const html = await fetchWikiPageMarkup(wikiOperator.pageName);
        const promotionData = parseWikiPromotionData(html, itemNameLookup);
        const hasPromotionCosts = promotionData.phases.some(
          (phase) => phase.promotionCosts.length > 0,
        );

        if (!hasPromotionCosts) return;

        operator.phases = promotionData.phases;
        operator.maxElite = Math.max(0, promotionData.phases.length - 1);
        operator.hasUpgradeData = true;

        for (const [id, item] of Object.entries(promotionData.items)) {
          wikiItems[id] = item;
        }
      } catch (error) {
        console.error(`Failed to fetch wiki promotion data for ${operator.name}`, error);
      }
    }),
  );

  return wikiItems;
};

const normalizeCost = (value: RawCost): PlannerCost | null => {
  const id = typeof value.id === "string" ? value.id.trim() : "";
  const count = Number(value.count ?? 0);

  if (!id || !Number.isFinite(count) || count <= 0) {
    return null;
  }

  return {
    id,
    count,
    type: typeof value.type === "string" ? value.type : "MATERIAL",
  };
};

const normalizeCosts = (value: unknown): PlannerCost[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => normalizeCost(entry as RawCost))
    .filter((entry): entry is PlannerCost => Boolean(entry));
};

const parseRarity = (value: unknown) => {
  if (typeof value === "number") {
    return value >= 0 && value <= 5 ? value + 1 : value;
  }

  if (typeof value === "string") {
    const match = value.match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : 0;
  }

  return 0;
};

const getSkillName = (skillTable: Record<string, any>, skillId: string, index: number) => {
  const skill = skillTable[skillId];
  const firstLevel = Array.isArray(skill?.levels) ? skill.levels[0] : null;
  const name = typeof firstLevel?.name === "string" ? firstLevel.name.trim() : "";

  return name || `Skill ${index + 1}`;
};

const getWikiImageName = (value: string) =>
  encodeURIComponent(value.trim().replace(/\s+/g, "_")).replace(/'/g, "%27");

const getOperatorAvatarUrl = (name: string) =>
  `https://arknights.wiki.gg/images/${getWikiImageName(name)}_icon.png`;

const getItemIconUrl = (iconId: unknown) => {
  if (typeof iconId !== "string" || !iconId.trim()) {
    return null;
  }

  return `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/${encodeURIComponent(
    iconId.trim(),
  )}.png`;
};

const normalizeOperator = (
  id: string,
  operator: any,
  skillTable: Record<string, any>,
): PlannerOperator | null => {
  const name =
    typeof operator?.name === "string" ? cleanOperatorName(operator.name) : "";

  if (
    !name ||
    id.startsWith("token_") ||
    id.startsWith("trap_") ||
    operator?.isNotObtainable === true
  ) {
    return null;
  }

  const phases: PlannerPhase[] = Array.isArray(operator.phases)
    ? operator.phases.map((phase: any, index: number) => ({
        elite: index,
        maxLevel: Number(phase?.maxLevel ?? 0),
        promotionCosts: normalizeCosts(phase?.evolveCost),
      }))
    : [];

  const skills: PlannerSkill[] = Array.isArray(operator.skills)
    ? operator.skills
        .map((skill: any, index: number) => {
          const skillId = typeof skill?.skillId === "string" ? skill.skillId : "";

          if (!skillId) {
            return null;
          }

          const masteryCosts = Array.isArray(skill?.levelUpCostCond)
            ? skill.levelUpCostCond.map((condition: any) =>
                normalizeCosts(condition?.levelUpCostCond),
              )
            : [];

          return {
            id: skillId,
            name: getSkillName(skillTable, skillId, index),
            masteryCosts,
          };
        })
        .filter((skill: PlannerSkill | null): skill is PlannerSkill => Boolean(skill))
    : [];

  return {
    avatarUrl: getOperatorAvatarUrl(name),
    dataSource: "gamedata",
    event: "",
    globalReleased: true,
    hasUpgradeData: true,
    id,
    maxElite: Math.max(0, phases.length - 1),
    name,
    phases,
    profession:
      typeof operator?.profession === "string" ? operator.profession.replaceAll("_", " ") : "",
    rarity: parseRarity(operator?.rarity),
    skillLevelCosts: Array.isArray(operator.allSkillLvlup)
      ? operator.allSkillLvlup.map((condition: any) =>
          normalizeCosts(condition?.lvlUpCost ?? condition?.levelUpCostCond),
        )
      : [],
    skills,
  };
};

const mergeWikiOperators = (
  gameDataOperators: PlannerOperator[],
  wikiOperators: WikiOperator[],
) => {
  const operatorsByKey = new Map(
    gameDataOperators.map((operator) => [normalizeNameKey(operator.name), operator]),
  );

  for (const wikiOperator of wikiOperators) {
    const key = normalizeNameKey(wikiOperator.name);
    const existing = operatorsByKey.get(key);

    if (existing) {
      existing.event = wikiOperator.event;
      existing.globalReleased = wikiOperator.globalReleased;
      existing.rarity = existing.rarity || wikiOperator.rarity;
      continue;
    }

    operatorsByKey.set(key, {
      avatarUrl: getOperatorAvatarUrl(wikiOperator.name),
      dataSource: "wiki",
      event: wikiOperator.event,
      globalReleased: wikiOperator.globalReleased,
      hasUpgradeData: false,
      id: `wiki:${wikiOperator.name}`,
      maxElite: estimateMaxElite(wikiOperator.rarity),
      name: wikiOperator.name,
      phases: Array.from(
        { length: estimateMaxElite(wikiOperator.rarity) + 1 },
        (_, elite) => ({
          elite,
          maxLevel: 0,
          promotionCosts: [],
        }),
      ),
      profession: "",
      rarity: wikiOperator.rarity,
      skillLevelCosts: [],
      skills: [],
    });
  }

  return [...operatorsByKey.values()].sort((left, right) => {
    if (right.rarity !== left.rarity) return right.rarity - left.rarity;
    if (Number(right.hasUpgradeData) !== Number(left.hasUpgradeData)) {
      return Number(right.hasUpgradeData) - Number(left.hasUpgradeData);
    }

    return left.name.localeCompare(right.name);
  });
};

const collectItemIds = (operators: PlannerOperator[]) => {
  const itemIds = new Set<string>();

  for (const operator of operators) {
    for (const phase of operator.phases) {
      for (const cost of phase.promotionCosts) {
        itemIds.add(cost.id);
      }
    }

    for (const skill of operator.skills) {
      for (const masteryStep of skill.masteryCosts) {
        for (const cost of masteryStep) {
          itemIds.add(cost.id);
        }
      }
    }

    for (const skillLevelStep of operator.skillLevelCosts) {
      for (const cost of skillLevelStep) {
        itemIds.add(cost.id);
      }
    }
  }

  return itemIds;
};

const buildItemMap = (itemTable: any, itemIds: Set<string>) => {
  const tableItems = itemTable?.items ?? {};
  const items: Record<string, { iconUrl: string | null; id: string; name: string; rarity: number }> =
    {};

  for (const id of itemIds) {
    const item = tableItems[id] ?? {};
    const name =
      typeof item.name === "string" && item.name.trim()
        ? item.name.trim()
        : ITEM_NAME_FALLBACKS[id] ?? id;

    items[id] = {
      iconUrl: getItemIconUrl(item.iconId),
      id,
      name,
      rarity: parseRarity(item.rarity),
    };
  }

  return items;
};

export async function GET() {
  try {
    const [characterTable, itemTable, skillTable, wikiOperators] = await Promise.all([
      fetchGameData<Record<string, any>>(DATA_URLS.characters),
      fetchGameData<any>(DATA_URLS.items),
      fetchGameData<Record<string, any>>(DATA_URLS.skills),
      fetchWikiOperators().catch((error) => {
        console.error("Failed to fetch wiki operator list", error);
        return [] as WikiOperator[];
      }),
    ]);

    const gameDataOperators = Object.entries(characterTable)
      .map(([id, operator]) => normalizeOperator(id, operator, skillTable))
      .filter((operator): operator is PlannerOperator => Boolean(operator))
    const operators = mergeWikiOperators(gameDataOperators, wikiOperators);
    const itemNameLookup = buildItemNameLookup(itemTable);
    const wikiItems = await enrichWikiOnlyOperatorsWithPromotionData(
      operators,
      wikiOperators,
      itemNameLookup,
    );

    const itemIds = collectItemIds(operators);
    const items = {
      ...buildItemMap(itemTable, itemIds),
      ...wikiItems,
    };

    return NextResponse.json({
      items,
      operators,
      sources: ["ArknightsGameData_YoStar", WIKI_SOURCE_PAGE],
      sourceUpdatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Không tải được dữ liệu nâng cấp operator." },
      { status: 502 },
    );
  }
}
