import { ClientLayout } from "@/components/ClientLayout";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchClientControls, getEvidence } from "@/lib/api";

type Control = {
  controlId: string;
  title: string;
  description: string;
};

type Evidence = {
  status: string;
  files: string[];
};

export default function ClientControlsListPage() {
  // ✅ URL PARAM IS SLUG (NOT UUID)
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const [controls, setControls] = useState<Control[]>([]);
  const [evidenceByControl, setEvidenceByControl] = useState<
    Record<string, Evidence | null>
  >({});
  const [loading, setLoading] = useState(true);

  // =========================
  // Load controls + evidence
  // =========================
  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      setLoading(true);

      try {
        // 1️⃣ Load controls (API resolves slug → client_id internally)
        const controlsData = await fetchClientControls(slug);
        setControls(controlsData);

        // 2️⃣ Load evidence per control
        const evidenceMap: Record<string, Evidence | null> = {};

        for (const control of controlsData) {
          try {
            const res = await getEvidence(slug, control.controlId);
            evidenceMap[control.controlId] = res.evidence;
          } catch {
            evidenceMap[control.controlId] = null;
          }
        }

        setEvidenceByControl(evidenceMap);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, location.key]);

  // =========================
  // UI helpers
  // =========================
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not-started":
        return <Clock size={20} className="text-muted-foreground" />;
      case "draft":
        return <FileText size={20} className="text-blue-500" />;
      case "submitted":
        return <CheckCircle2 size={20} className="text-green-500" />;
      case "needs-clarification":
        return <AlertCircle size={20} className="text-amber-500" />;
      case "approved":
        return <CheckCircle2 size={20} className="text-emerald-600" />;
      default:
        return <Clock size={20} className="text-muted-foreground" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "not-started":
        return "bg-gray-100 text-gray-700";
      case "draft":
        return "bg-blue-100 text-blue-700";
      case "submitted":
        return "bg-green-100 text-green-700";
      case "needs-clarification":
        return "bg-amber-100 text-amber-700";
      case "approved":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");

  // =========================
  // Render
  // =========================
  return (
    <ClientLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            SOC 2 Evidence Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Please upload the requested evidence for your SOC 2 engagement.
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading controls...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {controls.map((control) => {
              const evidence = evidenceByControl[control.controlId];
              const status = evidence?.status || "not-started";

              return (
                <div
                  key={control.controlId}
                  className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                        {control.controlId}
                      </div>
                      <h3 className="font-bold text-lg text-foreground">
                        {control.title}
                      </h3>
                    </div>
                    {getStatusIcon(status)}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    {control.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeClass(
                        status
                      )}`}
                    >
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  {/* ✅ ROUTE USES SLUG */}
                  <Link
                    to={`/client/${slug}/controls/${control.controlId}`}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors justify-center"
                  >
                    Open
                    <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
