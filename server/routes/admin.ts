import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import crypto from "crypto";


const router = Router();

/**
 * =========================
 * GET /api/admin/clients
 * =========================
 */
router.get("/clients", async (_req, res) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ clients: data });
});
/**
 * =========================
 * POST /api/admin/clients
 * CREATE NEW CLIENT
 * =========================
 */
router.post("/clients", async (req: Request, res: Response) => {
    try {
      const { name, slug } = req.body;
  
      if (!name || !slug) {
        return res.status(400).json({
          error: "name and slug are required",
        });
      }
  
      const normalizedSlug = slug.toLowerCase().trim();
  
      // Prevent duplicate slugs
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("slug", normalizedSlug)
        .single();
  
      if (existing) {
        return res.status(409).json({
          error: "Client with this slug already exists",
        });
      }
  
      // 1️⃣ Create client
      const { data: client, error } = await supabase
        .from("clients")
        .insert({
          name,
          slug: normalizedSlug,
        })
        .select()
        .single();
  
      if (error || !client) {
        return res.status(500).json({ error: error?.message });
      }
  
      // 2️⃣ Seed ALL standard SOC2 controls for this client
      const { data: controls, error: controlsError } = await supabase
        .from("controls")
        .select("control_id")
        .eq("is_custom", false);
  
      if (controlsError) {
        return res.status(500).json({ error: controlsError.message });
      }
  
      const clientControls = controls.map((c) => ({
        client_id: client.id,
        control_id: c.control_id,
        scope: "default",
      }));
  
      const { error: seedError } = await supabase
        .from("client_controls")
        .insert(clientControls);
  
      if (seedError) {
        return res.status(500).json({ error: seedError.message });
      }
  
      // 3️⃣ Done
      res.status(201).json({ client });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
/**
 * =========================
 * GET /api/admin/clients/:slug
 * =========================
 */
router.get("/clients/:slug", async (req, res) => {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Client not found" });
  }

  res.json({ client: data });
});

/*/**
 * =========================
 * GET /api/admin/clients/:slug/controls
 * RETURNS ALL CONTROLS (SOC2 + CUSTOM) WITH CLIENT SCOPE
 * =========================
 */
router.get("/clients/:slug/controls", async (req: Request, res: Response) => {
    try {
      res.setHeader("Cache-Control", "no-store");
  
      const { slug } = req.params;
  
      // 1️⃣ Resolve client
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("slug", slug)
        .single();
  
      if (clientError || !client) {
        return res.status(404).json({ error: "Client not found" });
      }
  
      // 2️⃣ Fetch ALL controls (SOC2 + custom)
      const { data: controls, error: controlsError } = await supabase
        .from("controls")
        .select("id, control_id, name, description, is_custom")
        .order("control_id");
  
      if (controlsError || !controls) {
        return res.status(500).json({ error: "Failed to load controls" });
      }
  
      // 3️⃣ Fetch client scope overrides
      const { data: clientScopes } = await supabase
        .from("client_controls")
        .select("control_id, scope")
        .eq("client_id", client.id);
  
      const scopeMap = new Map(
        (clientScopes || []).map((row) => [row.control_id, row.scope])
      );
  
      // 4️⃣ Merge controls + scope
      const response = controls.map((c) => ({
        controlId: c.control_id,
        title: c.name,
        description: c.description,
        is_custom: c.is_custom === true,
        scope: scopeMap.get(c.control_id) ?? "default",

      }));
  
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  

/**
 * =========================
 * GET /api/admin/clients/:slug/stats
 * =========================
 */
router.get("/clients/:slug/stats", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const clientId = client.id;

    const [
      totalControls,
      inScope,
      outOfScope,
      submitted,
      pendingReview,
    ] = await Promise.all([
      supabase.from("controls").select("*", { count: "exact", head: true }),
      supabase
        .from("client_controls")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .eq("scope", "in-scope"),
      supabase
        .from("client_controls")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .eq("scope", "out-of-scope"),
      supabase
        .from("client_control_evidence")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .eq("status", "submitted"),
      supabase
        .from("client_control_evidence")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .eq("status", "needs-clarification"),
    ]);

    res.json({
      totalControls: totalControls.count ?? 0,
      inScope: inScope.count ?? 0,
      outOfScope: outOfScope.count ?? 0,
      submitted: submitted.count ?? 0,
      pendingReview: pendingReview.count ?? 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * POST /api/admin/clients/:slug/custom-controls
 * =========================
 */
router.post(
  "/clients/:slug/custom-controls",
  async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { control_id, name, description } = req.body;

      if (!control_id || !name) {
        return res
          .status(400)
          .json({ error: "control_id and name are required" });
      }

      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const { data: control, error } = await supabase
        .from("controls")
        .insert({
          control_id,
          name,
          description,
          framework: "CUSTOM",
          is_custom: true,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      await supabase.from("client_controls").insert({
        client_id: client.id,
        control_id: control.control_id,
        scope: "in-scope",
      });

      res.status(201).json({ control });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * =========================
 * PUT /api/admin/clients/:slug/custom-controls/:controlId
 * =========================
 */
router.patch(
    "/clients/:slug/custom-controls/:controlId",
    async (req: Request, res: Response) => {
      try {
        const { slug, controlId } = req.params;
        const { control_id, name, description } = req.body;
  
        if (!name || !control_id) {
          return res
            .status(400)
            .json({ error: "control_id and name are required" });
        }
  
        // Resolve client
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // Resolve control
        const { data: control } = await supabase
          .from("controls")
          .select("id, is_custom")
          .eq("control_id", controlId)
          .single();
  
        if (!control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        if (!control.is_custom) {
          return res
            .status(403)
            .json({ error: "Standard controls cannot be edited" });
        }
  
        // Update control metadata
        const { error } = await supabase
          .from("controls")
          .update({
            control_id,
            name,
            description,
          })
          .eq("id", control.id);
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        res.json({ success: true });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
  
/**
 * =========================
 * DELETE /api/admin/clients/:slug/custom-controls/:controlId
 * =========================
 */
router.delete(
  "/clients/:slug/custom-controls/:controlId",
  async (req: Request, res: Response) => {
    try {
      const { slug, controlId } = req.params;

      const { data: control } = await supabase
        .from("controls")
        .select("id, is_custom")
        .eq("control_id", controlId)
        .single();

      if (!control) {
        return res.status(404).json({ error: "Control not found" });
      }

      if (!control.is_custom) {
        return res
          .status(403)
          .json({ error: "Standard controls cannot be deleted" });
      }

      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      await supabase
        .from("client_control_evidence")
        .delete()
        .eq("client_id", client.id)
        .eq("control_id", control.id);

      await supabase
        .from("client_controls")
        .delete()
        .eq("client_id", client.id)
        .eq("control_id", control.id);

      await supabase.from("controls").delete().eq("id", control.id);

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);
/**
 * =========================
 * POST /api/admin/clients/:slug/controls/:controlId/review
 * SAVE REVIEW STATUS + COMMENT
 * =========================
 */
router.post(
    "/clients/:slug/controls/:controlId/review",
    async (req: Request, res: Response) => {
      try {
        const { slug, controlId } = req.params;
        const { status, comment } = req.body;
  
        if (!status) {
          return res.status(400).json({ error: "status is required" });
        }
  
        // 1️⃣ Resolve client
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // 2️⃣ Resolve control
        const { data: control } = await supabase
          .from("controls")
          .select("id")
          .eq("control_id", controlId)
          .single();
  
        if (!control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        // 3️⃣ Upsert review info (MATCHES DB SCHEMA)
        const { error } = await supabase
          .from("client_control_evidence")
          .upsert(
            {
              client_id: client.id,
              control_id: control.id,
              status,
              reviewer_comment: comment || null,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "client_id,control_id",
            }
          );
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        res.json({ success: true });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
  
  /**
 * =========================
 * GET /api/admin/clients/:slug/controls/:controlId/comments
 * FETCH COMMENT THREAD
 * =========================
 */
router.get(
    "/clients/:slug/controls/:controlId/comments",
    async (req: Request, res: Response) => {
      try {
        const { slug, controlId } = req.params;
  
        // 1️⃣ Resolve client
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // 2️⃣ Resolve control
        const { data: control } = await supabase
          .from("controls")
          .select("id")
          .eq("control_id", controlId)
          .single();
  
        if (!control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        // 3️⃣ Fetch comments
        const { data, error } = await supabase
          .from("control_comments")
          .select("*")
          .eq("client_id", client.id)
          .eq("control_id", control.id)
          .order("created_at", { ascending: true });
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        res.json({ comments: data });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
/**
 * =========================
 * POST /api/admin/clients/:slug/controls/:controlId/comments
 * ADD COMMENT (ADMIN)
 * =========================
 */
router.post(
    "/clients/:slug/controls/:controlId/comments",
    async (req: Request, res: Response) => {
      try {
        const { slug, controlId } = req.params;
        const { message } = req.body;
  
        if (!message) {
          return res.status(400).json({ error: "message is required" });
        }
  
        // 1️⃣ Resolve client
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // 2️⃣ Resolve control
        const { data: control } = await supabase
          .from("controls")
          .select("id")
          .eq("control_id", controlId)
          .single();
  
        if (!control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        // 3️⃣ Insert comment
        const { error } = await supabase.from("control_comments").insert({
          client_id: client.id,
          control_id: control.id,
          author_role: "admin",
          author_email: "admin@com-sec.io", // placeholder for now
          message,
          read_by_client: false,
          read_by_admin: true,
        });
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        res.status(201).json({ success: true });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
    /**
 * =========================
 * POST /api/client/clients/:slug/controls/:controlId/comments
 * ADD COMMENT (CLIENT)
 * =========================
 */
router.post(
    "/client/clients/:slug/controls/:controlId/comments",
    async (req: Request, res: Response) => {
      try {
        const { slug, controlId } = req.params;
        const { message } = req.body;
  
        if (!message) {
          return res.status(400).json({ error: "message is required" });
        }
  
        // 1️⃣ Resolve client
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // 2️⃣ Resolve control
        const { data: control } = await supabase
          .from("controls")
          .select("id")
          .eq("control_id", controlId)
          .single();
  
        if (!control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        // 3️⃣ Insert client comment
        const { error } = await supabase.from("control_comments").insert({
          client_id: client.id,
          control_id:control.id,
          author_role: "client",
          author_email: "client@company.com", // placeholder for now
          message,
          read_by_admin: false,
          read_by_client: true,
        });
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        res.status(201).json({ success: true });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
  /**
 * =========================
 * GET /api/admin/clients/:slug/controls/:controlId/comments
 * GET COMMENT THREAD
 * =========================
 */
router.get(
    "/clients/:slug/controls/:controlId/comments",
    async (req: Request, res: Response) => {
      try {
        const { slug, controlId } = req.params;
  
        // Resolve client
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // Resolve control
        const { data: control } = await supabase
          .from("controls")
          .select("id")
          .eq("control_id", controlId)
          .single();
  
        if (!control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        // Fetch comments
        const { data: comments, error } = await supabase
          .from("control_comments")
          .select(`
            id,
            author_role,
            author_email,
            message,
            created_at
          `)
          .eq("client_id", client.id)
          .eq("control_id", control.id)
          .order("created_at", { ascending: true });
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        res.json({ comments: comments || [] });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
  /**
 * =========================
 * POST /api/admin/clients/:slug/controls/:controlId/scope
 * UPSERT CONTROL SCOPE
 * =========================
 */
// router.post(
//     "/clients/:slug/controls/:controlId/scope",
//     async (req: Request, res: Response) => {
//       try {
//         const { slug, controlId } = req.params;
//         const { scope } = req.body;
  
//         if (!["in-scope", "out-of-scope"].includes(scope)) {
//           return res.status(400).json({ error: "Invalid scope" });
//         }
  
//         // Resolve client
//         const { data: client } = await supabase
//           .from("clients")
//           .select("id")
//           .eq("slug", slug)
//           .single();
  
//         if (!client) {
//           return res.status(404).json({ error: "Client not found" });
//         }
  
//         // Resolve control
//         const { data: control } = await supabase
//           .from("controls")
//           .select("id")
//           .eq("control_id", controlId)
//           .single();
  
//         if (!control) {
//           return res.status(404).json({ error: "Control not found" });
//         }
  
//         // 🔥 THIS IS THE FIX — UPSERT
//         const { error } = await supabase
//           .from("client_controls")
//           .upsert(
//             {
//               client_id: client.id,
//               control_id: control.id,
//               scope,
//             },
//             {
//               onConflict: "client_id,control_id",
//             }
//           );
  
//         if (error) {
//           return res.status(500).json({ error: error.message });
//         }
  
//         res.json({ success: true });
//       } catch (err: any) {
//         res.status(500).json({ error: err.message });
//       }
//     }
//   );
router.post(
    "/clients/:slug/controls/:controlId/scope",
    async (req: Request, res: Response) => {
      try {
        const { slug, controlId } = req.params;
        const { scope } = req.body;
  
        if (!["in-scope", "out-of-scope", "default"].includes(scope)) {
          return res.status(400).json({ error: "Invalid scope" });
        }
  
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        const { data: control } = await supabase
          .from("controls")
          .select("control_id")
          .eq("control_id", controlId)
          .single();
  
        if (!control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        const { error } = await supabase
          .from("client_controls")
          .upsert(
            {
              client_id: client.id,
              control_id: control.control_id, // TEXT (correct)
              scope,
            },
            { onConflict: "client_id,control_id" }
          );
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        res.json({ success: true });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
/**
 * =========================
 * GET /api/admin/clients/:slug/controls/:controlId/evidence/download
 * =========================
 */
// router.get(
//   "/clients/:slug/controls/:controlId/evidence/download",
//   async (req: Request, res: Response) => {
//     try {
//       const { slug, controlId } = req.params;

//       // Resolve client
//       const { data: client } = await supabase
//         .from("clients")
//         .select("id")
//         .eq("slug", slug)
//         .single();

//       if (!client) {
//         return res.status(404).json({ error: "Client not found" });
//       }

//       // Resolve control (UUID)
//       const { data: control } = await supabase
//         .from("controls")
//         .select("id")
//         .eq("control_id", controlId)
//         .single();

//       if (!control) {
//         return res.status(404).json({ error: "Control not found" });
//       }

//       // Fetch evidence records
//       const { data: evidence, error } = await supabase
//         .from("client_control_evidence")
//         .select("file_url, file_name")
//         .eq("client_id", client.id)
//         .eq("control_id", control.id);

//       if (error) {
//         return res.status(500).json({ error: error.message });
//       }

//       if (!evidence || evidence.length === 0) {
//         return res.status(404).json({ error: "No evidence found" });
//       }

//       // For now: return links (frontend can download)
//       res.json({ files: evidence });
//     } catch (err: any) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );
// router.get(
//     "/clients/:slug/controls/:controlId/evidence/download",
//     async (req: Request, res: Response) => {
//       try {
//         const { slug, controlId } = req.params;
  
//         // 1️⃣ Resolve client
//         const { data: client } = await supabase
//           .from("clients")
//           .select("id")
//           .eq("slug", slug)
//           .single();
  
//         if (!client) {
//           return res.status(404).json({ error: "Client not found" });
//         }
  
//         // 2️⃣ Resolve control (UUID)
//         const { data: control } = await supabase
//           .from("controls")
//           .select("id")
//           .eq("control_id", controlId)
//           .single();
  
//         if (!control) {
//           return res.status(404).json({ error: "Control not found" });
//         }
  
//         // 3️⃣ Fetch evidence rows
//         const { data: evidence, error } = await supabase
//           .from("client_control_evidence")
//           .select("files")
//           .eq("client_id", client.id)
//           .eq("control_id", control.id);
  
//         if (error) {
//           return res.status(500).json({ error: error.message });
//         }
  
//         if (!evidence || evidence.length === 0) {
//           return res.status(404).json({ error: "No evidence found" });
//         }
  
//         // 4️⃣ Extract file paths
//         const fileEntries = evidence
//           .flatMap(e => e.files || [])
//           .filter(f => f.path);
  
//         if (fileEntries.length === 0) {
//           return res.status(404).json({ error: "No files attached" });
//         }
  
//         // 5️⃣ Generate signed URLs
//         const signedUrls = await Promise.all(
//           fileEntries.map(async (file) => {
//             const { data } = await supabase.storage
//               .from("evidence") // ⚠️ your bucket name
//               .createSignedUrl(file.path, 60);
  
//             return {
//               name: file.name,
//               url: data?.signedUrl,
//             };
//           })
//         );
  
//         res.json({ files: signedUrls });
//       } catch (err: any) {
//         res.status(500).json({ error: err.message });
//       }
//     }
//   );
    /**
 * =========================
 * GET /api/admin/clients/:slug/controls/:controlId/evidence/download
 * =========================
 */
router.get(
    "/clients/:slug/controls/:controlId/evidence/download",
    async (req: Request, res: Response) => {
        console.log(
            "HIT: /clients/:slug/controls/:controlId/evidence/download",
            req.params
        );
      try {
        const { slug, controlId } = req.params;
  
        // 1️⃣ Resolve client
        const { data: client, error: clientError } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (clientError || !client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // 2️⃣ Resolve control (UUID)
        const { data: control, error: controlError } = await supabase
          .from("controls")
          .select("id")
          .eq("control_id", controlId)
          .single();
  
        if (controlError || !control) {
          return res.status(404).json({ error: "Control not found" });
        }
  
        // 3️⃣ Fetch evidence rows (files JSONB)
        const { data: evidenceRows, error: evidenceError } = await supabase
          .from("client_control_evidence")
          .select("files")
          .eq("client_id", client.id)
          .eq("control_id", controlId);
  
        if (evidenceError) {
          return res.status(500).json({ error: evidenceError.message });
        }
  
        if (!evidenceRows || evidenceRows.length === 0) {
          return res.status(404).json({ error: "No evidence found" });
        }
  
        // 4️⃣ Extract file entries
        const fileEntries = evidenceRows
          .flatMap((row: any) => Array.isArray(row.files) ? row.files : [])
          .filter((file: any) => file?.path && file?.name);
  
        if (fileEntries.length === 0) {
          return res.status(404).json({ error: "No files attached" });
        }
  
        // 5️⃣ Generate signed URLs from Supabase Storage
        const signedFiles = await Promise.all(
          fileEntries.map(async (file: any) => {
            const { data, error } = await supabase.storage
              .from("evidence") // ✅ bucket name
              .createSignedUrl(file.path, 60); // 60 seconds
  
            if (error || !data?.signedUrl) {
              throw new Error(`Failed to sign file: ${file.path}`);
            }
  
            return {
              name: file.name,
              url: data.signedUrl,
            };
          })
        );
  
        // 6️⃣ Return signed download links
        res.json({ files: signedFiles });
  
      } catch (err: any) {
        console.error("EVIDENCE DOWNLOAD ERROR:", err);
        res.status(500).json({ error: err.message || "Download failed" });
      }
    }
  );
  
  /**
 /**
 * =========================
 * DELETE /api/admin/clients/:slug
 * =========================
 */
router.delete(
    "/clients/:slug",
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
  
        // 1️⃣ Resolve client
        const { data: client, error } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (error || !client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        const clientId = client.id;
  
        // 2️⃣ Delete evidence files (storage)
        const { data: evidenceRows } = await supabase
          .from("client_control_evidence")
          .select("files")
          .eq("client_id", clientId);
  
        const filePaths =
          evidenceRows?.flatMap((e) => e.files || []).map((f) => f.path) || [];
  
        if (filePaths.length > 0) {
          await supabase.storage.from("evidence").remove(filePaths);
        }
  
        // 3️⃣ Delete DB records (order matters)
        await supabase.from("control_comments").delete().eq("client_id", clientId);
        await supabase.from("client_control_evidence").delete().eq("client_id", clientId);
        await supabase.from("client_controls").delete().eq("client_id", clientId);
  
        // 4️⃣ Delete client
        await supabase.from("clients").delete().eq("id", clientId);
  
        res.json({ success: true });
      } catch (err: any) {
        console.error("DELETE CLIENT ERROR:", err);
        res.status(500).json({ error: "Failed to delete client" });
      }
    }
  );

  /**
 * =========================
 * POST /api/admin/clients/:slug/access-link
 * GENERATE MAGIC CLIENT ACCESS LINK
 * =========================
 */
router.post(
    "/clients/:slug/access-link",
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
  
        // 1️⃣ Resolve client
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("slug", slug)
          .single();
  
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
  
        // 2️⃣ Revoke existing links for this client
        await supabase
          .from("client_access_links")
          .update({ is_active: false })
          .eq("client_id", client.id);
  
        // 3️⃣ Generate secure token
        const token = crypto.randomBytes(24).toString("hex");
  
        // 4️⃣ Store new link
        await supabase.from("client_access_links").insert({
          client_id: client.id,
          token,
          is_active: true,
        });
  
        // 5️⃣ Return full access URL
        res.json({
          link: `http://localhost:8080/client-access/${token}`,
        });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    }
  );
  
  
export default router;
