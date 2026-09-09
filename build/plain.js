"use strict";

// Trusted HTML in, plain text out.
//
// The direction of trust is the opposite of render.js's, and that is the one
// thing to keep in mind here. data/cv.js holds *trusted HTML*: entities are
// written as they should reach the page and the site renderer interpolates them
// verbatim. The ATS document cannot do that — an applicant tracking system reads
// text, so every value has to be flattened first, and anything flattened back
// into a document has to be escaped again. Hence two functions: plain() strips,
// esc() re-escapes.
//
//   node build/plain.js            run the assertions
//   node build/plain.js cv.html    print a document as the text a parser sees

const assert = require("assert");
const fs = require("fs");

// Every named entity that appears in data/cv.js, plus the four an escape can
// produce. An unknown one throws rather than travelling into a document nobody
// re-reads: `&hellip;` extracted literally is worse than a failed build.
const NAMED = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&mdash;": "—",
  "&ndash;": "–",
  "&nbsp;": " ",
  "&rarr;": "→",
  "&larr;": "←",
  "&middot;": "·",
};

// Emoji, in every form the data writes them: wrapped in <span class="emoji">,
// bare inside a tag string, or as a numeric entity. By the time this runs the
// tags are unwrapped and the entities decoded, so one character class catches
// all three. Regional indicators are the flag halves; FE0F/FE0E are variation
// selectors, 200D the zero-width joiner, 20E3 the keycap ring.
//
// Not \p{Emoji} — that matches 0-9, # and *.
const EMOJI =
  /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{FE0F}\u{FE0E}\u{200D}\u{20E3}]/gu;

// Elements whose content goes with them. The <audio> inside the pig span is the
// reason this exists: unwrapping its tags would leave the <source> URL behind as
// text.
const DROPPED = /<(audio|noscript|script|style|svg)\b[\s\S]*?<\/\1\s*>/gi;

function plain(html) {
  let text = String(html)
    .replace(DROPPED, "")
    .replace(/<br\s*\/?>/gi, " ")
    // Unwrapping every remaining tag is what flattens <strong>, <em>, <a> (the
    // link text survives, the href does not) and <sup> — which is what keeps
    // "20<sup>th</sup> June 2004" reading as a date. No `>` occurs inside an
    // attribute value anywhere in data/cv.js, so the naive match is safe.
    .replace(/<[^>]*>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)));

  text = text.replace(/&[a-z]+;/gi, (entity) => {
    const known = NAMED[entity.toLowerCase()];
    if (known === undefined) {
      throw new Error(
        `plain(): unknown entity ${entity} — add it to NAMED in build/plain.js`
      );
    }
    return known;
  });

  return text
    .replace(EMOJI, "")
    // Removing an emoji leaves the space that preceded it, so "Coffee Script ☕"
    // would keep a trailing space and "Zavodske 🏰, Ukraine" a space before the
    // comma. Repair both, then flatten the newlines and indentation the data
    // strings carry for the sake of a readable diff.
    .replace(/\s+([,.;:!?)])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+/g, " ")
    .trim();
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = { plain, esc };

// --------------------------------------------------------------- checks ----

if (require.main === module) {
  const file = process.argv[2];

  if (file) {
    // The eyeball check: the document as a parser reads it, one block per line.
    const blocks = fs
      .readFileSync(file, "utf8")
      .replace(/<head\b[\s\S]*?<\/head>/i, "")
      .split(/<\/(?:p|li|h1|h2|h3|h4|ul)\s*>/i)
      .map(plain)
      .filter(Boolean);
    console.log(blocks.join("\n"));
    return;
  }

  const cases = [
    ["20<sup>th</sup> June 2004", "20th June 2004"],
    [
      "1<sup>st</sup> September 1998 &ndash; 1<sup>st</sup> July 2004",
      "1st September 1998 – 1st July 2004",
    ],
    [
      `React, Redux, React Hooks, REST, Coffee Script\n     <span class="emoji">☕</span>`,
      "React, Redux, React Hooks, REST, Coffee Script",
    ],
    [
      `CMS Joomla, WordPress, Bitrix\n<span class="pig">🐷<audio preload="auto"><source src="assets/sounds/all-folks.mp3" type="audio/mpeg" /></audio></span>\nand OpenCart`,
      "CMS Joomla, WordPress, Bitrix and OpenCart",
    ],
    [
      "natural language&nbsp;&rarr;&nbsp;search-filter mapping.",
      "natural language → search-filter mapping.",
    ],
    ["Data &amp; state", "Data & state"],
    [
      "I also do some other things 🎊 from time to time &#x1f389;",
      "I also do some other things from time to time",
    ],
    ["🎐 SASS", "SASS"],
    ["Zavodske 🏰, Ukraine", "Zavodske, Ukraine"],
    ["Kyiv 🌇", "Kyiv"],
    [
      `managed computers network\n  <span class="emoji">👨‍💻</span> and servers\n  <span class="emoji">💻</span> (DHCP, DNS, proxy,\n  ACLs)`,
      "managed computers network and servers (DHCP, DNS, proxy, ACLs)",
    ],
    [
      `Own <strong>pathfinder-charts</strong>, a published\n graph-visualisation package &mdash; roughly 70% of its\n commit history is mine.`,
      "Own pathfinder-charts, a published graph-visualisation package — roughly 70% of its commit history is mine.",
    ],
    [
      `<a href="https://kottans.org/" rel="external" target="_blank">kottans</a>`,
      "kottans",
    ],
    ["Master's degree ", "Master's degree"],
    ["Likes&#x1f603;", "Likes"],
  ];

  cases.forEach(([input, expected]) => {
    assert.strictEqual(plain(input), expected, `plain(${JSON.stringify(input)})`);
  });

  assert.throws(() => plain("a &hellip; b"), /unknown entity &hellip;/);
  assert.strictEqual(esc('a & b < c > d "e"'), "a &amp; b &lt; c &gt; d &quot;e&quot;");

  console.log(`plain: ${cases.length + 2} cases ok`);
}
