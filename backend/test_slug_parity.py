"""
Automated Regression Test Suite: Slug Generation Parity & Unicode Compliance
Tests Python backend slugify() across English, Hindi matras, conjuncts, long titles, and punctuation.
"""
import sys
import os
import unittest

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from main import slugify
from services.ai_extractor import _slug_from_title

class TestSlugParity(unittest.TestCase):
    def test_tc01_standard_english(self):
        slug = slugify("Assistant Professor Recruitment 2026", "BPSC")
        self.assertEqual(slug, "bpsc-assistant-professor-recruitment-2026")
        self.assertLessEqual(len(slug), 90)
        self.assertFalse(slug.endswith("-"))

    def test_tc02_hindi_matras(self):
        # Must preserve combining vowel signs / matras: िक, ुक, ूक, ेक, ैk, ोक, ौk, etc.
        slug = slugify("बिहार पुलिस सिपाही भर्ती 2026 (Advt 01/2026)", "CSBC")
        self.assertEqual(slug, "csbc-बिहार-पुलिस-सिपाही-भर्ती-2026-advt-012026")
        self.assertIn("बिहार", slug)
        self.assertIn("पुलिस", slug)
        self.assertIn("सिपाही", slug)
        self.assertIn("भर्ती", slug)

    def test_tc03_devanagari_conjuncts(self):
        slug = slugify("द्वितीय इंटर स्तरीय संयुक्त प्रतियोगिता परीक्षा - 12,199 पद", "BSSC")
        self.assertEqual(slug, "bssc-द्वितीय-इंटर-स्तरीय-संयुक्त-प्रतियोगिता-परीक्षा-12199-पद")
        self.assertIn("द्वितीय", slug)
        self.assertIn("संयुक्त", slug)

    def test_tc04_long_title_truncation(self):
        title = "Assistant Architect Examination 2026 - Very Long Detailed Official Notification for Bihar State Municipal Cadre Positions"
        slug = slugify(title, "BPSC")
        self.assertEqual(slug, "bpsc-assistant-architect-examination-2026-very-long-detailed-official-notification-for-bih")
        self.assertLessEqual(len(slug), 90)
        self.assertFalse(slug.endswith("-"))

    def test_tc05_complex_hyphens_underscores(self):
        slug = slugify("--Sub_Inspector__Daroga___Exam--Date---2026--", "BPSSC")
        self.assertEqual(slug, "bpssc-sub-inspector-daroga-exam-date-2026")
        self.assertFalse(slug.startswith("-"))
        self.assertFalse(slug.endswith("-"))
        self.assertNotIn("--", slug)

    def test_tc06_currency_symbols(self):
        slug = slugify("मुख्यमंत्री उद्यमी योजना - ₹10 लाख सहायता & 50% सब्सिडी 2026!", "उद्योग विभाग")
        self.assertEqual(slug, "उद्योग-विभाग-मुख्यमंत्री-उद्यमी-योजना-10-लाख-सहायता-50-सब्सिडी-2026")
        self.assertNotIn("₹", slug)
        self.assertNotIn("%", slug)
        self.assertNotIn("!", slug)

    def test_ai_extractor_slug_parity(self):
        ai_slug = _slug_from_title("बिहार पुलिस सिपाही भर्ती 2026")
        self.assertEqual(ai_slug, "बिहार-पुलिस-सिपाही-भर्ती-2026")
        self.assertIn("बिहार", ai_slug)
        self.assertIn("पुलिस", ai_slug)

if __name__ == "__main__":
    unittest.main()

