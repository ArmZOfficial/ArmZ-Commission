import { Stack } from "./stack";
import type { AboutContent } from "@/lib/types";

/** ส่วนเนื้อหาของหน้า About (Polaroid / Skills / Experience / Education ถูกตัดออกตามคำขอ) */
export function AboutSections({ content }: { content: AboutContent }) {
  return (
    <>
      <Stack stack={content.stack} eyebrow={content.stackEyebrow} title={content.stackTitle} />
    </>
  );
}
