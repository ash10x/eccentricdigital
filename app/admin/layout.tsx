import AdminShell from "./components/AdminShell";

export const metadata = { title: "Admin — Eccentric Digital" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
