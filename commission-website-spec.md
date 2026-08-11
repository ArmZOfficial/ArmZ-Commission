# PROMPT: เว็บไซต์ Commission — Mixing & Mastering Studio

> ไฟล์นี้ใช้เป็น **master prompt / spec document** สำหรับสร้างเว็บไซต์รับงาน Commission ด้าน Mixing & Mastering ทั้งฝั่ง Frontend, Backend (Admin/CMS), และ Deployment สามารถนำไฟล์นี้ทั้งหมดไปวางให้ AI coding agent (เช่น Claude Code, Cursor) หรือส่งให้ทีม dev ใช้เป็น requirement เดียวจบได้เลย

---

## 0. ภาพรวมโปรเจกต์ (Project Overview)

สร้างเว็บไซต์ portfolio + commission สำหรับบริการ **Mixing & Mastering** โดยมีเป้าหมาย:

- ดูพรีเมียม เท่ ทันสมัย เข้ากับธีมงานเพลง/สตูดิโอ
- มีระบบหลังบ้าน (Admin Panel) ที่ **แก้ไขเนื้อหาได้ทุกส่วนของเว็บ** โดยไม่ต้องแตะโค้ด
- มี **Realtime Preview** ระหว่างแก้ไขข้อมูลในหลังบ้าน เพื่อดูผลลัพธ์ก่อน publish จริง
- Deploy บน **Vercel**
- ใช้ **Upstash Redis** เป็น storage หลักสำหรับเก็บ content ทั้งหมดของเว็บ

---

## 1. Tech Stack หลัก (บังคับใช้)

ใช้สแต็กนี้เป็นฐานของทั้งเว็บ (มาจาก checklist ที่กำหนด):

- [x] **Next.js 16+** ใช้ App Router
- [x] **TypeScript** (strict mode)
- [x] **Tailwind CSS v4** แบบ token-driven theming
- [x] **Dark Mode** ผ่าน `next-themes` (class-based) พร้อม view-transition reveal ตอนสลับธีม
- [x] **Motion** ผ่าน `motion/react` (เดิมชื่อ Framer Motion) รองรับ `prefers-reduced-motion`
- [x] **WebGL Flow Shader** — เอฟเฟกต์ circular fade แบบ aspect-correct ฝังใน fragment shader, sync กับพื้นหลังตามธีม
- [x] **Lenis Smooth Scroll** พร้อม anchor-link integration
- [x] **Portrait Morph** — hover สลับรูป (webp) แบบ magnetic cursor follow (ใช้ในหน้า About)
- [x] **Polaroid Strip, Skills, Stack, Experience, Education** — เซคชันเนื้อหารวมกันสำหรับ route `/about`
- [x] **Projects Grid** — การ์ดสไตล์ dribbble พร้อม hover lift + image zoom (ใช้กับ Portfolio)
- [x] **Contact Card** — คลิกครั้งเดียว copy ข้อมูลติดต่อ พร้อม hover swap content และ embedded shader
- [x] **Site Frame** — fixed top/left/right rails มุมโค้งด้านใน
- [x] **SEO Ready** — metadata, Open Graph, Twitter cards, sitemap, robots.txt
- [x] **Accessibility** — skip links, focus rings, ARIA labels, guard ด้วย `prefers-reduced-motion`
- [x] **Edge Compatible** — ห้ามใช้ Node-only APIs (ต้องรันบน Edge Runtime ได้)

> ⚠️ หมายเหตุ: **Animated Pill Nav** จาก checklist นี้ **ถูกแทนที่** ด้วย Navigation 8 block (ดูหัวข้อ 3) — ไม่ต้องใช้ทั้งสองแบบพร้อมกัน

### 1.1 Font / Typography

ปรับฟอนต์จาก preset เดิมให้ "เท่ขึ้น" เข้ากับธีมสตูดิโอเพลง แนะนำแนวทาง:

