import { NextResponse } from "next/server";

const WIKI_PARSE_API = (page: string) =>
  `https://arknights.wiki.gg/api.php?action=parse&page=${encodeURIComponent(page)}&prop=text&formatversion=2&format=json`;

const YOSTAR_NEWS_API = (index: number, size: number) =>
  `https://account.yo-star.com/api/game/news?key=ark&index=${index}&size=${size}`;

const GH_SKIN_TABLE_CN =
  "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/excel/skin_table.json";
const GH_SKIN_TABLE_GLOBAL =
  "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel/skin_table.json";
const GH_CHAR_TABLE_GLOBAL =
  "https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel/character_table.json";

const CN_BRAND_MAP: Record<string, string> = {
  "小马宝莉": "My Little Pony",
  "轻松小熊": "Rilakkuma",
  "破格视界": "Beyond the Horizon",
  "Ave Mujica": "Ave Mujica",
  "太鼓之达人": "Taiko no Tatsujin",
  "错位巡礼": "Misaligned Sightseer",
  "待予花冠": "Unveiling of Devotion",
  "命途迭代": "Iteration Provident",
  "成就之星": "Achievement Star",
  "闪耀阶梯": "Shining Steps",
  "冰原信使": "Icefield Messenger",
  "珊瑚海岸": "Coral Coast",
  "时代": "EPOQUE",
  "斗争血脉": "Bloodline of Combat",
  "忒斯特收藏": "Test Collection",
  "0011制造": "Made by 0011",
  "0011飙系列": "0011 Tempest",
  "0011韵系列": "0011 Yun",
  "生命之地": "Vitafield",
  "先驱": "Pioneer",
  "打击": "Striker",
  "罗德岛厨房": "Rhodes Kitchen",
  "梦幻城堡": "Dreambind Castle",
  "呼啸": "Whistlewind",
  "音律联觉": "Ambience Synesthesia",
  "玛尔特": "MARTHE",
  "巫异盛宴": "Witch Feast",
  "坎贝拉系列": "Cambrian Series",
};

type NewsRow = {
  content: string;
  id: number | string;
  link: string;
  publishTime: number | string;
  title: string;
};

type UpcomingSkin = {
  brand: string;
  category: "new" | "re-edition";
  durationEnd: number;
  durationStart: number;
  id: string;
  imageUrl: string | null;
  operator: string;
  price: number | null;
  skinName: string;
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&#32;/g, " ");

const stripHtml = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toAbsoluteWikiUrl = (value: string | null | undefined) => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `https://arknights.wiki.gg${value}`;
  return `https://arknights.wiki.gg/${value.replace(/^\.?\//, "")}`;
};

