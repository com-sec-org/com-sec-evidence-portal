import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAdminUser } from "@/hooks/useAdminUser";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, loading } = useAdminUser();

  const isActive = (path: string) => location.pathname === path;

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left */}
            <div className="flex items-center gap-8">
              {/* ✅ Logo → always goes to /admin/clients */}
              <Link
                to="/admin/clients"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="font-bold text-lg hidden sm:inline">
                  Com-Sec
                </span>
              </Link>

              <nav className="hidden md:flex gap-1">
                <Link
                  to="/admin/clients"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive("/admin/clients")
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  Clients
                </Link>
              </nav>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {!loading && user && (
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    Admin • Last login{" "}
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "—"}
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>

              <button
                className="md:hidden p-2 hover:bg-secondary rounded-md"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 flex flex-col gap-2">
              <Link
                to="/admin/clients"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors block",
                  isActive("/admin/clients")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Clients
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-muted-foreground">
          <p>&copy; 2026 Com-Sec. SOC 2 Evidence Collection Portal.</p>
        </div>
      </footer>
    </div>
  );
}