- **Display / Headline font**: ฟอนต์แนว editorial-serif หรือ geometric-display ที่มีคาแรกเตอร์ชัด (เช่นแนว Clash Display, Cabinet Grotesk, Neue Machina หรือฟอนต์ตระกูล serif ที่ใช้กับ Hero 19 อยู่แล้ว) — ใช้กับ headline, hero text, ตัวเลขราคา
- **Body font**: ฟอนต์อ่านง่าย โมเดิร์น (เช่น Geist, Inter, Satoshi) — ใช้กับเนื้อหาทั่วไป
- ตั้งเป็น CSS variable / Tailwind token เพื่อให้แก้จากที่เดียวได้ทั้งเว็บ (`--font-display`, `--font-body`)
- รองรับภาษาไทยด้วย (เลือกฟอนต์ที่มี Thai glyph หรือ fallback เป็นฟอนต์ไทยที่ดีไซน์เข้าธีมเดียวกัน เช่น IBM Plex Sans Thai, Anuphan)

---

## 2. React Bits Pro — Registry & License Setup

โปรเจกต์นี้ใช้บล็อก/คอมโพเนนต์จาก **React Bits Pro** และ **React Bits Starter** เป็นฐาน UI หลายจุด ต้องตั้งค่าก่อนเริ่มติดตั้งบล็อกใดๆ:

1. ตั้งค่า `components.json` ให้มี registries ของ `@reactbits-pro` และ `@reactbits-starter` ตามคู่มือ: https://pro.reactbits.dev/docs/installation
2. ใส่ Authorization header โดยอ้างอิงจาก environment variable `REACTBITS_LICENSE_KEY`
3. เพิ่ม `REACTBITS_LICENSE_KEY` ใน `.env.local` และใน Vercel Environment Variables (ทั้ง Production/Preview)
4. ติดตั้งบล็อกแต่ละตัวด้วยคำสั่ง `npx shadcn@latest add <registry-item>` ตามที่ระบุในแต่ละหัวข้อด้านล่าง แล้ว import ไปปรับ content/design token ให้ตรงกับโปรเจกต์

---

## 3. Global Layout & Navigation

**Block ที่ใช้:** Navigation 8 — Bottom nav แบบ blurred background พร้อม image preview

- Docs: https://pro.reactbits.dev/docs/blocks/navigation/navigation-8
- Registry: `@reactbits-pro/navigation-8`
- ติดตั้ง:
  ```bash
  npx shadcn@latest add @reactbits-pro/navigation-8
  ```

**ปรับแก้จาก default:**
- ลดเหลือ **5 เมนูเท่านั้น**: `Home`, `About Me`, `Portfolio`, `Pricing`, `Contact`
- ใช้ Site Frame (จาก stack หลัก) ครอบ layout ทั้งเว็บ — fixed rails บน/ซ้าย/ขวา มุมโค้งด้านใน
- Nav ต้องรองรับ dark mode toggle (hydration-safe) และ active indicator แบบ spring animation

---

## 4. หน้า Home (`/`)

**Block หลัก:** Hero 19 — Split billing hero, serif editorial headline, staggered invoice panel, spring-damped parallax cards

- Docs: https://pro.reactbits.dev/docs/blocks/hero-section/hero-19
- Registry: `@reactbits-pro/hero-19`
- ติดตั้ง:
  ```bash
  npx shadcn@latest add @reactbits-pro/hero-19
  ```

**การปรับใช้กับโปรเจกต์นี้:**
- Headline หลักเปลี่ยนเป็นข้อความเกี่ยวกับบริการ Mixing & Mastering (เช่น จุดขาย, ความถนัด, แนวเพลงที่ทำ)
- Staggered invoice panel → ปรับเป็นพรีวิวแพ็กเกจราคาแบบย่อ (ลิงก์ไปหน้า `/pricing`) หรือ preview ผลงานล่าสุด
- Parallax cards → ใช้โชว์ไฮไลต์ผลงาน/รีวิวลูกค้าแบบย่อ
- ฟอนต์ headline ใช้ตัว serif/display ที่ปรับใหม่ตามหัวข้อ 1.1
- ผสาน WebGL Flow Shader ของพื้นหลังให้ sync กับธีม และ Lenis smooth scroll ทั้งหน้า

---

## 5. หน้า About Me (`/about`)

**Block หลัก:** Profile 5 — Spotlight creator card บน dark panel พร้อม stats, tabbed link rows, social actions

- Docs: https://pro.reactbits.dev/docs/blocks/profile/profile-5
- Registry: `@reactbits-pro/profile-5`
- ติดตั้ง:
  ```bash
  npx shadcn@latest add @reactbits-pro/profile-5
  ```

