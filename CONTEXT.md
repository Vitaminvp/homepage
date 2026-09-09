# Context

A one-page résumé, published as a static document. Its shape follows from two
constraints worth knowing before changing anything:

- **It is printed.** `assets/styles/base.css` carries an `@media print` block
  and, mirroring it, an `@media only screen` one. Printing is a first-class
  use, not an afterthought.
- **It works without JavaScript.** Five `<noscript>` blocks hold the gallery
  images, `og:description` carries the summary for crawlers, and the personal
  page is revealed by a checkbox rather than a script. Nothing essential may
  depend on a script running.
- **It is read by machines.** A second document, `cv.html`, states the same
  facts as plain text for applicant tracking systems.

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

**Visibility** — three flags, and they are independent. `hidden` means nowhere.
`exceptPrint` keeps a thing on the screen and off the paper. `personal` keeps it
off the screen until the reader opens the personal page, and everything carrying
it also carries `exceptPrint`. `build/render.js`'s `policy()` turns the last two
into a class list; `.print-only` is the inverse of `exceptPrint`.

## Architecture

**CV data module** (`data/cv.js`) — every fact about the person, stated once.
Values are trusted HTML: entities are written as they should reach the page,
and the renderer does not escape them.

**Render module** (`build/render.js`) — owns the shape of the document. Writing
`index.html`, `manifest.json` and `browserconfig.xml` is the whole of its
interface. All three take their icon list from `cv.icons`, which is why the
paths cannot drift apart again.

**ATS render module** (`build/render-ats.js`) — owns the shape of the stripped
variant. Writing `cv.html` is the whole of its interface. It filters on
`exceptPrint`, so the rule is one sentence: *an item is in the ATS document if
it prints.* Its `assertAts()` refuses to write a document containing an image,
an audio element, a disclosure, an emoji, or any text that lives in CSS — a
parser reads none of those.

**Text module** (`build/plain.js`) — trusted HTML in, plain text out, plus
`esc()` to put text back into a document. The direction of trust is the opposite
of the render module's, which is the thing to keep in mind when editing it. It
throws on an entity it does not know rather than let `&hellip;` reach a document
nobody re-reads.

**Experience module** (`build/experience.js`) — the one place the years are
counted. Three templates state them and all three write `{{experience}}`, so the
placeholder is named once, in `fill()`.

Facts reach three consumers, so none of them holds a second copy:

| Consumer | How |
|---|---|
| Markup | rendered directly |
| CSS | generated `:root` custom properties — `--accent` is the theme, which one swatch click rewrites |
| Runtime JS | `data-*` attributes on `<body>` — `scripts.js` counts from those dates |

`index.html` and `cv.html` are generated **and committed**: GitHub Pages serves
this repository directly and there is no CI, so the built files have to be in
git. Run `npm run build` after editing `data/cv.js` — it writes both documents —
and commit them with the data.

`build/normalize.js` and `build/verify.js` exist to prove a change to the
generator did not change the documents: they compare canonical forms in which
formatting is invisible but everything a reader would see is not. `verify.js`
checks both documents and reports both, so a two-document change does not take
two runs to see. Pass it the ref to compare against — its default `HEAD` is
self-satisfying once the rebuilt files are committed.

## Deploy

GitHub Pages, from the repository root — that is the live site. `.travis.yml`
still describes an S3 deploy to `vitaminvp-staging` / `vitaminvp-production`,
and `now.json` still names a Vercel project, but neither runs: the production
bucket has been serving a copy from before May 2023. Three deploy targets are
described, one is real.

The service worker has been retired. `sw.js` is now a tombstone that clears
caches and unregisters itself; delete it once it has been live long enough for
returning visitors to have picked it up.
