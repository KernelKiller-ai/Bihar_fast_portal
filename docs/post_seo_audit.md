# Post SEO: Initial HTML Audit

## Summary

The `/post/:slug` path is rewritten by Vercel to `frontend/api/post-seo.js`, but that handler branches on the user-agent: recognized crawlers get a separately generated article document, while a normal browser gets the unmodified `/index.html` shell. That shell has the homepage title, description, canonical, Open Graph URL/title/description and Twitter URL/title/description. React updates several tags only after the post API request completes, so those changes do not appear in the original HTML returned by the normal-browser branch or in `view-source`. The crawler document does have a self-canonical and post Open Graph values, but ignores `meta_title` and has no Twitter tags. No source files were changed; the smallest safe fix is server-side post-aware metadata injection into the SPA shell for every user-agent, keeping the app scripts/body intact.

## Findings

### 1. How `/post/:slug` HTML is produced

1. **Base HTML shell:** `frontend/index.html` contains the homepage SEO values: homepage title, description, `https://biharfast.in/` canonical and `og:url` at lines 22–39, plus homepage Twitter URL/title/description at lines 45–47. These are literal source HTML tags, not computed per request.
2. **Static prerendering:** `frontend/scripts/prerender.js` reads `STATIC_ROUTE_METADATA`, replaces title, description, canonical, Open Graph title/description/URL and Twitter title/description/URL, then writes HTML under `dist/<route>/index.html` and `dist/<route>.html` (lines 4, 79–111). It only iterates configured static routes; it does not fetch notices or generate `/post/<slug>` pages.
3. **Vercel routing:** `frontend/vercel.json` has a rewrite from `/post/:slug` to `/api/post-seo?slug=:slug` (lines 35–39), before the generic SPA rewrite to `/index.html` (lines 45–46). The declared post pattern is a single slug segment, so `/post/example-slug` matches its shape; extra path segments are not covered by that pattern. The source code establishes this intended rewrite and ordering; actual deployed Vercel routing was not probed.
4. **Vercel post SEO handler:** `frontend/api/post-seo.js` is the target. It handles GET requests and checks the user-agent against a fixed crawler list (lines 4–17, 165–173). For listed crawlers it fetches `https://bihar-fast-portal.onrender.com/api/posts/<slug>` and generates a small standalone article document. For non-crawlers it fetches the site's `/index.html` and returns that shell unchanged (lines 146–163, 173–185).
5. **React metadata updates:** `RouteSEO` runs in a React effect and only updates metadata when `getMetadataForPath(location.pathname)` returns a configured static entry (lines 14–24 in `frontend/src/components/RouteSEO.jsx`). For `/post/:slug` there is no matching static entry, so `RouteSEO` does nothing. `PostDetail` separately fetches the post and changes metadata after it has data (details in section 3).
6. **No React Helmet path:** No `react-helmet`, `<Helmet>`, or equivalent use was found in `frontend/src`; the metadata changes inspected here are direct `document`/`document.head` mutations.

### 2. Metadata produced by each path

| Request path and branch | Title | Description | Canonical | `og:*` | `twitter:*` |
|---|---|---|---|---|---|
| Normal browser, initial response | Homepage title from `index.html` | Homepage description from `index.html` | `https://biharfast.in/` | Homepage `og:type=website`, homepage `og:title`, `og:description`, `og:url=https://biharfast.in/` and homepage image | Homepage card, URL, title, description and image |
| Listed crawler, successful post fetch | `${post.title} - BiharFast`; the server function does **not** use `meta_title` | `meta_desc`, else `short_desc`, else a department/title sentence; stripped of tags/whitespace and truncated to 160 characters | Self URL, `https://biharfast.in/post/<encoded-slug>` | `og:type=article`, title, description, self `og:url`; no `og:image` is emitted | No Twitter tags are emitted |
| Normal browser after client fetch and React effect | `meta_title` when non-empty, otherwise `${post.title} - BiharFast` | `meta_desc`, else first 155 characters of `short_desc`, else a department/title fallback | Set to `https://biharfast.in/post/<post.slug-or-route-slug>` | Post title, description, `og:type=article`, self `og:url`; existing homepage `og:image` remains | Sets card, title and description. It does **not** set `twitter:url`, so the shell's homepage Twitter URL remains. Existing Twitter image remains too. |

Evidence:

