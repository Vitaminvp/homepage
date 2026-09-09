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

// Both generated documents, so a change to either generator has to be
// deliberate. A file the ref does not have yet is reported rather than failing:
// that is what a new document looks like the first time.
const DOCUMENTS = ["index.html", "cv.html"];

function check(file) {
  let baseline;
  try {
    baseline = normalize(
      execFileSync("git", ["show", `${ref}:${file}`], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      })
    );
  } catch {
    console.log(`${file} is not in ${ref} — nothing to compare`);
    return true;
  }

  const built = normalize(fs.readFileSync(file, "utf8"));
  if (baseline === built) {
    console.log(`${file} matches ${ref}, formatting aside`);
    return true;
  }

  let i = 0;
  while (i < baseline.length && baseline[i] === built[i]) i++;
  const from = Math.max(0, i - 120);
  console.error(`${file} differs from ${ref} at character ${i}\n`);
  console.error(`baseline: …${baseline.slice(from, i + 120)}`);
  console.error(`built:    …${built.slice(from, i + 120)}`);
  return false;
}

const results = DOCUMENTS.map(check);
process.exit(results.every(Boolean) ? 0 : 1);
