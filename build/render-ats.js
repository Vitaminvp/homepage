"use strict";

// The ATS render module: it owns the shape of the stripped variant. Writing
// cv.html is the whole of its interface.
//
// The organising idea is that the ATS document is the printed document with the
// typography taken out. `exceptPrint` and `hidden` already say what belongs on
// paper, so this module adds no visibility flags of its own — it filters on the
// ones the site already has.
//
// An applicant tracking system reads the document linearly and as text. That
// rules out the site's sixteen-column grid (columns interleave when read in
// document order), its CSS-only disclosures (a summary a parser cannot open is
// a fact it cannot see), its images, its audio, and above all any text that
// lives in CSS. What is left is headings, paragraphs and lists.

const fs = require("fs");
const path = require("path");
const cv = require("../data/cv");
const { plain, esc } = require("./plain");
const { fill } = require("./experience");

const root = path.join(__dirname, "..");

// data/cv.js holds trusted HTML; everything here is text. plain() strips, esc()
// puts it back into a document safely. Values pass through both, in that order.
const text = (html) => esc(plain(html));

// ------------------------------------------------------------- contacts ----

// The label a parser reads instead of the icon a reader sees.
const CONTACT_LABELS = {
  mail: "Email",
  phone: "Phone",
  github: "GitHub",
  linkedin: "LinkedIn",
  website: "Website",
};

function contactLines() {
  const lines = [`Location: ${text(cv.identity.location)}`];

  cv.contacts
    .filter((c) => !c.hidden && !c.exceptPrint)
    .forEach((c) => {
      const label = CONTACT_LABELS[c.icon];
      if (!label) return;
      const value =
        c.kind === "email"
          ? cv.identity.email
          : c.kind === "website"
            ? cv.identity.siteLabel
            : c.phone
              ? cv.phones[c.phone].display
              : c.text;
      lines.push(`${label}: ${text(value)}`);
    });

  // Its own field rather than a clause appended to the job title, so a parser
  // that reads fields can find it.
  lines.push(`Right to work: ${text(cv.identity.rightToWork)}`);

  return lines.map((l) => `    <p>${l}</p>`).join("\n");
}

// --------------------------------------------------------------- skills ----

// A chip is a skill only if it carries a tag. The colour swatches ({color,
// label}) are the theme picker, {badHabits} is an audio button and {link} is a
// personality quiz — page furniture, not skills. `className` is where per-item
// print policy lives for a tag, which is why it is read here too.
const isSkill = (i) => i.tag && !/except-print/.test(i.className || "");

function skills() {
  return cv.tagSections
    .filter((s) => !s.exceptPrint)
    .map((s) => {
      const items = s.items.filter(isSkill).map((i) => text(i.tag));
      return `    <p><strong>${text(s.title)}:</strong> ${items.join(", ")}</p>`;
    })
    .join("\n");
}

// ----------------------------------------------------------- experience ----

const bullets = (list) => {
  const kept = list
    .filter((b) => typeof b === "string" || !b.exceptPrint)
    .map((b) => `      <li>${text(typeof b === "string" ? b : b.html)}</li>`);
  return kept.length ? `    <ul>\n${kept.join("\n")}\n    </ul>` : "";
};

function entry(heading, period, body) {
  return [`    <h3>${heading}</h3>`, `    <p>${period}</p>`, body]
    .filter(Boolean)
    .join("\n");
}

function recent() {
  const r = cv.experience.recent;
  const period = text(r.period);
  const employer = r.employerNote
    ? `${text(r.employer.name)} (${text(r.employerNote)})`
    : text(r.employer.name);

  return r.projects
    .map((p) => {
      // `sameAsEngagement` already means "this project is the engagement", so
      // the heading comes from the engagement rather than being stated twice.
      const heading = p.sameAsEngagement
        ? `${text(r.role)}, ${employer}`
        : `${text(p.role)}, ${text(p.product)}`;
      // No technology list here: every key a project stack names appears in one
      // of the skill groups above, spelled the way an advert spells it rather
      // than the way the site's chips style it.
      const body = [`    <p>${text(p.summary)}</p>`, bullets(p.bullets)]
        .filter(Boolean)
        .join("\n");
      // A project that predates the engagement carries its own period.
      return entry(heading, p.period ? text(p.period) : period, body);
    })
    .join("\n");
}

// Everything else in experience.past is a milestone belonging to the site — the
// date of birth above all. A date of birth is left off a UK CV, and putting one
// into an employer's applicant tracking system hands them an age-discrimination
// problem they did not ask for. Whitelisting the two job shapes keeps it out by
// construction rather than by a branch someone can add to.
const PAST_KINDS = new Set(["job", "sysadmin"]);

function past() {
  return cv.experience.past
    .filter((e) => PAST_KINDS.has(e.kind))
    .map((e) => {
      if (e.kind === "sysadmin") {
        const names = e.companies.map((c) => text(c.name));
        const where =
          names.length > 1
            ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
            : names[0];
        return entry(
          `${text(e.role)}, various employers`,
          text(e.period),
          `    <p>${text(e.summary)} Employers included ${where}.</p>`
        );
      }
      return entry(
        `${text(e.role)}, ${text(e.employer.name)}`,
        text(e.period),
        bullets(e.bullets)
      );
    })
    .join("\n");
}

// ------------------------------------------------------------ education ----