- The normal-browser branch returns the `/index.html` body without rewriting tags: `frontend/api/post-seo.js:146-163,173-185`. The homepage SEO tags are in `frontend/index.html:22-47`.
- In the server renderer, `articleHtml` derives title from `post.title` only and derives description from `post.meta_desc`/`short_desc`/fallback (`frontend/api/post-seo.js:93-104`). It emits title, description, article Open Graph metadata and canonical (`frontend/api/post-seo.js:122-129`); there are no Twitter tags in the generated article template (`frontend/api/post-seo.js:116-140`).
- The handler fetches the notice from the FastAPI detail API (`frontend/api/post-seo.js:186-203`). That API serializes the result of `fetch_notice_by_slug`; the helper selects `*`, which includes the SEO fields, and filters to published and active posts (`backend/main.py:595-628`, `backend/database.py:148-157`).
- React's post-specific title, description, Open Graph, Twitter and canonical writes are in `frontend/src/pages/PostDetail.jsx:119-173`.
- `meta_title` is persisted on notice writes, defaulting to the cleaned title; `meta_desc` is persisted with a short-description fallback (`backend/main.py:737-738`). The browser honors `meta_title`; the Vercel post renderer currently does not.

The Vercel handler executes for every GET request that reaches the rewrite; it is **not** a bots-only function. The **post-specific rendering branch** is crawler-only: any user-agent not matching the list in `isCrawler` follows the SPA-shell branch (`frontend/api/post-seo.js:4-17,165-185`).

### 3. Client-side title and canonical behavior

- When the React app mounts, `RouteSEO` checks the pathname and updates configured static route metadata. Since `/post/<slug>` is not a key in `STATIC_ROUTE_METADATA`, it does not set post metadata (`frontend/src/components/RouteSEO.jsx:14-24`, `frontend/src/utils/seoConfig.js:275-281`).
- `PostDetail` begins an asynchronous fetch from `/api/posts/${slug}` (`frontend/src/pages/PostDetail.jsx:50-116`). Only once `post` is populated does its SEO effect set `document.title`, description, Open Graph and Twitter values, and the canonical to the post's own URL (`frontend/src/pages/PostDetail.jsx:119-173`). Consequently the metadata can become post-specific in the live DOM after load; that does not alter the original HTML response or browser `view-source`.
- On cleanup, `PostDetail` resets the title and restores the canonical value it found before the effect (usually the homepage canonical from the shell), then removes its JSON-LD script (`frontend/src/pages/PostDetail.jsx:198-205`).
- Thus the canonical **is** set to the post URL in the crawler HTML and later in the hydrated browser DOM. It is not post-specific in the initial normal-browser HTML.

### 4. Homepage canonical and affected route types

The raw `frontend/index.html` has a homepage canonical, but it is **not** correct to say that every non-home route necessarily receives that raw file: the build prerenders configured static routes from `STATIC_ROUTE_METADATA` (`frontend/scripts/prerender.js:79-111`). Vercel's fallback rewrite targets `/index.html` for otherwise-unmatched paths (`frontend/vercel.json:45-46`). The post SEO handler itself explicitly fetches `/index.html` for ordinary user-agents, so it bypasses route-specific metadata for post requests.

| Route type | Source-level initial metadata behavior |
|---|---|
| `/post/:slug` | Not in static route metadata. Vercel rewrites to the function. For ordinary browsers the function returns the homepage shell with homepage canonical; listed crawlers get a post-specific canonical. |
| `/category/:slug` | The route is dynamic in `App.jsx:779`. Nine named paths are present in the static metadata map and therefore included by the prerender loop: `/category/welfare-schemes`, `/category/scholarships`, `/category/bpsc-jobs`, `/category/bihar-police`, `/category/teacher-recruitment`, `/category/health-department`, `/category/panchayati-raj`, `/category/student-schemes`, and `/category/social-welfare` (`frontend/src/utils/seoConfig.js:144-203`). Other slugs have no static metadata and depend on the SPA fallback. After hydration, `CategoryPage` sets a title, description and self-canonical (`frontend/src/pages/CategoryPage.jsx:92-111`). |
| Category listing paths `/jobs`, `/admit-card`, `/results` and `/sitemap` | Static metadata entries and prerender candidates (`frontend/src/utils/seoConfig.js:18-42`). `/all-updates` is also configured, with canonical `/sitemap` (`frontend/src/utils/seoConfig.js:46-49`). |
| Dedicated hubs | Known hubs such as `/bseb-matric-10th`, `/bseb-inter-12th`, `/cuet-ug-admission`, `/rtps-bihar`, `/udyami-yojana`, `/kyp-bihar`, and `/student-credit-card` have static metadata and are prerender candidates (`frontend/src/utils/seoConfig.js:95-140`). |
| Mock test | `/mock-test`, `/class-10-quiz`, and `/mock-test/class-10` have static metadata; the two aliases canonically point to `/mock-test` in the prerender metadata (`frontend/src/utils/seoConfig.js:53-70`). After hydration, `MockTestPage` sets canonical to the current pathname (`frontend/src/pages/MockTestPage.jsx:116-139`), so alias canonical behavior in the live DOM differs from the prerendered alias canonical. Query variants such as `?exam=` do not change the static metadata key. |
| Other non-static routes | Routes absent from `STATIC_ROUTE_METADATA` (for example `/dashboard` and `/admin`) have no configured route-specific metadata in the inspected `RouteSEO` flow; if served through the generic SPA rewrite, their raw shell canonical is the homepage. |

