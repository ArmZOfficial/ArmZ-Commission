/* ── ค่า default ของเนื้อหาทุกส่วนของเว็บ (ภาษาไทย) ──
 * ใช้เมื่อยังไม่มีข้อมูลใน Redis หรือลบ key ทิ้ง
 */
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

export function defaultNav(): NavItem[] {
  return [
    { id: "home", label: "Home", href: "/", image: "" },
    { id: "about", label: "About Me", href: "/about", image: "" },
    { id: "portfolio", label: "Portfolio", href: "/portfolio", image: "" },
    { id: "pricing", label: "Pricing", href: "/pricing", image: "" },
    { id: "contact", label: "Contact", href: "/contact", image: "" },
  ];
}

export function defaultHome(): HomeContent {
  return {
    eyebrow: "Mixing & Mastering Studio",
    headline: "ทำให้เพลงของคุณ\nฟังดูเป็นโปร\nในทุกสเตจ",
    subheadline:
      "รับ Mixing & Mastering ทุกแนวเพลง — K-Pop, J-Pop, Hip-Hop, Rock ดูแลโดยวิศวกรเสียงที่เข้าใจศิลปิน เน้นคุณภาพระดับสตูดิโอ ตรงเวลา และใส่ใจทุกรายละเอียดของเสียง",
    ctaLabel: "เช็คคิว",
    ctaHref: "/contact",
    secondaryLabel: "ดูผลงาน",
    secondaryHref: "/portfolio",
    packages: [
      { name: "Solo Set", price: "1,500", note: "ไม่เกิน 7 แทร็ค" },
      { name: "Duo Set", price: "2,000", note: "ไม่เกิน 14 แทร็ค" },
      { name: "Group Set", price: "2,500", note: "ร้อง ≤ 4 คน / 30 แทร็ค" },
      { name: "Big Group Set", price: "3,000", note: "ร้อง ≤ 10 คน / 50 แทร็ค" },
    ],
    highlights: [
      {
        tag: "Mixing",
        title: "มิกซ์ให้กลมกล่อมทุกแนว",
        body: "ปรับสมดุลความถี่ ใส่ไดนามิกและอารมณ์ให้ทุกองค์ประกอบอยู่ตัว — จาก Pop ถึง Hip-Hop เน้นเสียงที่โปร่งใสและมีพลัง",
      },
      {
        tag: "Mastering",
        title: "Master ให้พร้อมปล่อยจริง",
        body: "ลูเดียสสุดท้ายให้ได้มาตรฐานสตรีมมิงของ Spotify / Apple Music / YouTube ไม่ดังเกิน ไม่เพี้ยนทุกระดับเสียง",
      },
      {
        tag: "Workflow",
        title: "อัปเดตงานให้ฟังตลอด",
        body: "ส่งตัวอย่างงานระหว่างทำ พร้อมปรับตามความเห็นของศิลปินจนกว่าจะพอใจ ก่อนส่งไฟล์ final คุณภาพสูง",
      },
    ],
    genres: ["K-Pop", "Hip-Hop", "Rock", "R&B", "Cover", "Indie", "EDM", "Acoustic", "J-Pop", "Ballad", "Soul"],
    invoiceEyebrow: "Package Full Mixing",
    invoiceNote: "เริ่มต้นที่ ฿1,500",
    invoiceCtaLabel: "ดูแพ็กเกจทั้งหมด",
  };
}

