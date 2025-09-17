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
import HomeNew from "./pages/HomeNew";
import HomePremium from "./pages/HomePremium";
import PremiumPricing from "./pages/PremiumPricing";
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
import Partners from "./pages/Partners";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// New app shells (gated by flags)
import { MemberAppShell } from "./app/member/MemberAppShell";
import { AdminAppShell } from "./app/admin/AdminAppShell";

// Member pages
import MemberHome from "./app/member/pages/Home";
import MemberGroup from "./app/member/pages/Group";
import CareEnhanced from "./app/member/pages/CareEnhanced";
import MemberMessages from "./app/member/pages/Messages";
import MemberProfile from "./app/member/pages/Profile";

// Admin pages
import AdminOverview from "./app/admin/pages/Overview";
import AdminGroups from "./app/admin/pages/Groups";
import AdminGroupForm from "./app/admin/pages/GroupForm";

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
                <Route path="care" element={<CareEnhanced />} />
                <Route path="messages" element={<MemberMessages />} />
                <Route path="profile" element={<MemberProfile />} />
              </Route>
            )}

            {/* New Admin App Shell (gated by enableAdminShell flag) */}
            {flags.enableAdminShell && (
              <Route path="/admin2/*" element={<AdminAppShell />}>
                <Route index element={<AdminOverview />} />
                <Route path="groups" element={<AdminGroups />} />
                <Route path="groups/new" element={<AdminGroupForm />} />
                <Route path="groups/:id/edit" element={<AdminGroupForm />} />
              </Route>
            )}

            {/* New Marketing Pages (gated by enableNewMarketing flag) */}
            {flags.enableNewMarketing && (
              <>
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/pricing" element={<PremiumPricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/for-organizations" element={<ForOrganizations />} />
                <Route path="/partners" element={<Partners />} />
              </>
            )}

            {/* Root route - Premium Homepage */}
            <Route path="/" element={<HomePremium />} />
            
            {/* Legacy app routes */}
            <Route path="/groups" element={<AppShell />}>
              <Route index element={<GroupsPage />} />
            </Route>
            <Route path="/neighborhoods" element={<AppShell />}>
              <Route index element={<NeighborhoodsPage />} />
            </Route>
            <Route path="/care" element={<AppShell />}>
              <Route index element={<CommunityCarePage />} />
            </Route>
            <Route path="/profile" element={<AppShell />}>
              <Route index element={<ProfilePage />} />
            </Route>
            <Route path="/admin" element={<AppShell />}>
              <Route index element={<AdminDashboard />} />
            </Route>
            <Route path="/admin/matching" element={<AppShell />}>
              <Route index element={<AdminMatchingPage />} />
            </Route>
            <Route path="/admin/data" element={<AppShell />}>
              <Route index element={<AdminDataPage />} />
            </Route>
            <Route path="/admin/messaging" element={<AppShell />}>
              <Route index element={<AdminMessagingPage />} />
            </Route>
            <Route path="/organizations" element={<AppShell />}>
              <Route index element={<OrganizationsPage />} />
            </Route>
            <Route path="/organizations/new" element={<AppShell />}>
              <Route index element={<CreateOrganizationPage />} />
            </Route>
            
            {/* Legacy app shell for old index page */}
            <Route path="/app-legacy" element={<AppShell />}>
              <Route index element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/premium" element={<HomePremium />} />
            <Route path="/home-premium" element={<HomePremium />} />
            <Route path="/legacy-home" element={<Index />} />
            <Route path="/welcome" element={flags.enableNewMarketing ? <HomeNew /> : <Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/sms-respond/:token" element={<SMSRespond />} />
            
            {/* Catch-all route - redirect to homepage */}
            <Route path="*" element={<HomePremium />} />
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
