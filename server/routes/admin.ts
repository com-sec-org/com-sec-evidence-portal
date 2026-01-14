import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

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

/**
 * =========================
 * GET /api/admin/clients/:slug/controls
 * RETURNS ALL CONTROLS (SOC2 + CUSTOM)
 * =========================
 */
router.get(
  "/clients/:slug/controls",
  async (req: Request, res: Response) => {
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

      // 2️⃣ Fetch scoped controls (SOC2 + already-scoped custom)
      const { data: scoped, error: scopedError } = await supabase
        .from("client_controls")
        .select(
          `
          scope,
          controls (
            id,
            control_id,
            name,
            description,
            is_custom
          )
        `
        )
        .eq("client_id", client.id);

      if (scopedError) {
        return res.status(500).json({ error: scopedError.message });
      }

      const scopedControls = (scoped || []).map((row: any) => ({
        controlId: row.controls.control_id,
        title: row.controls.name,
        description: row.controls.description,
        scope: row.scope,
        is_custom: row.controls.is_custom === true,
      }));

      // 3️⃣ Fetch custom controls NOT in client_controls yet
      const scopedIds = scopedControls.map((c) => c.controlId);

      const { data: unscopedCustom, error: customError } = await supabase
        .from("controls")
        .select("control_id, name, description, is_custom")
        .eq("is_custom", true)
        .not(
          "control_id",
          "in",
          `(${scopedIds.length ? scopedIds.map((id) => `'${id}'`).join(",") : "''"})`
        );

      if (customError) {
        return res.status(500).json({ error: customError.message });
      }

      const unscopedControls = (unscopedCustom || []).map((c: any) => ({
        controlId: c.control_id,
        title: c.name,
        description: c.description,
        scope: "in-scope", // default
        is_custom: true,
      }));

      // 4️⃣ Merge & return
      res.json([...scopedControls, ...unscopedControls]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

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
        control_id: control.id,
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
  
  
export default router;
