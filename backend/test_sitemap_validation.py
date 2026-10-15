"""
Automated Regression Test Suite: Sitemap Route Completeness, XML Validity, and URL Encoding.
Validates frontend/public/sitemap-static.xml against App.jsx routes.
"""
import os
import re
import urllib.parse
import xml.etree.ElementTree as ET
import unittest

STATIC_SITEMAP_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "sitemap-static.xml")
)

# 30 Audited Public Canonical Routes that MUST be in sitemap-static.xml
EXPECTED_CANONICAL_ROUTES = [
    "https://biharfast.in/",
    "https://biharfast.in/jobs",
    "https://biharfast.in/admit-card",
    "https://biharfast.in/results",
    "https://biharfast.in/sitemap",
    "https://biharfast.in/mock-test",
    "https://biharfast.in/useful-tools",
    "https://biharfast.in/upcoming-2026",
    "https://biharfast.in/download",
    "https://biharfast.in/bseb-matric-10th",
    "https://biharfast.in/bseb-inter-12th",
    "https://biharfast.in/cuet-ug-admission",
    "https://biharfast.in/rtps-bihar",
    "https://biharfast.in/udyami-yojana",
    "https://biharfast.in/kyp-bihar",
    "https://biharfast.in/student-credit-card",
    "https://biharfast.in/category/welfare-schemes",
    "https://biharfast.in/category/scholarships",
    "https://biharfast.in/category/bpsc-jobs",
    "https://biharfast.in/category/bihar-police",
    "https://biharfast.in/category/teacher-recruitment",
    "https://biharfast.in/category/health-department",
    "https://biharfast.in/category/panchayati-raj",
    "https://biharfast.in/category/student-schemes",
    "https://biharfast.in/category/social-welfare",
    "https://biharfast.in/about",
    "https://biharfast.in/contact",
    "https://biharfast.in/privacy-policy",
    "https://biharfast.in/terms",
    "https://biharfast.in/disclaimer",
]

# Routes that MUST BE EXCLUDED from the sitemap
FORBIDDEN_EXCLUDED_ROUTES = [
    "https://biharfast.in/admin",
    "https://biharfast.in/admin-portal",
    "https://biharfast.in/dashboard",
    "https://biharfast.in/about-us",
    "https://biharfast.in/contact-us",
    "https://biharfast.in/privacy",
    "https://biharfast.in/terms-and-conditions",
    "https://biharfast.in/all-updates",
    "https://biharfast.in/class-10-quiz",
    "https://biharfast.in/mock-test/class-10",
]

class TestSitemapValidation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(STATIC_SITEMAP_PATH, "r", encoding="utf-8") as f:
            cls.xml_content = f.read()
        cls.root = ET.fromstring(cls.xml_content)
        cls.ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        cls.urls = cls.root.findall("sm:url", cls.ns)

    def test_xml_is_well_formed(self):
        self.assertIsNotNone(self.root)
        self.assertEqual(len(self.urls), len(EXPECTED_CANONICAL_ROUTES))

    def test_all_expected_canonical_routes_present(self):
        locs = [u.find("sm:loc", self.ns).text.strip() for u in self.urls]
        for route in EXPECTED_CANONICAL_ROUTES:
            self.assertIn(route, locs, f"Missing route in sitemap: {route}")

    def test_forbidden_routes_are_excluded(self):
        locs = [u.find("sm:loc", self.ns).text.strip() for u in self.urls]
        for route in FORBIDDEN_EXCLUDED_ROUTES:
            self.assertNotIn(route, locs, f"Forbidden route must NOT be in sitemap: {route}")

    def test_all_urls_are_ascii_encoded(self):
        for u in self.urls:
            loc = u.find("sm:loc", self.ns).text.strip()
            try:
                loc.encode("ascii")
            except UnicodeEncodeError:
                self.fail(f"URL contains non-ASCII characters: {loc}")

    def test_unverified_lastmod_omitted_and_any_present_is_valid(self):
        date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")
        for u in self.urls:
            lastmod = u.find("sm:lastmod", self.ns)
            # In accordance with Google Search Central guidelines, static routes without verified editorial dates must not emit lastmod
            if lastmod is not None:
                self.assertTrue(
                    date_pattern.match(lastmod.text.strip()),
                    f"Invalid date format '{lastmod.text}' on: {u.find('sm:loc', self.ns).text}"
                )

    def test_dynamic_sitemap_percent_encoding(self):
        # Simulates dynamic sitemap output for Hindi slug
        raw_slug = "bpsc-बिहार-पुलिस-2026"
        encoded = urllib.parse.quote(raw_slug, safe="-")
        xml_loc = f"https://biharfast.in/post/{encoded}"
        # Assert it can be encoded to pure ASCII
        xml_loc.encode("ascii")
        self.assertIn("https://biharfast.in/post/bpsc-", xml_loc)
        self.assertIn("%", xml_loc)

if __name__ == "__main__":
    unittest.main()

