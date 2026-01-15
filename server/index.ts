// import "dotenv/config";


// import express from "express";
// import cors from "cors";

// // 🔹 ADMIN ROUTES
// import adminRoutes from "./routes/admin";

// // 🔹 CLIENT ROUTES (slug-based)
// import clientRoutes from "./routes/clients";

// // Upload middleware
// import { upload } from "./lib/upload";

// // Route handlers
// import { handleDemo } from "./routes/demo";
// import {
//   getAdminClientControls,   // ✅ ADMIN: all 106 controls
//   updateControlScope,       // ✅ ADMIN: update scope
// } from "./routes/controls";

// import {
//   submitEvidence,
//   getEvidence,
//   getEvidenceDownloadLinks,
//   reviewEvidence,
// } from "./routes/evidence";

// const PORT = 3001;

// export function createServer() {
//   const app = express();

//   // -------------------
//   // Middleware
//   // -------------------
//   app.use(cors());
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));

//   // ===================
//   // ADMIN ROUTES
//   // ===================
//   app.use("/api/admin", adminRoutes);

//   // ADMIN — get ALL 106 controls (scoping)
//   app.get(
//     "/api/admin/clients/:slug/controls",
//     getAdminClientControls
//   );

//   // ADMIN — update scope
//   app.post(
//     "/api/admin/clients/:slug/controls/:controlId/scope",
//     updateControlScope
//   );

//   // ===================
//   // CLIENT ROUTES (slug-based)
//   // ===================
//   app.use("/api/clients", clientRoutes);

//   // -------------------
//   // Health check
//   // -------------------
//   app.get("/api/ping", (_req, res) => {
//     res.json({ message: process.env.PING_MESSAGE ?? "ping" });
//   });

//   // -------------------
//   // Demo
//   // -------------------
//   app.get("/api/demo", handleDemo);

//   // -------------------
//   // Evidence (CLIENT READ)
//   // -------------------
//   app.get(
//     "/api/clients/:slug/controls/:controlId/evidence",
//     getEvidence
//   );

//   // -------------------
//   // Evidence (CLIENT UPLOAD)
//   // -------------------
//   app.post(
//     "/api/clients/:slug/controls/:controlId/evidence",
//     upload.array("files"),
//     submitEvidence
//   );

//   // -------------------
//   // Evidence (ADMIN DOWNLOAD)
//   // -------------------
//   app.get(
//     "/api/admin/clients/:slug/controls/:controlId/evidence/download",
//     getEvidenceDownloadLinks
//   );

//   // -------------------
//   // Evidence (ADMIN REVIEW)
//   // -------------------
//   app.post(
//     "/api/admin/clients/:slug/controls/:controlId/review",
//     reviewEvidence
//   );

//   return app;
// }

// const app = createServer();

// app.listen(PORT, () => {
//   console.log(`✅ Backend listening on http://localhost:${PORT}`);
// });

// console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
// console.log("SERVICE_KEY EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);


import "dotenv/config";

import express from "express";
import cors from "cors";

// 🔹 ADMIN ROUTES
import adminRoutes from "./routes/admin";

// 🔹 CLIENT ROUTES (existing — DO NOT TOUCH)
import clientRoutes from "./routes/clients";

// Upload middleware
import { upload } from "./lib/upload";

// Route handlers
import { handleDemo } from "./routes/demo";
import {
  getAdminClientControls,
  updateControlScope,
  createCustomControl,
  updateCustomControl,
  deleteCustomControl,
} from "./routes/controls";

import {
  submitEvidence,
  getEvidence,
  getEvidenceDownloadLinks,
  reviewEvidence,
} from "./routes/evidence";

const PORT = 3001;

export function createServer() {
  const app = express();

  // -------------------
  // Middleware
  // -------------------
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ===================
  // ADMIN ROUTES
  // ===================
  app.use("/api/admin", adminRoutes);

  /**
   * =========================
   * CONTROLS (ADMIN)
   * =========================
   */

  // ✅ Get ALL controls (framework + custom)
  app.get(
    "/api/admin/clients/:slug/controls",
    getAdminClientControls
  );

  // ✅ Create custom control
  app.post(
    "/api/admin/clients/:slug/controls",
    createCustomControl
  );

  // ✅ Update control scope (in-scope / out-of-scope)
  app.post(
    "/api/admin/clients/:slug/controls/:controlId/scope",
    updateControlScope
  );

  // ✅ Edit custom control (PATCH — IMPORTANT)
  app.patch(
    "/api/admin/clients/:slug/controls/:controlId",
    updateCustomControl
  );

  // ✅ Delete custom control
  app.delete(
    "/api/admin/clients/:slug/controls/:controlId",
    deleteCustomControl
  );

  // ===================
  // CLIENT ROUTES (EXISTING — DO NOT TOUCH)
  // ===================
  app.use("/api/clients", clientRoutes);

  // -------------------
  // Health check
  // -------------------
  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  // -------------------
  // Demo
  // -------------------
  app.get("/api/demo", handleDemo);

  // -------------------
  // Evidence (CLIENT READ)
  // -------------------
  app.get(
    "/api/clients/:slug/controls/:controlId/evidence",
    getEvidence
  );

  // -------------------
  // Evidence (CLIENT UPLOAD)
  // -------------------
  app.post(
    "/api/clients/:slug/controls/:controlId/evidence",
    upload.array("files"),
    submitEvidence
  );

  // -------------------
  // Evidence (ADMIN DOWNLOAD)
  // -------------------
  app.get(
    "/api/admin/clients/:slug/controls/:controlId/evidence/download",
    getEvidenceDownloadLinks
  );

  // -------------------
  // Evidence (ADMIN REVIEW)
  // -------------------
  app.post(
    "/api/admin/clients/:slug/controls/:controlId/review",
    reviewEvidence
  );

  return app;
}

const app = createServer();

app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SERVICE_KEY EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

