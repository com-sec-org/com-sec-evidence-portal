// import { AdminLayout } from "@/components/AdminLayout";
// import { Link, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   ChevronDown,
//   Search,
//   X,
//   Download,
//   CheckCircle,
//   AlertTriangle,
//   Plus,
//   Pencil,
//   Trash2,
// } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";
// import {
//   fetchAdminClientControls,
//   fetchAdminEvidenceDownloadLinks,
// } from "@/lib/api";

// /* =========================
//    TYPES
// ========================= */

// type Scope = "default" | "in-scope" | "out-of-scope";

// type Control = {
//   controlId: string;
//   title: string;
//   description: string;
//   scope: Scope;
//   is_custom: boolean;
// };

// type Client = {
//   id: string;
//   name: string;
//   slug: string;
// };

// /* =========================
//    COMPONENT
// ========================= */

// export default function AdminControlScopingPage() {
//   const { slug } = useParams<{ slug: string }>();

//   const [client, setClient] = useState<Client | null>(null);
//   const [controls, setControls] = useState<Control[]>([]);
//   const [expandedControl, setExpandedControl] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [reviewComment, setReviewComment] = useState<Record<string, string>>({});
//   const [reviewing, setReviewing] = useState<string | null>(null);

//   /* =========================
//      CREATE CUSTOM CONTROL
//   ========================= */

//   const [showCustomModal, setShowCustomModal] = useState(false);
//   const [customControlId, setCustomControlId] = useState("");
//   const [customName, setCustomName] = useState("");
//   const [customDescription, setCustomDescription] = useState("");
//   const [creating, setCreating] = useState(false);

//   /* =========================
//      EDIT CUSTOM CONTROL (NEW)
//   ========================= */

//   const [editingControl, setEditingControl] = useState<Control | null>(null);
//   const [editControlId, setEditControlId] = useState("");
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [savingEdit, setSavingEdit] = useState(false);

//   /* =========================
//      FILTER
//   ========================= */

//   const filteredControls = useMemo(() => {
//     return controls.filter(
//       (c) =>
//         c.controlId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         c.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [controls, searchTerm]);

//   /* =========================
//      LOAD DATA
//   ========================= */

//   async function loadControls() {
//     if (!slug) return;
//     const data = await fetchAdminClientControls(slug);
//     setControls(data);
//   }

//   useEffect(() => {
//     if (!slug) return;

//     async function loadData() {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `http://localhost:3001/api/admin/clients/${slug}`
//         );
//         if (!res.ok) throw new Error("Client not found");
//         const data = await res.json();
//         setClient(data.client);
//         await loadControls();
//       } catch {
//         setClient(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, [slug]);

//   /* =========================
//      ACTIONS
//   ========================= */

//   async function updateScope(
//     controlId: string,
//     scope: "in-scope" | "out-of-scope"
//   ) {
//     await fetch(
//       `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/scope`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scope }),
//       }
//     );

//     setControls((prev) =>
//       prev.map((c) =>
//         c.controlId === controlId ? { ...c, scope } : c
//       )
//     );
//   }

//   async function downloadEvidence(controlId: string) {
//     const res = await fetchAdminEvidenceDownloadLinks(slug!, controlId);
//     for (const file of res.files) {
//       window.open(file.url, "_blank");
//     }
//   }

//   async function submitReview(
//     controlId: string,
//     status: "approved" | "needs-clarification"
//   ) {
//     try {
//       setReviewing(controlId);
//       await fetch(
//         `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/review`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             status,
//             comment: reviewComment[controlId] || "",
//           }),
//         }
//       );
//     } finally {
//       setReviewing(null);
//     }
//   }

//   async function createCustomControl() {
//     if (!customControlId || !customName) {
//       alert("Control ID and Name are required");
//       return;
//     }

//     try {
//       setCreating(true);
//       await fetch(
//         `http://localhost:3001/api/admin/clients/${slug}/custom-controls`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             control_id: customControlId,
//             name: customName,
//             description: customDescription,
//           }),
//         }
//       );

//       setCustomControlId("");
//       setCustomName("");
//       setCustomDescription("");
//       setShowCustomModal(false);
//       await loadControls();
//     } finally {
//       setCreating(false);
//     }
//   }

//   async function deleteCustomControl(controlId: string) {
//     if (!confirm("Delete this custom control? This cannot be undone.")) return;

