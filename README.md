# jongudjons.is

Personal academic website of Jón Guðjónsson, served as static files by GitHub Pages
at https://jongudjons.is/.

## Structure

```
jongudjons.is/
├── index.html          ← About / home: bio, research areas, papers
├── research.html       ← Working papers, work in progress, presentations
├── teaching.html       ← Courses taught (lecturer and TA)
├── contact.html        ← Email, affiliations, profile links
├── notes.html          ← Interactive models (hidden: not in nav, noindex)
│
├── docs/
│   └── gudjonsson_cv.pdf   ← CV, linked from "Download CV"
│
├── notes/
│   └── is-lm.html      ← Example interactive model (noindex)
│
├── css/
│   ├── style.css       ← Shared styles
│   ├── home.css        ← Home page only
│   └── notes.css       ← Notes, teaching and contact pages
│
├── js/
│   ├── main.js         ← Shared JS (nav, animations, utilities)
│   └── pages/
│       └── is-lm.js    ← IS-LM model logic
│
├── img/
│   └── jg.png          ← Portrait (also used as the link-preview image)
│
├── robots.txt          ← Allows all crawlers, points to the sitemap
├── sitemap.xml         ← Pages submitted to search engines
└── CNAME               ← Custom domain for GitHub Pages
```

## Local development

```
npm install
npm run dev
```

Starts a Vite dev server with live reload at http://localhost:5173. The site
has no build step: GitHub Pages serves the files as they are.

## Updating content

- **Bio and affiliation**: the `.hero` section in `index.html`
- **Papers**: the `.paper-list` blocks in `research.html` (and the summary on
  `index.html`). Titles are plain `<span class="paper-name">` for now; to share
  a paper, wrap the title in a link and add a `<div class="paper-links">` block.
  Abstracts are marked `Abstract placeholder.`
- **Teaching slides**: each course in `teaching.html` has a commented-out
  `Slides` link to `https://github.com/JonGudjonsson/REPO`. Fill in the repo
  name and uncomment it.
- **Profile links**: `contact.html` has GitHub live and commented-out
  placeholders for Google Scholar and LinkedIn.
- **CV**: replace `docs/gudjonsson_cv.pdf`, keeping the filename.
- **Portrait**: replace `img/jg.png`.

When adding a page, give it a `<meta name="description">`, a canonical link and
Open Graph tags (copy the `<head>` of an existing page), and add it to
`sitemap.xml`.

## Notes page (hidden)

The Notes section is currently switched off. To bring it back:

1. Uncomment `<li><a href="notes.html">Notes</a></li>` in the nav of each page
2. Remove `<meta name="robots" content="noindex" />` from `notes.html` and
   `notes/is-lm.html`
3. Add `notes.html` to `sitemap.xml`

To add a new interactive model:

1. Create `notes/my-model.html` (copy `is-lm.html` as a template)
2. Create `js/pages/my-model.js` with your model logic
3. Add `data-page="my-model"` to the `<body>` tag
4. Add a card linking to it in `notes.html`

The `JG` utility object in `main.js` provides canvas helpers and slider bindings
to reduce boilerplate for new models.

## Search engines

- `robots.txt`, `sitemap.xml`, canonical URLs and Open Graph tags are in place.
- `index.html` carries schema.org `Person` data (JSON-LD) with both spellings
  of the name. Keep it in sync with the bio.
- Update the `<lastmod>` dates in `sitemap.xml` after significant changes.
- Register the site in Google Search Console as a Domain property for
  `jongudjons.is` (verified by a DNS TXT record at ISNIC), submit
  `sitemap.xml`, and resubmit it after adding pages.

## GitHub Pages setup

1. Push all files to a public GitHub repository
2. Settings → Pages → Deploy from branch `main` / root
3. Under Custom domain, enter `jongudjons.is` (matches the `CNAME` file), then
   enable **Enforce HTTPS**
4. At ISNIC, add DNS records:

**A records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME:**
```
www → jongudjonsson.github.io
```

DNS takes a few hours. HTTPS is provisioned automatically by GitHub.
