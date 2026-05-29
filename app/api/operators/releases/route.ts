import { NextResponse } from "next/server";

const WIKI_PARSE_API =
  "https://arknights.wiki.gg/api.php?action=parse&page=Operator/List&prop=text&formatversion=2&format=json";
const WIKI_SOURCE_PAGE = "https://arknights.wiki.gg/wiki/Operator/List";
const YOSTAR_NEWS_PAGE_SIZE = 50;
const YOSTAR_NEWS_API = (index: number, size: number) =>
  `https://account.yo-star.com/api/game/news?key=ark&index=${index}&size=${size}`;

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

type YostarNewsRow = {
  content?: string;
  id?: number | string;
  link?: string;
  publishTime?: number | string;
  title?: string;
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
  value.replace(
    /&(amp|lt|gt|quot|#39|nbsp);/g,
    (entity) => htmlEntityMap[entity] ?? entity,
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

const extractAllDates = (value: string) =>
  value.match(/\b\d{4}-\d{2}-\d{2}\b/g) ?? [];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toIsoDate = (value: number | string | undefined) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString().slice(0, 10);
  }

  if (typeof value === "string" && value.trim()) {
    const timestamp = Date.parse(value);
    if (Number.isFinite(timestamp)) {
      return new Date(timestamp).toISOString().slice(0, 10);
    }
  }

  return null;
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
    throw new Error(`${fallbackLabel} section not found`);
  }

  const tableStart = html.indexOf("<table", sectionStart);
  if (tableStart < 0) {
    throw new Error(`${fallbackLabel} table not found`);
  }

  const tableEnd = html.indexOf("</table>", tableStart);
  if (tableEnd < 0) {
    throw new Error(`${fallbackLabel} table end not found`);
  }

  return html.slice(tableStart, tableEnd + "</table>".length);
};

const parseRows = (tableHtml: string) =>
  tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

