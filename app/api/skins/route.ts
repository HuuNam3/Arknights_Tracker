import { NextResponse } from "next/server";

const WIKI_PARSE_API = (page: string) =>
  `https://arknights.wiki.gg/api.php?action=parse&page=${encodeURIComponent(
    page,
  )}&prop=text&formatversion=2&format=json`;

type SkinEntry = {
  brand: string;
  id: string;
  imageUrl: string | null;
  obtainMethod: string;
  operator: string;
  price: number;
  release: string;
  skinName: string;
  sourcePage: string;
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
    .replace(/&ndash;|&mdash;/g, "-");

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

const fetchWikiMarkup = async (page: string) => {
  const response = await fetch(WIKI_PARSE_API(page), {
    headers: {
      Accept: "application/json, text/html;q=0.9, */*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    throw new Error(`Wiki outfit request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as { parse?: { text?: string } };
  if (!payload.parse?.text) {
    throw new Error(`Wiki outfit page ${page} returned empty markup`);
  }

  return payload.parse.text;
};

const extractBrandPages = (html: string) => {
  const pages = new Map<string, string>();
  const matches = [
    ...html.matchAll(/href="\/wiki\/(Outfit\/[^"#?]+)"\s+title="Outfit\/([^"]+)"/gi),
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

const extractLabeledValue = (html: string, label: string) => {
  const pattern = new RegExp(
    `<div><b>${label}(?:&#58;|:)</b>[\\s\\S]*?<\\/div>`,
    "i",
  );
  const match = html.match(pattern);
  return match ? stripHtml(match[0]).replace(new RegExp(`^${label}:?\\s*`, "i"), "") : "";
};

const parseSkinRows = (html: string, brand: string, sourcePage: string) => {
  const skins: SkinEntry[] = [];
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
        detailRow.match(/class="character-tooltip"[^>]*data-name="([^"]+)"/i)?.[1] ??
          detailRow.match(/<b>Model:<\/b>[\s\S]*?title="([^"]+)"/i)?.[1] ??
          "",
      ) || "Unknown";
    const imageUrl = toAbsoluteWikiUrl(
      detailRow.match(/<img[^>]+class="character-image"[^>]+src="([^"]+)"/i)?.[1] ??
        detailRow.match(/<img[^>]+src="([^"]+Skin[^"]+)"/i)?.[1] ??
        null,
    );
    const release = extractLabeledValue(detailRow, "Release");
    const obtainMethod = extractLabeledValue(detailRow, "How to obtain");
    const priceMatch =
      obtainMethod.match(/\b(\d+)\s+Originite Prime\b|\bOriginite Prime\s+(\d+)\b/i) ??
      (/Outfit Store/i.test(obtainMethod)
        ? obtainMethod.match(/\(\s*(\d+)\s*\)/)
        : null);
    const price = priceMatch
      ? Number.parseInt(priceMatch[1] ?? priceMatch[2] ?? "0", 10)
      : 0;
    const id = `${normalizeId(operator)}-${normalizeId(skinName)}`;

    skins.push({
      brand,
      id,
      imageUrl,
      obtainMethod,
      operator,
      price: Number.isFinite(price) ? price : 0,
      release,
      skinName,
      sourcePage,
    });
  }

  return skins;
};

const fetchBrandSkins = async (brand: { name: string; page: string }) => {
  try {
    const html = await fetchWikiMarkup(brand.page);
    return parseSkinRows(html, brand.name, brand.page);
  } catch (error) {
    console.error(`Failed to fetch outfit brand ${brand.page}`, error);
    return [] as SkinEntry[];
  }
};

const mapInBatches = async <TInput, TOutput>(
  values: TInput[],
  batchSize: number,
  mapper: (value: TInput) => Promise<TOutput>,
) => {
  const results: TOutput[] = [];

  for (let index = 0; index < values.length; index += batchSize) {
    const batch = values.slice(index, index + batchSize);
    results.push(...(await Promise.all(batch.map(mapper))));
  }

  return results;
};

export async function GET() {
  try {
    const outfitHtml = await fetchWikiMarkup("Outfit");
    const brandPages = extractBrandPages(outfitHtml);
    const skinGroups = await mapInBatches(brandPages, 4, fetchBrandSkins);
    const skinMap = new Map<string, SkinEntry>();

    for (const skin of skinGroups.flat()) {
      if (!skinMap.has(skin.id)) {
        skinMap.set(skin.id, skin);
      }
    }

    const skins = [...skinMap.values()].sort((left, right) => {
      if (right.price !== left.price) return right.price - left.price;
      return left.operator.localeCompare(right.operator);
    });

    return NextResponse.json({
      brands: brandPages,
      count: skins.length,
      data: skins,
      source: "https://arknights.wiki.gg/wiki/Outfit",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch outfit data";

    return NextResponse.json({ count: 0, data: [], message }, { status: 500 });
  }
}
