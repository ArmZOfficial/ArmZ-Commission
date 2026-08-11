/* ── Loaders: ดึง content จาก Redis แล้ว fallback เป็นค่า default ──
 * Auto-seed: ถ้า key ไหนยังไม่มีใน Redis (เช่น เพิ่งเชื่อม Upstash ครั้งแรก)
 * จะเขียนค่า default ลง Redis ให้อัตโนมัติ — เปิดเว็บครั้งแรกก็มีข้อมูลครบ
 */
import { DEFAULT_CONTENT } from "./defaults";
import { getJson, setJson } from "./store";
import type {
  AboutContent,
  ContactContent,
  ContentKey,
  HomeContent,
  NavItem,
  PortfolioItem,
  PortfolioPageContent,
  PricingContent,
  SeoContent,
} from "./types";

export async function loadHome(): Promise<HomeContent> {
  const v = await getJson<HomeContent>("site:home");
  if (v) return v;
  const def = DEFAULT_CONTENT["site:home"] as HomeContent;
  await setJson("site:home", def); // seed ครั้งเดียว (idempotent)
  return def;
}

export async function loadAbout(): Promise<AboutContent> {
  const v = await getJson<AboutContent>("site:about");
  if (v) return v;
  const def = DEFAULT_CONTENT["site:about"] as AboutContent;
  await setJson("site:about", def);
  return def;
}

export async function loadPortfolio(): Promise<PortfolioItem[]> {
  const items = await getJson<PortfolioItem[]>("site:portfolio");
  if (items && Array.isArray(items)) {
    return items
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item, i) => ({ ...item, order: i }));
  }
  const def = (DEFAULT_CONTENT["site:portfolio"] as PortfolioItem[])
    .slice()
    .sort((a, b) => a.order - b.order);
  await setJson("site:portfolio", def);
  return def;
}

export async function loadPortfolioPage(): Promise<PortfolioPageContent> {
  const v = await getJson<PortfolioPageContent>("site:portfolioPage");
  if (v) return v;
  const def = DEFAULT_CONTENT["site:portfolioPage"] as PortfolioPageContent;
  await setJson("site:portfolioPage", def);
  return def;
}

export async function loadPricing(): Promise<PricingContent> {
  const v = await getJson<PricingContent>("site:pricing");
  if (v) return v;
  const def = DEFAULT_CONTENT["site:pricing"] as PricingContent;
  await setJson("site:pricing", def);
  return def;
}

export async function loadContact(): Promise<ContactContent> {
  const v = await getJson<ContactContent>("site:contact");
  if (v) return v;
  const def = DEFAULT_CONTENT["site:contact"] as ContactContent;
  await setJson("site:contact", def);
  return def;
}

export async function loadNav(): Promise<NavItem[]> {
  const items = await getJson<NavItem[]>("site:nav");
  if (items && Array.isArray(items) && items.length > 0) return items;
  const def = DEFAULT_CONTENT["site:nav"] as NavItem[];
  await setJson("site:nav", def);
  return def;
}

export async function loadSeo(): Promise<SeoContent> {
  const v = await getJson<SeoContent>("site:seo");
  if (v) return v;
  const def = DEFAULT_CONTENT["site:seo"] as SeoContent;
  await setJson("site:seo", def);
  return def;
}

/** ดึง content ทั้งหมด + seed keys ที่ยังไม่มี (ใช้ใน admin shell) */
export async function loadAllContent(): Promise<Record<ContentKey, unknown>> {
  const out = {} as Record<ContentKey, unknown>;
  for (const key of Object.keys(DEFAULT_CONTENT) as ContentKey[]) {
    const loaded = await getJson<unknown>(key);
    if (loaded !== null && loaded !== undefined) {
      out[key] = loaded;
    } else {
      out[key] = DEFAULT_CONTENT[key];
      await setJson(key, DEFAULT_CONTENT[key]);
    }
  }
  return out;
}
