export function generateSlug(item) {
  if (!item) return "notice";
  if (item.slug) return item.slug;

  const base = `${item.department || "bihar"}-${item.title || item.id || "update"}`;

  return base
    .toLowerCase()
    .trim()
    // \p{L}: Letters, \p{M}: Marks/Matras, \p{N}: Numbers, preserve spaces, underscores, hyphens
    .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, "")
    // Spaces aur underscores ko hyphens me badle
    .replace(/[\s_]+/g, "-")
    // Consecutive hyphens ko single hyphen karein aur start/end hyphens hatayein
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/, "") || "notice";
}