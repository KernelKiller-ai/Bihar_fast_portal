---
name: Civic Trust & Utility
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#44474e'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#495f82'
  primary: '#001026'
  on-primary: '#ffffff'
  primary-container: '#0b2545'
  on-primary-container: '#778db2'
  inverse-primary: '#b1c7f0'
  secondary: '#a83900'
  on-secondary: '#ffffff'
  secondary-container: '#fc6018'
  on-secondary-container: '#531800'
  tertiary: '#001404'
  on-tertiary: '#ffffff'
  tertiary-container: '#002c0f'
  on-tertiary-container: '#3c9e57'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b1c7f0'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#314769'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59a'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#802a00'
  tertiary-fixed: '#95f8a7'
  tertiary-fixed-dim: '#79db8d'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
  surface-canvas: '#F8FAFC'
  surface-card: '#FFFFFF'
  surface-subtle: '#F1F5F9'
  border-delicate: '#E2E8F0'
  border-strong: '#CBD5E1'
  text-ink: '#0F172A'
  text-slate: '#475569'
  text-muted: '#64748B'
  alert-urgent-bg: '#FFF7ED'
  alert-urgent-border: '#E65100'
  status-active-bg: '#ECFDF5'
  status-active-text: '#15803D'
  status-admit-bg: '#FEF3C7'
  status-admit-text: '#B45309'
  status-result-bg: '#EDE9FE'
  status-result-text: '#6D28D9'
  brand-accent-navy: '#091E3A'
  brand-accent-orange: '#D9480F'
  official-link: '#16A34A'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  tagline-brand:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-xs:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a focused, high-integrity civic portal experience engineered for rapid public recruitment notices, educational admissions, examination schedules, and public welfare directives. Tailored for candidates across regional and national jurisdictions, the interface replaces bureaucratic clutter and sensationalism with institutional clarity, rapid scannability, and verified source provenance.

The visual direction follows **Modern Civic Functionalism**:
- **Absolute Integrity & Editorial Neutrality**: An explicit departure from ad-cluttered, misleading portals. Honest indicators replace deceptive vanity claims (zero fake timers, no unverified validation badges like "NIC Certified", no fabricated active user counters).
- **Authoritative Anchor**: Deep Navy Blue (`#0B2545`) conveys administrative dignity, accountability, and dependable permanence.
- **Action Urgency**: Saffron-Orange (`#E65100`) acts as a dedicated civic warning signal for high-priority alerts, impending cutoff deadlines, and immediate operational highlights.
- **Strict Verification Semantics**: Pure forest green (`#15803D`) is strictly reserved for active open circulars, live application windows, and validated official links. It is never used purely for decoration.
- **Bilingual Equilibrium**: Balanced vertical metric handling ensures seamless parity between Latin scripts and Devanagari Hindi, maintaining typographic rhythm and prevent matra clipping.
- **Mandatory Attribution**: Clear, fixed banners and badges prominently state the portal's independent status to uphold ethical standards and avoid user confusion.

## Colors

The color system enforces strict semantic discipline to maintain credibility, ensure rapid comprehension under high-glare mobile screens, and comply with WCAG 2.1 AA accessibility standards:

- **Primary (`#0B2545` / Deep Navy Blue)**: Forms the structural core of the platform. Used on the primary institutional header, main category tabs, card titles, and high-priority action buttons. Its darker variant (`#091E3A`) reinforces authoritative grounding across footer segments and major interface dividers.
- **Secondary (`#E65100` / Saffron-Orange)**: The operational accent. Reserved exclusively for high-priority notification strips, imminent cutoff deadlines, critical verification warnings, and primary callout surfaces. The deep variant (`#D9480F`) provides an accessible hover/focus state.
- **Tertiary (`#15803D` / Forest Green)**: Semantically locked. This token is restricted solely to live/open application states, verified status indicators, and external links directly pointing to official commission or government domains. The brighter tone (`#16A34A`) serves as the hover and focus state for direct official download buttons.
- **Neutral (`#475569` / Slate)**: Provides accessible secondary contrast for operational metadata, table cell secondary attributes, structural dividing rules, and inactive controls.
- **Surfaces & Borders**: Built upon `#F8FAFC` as the unified non-glare canvas, `#FFFFFF` for clear interactive card elevations, `#F1F5F9` for nested data matrices and form fields, anchored by `#E2E8F0` for crisp boundaries.

