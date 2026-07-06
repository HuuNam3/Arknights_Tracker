import { NextResponse } from "next/server";

const CURRENT_YEAR = new Date().getUTCFullYear();
const VISIBLE_BANNER_YEARS = new Set([CURRENT_YEAR]);
const UPCOMING_PAGE = "Headhunting/Banners/Upcoming";
const BANNER_YEAR_PAGES = [
  "Headhunting/Banners/2026",
  "Headhunting/Banners/2025",
  "Headhunting/Banners/2024",
  "Headhunting/Banners/2023",
  "Headhunting/Banners/2022",
  "Headhunting/Banners/2021",
];
const YOSTAR_NEWS_PAGE_SIZE = 50;
const YOSTAR_NEWS_MAX_PAGES = 3;
const YOSTAR_NEWS_API = (index: number, size: number) =>
  `https://account.yo-star.com/api/game/news?key=ark&index=${index}&size=${size}`;
const BANNER_CATEGORY_SECTIONS = [
  ["Limited_Headhunting", "Limited"],
  ["Special_Headhunting", "Special"],
  ["Standard_Headhunting", "Standard Pool"],
  ["Kernel_Headhunting", "Kernel"],
] as const;
const WIKI_PARSE_API = (page: string) =>
  `https://arknights.wiki.gg/api.php?action=parse&page=${encodeURIComponent(
    page,
  )}&prop=text&formatversion=2&format=json`;

type BannerRelease = {
  bannerImageUrl: string | null;
  category: string;
  cnEndDate: string | null;
  cnStartDate: string | null;
  current: boolean;
  enEndDate: string | null;
  enStartDate: string | null;
  globalReleased: boolean;
  limited: boolean;
  name: string;
  operators: string[];
  operatorRarities: Record<string, string>;
  releaseDate: string;
  releaseTs: number;
};

type BannerOperatorEntry = {
  name: string;
  rarity?: string;
};

type YostarNewsRow = {
  content?: string;
  id?: number | string;
  link?: string;
  publishTime?: number | string;
  title?: string;
};

type NewsBannerAnnouncement = {
  category: string;
  enEndDate: string | null;
  enStartDate: string;
  name: string;
  operators: string[];
  operatorRarities: Record<string, string>;
};

const MONTHS: Record<string, string> = {
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

const normalizeBannerCategory = (
  rawCategory: string | null | undefined,
  bannerName: string,
  rowText = "",
) => {
  const text = `${rawCategory ?? ""} ${bannerName} ${rowText}`.toLowerCase();

  if (/kernel/.test(text)) {
    return "Kernel";
  }

  if (/\b(?:limited(?!-time)|festival|carnival|celebration|vision|crossover|collaboration)\b/i.test(text)) {
    return "Limited";
  }

  if (/special|joint operation|collab/.test(text)) {
    return "Special";
  }

  return "Special";
};

const toAbsoluteWikiUrl = (value: string | null) => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `https://arknights.wiki.gg${value}`;
  return `https://arknights.wiki.gg/${value.replace(/^\.?\//, "")}`;
};

const stripHtml = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/\s+/g, " ")
    .trim();

const toIsoDateFromEnglishDate = (value: string | null | undefined) => {
  if (!value) return null;

  const match = value.match(/\b([A-Z][a-z]+)\s+(\d{1,2}),\s*(\d{4})\b/);
  if (!match) return null;

  const month = MONTHS[match[1]];
  if (!month) return null;

  return `${match[3]}-${month}-${match[2].padStart(2, "0")}`;
};

