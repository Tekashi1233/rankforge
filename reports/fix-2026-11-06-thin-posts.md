# RankForge Fixes — 2026-11-06: Thin posts, removals, author, fonts

Site: https://rankforgetool.com · Repo: Tekashi1233/rankforge · Branch: main
Follow-up to audit 2026-11-06 (SEO 82, Technical 90, Content 68, AdSense 74).
Owner decisions implemented: expand thin posts, remove 3 coming-soon tools, remove 11 Pinterest pin images.

## 1. Thin posts expanded to 800+ words

Word counts are article text only: text inside `<main>`, tags stripped. All 20 posts are now 800+ words; the 11 expanded posts are listed below. No URLs, titles, or canonicals changed. All new content is original, plain-English, and specific — no invented statistics, no copied text.

| Post | Before | After | Added | New sections |
|---|---|---|---|---|
| blog/how-to-write-seo-friendly-url-slugs.html | 553 | 846 | +293 | Worked example turning a long title into a short slug; common slug mistakes |
| blog/title-case-vs-sentence-case-for-headlines.html | 590 | 902 | +312 | Common title-case mistakes; pre-publish headline checklist |
| blog/open-graph-protocol-why-content-looks-broken-on-social-media.html | 588 | 966 | +378 | Worked example of a good preview; why previews still look wrong after fixing tags |
| blog/what-is-readability-score-and-why-it-matters-for-seo.html | 591 | 893 | +302 | Worked example rewriting a hard paragraph; common readability mistakes |
| blog/how-many-words-should-a-blog-post-be.html | 617 | 895 | +278 | Worked example planning length from search results; common length mistakes |
| blog/how-llms-and-answer-engines-read-webpages.html | 617 | 923 | +306 | Worked example making a page quotable; mistakes that block answer engines |
| blog/how-to-create-a-strong-password.html | 653 | 919 | +266 | Step-by-step password checklist; what to do if a password leaks |
| blog/what-is-lorem-ipsum-and-when-to-use-placeholder-text.html | 671 | 945 | +274 | Lorem vs real copy worked example; pre-launch placeholder checklist |
| blog/what-is-robots-txt-and-how-to-create-one.html | 690 | 946 | +256 | Worked example staging vs live; robots.txt vs noindex vs password protection |
| blog/how-long-should-a-meta-description-be.html | 712 | 956 | +244 | Why length is measured in pixels not characters; worked example trimming a long description |
| blog/what-is-heading-structure-and-how-to-check-it.html | 495 | 850 | +355 | How to plan headings before writing; common heading mistakes and fixes |

Other 9 posts were already 800+ (809–1229 words) and were not expanded, except for the author/font changes below. Internal links to related RankForge tools were added or kept where natural (slug, meta-tag, readability, word-counter, password, lorem-ipsum, robots-txt, text-case, AI-readiness, GEO-score, heading-structure checkers).

## 2. Removed — 3 coming-soon tools

Deleted (owner decision):
- tools/backlink-checker.html
- tools/rank-tracker.html
- tools/site-audit.html

Sitemap updated: 47 → 44 entries (3 URLs removed). Verified: no file in the repo links to them (grep for backlink-checker, rank-tracker, site-audit = 0 hits), and they were not linked from tools.html, index.html, or any blog post.

## 3. Removed — 11 Pinterest pin images

Deleted the entire pins/ directory (11 .jpg files, 100–133 KB each). Verified: no HTML file referenced /pins/ (grep = 0 hits; the site had zero `<img>` tags). No images were added elsewhere, per owner instruction.

## 4. Author + Organization JSON-LD

Author is Abdullah, creator of RankForge, contact thanosabdulla@gmail.com, GitHub Tekashi1233. No other credentials invented.

- about.html: added "Who writes RankForge" section (short bio, contact page/email/GitHub links) + Person JSON-LD for Abdullah + Organization JSON-LD for RankForge (url, logo favicon.png, email, sameAs GitHub repo).
- contact.html: added Organization JSON-LD with contactPoint (email thanosabdulla@gmail.com, contactType customer support).
- All 20 blog posts: Article/BlogPosting JSON-LD author changed from Organization RankForge to Person Abdullah ({"@type":"Person","name":"Abdullah","url":"https://rankforgetool.com/about"}). Publisher remains Organization RankForge in all 20 posts.

## 5. Google Fonts — non-blocking

All 44 HTML pages (8 top-level, 16 tools, 20 blog posts) changed from a render-blocking stylesheet link to:
- `<link rel="preload" as="style" href="...Inter...">`
- `<link rel="stylesheet" href="...Inter..." media="print" onload="this.media='all'">`
- `<noscript><link rel="stylesheet" href="...Inter..."></noscript>`

Preconnects kept. Font family, weights, and display=swap unchanged. Verified: 0 old blocking links remain, 44 preload + 44 noscript links present.

## Verification (before push)

- HTML: Python html.parser clean on all changed files.
- XML: sitemap.xml and rss.xml parse as valid XML (Python ElementTree); sitemap = 44 `<loc>` entries.
- JSON-LD: 112 real JSON-LD blocks (via HTMLParser) all parse as valid JSON. One apparent invalid block in tools/schema-markup-generator.html is a known false alarm — a JSON-LD string inside the tool's own JavaScript, not a real script tag (documented in the 2026-11-06 audit).
- Word counts: all 20 posts 800+ words in `<main>` (lowest 809, highest 1229).
- Broken refs: grep for backlink-checker / rank-tracker / site-audit / pins/ = 0 hits.
- node --check app.js passes.
- git status clean except intended changes before committing.

## Commits

- 9330dce chore: remove coming-soon tools and pin images (14 files deleted)
- f09a355 chore: remove 3 coming-soon tools from sitemap (47 -> 44 pages)
- 6b16ba7 content: expand 11 thin posts to 800+ words (20 blog files; also includes the Person-author and fonts-preload changes in those blog files, applied in the same pass)
- 508fa93 feat: add author bio and Organization JSON-LD to About and Contact
- fd5ecdd perf: load Google Fonts non-blocking on all pages (22 remaining files)

Note on commit granularity: blog files carry expansion + author + fonts together because the three edits were applied to the same files in one pass; the other files are split cleanly by theme.

## Push / deploy status

(To be filled after push — see live verification below.)

## Remaining issues

- None of the five audit open items remain unaddressed in this round. Next priorities: monitor Search Console for the removed tool URLs (expect 404s, which is intended), watch AdSense review, and keep expanding or refreshing posts as needed. The weekly audit (Fridays ~09:20 Riyadh) will re-check word counts, sitemap, and JSON-LD.
