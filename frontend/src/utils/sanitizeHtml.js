export function addExternalLinkSafety(sanitizedHtml) {
  if (typeof document === "undefined") {
    return sanitizedHtml;
  }

  const template = document.createElement("template");
  template.innerHTML = sanitizedHtml;

  template.content.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    let isExternal = false;

    try {
      const url = new URL(href, window.location.origin);
      isExternal = /^https?:$/.test(url.protocol) && url.origin !== window.location.origin;
    } catch {
      isExternal = false;
    }

    if (isExternal) {
      anchor.setAttribute("target", "_blank");
    }

    if (anchor.getAttribute("target") === "_blank") {
      const rel = new Set((anchor.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      anchor.setAttribute("rel", Array.from(rel).join(" "));
    }
  });

  return template.innerHTML;
}
