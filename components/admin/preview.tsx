"use client";

import { AboutSections } from "@/components/about/about-sections";
import { Profile5 } from "@/components/about/profile-5";
import { Contact6 } from "@/components/contact/contact-6";
import { GenreMarquee } from "@/components/home/genre-marquee";
import { Hero19 } from "@/components/home/hero-19";
import { AccordionGallery } from "@/components/portfolio/accordion-gallery";
import { GradientCarousel } from "@/components/portfolio/gradient-carousel";
import { Showcase4 } from "@/components/portfolio/showcase-4";
import { Pricing12 } from "@/components/pricing/pricing-12";
import type { ContentKey, NavItem, PortfolioItem, PortfolioPageContent, SeoContent } from "@/lib/types";

export type PreviewSection = "home" | "about" | "portfolio" | "pricing" | "contact" | "global";
export type PreviewDevice = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

/** Live preview — render คอมโพเนนต์จริงของเว็บด้วย draft state (อัปเดตทันทีที่พิมพ์) */
export function SectionPreview({
  section,
  draft,
  theme,
  device,
}: {
  section: PreviewSection;
  draft: Record<ContentKey, unknown>;
  theme: "dark" | "light";
  device: PreviewDevice;
}) {
  const home = draft["site:home"] as Parameters<typeof Hero19>[0]["content"];
  const about = draft["site:about"] as Parameters<typeof Profile5>[0]["content"];
  const portfolio = (draft["site:portfolio"] as PortfolioItem[]) ?? [];
  const portfolioPage = draft["site:portfolioPage"] as PortfolioPageContent;
  const pricing = draft["site:pricing"] as Parameters<typeof Pricing12>[0]["content"];
  const contact = draft["site:contact"] as Parameters<typeof Contact6>[0]["content"];
  const nav = (draft["site:nav"] as NavItem[]) ?? [];
  const seo = draft["site:seo"] as SeoContent;

  const featured = portfolio.filter((i) => i.featured).slice(0, 6);

  let node: React.ReactNode = null;
  switch (section) {
    case "home":
      node = (
        <>
          <Hero19 content={home} />
          <GenreMarquee genres={home?.genres ?? []} />
        </>
      );
      break;
    case "about":
      node = (
        <>
          <Profile5 content={about} />
          <AboutSections content={about} />
        </>
      );
      break;
    case "portfolio":
      node = (
        <>
          <div className="px-6 pt-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
              {portfolioPage?.eyebrow || "Portfolio"}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold">
              {portfolioPage?.titlePrefix || "ผลงาน"}{" "}
              <span className="italic text-accent">{portfolioPage?.titleHighlight || "ของผม"}</span>
            </h1>
            {portfolioPage?.intro && (
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{portfolioPage.intro}</p>
            )}
          </div>
          <div className="mt-10 space-y-20">
            {featured.length > 0 && (
              <GradientCarousel items={featured} eyebrow={portfolioPage?.featuredEyebrow} title={portfolioPage?.featuredTitle} />
            )}
            <Showcase4 items={portfolio} content={portfolioPage} />
            {portfolio.length > 0 && (
              <AccordionGallery
                items={portfolio.slice(0, 5)}
                defaultIndex={2}
                eyebrow={portfolioPage?.curatedEyebrow}
                title={portfolioPage?.curatedTitle}
              />
            )}
          </div>
        </>
      );
      break;
    case "pricing":
      node = <Pricing12 content={pricing} />;
      break;
    case "contact":
      node = <Contact6 content={contact} />;
      break;
    case "global":
      node = (
        <div className="mx-auto max-w-2xl space-y-8 px-6 pt-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Global</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">Nav + SEO</h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-semibold text-white/80">เมนูนำทาง</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {nav.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-semibold text-white/80">SEO</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-white/40">Title</dt>
                <dd className="truncate text-right text-white/80">{seo.title}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-white/40">Accent</dt>
                <dd className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: seo.accent || "var(--accent)" }} />
                  {seo.accent || "(ค่าเริ่มต้น)"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-white/40">Description</dt>
                <dd className="line-clamp-2 text-right text-white/80">{seo.description}</dd>
              </div>
            </dl>
          </div>
        </div>
      );
      break;
  }

  return (
    <div className={`${theme} min-h-full`} style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="mx-auto" style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}>
        <div className="pb-28">{node}</div>
      </div>
    </div>
  );
}
