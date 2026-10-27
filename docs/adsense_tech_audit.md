# BiharFast AdSense / Technical SEO Audit

**Audit date:** 2026-10-27  
**Scope:** Read-only inspection of routing, build/prerender output, static-page copy, notice pages, metadata, and unknown-route handling. No application code was changed.

> `BiharFast.md` was not present in the workspace, so this report uses a structured Markdown audit format. An existing `frontend/dist` was present; a fresh build was not run because it would overwrite those generated files. Word counts below are measurements of the existing generated files, not a fresh-build claim.

## Executive summary

- The legal and informational routes have no matching Vercel function in this repository. `/privacy-policy`, `/terms`, and their aliases are React routes and generated static pages. The only frontend function is `api/post-seo.js`, explicitly mapped to `/post/:slug`.
- `frontend/package.json` **does** run `node scripts/prerender.js` after `vite build`. The script writes both `dist/<route>/index.html` and `dist/<route>.html`.
- Prerender body injection currently fails: it searches for an exact `<div id="root">`, but the HTML shell uses `<div id="root" class="...">`. The checked-in `dist` confirms the generated static pages retain only the generic homepage skeleton in their bodies.
- The prerender source has two actual Markdown-in-HTML corruptions: the privacy-policy link text and the post JSON-LD `@context`. Other `](http...)` matches found are intentional Markdown links in README/LLM text.
- Static post generation duplicates the `/post/:slug` function path and has less complete metadata handling. Keep one path; the recommendation is to keep `/api/post-seo` and remove Part B static post generation.
- The global Vercel fallback rewrites arbitrary paths to `/index.html`, yielding a soft 404. Replace it with explicit known-route handling and a real 404 document.

## 1. `/privacy-policy` and `/terms` HTTP 500

### What the repository shows

- `frontend/vercel.json:35-47` has, in order:
  1. `/post/:slug` → `/api/post-seo?slug=:slug`
  2. `/api/:path*` → the Render backend
  3. a broad non-asset rewrite to `/index.html`
- `frontend/api/post-seo.js:216-260` is the only frontend serverless handler examined. It handles GET requests for post SEO, fetches the post API with a six-second upstream timeout, then fetches `/index.html`. It is not mapped to either legal URL.
- `frontend/src/App.jsx:773-791` defines the React page routes. `/privacy-policy` and `/privacy` both render `PrivacyPolicy`; `/terms` and `/terms-and-conditions` both render `Terms`. These are client-side aliases, not duplicate Vercel function endpoints.
- `frontend/src/utils/seoConfig.js:235-257` has metadata for both canonical routes and aliases. The aliases point canonically to `/privacy-policy` and `/terms`.
- Part A of `frontend/scripts/prerender.js:174-178` writes both directory-index and sibling HTML forms. Existing local files include `dist/privacy-policy/index.html`, `dist/privacy-policy.html`, `dist/terms/index.html`, and `dist/terms.html`, as well as the corresponding `/privacy` and `/terms-and-conditions` alias files.

### Assessment

The checked-in configuration does not identify a legal-page function that could itself return 500. If Vercel serves the existing directory-index files, those routes should be static. If the rewrite catches them first, it would send them to the SPA shell; that explains generic content, but not a 500 by itself. A wrong Vercel project root/output directory, a deployed artifact differing from the inspected `dist`, or a platform/deployment issue remain plausible, but cannot be proven from repository files. A ~15-second delay is not explained by the legal-page route code.

**Next diagnostic evidence needed:** Vercel deployment build settings/logs, deployed file listing, and response headers/request IDs for both routes. Confirm the Vercel project root is `frontend` and the output directory is `dist`; verify the deployed files are the expected `privacy-policy/index.html` and `terms/index.html`. Do not attribute the 500 to the duplicate React aliases without those runtime facts.

## 2. Build execution and generated initial HTML

### Build behavior

- `frontend/package.json:8` defines `"build": "vite build && node scripts/prerender.js"`. The prerender script is therefore part of the build command; the root `package.json` does not define this frontend build.
- `frontend/scripts/prerender.js:112-178` iterates `STATIC_ROUTE_METADATA`, updates title/description/canonical/social metadata, and writes both `<route>/index.html` and `<route>.html`.
- Body injection at `frontend/scripts/prerender.js:89-93` only recognizes the exact strings `<div id="root"></div>` or `<div id="root">`. The shell in `frontend/index.html:145-155` instead uses `<div id="root" class="w-full max-w-full overflow-x-hidden">` and contains `initial-hero-skeleton`. Neither check matches this root element, so the prerendered route body is not injected.

### Existing generated output measured

Measurement method: visible text inside the generated `#root`, excluding tags, counted as Unicode letter/number word tokens. The five current files each have **17 visible words** and the same single H1, **“Bihar’s Fastest Gateway to Jobs & Public Services.”** (the exact HTML contains `&amp;`). They do not have a route-specific H1 or the route copy. Their head metadata is route-specific.

