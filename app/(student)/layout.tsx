import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import "../../components/student/student-animations.css";
import Sidebar from "../../components/student/Sidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");

  // Teachers shouldn't see the student area
if ((session.user as any).role !== "student") redirect("/teacher/dashboard");

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}