### 5. Failure modes and caching

- **Render cold start / slow backend:** The crawler branch calls Render's `/api/posts/<slug>` with plain `fetch` and no explicit timeout or abort signal (`frontend/api/post-seo.js:186-190`). A cold start or slow response can delay the Vercel function until its platform limit; the limit is not specified in the checked-in `vercel.json`. Fetch failures are caught and produce HTTP 503 HTML; non-OK upstream responses other than 404 also produce 503 (`frontend/api/post-seo.js:195-210`). The normal-browser branch still returns the homepage shell independently of Render, then the React detail request can remain pending; its `AbortController` is aborted on component cleanup, not after a timeout (`frontend/src/pages/PostDetail.jsx:50-116`).
- **Function fallback behavior:** A missing/invalid post payload is treated as 404, not as a homepage success (`frontend/api/post-seo.js:191-203`). The 404 response is noindex/no-follow. A transient 5xx uses a generic service-unavailable HTML document, not the homepage, and is set no-cache/no-store (`frontend/api/post-seo.js:43-59,76-90`). The normal-browser branch is the distinct case that intentionally returns the homepage shell with 200.
- **CDN / stale content:** Successful crawler HTML is marked `public, s-maxage=300, stale-while-revalidate=600`; errors are no-store (`frontend/api/post-seo.js:43-59`). The browser-shell response sets only content type and does not forward the `/index.html` response's cache header (`frontend/api/post-seo.js:146-163`; `frontend/vercel.json:2-10`). The FastAPI detail API itself returns `Cache-Control: public, max-age=300, s-maxage=1800`, and its Redis key is `post:<slug>` with 1800-second expiry (`backend/main.py:595-628`). Notice writes schedule cache flushing for old/new slug keys (`backend/main.py:795-800`), but that does not by itself establish invalidation of Vercel's edge cache. Actual deployed CDN behavior/default caching for the function response was not tested.
- **Slug mismatch:** The Vercel function decodes the supplied rewrite query slug, then requests the encoded slug from the backend (`frontend/api/post-seo.js:35-41,186-190`). FastAPI looks up the exact slug equality and returns 404 when no published/active match exists (`backend/main.py:611-612`, `backend/database.py:153-157`). A stale link, changed slug, unexpected encoding/case, or mismatch between route and stored slug can therefore produce 404; no fuzzy or old-slug redirect is implemented in these paths.

### 6. Smallest safe fix proposal (not implemented)

Change the `/post/:slug` Vercel handler so **all user-agents** load the post and receive the same post-specific metadata in the **initial HTML response**, while normal browsers still receive the SPA's scripts and body:

1. Fetch the existing `/api/posts/<slug>` endpoint server-side for each request (or use the function's existing response where possible).
2. For a successful post, fetch the SPA shell and replace/upsert its `<title>`, description, canonical, `og:title`, `og:description`, `og:url`, and Twitter title/description/URL values using escaped values. Use `meta_title` when non-empty and the same fallback as the client (`post.title - BiharFast`); derive description from `meta_desc`, then `short_desc`, then a safe post fallback. Set canonical and both social URLs to the encoded self URL. Preserve the original app scripts/body so normal user functionality remains.
3. Return 404 for a genuinely missing/unpublished post and a non-cacheable 503 for upstream timeouts/errors; add a short explicit upstream timeout and keep error responses from becoming a cached homepage. Use an appropriate cache policy or purge/revalidate strategy for successful post metadata so updates and slug changes do not leave stale metadata at the edge.
4. Add tests for an ordinary browser user-agent and crawler receiving identical initial post metadata, `meta_title`/fallback behavior, self-canonical and social URLs, and the 404/503 cases.

Simply removing the user-agent check and returning the current `articleHtml()` for everyone would produce post-specific metadata, but would also replace the React application with a standalone article document for normal users. That is not the smallest safe behavior-preserving change.

## BiharFast end-of-task report

Day N - read-only investigation (no migration day started)  
Files changed: `docs/post_seo_audit.md` only.  
Commands run: repository reads/searches and `git status`; no production URL, database, build, or tests were run.  
Tests: not run (read-only code investigation).  
Verified: source behavior for Vercel rewrite and user-agent branches, initial HTML metadata, prerender list/rewrites, React head changes, API slug lookup, and cache headers.  
NOT verified / assumptions: deployed Vercel rewrite behavior, deployed CDN caching, Render cold-start timings, and production request/response HTML; no external request was made.  
Risks or questions for the owner: normal-browser source HTML remains the homepage shell for `/post/:slug`; crawler HTML ignores `meta_title` and omits Twitter tags.  
Go / No-go recommendation: No-go for post SEO correctness until the initial HTML is rendered with post-specific tags for ordinary browser requests. This is an audit finding only; no fix was implemented.
