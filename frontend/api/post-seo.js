const BACKEND_URL = "https://bihar-fast-portal.onrender.com";
const SITE_URL = "https://biharfast.in";

const BOT_USER_AGENTS = [
  "googlebot",
  "google-inspectiontool",
  "bingbot",
  "twitterbot",
  "facebookexternalhit",
  "whatsapp",
  "telegrambot"
];

function isCrawler(userAgent = "") {
  const normalizedUserAgent = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => normalizedUserAgent.includes(bot));
}

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

function getSlug(req) {
  const querySlug = req.query?.slug;
  if (querySlug) return decodeURIComponent(String(querySlug));

  const path = new URL(req.url, `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`).pathname;
  return decodeURIComponent(path.split("/").filter(Boolean).pop() || "");
}

function sendHtml(res, statusCode, html) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Robots-Tag", statusCode === 200 ? "index, follow" : "noindex, nofollow");
  res.end(html);
}

function notFoundHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex, nofollow">
    <title>Post Not Found - BiharFast</title>
  </head>
  <body>
    <main><h1>Post Not Found</h1><p>The requested post could not be found.</p></main>
  </body>
</html>`;
}

function articleHtml(post, slug) {
  const title = textContent(post.title || "BiharFast Update");
  const description = textContent(
    post.meta_desc ||
      post.short_desc ||
      `${post.department || "Bihar"}: ${title}. योग्यता, अंतिम तिथि और आवेदन लिंक यहाँ देखें।`
  ).slice(0, 160);
  const department = textContent(post.department || "Bihar Government");
  const eligibility = textContent(post.eligibility || "विज्ञापन देखें");
  const lastDate = textContent(post.last_date || post.lastDate || "सक्रिय सूचना");
  const content = textContent(post.content || post.short_desc || description);
  const canonicalUrl = `${SITE_URL}/post/${encodeURIComponent(slug)}`;
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url: canonicalUrl,
    datePublished: post.created_at || undefined,
    dateModified: post.updated_at || post.created_at || undefined,
    author: { "@type": "Organization", name: "BiharFast" },
    publisher: { "@type": "Organization", name: "BiharFast", url: SITE_URL }
  }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="hi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(`${title} - BiharFast`)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(`${title} - BiharFast`)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    <script type="application/ld+json">${schema}</script>
  </head>
  <body>
    <main>
      <article>
        <p>${escapeHtml(department)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p><strong>योग्यता:</strong> ${escapeHtml(eligibility)}</p>
        <p><strong>अंतिम तिथि:</strong> ${escapeHtml(lastDate)}</p>
        <div><p>${escapeHtml(content)}</p></div>
      </article>
    </main>
  </body>
</html>`;
}

async function serveSpa(req, res) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  if (!host) {
    sendHtml(res, 500, "<!doctype html><title>Configuration Error</title>");
    return;
  }

  const response = await fetch(`${protocol}://${host}/index.html`);
  if (!response.ok) {
    sendHtml(res, 502, "<!doctype html><title>Frontend Unavailable</title>");
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(await response.text());
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  if (!isCrawler(req.headers["user-agent"])) {
    try {
      await serveSpa(req, res);
    } catch (error) {
      console.error("SPA fallback failed:", error);
      sendHtml(res, 502, "<!doctype html><title>Frontend Unavailable</title>");
    }
    return;
  }

  const slug = getSlug(req);
  if (!slug || slug === "undefined") {
    sendHtml(res, 404, notFoundHtml());
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/posts/${encodeURIComponent(slug)}`);
    if (!response.ok) {
      sendHtml(res, response.status === 404 ? 404 : 502, notFoundHtml());
      return;
    }

    const payload = await response.json();
    if (!payload?.success || !payload.data) {
      sendHtml(res, 404, notFoundHtml());
      return;
    }

    sendHtml(res, 200, articleHtml(payload.data, slug));
  } catch (error) {
    console.error("Post SEO render failed:", error);
    sendHtml(res, 502, "<!doctype html><title>Post Unavailable</title>");
  }
}
