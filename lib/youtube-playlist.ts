/* ── YouTube Playlist: ดึงรายชื่อวิดีโอทั้งหมดจากลิงก์ Playlist (ไม่ต้องใช้ API key) ──
 *
 * วิธีทำงาน: ดึง HTML ของหน้า playlist → แยก JSON `ytInitialData` → อ่านวิดีโอ
 * ทั้งหมด (1 หน้า = ~100 คลิป) แล้วตาม continuation ต่อจนครบทุกคลิป (จำกัดที่ MAX_VIDEOS)
 *
 * หมายเหตุ: YouTube เปลี่ยนโครงสร้าง HTML แล้ว — ตอนนี้รายการวิดีโอในหน้า playlist
 * อยู่ใน `lockupViewModel` (เดิมเป็น `playlistVideoRenderer`) เราเลยรองรับทั้ง 2 แบบ
 */
import { youtubeThumbnail } from "@/lib/youtube";

export interface PlaylistVideo {
  videoId: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface PlaylistResult {
  playlistTitle: string;
  videos: PlaylistVideo[];
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const MAX_PAGES = 5; // ~100 คลิป/หน้า → สูงสุด ~500 คลิป
const MAX_VIDEOS = 500;
const FETCH_TIMEOUT_MS = 15000;

/** แยก playlist id จาก URL เช่น youtube.com/playlist?list=… หรือ watch?v=…&list=… */
export function extractPlaylistId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!/youtube\.com|youtu\.be/i.test(trimmed)) return null;
  const m = trimmed.match(/[?&]list=([\w-]{13,})/);
  return m ? m[1] : null;
}

function textOf(node: unknown): string {
  if (typeof node === "string") return node;
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (typeof n.simpleText === "string") return n.simpleText;
  if (Array.isArray(n.runs)) {
    return n.runs
      .map((r) => (r && typeof r === "object" ? String((r as Record<string, unknown>).text ?? "") : ""))
      .join("");
  }
  return "";
}

/** ค้นหาค่า key ทุกตำแหน่งใน tree (JSON จาก YouTube ไม่มี circular ref) */
function deepFind(node: unknown, key: string, out: unknown[] = []): unknown[] {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    for (const item of node) deepFind(item, key, out);
    return out;
  }
  const obj = node as Record<string, unknown>;
  if (key in obj) out.push(obj[key]);
  for (const v of Object.values(obj)) deepFind(v, key, out);
  return out;
}

/** โครงสร้างเก่า: playlistVideoRenderer */
function videoFromRenderer(renderer: unknown): PlaylistVideo | null {
  if (!renderer || typeof renderer !== "object") return null;
  const r = renderer as Record<string, unknown>;
  const videoId = typeof r.videoId === "string" ? r.videoId : "";
  if (!videoId) return null;

  const title = textOf(r.title) || "(ไม่มีชื่อ)";
  const thumbs = (r.thumbnail as { thumbnails?: { url?: string }[] | undefined } | undefined)?.thumbnails;
  const thumb =
    Array.isArray(thumbs) && thumbs.length && thumbs[thumbs.length - 1]?.url
      ? thumbs[thumbs.length - 1].url!
      : youtubeThumbnail(videoId);

  return {
    videoId,
    title,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail: thumb.startsWith("//") ? `https:${thumb}` : thumb,
  };
}

/** โครงสร้างใหม่ (2025+): lockupViewModel — ใช้ในหน้า playlist ปัจจุบัน */
function videoFromLockup(lockup: unknown): PlaylistVideo | null {
  if (!lockup || typeof lockup !== "object") return null;
  const l = lockup as Record<string, unknown>;
  if (l.contentType !== "LOCKUP_CONTENT_TYPE_VIDEO") return null;
  const videoId = typeof l.contentId === "string" && /^[\w-]{11}$/.test(l.contentId) ? l.contentId : "";
  if (!videoId) return null;

  const meta = l.metadata as
    | { lockupMetadataViewModel?: { title?: { content?: unknown } } }
    | undefined;
  const titleRaw = meta?.lockupMetadataViewModel?.title?.content;
  const title = typeof titleRaw === "string" && titleRaw.trim() ? titleRaw : "(ไม่มีชื่อ)";

  // ใช้รูปย่อจริงจาก YouTube (ภาพใหญ่สุด) — ตัด query param ออก
  let thumb = "";
  const img = (
    l.contentImage as
      | { thumbnailViewModel?: { image?: { sources?: { url?: string }[] } } }
      | undefined
  )?.thumbnailViewModel?.image?.sources;
  if (Array.isArray(img) && img.length) {
    const last = img[img.length - 1]?.url;
    if (last) thumb = last.split("?")[0];
  }

  return {
    videoId,
    title,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail: thumb || youtubeThumbnail(videoId),
  };
}

