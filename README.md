# PLAYVORA ACADEMY website

Static site: HTML5, CSS3, vanilla JavaScript. No backend, database, build step or dependencies.

## Run locally
Open `index.html` in a browser, or serve the folder: `python3 -m http.server 8000` then visit http://localhost:8000.

## Structure
`index/about/services/contact/privacy/terms/404.html`, `css/style.css`, `js/main.js`, `assets/` (images in WebP, favicon, social-preview.jpg), `robots.txt`, `sitemap.xml`.

## How enquiries work (important limitation)
A static site cannot store or email form data. Each of the three forms validates input, builds a message and opens
`https://wa.me/917039715727?text=...` so the visitor reviews and sends it from WhatsApp. Nothing reaches Playvora until the visitor presses send.
To receive enquiries automatically later, add an external form service or backend.

## Content sources
All business content (services, lists, mission, phone numbers, email, Instagram `play.vora`) comes from the supplied brochure.
Photos were cropped from the brochure pages, so resolution is limited. Supply original photo files to replace them in `assets/images/`.
The zipline, commando net, rope bridge and hurdle images (brochure pages 1 and 6) look like illustrative/AI-style images, not documented Playvora events. Replace them with real photos when available.

## Items Playvora must confirm before launch
1. "Government Certified Coaches & Trainers" (home page, marked with an HTML comment). Brochure claim; confirm you can substantiate it.
2. Vision statement (About page placeholder), registered business name, address, governing law, data-retention practice.
3. Permission to use the photos publicly, especially those showing children.
4. Privacy Policy and Terms are drafts and need legal review.
5. Live domain: replace `https://www.example.com/` in every `<link rel="canonical">`, `og:` tags, `robots.txt` and `sitemap.xml`.

## Deploy (static hosting)
- **Netlify / Cloudflare Pages / Vercel:** drag the folder (or connect a Git repo). No build command; publish directory is the root.
- **GitHub Pages:** push to a repo, Settings > Pages > deploy from branch (root).
`404.html` is picked up automatically by Netlify, Cloudflare Pages and GitHub Pages.

## Custom domain and HTTPS
Add the domain in your host's dashboard, then create the DNS records it shows (usually a CNAME for `www` and A/ALIAS for the apex). Wait for DNS to propagate, enable the host's free managed certificate, then switch on "Force HTTPS". Enable forced HTTPS only after the certificate is issued. Then update the domain placeholders and submit `sitemap.xml` in Google Search Console.

## Security headers (set in hosting config)
Netlify `_headers` example:
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; script-src-elem 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'
```
Client-side validation is a usability aid, not a security control. The site has no cookies, analytics or trackers; add a consent mechanism before adding any.

## QA status
Tested (headless Chromium, desktop 1366px and phone 390px widths):
- All internal links and anchors resolve; every image has alt text; one h1 per page.
- No horizontal overflow on all 7 pages; no JavaScript console errors.
- Form validation (required, phone, email, age, checkbox groups) and generated WhatsApp URL/message for the personal and society forms. The school form's required-field validation was checked, but its generated message was not.
- `node --check` passes for `js/main.js`. No `eval`/`innerHTML` used.

NOT tested: opening real WhatsApp (sandbox had no internet), Safari/iOS, real Android devices, tablet widths, Google Fonts loading, Lighthouse/Core Web Vitals, screen readers, mobile menu by touch. Please check these before launch.
