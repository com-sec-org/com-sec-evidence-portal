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
    .select(
      `
      control_id,
      scope,
      controls (
        id,
        control_id,
        name,
        description
      )
    `
    )
    .eq("client_id", client.id)
    .eq("scope", "in-scope")
    .order("control_id");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 3️⃣ Normalize response
  const controls = (data ?? []).map((row: any) => ({
    controlId: row.controls.control_id,
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

export default router;
