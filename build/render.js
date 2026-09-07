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

const root = path.join(__dirname, "..");
const size = (n) => `${n}x${n}`;

// Whole years since a date. The one place the years of experience are counted:
// both the intro copy and og:description take their phrasing from here, so
// they cannot drift apart the way three hand-written numbers did.
function yearsSince(iso) {
  const start = new Date(iso);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < start.getDate())) years--;
  return years;
}

const experiencePhrase = `more than ${yearsSince(cv.dates.experienceStart)} years`;

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
  return cv.contacts
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
    <meta name="description" content="${cv.meta.description}" />
    <meta name="google" content="nositelinkssearchbox" />
    <meta name="google" content="notranslate" />
    <meta name="googlebot" content="index,follow" />
    <meta name="robots" content="index,follow" />
    <meta name="subject" content="${cv.meta.subject}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="${cv.meta.themeColor}" />
    <meta property="og:description" content="${cv.meta.ogDescription.replace(
      "{{experience}}",
      experiencePhrase
    )}" />
    ${iconLinks()}
    <link rel="manifest" href="/manifest.json" />
    <meta name="msapplication-TileColor" content="${cv.meta.tileColor}" />
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
    <!--    <base href="https://vitaminvp.github.io/homepage/" />-->
    <title>${cv.meta.title}</title>
    <link rel="icon" type="image/x-icon" href="./favicon.ico" />
    ${relMeLinks()}
    <link rel="stylesheet" href="./assets/styles/base.css" />
  </head>`;
}

// ----------------------------------------------------------- lightboxes ----

function lightbox(box) {
  const photos = box.photos
    .map((p) => `<img src="${p.src}" alt="${p.alt}" />`)
    .join("\n          ");
  return `<dialog id="${box.id}">
      <a href="${box.close.href}" title="${box.close.title}" class="close">Close</a>
      <div class="photos">
        <noscript>
          ${photos}
        </noscript>
      </div>
    </dialog>`;
}

// --------------------------------------------------------------- header ----

function contact(c) {
  const li = c.exceptPrint ? `<li class="except-print">` : `<li>`;

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
    ? `\n                          <${c.flagWrapper || "span"} class="phone-flag${
        c.flagExceptPrint ? " except-print" : ""
      }">${phone.flag}</${c.flagWrapper || "span"}>`
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
                    <ul class="contacts">
                      ${cv.contacts.map(contact).join("\n                      ")}
                    </ul>
                  </div>
                  <div class="sixteen wide mobile only column">
                    <div class="divider"></div>
                  </div>
                  <div class="flip-box">
                    <div class="flip-box-inner">
                      <div class="flip-box-front">
                        <h2>Résumé</h2>
                      </div>
                      <div class="flip-box-back">
                        <h3 class="cv">Куррі́кулюм ві́те</h3>
                      </div>
                    </div>
                  </div>
                  <div class="sixteen wide column except-print">
                    <p>
                      &mdash; Hello! I’m a frontend developer<strong style="margin-left: 0.0625em">*</strong>
                      with <span id="experience">${experiencePhrase} </span> of
                      application development. I strive to craft precise,
                      responsive, fast, easy-to-use environments with both
                      strong purpose and great looks.
                    </p>
                    <p style="opacity: 0.75">
                      <strong style="margin-right: 0.0625em">*</strong>I feel
                      like it's 40-60 by
                      <a href="${cv.intro.footnote.href}" rel="external" target="_blank">${cv.intro.footnote.text}</a>
                      into JavaScript and UX engineer
                    </p>
                  </div>
                </div>
              </div>
            </div>`;
}

// ----------------------------------------------------------- experience ----

function label(key) {
  const { text, url } = cv.links[key];
  return `<a rel="external" class="label" href="${url}" target="_blank">${text}</a>`;
}

function project(p, index, total) {
  // Checkbox ids run backwards through the list, the way the hand-written
  // markup numbered them: the last project is project-1.
  const id = `project-${total - index}`;
  const logo = p.logo
    ? `\n                            <img alt="${p.logo.alt}" class="logo except-print" src="${p.logo.src}" height="${p.logo.height}" width="${p.logo.width}" />`
    : "";

  const name = p.productUrl
    ? `<strong><a rel="external" target="_blank" href="${p.productUrl}">${p.product} <span class="except-print">${p.productEmoji}</span></a></strong>`
    : `<strong>${p.product}${logo}</strong>`;

  const extra = p.bullets
    .map((b) => `\n                          <li>${b}</li>`)
    .join("");

  return `<li>
                        <p>
                          <strong>${p.role}</strong> at
                          ${name}
                        </p>
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
    .map((p, i) => project(p, i, r.projects.length))
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
                      <strong><a href="${r.employer.url}" rel="external" target="_blank">${r.employer.name}</a></strong><br /><sup style="display: none"><em>(here's my introduction letter
                          <a href="${r.introLetter.href}" rel="external"><strong>${r.introLetter.text}</strong> </a>)
                          <span class="pig">🐷<audio preload="auto">
                              <source src="${cv.sounds.pig}" type="audio/mpeg" /></audio></span> </em></sup>
                    </p>
                    <ol class="inverted">
                      ${projects}
                    </ol>
                    <ul style="border-top: 1px dotted #aaaaaa; margin-top: 0.25em; padding-top: 0.25em;" class="except-print">
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
                          <img alt="${l.alt}" class="logo except-print" src="${l.src}" height="${l.height}" width="${l.width}" />${gap}</a></strong>
                    </p>
                    <ul>
                      ${e.bullets.map((b) => `<li>${b}</li>`).join("\n                      ")}
                    </ul>
                  </li>`;
}

function sysadmin(e) {
  const company = (c) =>
    `<a href="${c.url}" target="_blank" rel="external">${c.name}
                        <img width="${c.logo.width}" src="${c.logo.src}" alt="${c.name}" class="except-print" /></a>`;

  return `<li>
                    <p><em>${e.period}</em></p>
                    <p>
                      <strong>${e.role}</strong> at different
                      companies (like state committee<span class="except-print"> 🏢</span>, communal enterprise<span class="except-print"> 📠</span>,
                      ${company(e.companies[0])},
                      ${company(e.companies[1])}, ets.)
                    </p>
                    <ul class="except-print">
                      ${e.bullets.map((b) => `<li>${b}</li>`).join("\n                      ")}
                    </ul>
                  </li>`;
}

function milestone(e) {
  if (e.kind === "spacer") return `<li></li>`;

  if (e.kind === "gallery-trigger") {
    return `<li class="except-print">
                    <a id="resume" href="#childhood" title="Show childhood photos">
                      <span class="dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                      </span>
                    </a>
                  </li>`;
  }

  if (e.kind === "graduation") {
    return `<li class="except-print">
                    <p>
                      <em>${e.period}</em>
                    </p>
                    <p>
                      <strong>Graduated 🎓 University 🏛
                        <button id="red" class="color red">RED</button>
                        📕</strong>
                    </p>
                  </li>`;
  }

  if (e.kind === "school") {
    return `<li class="except-print">
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

  return `<li class="except-print">
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

  return `<section class="except-print">
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
    const cls = `color ${item.color}${item.exceptPrint ? " except-print" : ""}`;
    return `<button id="${item.color}" class="${cls}">${item.label}</button>`;
  }
  if (item.link) {
    return `<a href="${item.link.href}" rel="external" target="_blank">${item.link.text}</a>`;
  }
  return `<span class="${item.className || "tag"}">${item.tag}</span>`;
}

