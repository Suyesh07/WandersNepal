# Wanders Nepal — Work Done and Remaining

Updated: 15 September 2026

## Work completed

- Preserved the existing cinematic design, typography, layout, content architecture and interactive features.
- Replaced the previous brand name with **Wanders Nepal** throughout visible copy, metadata, bylines, search and documentation.
- Added the supplied dark-background logo for cinematic/dark surfaces.
- Added the supplied light-background logo for light headers after scrolling.
- Added the dark-background logo to the site footer and a matching favicon.
- Versioned both responsive logo assets and updated all 95 shared headers and footers so browser or CDN caches cannot continue serving the previous wordmark.
- Added explicit `Wanders Nepal` alternative text to the primary header and footer logos while keeping the switched duplicate image decorative.
- Added relevant background photography to all eight “Choose your Nepal” cards.
- Added a dedicated `/reviews` page with a moderated traveler-review submission form.
- Added a `/review-success` confirmation page.
- Added Reviews to the homepage, footer, search index and XML sitemap.
- Avoided invented ratings, testimonials and traveler claims.
- Added honeypot spam protection to Netlify newsletter, contact and review forms.
- Switched search-result thumbnails from JPEG to WebP.
- Added conservative browser caching for images, CSS and JavaScript.
- Added Content Security Policy, HSTS, clickjacking, MIME-sniffing, permissions, opener and referrer protections for Netlify and Apache.
- Revalidated titles, metadata, structured data, internal links, fragments, local assets and JavaScript syntax.

## Validation completed

- 96 HTML documents.
- 96 unique page titles.
- 95 unique canonical URLs.
- 92 sitemap URLs.
- 88 searchable records.
- Exactly 20 destination hubs, 16 trek guides, eight routes and six itineraries.
- Zero broken internal links or missing referenced local assets.
- Zero duplicate HTML IDs.
- All JSON-LD parses successfully.
- JavaScript syntax and Netlify TOML configuration pass validation.
- Browser verification confirms dark/light logo switching, eight image-backed choice cards, the review form, search access and mobile navigation.
- Desktop and mobile viewport checks show no horizontal overflow.
- Browser console reports zero errors and zero warnings.
- Final brand audit finds zero visible instances of the previous name in page content.

## Remaining owner or production work

1. **Confirm the production domain URL.** Canonical URLs, sitemap and robots.txt use `https://www.wandersnepal.com`.
2. Deploy to the final HTTPS host and confirm the security headers are returned by the production server.
3. Configure Netlify form notification recipients and test newsletter, contact and review submissions after deployment.
4. Publish only real, verified traveler reviews received through the form; no sample reviews are included.
5. Connect analytics and Google Search Console, then submit `/sitemap.xml`.
6. Reverify changing visa, permit, guide, transport and protected-area information before launch.
7. Run a production Lighthouse/Core Web Vitals test from the final hosting region.

No other code work is required for the requested update.