| Route | Existing generated file | Root words | H1 in initial HTML |
|---|---|---:|---|
| `/about` | `frontend/dist/about/index.html` | 17 | `Bihar’s Fastest Gateway to Jobs & Public Services.` |
| `/contact` | `frontend/dist/contact/index.html` | 17 | `Bihar’s Fastest Gateway to Jobs & Public Services.` |
| `/privacy-policy` | `frontend/dist/privacy-policy/index.html` | 17 | `Bihar’s Fastest Gateway to Jobs & Public Services.` |
| `/terms` | `frontend/dist/terms/index.html` | 17 | `Bihar’s Fastest Gateway to Jobs & Public Services.` |
| `/disclaimer` | `frontend/dist/disclaimer/index.html` | 17 | `Bihar’s Fastest Gateway to Jobs & Public Services.` |

This local artifact has a generic H1, not “no H1”; the reported Googlebot result therefore does not exactly match the inspected local output. It does confirm the important defect: all five pages expose the same very short shell rather than their own substantive content. The crawl may have seen a different deployed build or response.

### Required initial document content

The initial static body must contain the complete page content already present in the corresponding React page, with a route-specific H1, its full sections/paragraphs/lists, and real anchor elements for navigational and external links. At minimum the H1 text must match:

| Route | Required route H1 |
|---|---|
| `/about` | `हमारे बारे में (About BiharFast.in)` |
| `/contact` | `हमसे संपर्क करें (Contact & Grievance Redressal)` |
| `/privacy-policy` | `Privacy Policy` |
| `/terms` | `Terms & Conditions of Use` |
| `/disclaimer` | `BiharFast Disclaimer` |

The complete source text is in `frontend/src/pages/about.jsx`, `contact.jsx`, `privacyPolicy.jsx`, `terms.jsx`, and `disclaimer.jsx`. For example, the privacy page has nine numbered sections (including AdSense/cookies, analytics, rights, and grievance contact); the terms page has seven sections; the disclaimer contains the non-government declaration, sourcing, anti-fraud, liability, external-link, and grievance sections. The short strings embedded in `prerender.js` are not equivalent to this copy.

## 3. Markdown-link corruption

The repository search for `](http` outside `node_modules` and `dist` found two occurrences in executable prerender output:

1. `frontend/scripts/prerender.js:123`: the privacy paragraph contains `[https://biharfast.in](https://biharfast.in)` inside an HTML `<p>`. This will render the Markdown delimiters as literal text, not a link.
2. `frontend/scripts/prerender.js:206`: JSON-LD uses `"@context": "[https://schema.org](https://schema.org)"`, which is not the Schema.org context URL and invalidates the intended structured-data value.

`frontend/public/llms.txt` has 22 similar strings, and `README.md` / `frontend/README.md` also contain Markdown links; those are intentional Markdown documents, not HTML/JSON-LD output. No other `](http...)` occurrence in the searched source paths was an executable-page corruption.

There is a separate raw-Markdown leak risk: `cleanMarkdownHtml()` in `frontend/scripts/prerender.js:22-36` strips only opening/closing code fences. Part B places `p.content` into generated HTML at lines 200 and 231 without converting Markdown syntax. Thus post content containing Markdown links or formatting can be emitted literally.

## 4. React copy and a single source of truth

The page copy currently lives inline in React JSX:

- About: `frontend/src/pages/about.jsx:19-84` and following.
- Contact: `frontend/src/pages/contact.jsx:60-173`.
- Privacy: `frontend/src/pages/privacyPolicy.jsx:14-82`.
- Terms: `frontend/src/pages/terms.jsx:11-68`.
- Disclaimer: `frontend/src/pages/disclaimer.jsx:12-58`.

The prerenderer independently hard-codes abbreviated versions in `frontend/scripts/prerender.js:119-162`. That duplication caused copy drift.

**Smallest durable fix:** move the authored static-page content into a shared data module (structured sections, paragraphs, lists, and link records) that can be imported by both React and the Node prerender script. Have React render those records and have prerender produce equivalent escaped semantic HTML (`main`, one `h1`, headings, paragraphs, lists, and `<a href>` links). Avoid trying to import JSX components directly into the Node script; Node does not run the Vite JSX transform here. A constant authored HTML string is smaller but makes safe rendering and future edits less reliable.

## 5. Static Part B versus `/api/post-seo`

- Part B of `frontend/scripts/prerender.js:184-251` fetches the public notices endpoint at build time, then writes `dist/post/<slug>/index.html` and `dist/post/<slug>.html`.
- `frontend/vercel.json:37-39` separately rewrites every `/post/:slug` request to `/api/post-seo?slug=:slug`.
- The function in `frontend/api/post-seo.js:101-116` fetches the current post and uses `meta_title`, then title fallback; for descriptions it prefers `meta_desc`, then stripped/truncated `short_desc`, then a generated fallback. Its `fetchSpaShell()` currently returns the SPA shell, not the static body from Part B.
- The current checked-in `dist` has no `post` output directory, so there are no existing generated post files to compare or verify.

**Recommendation: keep `/api/post-seo` as the single source for `/post/:slug`; remove Part B static post-page generation.** The explicit rewrite means the function is the configured request path, while Part B adds a competing cache/deployment path and currently has weaker metadata and Markdown handling. If static generation is preferred instead, that is an alternative architecture: remove the function rewrite and make build output the sole path; do not keep both. Whichever path remains must render/serve actual post content if full initial content is required, not only the shell and metadata.

