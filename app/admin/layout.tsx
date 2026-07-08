import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import AdminNav from "@/components/layout/AdminNav";
import TopNavbar from "@/components/layout/TopNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-app transition-colors">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 z-50">
        <AdminNav admin={session.user} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Sticky Header */}
        <TopNavbar role="admin" user={session.user} />

        {/* Dynamic Page Content */}
        <main className="p-4 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
