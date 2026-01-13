import { AdminLayout } from "@/components/AdminLayout";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Download } from "lucide-react";

type Client = {
  id: string;
  name: string;
  slug: string;
};

type Evidence = {
  status: string;
  files: string[];
  reviewer_comment?: string | null;
};

export default function AdminEvidenceReviewPage() {
  // ✅ USE SLUG
  const { slug, controlId } = useParams<{
    slug: string;
    controlId: string;
  }>();

  const [client, setClient] = useState<Client | null>(null);
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // Load client + evidence
  // =========================
  useEffect(() => {
    if (!slug || !controlId) return;

    async function loadData() {
      try {
        setLoading(true);

        // 1️⃣ Load client
        const clientRes = await fetch(
          `http://localhost:3001/api/admin/clients/${slug}`
        );
        const clientData = await clientRes.json();
        setClient(clientData.client);

        // 2️⃣ Load evidence
        const evidenceRes = await fetch(
          `http://localhost:3001/api/clients/${slug}/controls/${controlId}/evidence`
        );
        const evidenceData = await evidenceRes.json();
        setEvidence(evidenceData.evidence);
        setComments(evidenceData.evidence?.reviewer_comment ?? "");
      } catch (err) {
        console.error(err);
        setClient(null);
        setEvidence(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, controlId]);

  // =========================
  // Submit review
  // =========================
  async function submitReview(
    status: "approved" | "needs-clarification"
  ) {
    if (!slug || !controlId) return;

    try {
      setSubmitting(true);

      await fetch(
        `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            comment: comments,
          }),
        }
      );

      setEvidence((prev) =>
        prev ? { ...prev, status, reviewer_comment: comments } : prev
      );

      alert(`Evidence marked as ${status.replace("-", " ")}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // Download evidence
  // =========================
  async function downloadEvidence() {
    if (!slug || !controlId) return;

    const res = await fetch(
      `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/evidence/download`
    );
    const data = await res.json();

    for (const file of data.files || []) {
      window.open(file.url, "_blank");
    }
  }

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

  if (!client || !evidence) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Client or evidence not found</p>
      </AdminLayout>
    );
  }

  // =========================
  // Render
  // =========================
  return (
    <AdminLayout>
      <div className="space-y-8">
        <Link
          to={`/admin/clients/${slug}`}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Engagement</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{controlId}</h1>
          <p className="text-muted-foreground">
            {client.name}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 space-y-6">
          {/* Files */}
          {evidence.files.length > 0 ? (
            <button
              onClick={downloadEvidence}
              className="inline-flex items-center gap-2 text-primary underline"
            >
              <Download size={18} /> Download Evidence
            </button>
          ) : (
            <p className="text-muted-foreground">No evidence submitted yet</p>
          )}

          {/* Comments */}
          <textarea
            className="w-full border rounded p-3 text-sm"
            placeholder="Reviewer comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />

          {/* Actions */}
          <div className="flex gap-4">
            <button
              disabled={submitting}
              onClick={() => submitReview("approved")}
              className="px-6 py-3 bg-green-600 text-white rounded"
            >
              Approve
            </button>

            <button
              disabled={submitting || !comments}
              onClick={() => submitReview("needs-clarification")}
              className="px-6 py-3 bg-amber-600 text-white rounded"
            >
              Needs Clarification
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
