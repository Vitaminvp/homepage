"use strict";

// Step-1 gate: the generated index.html must be the baseline document with
// nothing changed but its formatting. Compares canonical forms (normalize.js).
//
//   node build/verify.js [ref]     ref defaults to HEAD
//
// Once step 2 starts fixing defects the baseline diverges on purpose — pin the
// ref to the last commit before the generator landed.

const { execFileSync } = require("child_process");
const fs = require("fs");
const normalize = require("./normalize");

const ref = process.argv[2] || "HEAD";
const baseline = normalize(
  execFileSync("git", ["show", `${ref}:index.html`], { encoding: "utf8" })
);
const built = normalize(fs.readFileSync("index.html", "utf8"));

if (baseline === built) {
  console.log(`index.html matches ${ref}, formatting aside`);
  process.exit(0);
}

let i = 0;
while (i < baseline.length && baseline[i] === built[i]) i++;
const from = Math.max(0, i - 120);
console.error(`index.html differs from ${ref} at character ${i}\n`);
console.error(`baseline: …${baseline.slice(from, i + 120)}`);
console.error(`built:    …${built.slice(from, i + 120)}`);
process.exit(1);
