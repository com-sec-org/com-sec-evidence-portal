import { AdminLayout } from "@/components/AdminLayout";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Client form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // Load clients from backend
  // =========================
  async function loadClients() {
    setLoading(true);
    const res = await fetch("http://localhost:3001/api/admin/clients");
    const data = await res.json();
    setClients(data.clients || []);
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
  }, []);

  // =========================
  // Create client
  // =========================
  async function createClient() {
    if (!name || !slug) {
      alert("Name and slug are required");
      return;
    }

    setSubmitting(true);

    try {
      await fetch("http://localhost:3001/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      // Reset form
      setName("");
      setSlug("");
      setShowForm(false);

      // Reload list
      await loadClients();
    } catch {
      alert("Failed to create client");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-2">
              Manage SOC 2 engagements and client compliance tracking
            </p>
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Add Client
          </button>
        </div>

        {/* Add Client Form */}
        {showForm && (
          <div className="border rounded-lg p-6 bg-white space-y-4 max-w-lg">
            <h3 className="font-semibold text-lg">New Client</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Client Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Satoshi Energy"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Client Slug</label>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="satoshi-energy"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                disabled={submitting}
                onClick={createClient}
                className="bg-primary text-primary-foreground px-4 py-2 rounded"
              >
                {submitting ? "Creating..." : "Create Client"}
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Client List */}
        {loading ? (
          <p className="text-muted-foreground">Loading clients…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="border border-border rounded-lg p-6 bg-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      SOC 2 Engagement
                    </p>
                  </div>
                </div>

                <Link
                  to={`/admin/clients/${client.slug}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg w-full justify-center"
                >
                  Open Engagement
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
