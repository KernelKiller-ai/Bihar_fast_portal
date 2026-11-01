import assert from "node:assert/strict";
import test from "node:test";
import handler from "./post-seo.js";

const SHELL = `<!doctype html>
<html>
  <head>
    <title>Homepage</title>
    <meta name="description" content="Homepage description">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://biharfast.in/">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Homepage OG title">
    <meta property="og:description" content="Homepage OG description">
    <meta property="og:url" content="https://biharfast.in/">
    <meta property="og:image" content="https://biharfast.in/existing.png">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Homepage Twitter title">
    <meta name="twitter:description" content="Homepage Twitter description">
    <meta name="twitter:url" content="https://biharfast.in/">
    <meta name="twitter:image" content="https://biharfast.in/existing.png">
    <script src="/assets/app.js"></script>
  </head>
  <body><div id="root" class="app"><div class="old"><p>Old shell</p></div></div><script type="module" src="/src/main.jsx"></script></body>
</html>`;

const LONG_ARTICLE = Array.from({ length: 350 }, (_, index) =>
  `Detailed notice information paragraph ${index + 1} explains the official recruitment process and applicant requirements.`,
).join(" ");

function response(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    async json() {
      return body;
    },
    async text() {
      return body;
    },
  };
}

function createRequest(userAgent, slug = "test-post") {
  return {
    method: "GET",
    url: `/api/post-seo?slug=${encodeURIComponent(slug)}`,
    query: { slug },
    headers: {
      host: "biharfast.in",
      "x-forwarded-proto": "https",
      "user-agent": userAgent,
    },
  };
}

function createResponse() {
  const headers = {};
  return {
    headers,
    statusCode: null,
    body: null,
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
    end(body) {
      this.body = body;
    },
  };
}

async function runHandler({
  userAgent = "Mozilla/5.0",
  slug,
  apiResponse = response(200, {
    success: true,
    data: { title: "Post title", content: LONG_ARTICLE },
  }),
  apiError,
  timeout = false,
  shellError = false,
}) {
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalConsoleError = console.error;
  let timeoutMs = null;
  let shellRequests = 0;

  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes("/api/posts/")) {
      if (timeout) {
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener("abort", () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          }, { once: true });
        });
      }
      if (apiError) throw apiError;
      return apiResponse;
    }
    shellRequests += 1;
    if (shellError) return response(500, "Shell unavailable");
    assert.equal(String(url), "https://biharfast.in/index.html");
    return response(200, SHELL);
  };

  if (timeout) {
    globalThis.setTimeout = (callback, delay, ...args) => {
      if (delay === 4500) {
        timeoutMs = delay;
        queueMicrotask(() => callback(...args));
        return 1;
      }
      return originalSetTimeout(callback, delay, ...args);
    };
    globalThis.clearTimeout = () => {};
  }

  console.error = () => {};
  const res = createResponse();
  try {
    await handler(createRequest(userAgent, slug), res);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    console.error = originalConsoleError;
  }
  return { res, timeoutMs, shellRequests };
}

function getMeta(html, attribute, name) {
  const tag = html.match(new RegExp(`<meta\\b(?=[^>]*\\b${attribute}="${name}")[^>]*>`, "i"))?.[0];
  return tag?.match(/\bcontent="([^"]*)"/i)?.[1] || null;
}

function getCanonical(html) {
  return html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*\bhref="([^"]*)"/i)?.[1] || null;
}

function getTitle(html) {
  return html.match(/<title>(.*?)<\/title>/i)?.[1] || null;
}

function getRootContent(html) {
  const opening = html.match(/<div\b(?=[^>]*\bid="root")[^>]*>/i);
  assert.ok(opening, "HTML must contain a root element");
  const start = opening.index + opening[0].length;
  const tokenPattern = /<!--[\s\S]*?-->|<div\b[^>]*>|<\/div\s*>/gi;
  tokenPattern.lastIndex = start;
  let depth = 1;
  let token;
  while ((token = tokenPattern.exec(html))) {
    if (token[0].startsWith("<!--")) continue;
    if (/^<div\b/i.test(token[0])) depth += 1;
    else if (--depth === 0) return html.slice(start, token.index);
  }
  assert.fail("Root element is not closed");
}

