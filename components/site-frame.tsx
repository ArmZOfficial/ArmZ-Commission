/** Site Frame — fixed rails บน/ซ้าย/ขวา พร้อมมุมโค้งด้านใน
 *  หมายเหตุ: ขนาดใช้ inline style (var(--frame-w)/var(--frame-r))
 *  เพื่อเลี่ยงบั๊ก Tailwind v4.1 กับ arbitrary value แบบ var()
 */
export function SiteFrame() {
  return (
    <>
      <div
        aria-hidden
        className="fixed left-0 right-0 top-0 z-40 border-b border-frame-border bg-frame backdrop-blur-md"
        style={{
          height: "var(--frame-w)",
          borderBottomLeftRadius: "var(--frame-r)",
          borderBottomRightRadius: "var(--frame-r)",
        }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 left-0 z-40 border-r border-frame-border bg-frame backdrop-blur-md"
        style={{
          width: "var(--frame-w)",
          top: "var(--frame-w)",
          borderTopRightRadius: "var(--frame-r)",
        }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 z-40 border-l border-frame-border bg-frame backdrop-blur-md"
        style={{
          width: "var(--frame-w)",
          top: "var(--frame-w)",
          borderTopLeftRadius: "var(--frame-r)",
        }}
      />
    </>
  );
}
