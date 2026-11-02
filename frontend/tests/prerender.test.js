import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { LEGAL_PAGES_CONTENT } from "../src/data/legalPagesContent.js";
import { stripMarkdownArtifacts } from "../src/utils/sanitizeHtml.js";
import { formatSeoTitle, STATIC_ROUTE_METADATA } from "../src/utils/seoConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");

test("post SEO titles are capped at 65 characters without dropping the brand suffix", () => {
  const formatted = formatSeoTitle(
    "BPSC APO Recruitment Notification and Eligibility Details 2026 Official Apply Link - BiharFast",
  );
  assert.ok(formatted.length <= 65);
  assert.ok(formatted.endsWith(" - BiharFast"));
  assert.equal(formatted, "BPSC APO Recruitment Notification and Eligibility - BiharFast");
  assert.ok(formatSeoTitle("Short post title - BiharFast").length <= 65);
});

test("all configured static titles stay within the 35–65 character audit range", () => {
  for (const [route, metadata] of Object.entries(STATIC_ROUTE_METADATA)) {
    assert.ok(
      metadata.title.length >= 35 && metadata.title.length <= 65,
      `${route} has a ${metadata.title.length}-character title`,
    );
  }
  assert.equal(STATIC_ROUTE_METADATA["/terms"].title, STATIC_ROUTE_METADATA["/terms-conditions"].title);
  assert.equal(STATIC_ROUTE_METADATA["/terms"].title, STATIC_ROUTE_METADATA["/terms-and-conditions"].title);
});

const ROUTES = [
  {
    route: "/about",
    h1: "About BiharFast | Bihar Student Education & Public Information",
    headings: ["Our Mission in Practice", "Verification and Editorial Process", "Who prepares BiharFast content", "Public welfare and responsible use"],
    minWords: 500,
  },
  {
    route: "/contact",
    h1: "हमसे संपर्क करें (Contact & Grievance Redressal)",
    headings: [
      "संपादकीय और तकनीकी सहायता",
      "प्रतिक्रिया समय-सीमा (Response Timeline):",
      "Grievance Redressal और संपादकीय सुधार",
      "Content Disclaimer & Verification Advisory",
      "Support team and contact scope",
      "अपना संदेश प्रेषित करें",
    ],
    minWords: 500,
  },
  {
    route: "/privacy-policy",
    h1: "Privacy Policy",
    headings: ["1. Information We Collect", "3. Cookies, Google AdSense, and Third-Party Advertising", "6. Client-side tools: photos and calculator inputs", "10. Children, international processing, and policy updates"],
    minWords: 500,
  },
  {
    route: "/terms",
    h1: "Terms & Conditions of Use",
    headings: ["1. Nature of Service and Educational Purpose", "3. Prohibited User Activities", "7. Governing Law and Dispute Resolution"],
    minWords: 500,
  },
  {
    route: "/disclaimer",
    h1: "BiharFast Disclaimer",
    headings: ["Strict Non-Government Declaration", "No Employment Fee and Anti-Fraud Warning", "Content Takedown and Grievance Redressal"],
    minWords: 500,
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

test("all configured public routes have substantive semantic initial HTML", () => {
  for (const route of Object.keys(STATIC_ROUTE_METADATA)) {
    const html = readPage(route);
    const root = readRoot(html);
    const words = wordCount(root);
    assert.ok(words >= 300, `${route} has only ${words} initial-HTML words`);
    assert.match(root, /<main\b[\s\S]*?<article\b[\s\S]*?<h1\b/i, `${route} is missing semantic article structure`);
  }
});

test("evergreen homepage prerender highlights tools and archived recruitment notices", () => {
  const root = visibleText(readRoot(readPage("/")));
  for (const phrase of [
    "परीक्षा फोटो रीसाइज़र",
    "छात्र क्रेडिट कार्ड EMI कैलकुलेटर",
    "RTPS सेवा मार्गदर्शिका",
    "CUET UG PYQ संसाधन",
    "ऐतिहासिक परीक्षा पैटर्न",
  ]) {
    assert.ok(root.includes(phrase), `Homepage prerender is missing "${phrase}"`);
  }
});

test("both exam utility routes prerender at least 500 words", () => {
  const tools = [
    ["/tools/photo-resizer", "Exam Photo and Signature Resizer"],
    ["/tools/credit-card-calculator", "Student Credit Card"],
  ];
  for (const [route, heading] of tools) {
    const root = readRoot(readPage(route));
    const words = wordCount(root);
    assert.ok(words >= 500, `${route} has only ${words} initial-HTML words`);
    assert.ok(visibleText(root).includes(heading), `${route} is missing its expected guide heading`);
  }
});

test("internal route snapshots are explicitly noindex", () => {
  for (const route of ["/admin", "/admin-login", "/admin-portal", "/dashboard"]) {
    const file = path.join(DIST_DIR, route.slice(1), "index.html");
    assert.ok(fs.existsSync(file), `Expected internal snapshot at ${file}; run npm run build first`);
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, /<meta name="robots" content="noindex, nofollow"\s*\/?>/i, `${route} must be noindex`);
    assert.match(readRoot(html), /<h1\b/i, `${route} must have a useful initial heading`);
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
    assert.ok(title && title.length >= 35 && title.length <= 65, `${route} has an invalid title length`);
  }
});

test("post detail page includes the permanent notice archive banner", () => {
  const component = fs.readFileSync(path.resolve(__dirname, "../src/pages/PostDetail.jsx"), "utf8");
  assert.match(component, /Notice Archive:<\/strong>\s*This notification record is maintained for historical examination pattern, syllabus, and eligibility reference\./);
});

test("privacy initial HTML discloses advertising, analytics, server logs, and local-only tools", () => {
  const rootText = visibleText(readRoot(readPage("/privacy-policy")));
  assert.match(rootText, /Google Analytics 4/);
  assert.match(rootText, /AdSense/);
  assert.match(rootText, /advertising cookies/i);
  assert.match(rootText, /server or access logs/i);
  assert.match(rootText, /does not upload, receive, or store your selected photo or signature/i);
  assert.match(rootText, /are not sent to a BiharFast server/i);
});

test("legal policy pages render breadcrumb navigation in initial HTML", () => {
  for (const route of ROUTES) {
    const root = readRoot(readPage(route.route));
    assert.match(root, /<nav aria-label="Breadcrumb">/i, `${route.route} is missing breadcrumbs`);
    assert.match(root, /<li aria-current="page">/i, `${route.route} is missing its current breadcrumb`);
  }
});

test("disclaimer contains the required independent-government statement and official verification links", () => {
  const root = visibleText(readRoot(readPage("/disclaimer")));
  assert.match(root, /BiharFast \(biharfast\.in\) is an independent private informational portal and is NOT affiliated with, authorized by, or associated with the Government of Bihar or any government department\./);
  assert.match(root, /bpsc\.bih\.nic\.in/);
  assert.match(root, /csbc\.bih\.nic\.in/);
  assert.match(root, /onlinebseb\.in/);
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
