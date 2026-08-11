import type { Metadata } from "next";
import { Pricing12 } from "@/components/pricing/pricing-12";
import { loadPricing, loadSeo } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await loadSeo(), "/pricing", "Pricing");
}

export default async function PricingPage() {
  const pricing = await loadPricing();

  return (
    <main id="main" tabIndex={-1} className="site-pad outline-none">
      <Pricing12 content={pricing} />
    </main>
  );
}
