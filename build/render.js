"use strict";

// The render module: it owns the shape of the document, data/cv.js owns the
// facts. Writing index.html is the whole of its interface.
//
// Values from data are inserted verbatim — they are trusted HTML, so entities
// stay entities. Whitespace inside tags is free (build/normalize.js treats it
// as insignificant, and so do browsers), but whitespace in text nodes renders,
// so it is written deliberately here.

const fs = require("fs");
const path = require("path");
const cv = require("../data/cv");
const svg = require("./svg");
const { phrase, fill } = require("./experience");

const root = path.join(__dirname, "..");
const size = (n) => `${n}x${n}`;

// The statement carries the years in the same {{experience}} placeholder
// og:description and the meta description use. Here it becomes the span
// scripts.js swaps for the flip clock; with JS off the written phrase is what
// shows.
const statement = fill(
  cv.intro.statement,
  `<span id="experience">${phrase} </span>`
);

// The one custom property the stylesheet reads: --accent is the theme colour,
// which base.css applies to headings, links, the page frame, the dividers and
// the flip clock. Clicking a swatch sets this property and nothing else.
//
// The phone numbers used to be here too, because a `content` rule revealed them
// on hover. That rule is gone and the number is plain text in the markup, so
// emitting --phone-* was a promise the stylesheet no longer keeps.
const visibleContacts = cv.contacts.filter((c) => !c.hidden);

function rootProperties() {
  return `<style>
    :root {
      --accent: ${cv.meta.accent};
    }
    </style>`;
}

// ---------------------------------------------------------------- head ----

function iconLinks() {
  const apple = cv.icons.apple.map(
    (n) =>
      `<link rel="apple-touch-icon" sizes="${size(n)}" href="/assets/icons/apple-icon-${size(n)}.png" />`
  );
  const android = `<link rel="icon" type="image/png" sizes="192x192" href="/assets/icons/android-icon-192x192.png" />`;
  const favicons = cv.icons.favicons.map(
    (n) =>
      `<link rel="icon" type="image/png" sizes="${size(n)}" href="/favicon-${size(n)}.png" />`
  );
  return [...apple, android, ...favicons].join("\n    ");
}

function relMeLinks() {
  return visibleContacts
    .filter((c) => c.relMe)
    .map((c) => {
      const href =
        c.kind === "email"
          ? `mailto:${cv.identity.email}`
          : c.href || `tel:${cv.phones[c.phone].tel}`;
      const type = c.relMe.type ? ` type="${c.relMe.type}"` : "";
      return `<link rel="me" href="${href}"${type} />`;
    })
    .join("\n    ");
}

function head() {
  return `<head>
    <meta charset="UTF-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="description" content="${fill(cv.meta.description)}" />
    <meta name="google" content="nositelinkssearchbox" />
    <meta name="google" content="notranslate" />
    <meta name="googlebot" content="index,follow" />
    <meta name="robots" content="index,follow" />
    <meta name="subject" content="${cv.meta.subject}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="${cv.meta.themeColor}" />
    <meta property="og:description" content="${fill(cv.meta.ogDescription)}" />
    ${iconLinks()}
    <link rel="canonical" href="${cv.identity.site}" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="msapplication-TileColor" content="${cv.meta.tileColor}" />
    <meta name="msapplication-TileImage" content="/assets/icons/ms-icon-144x144.png" />
    <!--    <base href="https://vitaminvp.github.io/homepage/" />-->
    <title>${cv.meta.title}</title>
    <link rel="icon" type="image/x-icon" href="./favicon.ico" />
    ${relMeLinks()}
    <link rel="stylesheet" href="./assets/styles/base.css" />
    ${rootProperties()}
  </head>`;
}

// ----------------------------------------------------------- lightboxes ----

// Each lightbox states which anchor opens it, so the trigger and the dialog
// are paired in one place; the education entries and the gallery milestone
// look the pair up rather than restating it.
const lightboxes = new Map(cv.lightboxes.map((box) => [box.id, box]));

