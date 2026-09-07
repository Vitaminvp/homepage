"use strict";

// Canonical form for comparing two renderings of the same document.
//
// The point is to ignore formatting and nothing else, so each kind of
// whitespace is treated by whether a reader would see it:
//
//   inside a tag        insignificant. `<img\n src="a"\n/>` is the same
//                       element as `<img src="a"/>`, and padding inside an
//                       attribute value does not render either.
//   at a block edge     insignificant. A newline after `<li>` or before
//                       `</p>` is collapsed away by CSS.
//   between inline tags significant. `/> </a>` renders a space and `/></a>`
//                       does not, so a space here never appears or vanishes.
//
// That split is what lets a generated document be compared against a
// Prettier-formatted one. Prettier only ever pads text at block edges: inside
// an inline element it moves the `>` to the next line instead (the `</a\n>`
// shape), precisely so no space is introduced. So dropping block-edge padding
// discards its formatting and keeps everything a reader would notice.
//
// Safe for this document: no <pre> or <textarea>, and the only white-space
// rule in base.css is `nowrap`, which collapses runs as well.
//
// With --split, a newline goes before each tag so the output diffs
// line-by-line. Use that to locate a difference; gate on the default form.

const fs = require("fs");

const TOKEN = /<!--[\s\S]*?-->|<[^>]*>/g;

// Elements whose text edges cannot show whitespace. Inline elements are
// deliberately absent: whitespace next to them renders.
const BLOCK = new Set([
  "html",
  "head",
  "body",
  "main",
  "article",
  "section",
  "div",
  "ul",
  "ol",
  "li",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "dialog",
  "noscript",
  // A button strips the whitespace at its own text edges, and Prettier pads
  // long button labels for the same reason it pads block edges.
  "button",
  "title",
  "meta",
  "link",
  "script",
]);

function isBlock(token) {
  const name = /^<\/?\s*([a-zA-Z0-9]+)/.exec(token);
  return name ? BLOCK.has(name[1].toLowerCase()) : false;
}

function tag(source) {
  return source
    .replace(/\s+/g, " ")
    .replace(/\s+\/>$/, "/>")
    .replace(/\s+>$/, ">")
    .replace(/"([^"]*)"/g, (_, value) => `"${value.trim()}"`);
}

function normalize(html, split) {
  const tags = [];
  const texts = [];
  let last = 0;
  let match;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(html)) !== null) {
    texts.push(html.slice(last, match.index));
    tags.push(match[0]);
    last = match.index + match[0].length;
  }
  texts.push(html.slice(last));

  const pieces = [];
  texts.forEach((raw, i) => {
    let value = raw.replace(/\s+/g, " ");
    // texts[i] sits between tags[i - 1] and tags[i].
    if (i === 0 || isBlock(tags[i - 1])) value = value.replace(/^ /, "");
    if (i === tags.length || isBlock(tags[i])) value = value.replace(/ $/, "");
    pieces.push(value);
    if (i < tags.length) pieces.push(tag(tags[i]));
  });

  const canonical = pieces.join("").trim();
  return split ? canonical.replace(/(?=<)/g, "\n").trim() : canonical;
}

module.exports = normalize;

if (require.main === module) {
  const split = process.argv.includes("--split");
  const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
  process.stdout.write(normalize(fs.readFileSync(file, "utf8"), split) + "\n");
}