//     await fetch(
//       `http://localhost:3001/api/admin/clients/${slug}/custom-controls/${controlId}`,
//       { method: "DELETE" }
//     );

//     setControls((prev) =>
//       prev.filter((c) => c.controlId !== controlId)
//     );
//   }

//   async function saveEditControl() {
//     if (!editingControl) return;

//     try {
//       setSavingEdit(true);
//       await fetch(
//         `http://localhost:3001/api/admin/clients/${slug}/custom-controls/${editingControl.controlId}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             control_id: editControlId,
//             name: editTitle,
//             description: editDescription,
//           }),
//         }
//       );

//       setEditingControl(null);
//       await loadControls();
//     } finally {
//       setSavingEdit(false);
//     }
//   }

//   /* =========================
//      GUARDS
//   ========================= */

//   if (loading) {
//     return (
//       <AdminLayout>
//         <p className="text-muted-foreground">Loading controls…</p>
//       </AdminLayout>
//     );
//   }

//   if (!client) {
//     return (
//       <AdminLayout>
//         <p className="text-muted-foreground">Client not found</p>
//       </AdminLayout>
//     );
//   }

//   /* =========================
//      RENDER
//   ========================= */

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <Link
//           to={`/admin/clients/${slug}`}
//           className="flex items-center gap-2 text-blue-600"
//         >
//           <ArrowLeft size={18} /> Back to Engagement
//         </Link>

//         <div>
//           <h1 className="text-4xl font-bold">Control Scoping</h1>
//           <p className="text-muted-foreground">{client.name}</p>
//         </div>

//         {/* SEARCH + ADD */}
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 border p-2 rounded flex-1">
//             <Search size={16} />
//             <input
//               className="flex-1 outline-none"
//               placeholder="Search controls..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button onClick={() => setSearchTerm("")}>
//                 <X size={16} />
//               </button>
//             )}
//           </div>

//           <button
//             onClick={() => setShowCustomModal(true)}
//             className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//           >
//             <Plus size={16} />
//             Add Control
//           </button>
//         </div>

//         {/* CONTROLS */}
//         {filteredControls.map((control) => (
//           <div key={control.controlId} className="border rounded bg-white">
//             <button
//               className="w-full flex justify-between p-4"
//               onClick={() =>
//                 setExpandedControl(
//                   expandedControl === control.controlId
//                     ? null
//                     : control.controlId
//                 )
//               }
//             >
//               <div>
//                 <p className="text-xs text-blue-600">{control.controlId}</p>
//                 <p className="font-medium">{control.title}</p>
//                 <p className="text-xs text-muted-foreground">
//                   Status:{" "}
//                   {control.scope === "default" && "Not reviewed"}
//                   {control.scope === "in-scope" && "In scope"}
//                   {control.scope === "out-of-scope" && "Out of scope"}
//                 </p>
//               </div>
//               <ChevronDown />
//             </button>

//             {expandedControl === control.controlId && (
//               <div className="p-4 border-t bg-slate-50 space-y-4">
//                 <p className="text-sm">{control.description}</p>

//                 {control.is_custom && (
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => {
//                         setEditingControl(control);
//                         setEditControlId(control.controlId);
//                         setEditTitle(control.title);
//                         setEditDescription(control.description);
//                       }}
//                       className="flex items-center gap-1 text-blue-600 border px-3 py-1 rounded"
//                     >
//                       <Pencil size={14} /> Edit
//                     </button>

//                     <button
//                       onClick={() => deleteCustomControl(control.controlId)}
//                       className="flex items-center gap-1 text-red-600 border px-3 py-1 rounded"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                   </div>
//                 )}

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => updateScope(control.controlId, "in-scope")}
//                     className={`px-3 py-1 rounded ${
//                       control.scope === "in-scope"
//                         ? "bg-green-600 text-white"
//                         : "border"
//                     }`}
//                   >
//                     In Scope
//                   </button>

//                   <button
//                     onClick={() => updateScope(control.controlId, "out-of-scope")}
//                     className={`px-3 py-1 rounded ${
//                       control.scope === "out-of-scope"
//                         ? "bg-red-600 text-white"
//                         : "border"
//                     }`}
//                   >
//                     Out of Scope
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => downloadEvidence(control.controlId)}
//                   className="text-sm text-blue-600 underline"
//                 >
//                   <Download size={14} /> Download Evidence
//                 </button>

