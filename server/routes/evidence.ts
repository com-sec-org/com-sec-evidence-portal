import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

/**
 * Resolve client UUID from slug
 */
async function resolveClientIdBySlug(slug: string): Promise<string> {
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
 * GET — read evidence (CLIENT)
 */
export async function getEvidence(req: Request, res: Response) {
  try {
    const { slug, controlId } = req.params;
    const clientId = await resolveClientIdBySlug(slug);

    const { data, error } = await supabase
      .from("client_control_evidence")
      .select("status, files, reviewer_comment")
      .eq("client_id", clientId)
      .eq("control_id", controlId)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      evidence: data ?? {
        status: "not-started",
        files: [],
        reviewer_comment: null,
      },
    });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
}

/**
 * POST — submit evidence (CLIENT UPLOAD)
 */
export async function submitEvidence(req: Request, res: Response) {
  try {
    const { slug, controlId } = req.params;
    const clientId = await resolveClientIdBySlug(slug);

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedFiles: { path: string; name: string }[] = [];


    for (const file of files) {
      const safeName = file.originalname
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");

      const filePath = `${clientId}/${controlId}/${Date.now()}-${safeName}`;

      const { error: storageError } = await supabase.storage
        .from("evidence")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (storageError) {
        return res.status(500).json({
          error: "Storage upload failed",
          details: storageError.message,
        });
      }

      uploadedFiles.push({
        path: filePath,
        name: file.originalname, // 👈 ORIGINAL NAME PRESERVED
      });
      
    }

    const { error: dbError } = await supabase
      .from("client_control_evidence")
      .upsert(
        {
          client_id: clientId,
          control_id: controlId,
          status: "submitted",
          files: uploadedFiles,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "client_id,control_id" }
      );

    if (dbError) {
      return res.status(500).json({
        error: "Database update failed",
        details: dbError.message,
      });
    }

    res.json({
      evidence: {
        status: "submitted",
        files: uploadedFiles,
      },
    });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
}

/**
 * GET — admin download evidence
 */
export async function getEvidenceDownloadLinks(req: Request, res: Response) {
  try {
    const { slug, controlId } = req.params;
    const clientId = await resolveClientIdBySlug(slug);

    const { data, error } = await supabase
      .from("client_control_evidence")
      .select("files")
      .eq("client_id", clientId)
      .eq("control_id", controlId)
      .single();

    if (error || !data || !data.files) {
      return res.status(404).json({ error: "Evidence not found" });
    }

    const signedUrls = [];

    for (const filePath of data.files as string[]) {
      const { data: signed, error: signError } =
        await supabase.storage
          .from("evidence")
          .createSignedUrl(filePath, 60 * 10);

      if (signError) {
        return res.status(500).json({ error: signError.message });
      }

      signedUrls.push({
        path: filePath,
        url: signed.signedUrl,
      });
    }

    res.json({ files: signedUrls });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
}

/**
 * POST — admin review evidence
 */
export async function reviewEvidence(req: Request, res: Response) {
  try {
    const { slug, controlId } = req.params;
    const clientId = await resolveClientIdBySlug(slug);

    const { status, comment } = req.body;

    if (!["approved", "needs-clarification"].includes(status)) {
      return res.status(400).json({ error: "Invalid review status" });
    }

    const { error } = await supabase
      .from("client_control_evidence")
      .update({
        status,
        reviewer_comment: comment ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("client_id", clientId)
      .eq("control_id", controlId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      status,
      reviewer_comment: comment ?? null,
    });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
}