function lightboxTrigger(id, className, inner) {
  const box = lightboxes.get(id);
  if (!box) {
    throw new Error(`no lightbox named ${id}`);
  }
  const classes = className ? ` class="${className}"` : "";
  return `<a id="${box.trigger}" href="#${box.id}" title="${box.openTitle}"${classes}>${inner}</a>`;
}

function lightbox(box) {
  const photos = box.photos
    .map((p) => `<img src="${p.src}" alt="${p.alt}" />`)
    .join("\n          ");
  return `<dialog id="${box.id}">
      <a href="#${box.trigger}" title="${box.closeTitle}" class="close">Close</a>
      <div class="photos">
        <noscript>
          ${photos}
        </noscript>
      </div>
    </dialog>`;
}

// --------------------------------------------------------------- header ----

function contact(c) {
  const cls = policy(c);
  const li = cls ? `<li class="${cls}">` : `<li>`;

  if (c.kind === "website") {
    return `${li}
                        <a href="${cv.identity.site}" rel="author" class="${c.className}" target="_blank">
                          ${svg.website}
                          <span>${cv.identity.siteLabel}</span>
                        </a>
                      </li>`;
  }

  const phone = c.phone ? cv.phones[c.phone] : null;
  const email = c.kind === "email" ? cv.identity.email : null;
  const href = phone ? `tel:${phone.tel}` : email ? `mailto:${email}` : c.href;
  const text = phone ? phone.display : email || c.text;
  const wrap = c.wrapper || "span";
  const textClass = c.textClass || "slide-text";

  const flag = phone
    ? `\n                          <${c.flagWrapper || "span"} class="phone-flag">${phone.flag}</${c.flagWrapper || "span"}>`
    : "";

  // The source glued the span wrappers together and spaced the div ones.
  // Both spacings render, so both are reproduced.
  const pad = wrap === "div" ? "\n                            " : "";
  const tail = wrap === "div" ? "\n                          " : "";

  return `${li}
                        <a href="${href}" rel="author" class="${c.className}" target="_blank">
                          ${svg[c.icon]}${flag}
                          <${wrap} class="slide-wrapper">${pad}<${wrap} class="${textClass}">${text}</${wrap}>${tail}</${wrap}>
                        </a>
                      </li>`;
}

function header() {
  return `<div class="row">
              <div class="three wide center aligned column" id="logo">
                <object class="avatar" data="${cv.avatar}" role="img" aria-label="My profile picture"></object>
                <audio preload="auto">
                  <source src="${cv.sounds.logo}" type="audio/mpeg" />
                </audio>
              </div>
              <div class="thirteen wide column">
                <div class="stackable grid">
                  <div class="sixteen wide column">
                    <h1 class="name">${cv.identity.name}</h1>
                    <p class="role">${cv.identity.title} &middot; ${cv.identity.location}</p>
                    <p class="role-note">${cv.identity.rightToWork}</p>
                    <ul class="contacts">
                      ${visibleContacts.map(contact).join("\n                      ")}
                    </ul>
                  </div>
                  <div class="sixteen wide mobile only column">
                    <div class="divider"></div>
                  </div>
                  <div class="flip-box personal">
                    <div class="flip-box-inner">
                      <div class="flip-box-front">
                        <h2>Résumé</h2>
                      </div>
                      <div class="flip-box-back">
                        <h3 class="cv">Куррі́кулюм ві́те</h3>
                      </div>
                    </div>
                  </div>
                  <div class="sixteen wide column">
                    <p>
                      ${statement}<strong style="margin-left: 0.0625em" class="except-print personal">*</strong>
                    </p>
                  </div>
                  <div class="sixteen wide column except-print personal">
                    <p style="opacity: 0.75">
                      <strong style="margin-right: 0.0625em">*</strong>I feel
                      like it's 40-60 by
                      <a href="${cv.intro.footnote.href}" rel="external" target="_blank">${cv.intro.footnote.text}</a>
                      into JavaScript and UX engineer
                    </p>
                  </div>
                  <div class="sixteen wide column except-print">
                    <p class="plain-cv">
                      <a href="./cv.html" rel="alternate">Plain-text CV, for applicant tracking systems</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>`;
}