**เนื้อหาที่ต้องมี (ทุกอันแก้ไขได้ผ่าน Admin):**
- แนะนำตัว / bio ส่วนตัว
- **อุปกรณ์ที่ใช้ (Equipment)** — เช่น audio interface, monitor speakers, headphones, microphone ฯลฯ (แสดงเป็นลิสต์/แท็ก)
- **โปรแกรมที่ใช้ (Software / DAW)** — เช่น FL Studio, Ableton Live, Pro Tools, Logic Pro ฯลฯ
- **ปลั๊กอินที่ใช้ (Plugins)** — เช่น EQ, Compressor, Reverb, Saturation ฯลฯ ระบุยี่ห้อ/รุ่นได้
- Stats card (จำนวนผลงาน, ปีประสบการณ์, จำนวนลูกค้า ฯลฯ)
- Social links (เชื่อมกับ social actions ของ Profile 5)
- ใช้ **Portrait Morph** (จาก stack หลัก) เป็นรูปโปรไฟล์ — hover สลับรูปแบบ magnetic cursor follow
- รวมเซคชัน **Polaroid Strip / Skills / Stack / Experience / Education** จาก stack หลักไว้ในหน้านี้ด้วย (co-located ตาม spec เดิม)

---

## 6. หน้า Portfolio (`/portfolio`)

หน้านี้ต้อง **หลากหลายรูปแบบการโชว์ผลงาน** โดยผสมผสาน 3 บล็อก/คอมโพเนนต์เข้าด้วยกัน และผลงานทุกชิ้น **ลิงก์ออกไปยัง YouTube**

### 6.1 Showcase 4 — Filterable Project Grid
- Docs: https://pro.reactbits.dev/docs/blocks/showcase/showcase-4
- Registry: `@reactbits-pro/showcase-4`
- ติดตั้ง:
  ```bash
  npx shadcn@latest add @reactbits-pro/showcase-4
  ```
- ใช้เป็น **กริดหลัก** ของหน้า Portfolio พร้อม category pills (เช่น K-Pop, J-Pop, Hip-Hop, Cover ฯลฯ) และ animated layout transition ตอนกรอง
- ใช้ Projects Grid style (dribbble-style, hover lift + image zoom) จาก stack หลักร่วมด้วย

### 6.2 Gradient Carousel — 3D Card Carousel
- Docs: https://pro.reactbits.dev/docs/components/gradient-carousel
- Registry: `@reactbits-starter/gradient-carousel-tw`
- ติดตั้ง:
  ```bash
  npx shadcn@latest add @reactbits-starter/gradient-carousel-tw
  ```
- ใช้เป็น **ส่วน Featured / Highlight** ด้านบนของหน้า Portfolio — ดึงสีพื้นหลังแบบ gradient จากภาพผลงานอัตโนมัติ
- แสดงผลงานเด่น 4–6 ชิ้นที่ Admin สามารถ "ปักหมุด" ให้ขึ้นในส่วนนี้ได้

### 6.3 Accordion Gallery — Hover Expand Gallery
ใช้เป็นอีกหนึ่งรูปแบบการโชว์ผลงาน (เช่น section "Curated Picks" หรือแยกตามหมวดพิเศษ) โครง component ตัวอย่าง:

```jsx
import AccordionGallery from './AccordionGallery'

const items = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
]

<AccordionGallery
  items={items}
  defaultIndex={2}
  expandRatio={0.52}
  trigger="hover"
/>
```
- ปรับ `image` ให้ดึงจาก thumbnail ของ YouTube (`https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg`) และ `link` ให้เป็น URL ผลงานจริงจากฐานข้อมูล
- `label` = ชื่อผลงาน/ชื่อเพลง

### 6.4 ข้อมูลผลงาน (Portfolio Item — Data Model)

แต่ละผลงานต้องมีฟิลด์อย่างน้อย:

| ฟิลด์ | รายละเอียด |
|---|---|
| `id` | unique id |
| `title` | ชื่อผลงาน/ชื่อเพลง |
| `category` | หมวดหมู่ (สำหรับ filter pills ใน Showcase 4) |
| `youtubeUrl` | ลิงก์ YouTube ของผลงาน |
| `thumbnail` | ดึงอัตโนมัติจาก YouTube หรืออัปโหลดเอง |
| `description` | คำอธิบายสั้นๆ (บทบาทที่ทำ เช่น Mix only / Mix & Master) |
| `tags` | แท็กเพิ่มเติม |
| `featured` | boolean — ใช้ปักหมุดเข้า Gradient Carousel |
| `order` | ลำดับการแสดงผล |