const normalizeDate = (value: string | null) =>
  value ? value.replace(/\//g, "-") : null;

const extractRowCells = (row: string) => {
  const match = row.match(
    /<tr[^>]*>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>\s*<t[dh][^>]*>([\s\S]*?)<\/t[dh]>\s*<\/tr>/i,
  );

  if (!match) {
    return [row];
  }

  return [match[1] ?? "", match[2] ?? ""];
};

const extractLabeledDateRange = (value: string, label: "CN" | "Global" | "Date") => {
  const labelText = label === "Date" ? "Date" : `${label} date`;
  const searchableValue =
    label === "Date"
      ? value.replace(
          /\b(?:CN|Global) date:\s*\d{4}[/-]\d{2}[/-]\d{2}(?:\s*[\u2013\-]\s*\d{4}[/-]\d{2}[/-]\d{2})?/gi,
          "",
        )
      : value;
  const match = searchableValue.match(
    new RegExp(
      `${labelText}:\\s*(\\d{4}[/-]\\d{2}[/-]\\d{2})(?:\\s*[\\u2013\\-]\\s*(\\d{4}[/-]\\d{2}[/-]\\d{2}))?`,
      "i",
    ),
  );

  return {
    endDate: normalizeDate(match?.[2] ?? null),
    startDate: normalizeDate(match?.[1] ?? null),
  };
};

const extractBannerName = (cellHtml: string) => {
  const boldMatch = cellHtml.match(/<b[^>]*>([\s\S]*?)<\/b>/i);
  if (boldMatch?.[1]) {
    return stripHtml(boldMatch[1]);
  }

  const bannerImageMatch = cellHtml.match(
    /(?:File:|Image:|\/)(?:CN|EN|Global)?\s*([A-Za-z0-9\s'".,&!:+\-()[\]]+?)\s+banner\.png/gi,
  );
  if (bannerImageMatch?.length) {
    const lastMatch = bannerImageMatch[bannerImageMatch.length - 1];
    const nameMatch = lastMatch.match(
      /(?:File:|Image:|\/)(?:CN|EN|Global)?\s*([A-Za-z0-9\s'".,&!:+\-()[\]]+?)\s+banner\.png/i,
    );

    if (nameMatch?.[1]) {
      return stripHtml(nameMatch[1]);
    }
  }

  const titleMatches = [...cellHtml.matchAll(/title="([^"]+)"/gi)]
    .map((match) => stripHtml(match[1] ?? ""))
    .filter(
      (value) =>
        value &&
        !value.startsWith("File:") &&
        !["Rate-Up Operators", "Headhunting"].includes(value),
    );

  if (titleMatches.length > 0) {
    return titleMatches[0];
  }

  const text = stripHtml(cellHtml);
  return text.slice(0, 80);
};

const GENERIC_TITLES = new Set([
  "Rate-Up Operators",
  "Headhunting",
  "File:",
]);

const normalizeBannerComparison = (value: string) =>
  stripHtml(value)
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const UPCOMING_BANNER_DATE_FALLBACKS: Record<string, string> = {
  [normalizeBannerComparison("[Celebration] Sealed With Time")]: "2026-05-01",
};

const GLOBAL_BANNER_DATE_FALLBACKS: Record<string, string> = {
  [normalizeBannerComparison("Quester in Frozen Moments")]: "2026-06-22",
};

const getKnownUpcomingCnDate = (bannerName: string, sourcePage: string) => {
  if (sourcePage !== UPCOMING_PAGE) return null;

  return UPCOMING_BANNER_DATE_FALLBACKS[normalizeBannerComparison(bannerName)] ?? null;
};

const getKnownGlobalDate = (bannerName: string) =>
  GLOBAL_BANNER_DATE_FALLBACKS[normalizeBannerComparison(bannerName)] ?? null;

const getSectionMarkup = (html: string, sectionId: string) => {
  let headingTag = "h2";
  let headingPattern = new RegExp(
    `<h2[^>]*>[\\s\\S]*?<span[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?<\\/h2>`,
    "i",
  );
  let headingMatch = headingPattern.exec(html);

  if (!headingMatch) {
    headingTag = "h3";
    headingPattern = new RegExp(
      `<h3[^>]*>[\\s\\S]*?<span[^>]*id="${sectionId}"[^>]*>[\\s\\S]*?<\\/h3>`,
      "i",
    );
    headingMatch = headingPattern.exec(html);
  }

  if (!headingMatch) return "";

  const startIndex = headingMatch.index + headingMatch[0].length;
  const nextHeadingMatch = new RegExp(
    `<h[23][^>]*>[\\s\\S]*?<\\/h[23]>`,
    "i",
  ).exec(html.slice(startIndex));
  const endIndex = nextHeadingMatch
    ? startIndex + nextHeadingMatch.index
    : html.length;

  return html.slice(startIndex, endIndex);
};

const parseYearPageBannerRows = (html: string, sourcePage: string) =>
  BANNER_CATEGORY_SECTIONS.flatMap(([sectionId, category]) =>
    parseBannerRows(getSectionMarkup(html, sectionId), category, sourcePage),
  );

const isBannerCurrentOnGlobal = (enStartDate: string | null, enEndDate: string | null) => {
  if (!enStartDate) return false;

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const startTs = Date.parse(`${enStartDate}T00:00:00Z`);
  const endTs = Date.parse(`${enEndDate ?? enStartDate}T23:59:59Z`);

  return Number.isFinite(startTs) && Number.isFinite(endTs) && todayUtc >= startTs && todayUtc <= endTs;
};

const isValidOperatorCandidate = (value: string, bannerName: string) => {
  if (!value) return false;
  if (
    value === bannerName ||
    normalizeBannerComparison(value) === normalizeBannerComparison(bannerName)
  ) {
    return false;
  }
  if (value.startsWith("File:")) return false;
  if (GENERIC_TITLES.has(value)) return false;
  if (/^Headhunting\/Banners\//.test(value)) return false;
  if (/^(CN|Global|Date|Rate-Up Operators?)$/i.test(value)) return false;
  if (
    /^(Limited|Standard|Kernel|Special|Joint Operation|Celebration|Vision)$/i.test(
      value,
    )
  ) {
    return false;
  }
  if (value.length <= 1) return false;

  return true;
};

const extractOperatorNames = (cellHtml: string, bannerName: string) => {
  const entries: BannerOperatorEntry[] = [];
  const tooltipBlocks = [
    ...cellHtml.matchAll(
      /<div class="character-tooltip"([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi,
    ),
  ];

  for (const block of tooltipBlocks) {
    const attributes = block[1] ?? "";
    const nameMatch = attributes.match(/data-name="([^"]+)"/i);
    const rarityMatch = attributes.match(/data-star="(\d+)"/i);
    const candidate = stripHtml(nameMatch?.[1] ?? "");

    if (!isValidOperatorCandidate(candidate, bannerName)) continue;
    if (entries.some((entry) => entry.name === candidate)) continue;

    entries.push({
      name: candidate,
      rarity: rarityMatch?.[1],
    });
  }

  if (entries.length > 0) {
    return entries.slice(0, 12);
  }

  const fallbackCandidates = [...cellHtml.matchAll(/title="([^"]+)"|alt="([^"]+)"/gi)]
    .map((match) => stripHtml(match[1] ?? match[2] ?? ""))
    .filter((candidate) => isValidOperatorCandidate(candidate, bannerName));

  for (const candidate of fallbackCandidates) {
    if (entries.some((entry) => entry.name === candidate)) continue;
    entries.push({ name: candidate });
  }

  return entries.slice(0, 12);
};

const extractBannerImageUrl = (cellHtml: string, bannerName: string) => {
  const imageMatches = [
    ...cellHtml.matchAll(
      /<img\b[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/gi,
    ),
  ];

  for (const match of imageMatches) {
    const src = toAbsoluteWikiUrl(match[1] ?? null);
    const alt = stripHtml(match[2] ?? "");
    if (!src) continue;
    if (/icon/i.test(src)) continue;
    if (/\/[0-9]{2,4}px-/i.test(src)) continue;
    if (alt && alt !== bannerName && !alt.includes(bannerName)) {
      continue;
    }

    return src;
  }

  const fileMatch = cellHtml.match(
    /src="([^"]*banner\.png[^"]*)"|href="([^"]*(?:File:|Special:Redirect\/file\/)[^"]+)"/i,
  );
  return toAbsoluteWikiUrl(fileMatch?.[1] ?? fileMatch?.[2] ?? null);
};

const parseBannerRows = (
  html: string,
  fallbackCategory: string,
  sourcePage = "",
) => {
  const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
  const banners: BannerRelease[] = [];

  for (const row of rows) {
    const cells = extractRowCells(row);
    const bannerCell = cells[0] ?? row;
    const operatorCell = cells[1] ?? row;
    const name = extractBannerName(bannerCell);
    if (!name) continue;

    const text = stripHtml(row);
    const fallbackCnStartDate = getKnownUpcomingCnDate(name, sourcePage);
    const cnDateRange = extractLabeledDateRange(text, "CN");
    const globalDateRange = extractLabeledDateRange(text, "Global");
    const dateRange = extractLabeledDateRange(text, "Date");
    const cnStartDate = cnDateRange.startDate ?? fallbackCnStartDate;
    const cnEndDate = cnDateRange.endDate;
    const enStartDate =
      globalDateRange.startDate ?? dateRange.startDate ?? getKnownGlobalDate(name);
    const enEndDate = globalDateRange.endDate ?? dateRange.endDate;

    if (!cnStartDate && !enStartDate) continue;

    const releaseDate = enStartDate ?? cnStartDate;
    if (!releaseDate) continue;

    const releaseTs = Date.parse(`${releaseDate}T00:00:00Z`);
    if (!Number.isFinite(releaseTs)) continue;

    const category =
      /\bkernel\b/i.test(name)
        ? "Kernel"
        : /\bstandard pool\b/i.test(name)
          ? "Standard Pool"
          : fallbackCategory === "Standard Pool"
            ? "Special"
            : BANNER_CATEGORY_SECTIONS.some(([, sectionCategory]) => sectionCategory === fallbackCategory)
              ? fallbackCategory
              : normalizeBannerCategory(fallbackCategory, name, text);
    const operatorEntries = extractOperatorNames(operatorCell, name);

    banners.push({
      bannerImageUrl: extractBannerImageUrl(bannerCell, name),
      category,
      cnEndDate,
      cnStartDate,
      current: isBannerCurrentOnGlobal(enStartDate, enEndDate),
      enEndDate,
      enStartDate,
      globalReleased: Boolean(enStartDate),
      limited: category === "Limited",
      name,
      operators: operatorEntries.map((entry) => entry.name),
      operatorRarities: Object.fromEntries(
        operatorEntries
          .filter((entry) => entry.rarity)
          .map((entry) => [entry.name, entry.rarity as string]),
      ),
      releaseDate,
      releaseTs,
    });
  }

  return banners;
};

const fetchGlobalNewsPage = async (index: number, size: number, attempt = 1): Promise<YostarNewsRow[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(YOSTAR_NEWS_API(index, size), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Yostar news request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      code?: number;
      data?: { rows?: YostarNewsRow[] };
    };

    if (payload.code !== 0 || !Array.isArray(payload.data?.rows)) {
      throw new Error("Yostar news payload is invalid");
    }

    return payload.data.rows;
  } catch (error) {
    if (attempt < 3) {
      console.warn(`Yostar news fetch attempt ${attempt} failed, retrying...`, error);
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      return fetchGlobalNewsPage(index, size, attempt + 1);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchRecentGlobalNews = async () => {
  const rows: YostarNewsRow[] = [];

  for (let page = 1; page <= YOSTAR_NEWS_MAX_PAGES; page += 1) {
    const pageRows = await fetchGlobalNewsPage(page, YOSTAR_NEWS_PAGE_SIZE);
    rows.push(...pageRows);

    if (extractBannerAnnouncementsFromNewsRows(rows).length > 0) {
      break;
    }
  }

  return rows;
};

const normalizeNewsBannerName = (value: string) =>
  stripHtml(value)
    .replace(/^\d+\s+/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const parseRateUpOperators = (sectionText: string) => {
  const operators: string[] = [];
  const operatorRarities: Record<string, string> = {};
  const rateUpStartMatch = /following Operators will appear at a higher rate:\s*/i.exec(sectionText);
  if (!rateUpStartMatch) {
    return { operators, operatorRarities };
  }

  const rateUpStart = rateUpStartMatch.index + rateUpStartMatch[0].length;
  const rateUpText = sectionText
    .slice(rateUpStart)
    .split(/\b(?:NOTE|This is a|If you make|After this event|During this event)\b/i)[0];
  const rateUpMatches = [
    ...rateUpText.matchAll(
      /([★☆]{4,6}|[4-6]-star)\s*:\s*([\s\S]*?)(?=(?:[★☆]{4,6}|[4-6]-star)\s*:|NOTE:|This is a|If you make|$)/gi,
    ),
  ];

  for (const match of rateUpMatches) {
    const rarityText = match[1] ?? "";
    const rarity =
      rarityText.match(/\d/)?.[0] ?? String((rarityText.match(/★|☆/g) ?? []).length);
    const names = stripHtml(match[2] ?? "")
      .split(/\s*\/\s*|\s*,\s*|\s+and\s+/i)
      .map((name) => name.trim())
      .filter((name) => Boolean(name) && name.length <= 40 && !/[.:]/.test(name));

    for (const name of names) {
      if (operators.includes(name)) continue;
      operators.push(name);
      operatorRarities[name] = rarity;
    }
  }

  return { operators, operatorRarities };
};

const extractBannerAnnouncementsFromNewsRows = (rows: YostarNewsRow[]) => {
  const announcements = new Map<string, NewsBannerAnnouncement>();

  for (const row of rows) {
    const text = stripHtml(`${row.title ?? ""} ${row.content ?? ""}`);
    if (!/headhunting/i.test(text)) continue;

    const headingMatches = [
      ...text.matchAll(
        /(?:LIMITED-TIME\s+)?HEADHUNTING(?:\s+OPEN)?\s*[-–—]\s*([^:]+?)\s+DURATION:\s*([A-Z][a-z]+\s+\d{1,2},\s*\d{4})(?:,[\s\S]*?[-–—]\s*([A-Z][a-z]+\s+\d{1,2},\s*\d{4}))?/gi,
      ),
    ];

    for (const match of headingMatches) {
      const name = normalizeNewsBannerName(match[1] ?? "");
      const enStartDate = toIsoDateFromEnglishDate(match[2]);
      const enEndDate = toIsoDateFromEnglishDate(match[3]);
      if (!name || !enStartDate) continue;

      const sectionStart = match.index ?? 0;
      const sectionText = text.slice(sectionStart, sectionStart + 2500);
      const { operators, operatorRarities } = parseRateUpOperators(sectionText);
      const category = "Special";

      announcements.set(normalizeBannerComparison(name), {
        category,
        enEndDate,
        enStartDate,
        name,
        operators,
        operatorRarities,
      });
    }

    const bracketMatches = [
      ...text.matchAll(
        /DURATION:\s*([A-Z][a-z]+\s+\d{1,2},\s*\d{4})(?:,[\s\S]*?[-–—]\s*([A-Z][a-z]+\s+\d{1,2},\s*\d{4}))?[\s\S]{0,500}?Headhunting,\s*\[([^\]]+)\],\s*opens/gi,
      ),
    ];

    for (const match of bracketMatches) {
      const name = stripHtml(match[3] ?? "");
      const enStartDate = toIsoDateFromEnglishDate(match[1]);
      const enEndDate = toIsoDateFromEnglishDate(match[2]);
      if (!name || !enStartDate) continue;

      const sectionStart = match.index ?? 0;
      const sectionText = text.slice(sectionStart, sectionStart + 2500);
      const { operators, operatorRarities } = parseRateUpOperators(sectionText);
      const existing = announcements.get(normalizeBannerComparison(name));

      announcements.set(normalizeBannerComparison(name), {
        category: existing?.category ?? "Special",
        enEndDate: enEndDate ?? existing?.enEndDate ?? null,
        enStartDate,
        name,
        operators: operators.length > 0 ? operators : existing?.operators ?? [],
        operatorRarities:
          Object.keys(operatorRarities).length > 0
            ? operatorRarities
            : existing?.operatorRarities ?? {},
      });
    }
  }

  return [...announcements.values()];
};

const reconcileBannersWithNews = (
  banners: BannerRelease[],
  announcements: NewsBannerAnnouncement[],
) => {
  if (announcements.length === 0) return banners;

  const merged = new Map<string, BannerRelease>(
    banners.map((banner) => [normalizeBannerComparison(banner.name), banner]),
  );

  for (const announcement of announcements) {
    const key = normalizeBannerComparison(announcement.name);
    const existing = merged.get(key);
    const releaseTs = Date.parse(`${announcement.enStartDate}T00:00:00Z`);

    if (existing) {
      const category = existing.category || announcement.category;
      merged.set(key, {
        ...existing,
        category,
        current: isBannerCurrentOnGlobal(
          announcement.enStartDate,
          announcement.enEndDate ?? existing.enEndDate,
        ),
        enEndDate: announcement.enEndDate ?? existing.enEndDate,
        enStartDate: announcement.enStartDate,
        globalReleased: true,
        limited:
          existing.limited ||
          category === "Limited" ||
          /limited/i.test(announcement.category),
        operators:
          existing.operators.length > 0 ? existing.operators : announcement.operators,
        operatorRarities: {
          ...announcement.operatorRarities,
          ...existing.operatorRarities,
        },
        releaseDate: announcement.enStartDate,
        releaseTs: Number.isFinite(releaseTs) ? releaseTs : existing.releaseTs,
      });
      continue;
    }

    merged.set(key, {
      bannerImageUrl: null,
      category: announcement.category,
      cnEndDate: null,
      cnStartDate: null,
      current: isBannerCurrentOnGlobal(announcement.enStartDate, announcement.enEndDate),
      enEndDate: announcement.enEndDate,
      enStartDate: announcement.enStartDate,
      globalReleased: true,
      limited: announcement.category === "Limited",
      name: announcement.name,
      operators: announcement.operators,
      operatorRarities: announcement.operatorRarities,
      releaseDate: announcement.enStartDate,
      releaseTs: Number.isFinite(releaseTs) ? releaseTs : Date.now(),
    });
  }

  return [...merged.values()].sort((a, b) => b.releaseTs - a.releaseTs);
};

const fetchParsedMarkup = async (page: string) => {
  const response = await fetch(WIKI_PARSE_API(page), {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Wiki banner request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    parse?: { text?: string };
  };

  if (!payload.parse?.text) {
    throw new Error(`Wiki banner page ${page} returned empty markup`);
  }

  return payload.parse.text;
};

const fetchParsedMarkupSafe = async (page: string) => {
  try {
    const markup = await fetchParsedMarkup(page);
    return { markup, page };
  } catch (error) {
    console.warn(`Skipping banner page ${page}`, error);
    return null;
  }
};

const getBannerVisibleYear = (banner: BannerRelease) => {
  const displayDate = banner.enStartDate ?? banner.cnStartDate ?? banner.releaseDate;
  const year = Number.parseInt(displayDate.slice(0, 4), 10);

  return Number.isFinite(year) ? year : null;
};

const isBannerInVisibleYearRange = (banner: BannerRelease) => {
  const year = getBannerVisibleYear(banner);

  return year !== null && VISIBLE_BANNER_YEARS.has(year);
};

const getBannerKey = (banner: BannerRelease) =>
  [
    banner.name,
    banner.cnStartDate ?? "no-cn-date",
    banner.enStartDate ?? "no-en-date",
  ].join("::");

const mergeBanners = (released: BannerRelease[], upcoming: BannerRelease[]) => {
  const merged = new Map<string, BannerRelease>();

  for (const banner of [...released, ...upcoming]) {
    const bannerKey = getBannerKey(banner);
    const existing = merged.get(bannerKey);
    if (!existing) {
      merged.set(bannerKey, banner);
      continue;
    }

    const cnStartDate = existing.cnStartDate ?? banner.cnStartDate;
    const cnEndDate = existing.cnEndDate ?? banner.cnEndDate;
    const enStartDate = existing.enStartDate ?? banner.enStartDate;
    const enEndDate = existing.enEndDate ?? banner.enEndDate;
    const releaseDate = enStartDate ?? cnStartDate ?? existing.releaseDate;
    const releaseTs = Date.parse(`${releaseDate}T00:00:00Z`);
    const category = existing.category || banner.category;

    merged.set(bannerKey, {
      ...existing,
      bannerImageUrl: existing.bannerImageUrl ?? banner.bannerImageUrl,
      category,
      cnEndDate,
      cnStartDate,
      current:
        existing.current ||
        banner.current ||
        isBannerCurrentOnGlobal(enStartDate, enEndDate),
      enEndDate,
      enStartDate,
      globalReleased: Boolean(enStartDate),
      limited: category === "Limited" || existing.limited || banner.limited,
      operators:
        existing.operators.length >= banner.operators.length
          ? existing.operators
          : banner.operators,
      operatorRarities: {
        ...existing.operatorRarities,
        ...banner.operatorRarities,
      },
      releaseDate,
      releaseTs: Number.isFinite(releaseTs) ? releaseTs : existing.releaseTs,
    });
  }

  return [...merged.values()].sort((a, b) => b.releaseTs - a.releaseTs);
};

export async function GET() {
  try {
    const [upcomingMarkup, ...yearMarkupResults] = await Promise.all([
      fetchParsedMarkupSafe(UPCOMING_PAGE),
      ...BANNER_YEAR_PAGES.map((page) => fetchParsedMarkupSafe(page)),
    ]);
    const yearMarkupEntries = yearMarkupResults.filter(
      (entry): entry is { markup: string; page: string } => entry !== null,
    );

    const released = yearMarkupEntries.flatMap(({ markup, page }) =>
      parseYearPageBannerRows(markup, page),
    );
    const upcoming = upcomingMarkup
      ? parseBannerRows(upcomingMarkup.markup, "Upcoming", upcomingMarkup.page)
      : [];
    let data = mergeBanners(released, upcoming);

    const predictionSamples = data.filter(
      (b) => b.cnStartDate !== null && b.enStartDate !== null,
    );
    data = data.filter(isBannerInVisibleYearRange);

    return NextResponse.json({
      count: data.length,
      data,
      predictionSamples,
      source: [
        ...yearMarkupEntries.map(
          ({ page }) => `https://arknights.wiki.gg/wiki/${page}`,
        ),
        `https://arknights.wiki.gg/wiki/${UPCOMING_PAGE}`,
      ],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch banner list";

    return NextResponse.json(
      { count: 0, data: [], message },
      { status: 500 },
    );
  }
}