const school = (e) => (e.school ? ` — ${text(e.school.name)}` : "");

function education() {
  const printed = cv.education.filter((e) => !e.hidden && !e.exceptPrint);
  const formal = printed.filter((e) => e.kind !== "course");
  const courses = printed.filter((e) => e.kind === "course");

  const degrees = formal
    .map((e) => {
      const what = e.field
        ? `${text(e.title)} in ${text(e.field)}`
        : text(e.title);
      return `    <p><strong>${what}</strong>${school(e)} (${text(e.dates)})</p>`;
    })
    .join("\n");

  // One paragraph rather than nine headed entries: on paper and to a parser
  // these are a list of course names, and nine two-line blocks cost a third of
  // a page to say so.
  const list = courses
    .map((e) => `${text(e.title)}${school(e)} (${text(e.dates)})`)
    .join("; ");

  return { degrees, courses: `    <p>${list}</p>` };
}

function talks() {
  return cv.reports
    .map((r) => {
      const note = r.note ? ` (${text(r.note)})` : "";
      return `    <p>${text(r.title)}${note}</p>`;
    })
    .join("\n");
}

// ---------------------------------------------------------------- styles ----

// Deliberately small, and deliberately dull. No flex, no grid, no float, no
// positioning, no columns — and no `content`, because text in CSS is invisible
// to a parser. assertAts() below enforces all of that.
const STYLES = `
      /* 12mm rather than 15: this document has no header, footer or page
         furniture competing for the edge, and the 6mm reclaimed is a page. */
      @page { size: A4; margin: 12mm }
      body {
        font: 10pt/1.3 Arial, Helvetica, sans-serif;
        color: #000;
        background: #fff;
        max-width: 190mm;
        margin: 0 auto;
        padding: 10mm;
      }
      h1 { font-size: 18pt; margin: 0 }
      h2 {
        font-size: 12pt;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        border-bottom: 1px solid #000;
        margin: 10pt 0 4pt;
        padding-bottom: 2pt;
      }
      h3 { font-size: 10.5pt; margin: 7pt 0 0 }
      p { margin: 2pt 0 }
      ul { margin: 4pt 0 0 16pt; padding: 0 }
      li { margin-bottom: 2pt }
      a { color: #000; text-decoration: none }
      h2, h3 { break-after: avoid; page-break-after: avoid }
      li, p { break-inside: avoid }
      /* On screen the padding gives the text margins the viewport does not.
         On paper @page already provides them, and 20mm of it was costing a
         page. */
      @media print { body { padding: 0; max-width: none } }`;

// -------------------------------------------------------------- document ----

function document() {
  const edu = education();

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${text(cv.identity.name)} — ${text(cv.identity.title)} — CV</title>
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${cv.identity.site}" />
    <style>${STYLES}
    </style>
  </head>
  <body>
    <h1>${text(cv.identity.name)}</h1>
    <p>${text(cv.identity.title)}</p>
${contactLines()}

    <h2>Summary</h2>
    <p>${text(fill(cv.intro.statement))}</p>

    <h2>Skills</h2>
${skills()}

    <h2>Experience</h2>
${recent()}
${past()}

    <h2>Education</h2>
${edu.degrees}

    <h2>Professional development</h2>
${edu.courses}

    <h2>Talks</h2>
${talks()}
  </body>
</html>
`;
}

// --------------------------------------------------------------- the gate ----

// The generator refuses to write a document that violates its own premise, so
// `npm run build` is the check and there is no separate script to forget.
function assertAts(html) {
  const fail = (why) => {
    throw new Error(`cv.html: ${why}`);
  };

  const banned =
    /<(img|audio|video|input|dialog|object|source|button|table|svg|iframe|noscript)\b/i;
  const bannedMatch = html.match(banned);
  if (bannedMatch) fail(`contains <${bannedMatch[1]}>, which a parser cannot read`);

  const emoji = html.match(/[\p{Extended_Pictographic}\p{Regional_Indicator}]/u);
  if (emoji) fail(`contains the emoji ${JSON.stringify(emoji[0])}`);

  const css = /(display:\s*(?:flex|grid)|float:|position:|columns?:|content:)/i;
  const cssMatch = html.match(css);
  if (cssMatch) fail(`stylesheet uses ${cssMatch[1].trim()}`);

  if (html.includes("except-print")) fail("site-only markup leaked through");

  const entity = html.match(/&(?!amp;|lt;|gt;|quot;|#\d+;)[a-z]+;/i);
  if (entity) fail(`undecoded entity ${entity[0]}`);

  if ((html.match(/<h1>/g) || []).length !== 1) fail("must have exactly one <h1>");

  // The requirement written as an assertion: the four headings a parser looks
  // for, each once, in the order it expects them.
  const wanted = ["Summary", "Skills", "Experience", "Education"];
  let at = -1;
  wanted.forEach((h) => {
    const found = html.indexOf(`<h2>${h}</h2>`);
    if (found === -1) fail(`no <h2>${h}</h2>`);
    if (html.indexOf(`<h2>${h}</h2>`, found + 1) !== -1)
      fail(`<h2>${h}</h2> appears more than once`);
    if (found < at) fail(`<h2>${h}</h2> is out of order`);
    at = found;
  });

  return html;
}

fs.writeFileSync(path.join(root, "cv.html"), assertAts(document()));