## 6. Real 404 handling without breaking dynamic routes

The final rewrite in `frontend/vercel.json:45-47` sends nearly every non-asset URL to `/index.html`; that turns unknown URLs into a 200 SPA shell. `frontend/src/App.jsx` has no terminal `path="*"` route either.

Recommended plan:

1. Add a branded `404.html` to the Vercel output (for example via `frontend/public/404.html`) so Vercel can serve an actual not-found document/status for unmatched paths.
2. Remove the broad catch-all rewrite. Add explicit routes only for supported pages/aliases, using the existing `STATIC_ROUTE_METADATA` and React route inventory as the source list; direct static pages should continue to resolve to their generated route files.
3. Keep `/post/:slug` mapped to `/api/post-seo` before any SPA route fallback. The function already returns 404 when the upstream explicitly returns 404 (`post-seo.js:231-260`); consider making upstream failures distinguishable from a genuine missing post rather than returning a success-shaped fallback.
4. Keep `/category/:slug` explicitly routed to the SPA shell, preserving `CategoryPage` and its `notices` input (`App.jsx:779`). Do not send this route to the generic 404 solely because it is dynamic.
5. Test known static routes, a known and missing post, a valid category, an unknown category policy, assets, and a random unknown path against the deployed host, asserting both body and HTTP status.

## 7. Latest 20–30 notices in homepage initial HTML

The homepage currently fetches notices in `frontend/src/App.jsx:85-156` from the Render API inside `useEffect`, so they are absent from initial HTML. The current visible list is rendered later through `filteredData.map()` and `NotificationCard` (`App.jsx:615-618`); `NotificationCard` uses React Router `<Link>` rather than source HTML anchors.

The backend response at `backend/main.py:563-585` is `{ success, source, data }`, where `data` is fetched with a limit of 50. The prerenderer currently expects the response itself to be an array (`prerender.js:190-195`), unlike the backend contract and the React app’s `json.data` handling.

At build time, read `payload.data`, validate each record has a displayable title and safe slug, select the first 20–30 in the feed’s existing order, and emit a semantic list into the homepage body, for example `<li><a href="/post/<encoded-slug>">escaped notice title</a></li>`. Use the same selected records for client display if practical. This produces crawlable plain anchors before JavaScript; keep the list modest to avoid making the homepage HTML excessively large. The source API should have a bounded timeout and a deliberate behavior when unavailable. The observed ~12-second homepage load cannot be established from source alone, but the Render request in the mount effect is a likely latency contributor (including a possible cold start).

## 8. Post title/description metadata mismatch

Part B currently sets:

- title to `${p.title} - BiharFast` (`prerender.js:202`);
- description to `(p.summary || p.title).slice(0, 160)` (`prerender.js:203`).

It does not consult `p.meta_title`, `p.meta_desc`, or `p.short_desc`. The configured `/api/post-seo` path does consult those fields as described above (`post-seo.js:101-116`). This is why static prerender metadata ignores `meta_title` and uses `summary` instead of the API’s SEO description precedence. Keeping one source of truth for `/post/:slug` removes that discrepancy.

## Proposed fix list, ordered by risk

1. **Critical — resolve the reported legal-route 500 at the deployed routing layer.** Verify Vercel project root/output directory and deployed artifacts/logs; confirm the legal paths resolve to their static files and do not traverse a function. Do not infer a code cause until response evidence is available.
2. **High — fix static body injection and restore complete page copy.** Replace brittle root-string matching with a stable explicit placeholder in `index.html` (or a DOM-aware transform), then use shared content data for all five static pages. Add tests asserting route H1s, required page text, and initial-body word thresholds.
3. **High — fix unknown-route status.** Replace the catch-all rewrite with an explicit supported-route list plus a custom 404 document. Preserve `/post/:slug` and `/category/:slug` as explicit dynamic routes, and test true response status.
4. **High — make post delivery single-path and correct.** Keep the post SEO function or static Part B, not both; recommended function path. Ensure the chosen path serves post body content, applies `meta_title` / `meta_desc` / `short_desc` consistently, and converts or safely renders Markdown.
5. **Medium — repair the two malformed strings.** Use the literal `https://biharfast.in` in privacy prose and `https://schema.org` as the JSON-LD `@context`; validate generated JSON-LD and search rendered HTML for raw Markdown delimiters.
6. **Medium — include 20–30 real notice anchors in homepage HTML.** Read the actual `{data: [...]}` feed shape, validate slugs/titles, and emit escaped `<a href>` links with a bounded build-time fetch.
7. **Medium — reduce first-load dependency on the Render API.** Measure the homepage request waterfall and backend cold-start timings; retain a fast initial document while notices load or are included in build output.

## Validation performed

- Read repository source/configuration and searched for `](http...)` outside `node_modules` and `dist`.
- Measured the five existing `frontend/dist/<route>/index.html` documents; each currently has 17 visible root words and the same generic H1.
- Did not run a fresh build or change application code. Existing untracked audit files were left untouched.
