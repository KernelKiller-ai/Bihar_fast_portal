import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { LEGAL_PAGES_CONTENT } from "../src/data/legalPagesContent.js";
import { stripMarkdownArtifacts } from "../src/utils/sanitizeHtml.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");

const ROUTES = [
  {
    route: "/about",
    h1: "हमारे बारे में (About BiharFast.in)",
    headings: ["Our Mission in Practice", "Verification and Editorial Process", "Entity and Legal Identity"],
    minWords: 250,
  },
  {
    route: "/contact",
    h1: "हमसे संपर्क करें (Contact & Grievance Redressal)",
    headings: [
      "आधिकारिक ईमेल",
      "प्रतिक्रिया समय-सीमा (Response Timeline):",
      "Grievance Redressal Policy",
      "Content Disclaimer & Verification Advisory",
      "Working Hours & Location",
      "अपना संदेश प्रेषित करें",
    ],
    minWords: 250,
  },
  {
    route: "/privacy-policy",
    h1: "Privacy Policy",
    headings: ["1. Information We Collect", "3. Cookies, Google AdSense and DoubleClick DART", "9. Children's Privacy and Policy Updates"],
    minWords: 350,
  },
  {
    route: "/terms",
    h1: "Terms & Conditions of Use",
    headings: ["1. Nature of Service and Educational Purpose", "3. Prohibited User Activities", "7. Governing Law and Dispute Resolution"],
    minWords: 400,
  },
  {
    route: "/disclaimer",
    h1: "BiharFast Disclaimer",
    headings: ["Strict Non-Government Declaration", "No Employment Fee and Anti-Fraud Warning", "Content Takedown and Grievance Redressal"],
    minWords: 250,
  },
];

function readPage(route) {
  const file = path.join(DIST_DIR, route.slice(1), "index.html");
  assert.ok(fs.existsSync(file), `Expected prerendered output at ${file}; run npm run build first`);
  return fs.readFileSync(file, "utf8");
}

function readRoot(html) {
  const match = html.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i);
  assert.ok(match, "Could not locate prerendered #root contents");
  return match[1];
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function visibleText(html) {
  return decodeHtml(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function wordCount(html) {
  return visibleText(html).match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length || 0;
}

function readCanonical(html) {
  return html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*\bhref="([^"]+)"/i)?.[1] || null;
}

test("build output has full initial HTML for every core static page", () => {
  for (const route of ROUTES) {
    const html = readPage(route.route);
    const root = readRoot(html);
    const h1 = root.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
    assert.ok(h1, `${route.route} is missing an initial-HTML h1`);
    assert.equal(visibleText(h1), route.h1, `${route.route} has the wrong h1`);

    for (const heading of route.headings) {
      assert.ok(visibleText(root).includes(heading), `${route.route} is missing heading "${heading}"`);
    }

    const words = wordCount(root);
    assert.ok(words >= route.minWords, `${route.route} has only ${words} initial-HTML words`);
    assert.equal(readCanonical(html), LEGAL_PAGES_CONTENT[route.route].canonical);
  }
});

test("privacy initial HTML includes Google AdSense and DART cookie disclosures", () => {
  const rootText = visibleText(readRoot(readPage("/privacy-policy")));
  assert.match(rootText, /Google/);
  assert.match(rootText, /AdSense/);
  assert.match(rootText, /DART cookie/i);
});

test("core static page output contains no raw Markdown syntax", () => {
  for (const route of ROUTES) {
    const root = readRoot(readPage(route.route));
    assert.doesNotMatch(root, /```|##|\]\(https?:\/\//, `${route.route} contains raw Markdown syntax`);
  }
});

test("post HTML sanitizer strips fenced and inline Markdown delimiters", () => {
  const html = "```html\n<p>`Notice details`</p>\n``` and ``` plus &#96;inline&#96;";
  const sanitized = stripMarkdownArtifacts(html);
  assert.equal(sanitized, "<p>Notice details</p>\nand plus inline");
  assert.doesNotMatch(sanitized, /`/);
});

test("unknown-route fallback provides noindex metadata and a 404 title", () => {
  const component = fs.readFileSync(path.resolve(__dirname, "../src/pages/NotFound.jsx"), "utf8");
  const app = fs.readFileSync(path.resolve(__dirname, "../src/App.jsx"), "utf8");
  assert.match(component, /404 - Page Not Found \| BiharFast/);
  assert.match(component, /noindex, nofollow/);
  assert.match(app, /<Route path="\*" element=\{<NotFound \/>}/);
});

test("generated JSON-LD uses the exact Schema.org context", () => {
  for (const route of ROUTES) {
    const html = readPage(route.route);
    const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    assert.ok(blocks.length > 0, `${route.route} has no JSON-LD block`);
    for (const [, json] of blocks) {
      assert.equal(JSON.parse(json)["@context"], "https://schema.org");
    }
  }
});

test("static aliases retain their primary canonical URL", () => {
  const aliases = [
    ["/about-us", "/about"],
    ["/contact-us", "/contact"],
    ["/privacy", "/privacy-policy"],
    ["/terms-and-conditions", "/terms"],
  ];
  for (const [alias, primary] of aliases) {
    const html = readPage(alias);
    assert.equal(readCanonical(html), LEGAL_PAGES_CONTENT[primary].canonical);
    assert.equal(visibleText(readRoot(html)).includes(LEGAL_PAGES_CONTENT[primary].title), true);
  }
});