## Typography

The typographic hierarchy is calibrated for structural clarity, high information density, and rapid reading:

- **Display & Section Headers**: **Plus Jakarta Sans** provides a sturdy geometric posture for top-level navigation, notification card headlines, and civic category markers. Its structural terminals ensure crisp legibility on low-resolution displays.
- **Body & Data Attributes**: **Inter** handles all dynamic data cells, application requirements, qualification dates, and explanatory copy, utilizing neutral grotesque glyphs that avoid eye fatigue during dense text consumption.
- **Bilingual & Devanagari Rules**:
  - Whenever Devanagari Hindi text (such as departmental names, notices, or the civic portal motto) is rendered, the system mandates a strict fallback cascade: `Plus Jakarta Sans / Inter, "Noto Sans Devanagari", system-ui, sans-serif`.
  - Due to the vertical height of Devanagari ascenders and descenders (matras), any container rendering Hindi copy must automatically adopt a minimum line height of `1.6` (e.g., using `body-md` at `24px` line height for `14px` type) with a minimum `2px` vertical padding buffer to prevent diacritic clipping.

## Layout & Spacing

The platform uses a disciplined layout model structured around a 12-column responsive grid, designed for quick scanning and easy vertical navigation:

- **Desktop (1200px+)**: A centered max-width canvas of 1280px with an 8/4 asymmetrical split:
  - 8 columns house the primary chronological bulletin stream, exam category filters, and live recruitment cards.
  - 4 columns support sticky official commission quick-links (e.g., BPSC, BSSC, BTSC, Railway), admit card trackers, and utility downloads.
- **Tablet (768px – 1199px)**: 8-column layout with 24px margins. Content cards shift to an alternating 2-column card grid, while quick utility links move into an anchored horizontal accordion beneath active notices.
- **Mobile (< 768px)**: 4-column single-column flow with 16px lateral padding. Every touch target (buttons, filter chips, accordion toggles) must strictly respect a minimum touch box of `44px` in height.
- **Spacing Rhythm**: Governed strictly by a 4px/8px incremental scale. Spacing tokens within cards are compact (`space-xs` to `space-md`) to ensure high vertical information density without requiring excessive scrolling.

## Elevation & Depth

To maximize performance across low-end mobile devices and maintain an authoritative, objective civic atmosphere, the platform relies on **low-contrast outlines** paired with **subtle micro-shadows**:

- **Canvas Foundation**: The base canvas operates at pure flat elevation with a soft background (`#F8FAFC`) to minimize screen glare.
- **Card Containers**: White surfaces (`#FFFFFF`) framed with a crisp, low-contrast 1px border (`#E2E8F0`). Flat styling is reinforced with an ambient micro-shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`. Heavy blurs, deep drop shadows, and neomorphic extrusions are prohibited.
- **Interactive State Elevation**: Upon hover or keyboard focus, interactive elements transition to a defined boundary state (`border-color: #CBD5E1`) paired with a tight, non-spread micro-lift: `0 4px 6px -1px rgba(11, 37, 69, 0.07)`.
- **Top Utility & Alert Rails**: Pinned utility bars use flat `#0B2545` fills with zero drop shadow, relying on crisp 1px borders (`rgba(255, 255, 255, 0.1)`) to maintain distinct separation. Urgent alert bars use flat `#FFF7ED` containers anchored by a sharp 4px solid left border in Saffron-Orange (`#E65100`).

## Shapes

The geometric framework balances functional order with an accessible, modern aesthetic:

- **Cards & Data Modules**: Standard `8px` (`0.5rem`) corner radius. Applied to notification cards, input groups, information summary modules, and dialog overlays.
- **Pills & Status Identifiers**: Full pill geometry (`9999px`) is dedicated to status tags (e.g., *Active*, *Admit Card Out*), category filter pills, circular counters, and official action links. This distinct rounding differentiates interactive categorization pills from structural content cards.
- **Primary Buttons & Utility Controls**: `6px` to `8px` corners to maintain an actionable and sturdy feel.
- **Attribution & Notice Badges**: Explicit `4px` or `6px` corners, maintaining an official, document-like presentation distinct from consumer apps.

