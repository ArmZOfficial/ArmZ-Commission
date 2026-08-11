/* ── ข้อมูลทุกส่วนของเว็บ เก็บเป็น JSON blob ใน Upstash Redis ตาม key ด้านล่าง ── */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  image?: string;
}

export interface PackagePreview {
  name: string;
  price: string;
  note: string;
}

export interface HighlightCard {
  tag: string;
  title: string;
  body: string;
}

export interface HomeContent {
  eyebrow: string;
  headline: string; // บรรทัดคั่นด้วย \n (แต่ละบรรทัด = 1 บรรทัดของ headline)
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  packages: PackagePreview[];
  highlights: HighlightCard[];
  genres: string[]; // แถบแนวเพลง marquee ใต้ Hero
  invoiceEyebrow: string; // เช่น "Package Full Mixing" (บน invoice panel)
  invoiceNote: string; // เช่น "เริ่มต้นที่ ฿1,500"
  invoiceCtaLabel: string; // เช่น "ดูแพ็กเกจทั้งหมด"
}

export interface Stat {
  label: string;
  value: string;
}

export interface LinkRow {
  label: string;
  detail: string;
  href?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  username: string;
  copy?: boolean;
}

export interface AboutTab {
  id: string;
  label: string;
  items: LinkRow[];
}

export interface AboutSectionHeading {
  eyebrow: string; // เช่น "About Me"
  titlePrefix: string; // ข้อความก่อน highlight
  titleHighlight: string; // ส่วนที่แสดงเป็นตัวเอนสี accent
  titleSuffix: string; // ข้อความหลัง highlight
}

export interface AboutContent {
  name: string;
  role: string;
  availability: string;
  bio: string[];
  portrait: string; // รูปหลัก (Portrait Morph)
  portraitHover: string; // รูปที่สลับเมื่อ hover (webp แนะนำ)
  stats: Stat[];
  socials: SocialLink[];
  tabs: AboutTab[]; // Equipment / Software / Plugins
  stack: string[];
  stackEyebrow: string; // badge เหนือส่วน stack เช่น "Stack"
  stackTitle: string; // หัวข้อส่วน "เครื่องมือที่ใช้"
  section: AboutSectionHeading; // หัวข้อหน้า About
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  youtubeUrl: string;
  thumbnail: string; // ดึงอัตโนมัติจาก YouTube หรืออัปโหลดเอง
  description: string;
  tags: string[];
  featured: boolean; // ปักหมุดขึ้น Gradient Carousel
  order: number; // ลำดับการแสดงผล
}

export interface PricingPackage {
  id: string;
  name: string;
  requirements: string;
  price: number; // บาท
  priceLabel: string; // เช่น "เริ่มต้น"
  features: string[];
  popular: boolean;
}

export interface PricingNote {
  title: string;
  detail: string;
}

export interface PricingContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  packages: PricingPackage[];
  notes: PricingNote[];
  ctaLabel: string;
  ctaHref: string;
  popularLabel: string; // เช่น "ยอดนิยม"
  priceUnit: string; // เช่น "บาท"
  footerNote: string; // ข้อความท้ายหน้า
}

export interface ContactContent {
  logoImage: string; // รูปโลโก้ในวงกลม (ว่าง = แสดงตัวอักษร "AZ")
  eyebrow: string;
  headline: string;
  subheadline: string;
  x: { label: string; url: string; username: string };
  discord: { label: string; username: string; copyLabel: string; copiedLabel: string };
  ctaLabel: string;
  ctaSub: string;
  ctaButtonLabel: string; // ปุ่ม "ดูแพ็กเกจราคา" ใน CTA
}

/** หัวข้อหน้า Portfolio (เก็บแยกจาก list ผลงาน) */
export interface PortfolioPageContent {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  intro: string;
  featuredEyebrow: string; // badge เหนือ Gradient Carousel เช่น "Featured Works"
  featuredTitle: string; // เช่น "ผลงานเด่น"
  curatedEyebrow: string; // badge เหนือ Accordion เช่น "Curated Picks"
  curatedTitle: string; // เช่น "คัดมาให้ชม"
  gridEyebrow: string; // badge เหนือกริด "ผลงานทั้งหมด"
  gridTitle: string; // เช่น "ผลงานทั้งหมด"
  gridIntro: string; // คำอธิบายใต้หัวกริด
}

export interface SeoContent {
  title: string;
  description: string;
  ogImage: string; // URL รูป OG (ถ้าว่าง ใช้ /opengraph-image อัตโนมัติ)
  keywords: string;
  accent: string; // hex ของ accent color (ถ้าว่าง ใช้ค่า default ใน CSS)
}

export type ContentKey =
  | "site:home"
  | "site:about"
  | "site:portfolio"
  | "site:portfolioPage"
  | "site:pricing"
  | "site:contact"
  | "site:nav"
  | "site:seo";

export const CONTENT_KEYS: ContentKey[] = [
  "site:home",
  "site:about",
  "site:portfolio",
  "site:portfolioPage",
  "site:pricing",
  "site:contact",
  "site:nav",
  "site:seo",
];
