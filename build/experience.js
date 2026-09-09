"use strict";

// The one place the years of experience are counted.
//
// Three consumers need the same number — the intro statement, og:description
// and meta description on the site, and the summary in the ATS document — and
// three hand-written numbers is exactly how they drifted apart before. Lives in
// its own module because render.js cannot be required for it: requiring that
// writes three files.

const cv = require("../data/cv");

// Whole years since a date.
function yearsSince(iso) {
  const start = new Date(iso);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < start.getDate())) years--;
  return years;
}

const phrase = `more than ${yearsSince(cv.dates.experienceStart)} years`;

// Every template that states the years writes {{experience}}, so the
// placeholder itself is named once rather than at each callsite. The site
// passes a replacement — the span scripts.js swaps for the flip clock — and the
// ATS document takes the default.
function fill(template, replacement = phrase) {
  return template.replace("{{experience}}", replacement);
}

module.exports = { yearsSince, phrase, fill };