const normalizeId = (value: string) =>
  stripHtml(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const fetchNewsPage = async (index: number, size: number) => {
  const response = await fetch(YOSTAR_NEWS_API(index, size), {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [] as NewsRow[];

  const payload = (await response.json()) as {
    code?: number;
    data?: { rows?: NewsRow[] };
  };

  if (payload.code !== 0 || !Array.isArray(payload.data?.rows)) return [];

  return payload.data.rows;
};

const SKIN_LINE_REGEX =
  /([A-Za-z0-9 ]+?)\s+(Collection|Series)\s*[-–—]\s*(.+?)\s+for\s+([A-Za-z][A-Za-z \-']+?)(?:\s*\(|<|\s*$)/i;

const isInvalidSkinText = (value: string) =>
  /,|\band\b|including|etc\.?|more|Furniture|Materials|LMD|Battle\s*Records/i.test(value);

const SECTION_HEADER_REGEX = /<h2[^>]*>[\s\S]*?<\/h2>/gi;

const CATEGORY_BRAND_REGEX =
  /(?:EPOQUE|Coral Coast|MARTHE|Witch Feast|Cambrian Series|Icefield Messenger|Vitafield|Pioneer|Striker|Bloodline of Combat|Rhodes Kitchen|Dreambind Castle|Whistlewind|Ambience Synesthesia|Shining Steps|CROSSOVER|Made by 0011|0011 Tempest|0011 Yun|Test Collection)\s+Collection/i;

const DURATION_REGEX =
  /DURATION:\s*([^<]+?)\s*[-–—]\s*([^<]+?)\s*\(/i;

const parseDate = (dateStr: string) => {
  const cleaned = stripHtml(dateStr);
  const d = new Date(cleaned);
  return Number.isFinite(d.getTime()) ? d.getTime() : 0;
};

const parseOutfitSections = (html: string) => {
  const sections: Array<{
    brand: string;
    category: "new" | "re-edition";
    durationStart: number;
    durationEnd: number;
    skinName: string;
    operator: string;
  }> = [];

  const sectionBlocks = html.split(SECTION_HEADER_REGEX);

  for (const block of sectionBlocks) {
    const isReEdition = /Re-edition\s+Outfit/i.test(block);
    const isNewArrival =
      !isReEdition &&
      (/NEW\s+ARRIVAL/i.test(block) ||
        /new\s+Outfit/i.test(block) ||
        /Outfit\s+will be available/i.test(block));

    if (!isNewArrival && !isReEdition) continue;

    const category: "new" | "re-edition" = isNewArrival ? "new" : "re-edition";
    const cleanBlock = stripHtml(block);

    const durationMatch = cleanBlock.match(DURATION_REGEX);
    if (!durationMatch) continue;

    const durationStart = parseDate(durationMatch[1]);
    const durationEnd = parseDate(durationMatch[2]);

    const brandMatch = cleanBlock.match(CATEGORY_BRAND_REGEX);
    const brand = brandMatch
      ? brandMatch[0].replace(/\s+Collection/i, "")
      : "Unknown";

    const divLines = block.split(/<div[^>]*>/gi);
    for (const line of divLines) {
      const cleanLine = stripHtml(line);
      const skinMatch = cleanLine.match(SKIN_LINE_REGEX);
      if (!skinMatch) continue;

      const brandPrefix = stripHtml(skinMatch[1]).trim();
      const brandSuffix = stripHtml(skinMatch[2]).trim();
      const lineBrand = brandSuffix === "Series" ? `${brandPrefix} ${brandSuffix}` : brandPrefix;
      const skinName = stripHtml(skinMatch[3]).trim();
      const operator = stripHtml(skinMatch[4]).trim();

      if (!skinName || !operator) continue;
      if (isInvalidSkinText(skinName) || isInvalidSkinText(operator)) continue;

      sections.push({
        brand: /crossover/i.test(lineBrand) ? brand : lineBrand,
        category,
        durationStart,
        durationEnd,
        skinName,
        operator,
      });
    }
  }

  return sections;
};

const fetchWikiMarkup = async (page: string) => {
  const response = await fetch(WIKI_PARSE_API(page), {
    headers: {
      Accept: "application/json, text/html;q=0.9, */*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as { parse?: { text?: string } };
  return payload.parse?.text ?? null;
};

const extractBrandPages = (html: string) => {
  const pages = new Map<string, string>();
  const matches = [
    ...html.matchAll(
      /href="\/wiki\/(Outfit\/[^"#?]+)"\s+title="Outfit\/([^"]+)"/gi,
    ),
  ];

  for (const match of matches) {
    const page = decodeURIComponent(match[1] ?? "").replace(/ /g, "_");
    const name = stripHtml(match[2] ?? "").replace(/_/g, " ");
    if (page && name && !/Gallery|action=/.test(page)) {
      pages.set(page, name);
    }
  }

  return [...pages.entries()].map(([page, name]) => ({ name, page }));
};

const extractPrice = (html: string) => {
  const pattern = /<div><b>How to obtain(?:&#58;|:)<\/b>[\s\S]*?<\/div>/i;
  const match = html.match(pattern);
  if (!match) return null;
  const raw = match[0];
  const opMatch = raw.match(
    /(\d+)\s*(?:&#32;)?\s*<a[\s\S]*?title="Originite Prime"/i,
  );
  return opMatch ? Number(opMatch[1]) : null;
};

const extractLabeledValue = (html: string, label: string) => {
  const pattern = new RegExp(
    `<div><b>${label}(?:&#58;|:)</b>[\\s\\S]*?<\\/div>`,
    "i",
  );
  const match = html.match(pattern);
  return match
    ? stripHtml(match[0]).replace(new RegExp(`^${label}:?\\s*`, "i"), "")
    : "";
};

const parseSkinRows = (html: string, brand: string, sourcePage: string) => {
  const skins: Array<{
    brand: string;
    id: string;
    imageUrl: string | null;
    operator: string;
    price: number | null;
    skinName: string;
  }> = [];
  const titleMatches = [
    ...html.matchAll(
      /<td\s+id="([^"]+)"[^>]*colspan="2"[\s\S]*?<b>([\s\S]*?)<\/b>[\s\S]*?<\/td>\s*<\/tr>\s*<tr[^>]*>([\s\S]*?)<\/tr>/gi,
    ),
  ];

  for (const match of titleMatches) {
    const skinName = stripHtml(match[2] ?? "");
    const detailRow = match[3] ?? "";
    if (!skinName) continue;

    const operator =
      stripHtml(
        detailRow.match(
          /class="character-tooltip"[^>]*data-name="([^"]+)"/i,
        )?.[1] ??
          detailRow.match(/<b>Model:<\/b>[\s\S]*?title="([^"]+)"/i)?.[1] ??
          "",
      ) || "Unknown";
    const imageUrl = toAbsoluteWikiUrl(
      detailRow.match(
        /<img[^>]+class="character-image"[^>]+src="([^"]+)"/i,
      )?.[1] ??
        detailRow.match(/<img[^>]+src="([^"]+Skin[^"]+)"/i)?.[1] ??
        null,
    );
    const price = extractPrice(detailRow);
    const id = `${normalizeId(operator)}-${normalizeId(skinName)}`;

    skins.push({ brand, id, imageUrl, operator, price, skinName });
  }

  return skins;
};

type CnSkin = {
  charId: string;
  skinName: string;
  brand: string;
  sortId: number;
  portraitId: string | null;
  getTime: number;
};

const memoryCache = new Map<
  string,
  { data: any; expiry: number }
>();

const fetchJSON = async <T>(url: string, ttl = 3600_000): Promise<T | null> => {
  const cached = memoryCache.get(url);
  if (cached && Date.now() < cached.expiry) return cached.data as T;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
  });
  if (!response.ok) return null;
  const data = (await response.json()) as T;
  memoryCache.set(url, { data, expiry: Date.now() + ttl });
  return data;
};

const fetchCharacterMap = async () => {
  const data = await fetchJSON<Record<string, { name: string; isNotObtainable?: boolean }>>(
    GH_CHAR_TABLE_GLOBAL,
  );
  if (!data) return new Map<string, string>();
  const map = new Map<string, string>();
  for (const [id, ch] of Object.entries(data)) {
    if (!ch.isNotObtainable) map.set(id, ch.name);
  }
  return map;
};

const fetchCnOnlySkins = async () => {
  const [cnData, globalData] = await Promise.all([
    fetchJSON<{ charSkins: Record<string, any> }>(GH_SKIN_TABLE_CN),
    fetchJSON<{ charSkins: Record<string, any> }>(GH_SKIN_TABLE_GLOBAL),
  ]);
  if (!cnData || !globalData) return [];

  const globalSkinIds = new Set(Object.keys(globalData.charSkins));
  const cnOnly: CnSkin[] = [];

  for (const [id, skin] of Object.entries(cnData.charSkins)) {
    if (!skin.isBuySkin) continue;
    if (!skin.displaySkin?.skinName) continue;
    if (globalSkinIds.has(id)) continue;

    cnOnly.push({
      charId: skin.charId,
      skinName: skin.displaySkin.skinName,
      brand: skin.displaySkin.skinGroupName || "",
      sortId: skin.displaySkin.sortId || 0,
      portraitId: skin.portraitId || null,
      getTime: skin.displaySkin.getTime || 0,
    });
  }

  cnOnly.sort((a, b) => b.sortId - a.sortId);
  return cnOnly;
};

const mapCnBrand = (cnBrand: string) => {
  if (CN_BRAND_MAP[cnBrand]) return CN_BRAND_MAP[cnBrand];
  const base = cnBrand.replace(/\/[IVXL]+$/, "");
  if (CN_BRAND_MAP[base]) return CN_BRAND_MAP[base] + cnBrand.slice(base.length);
  return cnBrand;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cnPage = Math.max(1, Number(searchParams.get("cnPage")) || 1);
    const cnPerPage = Math.max(1, Math.min(100, Number(searchParams.get("cnPerPage")) || 9));

    const newsRows: NewsRow[] = [];
    for (let page = 1; page <= 10; page += 1) {
      const rows = await fetchNewsPage(page, 5);
      newsRows.push(...rows);
    }

    const upcomingSkins: UpcomingSkin[] = [];
    const seen = new Map<string, number>();
    const now = Date.now();

    for (const news of newsRows) {
      const title = news.title ?? "";
      const content = news.content ?? "";
      if (!/OUTFIT/i.test(title) && !/OUTFIT/i.test(content)) continue;

      const sections = parseOutfitSections(content);
      for (const section of sections) {
        if (!section.durationEnd || section.durationEnd < now) continue;

        const id = `${normalizeId(section.operator)}-${normalizeId(section.skinName)}`;
        const existing = seen.get(id);
        if (existing && existing <= section.durationStart) continue;
        seen.set(id, section.durationStart);

        upcomingSkins.push({
          brand: section.brand,
          category: section.category,
          durationEnd: section.durationEnd,
          durationStart: section.durationStart,
          id,
          imageUrl: null,
          operator: section.operator,
          price: null,
          skinName: section.skinName,
        });
      }
    }

    if (upcomingSkins.length > 0) {
      const outfitHtml = await fetchWikiMarkup("Outfit");
      if (outfitHtml) {
        const brandPages = extractBrandPages(outfitHtml);
        const wikiSkinMap = new Map<string, { imageUrl: string; price: number | null }>();

        for (const brand of brandPages) {
          const brandHtml = await fetchWikiMarkup(brand.page);
          if (!brandHtml) continue;
          const brandSkins = parseSkinRows(brandHtml, brand.name, brand.page);
          for (const skin of brandSkins) {
            if (skin.imageUrl) {
              const entry = { imageUrl: skin.imageUrl, price: skin.price };
              wikiSkinMap.set(skin.id, entry);
              wikiSkinMap.set(
                `${normalizeId(skin.operator)}-${normalizeId(skin.skinName.replace(/\s*\(.*?\)\s*/g, "").trim())}`,
                entry,
              );
            }
          }
        }

        for (const skin of upcomingSkins) {
          const match = wikiSkinMap.get(skin.id);
          if (match) {
            skin.imageUrl = match.imageUrl;
            skin.price = match.price;
          }
        }
      }
    }

    upcomingSkins.sort((a, b) => a.durationStart - b.durationStart);

    const [charMap, cnSkins] = await Promise.all([
      fetchCharacterMap(),
      fetchCnOnlySkins(),
    ]);

    const cnPredicted = cnSkins.map((skin) => {
      const operator = charMap.get(skin.charId) ?? skin.charId.replace(/^char_\d+_/, "");
      const hasWikiIcon = charMap.has(skin.charId);
      const cleanName = normalizeId(skin.skinName) || `cn-${skin.sortId}`;
      const id = `${normalizeId(operator)}-${cleanName}`;
      const brand = mapCnBrand(skin.brand);
      const cnRelease = skin.getTime > 0 ? skin.getTime * 1000 : Date.now();
      const estimatedStart = cnRelease + 180 * 24 * 60 * 60 * 1000;
      const estimatedEnd = estimatedStart + 21 * 24 * 60 * 60 * 1000;

      return {
        brand,
        category: "new" as const,
        durationEnd: estimatedEnd,
        durationStart: estimatedStart,
        id,
        imageUrl: skin.portraitId
          ? `https://raw.githubusercontent.com/PuppiizSunniiz/Arknight-Images/main/characters/${skin.portraitId.replace(/#/g, "%23")}.png`
          : null,
        fallbackImageUrl: hasWikiIcon
          ? `https://arknights.wiki.gg/images/${operator.replace(/ /g, "_")}_icon.png`
          : null,
        operator,
        price: null as number | null,
        skinName: skin.skinName,
        sortId: skin.sortId,
        source: "cn" as const,
      };
    });

    const cnTotal = cnPredicted.length;
    const cnPageStart = (cnPage - 1) * cnPerPage;
    const cnPageData = cnPredicted.slice(cnPageStart, cnPageStart + cnPerPage);

    return NextResponse.json(
      {
        count: upcomingSkins.length,
        data: upcomingSkins,
        cnPredicted: cnPageData,
        cnPage,
        cnPerPage,
        cnTotal,
        source: "https://account.yo-star.com",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch upcoming skins";

    return NextResponse.json({ count: 0, data: [], cnPredicted: [], cnTotal: 0, message }, { status: 500 });
  }
}
