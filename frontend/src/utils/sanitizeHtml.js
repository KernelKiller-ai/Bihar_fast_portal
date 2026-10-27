export function stripMarkdownArtifacts(html) {
  return String(html)
    .replace(/(?:&#96;|&grave;)/gi, "`")
    .replace(/```[^\S\r\n]*(?:html?|markdown|md)?[^\S\r\n]*(?:\r?\n)?/gi, "")
    .replace(/```/g, "")
    .replace(/`([^`\r\n]+)`/g, "$1")
    .replace(/`+/g, "");
}

export function addExternalLinkSafety(sanitizedHtml) {
  const cleanHtml = stripMarkdownArtifacts(sanitizedHtml);
  if (typeof document === "undefined") {
    return cleanHtml;
  }

  const template = document.createElement("template");
  template.innerHTML = cleanHtml;

  template.content.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    let isExternal;
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
