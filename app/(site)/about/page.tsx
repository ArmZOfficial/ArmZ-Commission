import type { Metadata } from "next";
import { Profile5 } from "@/components/about/profile-5";
import { AboutSections } from "@/components/about/about-sections";
import { loadAbout, loadSeo } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await loadSeo(), "/about", "About Me");
}

export default async function AboutPage() {
  const about = await loadAbout();

  return (
    <main id="main" tabIndex={-1} className="site-pad outline-none">
      <Profile5 content={about} />
      <AboutSections content={about} />
    </main>
  );
}
