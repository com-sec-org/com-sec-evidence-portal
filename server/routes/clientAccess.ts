import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

/**
 * =========================
 * POST /api/client-access/:token
 * =========================
 * Validates magic link and returns client slug
 */
router.post("/client-access/:token", async (req: Request, res: Response) => {
  const { token } = req.params;

  // 1️⃣ Fetch access link
  const { data: link, error } = await supabase
    .from("client_access_links")
    .select("id, client_id, is_active, expires_at")
    .eq("token", token)
    .single();

  if (error || !link) {
    return res.status(404).json({ error: "Invalid access link" });
  }

  // 2️⃣ Check active flag
  if (!link.is_active) {
    return res.status(410).json({ error: "Access link revoked" });
  }

  // 3️⃣ Check expiration ONLY if expires_at exists
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return res.status(410).json({ error: "Access link expired" });
  }

  // 🚫 DO NOT invalidate the link here (important)
  // We will handle sessions / one-time use later

  // 4️⃣ Resolve client slug
  const { data: client } = await supabase
    .from("clients")
    .select("slug")
    .eq("id", link.client_id)
    .single();

  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }

  // 5️⃣ Success
  return res.json({ slug: client.slug });
});

export default router;
