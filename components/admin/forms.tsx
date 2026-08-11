"use client";

import { ImageInput } from "@/components/admin/image-input";
import {
  ArrayEditor,
  Field,
  NumberInput,
  TagInput,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/ui";
import type {
  AboutContent,
  ContactContent,
  HomeContent,
  NavItem,
  PortfolioPageContent,
  PricingContent,
  SeoContent,
} from "@/lib/types";

type FormProps<T> = { value: T; onChange: (v: T) => void };

/* ─────────────────────────────── Home ─────────────────────────────── */

export function HomeForm({ value, onChange }: FormProps<HomeContent>) {
  const set = (patch: Partial<HomeContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-5">
      <Field label="Eyebrow (badge บนหัว Hero)">
        <TextInput value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      </Field>

      <Field label="Headline" hint="1 บรรทัด = 1 บรรทัดของหัวข้อ (บรรทัดสุดท้ายจะแสดงเป็นตัวเอนสี accent)">
        <TextArea value={value.headline} onChange={(v) => set({ headline: v })} rows={3} />
      </Field>

      <Field label="ข้อความใต้หัวข้อ (Subheadline)">
        <TextArea value={value.subheadline} onChange={(v) => set({ subheadline: v })} rows={3} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="ปุ่มหลัก — ข้อความ">
          <TextInput value={value.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
        </Field>
        <Field label="ปุ่มหลัก — ลิงก์">
          <TextInput value={value.ctaHref} onChange={(v) => set({ ctaHref: v })} />
        </Field>
        <Field label="ปุ่มรอง — ข้อความ">
          <TextInput value={value.secondaryLabel} onChange={(v) => set({ secondaryLabel: v })} />
        </Field>
        <Field label="ปุ่มรอง — ลิงก์">
          <TextInput value={value.secondaryHref} onChange={(v) => set({ secondaryHref: v })} />
        </Field>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">พรีวิวแพ็กเกจ (invoice panel ด้านขวา)</h3>
        <ArrayEditor
          items={value.packages}
          onChange={(items) => set({ packages: items as HomeContent["packages"] })}
          makeNew={() => ({ name: "", price: "", note: "" })}
          addLabel="เพิ่มแพ็กเกจ"
          renderItem={(item, update, remove) => {
            const p = item as HomeContent["packages"][number];
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ชื่อ">
                    <TextInput value={p.name} onChange={(v) => update({ name: v })} />
                  </Field>
                  <Field label="ราคา (บาท)">
                    <TextInput value={p.price} onChange={(v) => update({ price: v })} />
                  </Field>
                </div>
                <Field label="หมายเหตุ (เช่น จำนวนแทร็ค)">
                  <TextInput value={p.note} onChange={(v) => update({ note: v })} />
                </Field>
                <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                  ลบรายการนี้
                </button>
              </div>
            );
          }}
        />
      </div>

      <Field label="แถบแนวเพลง (genre marquee ใต้ Hero)" hint="กด Enter หลังแต่ละชื่อ — ว่างทั้งหมด = ซ่อนแถบ">
        <TagInput value={value.genres ?? []} onChange={(v) => set({ genres: v })} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Invoice — ชื่อแพ็กเกจ (เช่น Package Full Mixing)">
          <TextInput value={value.invoiceEyebrow ?? ""} onChange={(v) => set({ invoiceEyebrow: v })} />
        </Field>
        <Field label="Invoice — ราคาเริ่มต้น (เช่น เริ่มต้นที่ ฿1,500)">
          <TextInput value={value.invoiceNote ?? ""} onChange={(v) => set({ invoiceNote: v })} />
        </Field>
        <Field label="Invoice — ข้อความปุ่ม (เช่น ดูแพ็กเกจทั้งหมด)">
          <TextInput value={value.invoiceCtaLabel ?? ""} onChange={(v) => set({ invoiceCtaLabel: v })} />
        </Field>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">การ์ดไฮไลต์ (parallax cards ใต้ Hero)</h3>
        <ArrayEditor
          items={value.highlights}
          onChange={(items) => set({ highlights: items as HomeContent["highlights"] })}
          makeNew={() => ({ tag: "", title: "", body: "" })}
          addLabel="เพิ่มการ์ดไฮไลต์"
          renderItem={(item, update, remove) => {
            const h = item as HomeContent["highlights"][number];
            return (
              <div className="space-y-3">
                <Field label="แท็ก (เช่น Mixing)">
                  <TextInput value={h.tag} onChange={(v) => update({ tag: v })} />
                </Field>
                <Field label="หัวข้อ">
                  <TextInput value={h.title} onChange={(v) => update({ title: v })} />
                </Field>
                <Field label="รายละเอียด">
                  <TextArea value={h.body} onChange={(v) => update({ body: v })} rows={2} />
                </Field>
                <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                  ลบรายการนี้
                </button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────── About ─────────────────────────────── */

export function AboutForm({ value, onChange }: FormProps<AboutContent>) {
  const set = (patch: Partial<AboutContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Field label="ชื่อ">
          <TextInput value={value.name} onChange={(v) => set({ name: v })} />
        </Field>
        <Field label="ตำแหน่ง/สายงาน">
          <TextInput value={value.role} onChange={(v) => set({ role: v })} />
        </Field>
        <Field label="สถานะ (เช่น เปิดรับงาน)">
          <TextInput value={value.availability} onChange={(v) => set({ availability: v })} />
        </Field>
      </div>

      <div className="space-y-3">
        <Field label="รูปโปรไฟล์" hint="อัปโหลด หรือวาง URL — รูปหลักของ Portrait Morph">
          <ImageInput value={value.portrait} onChange={(v) => set({ portrait: v })} maxSize={1200} />
        </Field>
        <Field label="รูป hover" hint="อัปโหลด หรือวาง URL — รูปที่สลับเมื่อเมาส์เลื่อนผ่าน">
          <ImageInput value={value.portraitHover} onChange={(v) => set({ portraitHover: v })} maxSize={1200} />
        </Field>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">แนะนำตัว (bio — 1 ช่อง = 1 ย่อหน้า)</h3>
        <ArrayEditor
          items={value.bio}
          onChange={(items) => set({ bio: items as string[] })}
          makeNew={() => ""}
          addLabel="เพิ่มย่อหน้า"
          renderItem={(item, update, remove) => (
            <div className="space-y-2">
              <TextArea value={item as string} onChange={update} rows={2} />
              <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                ลบย่อหน้านี้
              </button>
            </div>
          )}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">สถิติ (Stats)</h3>
        <ArrayEditor
          items={value.stats}
          onChange={(items) => set({ stats: items as AboutContent["stats"] })}
          makeNew={() => ({ label: "", value: "" })}
          addLabel="เพิ่มสถิติ"
          renderItem={(item, update, remove) => {
            const s = item as AboutContent["stats"][number];
            return (
              <div className="grid grid-cols-2 gap-3">
                <Field label="ตัวเลข (เช่น 100+)">
                  <TextInput value={s.value} onChange={(v) => update({ value: v })} />
                </Field>
                <Field label="คำอธิบาย">
                  <TextInput value={s.label} onChange={(v) => update({ label: v })} />
                </Field>
                <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                  ลบรายการนี้
                </button>
              </div>
            );
          }}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">ลิงก์โซเชียล (X / Discord)</h3>
        <ArrayEditor
          items={value.socials}
          onChange={(items) => set({ socials: items as AboutContent["socials"] })}
          makeNew={() => ({ id: `s-${Date.now()}`, label: "", url: "", username: "", copy: false })}
          addLabel="เพิ่มโซเชียล"
          renderItem={(item, update, remove) => {
            const s = item as AboutContent["socials"][number];
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ชื่อช่องทาง">
                    <TextInput value={s.label} onChange={(v) => update({ label: v })} />
                  </Field>
                  <Field label="Username">
                    <TextInput value={s.username} onChange={(v) => update({ username: v })} />
                  </Field>
                </div>
                <Field label="URL (ถ้าเป็นปุ่มคัดลอก ปล่อยว่างได้)">
                  <TextInput value={s.url} onChange={(v) => update({ url: v })} />
                </Field>
                <Toggle
                  checked={!!s.copy}
                  onChange={(v) => update({ copy: v })}
                  label="ปุ่มนี้คัดลอก username แทนการเปิดลิงก์"
                />
                <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                  ลบรายการนี้
                </button>
              </div>
            );
          }}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">แท็บเนื้อหา (อุปกรณ์ / โปรแกรม / ปลั๊กอิน)</h3>
        <ArrayEditor
          items={value.tabs}
          onChange={(items) => set({ tabs: items as AboutContent["tabs"] })}
          makeNew={() => ({ id: `tab-${Date.now()}`, label: "", items: [] })}
          addLabel="เพิ่มแท็บ"
          renderItem={(item, update, remove) => {
            const t = item as AboutContent["tabs"][number];
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ID (ภาษาอังกฤษ)">
                    <TextInput value={t.id} onChange={(v) => update({ id: v })} />
                  </Field>
                  <Field label="ชื่อแท็บ">
                    <TextInput value={t.label} onChange={(v) => update({ label: v })} />
                  </Field>
                </div>
                <ArrayEditor
                  items={t.items}
                  onChange={(items) => update({ items: items as AboutContent["tabs"][number]["items"] })}
                  makeNew={() => ({ label: "", detail: "", href: "" })}
                  addLabel="เพิ่มรายการในแท็บ"
                  renderItem={(row, rowUpdate, rowRemove) => {
                    const r = row as AboutContent["tabs"][number]["items"][number];
                    return (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="ชื่อ">
                            <TextInput value={r.label} onChange={(v) => rowUpdate({ label: v })} />
                          </Field>
                          <Field label="รายละเอียด">
                            <TextInput value={r.detail} onChange={(v) => rowUpdate({ detail: v })} />
                          </Field>
                        </div>
                        <Field label="ลิงก์ (ปล่อยว่างได้)">
                          <TextInput value={r.href ?? ""} onChange={(v) => rowUpdate({ href: v })} />
                        </Field>
                        <button type="button" onClick={rowRemove} className="text-xs text-red-400 hover:underline">
                          ลบรายการนี้
                        </button>
                      </div>
                    );
                  }}
                />
                <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                  ลบแท็บนี้
                </button>
              </div>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stack — badge (เช่น Stack)">
          <TextInput value={value.stackEyebrow ?? ""} onChange={(v) => set({ stackEyebrow: v })} />
        </Field>
        <Field label="Stack — หัวข้อส่วน (เช่น เครื่องมือที่ใช้)">
          <TextInput value={value.stackTitle ?? ""} onChange={(v) => set({ stackTitle: v })} />
        </Field>
      </div>

      <Field label="Stack (เครื่องมือ/โปรแกรม)">
        <TagInput value={value.stack} onChange={(v) => set({ stack: v })} />
      </Field>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">หัวข้อหน้า About</h3>
        <div className="space-y-3">
          <Field label="Eyebrow (เช่น About Me)">
            <TextInput
              value={value.section?.eyebrow ?? ""}
              onChange={(v) => set({ section: { ...(value.section ?? { titlePrefix: "", titleHighlight: "", titleSuffix: "" }), eyebrow: v } })}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="ข้อความนำ">
              <TextInput
                value={value.section?.titlePrefix ?? ""}
                onChange={(v) => set({ section: { ...(value.section ?? { eyebrow: "", titleHighlight: "", titleSuffix: "" }), titlePrefix: v } })}
              />
            </Field>
            <Field label="คำเน้น (ตัวเอน)">
              <TextInput
                value={value.section?.titleHighlight ?? ""}
                onChange={(v) => set({ section: { ...(value.section ?? { eyebrow: "", titlePrefix: "", titleSuffix: "" }), titleHighlight: v } })}
              />
            </Field>
            <Field label="ข้อความตาม">
              <TextInput
                value={value.section?.titleSuffix ?? ""}
                onChange={(v) => set({ section: { ...(value.section ?? { eyebrow: "", titlePrefix: "", titleHighlight: "" }), titleSuffix: v } })}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Portfolio page ─────────────────────────────── */

export function PortfolioPageForm({ value, onChange }: FormProps<PortfolioPageContent>) {
  const set = (patch: Partial<PortfolioPageContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-5">
      <Field label="Eyebrow (เช่น Portfolio)">
        <TextInput value={value.eyebrow ?? ""} onChange={(v) => set({ eyebrow: v })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="หัวข้อ — ข้อความนำ">
          <TextInput value={value.titlePrefix ?? ""} onChange={(v) => set({ titlePrefix: v })} />
        </Field>
        <Field label="หัวข้อ — คำเน้น (ตัวเอน)">
          <TextInput value={value.titleHighlight ?? ""} onChange={(v) => set({ titleHighlight: v })} />
        </Field>
      </div>
      <Field label="คำอธิบายใต้หัวข้อ (intro)">
        <TextArea value={value.intro ?? ""} onChange={(v) => set({ intro: v })} rows={2} />
      </Field>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-bold text-white/80">Carousel "ผลงานเด่น" (Featured Works)</h3>
        <div className="space-y-3">
          <Field label="Eyebrow">
            <TextInput value={value.featuredEyebrow ?? ""} onChange={(v) => set({ featuredEyebrow: v })} />
          </Field>
          <Field label="หัวข้อ">
            <TextInput value={value.featuredTitle ?? ""} onChange={(v) => set({ featuredTitle: v })} />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-bold text-white/80">แถบ "คัดมาให้ชม" (Curated Picks)</h3>
        <div className="space-y-3">
          <Field label="Eyebrow">
            <TextInput value={value.curatedEyebrow ?? ""} onChange={(v) => set({ curatedEyebrow: v })} />
          </Field>
          <Field label="หัวข้อ">
            <TextInput value={value.curatedTitle ?? ""} onChange={(v) => set({ curatedTitle: v })} />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-bold text-white/80">กริด "ผลงานทั้งหมด" (Showcase 4)</h3>
        <div className="space-y-3">
          <Field label="Eyebrow">
            <TextInput value={value.gridEyebrow ?? ""} onChange={(v) => set({ gridEyebrow: v })} />
          </Field>
          <Field label="หัวข้อกริด">
            <TextInput value={value.gridTitle ?? ""} onChange={(v) => set({ gridTitle: v })} />
          </Field>
          <Field label="คำอธิบายใต้หัวกริด">
            <TextArea value={value.gridIntro ?? ""} onChange={(v) => set({ gridIntro: v })} rows={2} />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Pricing ─────────────────────────────── */

export function PricingForm({ value, onChange }: FormProps<PricingContent>) {
  const set = (patch: Partial<PricingContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-5">
      <Field label="Eyebrow">
        <TextInput value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      </Field>
      <Field label="หัวข้อ">
        <TextInput value={value.headline} onChange={(v) => set({ headline: v })} />
      </Field>
      <Field label="ข้อความใต้หัวข้อ">
        <TextArea value={value.subheadline} onChange={(v) => set({ subheadline: v })} rows={2} />
      </Field>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">4 แพ็กเกจ</h3>
        <ArrayEditor
          items={value.packages}
          onChange={(items) => set({ packages: items as PricingContent["packages"] })}
          makeNew={() => ({
            id: `pkg-${Date.now()}`,
            name: "",
            requirements: "",
            price: 0,
            priceLabel: "เริ่มต้น",
            features: [],
            popular: false,
          })}
          addLabel="เพิ่มแพ็กเกจ"
          renderItem={(item, update, remove) => {
            const p = item as PricingContent["packages"][number];
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="ชื่อแพ็กเกจ">
                    <TextInput value={p.name} onChange={(v) => update({ name: v })} />
                  </Field>
                  <Field label="ราคา (บาท/เพลง)">
                    <NumberInput value={p.price} onChange={(v) => update({ price: v })} />
                  </Field>
                </div>
                <Field label="ข้อกำหนด (จำนวนแทร็ค / คนร้อง)">
                  <TextInput value={p.requirements} onChange={(v) => update({ requirements: v })} />
                </Field>
                <Field label="ป้ายราคา (เช่น เริ่มต้น)">
                  <TextInput value={p.priceLabel} onChange={(v) => update({ priceLabel: v })} />
                </Field>
                <Field label="คุณสมบัติ (tag)">
                  <TagInput value={p.features} onChange={(v) => update({ features: v })} />
                </Field>
                <div className="flex items-center justify-between">
                  <Toggle checked={!!p.popular} onChange={(v) => update({ popular: v })} label="แพ็กเกจยอดนิยม" />
                  <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                    ลบแพ็กเกจนี้
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">เงื่อนไขเพิ่มเติม (rush / commercial)</h3>
        <ArrayEditor
          items={value.notes}
          onChange={(items) => set({ notes: items as PricingContent["notes"] })}
          makeNew={() => ({ title: "", detail: "" })}
          addLabel="เพิ่มเงื่อนไข"
          renderItem={(item, update, remove) => {
            const n = item as PricingContent["notes"][number];
            return (
              <div className="space-y-3">
                <Field label="ชื่อเงื่อนไข">
                  <TextInput value={n.title} onChange={(v) => update({ title: v })} />
                </Field>
                <Field label="รายละเอียด">
                  <TextInput value={n.detail} onChange={(v) => update({ detail: v })} />
                </Field>
                <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                  ลบรายการนี้
                </button>
              </div>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="ปุ่ม CTA — ข้อความ">
          <TextInput value={value.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
        </Field>
        <Field label="ปุ่ม CTA — ลิงก์ (เช่น /contact หรือ Discord)">
          <TextInput value={value.ctaHref} onChange={(v) => set({ ctaHref: v })} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="ป้ายแพ็กเกจยอดนิยม">
          <TextInput value={value.popularLabel ?? ""} onChange={(v) => set({ popularLabel: v })} />
        </Field>
        <Field label="หน่วยราคา (เช่น บาท)">
          <TextInput value={value.priceUnit ?? ""} onChange={(v) => set({ priceUnit: v })} />
        </Field>
      </div>
      <Field label="ข้อความท้ายหน้า (footer note)">
        <TextArea value={value.footerNote ?? ""} onChange={(v) => set({ footerNote: v })} rows={2} />
      </Field>
    </div>
  );
}

/* ─────────────────────────────── Contact ─────────────────────────────── */

export function ContactForm({ value, onChange }: FormProps<ContactContent>) {
  const set = (patch: Partial<ContactContent>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-5">
      <Field label="โลโก้ในวงกลม" hint="อัปโหลดหรือวาง URL — ปล่อยว่าง = แสดงตัวอักษร AZ">
        <ImageInput value={value.logoImage ?? ""} onChange={(v) => set({ logoImage: v })} maxSize={600} />
      </Field>

      <Field label="Eyebrow">
        <TextInput value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      </Field>
      <Field label="หัวข้อ">
        <TextInput value={value.headline} onChange={(v) => set({ headline: v })} />
      </Field>
      <Field label="ข้อความใต้หัวข้อ">
        <TextArea value={value.subheadline} onChange={(v) => set({ subheadline: v })} rows={2} />
      </Field>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-bold text-white/80">X (Twitter)</h3>
        <div className="space-y-3">
          <Field label="ชื่อช่องทาง">
            <TextInput value={value.x.label} onChange={(v) => set({ x: { ...value.x, label: v } })} />
          </Field>
          <Field label="URL">
            <TextInput value={value.x.url} onChange={(v) => set({ x: { ...value.x, url: v } })} />
          </Field>
          <Field label="Username ที่แสดง">
            <TextInput value={value.x.username} onChange={(v) => set({ x: { ...value.x, username: v } })} />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-bold text-white/80">Discord</h3>
        <div className="space-y-3">
          <Field label="ชื่อช่องทาง">
            <TextInput
              value={value.discord.label}
              onChange={(v) => set({ discord: { ...value.discord, label: v } })}
            />
          </Field>
          <Field label="Username">
            <TextInput
              value={value.discord.username}
              onChange={(v) => set({ discord: { ...value.discord, username: v } })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ข้อความปุ่มคัดลอก">
              <TextInput
                value={value.discord.copyLabel}
                onChange={(v) => set({ discord: { ...value.discord, copyLabel: v } })}
              />
            </Field>
            <Field label="ข้อความเมื่อคัดลอกแล้ว">
              <TextInput
                value={value.discord.copiedLabel}
                onChange={(v) => set({ discord: { ...value.discord, copiedLabel: v } })}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA ด้านล่าง — ข้อความ">
          <TextInput value={value.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
        </Field>
        <Field label="CTA ด้านล่าง — ข้อความย่อย">
          <TextInput value={value.ctaSub} onChange={(v) => set({ ctaSub: v })} />
        </Field>
        <Field label="CTA ด้านล่าง — ข้อความปุ่ม">
          <TextInput value={value.ctaButtonLabel ?? ""} onChange={(v) => set({ ctaButtonLabel: v })} />
        </Field>
        <Field label="CTA ด้านล่าง — ลิงก์ปุ่ม">
          <TextInput value={value.ctaHref ?? ""} onChange={(v) => set({ ctaHref: v })} />
        </Field>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Global (nav + SEO) ─────────────────────────────── */

const ACCENT_PRESETS = ["", "#ffffff", "#0a0a0a", "#e5e5e5", "#9ca3af", "#525252", "#171717"];

export function GlobalForm({
  nav,
  seo,
  onNavChange,
  onSeoChange,
}: {
  nav: NavItem[];
  seo: SeoContent;
  onNavChange: (v: NavItem[]) => void;
  onSeoChange: (v: SeoContent) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-bold text-white/80">เมนูนำทาง (Nav — 5 เมนู)</h3>
        <p className="mb-3 text-xs text-white/40">
          แก้ label / ลิงก์ / รูปพรีวิวบน hover ได้ และเลื่อนเพื่อจัดลำดับ
        </p>
        <ArrayEditor
          items={nav}
          onChange={(items) => onNavChange(items as NavItem[])}
          makeNew={() => ({ id: `nav-${Date.now()}`, label: "", href: "/", image: "" })}
          addLabel="เพิ่มเมนู"
          renderItem={(item, update, remove) => {
            const n = item as NavItem;
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Label">
                    <TextInput value={n.label} onChange={(v) => update({ label: v })} />
                  </Field>
                  <Field label="ลิงก์ (path)">
                    <TextInput value={n.href} onChange={(v) => update({ href: v })} />
                  </Field>
                </div>
                <Field label="รูปพรีวิวบน hover (อัปโหลดหรือวาง URL — ปล่อยว่างได้)">
                  <ImageInput value={n.image ?? ""} onChange={(v) => update({ image: v })} maxSize={800} />
                </Field>
                <button type="button" onClick={remove} className="text-xs text-red-400 hover:underline">
                  ลบเมนูนี้
                </button>
              </div>
            );
          }}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-bold text-white/80">SEO</h3>
        <div className="space-y-3">
          <Field label="Title">
            <TextInput value={seo.title} onChange={(v) => onSeoChange({ ...seo, title: v })} />
          </Field>
          <Field label="Description">
            <TextArea value={seo.description} onChange={(v) => onSeoChange({ ...seo, description: v })} rows={2} />
          </Field>
          <Field label="Keywords (คั่นด้วยเครื่องหมายจุลภาค)">
            <TextInput value={seo.keywords} onChange={(v) => onSeoChange({ ...seo, keywords: v })} />
          </Field>
          <Field label="OG Image" hint="อัปโหลดหรือวาง URL — ปล่อยว่าง = ใช้ภาพอัตโนมัติ">
            <ImageInput value={seo.ogImage} onChange={(v) => onSeoChange({ ...seo, ogImage: v })} maxSize={1200} />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h3 className="mb-3 text-sm font-bold text-white/80">สี Accent (ธีมสี token-driven)</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {ACCENT_PRESETS.map((c) =>
            c === "" ? (
              <button
                key="default"
                type="button"
                onClick={() => onSeoChange({ ...seo, accent: "" })}
                title="ใช้ค่าจาก CSS เริ่มต้น"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/60 transition-colors ${
                  seo.accent === "" ? "ring-2 ring-white" : ""
                }`}
              >
                D
              </button>
            ) : (
              <button
                key={c}
                type="button"
                onClick={() => onSeoChange({ ...seo, accent: c })}
                aria-label={`เลือกสี ${c}`}
                className={`h-9 w-9 rounded-full transition-transform hover:scale-110 ${
                  seo.accent === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]" : ""
                }`}
                style={{ background: c }}
              />
            )
          )}
        </div>
        <p className="mt-3 text-xs text-white/40">เลือกสีแล้วกดบันทึก — ทั้งเว็บจะเปลี่ยนตาม token นี้</p>
      </div>
    </div>
  );
}
