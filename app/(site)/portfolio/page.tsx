import type { Metadata } from "next";
import { GradientCarousel } from "@/components/portfolio/gradient-carousel";
import { Showcase4 } from "@/components/portfolio/showcase-4";
import { AccordionGallery } from "@/components/portfolio/accordion-gallery";
import { loadPortfolio, loadPortfolioPage, loadSeo } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await loadSeo(), "/portfolio", "Portfolio");
}

export default async function PortfolioPage() {
  const [items, page] = await Promise.all([loadPortfolio(), loadPortfolioPage()]);
  const featured = items.filter((i) => i.featured).slice(0, 6);

  return (
    <main id="main" tabIndex={-1} className="site-pad outline-none">
      <div className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
          {page.eyebrow || "Portfolio"}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {page.titlePrefix || "ผลงาน"}{" "}
          <span className="text-glow italic text-accent">{page.titleHighlight || "ของผม"}</span>
        </h1>
        {page.intro && (
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{page.intro}</p>
        )}
      </div>

      <div className="mt-14 space-y-24">
        {featured.length > 0 && (
          <GradientCarousel items={featured} eyebrow={page.featuredEyebrow} title={page.featuredTitle} />
        )}
        <Showcase4 items={items} content={page} />
        {items.length > 0 && (
          <AccordionGallery
            items={items.slice(0, 5)}
            defaultIndex={2}
            eyebrow={page.curatedEyebrow}
            title={page.curatedTitle}
          />
        )}
      </div>
    </main>
  );
}