// ----------------------------------------------------------- experience ----

// A bullet is a string, or {html, exceptPrint} when it belongs on the site but
// not on the paper. The class goes on the <li>: hiding only the text would
// leave an empty row behind.
function bullet(b, indent) {
  const html = typeof b === "string" ? b : b.html;
  const classes = typeof b === "string" ? "" : policy(b);
  const cls = classes ? ` class="${classes}"` : "";
  return `<li${cls}>${html}</li>`;
}

// Screen and paper each exclude some material, and the two policies are
// independent: `exceptPrint` keeps a thing off the paper, `personal` keeps it
// off the screen until the reader asks for it. Returns a class list rather than
// an attribute, so each caller keeps its own shape — and returns "" for an
// unflagged item, so untouched markup stays byte-identical.
function policy(item) {
  return [item.exceptPrint ? "except-print" : "", item.personal ? "personal" : ""]
    .filter(Boolean)
    .join(" ");
}

function label(key) {
  const { text, url } = cv.links[key];
  return `<a rel="external" class="label" href="${url}" target="_blank">${text}</a>`;
}

function project(p, index) {
  // The id only ever pairs with the label's `for`, and both are generated
  // here, so numbering follows document order. The hand-written markup
  // numbered them backwards, which is why adding a project used to mean
  // renumbering the others.
  const id = `project-${index + 1}`;
  const logo = p.logo
    ? `\n                            <img alt="${p.logo.alt}" class="logo" src="${p.logo.src}" height="${p.logo.height}" width="${p.logo.width}" />`
    : "";

  const name = p.productUrl
    ? `<strong><a rel="external" target="_blank" href="${p.productUrl}">${p.product} <span class="emoji">${p.productEmoji}</span></a></strong>`
    : `<strong>${p.product}${logo}</strong>`;

  const extra = p.bullets
    .map((b) => `\n                          ${bullet(b)}`)
    .join("");

  // The first project of an engagement repeats the role and employer the
  // engagement itself already states. `sameAsEngagement` drops that line so
  // the printed CV does not say it twice in a row.
  const heading = p.sameAsEngagement
    ? ""
    : `
                        <p>
                          <strong>${p.role}</strong> at
                          ${name}
                        </p>`;

  return `<li>${heading}
                        <ul>
                          <li class="details">
                            <input type="checkbox" id="${id}" />
                            <label for="${id}" class="summary">${p.summary}</label>
                            <div class="labels">
                              ${p.stack.map(label).join("\n                              ")}
                            </div>
                          </li>${extra}
                        </ul>
                      </li>`;
}

function recentExperience() {
  const r = cv.experience.recent;
  const projects = r.projects
    .map(project)
    .join("\n                      ");

  const other = `<li class="details">
                        <input type="checkbox" id="other" />
                        <label for="other" class="summary">${r.other.summary}</label>
                        <div>
                          <ul>
                            ${r.other.bullets
                              .map((b) => `<li>${b}</li>`)
                              .join("\n                            ")}
                          </ul>
                        </div>
                      </li>`;

  return `<ul class="timeline">
                  <li class="highlighted">
                    <p>
                      <em>${r.period}</em>
                    </p>
                    <p>
                      <strong>${r.role}</strong> at
                      <strong><a href="${r.employer.url}" rel="external" target="_blank">${r.employer.name}</a></strong>${r.employerNote ? ` <em>(${r.employerNote})</em>` : ""}<br /><sup style="display: none"><em>(here's my introduction letter
                          <a href="${r.introLetter.href}" rel="external"><strong>${r.introLetter.text}</strong> </a>)
                          <span class="pig">🐷<audio preload="auto">
                              <source src="${cv.sounds.pig}" type="audio/mpeg" /></audio></span> </em></sup>
                    </p>
                    <ol class="inverted">
                      ${projects}
                    </ol>
                    <ul style="border-top: 1px dotted #aaaaaa; margin-top: 0.25em; padding-top: 0.25em;" class="except-print personal">
                      ${other}
                    </ul>
                  </li>
                </ul>`;
}

