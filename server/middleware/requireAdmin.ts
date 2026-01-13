import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { supabase } from "../lib/supabase";

const SUPABASE_PROJECT_URL = process.env.SUPABASE_URL!;
const SUPABASE_ISSUER = `${SUPABASE_PROJECT_URL}/auth/v1`;
const SUPABASE_JWKS_URI = `${SUPABASE_PROJECT_URL}/auth/v1/keys`;

const client = jwksClient({
  jwksUri: SUPABASE_JWKS_URI,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  jwt.verify(
    token,
    getKey,
    {
      audience: "authenticated",
      issuer: SUPABASE_ISSUER,
      algorithms: ["RS256"],
    },
    async (err, decoded: any) => {
      if (err || !decoded?.sub) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // 🔑 Check role from profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", decoded.sub)
        .single();

      if (error || profile?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      // Attach user id to request (optional but useful)
      (req as any).userId = decoded.sub;

      next();
    }
  );
}
