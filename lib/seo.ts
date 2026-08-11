import type { Metadata } from "next";
import type { SeoContent } from "./types";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function pageMetadata(seo: SeoContent, path: string, suffix?: string): Metadata {
  const title = suffix ? `${seo.title} — ${suffix}` : seo.title;
  const url = `${siteUrl()}${path}`;
  const images = seo.ogImage
    ? [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }]
    : [{ url: "/opengraph-image", width: 1200, height: 630, alt: seo.title }];

  return {
    title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: seo.description,
      url,
      siteName: seo.title,
      images,
      type: "website",
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seo.description,
      images,
    },
  };
}
