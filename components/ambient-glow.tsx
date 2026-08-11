/* ── AmbientGlow — แสงฟุ้งๆ ละมุนรอบขอบจอ (โทนขาว-ดำ) ──
 * ชั้นแสงคงที่ อยู่หลังคอนเทนต์ทั้งหมด (z-index -1)
 * - โหมดมืด: แสงขาวอ่อนๆ ฟุ้งจากขอบจอ → รู้สึก "glow ฟุ้ง"
 * - โหมดสว่าง: ขาวบนพื้นขาว → มองไม่เห็น (ไม่มีผล)
 */
export function AmbientGlow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: -1 }}>
      {/* แสงบน */}
      <div
        className="absolute left-1/2 top-[-18%] h-[55vh] w-[80vw] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.09), transparent 72%)",
          filter: "blur(90px)",
        }}
      />
      {/* แสงซ้าย */}
      <div
        className="absolute left-[-14%] top-[26%] h-[65vh] w-[45vw] rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.07), transparent 72%)",
          filter: "blur(110px)",
        }}
      />
      {/* แสงขวา */}
      <div
        className="absolute bottom-[-12%] right-[-12%] h-[60vh] w-[42vw] rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 72%)",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
