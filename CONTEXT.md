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

**GitHub Pages, from the `develop` branch at the repository root** — confirmed
against the Pages API, which reports `source: {branch: "develop", path: "/"}`.
That is the one deploy target this repository knows it has.

**Vercel may or may not still be connected, and this repository cannot tell.**
`now.json` named a project using a `name` field Vercel deprecated years ago —
deprecated hard enough that the CLI refuses to run in a directory containing the
file at all, erroring before it even reaches authentication. That is almost
certainly why the last deployment failed, and deleting the file removes the
error: the CLI now starts here where it previously would not. Whether a project
is still linked on Vercel's side is a question only the dashboard answers.

If one is, it now builds zero-config: no `vercel.json`, no framework detected, a
`build` script in `package.json`. Vercel will run `npm run build` and then look
for a `public/` directory; there isn't one, so it should serve the repository
root, where the generator writes `index.html`. That is the expectation, not a
tested fact — the one thing likely to need a `vercel.json` is the output
directory.

**S3 is retired and its buckets should be deleted.** `.travis.yml` described a
deploy to `vitaminvp-staging` / `vitaminvp-production`; Travis stopped running,
the buckets froze, and the config is now gone, so nothing can push to them
again. They are still serving, though — both
`http://vitaminvp-production.s3-website.eu-central-1.amazonaws.com` and
`http://vitaminvp-staging.s3-website.eu-central-1.amazonaws.com` answer 200 with
a copy from before May 2023: "more than 3 years", "I'm a frontend developer",
and two Ukrainian phone numbers where the current document has one UK number.
No commit can reach them; they have to go in the AWS console.
`<link rel="canonical">` in `<head>` is the mitigation until they do.

The service worker has been retired. `sw.js` is now a tombstone that clears
caches and unregisters itself; delete it once it has been live long enough for
returning visitors to have picked it up.