function parseInitialData(html: string): Record<string, unknown> | null {
  const marker = "var ytInitialData = ";
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const jsonStart = start + marker.length;
  const end = html.indexOf(";</script>", jsonStart);
  if (end === -1) return null;
  try {
    return JSON.parse(html.slice(jsonStart, end)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
}

/** หน้าแรกของ playlist — คืน HTML */
async function fetchPlaylistHtml(playlistId: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(
      `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}&hl=en`,
      {
        headers: {
          "User-Agent": UA,
          "Accept-Language": "en-US,en;q=0.9",
          Accept: "text/html,application/xhtml+xml",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** หน้าถัดไป (มากกว่า 100 คลิป) ผ่าน continuation token */
async function fetchContinuationPage(token: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetchWithTimeout("https://www.youtube.com/youtubei/v1/browse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": UA,
        "Accept-Language": "en-US,en;q=0.9",
      },
      body: JSON.stringify({
        context: { client: { clientName: "WEB", clientVersion: "2.20250101.00.00" } },
        continuation: token,
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function continuationTokenFromPage(node: unknown): string | null {
  // โครงสร้างใหม่: continuationItemViewModel → continuationCommand.innertubeCommand.continuationCommand.token
  const items = deepFind(node, "continuationItemViewModel") as Record<string, unknown>[];
  for (const r of items) {
    const t = (
      r as {
        continuationCommand?: {
          innertubeCommand?: { continuationCommand?: { token?: unknown } };
        };
      }
    )?.continuationCommand?.innertubeCommand?.continuationCommand?.token;
    if (typeof t === "string") return t;
  }
  // โครงสร้างเก่า: nextContinuationData / continuationItemRenderer
  const next = deepFind(node, "nextContinuationData") as Record<string, unknown>[];
  for (const n of next) {
    if (typeof n?.continuation === "string") return n.continuation;
  }
  const oldItems = deepFind(node, "continuationItemRenderer") as Record<string, unknown>[];
  for (const r of oldItems) {
    const t = (r as { continuationEndpoint?: { continuationCommand?: { token?: unknown } } })
      ?.continuationEndpoint?.continuationCommand?.token;
    if (typeof t === "string") return t;
  }
  return null;
}

/** ดึงทุกคลิปใน playlist (สูงสุด MAX_VIDEOS) */
export async function fetchPlaylist(playlistId: string): Promise<PlaylistResult> {
  const html = await fetchPlaylistHtml(playlistId);
  if (!html) {
    throw new Error("ดึงหน้า Playlist ไม่สำเร็จ — YouTube อาจบล็อกการเข้าถึงชั่วคราว ลองอีกครั้งในอีกสักครู่");
  }

  const data = parseInitialData(html);
  if (!data) {
    throw new Error("อ่านข้อมูล Playlist ไม่สำเร็จ — ลิงก์นี้อาจไม่ใช่ Playlist ที่เปิดสาธารณะ");
  }

  let playlistTitle = "";
  const meta = deepFind(data, "playlistMetadataRenderer") as Record<string, unknown>[];
  if (meta.length) playlistTitle = textOf((meta[0] as Record<string, unknown>).title) || "";

  const videos: PlaylistVideo[] = [];
  const seen = new Set<string>();
  const addVideos = (node: unknown) => {
    const renderers = deepFind(node, "playlistVideoRenderer");
    for (const r of renderers) {
      if (videos.length >= MAX_VIDEOS) return;
      const v = videoFromRenderer(r);
      if (!v || seen.has(v.videoId)) continue;
      seen.add(v.videoId);
      videos.push(v);
    }
    const lockups = deepFind(node, "lockupViewModel");
    for (const l of lockups) {
      if (videos.length >= MAX_VIDEOS) return;
      const v = videoFromLockup(l);
      if (!v || seen.has(v.videoId)) continue;
      seen.add(v.videoId);
      videos.push(v);
    }
  };

  addVideos(data);

  let token = continuationTokenFromPage(data);
  let pages = 1;
  while (token && pages < MAX_PAGES && videos.length < MAX_VIDEOS) {
    const page = await fetchContinuationPage(token);
    if (!page) break;
    addVideos(page);
    token = continuationTokenFromPage(page);
    pages++;
  }

  return { playlistTitle: playlistTitle || "Playlist", videos };
}
