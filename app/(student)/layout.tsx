import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import StudentNav from "@/components/layout/StudentNav";
import TopNavbar from "@/components/layout/TopNavbar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== "student") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-app transition-colors">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 z-50">
        <StudentNav student={session.user} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Sticky Header */}
        <TopNavbar role="student" user={session.user} />

        {/* Dynamic Page Content */}
        <main className="p-4 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
