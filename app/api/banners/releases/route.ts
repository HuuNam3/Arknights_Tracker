import { NextResponse } from "next/server";

const CURRENT_YEAR = new Date().getUTCFullYear();
const MAIN_PAGE = "Headhunting/Banners";
const YEAR_PAGE = `Headhunting/Banners/${CURRENT_YEAR}`;
const PREVIOUS_YEAR_PAGE = `Headhunting/Banners/${CURRENT_YEAR - 1}`;
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
  releaseDate: string;
  releaseTs: number;
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

const extractLabeledDate = (value: string, label: "CN" | "Global" | "Date") => {
  const match = value.match(
    new RegExp(`${label} date:\\s*(\\d{4}[/-]\\d{2}[/-]\\d{2})`, "i"),
  );
  return normalizeDate(match?.[1] ?? null);
};

const extractBannerName = (row: string) => {
  const titleMatches = [...row.matchAll(/title="([^"]+)"/gi)]
    .map((match) => stripHtml(match[1] ?? ""))
    .filter(
      (value) =>
        value &&
        !value.startsWith("File:") &&
        !/^[456]★$/.test(value) &&
        !["Rate-Up Operators", "Headhunting"].includes(value),
    );

  if (titleMatches.length > 0) {
    return titleMatches[0];
  }

  const boldMatch = row.match(/<b[^>]*>([\s\S]*?)<\/b>/i);
  if (boldMatch?.[1]) {
    return stripHtml(boldMatch[1]);
  }

  const text = stripHtml(row);
  return text.slice(0, 80);
};

const GENERIC_TITLES = new Set([
  "Rate-Up Operators",
  "Headhunting",
  "File:",
]);

const isValidOperatorCandidate = (value: string, bannerName: string) => {
  if (!value) return false;
  if (value === bannerName) return false;
  if (value.startsWith("File:")) return false;
  if (GENERIC_TITLES.has(value)) return false;
  if (/^[3456]★$/.test(value)) return false;
  if (/^Headhunting\/Banners\//.test(value)) return false;
  if (/^(CN|Global|Date|Rate-Up Operators?)$/i.test(value)) return false;
  if (/^(Limited|Standard|Kernel|Special|Joint Operation|Celebration)$/i.test(value)) {
    return false;
  }
  if (value.length <= 1) return false;

  return true;
};

const extractOperatorNames = (row: string) => {
  const bannerName = extractBannerName(row);
  const titleCandidates = [...row.matchAll(/title="([^"]+)"/gi)].map((match) =>
    stripHtml(match[1] ?? ""),
  );
  const anchorCandidates = [...row.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map(
    (match) => stripHtml(match[1] ?? ""),
  );
  const altCandidates = [...row.matchAll(/alt="([^"]+)"/gi)].map((match) =>
    stripHtml(match[1] ?? ""),
  );

  const unique: string[] = [];
  for (const candidate of [
    ...titleCandidates,
    ...anchorCandidates,
    ...altCandidates,
  ]) {
    if (!isValidOperatorCandidate(candidate, bannerName)) continue;
    if (!unique.includes(candidate)) {
      unique.push(candidate);
    }
  }

  return unique.slice(0, 12);
};

const extractBannerImageUrl = (row: string, bannerName: string) => {
  const imageMatches = [...row.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/gi)];

  for (const match of imageMatches) {
    const src = toAbsoluteWikiUrl(match[1] ?? null);
    const alt = stripHtml(match[2] ?? "");
    if (!src) continue;
    if (/icon/i.test(src)) continue;
    if (/\/[0-9]{2,3}px-/i.test(src)) continue;
    if (alt && alt !== bannerName && !alt.includes(bannerName)) {
      continue;
    }

    return src;
  }

  const fileMatch = row.match(/href="([^"]*(?:File:|Special:Redirect\/file\/)[^"]+)"/i);
  return toAbsoluteWikiUrl(fileMatch?.[1] ?? null);
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

    const name = extractBannerName(row);
    if (!name) continue;

    const releaseDate = cnStartDate ?? enStartDate;
    if (!releaseDate) continue;

    const releaseTs = Date.parse(`${releaseDate}T00:00:00Z`);
    if (!Number.isFinite(releaseTs)) continue;

    const categoryMatch = text.match(
      /\b(Limited|Special|Standard|Kernel|Joint Operation|Celebration|Vision)\b/i,
    );
    const category = categoryMatch?.[1] ?? fallbackCategory;

    banners.push({
      bannerImageUrl: extractBannerImageUrl(row, name),
      category,
      cnStartDate,
      enStartDate,
      globalReleased: Boolean(enStartDate),
      limited:
        /limited/i.test(text) ||
        /celebration|festival|carnival/i.test(category.toLowerCase()),
      name,
      operators: extractOperatorNames(row),
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
      releaseDate,
      releaseTs: Number.isFinite(releaseTs) ? releaseTs : existing.releaseTs,
    });
  }

  return [...merged.values()].sort((a, b) => b.releaseTs - a.releaseTs);
};

export async function GET() {
  try {
    const [mainMarkup, previousYearMarkup, yearMarkup, upcomingMarkup] = await Promise.all([
      fetchParsedMarkup(MAIN_PAGE),
      fetchParsedMarkup(PREVIOUS_YEAR_PAGE),
      fetchParsedMarkup(YEAR_PAGE),
      fetchParsedMarkup(UPCOMING_PAGE),
    ]);

    const currentBanners = parseBannerRows(mainMarkup, "Current");
    const previousYearReleased = parseBannerRows(previousYearMarkup, "Banner");
    const released = parseBannerRows(yearMarkup, "Banner");
    const upcoming = parseBannerRows(upcomingMarkup, "Upcoming");
    const data = mergeBanners(
      [...currentBanners, ...previousYearReleased, ...released],
      upcoming,
    );

    return NextResponse.json({
      count: data.length,
      data,
      source: [
        `https://arknights.wiki.gg/wiki/${MAIN_PAGE}`,
        `https://arknights.wiki.gg/wiki/${PREVIOUS_YEAR_PAGE}`,
        `https://arknights.wiki.gg/wiki/${YEAR_PAGE}`,
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
