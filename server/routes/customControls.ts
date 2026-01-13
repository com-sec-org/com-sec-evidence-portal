import { Request, Response } from "express";
import { supabase } from "../lib/supabase";

export async function addCustomControl(req: Request, res: Response) {
  const { slug } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const { data, error } = await supabase
    .from("controls")
    .insert({
      control_id: `CUSTOM-${Date.now()}`,
      title,
      description,
      is_custom: true,
      client_slug: slug,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}
