import "../../components/student/student-animations.css";
import { StageProvider } from "../../lib/stage";
import { ProjectStoreProvider } from "../../lib/project-store";
import Sidebar from "../../components/PlusSidebar";
import SidebarShell from "../../components/SidebarShell";
import ThemeScript from "../../components/ThemeScript";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <StageProvider>
        <ProjectStoreProvider>
          <SidebarShell sidebar={<Sidebar />}>{children}</SidebarShell>
        </ProjectStoreProvider>
      </StageProvider>
    </>
  );
}