### 6.5 ระบบจัดการผลงาน (ผ่าน Admin)
- **เพิ่มผลงาน**: กรอกฟอร์ม (วางลิงก์ YouTube แล้วระบบดึง thumbnail/ชื่อวิดีโออัตโนมัติได้ยิ่งดี)
- **แก้ไขผลงาน**: แก้รายละเอียดทุกฟิลด์ได้
- **ลบผลงาน**: ลบพร้อม confirm dialog
- **จัดเรียง/ปักหมุด**: drag-to-reorder และ toggle featured

---

## 7. หน้า Pricing (`/pricing`)

หน้านี้เป็น **หน้าโชว์ราคาอย่างเดียว** ไม่มีระบบจองคิว/ชำระเงินในตัว

**Block อ้างอิง:** Pricing 12 — Single-plan membership spotlight พร้อม animated billing toggle และ dark inset panel

- Docs: https://pro.reactbits.dev/docs/blocks/pricing/pricing-12
- Registry: `@reactbits-pro/pricing-12`
- ติดตั้ง:
  ```bash
  npx shadcn@latest add @reactbits-pro/pricing-12
  ```

> ⚠️ หมายเหตุการปรับ: Pricing 12 ต้นแบบเป็น layout **single-plan** แต่ข้อมูลราคาจริงมี **4 แพ็กเกจ** (ดูตารางด้านล่าง) จึงต้องปรับ layout จาก single spotlight เป็น **การ์ดหลายแพ็กเกจในธีม/สไตล์เดียวกัน** (คง dark inset panel + typography ของ Pricing 12 ไว้ แต่ทำเป็น grid 4 การ์ด หรือทำเป็นตารางเปรียบเทียบสไตล์เดียวกับภาพอ้างอิง)

### 7.1 ข้อมูลราคา — PACKAGE FULL MIXING

| แพ็กเกจ | ข้อกำหนด | ราคา |
|---|---|---|
| Solo Set | ไม่เกิน 7 แทร็ค | เริ่มต้น 1,500 บาท |
| Duo Set | ไม่เกิน 14 แทร็ค | เริ่มต้น 2,000 บาท |
| Group Set | คนร้องไม่เกิน 4 คน / ไม่เกิน 30 แทร็ค | เริ่มต้น 2,500 บาท |
| Big Group Set | คนร้องไม่เกิน 10 คน / ไม่เกิน 50 แทร็ค | เริ่มต้น 3,000 บาท |

**เงื่อนไขเพิ่มเติม:**
- งานเร่ง (Rush) = ราคา x2
- งานเชิงพาณิชย์ (Commercial use) = ราคา x2
- ปุ่ม CTA: **"เช็คคิว"** (ลิงก์ไปยังช่องทางติดต่อ เช่น Discord)

### 7.2 ต้องแก้ไขได้ผ่าน Admin
- ชื่อแพ็กเกจ, ข้อกำหนด (จำนวนแทร็ค/จำนวนคนร้อง), ราคา ของทุกแพ็กเกจ
- ข้อความเงื่อนไขเพิ่มเติม (rush/commercial multiplier)
- ข้อความและลิงก์ของปุ่ม CTA

---

## 8. หน้า Contact (`/contact`)

**Block:** Contact 6 — Centered contact card พร้อม circular logo badge, heading และ dark CTA

- Docs: https://pro.reactbits.dev/docs/blocks/contact/contact-6
- Registry: `@reactbits-pro/contact-6`
- ติดตั้ง:
  ```bash
  npx shadcn@latest add @reactbits-pro/contact-6
  ```

**เนื้อหา (เรียบง่าย ไม่ซับซ้อน) — มีแค่ 2 ช่องทาง:**
- **X (Twitter)**: https://x.com/ArmZChan00
- **Discord**: `iar3z_`

แต่ละช่องทางเป็นปุ่มกดเพื่อไปยังลิงก์นั้นๆ (X เปิดลิงก์โดยตรง / Discord แสดงปุ่ม copy username หรือ deep-link ถ้าเป็นไปได้) ไม่ต้องมีฟอร์มติดต่อหรือรายละเอียดเพิ่มเติม