const parseEnOperatorRows = (html: string): OperatorRelease[] => {
  const tableHtml = extractOperatorsTable(html, "EN_Operators", "EN Operators");
  const rows = parseRows(tableHtml);
  const parsedRows: OperatorRelease[] = [];

  for (const row of rows) {
    const cells = [...row.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map(
      (match) => match[1] ?? "",
    );

    if (cells.length < 9) continue;

    const name = stripHtml(cells[1]);
    const rarity = stripHtml(cells[2]);
    const event = stripHtml(cells[6]);
    const rowText = stripHtml(row);
    const rowDates = extractAllDates(rowText);
    const enReleaseDate =
      extractDate(stripHtml(cells[7])) ??
      (rowDates.length > 0 ? rowDates[rowDates.length - 1] : null);
    const limitedText = stripHtml(cells[8]).toLowerCase();

    if (!name) continue;

    const releaseTs = enReleaseDate
      ? Date.parse(`${enReleaseDate}T00:00:00Z`)
      : 0;

    parsedRows.push({
      cnReleaseDate: null,
      enReleaseDate,
      event,
      globalReleased: true,
      limited: limitedText.includes("limited"),
      name,
      rarity,
      releaseDate: enReleaseDate ?? "1970-01-01",
      releaseTs,
    });
  }

  return parsedRows;
};

const parseCnOperatorRows = (html: string): OperatorRelease[] => {
  const tableHtml = extractOperatorsTable(html, "CN_Operators", "CN Operators");
  const rows = parseRows(tableHtml);
  const parsedRows: OperatorRelease[] = [];

  for (const row of rows) {
    const cells = [...row.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map(
      (match) => match[1] ?? "",
    );

    if (cells.length < 8) continue;

    const name = stripHtml(cells[1]);
    const rarity = stripHtml(cells[2]);
    const event = stripHtml(cells[5]);
    const cnReleaseDate = extractDate(stripHtml(cells[6]));
    const limitedText = stripHtml(cells[7]).toLowerCase();

    if (!name || !cnReleaseDate) continue;

    const releaseTs = Date.parse(`${cnReleaseDate}T00:00:00Z`);
    if (!Number.isFinite(releaseTs)) continue;

    parsedRows.push({
      cnReleaseDate,
      enReleaseDate: null,
      event,
      globalReleased: false,
      limited: limitedText.includes("limited"),
      name,
      rarity,
      releaseDate: cnReleaseDate,
      releaseTs,
    });
  }

  return parsedRows;
};

const mergeOperators = (globalRows: OperatorRelease[], cnRows: OperatorRelease[]) => {
  const merged = new Map<string, OperatorRelease>();

  for (const operator of globalRows) {
    merged.set(operator.name, operator);
  }

  for (const operator of cnRows) {
    const existing = merged.get(operator.name);
    if (!existing) {
      merged.set(operator.name, operator);
      continue;
    }

    const cnReleaseDate = operator.cnReleaseDate ?? existing.cnReleaseDate;
    const enReleaseDate = existing.enReleaseDate ?? operator.enReleaseDate;
    const releaseDate = cnReleaseDate ?? enReleaseDate ?? existing.releaseDate;
    const nextReleaseTs = Date.parse(`${releaseDate}T00:00:00Z`);

    merged.set(operator.name, {
      ...existing,
      cnReleaseDate,
      enReleaseDate,
      event: operator.event || existing.event,
      globalReleased: Boolean(enReleaseDate),
      limited: operator.limited || existing.limited,
      rarity: operator.rarity || existing.rarity,
      releaseDate,
      releaseTs: Number.isFinite(nextReleaseTs)
        ? nextReleaseTs
        : existing.releaseTs,
    });
  }

  return [...merged.values()].sort((a, b) => b.releaseTs - a.releaseTs);
};

const fetchOperatorMarkup = async () => {
  const headers = {
    Accept: "application/json, text/html;q=0.9, */*;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
  };

  const response = await fetch(WIKI_PARSE_API, {
    headers,
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Wiki request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    parse?: { text?: string };
  };
  const markup = payload.parse?.text;

  if (!markup) {
    throw new Error("Wiki parse response is empty");
  }

  return markup;
};

const fetchGlobalNewsPage = async (index: number, size: number) => {
  const response = await fetch(YOSTAR_NEWS_API(index, size), {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    next: { revalidate: 60 * 30 },
  });

  if (!response.ok) {
    throw new Error(`Yostar news request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    code?: number;
    data?: { count?: number; rows?: YostarNewsRow[] };
  };

  if (payload.code !== 0 || !Array.isArray(payload.data?.rows)) {
    throw new Error("Yostar news payload is invalid");
  }

  return {
    count: payload.data.count ?? payload.data.rows.length,
    rows: payload.data.rows,
  };
};

const fetchAllGlobalNews = async () => {
  const firstPage = await fetchGlobalNewsPage(1, YOSTAR_NEWS_PAGE_SIZE);
  const totalPages = Math.max(
    1,
    Math.ceil(firstPage.count / YOSTAR_NEWS_PAGE_SIZE),
  );

  if (totalPages === 1) {
    return firstPage.rows;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, pageIndex) =>
      fetchGlobalNewsPage(pageIndex + 2, YOSTAR_NEWS_PAGE_SIZE),
    ),
  );

  return [firstPage.rows, ...remainingPages.map((page) => page.rows)].flat();
};

const reconcileWithNewsArchive = (
  operators: OperatorRelease[],
  newsRows: YostarNewsRow[],
) => {
  const archiveRows = newsRows.map((row) => {
    const title = stripHtml(row.title ?? "");
    const content = stripHtml(row.content ?? "");
    return {
      publishTs:
        typeof row.publishTime === "number"
          ? row.publishTime
          : Date.parse(String(row.publishTime ?? "")),
      text: `${title} ${content}`.toLowerCase(),
      publishDate: toIsoDate(row.publishTime),
      title: title.toLowerCase(),
    };
  });

  return operators
    .map((operator) => {
      if (operator.enReleaseDate) return operator;

      const normalizedName = operator.name.toLowerCase();
      const escapedName = escapeRegExp(normalizedName);
      const namePattern = new RegExp(`(^|[^a-z0-9])${escapedName}([^a-z0-9]|$)`);
      const starLinePattern = new RegExp(`([★☆]{4,6}|[46]-star|[45]-star)[^\\n]{0,80}${escapedName}`);

      const matchedNews = archiveRows
        .map((news) => {
          if (!news.publishDate || !namePattern.test(news.text)) {
            return null;
          }

          let score = 0;
          if (news.title.includes(normalizedName)) score += 6;
          if (
            news.text.includes("new operators now available") ||
            news.text.includes("operators will be added to the game")
          ) {
            score += 5;
          }
          if (starLinePattern.test(news.text)) score += 4;
          if (
            news.text.includes("higher rate") ||
            news.text.includes("headhunting")
          ) {
            score += 3;
          }
          if (
            news.title.includes("sidestory") ||
            news.title.includes("story collection") ||
            news.title.includes("open")
          ) {
            score += 2;
          }

          if (score <= 0 || !Number.isFinite(news.publishTs)) {
            return null;
          }

          return {
            publishDate: news.publishDate,
            publishTs: news.publishTs,
            score,
          };
        })
        .filter(
          (
            news,
          ): news is { publishDate: string; publishTs: number; score: number } =>
            news !== null,
        )
        .sort((left, right) => {
          if (left.publishTs !== right.publishTs) {
            return left.publishTs - right.publishTs;
          }

          return right.score - left.score;
        })[0];

      if (!matchedNews?.publishDate) {
        return operator;
      }

      const releaseTs = Date.parse(`${matchedNews.publishDate}T00:00:00Z`);
      if (!Number.isFinite(releaseTs)) {
        return operator;
      }

      return {
        ...operator,
        enReleaseDate: matchedNews.publishDate,
        globalReleased: true,
        releaseDate: matchedNews.publishDate,
        releaseTs,
      };
    })
    .sort((a, b) => b.releaseTs - a.releaseTs);
};

export async function GET() {
  try {
    const markup = await fetchOperatorMarkup();
    const globalOperators = parseEnOperatorRows(markup);
    const cnOperators = parseCnOperatorRows(markup);
    const mergedOperators = mergeOperators(globalOperators, cnOperators);
    let operators = mergedOperators;

    try {
      const newsArchive = await fetchAllGlobalNews();
      operators = reconcileWithNewsArchive(mergedOperators, newsArchive);
    } catch (error) {
      console.error("Failed to reconcile operators with Yostar news archive", error);
    }

    return NextResponse.json(
      {
        count: operators.length,
        data: operators,
        source: WIKI_SOURCE_PAGE,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=43200, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch operator list";

    return NextResponse.json(
      { message, data: [], count: 0 },
      { status: 500 },
    );
  }
}
