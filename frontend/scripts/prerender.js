import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_ROUTE_METADATA } from "../src/utils/seoConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");
const INDEX_HTML_PATH = path.join(DIST_DIR, "index.html");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function customizeHtml(template, meta) {
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

  // 4. OpenGraph
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

  // 5. Twitter
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:url" content="${escapeHtml(meta.canonical)}" />`
  );

  return html;
}

export function prerenderStaticRoutes() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`[prerender] Error: ${INDEX_HTML_PATH} does not exist. Run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, "utf-8");
  let generatedCount = 0;

  for (const [route, meta] of Object.entries(STATIC_ROUTE_METADATA)) {
    const routeHtml = customizeHtml(baseHtml, meta);

    if (route === "/") {
      fs.writeFileSync(INDEX_HTML_PATH, routeHtml, "utf-8");
      generatedCount++;
      continue;
    }

    // Determine target directory: dist/<route>/index.html
    const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
    const targetDir = path.join(DIST_DIR, cleanRoute);
    fs.mkdirSync(targetDir, { recursive: true });

    const targetIndexPath = path.join(targetDir, "index.html");
    fs.writeFileSync(targetIndexPath, routeHtml, "utf-8");

    // Also write dist/<route>.html for clean-URL web servers
    const targetFlatPath = path.join(DIST_DIR, `${cleanRoute}.html`);
    const parentFlatDir = path.dirname(targetFlatPath);
    if (!fs.existsSync(parentFlatDir)) {
      fs.mkdirSync(parentFlatDir, { recursive: true });
    }
    fs.writeFileSync(targetFlatPath, routeHtml, "utf-8");

    generatedCount++;
  }

  console.log(`[prerender] Successfully generated static metadata HTML for ${generatedCount} routes.`);
}

// Execute when invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerenderStaticRoutes();
}