function job(e) {
  const l = e.employer.logo;
  const gap = e.spaceAfterLogo ? " " : "";
  return `<li>
                    <p><em>${e.period}</em></p>
                    <p>
                      <strong>${e.role}</strong> at
                      <strong><a href="${e.employer.url}" rel="external" target="_blank">${e.employer.name}
                          <img alt="${l.alt}" class="logo" src="${l.src}" height="${l.height}" width="${l.width}" />${gap}</a></strong>
                    </p>
                    <ul>
                      ${e.bullets.map(bullet).join("\n                      ")}
                    </ul>
                  </li>`;
}

function sysadmin(e) {
  const company = (c) =>
    `<a href="${c.url}" target="_blank" rel="external">${c.name}<span class="logo">
                        <img width="${c.logo.width}" src="${c.logo.src}" alt="${c.name}" /></span></a>`;

  return `<li>
                    <p><em>${e.period}</em></p>
                    <p>
                      <strong>${e.role}</strong> at different
                      companies (like state committee<span class="emoji"> 🏢</span>, communal enterprise<span class="emoji"> 📠</span>,
                      ${company(e.companies[0])},
                      ${company(e.companies[1])}, etc.)
                    </p>
                    <ul class="except-print personal">
                      ${e.bullets.map(bullet).join("\n                      ")}
                    </ul>
                  </li>`;
}

function milestone(e) {
  if (e.kind === "spacer") return `<li class="except-print personal"></li>`;

  if (e.kind === "gallery-trigger") {
    const dots = `
                      <span class="dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                      </span>
                    `;
    return `<li class="except-print personal">
                    ${lightboxTrigger(e.lightbox, null, dots)}
                  </li>`;
  }

  if (e.kind === "graduation") {
    return `<li class="except-print personal">
                    <p>
                      <em>${e.period}</em>
                    </p>
                    <p>
                      <strong>Graduated 🎓 University 🏛
                        <button data-color="red" class="color red">RED</button>
                        📕</strong>
                    </p>
                  </li>`;
  }

  if (e.kind === "school") {
    return `<li class="except-print personal">
                    <p>
                      <em>${e.period}</em> &#127890;
                    </p>
                    <p>
                      <strong>Graduated school</strong> 🥇 and relocated to
                      <strong><a href="${e.city.url}" rel="external" target="_blank">${e.city.name}</a></strong>
                      <sup><em id="kyiv-rent-months"></em></sup>
                    </p>
                  </li>`;
  }

  return `<li class="except-print personal">
                    <p>
                      <em>${e.period}</em>
                    </p>
                    <p>
                      <strong>Born</strong> in
                      <strong><a href="${e.place.url}" rel="external" target="_blank">${e.place.name}</a></strong>
                      <sup><em>&mdash; Thanks, mom and dad! 🌈</em></sup>
                    </p>
                  </li>`;
}

function pastExperience() {
  const entries = cv.experience.past.map((e) => {
    if (e.kind === "job") return job(e);
    if (e.kind === "sysadmin") return sysadmin(e);
    return milestone(e);
  });

  return `<ul class="timeline">
                  ${entries.join("\n                  ")}
                </ul>`;
}

// -------------------------------------------------------------- sidebar ----

function languages() {
  const items = cv.languages.map((l) =>
    l.current
      ? `<span class="language" lang="${l.code}">${l.flag} ${l.name}</span>`
      : `<a href="${l.href}" hreflang="${l.code}" rel="alternate" class="language" lang="${l.code}" style="display: none">${l.flag} <span>${l.name}</span></a>`
  );

  return `<section class="except-print personal">
                  <h3>Languages</h3>
                  <p class="tags small">
                    ${items.join("\n                    ")}
                  </p>
                </section>`;
}

function badHabits() {
  return `<span class="tag">OWN BAD HABITS
                      <button id="meh" class="audio">
                        ${svg.speaker}
                        <audio preload="none">
                          <source src="${cv.sounds.meh}" type="audio/mpeg" />
                        </audio>
                      </button>
                    </span>`;
}

