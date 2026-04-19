import rawActresses from "@/data/actresses_light.json";

export type RawActress = {
  fanzaActressId?: number;
  name?: string;
  ruby?: string;
  cup?: string;
  bust?: number;
  waist?: number;
  hip?: number;
  height?: number;
  birthday?: string;
  bloodType?: string;
  hobby?: string;
  prefectures?: string;
  imageUrl?: string;
  fanzaDigitalUrl?: string;
  sampleImageUrl?: string;
  sampleItemUrl?: string;
};

export type Actress = {
  fanzaActressId: number;
  name: string;
  ruby: string;
  height: number;
  weight: number;
  cup: string;
  bust: number;
  waist: number;
  hip: number;
  bmi: number;
  type: string[];
  popularity: number;
  image: string;
  birthday: string;
  bloodType: string;
  hobby: string;
  prefectures: string;
  fanzaUrl: string;
  sampleImageUrl: string;
  sampleItemUrl: string;
};

function calcAge(birthday?: string): number {
  if (!birthday) return 0;
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function calcBmi(height: number, weight: number): number {
  if (!height || !weight) return 0;
  const m = height / 100;
  return Number((weight / (m * m)).toFixed(1));
}

function normalizeImageUrl(url?: string): string {
  if (!url) return "/window.svg";
  return url.replace(/^http:\/\//, "https://");
}

function buildFanzaUrl(item: RawActress): string {
  if (item.fanzaDigitalUrl) return item.fanzaDigitalUrl;
  return `https://video.dmm.co.jp/av/list/?key=${encodeURIComponent(
    (item.name ?? "") + " 単体"
  )}`;
}

function normalizeSampleImageUrl(url?: string): string {
  if (!url) return "";
  return url.replace(/^http:\/\//, "https://");
}

function buildTypeTags(item: RawActress): string[] {
  const tags: string[] = [];
  const age = calcAge(item.birthday);

  if (item.cup) {
    const cup = item.cup.toUpperCase();
    if (["G", "H", "I", "J", "K", "L", "M", "N", "O"].includes(cup)) tags.push("巨乳");
    if (["C", "D", "E", "F"].includes(cup)) tags.push("美乳");
  }

  if ((item.height ?? 0) >= 165) tags.push("高身長");
  if ((item.height ?? 999) <= 155) tags.push("小柄");
  if (age > 0 && age <= 23) tags.push("若手");
  if (age >= 35) tags.push("大人");
  if ((item.waist ?? 999) <= 58) tags.push("スレンダー");

  if (item.prefectures) tags.push(item.prefectures);

  return [...new Set(tags)];
}

export const fanzaActresses: Actress[] = (rawActresses as RawActress[]).map((item, index) => {
  const height = item.height ?? 0;
  const weight = 0;

  return {
    fanzaActressId: item.fanzaActressId ?? index + 1,
    name: item.name ?? "不明",
    ruby: item.ruby ?? "",
    height,
    weight,
    cup: item.cup ?? "",
    bust: item.bust ?? 0,
    waist: item.waist ?? 0,
    hip: item.hip ?? 0,
    bmi: calcBmi(height, weight),
    type: buildTypeTags(item),
    popularity: 0,
    image: normalizeImageUrl(item.imageUrl),
    birthday: item.birthday ?? "",
    bloodType: item.bloodType ?? "",
    hobby: item.hobby ?? "",
    prefectures: item.prefectures ?? "",
    fanzaUrl: buildFanzaUrl(item),
    sampleImageUrl: normalizeSampleImageUrl(item.sampleImageUrl),
    sampleItemUrl: item.sampleItemUrl ?? "",
  };
});

export const fanzaUniqueActresses = fanzaActresses;

export const fanzaRankedActresses = [...fanzaUniqueActresses].sort(
  (a, b) => b.popularity - a.popularity
);