export function defaultAbout(): AboutContent {
  return {
    name: "Arm",
    role: "Mixing & Mastering Engineer",
    availability: "เปิดรับงาน",
    bio: [
      "สวัสดีครับ ผม อาร์ม — Mixing & Mastering Engineer ทำงานสายดนตรีมากว่า 5 ปี ดูแลทั้งวง Pop, Hip-Hop และอีกหลายแนว เป้าหมายของผมคือทำให้เพลงของคุณฟังแล้ว 'ใช่' ทั้งอารมณ์และคุณภาพเสียง",
      "ผมเชื่อว่าการมิกซ์ที่ดีเริ่มจากการฟังให้เข้าใจงานของศิลปิน ไม่ใช่แค่ปรับ EQ ตามสูตร ผมจะทำงานร่วมกับคุณทุกขั้นตอน ตั้งแต่ Pre-mix review ไปจนถึงไฟล์มาสเตอร์สุดท้าย",
    ],
    portrait: "https://picsum.photos/seed/arm-studio-1/720/900",
    portraitHover: "https://picsum.photos/seed/arm-studio-2/720/900",
    stats: [
      { label: "ผลงานที่ทำ", value: "100+" },
      { label: "ปีประสบการณ์", value: "5+" },
      { label: "ศิลปินที่ร่วมงาน", value: "60+" },
      { label: "เพลงที่ปล่อยจริง", value: "40+" },
    ],
    socials: [
      { id: "x", label: "X (Twitter)", url: "https://x.com/ArmZChan00", username: "@ArmZChan00", copy: false },
      { id: "discord", label: "Discord", url: "", username: "iar3z_", copy: true },
    ],
    tabs: [
      {
        id: "equipment",
        label: "อุปกรณ์",
        items: [
          { label: "Audio Interface", detail: "Universal Audio Apollo Twin X" },
          { label: "Monitor Speakers", detail: "Yamaha HS7 + HS8S Sub" },
          { label: "Headphones", detail: "Sennheiser HD 600 / DT 770 Pro" },
          { label: "Microphone", detail: "Shure SM7B / Neumann TLM 102" },
          { label: "MIDI Controller", detail: "Arturia KeyLab 61" },
        ],
      },
      {
        id: "software",
        label: "โปรแกรม",
        items: [
          { label: "DAW หลัก", detail: "FL Studio 21 + Ableton Live 12" },
          { label: "โปรดักชันเพิ่มเติม", detail: "Logic Pro, Pro Tools" },
          { label: "เสียงประกอบ/ซาวด์ดีไซน์", detail: "iZotope RX 10" },
        ],
      },
      {
        id: "plugins",
        label: "ปลั๊กอิน",
        items: [
          { label: "EQ", detail: "FabFilter Pro-Q 3, SSL G-Channel" },
          { label: "Compressor", detail: "CLA-2A / CLA-76, Distressor" },
          { label: "Reverb & Delay", detail: "Valhalla VintageVerb, EchoBoy" },
          { label: "Saturation", detail: "Decapitator, Saturn 2" },
          { label: "Mastering", detail: "iZotope Ozone 11, T-RackS 5" },
        ],
      },
    ],
    stackEyebrow: "Stack",
    stack: [
      "FL Studio",
      "Ableton Live",
      "Pro Tools",
      "Logic Pro",
      "Ozone 11",
      "FabFilter",
      "Valhalla",
      "Soundtoys",
      "iZotope RX",
    ],
    stackTitle: "เครื่องมือที่ใช้",
    section: {
      eyebrow: "About Me",
      titlePrefix: "วิศวกรเสียงที่",
      titleHighlight: "ฟังเพลงของคุณ",
      titleSuffix: "ก่อนปรับ EQ",
    },
  };
}

export function defaultPortfolio(): PortfolioItem[] {
  const base = [
    {
      id: "p1",
      title: "Uptown Funk (Mashup Mix)",
      category: "K-Pop",
      youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
      thumbnail: "",
      description: "Mix & Master — ปรับสมดุลวงดนตรีสด + โวคอล เน้นความกลมกล่อมแบบ radio-ready",
      tags: ["Mix & Master", "Radio Ready"],
      featured: true,
    },
    {
      id: "p2",
      title: "Shape of You (Cover)",
      category: "Cover",
      youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
      thumbnail: "",
      description: "Mix only — โวคอล + acoustic guitar ให้เสียงโปร่งเป็นธรรมชาติ",
      tags: ["Mix", "Acoustic"],
      featured: true,
    },
    {
      id: "p3",
      title: "Despacito (Latin Pop Mix)",
      category: "K-Pop",
      youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      thumbnail: "",
      description: "Mix & Master — งานจังหวะเยอะ เน้นความชัดของ low-end และการแยกสเตจ",
      tags: ["Mix & Master", "Latin"],
      featured: true,
    },
    {
      id: "p5",
      title: "See You Again (Hip-Hop Ballad)",
      category: "Hip-Hop",
      youtubeUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk",
      thumbnail: "",
      description: "Mix & Master — โฟกัสที่โวคอลให้ลอยอยู่หน้าบีตพร้อมความอบอุ่นของเปียโน",
      tags: ["Mix & Master", "Hip-Hop"],
      featured: true,
    },
    {
      id: "p6",
      title: "Hello (Ballad Master)",
      category: "Cover",
      youtubeUrl: "https://www.youtube.com/watch?v=YQHsXMglC9A",
      thumbnail: "",
      description: "Mastering only — รับงานมาสเตอร์ให้มิกซ์สำเร็จแล้ว ปรับให้ดังและใสตามมาตรฐาน",
      tags: ["Master"],
      featured: false,
    },
  ];
  return base.map((item, i) => ({ ...item, order: i }));
}

export function defaultPortfolioPage(): PortfolioPageContent {
  return {
    eyebrow: "Portfolio",
    titlePrefix: "ผลงาน",
    titleHighlight: "ของผม",
    intro:
      "ทุกผลงานเปิดชมได้บน YouTube — กดที่การ์ดเพื่อฟังว่าเพลงผ่านการ Mix & Master จากห้องของผมเป็นอย่างไร",
    featuredEyebrow: "Featured Works",
    featuredTitle: "ผลงานเด่น",
    curatedEyebrow: "Curated Picks",
    curatedTitle: "คัดมาให้ชม",
    gridEyebrow: "Portfolio",
    gridTitle: "ผลงานทั้งหมด",
    gridIntro: "กดที่การ์ดเพื่อเปิดชมผลงานบน YouTube — ทุกเพลงผ่านการ Mix & Master จากห้องของผม",
  };
}

