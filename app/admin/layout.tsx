export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // แยกจาก layout หลักของเว็บ — ไม่มี Site Frame / Nav / Flow Shader
  return (
    <div className="dark" style={{ colorScheme: "dark" }}>
      {children}
    </div>
  );
}
