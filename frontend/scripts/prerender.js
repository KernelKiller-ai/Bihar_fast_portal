import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_ROUTE_METADATA } from "../src/utils/seoConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");
const INDEX_HTML_PATH = path.join(DIST_DIR, "index.html");

const DOMAIN = "https://biharfast.in";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanMarkdownHtml(raw = "") {
  if (!raw) return "";
  let text = String(raw).trim();

  if (text.startsWith("```html")) {
    text = text.slice(7);
  } else if (text.startsWith("```")) {
    text = text.slice(3);
  }

  if (text.endsWith("```")) {
    text = text.slice(0, -3);
  }

  return text.trim();
}

function customizeHtml(template, meta, bodyContent = "", schemaJson = null) {
  let html = template;

  // 1. Title
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // 2. Meta description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );

  // 3. Canonical link
  if (/<link\s+rel=["']canonical["']/i.test(html)) {
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/i,
      `    <link rel="canonical" href="${escapeHtml(meta.canonical)}" />\n  </head>`
    );
  }

  // 4. OpenGraph Tags
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`
  );

  // 5. Schema JSON-LD injection
  if (schemaJson) {
    const schemaTag = `\n    <script type="application/ld+json">${JSON.stringify(schemaJson)}</script>\n  </head>`;
    html = html.replace(/<\/head>/i, schemaTag);
  }

  // 6. Inject Body Content for Search Crawlers & AdSense
  if (bodyContent) {
    if (html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);
    } else if (html.includes('<div id="root">')) {
      html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${bodyContent}</div>`);
    }
  }

  return html;
}

