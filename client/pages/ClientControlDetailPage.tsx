import { ClientLayout } from "@/components/ClientLayout";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { submitEvidence, getEvidence } from "@/lib/api";
import { mockControls } from "@/data/mockControls";
import {
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  X,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

/**
 * Evidence as returned by BACKEND
 */
type EvidenceFile = {
  path: string;
  name: string;
};

type Evidence = {
  status: string;
  files: EvidenceFile[];
};

/**
 * 💬 Comment thread
 */
type Comment = {
  id: string;
  author_role: "admin" | "client";
  author_email: string;
  message: string;
  created_at: string;
};

export default function ClientControlDetailPage() {
  const { slug, controlId } = useParams<{
    slug: string;
    controlId: string;
  }>();

  // Resolve control metadata (temporary: mockControls)
  const control = mockControls.find(
    (c) => c.controlId === controlId
  );

  // Server state
  const [evidence, setEvidence] = useState<Evidence | null>(null);

  // 🔴 Admin review state
  const [reviewStatus, setReviewStatus] = useState<string>("not-reviewed");
  const [reviewerComment, setReviewerComment] = useState<string | null>(null);

  // 💬 Discussion state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  // Local UI state
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // Load evidence + admin review + comments
  // =========================
  useEffect(() => {
    if (!slug || !controlId) return;

    async function loadData() {
      try {
        // 1️⃣ Load evidence
        const evidenceRes = await getEvidence(slug, controlId);
        setEvidence(evidenceRes.evidence ?? null);

        // 2️⃣ Load admin review
        const reviewRes = await fetch(
          `http://localhost:3001/api/clients/${slug}/controls/${controlId}`
        );

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setReviewStatus(reviewData.status);
          setReviewerComment(reviewData.reviewer_comment ?? null);
        }

        // 3️⃣ Load discussion comments
        const commentsRes = await fetch(
          `http://localhost:3001/api/clients/${slug}/controls/${controlId}/comments`
        );

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData.comments ?? []);
        }
      } catch {
        setEvidence(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, controlId]);

  // =========================
  // Handle file select
  // =========================
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // =========================
  // Submit evidence
  // =========================
  async function handleSubmitEvidence() {
    if (!slug || !controlId || files.length === 0) return;

    setSubmitting(true);

    try {
      const res = await submitEvidence(slug, controlId, files);
      setEvidence(res.evidence);
      setFiles([]);
    } catch {
      alert("Failed to submit evidence");
    } finally {
      setSubmitting(false);
    }
  }

  // =========================
  // Send comment (CLIENT)
  // =========================
  async function handleSendComment() {
    if (!slug || !controlId || !newComment.trim()) return;

    setSendingComment(true);

    try {
      await fetch(
        `http://localhost:3001/api/clients/${slug}/controls/${controlId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: newComment }),
        }
      );

      // Reload comments
      const refreshed = await fetch(
        `http://localhost:3001/api/clients/${slug}/controls/${controlId}/comments`
      );
      const data = await refreshed.json();
      setComments(data.comments ?? []);
      setNewComment("");
    } catch {
      alert("Failed to send comment");
    } finally {
      setSendingComment(false);
    }
  }

  const status = evidence?.status ?? "not-started";

  // =========================
  // Render
  // =========================
  return (
    <ClientLayout>
      <div className="max-w-3xl space-y-8">
        {/* Back navigation */}
        <Link
          to={`/client/${slug}/controls`}
          className="flex items-center gap-2 text-primary"
        >
          <ArrowLeft size={18} />
          Back to Evidence Requests
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            {control?.name || "Evidence Submission"}
          </h1>

          <p className="text-sm text-primary mt-1">
            {controlId}
          </p>

          {control?.description && (
            <p className="text-muted-foreground mt-3">
              {control.description}
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="bg-white border border-border rounded-lg p-6 space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              {reviewStatus === "approved" ? (
                <CheckCircle2 className="text-green-600" />
              ) : reviewStatus === "needs-clarification" ? (
                <AlertCircle className="text-amber-500" />
              ) : (
                <Clock className="text-muted-foreground" />
              )}
              <span className="font-medium capitalize">
                Status: {reviewStatus.replace("-", " ")}
              </span>
            </div>

            {/* Admin reviewer comment */}
            {reviewStatus !== "approved" && reviewerComment && (
              <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
                <p className="text-sm font-semibold text-amber-700 mb-1">
                  Admin Comment
                </p>
                <p className="text-sm text-amber-800 whitespace-pre-line">
                  {reviewerComment}
                </p>
              </div>
            )}

            {/* 💬 Discussion */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold">Discussion</h3>

              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg text-sm ${
                        comment.author_role === "admin"
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 border"
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium capitalize">
                          {comment.author_role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-line">
                        {comment.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border rounded-lg p-2 text-sm"
                rows={3}
              />

              <button
                onClick={handleSendComment}
                disabled={sendingComment || !newComment.trim()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {sendingComment ? "Sending…" : "Send"}
              </button>
            </div>


{/* 📎 Uploaded Evidence */}
{/* 📎 Uploaded Evidence */}
{evidence?.files && evidence.files.length > 0 && (
  <div className="space-y-3 border-t pt-6">
    <h3 className="font-semibold">Uploaded Evidence</h3>

    <div className="space-y-2">
      {evidence.files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border rounded-lg p-3 text-sm"
        >
          <FileText size={16} className="text-muted-foreground" />
          <span className="break-all">{file.name}</span>
        </div>
      ))}
    </div>
  </div>
)}

            {/* Evidence Guidance */}
            {control?.exampleEvidence && (
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-semibold">
                  What evidence should I upload?
                </h3>
                <p className="text-sm text-muted-foreground">
                  {control.exampleEvidence}
                </p>
              </div>
            )}

            {/* Upload Section */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold">Upload Evidence</h3>

              <label className="flex items-center gap-3 cursor-pointer text-primary">
                <Upload size={18} />
                <span>Select files</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(i)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitEvidence}
              disabled={
                files.length === 0 ||
                status === "submitted" ||
                submitting
              }
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Evidence"}
            </button>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
