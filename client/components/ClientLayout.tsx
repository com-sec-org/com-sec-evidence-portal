import { Link, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { slug } = useParams<{ slug: string }>();

  // 🛑 Safety guard
  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Client not found
      </div>
    );
  }

  // ✅ READ ADMIN CONTEXT FROM ROUTER STATE
  const fromAdmin = location.state?.fromAdmin === true;
  const adminReturnPath = location.state?.adminReturnPath;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to={`/client/${slug}/controls`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CS</span>
                  </div>
                  <span className="font-bold text-lg hidden sm:inline">
                    Com-Sec
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex gap-1">
                <Link
                  to={`/client/${slug}/controls`}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(`/client/${slug}/controls`)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  Evidence Requests
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs text-muted-foreground font-medium px-3 py-1 bg-secondary rounded-full">
                Client
              </div>

              <button
                className="md:hidden p-2 hover:bg-secondary rounded-md"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ ADMIN BACK BAR */}
      {fromAdmin && adminReturnPath && (
        <div className="bg-muted/40 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link
              to={adminReturnPath}
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Engagement Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 Com-Sec. SOC 2 Evidence Collection Portal.</p>
        </div>
      </footer>
    </div>
  );
}