**ต้องแก้ไขได้ผ่าน Admin:**
- ลิงก์ X, Discord username, ข้อความ heading/CTA

---

## 9. ระบบหลังบ้าน (Admin / CMS)

### 9.1 การเข้าถึง
- หน้า `/admin` แยกจาก layout หลักของเว็บ, มีระบบ login (เช่น NextAuth หรือ password-based session ง่ายๆ เก็บ session ผ่าน Upstash Redis)

### 9.2 ขอบเขตที่แก้ไขได้ (ครบทุกหน้า)
- **Home**: headline, ข้อความ hero, invoice/preview panel
- **About**: bio, equipment list, software list, plugin list, stats, social links, Skills/Stack/Experience/Education, รูปโปรไฟล์ (สำหรับ Portrait Morph)
- **Portfolio**: CRUD ผลงานทั้งหมด (เพิ่ม/แก้/ลบ/จัดเรียง/ปักหมุด featured) ตามหัวข้อ 6.4–6.5
- **Pricing**: ข้อมูลทุกแพ็กเกจ + เงื่อนไขเพิ่มเติม + CTA
- **Contact**: ลิงก์ช่องทางติดต่อ
- **Global**: เมนู nav (label/ลำดับ), SEO metadata (title, description, OG image), ธีมสี (token-driven)

### 9.3 Realtime Preview
- มีโหมด **Preview แบบ realtime** ระหว่างกำลังแก้ไขในหลังบ้าน เช่น:
  - Split-screen: ฟอร์มแก้ไขด้านซ้าย + preview หน้าเว็บจริงด้านขวา (iframe หรือ live component)
  - อัปเดตค่าใน state ทันทีที่พิมพ์/แก้ (optimistic UI) ก่อนกด "บันทึก" จริงลง Redis
  - รองรับสลับดู breakpoint (desktop/mobile) ใน preview

### 9.4 Data Storage — Upstash Redis
- เก็บ content แต่ละหน้าเป็น JSON blob แยก key เช่น:
  - `site:home`
  - `site:about`
  - `site:portfolio` (array ของ portfolio items)
  - `site:pricing`
  - `site:contact`
  - `site:nav`
  - `site:seo`
- ใช้ Upstash Redis REST API (`@upstash/redis`) เพื่อให้ทำงานได้บน Edge Runtime
- Environment variables ที่ต้องตั้งใน Vercel: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## 10. Deployment

- Deploy บน **Vercel**, ต้อง Edge Compatible ทั้งโปรเจกต์ (ไม่ใช้ Node-only API ตาม stack หลัก)
- Environment Variables ที่ต้องตั้งค่าใน Vercel:
  - `REACTBITS_LICENSE_KEY`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
  - ตัวแปร auth สำหรับ Admin (เช่น `ADMIN_PASSWORD` หรือ NextAuth secret)
- ตั้งค่า SEO: sitemap.xml, robots.txt, Open Graph image, Twitter card สำหรับทุกหน้า

---

## 11. Checklist สรุปก่อนส่งมอบ

- [ ] Nav เหลือ 5 เมนู (Home / About Me / Portfolio / Pricing / Contact) ด้วย Navigation 8
- [ ] Home ใช้ Hero 19 ปรับเนื้อหาเป็น Mixing & Mastering + ฟอนต์ใหม่
- [ ] About ใช้ Profile 5 + Portrait Morph + ระบุอุปกรณ์/โปรแกรม/ปลั๊กอิน
- [ ] Portfolio ผสาน Showcase 4 + Gradient Carousel + Accordion Gallery, ลิงก์ YouTube ทุกผลงาน, CRUD ครบ
- [ ] Pricing ใช้ธีม Pricing 12 ปรับเป็น 4 แพ็กเกจตามตาราง พร้อมเงื่อนไข rush/commercial
- [ ] Contact ใช้ Contact 6 มีแค่ X และ Discord
- [ ] Admin แก้ไขได้ทุกส่วนของเว็บ + Realtime Preview
- [ ] เชื่อม Upstash Redis เก็บ content ทั้งหมด
- [ ] Deploy Vercel ได้จริง, Edge Compatible, SEO + Accessibility ครบตาม stack หลัก
