/**
 * Safe Head Metadata Manager for BiharFast.in
 * Updates document.title, canonical, meta description, and social meta tags in-place.
 * Prevents conflicting duplicate tags in the DOM.
 */
import { DEFAULT_OG_IMAGE, DEFAULT_ROBOTS } from "./seoConfig";

function upsertMeta(attributeName, attributeValue, content) {
  if (typeof document === "undefined" || !content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertCanonical(href) {
  if (typeof document === "undefined" || !href) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Updates head metadata in the browser DOM.
 */
export function updateHeadMetadata({
  title,
  description,
  canonical,
  robots = DEFAULT_ROBOTS,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  schemaJson = null
}) {
  if (typeof document === "undefined") return;

  // 1. Page Title
  if (title) {
    document.title = title;
  }

  // 2. Meta Description
  if (description) {
    upsertMeta("name", "description", description);
  }

  // 3. Robots Directives
  if (robots) {
    upsertMeta("name", "robots", robots);
  }

  // 4. Absolute Self-Referencing Canonical URL
  if (canonical) {
    upsertCanonical(canonical);
  }

  // 5. OpenGraph & Social Cards
  if (title) upsertMeta("property", "og:title", title);
  if (description) upsertMeta("property", "og:description", description);
  if (canonical) upsertMeta("property", "og:url", canonical);
  if (ogType) upsertMeta("property", "og:type", ogType);
  if (ogImage) upsertMeta("property", "og:image", ogImage);

  // Twitter Card
  if (title) upsertMeta("name", "twitter:title", title);
  if (description) upsertMeta("name", "twitter:description", description);
  if (canonical) upsertMeta("name", "twitter:url", canonical);
  if (ogImage) upsertMeta("name", "twitter:image", ogImage);

  // 6. Structured Data (JSON-LD)
  if (schemaJson) {
    let script = document.getElementById("route-schema-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "route-schema-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = typeof schemaJson === "string" ? schemaJson : JSON.stringify(schemaJson);
  }
}
