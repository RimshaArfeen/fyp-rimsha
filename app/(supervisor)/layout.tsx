import "../../components/student/student-animations.css";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { homeFor } from "../../lib/roles";
import { StageProvider } from "../../lib/stage";
import { SupervisorStoreProvider } from "../../lib/supervisor-store";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import SidebarShell from "../../components/SidebarShell";
import ThemeScript from "../../components/ThemeScript";

export default async function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "teacher") redirect(homeFor(session.user.role));

  return (
    <>
      <ThemeScript />
      <StageProvider>
        <SupervisorStoreProvider>
          <SidebarShell
            sidebar={<SupervisorSidebar />}
          >
            {children}
          </SidebarShell>        </SupervisorStoreProvider>
      </StageProvider>
    </>
  );
}