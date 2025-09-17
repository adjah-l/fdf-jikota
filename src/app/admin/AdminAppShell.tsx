import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";

export const AdminAppShell = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6 bg-background/50">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};