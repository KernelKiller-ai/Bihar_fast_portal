export function generateSlug(item) {
  if (!item) return "notice";
  if (item.slug) return item.slug;

  const base = `${item.department || "bihar"}-${item.title || item.id || "update"}`;

  return base
    .toLowerCase()
    .trim()
    // \p{L} aur \p{N} Hindi/Devanagari samet sabhi language characters ko preserve karte hain
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    // Spaces aur underscores ko hyphens me badle
    .replace(/[\s_]+/g, "-")
    // Consecutive hyphens ko single hyphen karein aur start/end hyphens hatayein
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "notice";
}