import "../../components/student/student-animations.css";
import { StageProvider } from "../../lib/stage";
import { ProjectStoreProvider } from "../../lib/project-store";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import SidebarShell from "../../components/SidebarShell";
import ThemeScript from "../../components/ThemeScript";
import { SupervisorStoreProvider } from "../../lib/supervisor-store";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <StageProvider>
        <SupervisorStoreProvider>
          <SidebarShell sidebar={<SupervisorSidebar />}>{children}</SidebarShell>
        </SupervisorStoreProvider>
      </StageProvider>
    </>
  );
}
       