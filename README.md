# 🎛️ ArmZChan — Commission Website (Mixing & Mastering Studio)

เว็บไซต์ Portfolio + Commission สำหรับบริการ **Mixing & Mastering** พร้อมระบบหลังบ้าน (Admin/CMS) ที่แก้ไขเนื้อหาได้ **ทุกส่วนของเว็บ** โดยไม่ต้องแตะโค้ด มี **Realtime Preview** และเก็บข้อมูลผ่าน **Upstash Redis** — Deploy บน Vercel

---

## ✨ ฟีเจอร์หลัก

| ส่วน | รายละเอียด |
|---|---|
| **Home** | Hero แบบ editorial serif + พรีวิวแพ็กเกจ + parallax cards + genre marquee |
| **About** | Spotlight creator card + Portrait Morph (hover สลับรูป) + Stats + แท็บ อุปกรณ์/โปรแกรม/ปลั๊กอิน + Stack |
| **Portfolio** | 3 รูปแบบการโชว์ผลงาน: **Gradient Carousel** (3D + gradient จากภาพ), **Showcase 4** (กรองตามหมวด), **Accordion Gallery** (hover expand) — ทุกชิ้นลิงก์ YouTube |
| **Pricing** | 4 แพ็กเกจ (Solo / Duo / Group / Big Group) + เงื่อนไข Rush & Commercial (x2) + ปุ่ม “เช็คคิว” |
| **Contact** | แค่ 2 ช่องทาง: X (เปิดลิงก์) + Discord (ปุ่มคัดลอก username) |
| **Admin `/admin`** | Login ด้วยรหัสผ่าน → แก้ไขเนื้อหาทุกส่วน + Portfolio CRUD (เพิ่ม/แก้/ลบ/ลากจัดเรียง/ปักหมุด) + **อัปโหลดรูปทุกจุด** (About / Portfolio / Nav / OG — บีบอัดอัตโนมัติ เก็บใน Redis) + **Realtime Preview** (สลับ desktop/tablet/mobile, สลับธีม) |

## 🧱 Tech Stack

- **Next.js 16** (App Router) + **TypeScript** strict + **Tailwind CSS v4** (token-driven theming)
- **Dark mode** ผ่าน `next-themes` (class-based) พร้อม **view-transition reveal** — ธีม **ขาว-ดำล้วน (Pure Mono)** เน้น glow, **เปิดเป็น dark mode เสมอ** (ไม่ตามระบบ) ผู้ใช้สลับเป็น light ได้เอง: dark = พื้นดำ + accent ขาว, light = พื้นขาว + accent ดำ
- **Motion** (`motion/react`) — รองรับ `prefers-reduced-motion` ทุกจุด
- **WebGL Flow Shader** (circular fade, aspect-correct, sync ธีม) / **Lenis** smooth scroll
- **BorderGlow** (React Bits) — ขอบเรืองแสงไล่ตามเมาส์ (About + Contact CTA)
- **Upstash Redis** (`@upstash/redis`) — REST API, ใช้ได้ทั้ง Node.js และ Edge (ปัจจุบันรันบน **Node.js runtime** ตามคำแนะนำ Next.js 16)
- SEO: metadata, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, OG image อัตโนมัติ

> **หมายเหตุ React Bits**: โปรเจกต์นี้มี `components.json` พร้อม registries `@reactbits-pro` / `@reactbits-starter`
> และคอมโพเนนต์ทุกบล็อก (Hero 19, Navigation 8, Profile 5, Showcase 4, Pricing 12, Contact 6,
> Gradient Carousel, Accordion Gallery) ที่ implement ใหม่ให้ตรงสไตล์ต้นฉบับ — ถ้ามี license
> (`REACTBITS_LICENSE_KEY`) ก็ใช้คำสั่ง `npx shadcn@latest add @reactbits-pro/hero-19` แทนได้

---

## 🚀 เริ่มต้นใช้งาน (Local)

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. สร้างไฟล์ environment (ดู .env.example)
cp .env.example .env.local

# 3. รัน dev server
npm run dev
```

เปิด `http://localhost:3000` — Admin อยู่ที่ `http://localhost:3000/admin`

### Environment Variables

| ตัวแปร | จำเป็น? | รายละเอียด |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | ต้องตั้งเพื่อใช้งานจริง | ถ้าไม่ตั้ง → ใช้ in-memory fallback (ข้อมูลหายเมื่อ restart เหมาะกับ dev) |
| `ADMIN_PASSWORD` | แนะนำ (ตั้งแล้วชนะรหัส default) | รหัสผ่านหน้า `/admin` — **ถ้าไม่ตั้ง จะใช้ default `armzlnwza007`** (ทุก environment, มี warning ใน production) |
| `AUTH_SECRET` | แนะนำ | ใช้เซ็น session cookie |
| `NEXT_PUBLIC_SITE_URL` | แนะนำ | URL เว็บจริง (ใช้ใน sitemap / OG) |
| `REACTBITS_LICENSE_KEY` | เฉพาะถ้าจะติดตั้งบล็อกจาก React Bits | สำหรับ `shadcn` CLI |

---

## 📝 วิธีใช้ Admin / CMS

