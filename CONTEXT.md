# Context

A one-page résumé, published as a static document. Its shape follows from two
constraints worth knowing before changing anything:

- **It is printed.** `assets/styles/base.css` carries 102 rules across two
  `@media print` blocks. Printing is a first-class use, not an afterthought.
- **It works without JavaScript.** Five `<noscript>` blocks hold the gallery
  images, and `og:description` carries the summary for crawlers. Nothing
  essential may depend on a script running.

## Domain language

**Engagement** — a period working for one employer. Carries a period, a role,
the employer, and either bullets or projects. The current engagement is
`experience.recent`; earlier ones are `experience.past`.

**Project** — a piece of work inside an engagement, with its own role, product,
stack and CSS-only disclosure. Only the current engagement has projects; older
entries state their stack as bullets.

**Milestone** — a timeline entry that is not a job: graduation, the move to
Kyiv, being born, the gallery trigger. They share the timeline with engagements
but not their shape, so each has a `kind`.

**Education entry** — a course, a certificate or a degree, optionally with a
**Diploma** link that opens a **Lightbox**.

**Lightbox** — a `<dialog>` of photos with a trigger elsewhere on the page. The
images sit in `<noscript>` and are spliced in by `assets/js/scripts.js`.

**Tag** — a short chip in the sidebar (skills, character, likes, dislikes,
wants). **Label chip** — a chip in a project's stack, linking to the
technology. Its URL comes from the `links` registry, one entry per technology.

**Contact** — a way to reach the person. Some also appear in `<head>` as
`rel="me"`.

## Architecture

**CV data module** (`data/cv.js`) — every fact about the person, stated once.
Values are trusted HTML: entities are written as they should reach the page,
and the renderer does not escape them.

**Render module** (`build/render.js`) — owns the shape of the document. Writing
`index.html`, `manifest.json` and `browserconfig.xml` is the whole of its
interface. All three take their icon list from `cv.icons`, which is why the
paths cannot drift apart again.

Facts reach three consumers, so none of them holds a second copy:

| Consumer | How |
|---|---|
| Markup | rendered directly |
| CSS | generated `:root` custom properties — `base.css` reveals phone numbers on hover through `var(--phone-*)` |
| Runtime JS | `data-*` attributes on `<body>` — `scripts.js` counts from those dates |

`index.html` is generated **and committed**: GitHub Pages serves this
repository directly and there is no CI, so the built file has to be in git.
Run `npm run build` after editing `data/cv.js` and commit both.

`build/normalize.js` and `build/verify.js` exist to prove a change to the
generator did not change the document: they compare canonical forms in which
formatting is invisible but everything a reader would see is not.

## Deploy

GitHub Pages, from the repository root — that is the live site. `.travis.yml`
still describes an S3 deploy to `vitaminvp-staging` / `vitaminvp-production`,
and `now.json` still names a Vercel project, but neither runs: the production
bucket has been serving a copy from before May 2023. Three deploy targets are
described, one is real.

The service worker has been retired. `sw.js` is now a tombstone that clears
caches and unregisters itself; delete it once it has been live long enough for
returning visitors to have picked it up.
