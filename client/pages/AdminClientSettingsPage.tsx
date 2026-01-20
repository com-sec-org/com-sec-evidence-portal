// import { AdminLayout } from "@/components/AdminLayout";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { ArrowLeft } from "lucide-react";

// type Client = {
//   id: string;
//   name: string;
//   slug: string;
//   created_at: string;
// };

// export default function AdminClientSettingsPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const navigate = useNavigate();

//   const [client, setClient] = useState<Client | null>(null);
//   const [confirmText, setConfirmText] = useState("");
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     async function loadClient() {
//       const res = await fetch(
//         `http://localhost:3001/api/admin/clients/${slug}`
//       );

//       if (!res.ok) return;

//       const data = await res.json();
//       setClient(data.client);
//     }

//     loadClient();
//   }, [slug]);

//   async function handleDeleteClient() {
//     if (!slug || confirmText !== slug) {
//       alert("Type the client slug exactly to confirm.");
//       return;
//     }

//     if (!confirm("This action is irreversible. Continue?")) return;

//     setDeleting(true);

//     try {
//       const res = await fetch(
//         `http://localhost:3001/api/admin/clients/${slug}`,
//         { method: "DELETE" }
//       );

//       if (!res.ok) throw new Error();

//       alert("Client deleted successfully");
//       navigate("/admin/clients");
//     } catch {
//       alert("Failed to delete client");
//     } finally {
//       setDeleting(false);
//     }
//   }

//   return (
//     <AdminLayout>
//       <div className="max-w-3xl space-y-8">
//         <Link
//           to={`/admin/clients/${slug}/controls`}
//           className="flex items-center gap-2 text-primary"
//         >
//           <ArrowLeft size={18} />
//           Back to Client
//         </Link>

//         <h1 className="text-3xl font-bold">Client Settings</h1>

//         {client && (
//           <div className="bg-white border rounded-lg p-6 space-y-2">
//             <p><strong>Name:</strong> {client.name}</p>
//             <p><strong>Slug:</strong> {client.slug}</p>
//             <p className="text-sm text-muted-foreground">
//               Created on {new Date(client.created_at).toLocaleDateString()}
//             </p>
//           </div>
//         )}

//         {/* 🔥 Danger Zone */}
//         <div className="border border-red-200 bg-red-50 rounded-lg p-6 space-y-4">
//           <h2 className="text-red-600 font-semibold">Danger Zone</h2>

//           <p className="text-sm text-red-700">
//             Deleting this client will permanently remove:
//             <br />• All controls
//             <br />• All evidence files
//             <br />• All comments
//           </p>

//           <input
//             value={confirmText}
//             onChange={(e) => setConfirmText(e.target.value)}
//             placeholder={`Type "${slug}" to confirm`}
//             className="border p-2 rounded w-full"
//           />

//           <button
//             onClick={handleDeleteClient}
//             disabled={confirmText !== slug || deleting}
//             className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {deleting ? "Deleting…" : "Delete Client"}
//           </button>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
import { AdminLayout } from "@/components/AdminLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";


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

  // 🔐 Magic link state (NEW)
  const [accessLink, setAccessLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

//   useEffect(() => {
//     async function loadClient() {
//       const res = await fetch(
//         `http://localhost:3001/api/admin/clients/${slug}`
//       );

//       if (!res.ok) return;

//       const data = await res.json();
//       setClient(data.client);
//     }

//     loadClient();
//   }, [slug]);
useEffect(() => {
    async function loadClient() {
      if (!slug) return;
      try {
        const data = await adminFetch(`/clients/${slug}`);
        setClient(data.client);
      } catch {
        // optional: handle error
      }
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
        await adminFetch(`/clients/${slug}`, {
          method: "DELETE",
        });
      
        alert("Client deleted successfully");
        navigate("/admin/clients");
      } catch {
        alert("Failed to delete client");
      } finally {
        setDeleting(false);
      }
      
  }

  // 🔐 Generate magic access link (NEW)
  async function handleGenerateAccessLink() {
    if (!slug) return;

    setGenerating(true);
    setAccessLink(null);

    // try {
    //   const res = await fetch(
    //     `http://localhost:3001/api/admin/clients/${slug}/access-link`,
    //     { method: "POST" }
    //   );

    //   if (!res.ok) {
    //     throw new Error("Failed to generate access link");
    //   }

    //   const data = await res.json();
    //   setAccessLink(data.link);
    // } catch (err) {
    //   alert("Unable to generate client access link");
    // } finally {
    //   setGenerating(false);
    // }
    try {
        const data = await adminFetch(
          `/clients/${slug}/access-link`,
          { method: "POST" }
        );
      
        setAccessLink(data.link);
      } catch (err) {
        alert("Unable to generate client access link");
      } finally {
        setGenerating(false);
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

        {/* 🔐 Client Access (NEW) */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Client Access</h2>

          <p className="text-sm text-muted-foreground">
            Generate a secure, one-time access link for this client to upload evidence.
          </p>

          <button
            onClick={handleGenerateAccessLink}
            disabled={generating}
            className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50"
          >
            {generating ? "Generating…" : "Generate Client Access Link"}
          </button>

          {accessLink && (
            <div className="border rounded p-3 bg-secondary space-y-2">
              <p className="text-xs text-muted-foreground">
                This link can be used once. Share it securely with the client.
              </p>

              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={accessLink}
                  className="flex-1 border rounded p-2 text-sm"
                />

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(accessLink);
                    alert("Link copied to clipboard");
                  }}
                  className="text-sm px-3 py-2 border rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

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
