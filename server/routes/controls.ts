import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

/**
 * Resolve client slug → UUID
 */
async function getClientIdFromSlug(slug: string): Promise<string> {
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw new Error("Client not found");
  }

  return data.id;
}

/**
 * =========================
 * GET /api/admin/clients/:slug/controls
 * ADMIN ONLY — RETURNS ALL 106 CONTROLS
 * =========================
 */
export async function getAdminClientControls(
  req: Request,
  res: Response
) {
  try {
    const { slug } = req.params;

    const clientId = await getClientIdFromSlug(slug);

    // 1️⃣ Fetch ALL master controls (106)
    const { data: controls, error } = await supabase
      .from("controls")
      .select("control_id, name, description")
      .order("control_id");

    if (error || !controls) {
      return res.status(500).json({ error: "Failed to load controls" });
    }

    // 2️⃣ Fetch scope for this client
    const { data: scopes, error: scopeError } = await supabase
      .from("client_controls")
      .select("control_id, scope")
      .eq("client_id", clientId);

    if (scopeError) {
      return res.status(500).json({ error: scopeError.message });
    }

    const scopeMap = new Map(
      (scopes ?? []).map((s) => [s.control_id, s.scope])
    );

    // 3️⃣ Merge controls + scope
    const result = controls.map((c) => ({
      controlId: c.control_id,
      title: c.name,
      description: c.description,
      scope: scopeMap.get(c.control_id) ?? "default",
    }));

    res.json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

/**
 * =========================
 * POST /api/admin/clients/:slug/controls/:controlId/scope
 * ADMIN — UPDATE CONTROL SCOPE
 * =========================
 */
export async function updateControlScope(
  req: Request,
  res: Response
) {
  try {
    const { slug, controlId } = req.params;
    const { scope, reasonOutOfScope } = req.body;

    const clientId = await getClientIdFromSlug(slug);

    const { error } = await supabase
      .from("client_controls")
      .update({
        scope,
        reason_out_of_scope: reasonOutOfScope ?? null,
      })
      .eq("client_id", clientId)
      .eq("control_id", controlId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}
