# BiharFast UI/UX Design Brief

**Scope:** Maintain current visual and interaction behavior while specifying accessible designs for the planned contributor/editor workflow. Proposed styling is not evidence that every token or component already exists.

## 1. Experience principles

- **Mobile first:** prioritize fast notice discovery and readable action links on narrow screens.
- **Trust and clarity:** distinguish editorial summaries from official source material; label external actions clearly.
- **Low-friction navigation:** search and categories should be easy to find without hiding primary notice content.
- **Honest feedback:** loading, empty, validation, success, and failure states must be distinguishable.
- **Bilingual readability:** allow Hindi and English text expansion, wrapping, and mixed-script content.
- **Accessible by default:** semantic structure, keyboard support, visible focus, adequate contrast, and reduced motion.

## 2. Design tokens

| Token | Target value | Use |
|---|---|---|
| Primary / BiharFast Blue | `#0B4F8A` | Main actions, selected navigation, focus accent |
| Page background | `slate-50` | Main application surfaces |
| Main text | `slate-900` | Body text and headings |
| Muted text/surface | Slate scale | Secondary metadata, borders, disabled states; validate contrast |
| Status | Text + icon + color | Pending, approved, rejected, success, and error states |

The checked-in styles also use deep navy such as `#0F2A4A`, blue including `#16406E`, amber, green, and slate neutrals. Apply the target primary consistently in new or revised components, then reconcile legacy colors rather than introducing a third competing blue.

## 3. Typography, layout, and accessibility

- Use the existing system UI font stack unless an approved, tested font change is made.
- Maintain readable Hindi/English line lengths and natural wrapping for long titles, districts, and URLs.
- Provide a visible keyboard focus ring against both light and colored surfaces.
- Meet WCAG contrast targets for normal and large text; do not use color alone for status.
- Design interactive controls with a **minimum 48 × 48 CSS px target where practical**; do not reduce existing native control affordances.
- Use semantic headings, labels, buttons, and links; provide accessible names for icon-only controls and suitable alt text for meaningful imagery.
- Respect `prefers-reduced-motion`.

## 4. Responsive behavior

- Prevent horizontal overflow at 320px and 360px; validate 390px, tablet, and desktop widths too.
- Keep root wrappers at available width; allow long Hindi strings and URLs to wrap.
- On mobile, prioritize logo, menu/profile action, and primary navigation; condense secondary navbar content.
- Keep search flexible rather than imposing a fixed minimum width.
- Stack apply/PDF actions when adjacent controls become cramped.
- Ensure the mobile bottom navigation is introduced only if it fits the existing information architecture and does not duplicate/conflict with the current navbar.

## 5. Critical interface patterns

### Notice discovery and detail

- Provide clear category badges for `jobs`, `admit_card`, `results`, and `schemes`.
- Display the concise summary and critical dates/eligibility before dense content.
- Label official apply, result/admit-card, and PDF actions explicitly; indicate external destinations.
- A click-to-copy action may be added only where a copyable value has a clear user benefit; expose confirmation via a live region.
- An official-notification preview modal is a proposed enhancement, not an existing verified component. If implemented, preserve keyboard focus, escape handling, and a direct open/download link.
- Render rich content safely; the backend write and render paths must not rely on client-side sanitation alone.

### Loading, errors, and layout stability

- Use reserved dimensions or skeletons for asynchronous regions to reduce layout shift.
- The target is low CLS, not a promise of exactly `CLS = 0`; confirm with field data.
- A dedicated hero skeleton is a design proposal unless confirmed in the live component tree. It must not flash unnecessarily for cached/fast responses.
- Keep errors visible and recoverable; never use a success-shaped empty fallback for failed API requests.

### PWA and install

- Use the configured app name/icons and standalone manifest behavior.
- Offer install guidance when appropriate, without blocking content or repeatedly prompting.
- The current source has both Vite PWA/Workbox configuration and a manually registered public `/sw.js`; validate that users do not receive competing registrations, stale caches, or broken offline navigation.

### Contributor submission (planned)

- Form order: title, category, primary source/official link, key dates/eligibility, and article content.
- Mark required fields and show inline, field-specific validation in plain language.
- Distinguish “Save draft” from “Submit for review”; pending status must be explicit and must not look published.
- Do not claim plagiarism or destination links were automatically verified unless the relevant service actually ran and returned a result.
- Make editing, submission status, rejection reason, and resubmission path visible to the contributor.

### Editorial queue / Django Admin (planned)

- Use scannable queue columns for title, category, author, submitted time, and status.
- Make source and official destination easy to inspect without losing the draft context.
- Approval/rejection actions require a confirmation/decision reason appropriate to the action; surface resulting status and audit details.
- Django Admin is the target moderation interface, not a current route implementation. Keep public-facing design consistent if a custom editorial dashboard is later selected.

## 6. QA checklist

- [ ] Home, notice, admin, quiz, result, dashboard, and hubs checked at 320px, 360px, 390px, tablet, and desktop.
- [ ] Long Hindi/English titles, labels, author names, and URLs wrap without clipping.
- [ ] Keyboard focus, accessible names, contrast, zoom, and reduced-motion behavior tested.
- [ ] Loading skeleton/reserved space reduces layout shifts without delaying fast content.
- [ ] Category labels and status badges communicate meaning without color alone.
- [ ] Official links are clearly labeled and work with keyboard and assistive technology.
- [ ] PWA install, update, cache invalidation, and offline fallback tested on production-like builds.
- [ ] Contributor/editor screens remain clearly distinct from public/published content.
- [ ] Design claims and Core Web Vitals targets are checked against implementation and measurements.
