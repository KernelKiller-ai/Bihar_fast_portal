import { formatSeoTitle } from "../src/utils/seoConfig.js";

const BACKEND_URL = (globalThis.process?.env?.VITE_API_BASE_URL || "https://bihar-fast-portal.onrender.com").replace(/\/+$/, "");
const SITE_URL = "https://biharfast.in";
const UPSTREAM_TIMEOUT_MS = 4500;
const MINIMUM_ARTICLE_WORDS = 300;
const ALLOWED_CONTENT_TAGS = new Set([
  "a", "b", "blockquote", "br", "caption", "dd", "div", "dl", "dt", "em",
  "h2", "h3", "h4", "hr", "i", "li", "ol", "p", "span", "strong", "table",
  "tbody", "td", "th", "thead", "tr", "u", "ul",
]);
const VOID_CONTENT_TAGS = new Set(["br", "hr"]);
const BLOCKED_CONTENT_ELEMENTS = /<(script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function preserveHtmlEntities(value) {
  return String(value).replace(/&(?!(?:#\d+|#x[\da-f]+|[a-z][\da-z]+);)/gi, "&amp;");
}

function textContent(value = "") {
  return String(value)
    .replace(BLOCKED_CONTENT_ELEMENTS, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function plainText(value, fallback = "") {
  return textContent(value || fallback);
}

function safeExternalUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function sanitizeRichHtml(value = "") {
  const input = String(value).replace(BLOCKED_CONTENT_ELEMENTS, "");
  const tokens = input.match(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>|[^<]+|</gi) || [];

  return tokens.map((token) => {
    if (token.startsWith("<!--")) return "";
    if (token === "<") return "&lt;";
    if (!token.startsWith("<")) return preserveHtmlEntities(token);

    const match = token.match(/^<(\/?)\s*([a-z][a-z0-9-]*)\b([^>]*)>$/i);
    if (!match) return escapeHtml(token);

    const [, closing, rawTagName, rawAttributes] = match;
    const tagName = rawTagName.toLowerCase();
    if (!ALLOWED_CONTENT_TAGS.has(tagName)) return "";
    if (closing) return VOID_CONTENT_TAGS.has(tagName) ? "" : `</${tagName}>`;
    if (VOID_CONTENT_TAGS.has(tagName)) return `<${tagName}>`;

    if (tagName === "a") {
      const href = rawAttributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const safeUrl = safeExternalUrl(href?.[1] ?? href?.[2] ?? href?.[3] ?? "");
      if (safeUrl) {
        return `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer nofollow">`;
      }
    }

    return `<${tagName}>`;
  }).join("");
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
  throw new Error("HTML shell is missing a closing head element");
}

function setTitle(html, title) {
  const escapedTitle = escapeHtml(title);
  if (/<title\b[^>]*>[\s\S]*?<\/title\s*>/i.test(html)) {
    return html.replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/i, `<title>${escapedTitle}</title>`);
  }
  return insertIntoHead(html, `<title>${escapedTitle}</title>`);
}

function setMeta(html, key, value, content) {
  let found = false;
  const updated = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    if (found || getAttribute(tag, key)?.toLowerCase() !== value.toLowerCase()) return tag;
    found = true;
    return setAttribute(tag, "content", content);
  });
  if (found) return updated;
  return insertIntoHead(updated, `<meta ${key}="${escapeHtml(value)}" content="${escapeHtml(content)}">`);
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

function setJsonLd(html, schema) {
  const serializedSchema = JSON.stringify(schema).replace(/</g, "\\u003c");
  const script = `<script id="article-schema" type="application/ld+json">${serializedSchema}</script>`;
  const existingScript = /<script\b(?=[^>]*\bid=["']article-schema["'])[^>]*>[\s\S]*?<\/script\s*>/i;
  if (existingScript.test(html)) return html.replace(existingScript, script);
  return insertIntoHead(html, script);
}

function postMetadata(post, slug) {
  const postTitle = plainText(post?.title, slug.replace(/[-_]+/g, " "));
  const metaTitle = plainText(post?.meta_title);
  const title = formatSeoTitle(metaTitle || `${postTitle || "BiharFast Update"} - BiharFast`);
  const metaDescription = plainText(post?.meta_desc);
  const shortDescription = plainText(post?.short_desc).slice(0, 155);
  const description = (metaDescription || shortDescription
    || `${post?.department || "Bihar"}: ${postTitle}. Official details and updates on BiharFast.`).slice(0, 300);
  const image = safeExternalUrl(post?.image_url || post?.thumbnail_url);

  return { title, description, image };
}

function postDate(post) {
  const value = post?.published_at || post?.created_at || post?.updated_at;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date) {
  if (!date) return "प्रकाशन तिथि उपलब्ध नहीं";
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function renderListSection(heading, items) {
  if (!Array.isArray(items) || items.length === 0) return "";
  const listItems = items
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => `<li>${escapeHtml(plainText(item))}</li>`)
    .join("");
  return listItems ? `<section><h2>${escapeHtml(heading)}</h2><ol>${listItems}</ol></section>` : "";
}

function renderFaqs(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return "";
  const entries = faqs.map((faq) => {
    if (!faq || typeof faq !== "object") return "";
    const question = plainText(faq.q || faq.question || faq.title);
    const answer = plainText(faq.a || faq.answer || faq.text);
    if (!question || !answer) return "";
    return `<article><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`;
  }).join("");
  return entries ? `<section><h2>अक्सर पूछे जाने वाले प्रश्न</h2>${entries}</section>` : "";
}

function renderPostBody(post, slug) {
  const metadata = postMetadata(post, slug);
  const date = postDate(post);
  const category = plainText(post.category || post.type, "सूचना");
  const title = plainText(post.title, slug.replace(/[-_]+/g, " ")) || "BiharFast Update";
  const department = plainText(post.department, "संबंधित विभाग");
  const summary = plainText(post.short_desc);
  const content = sanitizeRichHtml(post.content || "");
  const articleContent = content || (summary ? `<p>${escapeHtml(summary)}</p>` : "");
  const totalPosts = plainText(post.total_posts || post.totalPosts, "आधिकारिक अधिसूचना देखें");
  const importantDate = plainText(post.last_date || post.lastDate, "आधिकारिक अधिसूचना देखें");
  const eligibility = plainText(post.eligibility || post.qualification_details, "आधिकारिक अधिसूचना देखें");
  const pdfUrl = safeExternalUrl(post.official_pdf || post.official_pdf_url || post.pdf_url || post.pdfUrl);
  const applicationUrl = safeExternalUrl(post.apply_url || post.applyUrl || post.download_url);
  const publishedDate = formatDate(date);
  const howToApply = renderListSection("आवेदन कैसे करें", post.how_to_apply);
  const selectionProcess = renderListSection("चयन प्रक्रिया और परीक्षा विवरण", post.selection_process);
  const faqs = renderFaqs(post.faqs || post.extra_links);

  const body = `<main class="post-seo-content">
  <article>
    <header>
      <p class="post-category">${escapeHtml(category)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p>विभाग: ${escapeHtml(department)} · प्रकाशित: <time${date ? ` datetime="${date.toISOString()}"` : ""}>${escapeHtml(publishedDate)}</time></p>
    </header>
    <section aria-labelledby="post-summary">
      <h2 id="post-summary">मुख्य विवरण</h2>
      <dl>
        <dt>कुल पद / लाभ</dt><dd>${escapeHtml(totalPosts)}</dd>
        <dt>महत्वपूर्ण तिथि</dt><dd>${escapeHtml(importantDate)}</dd>
        <dt>पात्रता</dt><dd>${escapeHtml(eligibility)}</dd>
      </dl>
    </section>
    <section aria-labelledby="notice-details">
      <h2 id="notice-details">सूचना का विस्तृत विवरण</h2>
      ${articleContent}
    </section>
    ${howToApply}
    ${selectionProcess}
    ${faqs}
    ${(applicationUrl || pdfUrl) ? `<nav aria-label="आधिकारिक सूचना लिंक">
      <h2>आधिकारिक स्रोत और आवेदन</h2>
      ${applicationUrl ? `<p><a class="official-action" href="${escapeHtml(applicationUrl)}" target="_blank" rel="noopener noreferrer">आधिकारिक आवेदन / परिणाम पोर्टल खोलें</a></p>` : ""}
      ${pdfUrl ? `<p><a class="official-action" href="${escapeHtml(pdfUrl)}" target="_blank" rel="noopener noreferrer">आधिकारिक अधिसूचना PDF देखें</a></p>` : ""}
    </nav>` : ""}
    <footer>
      <h2>आवेदन से पहले आधिकारिक सूचना की पुष्टि करें</h2>
      <p>BiharFast एक स्वतंत्र सूचना पोर्टल है, सरकारी विभाग या भर्ती एजेंसी नहीं। इस पृष्ठ पर दी गई जानकारी को संबंधित विभाग की मूल अधिसूचना के साथ मिलाकर पढ़ें। अंतिम तिथि, पदों की संख्या, आयु सीमा, आरक्षण, योग्यता, शुल्क और आवेदन की प्रक्रिया विभाग द्वारा संशोधित की जा सकती है। किसी भी अंतर की स्थिति में विभाग की वेबसाइट और नवीनतम आधिकारिक PDF को प्राथमिकता दें।</p>
      <p>आवेदन शुरू करने से पहले पात्रता की प्रत्येक शर्त ध्यान से जांचें और अपने प्रमाणपत्रों में दर्ज नाम, जन्मतिथि तथा अन्य विवरणों से तुलना करें। आवेदन संख्या, भुगतान रसीद और जमा किए गए फॉर्म की प्रति सुरक्षित रखें। केवल आधिकारिक पोर्टल पर ही व्यक्तिगत जानकारी या शुल्क दें; किसी अनधिकृत व्यक्ति को OTP, पासवर्ड या भुगतान विवरण साझा न करें।</p>
      <p>तिथियों और लिंक की उपलब्धता बदल सकती है। पोर्टल पर दिखाई गई जानकारी को अंतिम रूप से मानने के बजाय विभाग से पुनः सत्यापित करें। यदि आपको इस सारांश में कोई त्रुटि, पुराना लिंक या अस्पष्ट विवरण मिले, तो BiharFast के संपर्क पृष्ठ से सुधार का अनुरोध करें और संभव हो तो संबंधित विभाग की आधिकारिक सूचना संलग्न करें।</p>
    </footer>
  </article>
</main>`;

  return {
    body,
    wordCount: (textContent([
      category,
      title,
      department,
      summary,
      totalPosts,
      importantDate,
      eligibility,
      articleContent,
      howToApply,
      selectionProcess,
      faqs,
    ].join(" ")).match(/[\p{L}\p{N}]+/gu) || []).length,
    metadata,
    title,
    date,
  };
}

function replaceRootContent(html, body) {
  const openingTagPattern = /<div\b[^>]*>/gi;
  let openingTag;
  let rootStart = -1;
  let rootContentStart = -1;

  while ((openingTag = openingTagPattern.exec(html))) {
    if (getAttribute(openingTag[0], "id")?.toLowerCase() === "root") {
      rootStart = openingTag.index;
      rootContentStart = openingTagPattern.lastIndex;
      break;
    }
  }
  if (rootStart < 0) throw new Error("HTML shell is missing the root element");

  const divTokens = /<!--[\s\S]*?-->|<div\b[^>]*>|<\/div\s*>/gi;
  divTokens.lastIndex = rootContentStart;
  let depth = 1;
  let token;
  while ((token = divTokens.exec(html))) {
    if (token[0].startsWith("<!--")) continue;
    if (/^<div\b/i.test(token[0])) {
      depth += 1;
    } else {
      depth -= 1;
      if (depth === 0) {
        return `${html.slice(0, rootContentStart)}${body}${html.slice(token.index)}`;
      }
    }
  }

  throw new Error("HTML shell has an unterminated root element");
}

function applyPostMetadata(html, metadata, canonicalUrl, schema, { noindex = false } = {}) {
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
  output = setMeta(output, "property", "og:image", metadata.image || `${SITE_URL}/logo-512.png`);
  output = setMeta(output, "name", "twitter:image", metadata.image || `${SITE_URL}/logo-512.png`);
  output = setMeta(output, "name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  if (schema) output = setJsonLd(output, schema);
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
  if (statusCode !== 200) res.setHeader("X-Robots-Tag", "noindex, nofollow");
  else res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large");
  res.end(html);
}

function errorHtml({ title, description, canonicalUrl, message }) {
  const metadata = { title, description, image: null };
  let html = `<!doctype html>
<html lang="hi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  </head>
  <body><div id="root"><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><p><a href="/">बिहारफास्ट के होम पेज पर लौटें</a></p></main></div></body>
</html>`;
  html = applyPostMetadata(html, metadata, canonicalUrl, null, { noindex: true });
  return html;
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
  if (!slug || slug === "undefined") {
    sendHtml(res, 404, errorHtml({
      title: "Post Not Found - BiharFast",
      description: "यह सूचना उपलब्ध नहीं है।",
      canonicalUrl,
      message: "यह सूचना नहीं मिली। लिंक हटाया गया हो सकता है या गलत हो सकता है।",
    }));
    return;
  }

  let post;
  try {
    const { response, payload } = await fetchPost(slug);
    if (response.status === 404) {
      sendHtml(res, 404, errorHtml({
        title: "Post Not Found - BiharFast",
        description: "यह सूचना उपलब्ध नहीं है।",
        canonicalUrl,
        message: "यह सूचना नहीं मिली। लिंक हटाया गया हो सकता है या गलत हो सकता है।",
      }));
      return;
    }
    if (!response.ok) {
      throw new Error(`Post API returned HTTP ${response.status}`);
    }
    if (!payload?.success || !payload.data || typeof payload.data !== "object") {
      throw new Error("Post API returned an invalid post payload");
    }
    post = payload.data;
  } catch (error) {
    console.error("Post SEO upstream fetch failed:", error);
    sendHtml(res, 503, errorHtml({
      title: "Temporarily Unavailable - BiharFast",
      description: "यह सूचना अभी अस्थायी रूप से उपलब्ध नहीं है।",
      canonicalUrl,
      message: "सूचना सेवा इस समय उपलब्ध नहीं है। कृपया कुछ देर बाद पुनः प्रयास करें।",
    }));
    return;
  }

  try {
    const rendered = renderPostBody(post, slug);
    if (rendered.wordCount < MINIMUM_ARTICLE_WORDS) {
      console.error(`Post SEO rejected thin post ${slug}: ${rendered.wordCount} rendered words`);
      sendHtml(res, 503, errorHtml({
        title: "Content Temporarily Unavailable - BiharFast",
        description: "इस सूचना का विस्तृत विवरण तैयार किया जा रहा है।",
        canonicalUrl,
        message: "इस सूचना का पूरा विवरण अभी उपलब्ध नहीं है। कृपया कुछ देर बाद पुनः प्रयास करें।",
      }));
      return;
    }

    let shell = await fetchSpaShell(req);
    shell = replaceRootContent(shell, rendered.body);
    const schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: rendered.title,
      description: rendered.metadata.description,
      url: canonicalUrl,
      datePublished: rendered.date?.toISOString(),
      dateModified: postDate({ updated_at: post.updated_at })?.toISOString(),
      image: rendered.metadata.image ? [rendered.metadata.image] : undefined,
      author: {
        "@type": "Organization",
        name: plainText(post.author_name, "BiharFast Editorial Team"),
      },
      publisher: {
        "@type": "Organization",
        name: "BiharFast",
        url: SITE_URL,
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    };
    const html = applyPostMetadata(shell, rendered.metadata, canonicalUrl, schema);
    sendHtml(res, 200, html, { cacheable: true });
  } catch (error) {
    console.error("Post SEO HTML rendering failed:", error);
    sendHtml(res, 503, errorHtml({
      title: "Temporarily Unavailable - BiharFast",
      description: "यह सूचना अभी अस्थायी रूप से उपलब्ध नहीं है।",
      canonicalUrl,
      message: "सूचना पृष्ठ तैयार नहीं हो सका। कृपया कुछ देर बाद पुनः प्रयास करें।",
    }));
  }
}
