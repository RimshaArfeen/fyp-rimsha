import "../../components/student/student-animations.css";
import { StageProvider } from "../../lib/stage";
import { ProjectStoreProvider } from "../../lib/project-store";
import Sidebar from "../../components/PlusSidebar";
import SidebarShell from "../../components/SidebarShell";
import ThemeScript from "../../components/ThemeScript";
import { homeFor } from "../../lib/roles";
import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "student") redirect(homeFor(session.user.role));
  return (
    <>
      <ThemeScript />
      <StageProvider>
        <ProjectStoreProvider>
          <SidebarShell sidebar={<Sidebar userName={session.user.name ?? "" } role="student" />}>{children}</SidebarShell>
        </ProjectStoreProvider>
      </StageProvider>
    </>
  );
}

