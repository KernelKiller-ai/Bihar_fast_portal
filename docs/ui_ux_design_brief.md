# BiharFast UI/UX Design Brief

## 1. Design philosophy

- **Mobile first:** core flows must fit 320px–360px viewports without horizontal scrolling; verify every route, not only the home screen.
- **Trust and clarity:** distinguish the summary, dates, eligibility, and official action links; do not imply an automated verification guarantee that the publishing process does not enforce.
- **Low-friction navigation:** categories and search should be discoverable before long-form content.
- **Fast feedback:** use explicit loading, empty, success, and failure states for network actions.
- **Hindi/English support:** allow for text expansion, line wrapping, and mixed-script labels; do not hard-code widths around English copy.

## 2. Visual language

The existing UI uses a high-contrast educational/public-information palette, including deep navy (`#0F2A4A`), blue (`#16406E` and action blues), amber for emphasis, green for success, and slate neutrals. Preserve contrast when creating new states; measure foreground/background combinations rather than relying on color alone.

Typography should prioritize legible Hindi and Latin text at mobile sizes. Use the project's established system/font stack and existing component styles rather than introducing an unverified brand font. Use strong hierarchy: one clear page title, concise section headings, readable body copy, and compact metadata.

## 3. Responsive behavior

- Root document and app wrappers should stay `w-full max-w-full` with horizontal overflow contained.
- Navbar at small widths should prioritize logo, menu/profile action, and WhatsApp contact/action; hide secondary badges and long desktop taglines below the mobile breakpoint.
- Search should fill available width, with a flexible input and no fixed minimum width.
- Cards should wrap long titles/URLs and use responsive padding; avoid `min-width` assumptions and non-wrapping metadata rows.
- Test widths 320px, 360px, 390px, 640px, and desktop, including zoom and long Hindi/English titles.

## 4. Core component guidance

### Category-driven admin form

- Keep the persisted category values exactly `jobs`, `admit_card`, `results`, and `schemes`.
- Update field labels/placeholders immediately when selection changes.
- Hide total-posts for admit-card/results and clearly indicate the field is not applicable; retain the configured persistence fallback (`जारी (Released)` or `Result Declared`) in the payload.
- For schemes, present financial benefit/grant copy as the total-posts equivalent without implying a vacancy count.
- Keep URLs full-width and allow wrapping of long values; use native labels and accessible focus rings.
- Use a subtle opacity/transform transition when category-specific copy changes and respect `prefers-reduced-motion`.

### Quiz player

- Keep the question card distraction-free, with question number, readable prompt, tappable answer choices, timer, and progress indicator.
- Ensure touch targets are comfortable and that the timer is not conveyed by color alone.
- Keep answer confirmation and submission state explicit; prevent accidental double submission.
- Avoid exposing correct options until server evaluation/submission.

### Scorecard and social proof

- Existing scorecard includes BiharFast branding, quiz title, student name/district, result badge, score, accuracy, date, and share actions.
- Maintain a clear visual hierarchy and accessible contrast; allow long names and quiz titles to wrap.
- Treat the existing “official” badge/watermark as product branding, not proof of government affiliation.
- Keep share output readable and avoid adding personally identifying details beyond the student's chosen profile information.

### Notice details

- Put the most actionable information (date, eligibility/credentials, benefit/vacancy details) before dense article content.
- Differentiate apply, admit-card/result, and PDF links with explicit action labels.
- Sanitize rendered HTML; visibly label external destinations and provide safe new-tab behavior.
- On small screens, stack actions when side-by-side buttons would become cramped.

## 5. Accessibility and content

- Use semantic headings, form labels, buttons, and links; icon-only actions require accessible names.
- Preserve visible keyboard focus and support full keyboard navigation.
- Do not use color as the only status cue; pair it with text/iconography.
- Use plain, actionable Hindi/English copy. Explain abbreviations and avoid overly long CTA labels on mobile.
- Provide alt text for meaningful imagery and empty alt for purely decorative art.
- Include reduced-motion styles for category transitions and other non-essential animation.

## 6. QA checklist

- [ ] No horizontal scrollbar at 320px/360px on home, notice detail, admin, quiz, result, dashboard, and hubs.
- [ ] Navbar secondary badges are hidden/condensed below the mobile breakpoint.
- [ ] Search input and clear/search actions remain usable at narrow widths.
- [ ] Long Hindi title, URL, district, and name wrap without clipping.
- [ ] Category change updates form copy and conditional field visibility.
- [ ] Admin submit includes a valid hidden-field fallback for result/admit-card.
- [ ] Quiz loading, no-active-quiz, rate-limit, submit-error, and completed states are understandable.
- [ ] Color contrast, keyboard focus, accessible labels, and reduced motion are checked.
