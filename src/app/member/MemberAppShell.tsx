import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MemberSidebar } from "./components/MemberSidebar";
import { MemberHeader } from "./components/MemberHeader";

export const MemberAppShell = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <MemberSidebar />
          <div className="flex-1 flex flex-col">
            <MemberHeader />
            <main className="flex-1 p-6 bg-background/50">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};