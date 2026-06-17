# jongudjons.is — Academic Website

## Structure

```
jongudjons.is/
├── index.html          ← About / home
├── research.html       ← Papers & publications
├── teaching.html       ← Courses
├── notes.html          ← Interactive models & writing
├── contact.html        ← Contact & links
├── cv.pdf              ← Add your CV here
│
├── notes/
│   └── is-lm.html      ← Example interactive model
│
├── css/
│   ├── style.css       ← Shared styles
│   ├── home.css        ← Home page only
│   └── notes.css       ← Notes / interactive pages / contact / teaching
│
├── js/
│   ├── main.js         ← Shared JS (nav, animations, utilities)
│   └── pages/
│       └── is-lm.js    ← IS-LM model logic
│
└── img/
    └── portrait.jpg    ← Add your photo here
```

## Adding a new interactive model

1. Create `notes/my-model.html` (copy `is-lm.html` as a template)
2. Create `js/pages/my-model.js` with your model logic
3. Add `data-page="my-model"` to the `<body>` tag
4. Add a card linking to it in `notes.html`

The `JG` utility object in `main.js` provides canvas helpers and slider bindings
to reduce boilerplate for new models.

## Customising content

- **Portrait**: replace `img/portrait.jpg`
- **CV**: place `cv.pdf` in the root folder
- **Affiliation**: edit the `<p class="affiliation">` line in `index.html`
- **Papers**: edit the `<ul class="paper-list">` blocks in `research.html`
- **Social links**: update hrefs in `contact.html`
- **Email**: search-replace `jon@jongudjons.is`

## GitHub Pages setup

1. Push all files to a public GitHub repository
2. Settings → Pages → Deploy from branch `main` / root
3. Under Custom domain, enter `jongudjons.is`
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
www → yourusername.github.io
```

DNS takes a few hours. HTTPS is provisioned automatically by GitHub.