function visibleWordCount(html) {
  return (html.replace(/<[^>]*>/g, " ").match(/[\p{L}\p{N}]+/gu) || []).length;
}

function getArticleSchema(html) {
  const match = html.match(/<script id="article-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  return match ? JSON.parse(match[1]) : null;
}

function selectedMetadata(html) {
  return {
    title: getTitle(html),
    description: getMeta(html, "name", "description"),
    canonical: getCanonical(html),
    ogType: getMeta(html, "property", "og:type"),
    ogTitle: getMeta(html, "property", "og:title"),
    ogDescription: getMeta(html, "property", "og:description"),
    ogUrl: getMeta(html, "property", "og:url"),
    ogImage: getMeta(html, "property", "og:image"),
    twitterCard: getMeta(html, "name", "twitter:card"),
    twitterTitle: getMeta(html, "name", "twitter:title"),
    twitterDescription: getMeta(html, "name", "twitter:description"),
    twitterUrl: getMeta(html, "name", "twitter:url"),
    twitterImage: getMeta(html, "name", "twitter:image"),
  };
}

test("browser and crawlers receive the same complete server-rendered article", async () => {
  const apiResponse = response(200, {
    success: true,
    data: {
      title: "Post title",
      meta_title: "SEO post title",
      meta_desc: "SEO description",
      category: "jobs",
      department: "BPSC",
      total_posts: "120 posts",
      last_date: "30 November 2026",
      eligibility: "Graduation",
      created_at: "2026-10-01T10:00:00Z",
      content: `<p>${LONG_ARTICLE}</p>`,
      apply_url: "https://bpsc.bihar.gov.in/apply",
      pdf_url: "https://bpsc.bihar.gov.in/notice.pdf",
    },
  });
  const browser = await runHandler({ userAgent: "Mozilla/5.0", apiResponse });
  const googlebot = await runHandler({ userAgent: "Googlebot/2.1", apiResponse });
  const root = getRootContent(browser.res.body);

  assert.deepEqual(selectedMetadata(browser.res.body), selectedMetadata(googlebot.res.body));
  assert.equal(browser.res.statusCode, 200);
  assert.equal(browser.res.headers["cache-control"], "public, s-maxage=300, stale-while-revalidate=600");
  assert.equal(browser.res.headers["x-robots-tag"], "index, follow, max-image-preview:large");
  assert.equal(getCanonical(browser.res.body), "https://biharfast.in/post/test-post");
  assert.ok(visibleWordCount(root) > 300);
  assert.match(root, /<h1>Post title<\/h1>/);
  assert.match(root, /120 posts/);
  assert.match(root, /30 November 2026/);
  assert.match(root, /Graduation/);
  assert.match(root, /href="https:\/\/bpsc\.bihar\.gov\.in\/apply"/);
  assert.match(root, /href="https:\/\/bpsc\.bihar\.gov\.in\/notice\.pdf"/);
  assert.doesNotMatch(root, /Old shell/);
  assert.match(browser.res.body, /<script src="\/assets\/app\.js"><\/script>/);

  const schema = getArticleSchema(browser.res.body);
  assert.equal(schema["@context"], "https://schema.org");
  assert.equal(schema["@type"], "NewsArticle");
  assert.equal(schema.headline, "Post title");
  assert.ok(browser.res.body.indexOf('id="article-schema"') < browser.res.body.indexOf("</head>"));
});

test("uses SEO metadata and image while escaping unsafe post markup", async () => {
  const { res } = await runHandler({
    userAgent: "WhatsApp",
    apiResponse: response(200, {
      success: true,
      data: {
        title: `A "quoted" <title> & update`,
        meta_title: "Custom SEO title",
        meta_desc: "Description",
        image_url: "https://biharfast.in/post-image.png",
        content: `<p>${LONG_ARTICLE}</p><script>alert(1)</script><a href="javascript:alert(1)">unsafe</a>`,
      },
    }),
  });

  assert.equal(getTitle(res.body), "Custom SEO title");
  assert.equal(getMeta(res.body, "property", "og:image"), "https://biharfast.in/post-image.png");
  assert.equal(getMeta(res.body, "name", "twitter:image"), "https://biharfast.in/post-image.png");
  assert.doesNotMatch(getRootContent(res.body), /<script>alert/);
  assert.doesNotMatch(getRootContent(res.body), /href="javascript:/i);
  assert.match(res.body, /A &quot;quoted&quot; &amp; update/);
  assert.doesNotMatch(getRootContent(res.body), /<title>/i);
});

test("uses safe title and description fallbacks when SEO fields are absent", async () => {
  const { res } = await runHandler({
    apiResponse: response(200, {
      success: true,
      data: {
        title: "Post title",
        short_desc: `<b>${"notice summary ".repeat(20)}</b>`,
        content: LONG_ARTICLE,
      },
    }),
  });

  assert.equal(getTitle(res.body), "Post title - BiharFast");
  assert.equal(getMeta(res.body, "name", "description"), "notice summary ".repeat(20).trim().slice(0, 155));
  assert.equal(getMeta(res.body, "property", "og:image"), "https://biharfast.in/logo-512.png");
});

test("backend 404 returns explicit noindex 404 HTML without fetching the SPA shell", async () => {
  const { res, shellRequests } = await runHandler({
    slug: "missing-post",
    apiResponse: response(404, {}),
  });

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers["x-robots-tag"], "noindex, nofollow");
  assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");
  assert.equal(getTitle(res.body), "Post Not Found - BiharFast");
  assert.equal(getMeta(res.body, "name", "robots"), "noindex, nofollow");
  assert.match(getRootContent(res.body), /यह सूचना नहीं मिली/);
  assert.equal(shellRequests, 0);
});

test("backend errors and invalid payloads return explicit noindex 503 responses", async (t) => {
  const cases = [
    ["HTTP 503", { apiResponse: response(503, {}) }],
    ["network error", { apiError: new Error("network unavailable") }],
    ["invalid payload", { apiResponse: response(200, { success: false }) }],
  ];

  for (const [label, options] of cases) {
    await t.test(label, async () => {
      const { res, shellRequests } = await runHandler(options);
      assert.equal(res.statusCode, 503);
      assert.equal(res.headers["x-robots-tag"], "noindex, nofollow");
      assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");
      assert.equal(getMeta(res.body, "name", "robots"), "noindex, nofollow");
      assert.match(getRootContent(res.body), /कृपया कुछ देर बाद पुनः प्रयास करें/);
      assert.equal(shellRequests, 0);
    });
  }
});

test("upstream timeout aborts after 4.5 seconds and returns 503", async () => {
  const { res, timeoutMs, shellRequests } = await runHandler({
    userAgent: "Twitterbot",
    slug: "timeout-post",
    timeout: true,
  });

  assert.equal(timeoutMs, 4500);
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers["x-robots-tag"], "noindex, nofollow");
  assert.equal(getMeta(res.body, "name", "robots"), "noindex, nofollow");
  assert.equal(shellRequests, 0);
});

test("pages with fewer than 301 rendered words are not served as indexable posts", async () => {
  const { res, shellRequests } = await runHandler({
    apiResponse: response(200, {
      success: true,
      data: { title: "Short post", content: "<p>Brief notice.</p>" },
    }),
  });

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers["x-robots-tag"], "noindex, nofollow");
  assert.equal(getTitle(res.body), "Content Temporarily Unavailable - BiharFast");
  assert.equal(shellRequests, 0);
});

test("SPA shell failure returns non-indexable 503 instead of a thin success", async () => {
  const { res } = await runHandler({ shellError: true });

  assert.equal(res.statusCode, 503);
  assert.equal(res.headers["x-robots-tag"], "noindex, nofollow");
  assert.equal(getMeta(res.body, "name", "robots"), "noindex, nofollow");
});

test("unsupported methods are rejected", async () => {
  const res = createResponse();
  await handler({ method: "POST", headers: {}, query: {} }, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, "GET");
  assert.equal(res.body, "Method Not Allowed");
});
