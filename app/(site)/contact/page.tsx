import type { Metadata } from "next";
import { Contact6 } from "@/components/contact/contact-6";
import { loadContact, loadSeo } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await loadSeo(), "/contact", "Contact");
}

export default async function ContactPage() {
  const contact = await loadContact();

  return (
    <main id="main" tabIndex={-1} className="site-pad outline-none">
      <Contact6 content={contact} />
    </main>
  );
}