1. เข้า `/admin` → ใส่รหัสผ่าน (`ADMIN_PASSWORD`)
2. เลือกหมวดทางซ้าย: **หน้าแรก / เกี่ยวกับฉัน / ผลงาน / ราคา / ติดต่อ / Global**
3. แก้ไขฟอร์มด้านซ้าย → **พรีวิวด้านขวาอัปเดตทันที** (optimistic) — สลับ breakpoint (desktop/tablet/mobile) และสลับธีม (dark/light) ได้จากแถบพรีวิว
4. **รูปทุกจุดอัปโหลดได้**: ช่องรูปโปรไฟล์ / รูป hover (About), รูปย่อผลงาน (Portfolio), รูปพรีวิว nav และ OG Image (Global) — กด **“อัปโหลด”** เลือกไฟล์ ระบบบีบอัดบนเครื่อง (WebP, resize อัตโนมัติ) แล้วเก็บใน Redis ผ่าน `/api/upload` (แสดงผลผ่าน `/api/image/<id>`) — หรือวาง URL ได้เหมือนเดิม
5. **Portfolio**: กด “เพิ่มผลงาน” → วางลิงก์ YouTube → ระบบ **ดึงชื่อ + รูปย่ออัตโนมัติ** (ผ่าน `/api/youtube` oEmbed) → ลากจัดเรียง / ปักหมุด ⭐ / ลบ (พร้อม confirm)
6. กด **“บันทึก”** → เขียนลง Redis → หน้าเว็บอัปเดตทันที (ทุกหน้าเป็น `force-dynamic` + `proxy.ts` บังคับ `Cache-Control: no-store` กัน CDN/เบราว์เซอร์ cache)

> **หมายเหตุ:** รูปที่อัปโหลดจะเก็บเป็น key `img:*` ใน Redis เดียวกันกับเนื้อหา — ฟรี 1MB/key ก็เพียงพอเพราะบีบอัดให้แล้ว (รูป OG ที่อัปโหลดใช้พรีวิวในแอดมินได้ แต่ social crawler อ่าน data-URI ไม่ได้ แนะนำให้ใช้ URL จริงถ้าอยากให้การ์ดโซเชียลสมบูรณ์)

ข้อมูลถูกเก็บเป็น JSON blob ตาม key: `site:home`, `site:about`, `site:portfolio`, `site:pricing`, `site:contact`, `site:nav`, `site:seo`

> **อัปเดตทันทีบน Vercel:** แก้แล้วกดบันทึก → เห็นผลบนเว็บทันทีโดยไม่ต้อง redeploy — **เงื่อนไขเดียวคือต้องเชื่อม Upstash Redis** (ตั้ง `UPSTASH_REDIS_REST_URL/TOKEN` หรือเชื่อมผ่าน Vercel Storage/Marketplace) ถ้าไม่ได้เชื่อม ระบบจะใช้ in-memory fallback ที่ **แต่ละ serverless instance แยกกัน** → บันทึกแล้วอาจไม่เห็นผลทันที (มี warning ใน log) — หลังเชื่อมแล้วสามารถรีเซ็ตเนื้อหาได้จากปุ่ม “รีเซ็ต” ใน admin

---

## ▲ Deploy บน Vercel

1. Push โปรเจกต์ขึ้น GitHub/GitLab → import ที่ [vercel.com/new](https://vercel.com/new)
2. ตั้งค่า Environment Variables (ทั้ง **Production** และ **Preview**):
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (จาก [upstash.com](https://upstash.com) — เลือก region ใกล้ผู้ใช้งาน)
   - `ADMIN_PASSWORD`, `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app`
   - `REACTBITS_LICENSE_KEY` (ถ้ามี)
3. Deploy — API routes ทั้งหมดใช้ **Node.js runtime** (Next.js 16 deprecate Edge runtime แล้ว) — ทุก route ใช้ Web Crypto / fetch / REST client จึงรันได้ทั้ง 2 แบบ

> **Auto-seed:** ตอนเชื่อม Upstash ครั้งแรก (Redis ว่าง) ระบบจะเขียนเนื้อหา default ทั้งหมดลง Redis อัตโนมัติในครั้งแรกที่เปิดเว็บ — เข้า `/admin` ได้เลย ไม่ต้องตั้งข้อมูลเองก่อน แล้วค่อยเปลี่ยนเนื้อหาตัวอย่าง (รูปโปรไฟล์, ผลงาน, ราคา) เป็นของจริง

---

## 🗂️ โครงสร้างโปรเจกต์

```
app/
├─ (site)/            # หน้าเว็บสาธารณะ + layout (Site Frame, Nav, Shader)
│  ├─ page.tsx        # Home
│  ├─ about/ portfolio/ pricing/ contact/
│  └─ not-found.tsx
├─ admin/             # หลังบ้าน (แยก layout — ไม่มี chrome ของเว็บ)
│  ├─ page.tsx        # guarded ด้วย session
│  └─ login/
├─ api/
│  ├─ content/        # GET/PUT/DELETE เนื้อหา (session-guarded, nodejs)
│  ├─ auth/           # login / check / logout
│  ├─ youtube/        # oEmbed proxy ดึง title + thumbnail
│  ├─ upload/         # POST รูป (session-guarded) → เก็บ Redis key img:*
│  └─ image/[key]/    # GET เสิร์ฟรูปที่อัปโหลด (public, cache ยาว)
├─ sitemap.ts robots.ts opengraph-image.tsx icon.svg
components/
├─ home/ about/ portfolio/ pricing/ contact/
├─ nav/ admin/
└─ flow-shader.tsx site-frame.tsx lenis-provider.tsx …
lib/
├─ types.ts defaults.ts (เนื้อหาภาษาไทยเริ่มต้น)
├─ store.ts (Upstash + fallback) content.ts auth.ts youtube.ts seo.ts
```

## 🧪 Checks

```bash
npm run typecheck   # tsc --noEmit
npm run build       # next build
```
