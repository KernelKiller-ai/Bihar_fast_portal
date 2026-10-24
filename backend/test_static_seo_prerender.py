"""
Automated Test Suite: Static SEO Metadata & Prerender Verification (Python)
Validates:
1. All 30 sitemap canonical routes are represented in prerendered HTML output
2. Every prerendered HTML file contains unique title, description, and canonical tags
3. No duplicate <title>, <meta name="description">, or <link rel="canonical"> tags exist
4. All canonical tags use the absolute https://biharfast.in scheme
5. Root index.html has a self-referencing canonical
"""
import os
import re
import unittest
from bs4 import BeautifulSoup

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")

EXPECTED_30_CANONICAL_ROUTES = [
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
    "/disclaimer",
]

class TestStaticSEOPrerender(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not os.path.exists(DIST_DIR):
            raise unittest.SkipTest("frontend/dist does not exist. Run 'npm run build' first.")

    def test_all_30_prerendered_files_exist(self):
        for route in EXPECTED_30_CANONICAL_ROUTES:
            if route == "/":
                path = os.path.join(DIST_DIR, "index.html")
            else:
                path = os.path.join(DIST_DIR, route.lstrip("/"), "index.html")
            self.assertTrue(os.path.exists(path), f"Prerendered HTML missing for route: {route} at {path}")

    def test_exact_single_title_canonical_and_description(self):
        seen_titles = {}
        for route in EXPECTED_30_CANONICAL_ROUTES:
            if route == "/":
                file_path = os.path.join(DIST_DIR, "index.html")
                expected_canonical = "https://biharfast.in/"
            else:
                file_path = os.path.join(DIST_DIR, route.lstrip("/"), "index.html")
                expected_canonical = f"https://biharfast.in{route}"

            with open(file_path, "r", encoding="utf-8") as f:
                html = f.read()

            soup = BeautifulSoup(html, "html.parser")

            # Check title count and content
            titles = soup.find_all("title")
            self.assertEqual(len(titles), 1, f"Expected exactly 1 <title> in {route}, found {len(titles)}")
            title_text = titles[0].get_text().strip()
            self.assertGreater(len(title_text), 10, f"Title too short in {route}: '{title_text}'")
            self.assertNotIn(title_text, seen_titles, f"Duplicate title '{title_text}' in {route} (already used in {seen_titles.get(title_text)})")
            seen_titles[title_text] = route

            # Check meta description count and content
            descriptions = soup.find_all("meta", attrs={"name": "description"})
            self.assertEqual(len(descriptions), 1, f"Expected exactly 1 meta description in {route}, found {len(descriptions)}")
            desc_text = descriptions[0].get("content", "").strip()
            self.assertGreater(len(desc_text), 20, f"Description too short in {route}: '{desc_text}'")

            # Check canonical link count and exact href
            canonicals = soup.find_all("link", attrs={"rel": "canonical"})
            self.assertEqual(len(canonicals), 1, f"Expected exactly 1 canonical in {route}, found {len(canonicals)}")
            canonical_href = canonicals[0].get("href", "").strip()
            self.assertEqual(canonical_href, expected_canonical, f"Canonical mismatch in {route}: expected {expected_canonical}, got {canonical_href}")

    def test_root_index_html_has_self_referencing_canonical(self):
        index_path = os.path.join(DIST_DIR, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            html = f.read()
        soup = BeautifulSoup(html, "html.parser")
        canonical = soup.find("link", attrs={"rel": "canonical"})
        self.assertIsNotNone(canonical, "Root index.html missing canonical tag")
        self.assertEqual(canonical.get("href"), "https://biharfast.in/")

    def test_vercel_www_redirect_configured(self):
        import json
        vercel_path = os.path.join(BASE_DIR, "frontend", "vercel.json")
        self.assertTrue(os.path.exists(vercel_path), "frontend/vercel.json must exist")
        with open(vercel_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        redirects = cfg.get("redirects", [])
        self.assertTrue(isinstance(redirects, list) and len(redirects) > 0, "redirects must be a non-empty list")
        www_rule = next((r for r in redirects if any(h.get("value") == "www.biharfast.in" for h in r.get("has", []))), None)
        self.assertIsNotNone(www_rule, "vercel.json missing host-based redirect rule for www.biharfast.in")
        self.assertEqual(www_rule.get("source"), "/:path*")
        self.assertEqual(www_rule.get("destination"), "https://biharfast.in/:path*")
        self.assertTrue(www_rule.get("permanent"))

    def test_quiz_player_share_urls_use_apex(self):
        quiz_path = os.path.join(BASE_DIR, "frontend", "src", "components", "Class10QuizPlayer.jsx")
        self.assertTrue(os.path.exists(quiz_path), "Class10QuizPlayer.jsx must exist")
        with open(quiz_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertNotIn("https://www.biharfast.in", content, "Class10QuizPlayer.jsx must not contain www.biharfast.in")
        self.assertIn("https://biharfast.in/mock-test", content, "Class10QuizPlayer.jsx must use https://biharfast.in/mock-test")

if __name__ == "__main__":
    unittest.main()

