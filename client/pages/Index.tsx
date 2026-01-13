import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="font-bold text-lg">Com-Sec Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
                SOC 2 Evidence<br />Collection Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Streamline compliance audits with our professional evidence intake portal.
                Designed for cybersecurity consultants and their clients.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/admin/clients"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg"
              >
                Com-Sec Admin Portal
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/client"
                className="inline-flex items-center gap-2 bg-secondary text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors text-lg border border-border"
              >
                Client Evidence Portal
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-border p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Compliance Management
              </h3>
              <p className="text-muted-foreground">
                Track SOC 2 evidence submission status across all clients in one place
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Efficient Workflows
              </h3>
              <p className="text-muted-foreground">
                Simplify evidence collection with clear requirements and status tracking
              </p>
            </div>

            <div className="bg-white rounded-lg border border-border p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lock size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Professional & Secure
              </h3>
              <p className="text-muted-foreground">
                Enterprise-grade platform built for security and compliance professionals
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-20 bg-white rounded-lg border border-border p-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  For Com-Sec Analysts
                </h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">1.</span>
                    <span>View and select clients from the admin portal</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">2.</span>
                    <span>Define which SOC 2 controls are in scope</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">3.</span>
                    <span>Monitor evidence submission and review status</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">4.</span>
                    <span>Review submitted evidence and provide feedback</span>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  For Clients
                </h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">1.</span>
                    <span>Select your organization</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">2.</span>
                    <span>View only the controls relevant to your engagement</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">3.</span>
                    <span>Upload supporting documentation and evidence files</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary min-w-6">4.</span>
                    <span>Track progress and respond to reviewer feedback</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 Com-Sec. SOC 2 Evidence Collection Portal.</p>
        </div>
      </footer>
    </div>
  );
}
