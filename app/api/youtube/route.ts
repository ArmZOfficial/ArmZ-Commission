import { NextRequest, NextResponse } from "next/server";
import { fetchYouTubeMeta, thumbnailFromUrl } from "@/lib/youtube";

export const runtime = "nodejs";

/** GET /api/youtube?url=… → { title, thumbnailUrl, authorName } ผ่าน oEmbed */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  // fallback: thumbnail จาก video id ทันที (ไม่ต้องพึ่ง oEmbed)
  const fallbackThumb = thumbnailFromUrl(url);

  const meta = await fetchYouTubeMeta(url);
  if (!meta) {
    if (fallbackThumb) {
      return NextResponse.json({ title: "", thumbnailUrl: fallbackThumb, authorName: "" });
    }
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  return NextResponse.json({
    title: meta.title,
    thumbnailUrl: meta.thumbnailUrl || fallbackThumb,
    authorName: meta.authorName,
  });
}
