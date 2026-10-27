import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { getLegalPageContent } from "../src/data/legalPagesContent.js";
import { STATIC_ROUTE_METADATA } from "../src/utils/seoConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");
const INDEX_HTML_PATH = path.join(DIST_DIR, "index.html");
const INJECTION_POINT = "<!-- PRERENDER_INJECTION_POINT -->";

export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(value) {
  if (typeof value === "string") return escapeHtml(value);
  return value.map((part) => {
    if (part.type === "strong") return `<strong>${escapeHtml(part.text)}</strong>`;
    if (part.type === "link") {
      const href = String(part.href || "");
      if (!href.startsWith("/") && !href.startsWith("https://") && !href.startsWith("mailto:")) {
        throw new Error(`Unsupported legal-page link URL: ${href}`);
      }
      const external = part.external ? ' target="_blank" rel="noreferrer"' : "";
      return `<a href="${escapeHtml(href)}"${external}>${escapeHtml(part.text)}</a>`;
    }
    return escapeHtml(part.text);
  }).join("");
}

function renderParagraph(paragraph) {
  return `<p>${renderInline(paragraph)}</p>`;
}

function renderList(list) {
  const tag = list.ordered ? "ol" : "ul";
  return `<${tag}>${list.items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`;
}

function renderLegalPage(content) {
  const header = [
    `<span>${escapeHtml(content.eyebrow)}</span>`,
    `<h1>${escapeHtml(content.title)}</h1>`,
    content.updated ? `<p>${escapeHtml(content.updated)}</p>` : "",
    content.subtitle ? `<p>${escapeHtml(content.subtitle)}</p>` : "",
    content.intro ? renderParagraph(content.intro) : "",
  ].join("");

  const sections = (content.sections || []).map((section) => {
    if (section.type === "cards") {
      return `<section>${section.heading ? `<h2>${escapeHtml(section.heading)}</h2>` : ""}${section.cards.map((card) =>
        `<article><h2>${escapeHtml(card.title)}</h2>${card.href
          ? `<p><a href="${escapeHtml(card.href)}">${escapeHtml(card.text)}</a></p>`
          : renderParagraph(card.text)}</article>`
      ).join("")}</section>`;
    }
    if (section.type === "form") {
      return `<section><h2>${escapeHtml(section.heading)}</h2><p>${section.fields.map(escapeHtml).join(" · ")}</p></section>`;
    }

    const heading = section.heading
      ? `<h2>${escapeHtml(section.heading)}</h2>`
      : section.title
        ? `<h2>${escapeHtml(section.title)}</h2>`
        : "";
    const paragraphs = (section.paragraphs || []).map(renderParagraph).join("");
    const lists = (section.lists || []).map(renderList).join("");
    const emphasis = section.emphasis ? renderParagraph([{ type: "strong", text: section.emphasis }]) : "";
    const links = (section.links || []).map((link) =>
      `<p><a href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a></p>`
    ).join("");
    return `<section>${heading}${paragraphs}${lists}${emphasis}${links}</section>`;
  }).join("");
  const footerLinks = (content.footerLinks || []).map((link) =>
    `<a href="${escapeHtml(link.href)}">${escapeHtml(link.text)}</a>`
  ).join(" ");

  return `<main class="max-w-4xl mx-auto px-4 py-10"><article><header>${header}</header>${sections}<nav>${footerLinks}</nav></article></main>`;
}

function renderRouteBody(route, metadata) {
  const content = getLegalPageContent(new URL(metadata.canonical).pathname);
  if (content) return renderLegalPage(content);

  if (route === "/") {
    return `<main><h1>Bihar’s Fastest Gateway to Jobs &amp; Public Services.</h1><p>– सटीक जानकारी, बेहतर बिहार –</p><p>${escapeHtml(metadata.description)}</p></main>`;
  }

  return `<main><h1>${escapeHtml(metadata.title)}</h1><p>${escapeHtml(metadata.description)}</p></main>`;
}

export function customizeHtml(template, metadata, bodyContent) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
  );
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`,
  );
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(metadata.canonical)}" />`,
  );

  const markerCount = html.split(INJECTION_POINT).length - 1;
  if (markerCount !== 1) {
    throw new Error(`Expected one ${INJECTION_POINT} in the HTML shell; found ${markerCount}`);
  }
  html = html.replace(INJECTION_POINT, bodyContent);
  return html;
}

export function prerenderAll() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    throw new Error(`[prerender] ${INDEX_HTML_PATH} does not exist. Run vite build first.`);
  }

  const baseHtml = fs.readFileSync(INDEX_HTML_PATH, "utf-8");
  let generatedCount = 0;
  console.log("[prerender] Generating configured static routes...");

  for (const [route, metadata] of Object.entries(STATIC_ROUTE_METADATA)) {
    const legalContent = getLegalPageContent(new URL(metadata.canonical).pathname);
    const routeMetadata = legalContent
      ? {
          ...metadata,
          title: legalContent.metaTitle,
          description: legalContent.metaDescription,
          canonical: legalContent.canonical,
        }
      : metadata;
    const routeHtml = customizeHtml(baseHtml, routeMetadata, renderRouteBody(route, routeMetadata));

    if (route === "/") {
      fs.writeFileSync(INDEX_HTML_PATH, routeHtml, "utf-8");
      generatedCount++;
      continue;
    }

    const cleanRoute = route.slice(1);
    const targetDir = path.join(DIST_DIR, cleanRoute);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.html"), routeHtml, "utf-8");
    fs.writeFileSync(path.join(DIST_DIR, `${cleanRoute}.html`), routeHtml, "utf-8");
    generatedCount++;
  }

  console.log(`[prerender] Successfully generated ${generatedCount} static HTML pages.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerenderAll();
}
