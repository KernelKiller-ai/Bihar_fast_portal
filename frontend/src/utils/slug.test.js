/**
 * Automated Regression Test Suite: JavaScript Slug Parity & Unicode Compliance
 * Tests frontend generateSlug() across English, Hindi matras, conjuncts, long titles, and punctuation.
 */
import assert from "node:assert/strict";
import { generateSlug } from "./slug.js";

const testCases = [
  {
    id: "TC-01",
    desc: "Standard English Title",
    input: { department: "BPSC", title: "Assistant Professor Recruitment 2026" },
    expected: "bpsc-assistant-professor-recruitment-2026",
  },
  {
    id: "TC-02",
    desc: "Hindi Title with Matras (Vowel Signs) & Punctuation",
    input: { department: "CSBC", title: "बिहार पुलिस सिपाही भर्ती 2026 (Advt 01/2026)" },
    expected: "csbc-बिहार-पुलिस-सिपाही-भर्ती-2026-advt-012026",
  },
  {
    id: "TC-03",
    desc: "Devanagari Conjuncts & Halant / Virama",
    input: { department: "BSSC", title: "द्वितीय इंटर स्तरीय संयुक्त प्रतियोगिता परीक्षा - 12,199 पद" },
    expected: "bssc-द्वितीय-इंटर-स्तरीय-संयुक्त-प्रतियोगिता-परीक्षा-12199-पद",
  },
  {
    id: "TC-04",
    desc: "Long Title Exceeding 90 Characters",
    input: {
      department: "BPSC",
      title: "Assistant Architect Examination 2026 - Very Long Detailed Official Notification for Bihar State Municipal Cadre Positions",
    },
    expected: "bpsc-assistant-architect-examination-2026-very-long-detailed-official-notification-for-bih",
  },
  {
    id: "TC-05",
    desc: "Leading, Trailing, and Multiple Internal Hyphens & Underscores",
    input: { department: "BPSSC", title: "--Sub_Inspector__Daroga___Exam--Date---2026--" },
    expected: "bpssc-sub-inspector-daroga-exam-date-2026",
  },
  {
    id: "TC-06",
    desc: "Special Symbols & Currency Symbols",
    input: { department: "उद्योग विभाग", title: "मुख्यमंत्री उद्यमी योजना - ₹10 लाख सहायता & 50% सब्सिडी 2026!" },
    expected: "उद्योग-विभाग-मुख्यमंत्री-उद्यमी-योजना-10-लाख-सहायता-50-सब्सिडी-2026",
  },
  {
    id: "TC-07",
    desc: "Database Backward Compatibility: Preserves Existing item.slug",
    input: { department: "BPSC", title: "Different Title", slug: "custom-legacy-slug-1234" },
    expected: "custom-legacy-slug-1234",
  },
];

console.log("=== RUNNING FRONTEND SLUG REGRESSION TESTS ===");
let passed = 0;

for (const tc of testCases) {
  const result = generateSlug(tc.input);
  assert.equal(result, tc.expected, `Failed on ${tc.id}: ${tc.desc}`);
  assert.ok(result.length <= 90, `Length > 90 on ${tc.id}`);
  assert.ok(!result.endsWith("-"), `Trailing hyphen on ${tc.id}`);
  console.log(`[PASS] ${tc.id}: ${tc.desc} -> ${result}`);
  passed++;
}

console.log(`\nAll ${passed} JavaScript slug tests passed successfully!\n`);

