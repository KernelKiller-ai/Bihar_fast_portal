import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMetadataForPath } from "../utils/seoConfig";
import { updateHeadMetadata } from "../utils/seo";

/**
 * RouteSEO Component
 * Automatically listens to route changes and applies centralized SEO metadata
 * for all static pages, hubs, categories, and aliases without duplicating tags.
 */
export default function RouteSEO() {
  const location = useLocation();

  useEffect(() => {
    const meta = getMetadataForPath(location.pathname);
    if (meta) {
      updateHeadMetadata({
        title: meta.title,
        description: meta.description,
        canonical: meta.canonical,
        robots: meta.robots,
        ogType: meta.ogType,
      });
    }
  }, [location.pathname]);

  return null;
}

