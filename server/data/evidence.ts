export const evidenceStore: Record<
  string,
  Record<
    string,
    {
      status: "draft" | "submitted" | "approved";
      files: string[];
    }
  >
> = {};
