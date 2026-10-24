/**
 * Automated Regression Test Suite: Static SEO Metadata & Prerender Verification
 * Validates:
 * 1. Completeness and uniqueness of STATIC_ROUTE_METADATA for all 30 sitemap routes
 * 2. Absolute canonical URLs on https://biharfast.in
 * 3. Absence of duplicate title, description, or canonical tags in prerendered HTML
 * 4. Proper self-referencing canonical on root '/'
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_ROUTE_METADATA, getMetadataForPath } from "../src/utils/seoConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "../dist");

const EXPECTED_30_CANONICAL_ROUTES = [
  "/",
  "/jobs",
  "/admit-card",
  "/results",
  "/sitemap",
  "/mock-test",
  "/useful-tools",
  "/upcoming-2026",
  "/download",
  "/bseb-matric-10th",
  "/bseb-inter-12th",
  "/cuet-ug-admission",
  "/rtps-bihar",
  "/udyami-yojana",
  "/kyp-bihar",
  "/student-credit-card",
  "/category/welfare-schemes",
  "/category/scholarships",
  "/category/bpsc-jobs",
  "/category/bihar-police",
  "/category/teacher-recruitment",
  "/category/health-department",
  "/category/panchayati-raj",
  "/category/student-schemes",
  "/category/social-welfare",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer"
];

function runTests() {
  console.log("Running Static SEO & Prerender Test Suite...");

  // Test 1: All 30 routes exist in config
  for (const route of EXPECTED_30_CANONICAL_ROUTES) {
    const meta = STATIC_ROUTE_METADATA[route];
    assert.ok(meta, `Missing metadata configuration for route: ${route}`);
    assert.ok(meta.title && meta.title.length > 10, `Title too short or missing for route: ${route}`);
    assert.ok(meta.description && meta.description.length > 20, `Description too short or missing for route: ${route}`);
    assert.ok(meta.canonical.startsWith("https://biharfast.in"), `Canonical must be absolute on https://biharfast.in for route: ${route}`);
  }
  console.log("✔ Test 1 Passed: All 30 canonical routes have complete metadata config.");

  // Test 2: Titles among the 30 canonical routes are unique (no accidental duplicate titles)
  const seenTitles = new Map();
  for (const route of EXPECTED_30_CANONICAL_ROUTES) {
    const title = STATIC_ROUTE_METADATA[route].title;
    if (seenTitles.has(title)) {
      assert.fail(`Duplicate title detected between '${seenTitles.get(title)}' and '${route}': "${title}"`);
    }
    seenTitles.set(title, route);
  }
  console.log("✔ Test 2 Passed: All 30 canonical routes have unique page titles.");

  // Test 3: getMetadataForPath handles trailing slashes and aliases properly
  assert.equal(getMetadataForPath("/about").canonical, "https://biharfast.in/about");
  assert.equal(getMetadataForPath("/about/").canonical, "https://biharfast.in/about");
  assert.equal(getMetadataForPath("/about-us").canonical, "https://biharfast.in/about");
  assert.equal(getMetadataForPath("/privacy").canonical, "https://biharfast.in/privacy-policy");
  assert.equal(getMetadataForPath("/terms-and-conditions").canonical, "https://biharfast.in/terms");
  console.log("✔ Test 3 Passed: Route resolution and canonical aliasing work correctly.");

  // Test 4: Verify prerendered HTML in dist/ (if dist exists)
  if (fs.existsSync(DIST_DIR)) {
    for (const route of EXPECTED_30_CANONICAL_ROUTES) {
      let htmlPath = route === "/"
        ? path.join(DIST_DIR, "index.html")
        : path.join(DIST_DIR, route.slice(1), "index.html");

      assert.ok(fs.existsSync(htmlPath), `Prerendered file missing: ${htmlPath}`);
      const content = fs.readFileSync(htmlPath, "utf-8");
      const meta = STATIC_ROUTE_METADATA[route];

      function escapeHtml(str = "") {
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }

      // Verify title is present
      assert.ok(content.includes(`<title>${escapeHtml(meta.title)}</title>`), `Title missing in prerendered HTML for ${route}`);

      // Verify canonical is present
      assert.ok(content.includes(`rel="canonical" href="${meta.canonical}"`), `Canonical link missing in prerendered HTML for ${route}`);

      // Count occurrences to ensure NO duplicate tags
      const titleMatches = content.match(/<title>[\s\S]*?<\/title>/gi) || [];
      assert.equal(titleMatches.length, 1, `Expected exactly 1 <title> tag in ${htmlPath}, found ${titleMatches.length}`);

      const canonicalMatches = content.match(/<link\s+rel=["']canonical["']/gi) || [];
      assert.equal(canonicalMatches.length, 1, `Expected exactly 1 <link rel="canonical"> tag in ${htmlPath}, found ${canonicalMatches.length}`);

      const descMatches = content.match(/<meta\s+name=["']description["']/gi) || [];
      assert.equal(descMatches.length, 1, `Expected exactly 1 <meta name="description"> tag in ${htmlPath}, found ${descMatches.length}`);
    }
    console.log("✔ Test 4 Passed: Prerendered HTML verified across all 30 routes (0 duplicates, exact metadata).");
  } else {
    console.log("⚠ Dist directory not found, skipping Test 4 (run after build).");
  }

  // Test 5: Verify frontend/vercel.json host-based redirect configuration
  const vercelJsonPath = path.resolve(__dirname, "../vercel.json");
  assert.ok(fs.existsSync(vercelJsonPath), "frontend/vercel.json must exist");
  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, "utf-8"));
  assert.ok(Array.isArray(vercelConfig.redirects), "vercel.json must contain a 'redirects' array");

  const wwwRedirect = vercelConfig.redirects.find((r) =>
    Array.isArray(r.has) && r.has.some((h) => h.type === "host" && h.value === "www.biharfast.in")
  );
  assert.ok(wwwRedirect, "Missing host-based redirect from www.biharfast.in in vercel.json");
  assert.equal(wwwRedirect.source, "/:path*", "Redirect source must be '/:path*'");
  assert.equal(wwwRedirect.destination, "https://biharfast.in/:path*", "Redirect destination must be 'https://biharfast.in/:path*'");
  assert.equal(wwwRedirect.permanent, true, "Redirect must be permanent (HTTP 308/301)");
  console.log("✔ Test 5 Passed: vercel.json contains valid host-based permanent www-to-apex redirect.");

  // Test 6: Verify Class10QuizPlayer viral share links use apex canonical domain
  const quizPlayerPath = path.resolve(__dirname, "../src/components/Class10QuizPlayer.jsx");
  assert.ok(fs.existsSync(quizPlayerPath), "Class10QuizPlayer.jsx must exist");
  const quizContent = fs.readFileSync(quizPlayerPath, "utf-8");
  assert.ok(!quizContent.includes("https://www.biharfast.in"), "Class10QuizPlayer.jsx must not contain hardcoded 'https://www.biharfast.in'");
  assert.ok(quizContent.includes("https://biharfast.in/mock-test"), "Class10QuizPlayer.jsx must use 'https://biharfast.in/mock-test' for share links");
  console.log("✔ Test 6 Passed: Class10QuizPlayer viral share links strictly use canonical apex domain.");

  console.log("\nALL STATIC SEO & CANONICAL CONSOLIDATION TESTS PASSED SUCCESSFULLY!");
}

runTests();