export async function prerenderAll() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`[prerender] Error: ${INDEX_HTML_PATH} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, "utf-8");
  let generatedCount = 0;

  // ----------------------------------------------------
  // Part A: Static Core & Legal Pages
  // ----------------------------------------------------
  console.log("[prerender] Generating static & legal routes...");
  for (const [route, meta] of Object.entries(STATIC_ROUTE_METADATA)) {
    let bodyText = `
      <main style="padding: 24px; max-width: 900px; margin: 0 auto;">
        <h1>${escapeHtml(meta.title)}</h1>
        <p>${escapeHtml(meta.description)}</p>
    `;

    if (route === "/privacy-policy") {
      bodyText += `
        <article>
          <h2>Privacy Policy for BiharFast</h2>
          <p>At BiharFast (biharfast.in), accessible from [https://biharfast.in](https://biharfast.in), the privacy of our visitors is extremely important to us. This Privacy Policy document outlines the types of personal information that is received and collected by BiharFast and how it is used.</p>
          <h3>Log Files and Cookies</h3>
          <p>Like many other Web sites, BiharFast makes use of log files. The information inside includes IP addresses, browser types, Internet Service Providers (ISP), date/time stamps, referring/exit pages, and number of clicks to analyze trends and administer the site.</p>
          <h3>Google DoubleClick DART Cookies & AdSense</h3>
          <p>Google, as a third party vendor, uses cookies to serve ads on biharfast.in. Google's use of the DART cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</p>
          <h3>Consent</h3>
          <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
        </article>
      `;
    } else if (route === "/about") {
      bodyText += `
        <article>
          <h2>About BiharFast</h2>
          <p>BiharFast (biharfast.in) is an independent educational portal dedicated to providing accurate, verified, and timely notifications regarding government examinations, admit cards, job opportunities, and state welfare initiatives across Bihar and India.</p>
          <p>Our goal is to make government notification data accessible and easy to understand for students and competitive exam aspirants.</p>
        </article>
      `;
    } else if (route === "/terms") {
      bodyText += `
        <article>
          <h2>Terms and Conditions</h2>
          <p>Welcome to BiharFast. By continuing to browse and use this website, you agree to comply with and be bound by the following terms of use. The content of the pages of this website is for your general information and educational use only.</p>
        </article>
      `;
    } else if (route === "/disclaimer") {
      bodyText += `
        <article>
          <h2>Disclaimer</h2>
          <p>BiharFast is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any government organization or examination board. All official circulars and notices are sourced from publicly available government websites.</p>
        </article>
      `;
    } else if (route === "/contact") {
      bodyText += `
        <article>
          <h2>Contact Us</h2>
          <p>If you have any queries regarding job notices, admit cards, or corrections, feel free to reach out to our team at support@biharfast.in.</p>
        </article>
      `;
    }

    bodyText += `</main>`;

    const routeHtml = customizeHtml(baseHtml, meta, bodyText);

    if (route === "/") {
      fs.writeFileSync(INDEX_HTML_PATH, routeHtml, "utf-8");
      generatedCount++;
      continue;
    }

    const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
    const targetDir = path.join(DIST_DIR, cleanRoute);
    fs.mkdirSync(targetDir, { recursive: true });

    fs.writeFileSync(path.join(targetDir, "index.html"), routeHtml, "utf-8");
    fs.writeFileSync(path.join(DIST_DIR, `${cleanRoute}.html`), routeHtml, "utf-8");
    generatedCount++;
  }

  // ----------------------------------------------------
  // Part B: Dynamic Post Pages
  // ----------------------------------------------------
  console.log("[prerender] Fetching live notices from API...");
  try {
    const res = await fetch(`${DOMAIN}/api/notices`);
    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const posts = await res.json();

    if (Array.isArray(posts) && posts.length > 0) {
      console.log(`[prerender] Found ${posts.length} dynamic posts. Building static HTML...`);

      for (const p of posts) {
        if (!p.slug) continue;

        const cleanContent = cleanMarkdownHtml(p.content || "");
        const canonicalUrl = `${DOMAIN}/post/${p.slug}`;
        const pageTitle = `${p.title} - BiharFast`;
        const metaDesc = (p.summary || p.title).slice(0, 160);

        const schemaJson = {
          "@context": "[https://schema.org](https://schema.org)",
          "@type": "NewsArticle",
          headline: p.title,
          description: metaDesc,
          url: canonicalUrl,
          datePublished: p.created_at || new Date().toISOString(),
          dateModified: p.updated_at || new Date().toISOString(),
          author: {
            "@type": "Organization",
            name: "BiharFast"
          },
          publisher: {
            "@type": "Organization",
            name: "BiharFast",
            url: DOMAIN
          }
        };

        const postBody = `
          <main style="padding: 24px; max-width: 900px; margin: 0 auto;">
            <article>
              <p style="color: #6b7280; font-size: 14px;">BiharFast &raquo; ${escapeHtml(p.category || "Notice")}</p>
              <h1>${escapeHtml(p.title)}</h1>
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 16px 0;">
                <p><strong>Eligibility:</strong> ${escapeHtml(p.eligibility || "Refer official notification")}</p>
                <p><strong>Last Date:</strong> ${escapeHtml(p.last_date || "Refer notification")}</p>
              </div>
              <div class="content-body" style="line-height: 1.7;">
                ${cleanContent}
              </div>
            </article>
          </main>
        `;

        const postHtml = customizeHtml(
          baseHtml,
          { title: pageTitle, description: metaDesc, canonical: canonicalUrl },
          postBody,
          schemaJson
        );

        const postDir = path.join(DIST_DIR, "post", p.slug);
        fs.mkdirSync(postDir, { recursive: true });

        fs.writeFileSync(path.join(postDir, "index.html"), postHtml, "utf-8");
        fs.writeFileSync(path.join(DIST_DIR, "post", `${p.slug}.html`), postHtml, "utf-8");
        generatedCount++;
      }
    } else {
      console.warn("[prerender] Notice array is empty from API.");
    }
  } catch (err) {
    console.warn("[prerender] Notice API fetch failed:", err.message);
  }

  console.log(`[prerender] Successfully generated ${generatedCount} static HTML pages.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerenderAll();
}