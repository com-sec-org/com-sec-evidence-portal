import { AdminLayout } from "@/components/AdminLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

type Client = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export default function AdminClientSettingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadClient() {
      const res = await fetch(
        `http://localhost:3001/api/admin/clients/${slug}`
      );

      if (!res.ok) return;

      const data = await res.json();
      setClient(data.client);
    }

    loadClient();
  }, [slug]);

  async function handleDeleteClient() {
    if (!slug || confirmText !== slug) {
      alert("Type the client slug exactly to confirm.");
      return;
    }

    if (!confirm("This action is irreversible. Continue?")) return;

    setDeleting(true);

    try {
      const res = await fetch(
        `http://localhost:3001/api/admin/clients/${slug}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      alert("Client deleted successfully");
      navigate("/admin/clients");
    } catch {
      alert("Failed to delete client");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-8">
        <Link
          to={`/admin/clients/${slug}/controls`}
          className="flex items-center gap-2 text-primary"
        >
          <ArrowLeft size={18} />
          Back to Client
        </Link>

        <h1 className="text-3xl font-bold">Client Settings</h1>

        {client && (
          <div className="bg-white border rounded-lg p-6 space-y-2">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Slug:</strong> {client.slug}</p>
            <p className="text-sm text-muted-foreground">
              Created on {new Date(client.created_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* 🔥 Danger Zone */}
        <div className="border border-red-200 bg-red-50 rounded-lg p-6 space-y-4">
          <h2 className="text-red-600 font-semibold">Danger Zone</h2>

          <p className="text-sm text-red-700">
            Deleting this client will permanently remove:
            <br />• All controls
            <br />• All evidence files
            <br />• All comments
          </p>

          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Type "${slug}" to confirm`}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleDeleteClient}
            disabled={confirmText !== slug || deleting}
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete Client"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