## Components

### 1. Independent Portal Attribution Banner & Badges
- **Attribution Banner**: A permanent, prominent utility banner displayed across the top of all pages. Built with a navy background (`#091E3A`), 12px text (`#E2E8F0`), and an accessible yellow/white warning icon:
  `"BiharFast is an independent civic information portal. We are NOT affiliated with any government agency or recruitment commission. Official notices must be verified on original departmental websites."`
- **Official Source Badge**: Placed alongside every circular title. When an external link leads directly to a `.gov.in` or `.nic.in` portal, it features an outlined pill badge (`#E2E8F0` border, `#F8FAFC` background) with green text (`#15803D`) stating: `"Official Link [Domain]"`.
- **Prohibited Patterns**: Fabricated claims such as *"NIC Verified Portal"*, *"Real-time User Counter"*, or clickbait timers are banned across all components.

### 2. Notification & Recruitment Cards
- **Container**: White surface (`#FFFFFF`), `1px solid #E2E8F0`, `8px` border radius, `p-4` spacing.
- **Top Bar**: Department identifier badge in `#0F172A` with a subtle slate surface (`#F1F5F9`) paired on the right with an unambiguous status chip:
  - *Active / Open*: `#ECFDF5` background, `#15803D` text, bold `label-xs`.
  - *Admit Card*: `#FEF3C7` background, `#B45309` text.
  - *Result Declared*: `#EDE9FE` background, `#6D28D9` text.
- **Title**: `headline-sm` in dark ink (`#0F172A`), clamp-limited to 2 lines, hyperlinked to the detail summary page.
- **Metadata Matrix**: 2-column or 3-column micro-grid using `#F8FAFC` background and `6px` radius:
  - Fields clearly list *Important Dates*, *Minimum Qualification*, and *Total Posts* using `label-xs` uppercase slate headers (`#64748B`) and `body-sm` dark values (`#0F172A`).
- **Footer Actions**:
  - Secondary: `"Download Official Notice (PDF)"` with download icon, minimum height of `44px`, `border: 1px solid #E2E8F0`, slate text (`#475569`).
  - Primary: `"Apply / View Details"` in solid Navy Blue (`#0B2545`) with white text, minimum height of `44px`.

### 3. Category Filter Chips & Navigation Tabs
- Rounded pill containers (`rounded-full`) with a minimum height of `44px` for touch accessibility.
- **Default State**: Surface `#FFFFFF`, border `1px solid #E2E8F0`, text `#475569`.
- **Hover/Focus State**: Border `#CBD5E1`, text `#0F172A`.
- **Active State**: Solid Navy `#0B2545`, text `#FFFFFF`, clear focus ring (`2px solid #E65100` with 2px offset).

### 4. Input Fields & Search System
- **Central Search Input**: Clean `#FFFFFF` fill with `1px solid #CBD5E1` border, `8px` radius, minimum `48px` height, placeholder in `#64748B`.
- Integrated search button utilizing Navy (`#0B2545`) with clear icon and accessible label.
- Focus state: `2px solid #0B2545` outline with clean zero-spread indicator.

### 5. Checkboxes, Radios, & Verification Controls
- Standard `18px` touch squares with `4px` corner radii (checkboxes) and circles (radios).
- Border: `2px solid #CBD5E1`. Checked state: `#0B2545` background with sharp white verification checkmark.
- Labels wrapped in a full `44px` touch target bounding area.

### 6. Urgent Alert & Critical Announcement Banners
- Surface: `#FFF7ED` with a solid `4px` left border in `#E65100`.
- Headline in `#0F172A` (`headline-sm`) accompanied by a clear saffron icon.
- Direct inline action: `"View Urgent Order →"` styled with a distinct `#E65100` underline, maintaining complete clarity without distracting flashing animations.