function tagItem(item) {
  if (item.badHabits) return badHabits();
  if (item.color) {
    const cls = `color ${item.color}`;
    return `<button data-color="${item.color}" class="${cls}">${item.label}</button>`;
  }
  if (item.link) {
    return `<a href="${item.link.href}" rel="external" target="_blank">${item.link.text}</a>`;
  }
  return `<span class="${item.className || "tag"}">${item.tag}</span>`;
}

function tagSection(section) {
  const classes = policy(section);
  const attrs = classes ? ` class="${classes}"` : "";
  // A glued item carries no whitespace before it: the source ran some tags
  // together, and that absence of a space renders.
  const items = section.items
    .map((item, i) => {
      const rendered = tagItem(item);
      if (i === 0) return rendered;
      return (item.glued ? "" : "\n                    ") + rendered;
    })
    .join("");

  return `<section${attrs}>
                  <h3>${section.title}</h3>
                  <p class="tags small bulleted">
                    ${items}
                  </p>
                </section>`;
}

// Two schools render as markup rather than as their plain name: the emoji and
// the line breaks are part of the typography. Keyed by `school.key`, so
// `school.name` stays a plain name every consumer can read — which is what the
// ATS document needs.
const SCHOOL_NAMES = {
  webAcademy: `<strong>Web<span class="emoji">🕸</span>
                            Academy</strong>`,
  kpi: `<strong>Igor Sikorsky
                            <span class="emoji">🚁</span> Kyiv
                            Polytechnic Institute
                            <span class="emoji">👨‍🎓🎈</span></strong>`,
};

function schoolLink(school) {
  const name =
    SCHOOL_NAMES[school.key] ||
    (school.emoji
      ? `<strong>${school.name}
                            <span class="emoji">${school.emoji}</span></strong>`
      : `<strong>${school.name}</strong>`);
  return `<a href="${school.url}" rel="external" target="_blank">${name}</a>`;
}

function diplomaLink(d) {
  const inner = d.spaced ? `\n                          📜\n                        ` : "📜";
  return lightboxTrigger(d.ref, "except-print", inner);
}

function platforms() {
  const items = cv.learningPlatforms.map(
    (p) =>
      `<span class="tag"><a href="${p.url}" rel="external" target="_blank"><strong>${p.name}</strong></a></span>`
  );
  return `<li class="except-print personal">
                      <div><em>Every day</em></div>
                      <p class="tags bulleted">
                        ${items.join("")}
                      </p>
                    </li>`;
}

function educationEntry(e) {
  // `hidden` drops an entry everywhere; `exceptPrint` keeps it on the site and
  // off the paper, which is what the 2018-19 bootcamps want.
  const cls = e.hidden ? "hidden" : e.exceptPrint ? "except-print" : "";
  const li = cls ? `<li class="${cls}">` : `<li>`;
  const dates = `<div>
                        <em>${e.dates}</em>
                      </div>`;

  if (e.kind === "certificate") {
    return `${li}
                      ${dates}
                      <div>
                        <strong>${e.title}
                          ${diplomaLink(e.diploma)}
                        </strong>
                      </div>
                    </li>`;
  }

  if (e.kind === "degree") {
    return `${li}
                      ${dates}
                      <div>
                        <strong>${e.title}</strong> in
                        <strong>${e.field}
                          ${diplomaLink(e.diploma)}</strong>
                        at
                        ${schoolLink(e.school)}
                      </div>
                    </li>`;
  }

  const title = e.titleEmoji
    ? `<strong>${e.title}
                          <span class="emoji">${e.titleEmoji}</span></strong>
                        at`
    : `<strong>${e.title}</strong> at`;

  const diploma = e.diploma ? `\n                        ${diplomaLink(e.diploma)}` : "";

  return `${li}
                      ${dates}
                      <div>
                        ${title}
                        ${schoolLink(e.school)}${diploma}
                      </div>
                    </li>`;
}

