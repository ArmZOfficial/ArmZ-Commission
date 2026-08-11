import type { Metadata } from "next";
import { Hero19 } from "@/components/home/hero-19";
import { GenreMarquee } from "@/components/home/genre-marquee";
import { loadHome, loadSeo } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await loadSeo(), "/");
}

export default async function HomePage() {
  const home = await loadHome();

  return (
    <main id="main" tabIndex={-1} className="site-pad outline-none">
      <Hero19 content={home} />
      <GenreMarquee genres={home.genres ?? []} />
    </main>
  );
}
