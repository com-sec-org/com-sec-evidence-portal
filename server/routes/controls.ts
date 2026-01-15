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
 * GET ALL CONTROLS (ADMIN)
 * =========================
 */
export async function getAdminClientControls(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const clientId = await getClientIdFromSlug(slug);

    // master controls
    const { data: controls, error } = await supabase
      .from("controls")
      .select("control_id, name, description, is_custom")
      .order("control_id");

    if (error || !controls) {
      return res.status(500).json({ error: "Failed to load controls" });
    }

    // client scope
    const { data: scopes } = await supabase
      .from("client_controls")
      .select("control_id, scope")
      .eq("client_id", clientId);

    const scopeMap = new Map(
      (scopes ?? []).map((s) => [s.control_id, s.scope])
    );

    res.json(
      controls.map((c) => ({
        controlId: c.control_id,
        title: c.name,
        description: c.description,
        is_custom: c.is_custom,
        scope: scopeMap.get(c.control_id) ?? "default",
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * =========================
 * UPDATE CONTROL SCOPE
 * =========================
 */
export async function updateControlScope(req: Request, res: Response) {
  try {
    const { slug, controlId } = req.params;
    const { scope } = req.body;

    const clientId = await getClientIdFromSlug(slug);

    const { error } = await supabase
      .from("client_controls")
      .update({ scope })
      .eq("client_id", clientId)
      .eq("control_id", controlId);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * =========================
 * CREATE CUSTOM CONTROL
 * =========================
 */
export async function createCustomControl(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const { controlId, title, description } = req.body;

    if (!controlId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const clientId = await getClientIdFromSlug(slug);

    // 1️⃣ insert control
    const { error: controlError } = await supabase.from("controls").insert({
      control_id: controlId,
      name: title,              // ✅ FIXED
      description,
      is_custom: true,
      framework: "custom",
    });

    if (controlError) {
      return res.status(500).json({ error: controlError.message });
    }

    // 2️⃣ link to client
    const { error: scopeError } = await supabase
      .from("client_controls")
      .insert({
        client_id: clientId,
        control_id: controlId,
        scope: "default",
      });

    if (scopeError) {
      return res.status(500).json({ error: scopeError.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * =========================
 * UPDATE CUSTOM CONTROL
 * =========================
 */
export async function updateCustomControl(req: Request, res: Response) {
  try {
    const { controlId } = req.params;
    const { title, description } = req.body;

    const { error } = await supabase
      .from("controls")
      .update({
        name: title,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("control_id", controlId)
      .eq("is_custom", true);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * =========================
 * DELETE CUSTOM CONTROL
 * =========================
 */
export async function deleteCustomControl(req: Request, res: Response) {
  try {
    const { controlId } = req.params;

    // 1️⃣ remove client mappings
    await supabase
      .from("client_controls")
      .delete()
      .eq("control_id", controlId);

    // 2️⃣ delete control
    const { error } = await supabase
      .from("controls")
      .delete()
      .eq("control_id", controlId)
      .eq("is_custom", true);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
