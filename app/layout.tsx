import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Kanit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { loadSeo } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/seo";

/* ── Typography: Display = geometric sans (Thai glyph, เท่แต่ไม่แข็ง) / Body = modern sans ── */
const display = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

const body = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-family",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadSeo();
  const base = pageMetadata(seo, "/");
  return { ...base, metadataBase: new URL(siteUrl()) };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070707" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="freebuff-theme" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
