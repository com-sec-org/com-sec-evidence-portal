import { Request, Response, Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

/**
 * GET /api/clients
 * List all clients (admin + internal use)
 */
router.get("/", async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, slug, soc2_mode, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ clients: data });
});

/**
 * GET /api/clients/:slug
 * Resolve client by slug
 */
router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, name, slug, soc2_mode")
    .eq("slug", slug)
    .single();

  if (error || !client) {
    return res.status(404).json({ error: "Client not found" });
  }

  res.json({ client });
});

/**
 * ✅ GET /api/clients/:slug/controls
 * CLIENT PORTAL — ONLY IN-SCOPE CONTROLS
 */
router.get("/:slug/controls", async (req: Request, res: Response) => {
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

  // 2️⃣ Fetch ONLY in-scope controls
  const { data, error } = await supabase
  .from("client_controls")
  .select(`
    control_id,
    scope,
    controls!inner (
      control_id,
      name,
      description
    )
  `)
  .eq("client_id", client.id)
  .eq("scope", "in-scope")
  .order("control_id");


  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 3️⃣ Normalize response
  const controls = (data ?? []).map((row: any) => ({
    controlId: row.control_id,          // TEXT (DCF-36)
    title: row.controls.name,
    description: row.controls.description,
    scope: row.scope,
  }));
  

  res.json(controls);
});

/**
 * ✅ STEP 2 FIX
 * GET /api/clients/:slug/controls/:controlId
 * RETURNS ADMIN REVIEW STATUS + COMMENT
 */
router.get(
  "/:slug/controls/:controlId",
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
        .select("id, control_id, name, description")
        .eq("control_id", controlId)
        .single();

      if (!control) {
        return res.status(404).json({ error: "Control not found" });
      }

      // 3️⃣ Fetch admin review + comment
      const { data: review } = await supabase
        .from("client_control_evidence")
        .select("status, reviewer_comment")
        .eq("client_id", client.id)
        .eq("control_id", control.id)
        .single();

      res.json({
        controlId: control.control_id,
        title: control.name,
        description: control.description,
        status: review?.status || "not-reviewed",
        reviewer_comment: review?.reviewer_comment || null,
      });
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
  "/:slug/controls/:controlId/comments",
  async (req: Request, res: Response) => {
    try {
      const { slug, controlId } = req.params;
      const { message, author_email } = req.body;

      if (!message) {
        return res.status(400).json({ error: "message is required" });
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
        .select("id")
        .eq("control_id", controlId)
        .single();

      if (!control) {
        return res.status(404).json({ error: "Control not found" });
      }

      const { error } = await supabase.from("control_comments").insert({
        client_id: client.id,
        control_id: control.id,
        author_role: "client",
        author_email: author_email || "client@unknown",
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
 * GET /api/clients/:slug/controls/:controlId/comments
 * CLIENT VIEW THREAD
 * =========================
 */
router.get(
  "/:slug/controls/:controlId/comments",
  async (req: Request, res: Response) => {
    try {
      const { slug, controlId } = req.params;

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
        .select("id")
        .eq("control_id", controlId)
        .single();

      if (!control) {
        return res.status(404).json({ error: "Control not found" });
      }

      const { data: comments, error } = await supabase
        .from("control_comments")
        .select("*")
        .eq("client_id", client.id)
        .eq("control_id", control.id)
        .order("created_at", { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ comments });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