//                 <textarea
//                   className="w-full border rounded p-2 text-sm"
//                   placeholder="Reviewer comment"
//                   value={reviewComment[control.controlId] || ""}
//                   onChange={(e) =>
//                     setReviewComment((p) => ({
//                       ...p,
//                       [control.controlId]: e.target.value,
//                     }))
//                   }
//                 />

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() =>
//                       submitReview(control.controlId, "approved")
//                     }
//                     className="bg-green-600 text-white px-4 py-2 rounded"
//                   >
//                     <CheckCircle size={16} /> Approve
//                   </button>

//                   <button
//                     onClick={() =>
//                       submitReview(
//                         control.controlId,
//                         "needs-clarification"
//                       )
//                     }
//                     className="bg-amber-500 text-white px-4 py-2 rounded"
//                   >
//                     <AlertTriangle size={16} /> Needs Clarification
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* ADD CUSTOM CONTROL MODAL */}
//         {showCustomModal && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4">
//               <h2 className="text-xl font-bold">Add Custom Control</h2>

//               <input
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="Control ID (e.g. AI-GOV-01)"
//                 value={customControlId}
//                 onChange={(e) => setCustomControlId(e.target.value)}
//               />

//               <input
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="Control Name"
//                 value={customName}
//                 onChange={(e) => setCustomName(e.target.value)}
//               />

//               <textarea
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="Description"
//                 rows={4}
//                 value={customDescription}
//                 onChange={(e) => setCustomDescription(e.target.value)}
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowCustomModal(false)}
//                   className="px-4 py-2 border rounded"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   disabled={creating}
//                   onClick={createCustomControl}
//                   className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                   {creating ? "Creating..." : "Create Control"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* EDIT CUSTOM CONTROL MODAL */}
//         {editingControl && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4">
//               <h2 className="text-xl font-bold">Edit Custom Control</h2>

//               <input
//                 className="w-full border rounded px-3 py-2"
//                 value={editControlId}
//                 onChange={(e) => setEditControlId(e.target.value)}
//               />

//               <input
//                 className="w-full border rounded px-3 py-2"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//               />

//               <textarea
//                 className="w-full border rounded px-3 py-2"
//                 rows={4}
//                 value={editDescription}
//                 onChange={(e) => setEditDescription(e.target.value)}
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setEditingControl(null)}
//                   className="px-4 py-2 border rounded"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   disabled={savingEdit}
//                   onClick={saveEditControl}
//                   className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                   {savingEdit ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// }

import { AdminLayout } from "@/components/AdminLayout";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fetchAdminClientControls,
  fetchAdminEvidenceDownloadLinks,
} from "@/lib/api";

/* =========================
   TYPES
========================= */

type Scope = "default" | "in-scope" | "out-of-scope";

type Control = {
  controlId: string;
  title: string;
  description: string;
  scope: Scope;
  is_custom: boolean;
};

type Client = {
  id: string;
  name: string;
  slug: string;
};

type Comment = {
  id: string;
  author_role: "admin" | "client";
  message: string;
  created_at: string;
};

/* =========================
   COMPONENT
========================= */