function tagSection(section) {
  const attrs = section.exceptPrint ? ` class="except-print"` : "";
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

const SCHOOL_NAMES = {
  webAcademy: `<strong>Web<span class="except-print">🕸</span>
                            Academy</strong>`,
  kpi: `<strong>Igor Sikorsky
                            <span class="except-print">🚁</span> Kyiv
                            Polytechnic Institute
                            <span class="except-print">👨‍🎓🎈</span></strong>`,
};

function schoolLink(school) {
  const name =
    SCHOOL_NAMES[school.name] ||
    (school.emoji
      ? `<strong>${school.name}
                            <span class="except-print">${school.emoji}</span></strong>`
      : `<strong>${school.name}</strong>`);
  return `<a href="${school.url}" rel="external" target="_blank">${name}</a>`;
}

function diplomaLink(d) {
  const inner = d.spaced ? `\n                          📜\n                        ` : "📜";
  return `<a id="${d.id}" href="#${d.dialog}" title="${d.title}" class="except-print">${inner}</a>`;
}

function platforms() {
  const items = cv.learningPlatforms.map(
    (p) =>
      `<span class="tag"><a href="${p.url}" rel="external" target="_blank"><strong>${p.name}</strong></a></span>`
  );
  return `<li class="except-print">
                      <div><em>Every day</em></div>
                      <p class="tags bulleted">
                        ${items.join("")}
                      </p>
                    </li>`;
}

function educationEntry(e) {
  const li = e.hidden ? `<li class="hidden">` : `<li>`;
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
                          <span class="except-print">${e.titleEmoji}</span></strong>
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
                  <h3>Education <span class="except-print">🏫</span></h3>
                  <ul class="timeline">
                    ${platforms()}
                    ${cv.education
                      .map(educationEntry)
                      .join("\n                    ")}
                  </ul>
                </section>`;
}

function reports() {
  const items = cv.reports.map(
    (r) => `<a href="${r.href}" rel="external" class="report" target="_blank">
                    <img src="${r.logo.src}" class="except-print" height="${r.logo.height}" width="${r.logo.width}" />
                    <strong>${r.title}</strong>
                  </a>`
  );

  return `<section>
                  <h3>Reports <span class="except-print">📑</span></h3>
                  ${items.join("\n                  ")}
                </section>
                <section class="except-print">
                  <h3>Articles</h3>
                  <p>
                    None published <sup><em>yet</em></sup>
                  </p>
                </section>`;
}

// ------------------------------------------------------------- document ----

function document() {
  return `<!DOCTYPE html>
<html lang="en">
  ${head()}
  <body>
    ${cv.lightboxes.map(lightbox).join("\n    ")}
    <main>
      <article>
        <div class="page" style="border-color: ${cv.meta.borderColor}">
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
          </div>
        </div>
      </article>
    </main>
    <script src="./assets/js/scripts.js"></script>
  </body>
</html>
`;
}

fs.writeFileSync(path.join(root, "index.html"), document());
