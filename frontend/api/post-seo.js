const BACKEND_URL = "https://bihar-fast-portal.onrender.com";
const SITE_URL = "https://biharfast.in";
const UPSTREAM_TIMEOUT_MS = 6000;

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function textContent(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeURIComponentSafely(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getSlug(req) {
  const querySlug = req.query?.slug;
  if (querySlug) return decodeURIComponentSafely(String(querySlug));

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "biharfast.in";
  const path = new URL(req.url, `${protocol}://${host}`).pathname;
  return decodeURIComponentSafely(path.split("/").filter(Boolean).pop() || "");
}

function slugTitle(slug) {
  const words = textContent(slug.replace(/[-_]+/g, " "));
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "BiharFast Update";
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
}

function setAttribute(tag, name, value) {
  const escapedValue = escapeHtml(value);
  const attributePattern = new RegExp(`(\\s${name}\\s*=\\s*)(["'])(.*?)\\2`, "i");
  if (attributePattern.test(tag)) {
    return tag.replace(attributePattern, (_match, prefix) => `${prefix}"${escapedValue}"`);
  }
  return tag.replace(/\s*\/?>$/, (ending) => ` ${name}="${escapedValue}"${ending}`);
}

function insertIntoHead(html, markup) {
  if (/<\/head\s*>/i.test(html)) {
    return html.replace(/<\/head\s*>/i, `${markup}\n  </head>`);
  }
  return `${markup}\n${html}`;
}

function setTitle(html, title) {
  const escapedTitle = escapeHtml(title);
  if (/<title\b[^>]*>[\s\S]*?<\/title\s*>/i.test(html)) {
    return html.replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/i, `<title>${escapedTitle}</title>`);
  }
  return insertIntoHead(html, `<title>${escapedTitle}</title>`);
}

function setMeta(html, key, value, content) {
  const escapedContent = escapeHtml(content);
  let found = false;
  const updated = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    if (found || getAttribute(tag, key)?.toLowerCase() !== value.toLowerCase()) return tag;
    found = true;
    return setAttribute(tag, "content", content);
  });
  if (found) return updated;
  return insertIntoHead(updated, `<meta ${key}="${escapeHtml(value)}" content="${escapedContent}">`);
}

function setCanonical(html, canonicalUrl) {
  let found = false;
  const updated = html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (found || getAttribute(tag, "rel")?.toLowerCase() !== "canonical") return tag;
    found = true;
    return setAttribute(tag, "href", canonicalUrl);
  });
  if (found) return updated;
  return insertIntoHead(updated, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`);
}

function readMeta(html, key, value) {
  const tag = html.match(new RegExp(`<meta\\b(?=[^>]*\\b${key}=["']${value}["'])[^>]*>`, "i"))?.[0];
  return tag ? getAttribute(tag, "content") : null;
}

function postMetadata(post, slug) {
  const postTitle = typeof post?.title === "string" && post.title.trim()
    ? post.title.trim()
    : slugTitle(slug);
  const metaTitle = typeof post?.meta_title === "string" ? post.meta_title.trim() : "";
  const title = metaTitle || `${postTitle} - BiharFast`;

  const metaDescription = typeof post?.meta_desc === "string" ? post.meta_desc.trim() : "";
  const shortDescription = textContent(post?.short_desc || "").slice(0, 155);
  const description = metaDescription
    || shortDescription
    || `${post?.department || "Bihar"}: ${postTitle}. Official details and updates on BiharFast.`;

  return {
    title,
    description,
    image: typeof post?.image_url === "string" ? post.image_url.trim() : "",
  };
}

function fallbackMetadata(slug) {
  const title = slugTitle(slug);
  return {
    title: `${title} - BiharFast`,
    description: `Latest ${title} updates and official details from BiharFast.`,
    image: "",
  };
}

function applyPostMetadata(html, metadata, canonicalUrl, { noindex = false } = {}) {
  const existingOgImage = readMeta(html, "property", "og:image");
  const existingTwitterImage = readMeta(html, "name", "twitter:image");
  let output = setTitle(html, metadata.title);
  output = setMeta(output, "name", "description", metadata.description);
  output = setCanonical(output, canonicalUrl);
  output = setMeta(output, "property", "og:type", "article");
  output = setMeta(output, "property", "og:title", metadata.title);
  output = setMeta(output, "property", "og:description", metadata.description);
  output = setMeta(output, "property", "og:url", canonicalUrl);
  output = setMeta(output, "name", "twitter:card", "summary_large_image");
  output = setMeta(output, "name", "twitter:title", metadata.title);
  output = setMeta(output, "name", "twitter:description", metadata.description);
  output = setMeta(output, "name", "twitter:url", canonicalUrl);
  if (metadata.image) {
    output = setMeta(output, "property", "og:image", metadata.image);
    output = setMeta(output, "name", "twitter:image", metadata.image);
  } else {
    if (!existingOgImage) {
      output = setMeta(output, "property", "og:image", existingTwitterImage || `${SITE_URL}/logo-512.png`);
    }
    if (!existingTwitterImage) {
      output = setMeta(output, "name", "twitter:image", existingOgImage || `${SITE_URL}/logo-512.png`);
    }
  }
  if (noindex) output = setMeta(output, "name", "robots", "noindex, nofollow");
  return output;
}

function sendHtml(res, statusCode, html, { cacheable = false } = {}) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    statusCode === 200 && cacheable
      ? "public, s-maxage=300, stale-while-revalidate=600"
      : "no-cache, no-store, must-revalidate",
  );
  if (statusCode === 404) res.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (statusCode === 200) res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large");
  res.end(html);
}

