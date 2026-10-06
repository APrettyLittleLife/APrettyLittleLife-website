# A Pretty Little Life

A lightweight static boutique website. No framework, build step, analytics, cookies, cart, or card collection. Payments use individual Square links. No private pickup address should ever be added to this repository, events, image metadata, or website.

## Preview locally

From this repository, run `python3 -m http.server 8000 --bind 127.0.0.1`, then open the local site in your browser. Opening HTML directly as a file won't load the JSON content. All paths also work under a GitHub Pages project subdirectory.

## Everyday updates

Edit `assets/content.json` on GitHub (pencil icon) or in an editor. Preserve the JSON punctuation. Changes take effect after deployment.

- **Products:** edit price, description, dimensions and `squareUrl` (the individual HTTPS Square Payment Link). An empty link displays “Square Payment Link coming soon” and cannot accept payment. Set `available` to `false` to remove the item from the homepage and mark it Sold Out in the shop, and deactivate its Square link in Square. Remove a product entry to remove it entirely. Website stock changes do not update Square stock.
- **Photos:** add optimized images to `assets/`, then add entries like `{"src":"assets/autumn-front.webp","alt":"Front view of the burgundy and orange wood flowers in a cornucopia"}` to the product's `photos` list. Multiple images create thumbnail controls. Use real photos, remove location metadata, and aim for 1200–1600px images under 300KB when practical. Write meaningful alt text. The original SVG is a decorative illustration, not a product photo.
- **Gallery:** add `{"category":"Seasonal","title":"Autumn arrangement","src":"assets/autumn.webp","alt":"Describe the arrangement"}` to `gallery`. Categories: Weddings, Seasonal, Home Décor, Gifts, Custom Creations, Boutique Displays.
- **Events:** add `{"name":"Event name","date":"November 7, 2026","location":"Public venue and city","hours":"10am–4pm","url":"https://example.com/event"}` to `events`. Remove past events manually. Never use a private home address.
- **Contact:** supply only public business contact details in `business.email`, `instagram`, and `facebook`. With email configured, the form prepares an email for the visitor to review and send. Without a contact method it explicitly reports that nothing was sent.
- **Optional hosted forms:** supply an HTTPS `formEndpoint` from a static-compatible form provider (for example a free-tier Formspree endpoint). Verify its allowed domain, inbox, spam protection, CORS behavior and privacy policy before enabling. No service is registered automatically. Update privacy.html to identify the provider and retention policy. Inspiration links are supported; uploads are intentionally disabled until a suitable provider is configured. Never add API keys.
- **About and policies:** edit about.html, shipping.html, policies.html, privacy.html and terms.html with owner-approved content. Draft placeholders are visible and must be completed before launch.

## Before publishing

1. Supply real product/portfolio photographs, Square Payment Link, business contact/social links, story, policies, shipping processing time and show dates. Confirm Square charges $14.95 U.S. shipping, correctly handles one-of-a-kind stock, and does not publicly expose pickup details. Keep pickup arranged privately before payment.
2. Confirm the public URL. Run `python3 tools/configure_url.py https://YOUR-PUBLIC-URL/` (include any Pages project subdirectory). This writes the sitemap, robots directive, static canonical/social URLs and business URL. Replace the favicon if desired and add a real social sharing image with absolute HTTPS URL in each HTML head; the illustration SVG is not universally supported by sharing platforms.
3. Preview on mobile and desktop and test real Square checkout and inquiry delivery. Review policies before accepting customers. The included local checks cannot validate unconfigured external services.
4. **Only after your explicit approval:** commit/push the reviewed files, enable GitHub Pages under repository Settings → Pages → Deploy from a branch → main → /(root). No automated deployment workflow is installed, so these local files do not publish themselves.
5. **Only after separate explicit approval:** configure the actual custom domain in Pages, follow GitHub's current domain verification/DNS instructions in Porkbun, then enable HTTPS. No domain name or CNAME is assumed here. Do not alter DNS before approval. Regenerate URL metadata if the public URL changes.

## Files

HTML files are the pages; `assets/style.css` controls appearance; `assets/site.js` renders editable content and handles navigation, gallery filtering and inquiries. `assets/content.json` is the owner's data file. `.nojekyll` supports direct static serving on GitHub Pages. `sitemap.xml` remains intentionally empty until a real public URL is supplied; no invented domain is published.

## Validation

Run `node --check assets/site.js` for JavaScript syntax. Serve locally and check all pages, mobile navigation, filters, photo controls, Sold Out behavior, forms, and internal links. No packages need to be installed to develop or serve the website.
