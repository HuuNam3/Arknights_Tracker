import { NextResponse } from "next/server";

const CURRENT_YEAR = new Date().getUTCFullYear();
const FIRST_BANNER_YEAR = 2020;
const MAIN_PAGE = "Headhunting/Banners";
const UPCOMING_PAGE = "Headhunting/Banners/Upcoming";
const WIKI_PARSE_API = (page: string) =>
  `https://arknights.wiki.gg/api.php?action=parse&page=${encodeURIComponent(
    page,
  )}&prop=text&formatversion=2&format=json`;

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

type BannerOperatorEntry = {
  name: string;
  rarity?: string;
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
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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

const extractLabeledDate = (value: string, label: "CN" | "Global" | "Date") => {
  const match = value.match(
    new RegExp(`${label} date:\\s*(\\d{4}[/-]\\d{2}[/-]\\d{2})`, "i"),
  );
  return normalizeDate(match?.[1] ?? null);
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

const parseBannerRows = (html: string, fallbackCategory: string) => {
  const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
  const banners: BannerRelease[] = [];

  for (const row of rows) {
    const text = stripHtml(row);
    const cnStartDate = extractLabeledDate(text, "CN");
    const enStartDate =
      extractLabeledDate(text, "Global") ?? extractLabeledDate(text, "Date");

    if (!cnStartDate && !enStartDate) continue;

    const cells = extractRowCells(row);
    const bannerCell = cells[0] ?? row;
    const operatorCell = cells[1] ?? row;
    const name = extractBannerName(bannerCell);
    if (!name) continue;

    const releaseDate = cnStartDate ?? enStartDate;
    if (!releaseDate) continue;

    const releaseTs = Date.parse(`${releaseDate}T00:00:00Z`);
    if (!Number.isFinite(releaseTs)) continue;

    const categoryMatch =
      name.match(/\[(Limited|Festival|Carnival|Celebration|Vision)\]/i) ??
      text.match(
        /\b(Limited|Special|Standard|Kernel|Joint Operation|Celebration|Vision|Festival|Carnival)\b/i,
      );
    const category = categoryMatch?.[1] ?? fallbackCategory;
    const operatorEntries = extractOperatorNames(operatorCell, name);

    banners.push({
      bannerImageUrl: extractBannerImageUrl(bannerCell, name),
      category,
      cnStartDate,
      enStartDate,
      globalReleased: Boolean(enStartDate),
      limited:
        /\[(Festival|Carnival|Celebration|Vision|Limited)\]/i.test(name) ||
        /limited/i.test(text) ||
        /celebration|festival|carnival|vision/i.test(category.toLowerCase()),
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

const getYearPageCandidates = () => {
  const candidates: string[] = [];

  for (let year = CURRENT_YEAR; year >= FIRST_BANNER_YEAR; year -= 1) {
    candidates.push(`Headhunting/Banners/${year}`);

    if (year !== CURRENT_YEAR) {
      candidates.push(`Headhunting/Banners/Former-${year}`);
    }
  }

  return [...new Set(candidates)];
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
    const enStartDate = existing.enStartDate ?? banner.enStartDate;
    const releaseDate = cnStartDate ?? enStartDate ?? existing.releaseDate;
    const releaseTs = Date.parse(`${releaseDate}T00:00:00Z`);

    merged.set(bannerKey, {
      ...existing,
      bannerImageUrl: existing.bannerImageUrl ?? banner.bannerImageUrl,
      category: existing.category || banner.category,
      cnStartDate,
      enStartDate,
      globalReleased: Boolean(enStartDate),
      limited: existing.limited || banner.limited,
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
    const [mainMarkup, upcomingMarkup, ...yearMarkupResults] = await Promise.all([
      fetchParsedMarkup(MAIN_PAGE),
      fetchParsedMarkupSafe(UPCOMING_PAGE),
      ...getYearPageCandidates().map((page) => fetchParsedMarkupSafe(page)),
    ]);
    const yearMarkupEntries = yearMarkupResults.filter(
      (entry): entry is { markup: string; page: string } => entry !== null,
    );

    const currentBanners = parseBannerRows(mainMarkup, "Current");
    const released = yearMarkupEntries.flatMap(({ markup, page }) =>
      parseBannerRows(markup, page.includes("Former-") ? "Former" : "Banner"),
    );
    const upcoming = upcomingMarkup
      ? parseBannerRows(upcomingMarkup.markup, "Upcoming")
      : [];
    const data = mergeBanners([...currentBanners, ...released], upcoming);

    return NextResponse.json({
      count: data.length,
      data,
      source: [
        `https://arknights.wiki.gg/wiki/${MAIN_PAGE}`,
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