function unavailableHtml(slug, canonicalUrl, { noindex = false } = {}) {
  const metadata = fallbackMetadata(slug);
  const robots = noindex ? '<meta name="robots" content="noindex, nofollow">' : "";
  return `<!doctype html>
<html lang="hi">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(metadata.title)}</title>
    <meta name="description" content="${escapeHtml(metadata.description)}">
    ${robots}
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">
  </head>
  <body><main><h1>${escapeHtml(metadata.title)}</h1><p>यह सूचना अस्थायी रूप से उपलब्ध नहीं है।</p></main></body>
</html>`;
}

async function fetchSpaShell(req) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  if (!host) throw new Error("Request host is unavailable");

  const response = await fetch(`${protocol}://${host}/index.html`);
  if (!response.ok) throw new Error(`SPA shell request failed with status ${response.status}`);
  return response.text();
}

async function fetchPost(slug) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const response = await fetch(`${BACKEND_URL}/api/posts/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
    });
    const payload = response.ok ? await response.json() : null;
    return { response, payload };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const slug = getSlug(req);
  const canonicalUrl = `${SITE_URL}/post/${encodeURIComponent(slug)}`;
  let post = null;
  let notFound = !slug || slug === "undefined";
  let cacheable = false;

  if (!notFound) {
    try {
      const { response, payload } = await fetchPost(slug);
      if (response.status === 404) {
        notFound = true;
      } else if (response.ok) {
        if (payload?.success && payload.data) {
          post = payload.data;
          cacheable = true;
        } else {
          console.error("Post SEO upstream returned an invalid post payload");
        }
      } else {
        console.error(`Post SEO upstream returned HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Post SEO upstream fetch failed:", error);
    }
  }

  let shell;
  try {
    shell = await fetchSpaShell(req);
  } catch (error) {
    console.error("Post SEO SPA shell fetch failed:", error);
    sendHtml(res, notFound ? 404 : 502, unavailableHtml(slug, canonicalUrl, { noindex: notFound }));
    return;
  }

  const metadata = post ? postMetadata(post, slug) : fallbackMetadata(slug);
  const html = applyPostMetadata(shell, metadata, canonicalUrl, { noindex: notFound });
  sendHtml(res, notFound ? 404 : 200, html, { cacheable: cacheable && !notFound });
}
