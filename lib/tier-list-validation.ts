export const TIER_LIST_NAME_MAX_LENGTH = 30;
export const TIER_NAME_MAX_LENGTH = 15;

// Based on blue-eyes-vn/vietnamese-offensive-words. Keep this curated in-app copy
// small enough to audit, while covering accented, unaccented, and teencode forms.
const VIETNAMESE_OFFENSIVE_WORDS = [
  "buoi",
  "cai dau buoi",
  "cac",
  "cak",
  "kac",
  "cuc cut",
  "cut",
  "deo",
  "dech",
  "dek",
  "del",
  "dell",
  "dit",
  "dis",
  "diz",
  "djt",
  "dm",
  "dmm",
  "dcm",
  "dcmm",
  "du",
  "du ma",
  "du me",
  "du cha",
  "du ba",
  "dou ma",
  "doma",
  "duoma",
  "di",
  "diem",
  "condi",
  "dime",
  "pho",
  "lon",
  "loz",
  "lol",
  "lin",
  "ml",
  "mat lon",
  "mat lol",
  "cai lon",
  "xam lol",
  "xao lol",
  "xam lon",
  "xao lon",
  "clgt",
  "sml",
  "vl",
  "vcl",
  "vailon",
  "vai lon",
  "vai lol",
  "chich",
  "xoac",
  "fuck",
  "fck",
  "ngu",
  "oc cho",
  "lao cho",
  "bo lao",
  "cho ma",
  "thang cho",
  "cho dien",
  "thang dien",
  "do dien",
  "sua bay",
  "me cha",
  "ma cha",
  "ke me",
  "bo me",
  "chet me",
  "thay me",
  "to cha",
] as const;

const normalizeVietnameseText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9`~\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const findOffensiveWord = (value: string) => {
  const normalizedValue = ` ${normalizeVietnameseText(value)} `;

  return VIETNAMESE_OFFENSIVE_WORDS.find((word) => {
    const normalizedWord = normalizeVietnameseText(word);

    return normalizedWord ? normalizedValue.includes(` ${normalizedWord} `) : false;
  });
};

export const findTierListNameIssue = (name: string) => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "Vui lòng nhập tên tier list trước khi lưu.";
  }

  if (trimmedName.length > TIER_LIST_NAME_MAX_LENGTH) {
    return `Tên tier list tối đa ${TIER_LIST_NAME_MAX_LENGTH} ký tự.`;
  }

  if (findOffensiveWord(trimmedName)) {
    return "Tên tier list có từ/cụm từ có thể phản cảm. Vui lòng đổi tên trước khi lưu.";
  }

  return "";
};

export const findTierNameIssue = (name: string) => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "Vui lòng nhập tên tier trước khi thêm.";
  }

  if (trimmedName.length > TIER_NAME_MAX_LENGTH) {
    return `Tên tier tối đa ${TIER_NAME_MAX_LENGTH} ký tự.`;
  }

  if (findOffensiveWord(trimmedName)) {
    return "Tên tier có từ/cụm từ có thể phản cảm. Vui lòng đổi tên trước khi thêm.";
  }

  return "";
};
