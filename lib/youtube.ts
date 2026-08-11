/* ── YouTube helpers: แยก video id จาก URL + สร้าง URL thumbnail ── */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?.+?v=([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

export function youtubeThumbnail(id: string, quality: "maxresdefault" | "hqdefault" = "maxresdefault"): string {
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

export function thumbnailFromUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? youtubeThumbnail(id) : null;
}

/**
 * ใช้ thumbnail ที่ตั้งเองก่อน — ถ้าว่าง ให้ดึงจากลิงก์ YouTube อัตโนมัติ
 * (img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg)
 */
export function resolveThumbnail(thumbnail: string, youtubeUrl: string): string {
  if (thumbnail && thumbnail.trim()) return thumbnail;
  return thumbnailFromUrl(youtubeUrl) ?? "";
}

/** ตกหล่นเป็น hqdefault ถ้า video นั้นไม่มี maxresdefault */
export function thumbnailOnError(e: { currentTarget: HTMLImageElement }): void {
  const img = e.currentTarget;
  if (img.src.includes("maxresdefault")) {
    img.src = img.src.replace("maxresdefault", "hqdefault");
  }
}

export async function fetchYouTubeMeta(url: string): Promise<{
  title: string;
  thumbnailUrl: string;
  authorName: string;
} | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { next: { revalidate: 60 * 60 } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string; thumbnail_url?: string; author_name?: string };
    if (!data.title) return null;
    return {
      title: data.title,
      thumbnailUrl: data.thumbnail_url ?? youtubeThumbnail(extractYouTubeId(url) ?? "default"),
      authorName: data.author_name ?? "",
    };
  } catch {
    return null;
  }
}
