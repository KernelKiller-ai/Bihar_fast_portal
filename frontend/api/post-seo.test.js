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
  <body><div id="root"></div></body>
</html>`;

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

async function runHandler({ userAgent, slug, apiResponse, apiError, timeout = false }) {
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalConsoleError = console.error;
  let timeoutMs = null;

  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes("/api/posts/")) {
      if (timeout) {
        return new Promise((resolve, reject) => {
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
    assert.equal(String(url), "https://biharfast.in/index.html");
    return response(200, SHELL);
  };

  if (timeout) {
    globalThis.setTimeout = (callback, delay, ...args) => {
      if (delay === 6000) {
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
  return { res, timeoutMs };
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

test("browser and Googlebot receive identical initial post metadata", async () => {
  const apiResponse = response(200, {
    success: true,
    data: {
      title: "Post title",
      meta_title: "SEO post title",
      meta_desc: "SEO description",
    },
  });
  const browser = await runHandler({ userAgent: "Mozilla/5.0", apiResponse });
  const googlebot = await runHandler({ userAgent: "Googlebot/2.1", apiResponse });

  assert.deepEqual(selectedMetadata(browser.res.body), selectedMetadata(googlebot.res.body));
  assert.equal(browser.res.statusCode, 200);
  assert.equal(browser.res.headers["cache-control"], "public, s-maxage=300, stale-while-revalidate=600");
  assert.equal(getCanonical(browser.res.body), "https://biharfast.in/post/test-post");
  assert.match(browser.res.body, /<script src="\/assets\/app\.js"><\/script>/);
  assert.match(browser.res.body, /<body><div id="root"><\/div><\/body>/);
});

test("uses meta_title when present and post image when provided", async () => {
  const { res } = await runHandler({
    userAgent: "WhatsApp",
    apiResponse: response(200, {
      success: true,
      data: {
        title: "Post title",
        meta_title: "Custom SEO title",
        meta_desc: "Description",
        image_url: "https://biharfast.in/post-image.png",
      },
    }),
  });

  assert.equal(getTitle(res.body), "Custom SEO title");
  assert.equal(getMeta(res.body, "property", "og:image"), "https://biharfast.in/post-image.png");
  assert.equal(getMeta(res.body, "name", "twitter:image"), "https://biharfast.in/post-image.png");
});

test("falls back to post title and strips/truncates short description", async () => {
  const longDescription = `<b>${"a".repeat(170)}</b>`;
  const { res } = await runHandler({
    userAgent: "facebookexternalhit",
    apiResponse: response(200, {
      success: true,
      data: { title: "Post title", short_desc: longDescription },
    }),
  });

  assert.equal(getTitle(res.body), "Post title - BiharFast");
  assert.equal(getMeta(res.body, "name", "description"), "a".repeat(155));
  assert.equal(getMeta(res.body, "property", "og:image"), "https://biharfast.in/existing.png");
  assert.equal(getMeta(res.body, "name", "twitter:image"), "https://biharfast.in/existing.png");
});

test("upstream failure returns no-store SPA shell with slug title and self URLs", async () => {
  const { res } = await runHandler({
    userAgent: "UnknownAgent/1.0",
    slug: "bihar-police-update",
    apiResponse: response(503, {}),
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");
  assert.equal(getTitle(res.body), "Bihar police update - BiharFast");
  assert.equal(getCanonical(res.body), "https://biharfast.in/post/bihar-police-update");
  assert.equal(getMeta(res.body, "property", "og:url"), "https://biharfast.in/post/bihar-police-update");
  assert.equal(getMeta(res.body, "name", "twitter:url"), "https://biharfast.in/post/bihar-police-update");
  assert.match(res.body, /<script src="\/assets\/app\.js"><\/script>/);
});

test("upstream timeout returns no-store SPA shell with slug title and self URLs", async () => {
  const { res, timeoutMs } = await runHandler({
    userAgent: "Twitterbot",
    slug: "timeout-post",
    timeout: true,
  });

  assert.equal(timeoutMs, 6000);
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");
  assert.equal(getTitle(res.body), "Timeout post - BiharFast");
  assert.equal(getCanonical(res.body), "https://biharfast.in/post/timeout-post");
  assert.equal(getMeta(res.body, "property", "og:url"), "https://biharfast.in/post/timeout-post");
  assert.equal(getMeta(res.body, "name", "twitter:url"), "https://biharfast.in/post/timeout-post");
});

test("upstream 404 returns an actual noindex 404 and preserves SPA shell", async () => {
  const { res } = await runHandler({
    userAgent: "TelegramBot",
    slug: "missing-post",
    apiResponse: response(404, {}),
  });

  assert.equal(res.statusCode, 404);
  assert.equal(res.headers["x-robots-tag"], "noindex, nofollow");
  assert.equal(res.headers["cache-control"], "no-cache, no-store, must-revalidate");
  assert.equal(getCanonical(res.body), "https://biharfast.in/post/missing-post");
  assert.equal(getMeta(res.body, "name", "robots"), "noindex, nofollow");
  assert.match(res.body, /<script src="\/assets\/app\.js"><\/script>/);
});

test("escapes quotes, angle brackets, and ampersands in title metadata", async () => {
  const { res } = await runHandler({
    userAgent: "Mozilla/5.0",
    apiResponse: response(200, {
      success: true,
      data: {
        title: "Unused",
        meta_title: `A "quoted" <title> & update`,
      },
    }),
  });

  assert.equal(getTitle(res.body), "A &quot;quoted&quot; &lt;title&gt; &amp; update");
  assert.equal(
    getMeta(res.body, "property", "og:title"),
    "A &quot;quoted&quot; &lt;title&gt; &amp; update",
  );
});
