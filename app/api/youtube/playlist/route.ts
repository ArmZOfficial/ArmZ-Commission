import { NextRequest, NextResponse } from "next/server";
import { extractPlaylistId, fetchPlaylist } from "@/lib/youtube-playlist";

export const runtime = "nodejs";

/** GET /api/youtube/playlist?url=… → { playlistTitle, videos: [{ videoId, title, url, thumbnail }] } */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const playlistId = extractPlaylistId(url);
  if (!playlistId) {
    return NextResponse.json(
      {
        error:
          "ไม่พบลิงก์ Playlist ของ YouTube — ตรวจสอบว่า URL มี ?list=… เช่น https://www.youtube.com/playlist?list=PL…",
      },
      { status: 400 }
    );
  }

  try {
    const result = await fetchPlaylist(playlistId);
    if (!result.videos.length) {
      return NextResponse.json(
        {
          error:
            "ดึงข้อมูลคลิปไม่สำเร็จ — Playlist นี้อาจว่าง หรือเป็นแบบส่วนตัว/ไม่เปิดเผย (ต้องตั้งเป็น Public)",
        },
        { status: 502 }
      );
    }
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json(
      { error: msg || "ดึงข้อมูล Playlist ไม่สำเร็จ — ลองอีกครั้งในอีกสักครู่" },
      { status: 502 }
    );
  }
}