export function defaultPricing(): PricingContent {
  return {
    eyebrow: "PACKAGE FULL MIXING",
    headline: "แพ็กเกจราคา",
    subheadline:
      "ราคาต่อ 1 เพลง เริ่มต้นตามขนาดวง งานเร่งหรือใช้งานเชิงพาณิชย์คิด x2 — เช็คคิวกับผมก่อนส่งไฟล์ได้เลย",
    packages: [
      {
        id: "solo",
        name: "Solo Set",
        requirements: "ไม่เกิน 7 แทร็ค",
        price: 1500,
        priceLabel: "เริ่มต้น",
        features: ["ไม่เกิน 7 แทร็ค", "Mix + Master ครบวงจร", "ส่งตัวอย่างระหว่างทำ", "แก้ไขได้ 3 รอบ"],
        popular: false,
      },
      {
        id: "duo",
        name: "Duo Set",
        requirements: "ไม่เกิน 14 แทร็ค",
        price: 2000,
        priceLabel: "เริ่มต้น",
        features: ["ไม่เกิน 14 แทร็ค", "Mix + Master ครบวงจร", "ส่งตัวอย่างระหว่างทำ", "แก้ไขได้ 3 รอบ"],
        popular: true,
      },
      {
        id: "group",
        name: "Group Set",
        requirements: "คนร้องไม่เกิน 4 คน / ไม่เกิน 30 แทร็ค",
        price: 2500,
        priceLabel: "เริ่มต้น",
        features: ["ร้อง ≤ 4 คน / 30 แทร็ค", "Mix + Master ครบวงจร", "ส่งตัวอย่างระหว่างทำ", "แก้ไขได้ 3 รอบ"],
        popular: false,
      },
      {
        id: "biggroup",
        name: "Big Group Set",
        requirements: "คนร้องไม่เกิน 10 คน / ไม่เกิน 50 แทร็ค",
        price: 3000,
        priceLabel: "เริ่มต้น",
        features: ["ร้อง ≤ 10 คน / 50 แทร็ค", "Mix + Master ครบวงจร", "ส่งตัวอย่างระหว่างทำ", "แก้ไขได้ 3 รอบ"],
        popular: false,
      },
    ],
    notes: [
      { title: "งานเร่ง (Rush)", detail: "ราคา x2 — จัดคิวให้ภายใน 48 ชม." },
      { title: "งานเชิงพาณิชย์ (Commercial)", detail: "ราคา x2 — เพลงที่ใช้หารายได้/ออกเชิงพาณิชย์" },
    ],
    ctaLabel: "เช็คคิว",
    ctaHref: "/contact",
    popularLabel: "ยอดนิยม",
    priceUnit: "บาท",
    footerNote:
      "* หากมีข้อสงสัยเพิ่มเติม หรือ ต้องการแจ้งรายละเอียดเพิ่มเติม สามารถเข้ามาสอบถามได้เลยครับ *",
  };
}

export function defaultContact(): ContactContent {
  return {
    logoImage: "",
    eyebrow: "Contact",
    headline: "พูดคุยเรื่องงานได้เลย",
    subheadline: "ส่งเดโม เช็คคิว หรือสอบถามรายละเอียดได้ผ่าน 2 ช่องทางนี้",
    x: { label: "X (Twitter)", url: "https://x.com/ArmZChan00", username: "@ArmZChan00" },
    discord: {
      label: "Discord",
      username: "iar3z_",
      copyLabel: "คัดลอก username",
      copiedLabel: "คัดลอกแล้ว!",
    },
    ctaLabel: "เปิดรับงาน Mixing & Mastering",
    ctaSub: "เช็คคิว หรือส่งไฟล์เดโมได้เลย — ตอบกลับภายใน 24 ชม.",
    ctaButtonLabel: "ดูแพ็กเกจราคา",
  };
}

export function defaultSeo(): SeoContent {
  return {
    title: "ArmZChan — Mixing & Mastering Studio",
    description:
      "รับ Mixing & Mastering ทุกแนวเพลง ราคาเริ่มต้น 1,500 บาท โดยวิศวกรเสียงมืออาชีพ — K-Pop, J-Pop, Hip-Hop, Cover",
    ogImage: "",
    keywords: "mixing, mastering, รับมิกซ์, รับมาสเตอร์, producer, music studio, thailand",
    accent: "",
  };
}

export const DEFAULT_CONTENT: Record<ContentKey, unknown> = {
  "site:home": defaultHome(),
  "site:about": defaultAbout(),
  "site:portfolio": defaultPortfolio(),
  "site:portfolioPage": defaultPortfolioPage(),
  "site:pricing": defaultPricing(),
  "site:contact": defaultContact(),
  "site:nav": defaultNav(),
  "site:seo": defaultSeo(),
};
