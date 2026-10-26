import "../../components/student/student-animations.css";
import { StageProvider } from "../../lib/stage";
import { ProjectStoreProvider } from "../../lib/project-store";
import SupervisorSidebar from "../../components/SupervisorSidebar";
import SidebarShell from "../../components/SidebarShell";
import ThemeScript from "../../components/ThemeScript";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <StageProvider>
        <ProjectStoreProvider>
          <SidebarShell sidebar={<SupervisorSidebar />}>{children}</SidebarShell>
        </ProjectStoreProvider>
      </StageProvider>
    </>
  );
}