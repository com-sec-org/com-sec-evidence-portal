import { AdminLayout } from "@/components/AdminLayout";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
  slug: string;
};

type Stats = {
  totalControls: number;
  inScope: number;
  outOfScope: number;
  submitted: number;
  pending: number;
};

export default function AdminEngagementDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load client + LIVE stats
  // =========================
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);

        // 1️⃣ Load clients
        const clientRes = await fetch(
          "http://localhost:3001/api/admin/clients"
        );

        if (!clientRes.ok) {
          throw new Error("Failed to load clients");
        }

        const clientData = await clientRes.json();

        const foundClient = clientData.clients.find(
          (c: Client) => c.slug === slug
        );

        if (!foundClient) {
          setClient(null);
          setStats(null);
          return;
        }

        setClient(foundClient);

        // 2️⃣ Load LIVE stats
        const statsRes = await fetch(
          `http://localhost:3001/api/admin/clients/${slug}/stats`
        );

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        } else {
          // Safe fallback
          setStats({
            totalControls: 106,
            inScope: 0,
            outOfScope: 0,
            submitted: 0,
            pending: 0,
          });
        }
      } catch (err) {
        console.error(err);
        setClient(null);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  // =========================
  // Guards
  // =========================
  if (loading) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Loading…</p>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Client not found</p>
      </AdminLayout>
    );
  }

  // =========================
  // Render
  // =========================
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Back */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/clients"
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Clients</span>
          </Link>
        </div>

        {/* Header + More */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground text-lg">
              Engagement: SOC 2 Type 1 – 2025
            </p>
          </div>

          {/* ⋯ Client Settings */}
          <button
            onClick={() =>
              navigate(`/admin/clients/${client.slug}/settings`)
            }
            className="p-2 rounded-md hover:bg-muted transition"
            aria-label="Client settings"
          >
            <MoreHorizontal size={22} />
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Stat label="Total Controls" value={stats.totalControls} />
            <Stat label="In-Scope" value={stats.inScope} color="text-blue-600" />
            <Stat
              label="Out-of-Scope"
              value={stats.outOfScope}
              color="text-gray-600"
            />
            <Stat
              label="Submitted"
              value={stats.submitted}
              color="text-green-600"
            />
            <Stat
              label="Pending Review"
              value={stats.pending}
              color="text-amber-600"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            to={`/admin/clients/${client.slug}/controls`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
          >
            Manage Control Scope
            <ArrowRight size={18} />
          </Link>

          <Link
            to={`/client/${client.slug}/controls`}
            state={{
              fromAdmin: true,
              adminReturnPath: `/admin/clients/${client.slug}`,
            }}
            className="inline-flex items-center justify-center gap-2 bg-secondary border px-6 py-3 rounded-lg font-medium"
          >
            View Client Portal
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Use the buttons above to manage control scope or access the
            client-facing portal.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

/**
 * Small stat card
 */
function Stat({
  label,
  value,
  color = "text-foreground",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
        {label}
      </p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
