import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminClientSettingsPage from "./pages/AdminClientSettingsPage";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminClientsPage from "./pages/AdminClientsPage";
import AdminEngagementDashboard from "./pages/AdminEngagementDashboard";
import AdminControlScopingPage from "./pages/AdminControlScopingPage";
import AdminEvidenceReviewPage from "./pages/AdminEvidenceReviewPage";
import ClientControlsListPage from "./pages/ClientControlsListPage";
import ClientControlDetailPage from "./pages/ClientControlDetailPage";
import ClientAccessPage from "./pages/ClientAccessPage";
import AdminGuard from "./components/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* ✅ PUBLIC ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ✅ PROTECTED ADMIN AREA */}
          <Route
            path="/admin/clients"
            element={
              <AdminGuard>
                <AdminClientsPage />
              </AdminGuard>
            }
          />

          <Route
            path="/admin/clients/:slug"
            element={
              <AdminGuard>
                <AdminEngagementDashboard />
              </AdminGuard>
            }
          />

          <Route
            path="/admin/clients/:slug/controls"
            element={
              <AdminGuard>
                <AdminControlScopingPage />
              </AdminGuard>
            }
          />

          <Route
            path="/admin/clients/:slug/controls/:controlId"
            element={
              <AdminGuard>
                <AdminEvidenceReviewPage />
              </AdminGuard>
            }
          />
{/* ✅ NEW: CLIENT SETTINGS */}
<Route
  path="/admin/clients/:slug/settings"
  element={
    <AdminGuard>
      <AdminClientSettingsPage />
    </AdminGuard>
  }
/>

{/* ✅ CLIENT MAGIC ACCESS (PUBLIC) */}
<Route
  path="/client-access/:token"
  element={<ClientAccessPage />}
/>
          {/* Client Portal (public for now) */}
          <Route
            path="/client/:slug/controls"
            element={<ClientControlsListPage />}
          />

          <Route
            path="/client/:slug/controls/:controlId"
            element={<ClientControlDetailPage />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