function education() {
  return `<section>
                  <h3>Education <span class="emoji">🏫</span></h3>
                  <ul class="timeline">
                    ${platforms()}
                    ${cv.education
                      .map(educationEntry)
                      .join("\n                    ")}
                  </ul>
                </section>`;
}

function reports() {
  // A talk with no public recording has neither an href nor a logo, so it
  // renders as a span rather than a link.
  const items = cv.reports.map((r) => {
    const logo = r.logo
      ? `\n                    <img src="${r.logo.src}" class="logo" height="${r.logo.height}" width="${r.logo.width}" />`
      : "";
    const note = r.note ? ` <em>(${r.note})</em>` : "";
    const inner = `${logo}
                    <strong>${r.title}</strong>${note}`;

    return r.href
      ? `<a href="${r.href}" rel="external" class="report" target="_blank">${inner}
                  </a>`
      : `<span class="report">${inner}
                  </span>`;
  });

  return `<section>
                  <h3>Reports <span class="emoji">📑</span></h3>
                  ${items.join("\n                  ")}
                </section>`;
}

// Two labels rather than one: a disclosure you cannot close is worse than one
// you cannot open. The show-label carries `except-personal`, the hide-label
// `personal`, so exactly one of them is visible in either state. The row is
// `except-print` — on paper there is nothing to reveal.
function personalToggle() {
  return `<div class="row">
              <div class="sixteen wide column except-print">
                <p class="personal-toggle">
                  <label for="personal" class="except-personal">${cv.personalToggle.show}</label>
                  <label for="personal" class="personal">${cv.personalToggle.hide}</label>
                </p>
              </div>
            </div>`;
}

// ------------------------------------------------------------- document ----

function document() {
  return `<!DOCTYPE html>
<html lang="en">
  ${head()}
  <body data-experience-start="${cv.dates.experienceStart}" data-kyiv-relocation="${cv.dates.kyivRelocation}">
    <input type="checkbox" id="personal" class="except-print" />
    ${cv.lightboxes.map(lightbox).join("\n    ")}
    <main>
      <article>
        <div class="page">
          <div class="stackable grid">
            ${header()}
            <div class="row">
              <div class="sixteen wide column except-print">
                <div class="fat divider"></div>
              </div>
            </div>
            <div class="row">
              <div class="ten wide column">
                <h3>Experience</h3>
                <h6 class="except-print">Recent</h6>
                ${recentExperience()}
                <h6 class="except-print">Back then</h6>
                ${pastExperience()}
              </div>
              <div class="six wide column">
                ${languages()}
                ${cv.tagSections.map(tagSection).join("\n                ")}
                ${education()}
                ${reports()}
              </div>
            </div>
            ${personalToggle()}
          </div>
        </div>
      </article>
    </main>
    <script src="./assets/js/scripts.js"></script>
  </body>
</html>
`;
}

// ------------------------------------------------- the other two manifests ----

// Both of these list the same icons the <head> links, so all three come from
// cv.icons. The hand-written copies pointed at the repository root, where the
// files stopped living in June 2021.

function manifest() {
  const icons = cv.icons.android.map((n) => ({
    src: `/assets/icons/android-icon-${size(n)}.png`,
    sizes: size(n),
    type: "image/png",
    // The convention these were written with: 48px is density 1.0.
    density: Number.isInteger(n / 48) ? (n / 48).toFixed(1) : String(n / 48),
  }));
  return JSON.stringify({ name: cv.manifestName, icons }, null, 1) + "\n";
}

function browserconfig() {
  const logo = (n) =>
    `<square${size(n)}logo src="/assets/icons/ms-icon-${size(n)}.png"/>`;
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig><msapplication><tile>${logo(70)}${logo(150)}${logo(
    310
  )}<TileColor>${cv.meta.tileColor}</TileColor></tile></msapplication></browserconfig>
`;
}

fs.writeFileSync(path.join(root, "index.html"), document());
fs.writeFileSync(path.join(root, "manifest.json"), manifest());
fs.writeFileSync(path.join(root, "browserconfig.xml"), browserconfig());
