import { SiteFrame } from "@/components/site-frame";
import { FlowShader } from "@/components/flow-shader";
import { AmbientGlow } from "@/components/ambient-glow";
import { LenisProvider } from "@/components/lenis-provider";
import { SkipLink } from "@/components/skip-link";
import { Navigation8 } from "@/components/nav/navigation-8";
import { AccentInjector } from "@/components/accent-injector";
import { loadNav, loadSeo } from "@/lib/content";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, seo] = await Promise.all([loadNav(), loadSeo()]);

  return (
    <LenisProvider>
      <AccentInjector accent={seo.accent} />
      <SiteFrame />
      <FlowShader opacity={0.7} />
      <AmbientGlow />
      <SkipLink />
      {children}
      <Navigation8 items={nav} />
    </LenisProvider>
  );
}
