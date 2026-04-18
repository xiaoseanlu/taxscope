#!/usr/bin/env node
/**
 * TaxScope — tax-year maintenance check (no network).
 *
 * Mirrors getActiveYears() in src/App.jsx: warns when the calendar expects
 * a TAX_DATA year that is not defined in App.jsx yet.
 *
 * Run after IRS publishes inflation adjustments (usually Oct–Nov) and you
 * add a new TAX_DATA[YYYY] block: npm run check:tax-season
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
const src = fs.readFileSync(appPath, 'utf8');
const fromLiterals = [...src.matchAll(/\b(20\d{2}):\s*\{/g)].map((m) => +m[1]);
const fromAssign = [...src.matchAll(/TAX_DATA\[(\d{4})\]\s*=/g)].map((m) => +m[1]);
const years = [...new Set([...fromLiterals, ...fromAssign])].sort((a, b) => a - b);

function getActiveYears(now = new Date()) {
  const y = now.getFullYear();
  const deadline = new Date(y, 3, 15, 23, 59, 59);
  const pick = (yr) => (years.includes(yr) ? yr : years.find((a) => a >= yr) ?? years[years.length - 1]);
  if (now <= deadline) {
    let primary = pick(y - 1);
    let planning = pick(y);
    if (planning === primary) {
      const nextUp = years.find((a) => a > primary);
      planning = nextUp != null ? nextUp : null;
    }
    return { primary, planning, dual: planning != null };
  }
  return { primary: pick(y), planning: null, dual: false };
}

const now = new Date();
const { primary, planning, dual } = getActiveYears(now);

console.log(`Today: ${now.toDateString()}`);
console.log(`TAX_DATA years in App.jsx: ${years.join(', ') || '(none found)'}`);
console.log(
  dual
    ? `Filing season (through Apr 15): primary tax year = ${primary}, planning = ${planning}`
    : `Post–Apr 15: single tax year mode, primary = ${primary}`,
);

let exit = 0;
if (!years.includes(primary)) {
  console.error(`\n✖ Missing TAX_DATA[${primary}] — add brackets and limits from IRS Rev. Proc. for that year.`);
  exit = 1;
}
if (dual && planning != null && !years.includes(planning)) {
  console.error(`\n✖ Missing TAX_DATA[${planning}] — needed for Jan 1 – Apr 15 dual-year UI.`);
  exit = 1;
}
if (dual && planning != null && primary === planning) {
  console.error('\n✖ Dual-year mode would use the same primary and planning year — check getActiveYears / TAX_DATA.');
  exit = 1;
}
if (exit === 0) console.log('\n✓ Calendar year vs. TAX_DATA keys look consistent.');
process.exit(exit);
