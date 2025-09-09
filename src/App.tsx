import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { initMonitoring, AppErrorBoundary } from "@/lib/monitoring";
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Public routes outside AppShell */}
            <Route path="/welcome" element={<Index />} />
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