export default function AdminControlScopingPage() {
  const { slug } = useParams<{ slug: string }>();

  const [client, setClient] = useState<Client | null>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});
  const [reviewing, setReviewing] = useState<string | null>(null);

  /* ===== COMMENTS ===== */

  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>(
    {}
  );

  /* ===== CUSTOM CONTROL ===== */

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customControlId, setCustomControlId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // ===== EDIT CUSTOM CONTROL =====
const [editingControl, setEditingControl] = useState<Control | null>(null);
const [editControlId, setEditControlId] = useState("");
const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");
const [updating, setUpdating] = useState(false);


  /* =========================
     FILTER
  ========================= */

  const filteredControls = useMemo(() => {
    return controls.filter(
      (c) =>
        c.controlId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [controls, searchTerm]);

  /* =========================
     LOAD DATA
  ========================= */

  async function loadControls() {
    if (!slug) return;
    const data = await fetchAdminClientControls(slug);
    setControls(data);
  }

  async function loadComments(controlId: string) {
    setLoadingComments((p) => ({ ...p, [controlId]: true }));
    const res = await fetch(
      `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/comments`
    );
    const data = await res.json();
    setComments((p) => ({ ...p, [controlId]: data.comments || [] }));
    setLoadingComments((p) => ({ ...p, [controlId]: false }));
  }

  async function postAdminComment(controlId: string) {
    const message = commentDraft[controlId];
    if (!message) return;

    await fetch(
      `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );

    setCommentDraft((p) => ({ ...p, [controlId]: "" }));
    await loadComments(controlId);
  }

  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/api/admin/clients/${slug}`
        );
        if (!res.ok) throw new Error("Client not found");
        const data = await res.json();
        setClient(data.client);
        await loadControls();
      } catch {
        setClient(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  /* =========================
     ACTIONS
  ========================= */

  async function updateScope(
    controlId: string,
    scope: "in-scope" | "out-of-scope"
  ) {
    await fetch(
      `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/scope`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      }
    );

    setControls((prev) =>
      prev.map((c) =>
        c.controlId === controlId ? { ...c, scope } : c
      )
    );
  }

  async function downloadEvidence(controlId: string) {
    const res = await fetchAdminEvidenceDownloadLinks(slug!, controlId);
    for (const file of res.files) {
      window.open(file.url, "_blank");
    }
  }

  async function submitReview(
    controlId: string,
    status: "approved" | "needs-clarification"
  ) {
    try {
      setReviewing(controlId);
      await fetch(
        `http://localhost:3001/api/admin/clients/${slug}/controls/${controlId}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            comment: reviewComment[controlId] || "",
          }),
        }
      );
    } finally {
      setReviewing(null);
    }
  }
  async function createCustomControl() {
    if (!slug || !customControlId || !customName) return;
  
    try {
      setCreating(true);
  
      await fetch(
        `http://localhost:3001/api/admin/clients/${slug}/custom-controls`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            control_id: customControlId,
            name: customName,
            description: customDescription,
          }),
        }
      );
      
      
  
      // reload controls so it appears immediately
      await loadControls();
  
      // reset + close modal
      setCustomControlId("");
      setCustomName("");
      setCustomDescription("");
      setShowCustomModal(false);
    } finally {
      setCreating(false);
    }
  }
  async function updateCustomControl() {
    if (!editingControl || !slug) return;
  
    try {
      setUpdating(true);
  
      await fetch(
        `http://localhost:3001/api/admin/clients/${slug}/custom-controls/${editingControl.controlId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            control_id: editControlId,
            name: editTitle,
            description: editDescription,
          }),
        }
      );
  
      // refresh list
      await loadControls();
  
      // close modal
      setEditingControl(null);
    } finally {
      setUpdating(false);
    }
  }
  

  /* =========================
     GUARDS
  ========================= */

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Loading controls…</p>
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

  /* =========================
     RENDER
  ========================= */

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          to={`/admin/clients/${slug}`}
          className="flex items-center gap-2 text-blue-600"
        >
          <ArrowLeft size={18} /> Back to Engagement
        </Link>

        <h1 className="text-4xl font-bold">Control Scoping</h1>

        {/* 🔍 SEARCH + ADD CONTROL (RESTORED) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search controls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
            />
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            <Plus size={16} />
            Add Control
          </button>
        </div>

        {filteredControls.map((control) => (
          <div key={control.controlId} className="border rounded bg-white">
            <button
              className="w-full flex justify-between p-4"
              onClick={() => {
                const next =
                  expandedControl === control.controlId
                    ? null
                    : control.controlId;
                setExpandedControl(next);
                if (next) loadComments(control.controlId);
              }}
            >
              <div>
                <p className="text-xs text-blue-600">{control.controlId}</p>
                <p className="font-medium">{control.title}</p>
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  {control.scope === "default" && "Not reviewed"}
                  {control.scope === "in-scope" && "In scope"}
                  {control.scope === "out-of-scope" && "Out of scope"}
                </p>
              </div>
              <ChevronDown />
            </button>

            {expandedControl === control.controlId && (
              <div className="p-4 space-y-4 border-t bg-slate-50">
                <p className="text-sm">{control.description}</p>
                {/* ✏️ EDIT / 🗑️ DELETE — CUSTOM CONTROLS ONLY */}
{control.is_custom && (
  <div className="flex gap-2">
    <button
      onClick={() => {
        setEditControlId(control.controlId);
        setEditTitle(control.title);
        setEditDescription(control.description);
        setEditingControl(control);
      }}
      className="flex items-center gap-1 px-3 py-1 text-sm border rounded"
    >
      Edit
    </button>

    <button
      onClick={async () => {
        if (!confirm("Delete this control?")) return;

        await fetch(
          `http://localhost:3001/api/admin/clients/${slug}/controls/${control.controlId}`,
          { method: "DELETE" }
        );

        await loadControls();
      }}
      className="flex items-center gap-1 px-3 py-1 text-sm border border-red-500 text-red-600 rounded"
    >
      Delete
    </button>
  </div>
)}


                <div className="flex gap-2">
                  <button
                    onClick={() => updateScope(control.controlId, "in-scope")}
                    className={`px-3 py-1 rounded ${
                      control.scope === "in-scope"
                        ? "bg-green-600 text-white"
                        : "border"
                    }`}
                  >
                    In Scope
                  </button>
                  <button
                    onClick={() => updateScope(control.controlId, "out-of-scope")}
                    className={`px-3 py-1 rounded ${
                      control.scope === "out-of-scope"
                        ? "bg-red-600 text-white"
                        : "border"
                    }`}
                  >
                    Out of Scope
                  </button>
                </div>

                <button
                  onClick={() => downloadEvidence(control.controlId)}
                  className="text-sm text-blue-600 underline"
                >
                  <Download size={14} /> Download Evidence
                </button>

                <textarea
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Reviewer comment"
                  value={reviewComment[control.controlId] || ""}
                  onChange={(e) =>
                    setReviewComment((p) => ({
                      ...p,
                      [control.controlId]: e.target.value,
                    }))
                  }
                />

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      submitReview(control.controlId, "approved")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>

                  <button
                    onClick={() =>
                      submitReview(
                        control.controlId,
                        "needs-clarification"
                      )
                    }
                    className="bg-amber-500 text-white px-4 py-2 rounded"
                  >
                    <AlertTriangle size={16} /> Needs Clarification
                  </button>
                </div>

                <div className="border rounded bg-white p-4 space-y-3">
                  <p className="font-medium text-sm">Discussion</p>

                  {(comments[control.controlId] || []).map((c) => (
                    <div
                      key={c.id}
                      className={`p-2 rounded text-sm ${
                        c.author_role === "admin"
                          ? "bg-blue-50"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="font-semibold">
                        {c.author_role === "admin"
                          ? "Reviewer"
                          : "Client"}
                      </p>
                      <p>{c.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  <textarea
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Add a comment…"
                    value={commentDraft[control.controlId] || ""}
                    onChange={(e) =>
                      setCommentDraft((p) => ({
                        ...p,
                        [control.controlId]: e.target.value,
                      }))
                    }
                  />

                  <button
                    onClick={() => postAdminComment(control.controlId)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ➕ ADD CUSTOM CONTROL MODAL */}
        {showCustomModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
              <h2 className="text-lg font-semibold">Add Custom Control</h2>

              <input
                className="w-full border rounded p-2 text-sm"
                placeholder="Control ID (e.g. AI-GOV-01)"
                value={customControlId}
                onChange={(e) => setCustomControlId(e.target.value)}
              />

              <input
                className="w-full border rounded p-2 text-sm"
                placeholder="Control Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />

              <textarea
                className="w-full border rounded p-2 text-sm"
                placeholder="Description"
                rows={3}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>

                <button
  disabled={creating}
  onClick={createCustomControl}
  className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
>
  {creating ? "Creating..." : "Create Control"}
</button>

              </div>
            </div>
          </div>
        )}

{editingControl && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
      <h2 className="text-lg font-semibold">Edit Custom Control</h2>

      <input
        className="w-full border rounded p-2 text-sm"
        value={editControlId}
        onChange={(e) => setEditControlId(e.target.value)}
        placeholder="Control ID"
      />

      <input
        className="w-full border rounded p-2 text-sm"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        placeholder="Control Name"
      />

      <textarea
        className="w-full border rounded p-2 text-sm"
        rows={3}
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        placeholder="Description"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setEditingControl(null)}
          className="px-4 py-2 text-sm border rounded"
        >
          Cancel
        </button>

        <button
          disabled={updating}
          onClick={updateCustomControl}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </AdminLayout>
  );
}
