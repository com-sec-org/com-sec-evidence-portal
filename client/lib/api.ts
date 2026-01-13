const API_BASE = "http://localhost:3001/api";

/**
 * =========================
 * CLIENTS (ADMIN)
 * =========================
 */

export async function fetchClients() {
  const res = await fetch(`${API_BASE}/admin/clients`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch clients");
  }

  return res.json();
}

export async function fetchClientBySlug(slug: string) {
  const res = await fetch(
    `${API_BASE}/admin/clients/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Client not found");
  }

  return res.json();
}

/**
 * =========================
 * CONTROLS (ADMIN)
 * =========================
 * RETURNS ALL CONTROLS (SOC2 + CUSTOM)
 */

export async function fetchAdminClientControls(slug: string) {
  const res = await fetch(
    `${API_BASE}/admin/clients/${slug}/controls`,
    {
      cache: "no-store", // ✅ THIS IS THE KEY FIX
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch admin client controls");
  }

  // ✅ RETURN BACKEND RESPONSE AS-IS
  // Backend already sends:
  // { controlId, title, description, scope, is_custom }
  return res.json();
}

/**
 * =========================
 * CONTROLS (CLIENT)
 * =========================
 */

export async function fetchClientControls(slug: string) {
  const res = await fetch(
    `${API_BASE}/clients/${slug}/controls`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch client controls");
  }

  return res.json();
}

/**
 * =========================
 * EVIDENCE (CLIENT)
 * =========================
 */

export async function getEvidence(slug: string, controlId: string) {
  const res = await fetch(
    `${API_BASE}/clients/${slug}/controls/${controlId}/evidence`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch evidence");
  }

  return res.json();
}

export async function submitEvidence(
  slug: string,
  controlId: string,
  files: File[]
) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(
    `${API_BASE}/clients/${slug}/controls/${controlId}/evidence`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to submit evidence");
  }

  return res.json();
}

/**
 * =========================
 * EVIDENCE (ADMIN)
 * =========================
 */

export async function fetchAdminEvidenceDownloadLinks(
  slug: string,
  controlId: string
) {
  const res = await fetch(
    `${API_BASE}/admin/clients/${slug}/controls/${controlId}/evidence/download`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch evidence download links");
  }

  return res.json();
}

/**
 * =========================
 * ADMIN CLIENT STATS
 * =========================
 */

export async function fetchAdminClientStats(slug: string) {
  const res = await fetch(
    `${API_BASE}/admin/clients/${slug}/stats`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch client stats");
  }

  return res.json();
}
