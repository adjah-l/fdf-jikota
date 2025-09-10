import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { initMonitoring, AppErrorBoundary } from "@/lib/monitoring";
import { flags } from "@/config/flags";

// Existing pages
import Index from "./pages/Index";
import ProfilePage from "./pages/Profile";
import NeighborhoodsPage from "./pages/Neighborhoods";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { DashboardPage } from "./pages/Dashboard";
import { CommunityCarePage } from "./pages/CommunityCare";
import { GroupsPage } from "./pages/Groups";
import { AdminMatchingPage } from "./pages/admin/AdminMatching";
import { AdminDataPage } from "./pages/admin/AdminData";
import { AdminMessagingPage } from "./pages/admin/AdminMessaging";
import OrganizationsPage from "./pages/Organizations";
import CreateOrganizationPage from "./pages/CreateOrganization";

// New marketing pages (gated by enableNewMarketing flag)
import UseCases from "./pages/UseCases";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ForOrganizations from "./pages/ForOrganizations";

// New app shells (gated by flags)
import { MemberAppShell } from "./app/member/MemberAppShell";
import { AdminAppShell } from "./app/admin/AdminAppShell";

// Member pages
import MemberHome from "./app/member/pages/Home";
import MemberGroup from "./app/member/pages/Group";
import MemberCare from "./app/member/pages/Care";
import MemberMessages from "./app/member/pages/Messages";
import MemberProfile from "./app/member/pages/Profile";

// Admin pages
import AdminOverview from "./app/admin/pages/Overview";

// SMS pages
import SMSRespond from "./pages/SMSRespond";

// Initialize monitoring
initMonitoring();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* New Member App Shell (gated by enableMemberShell flag) */}
            {flags.enableMemberShell && (
              <Route path="/app/*" element={<MemberAppShell />}>
                <Route index element={<MemberHome />} />
                <Route path="group" element={<MemberGroup />} />
                <Route path="care" element={<MemberCare />} />
                <Route path="messages" element={<MemberMessages />} />
                <Route path="profile" element={<MemberProfile />} />
              </Route>
            )}

            {/* New Admin App Shell (gated by enableAdminShell flag) */}
            {flags.enableAdminShell && (
              <Route path="/admin2/*" element={<AdminAppShell />}>
                <Route index element={<AdminOverview />} />
                {/* TODO: Add remaining admin pages */}
              </Route>
            )}

            {/* New Marketing Pages (gated by enableNewMarketing flag) */}
            {flags.enableNewMarketing && (
              <>
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/for-organizations" element={<ForOrganizations />} />
              </>
            )}

            {/* Existing App Shell and Routes */}
            <Route path="/" element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/neighborhoods" element={<NeighborhoodsPage />} />
              <Route path="/care" element={<CommunityCarePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/matching" element={<AdminMatchingPage />} />
              <Route path="/admin/data" element={<AdminDataPage />} />
              <Route path="/admin/messaging" element={<AdminMessagingPage />} />
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/organizations/new" element={<CreateOrganizationPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Public routes outside AppShell */}
            <Route path="/welcome" element={<Index />} />
            <Route path="/sms-respond/:token" element={<SMSRespond />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Error boundary fallback component
const ErrorFallback = ({ error, resetError }: { error: unknown; resetError: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md p-6 text-center">
      <h1 className="text-2xl font-bold text-destructive mb-4">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-6">
        We're sorry, but something unexpected happened. Our team has been notified.
      </p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Wrap app with error boundary
const App = AppErrorBoundary(AppContent, {
  fallback: ErrorFallback,
});

export default App;
