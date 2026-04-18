#!/usr/bin/env node
/**
 * Lightweight sanity check: IRS.gov endpoints respond over HTTPS.
 * Does NOT ingest tax numbers (no stable bulk JSON API for full Form 1040 rules).
 * Use scripts/update-tax-data.js in CI + manual Rev. Proc. verification for figures.
 */
const sources = [
  ['IRS Newsroom (releases & inflation adjustments)', 'https://www.irs.gov/newsroom'],
  ['IRS Retirement plans (401k / IRA limits hub)', 'https://www.irs.gov/retirement-plans'],
  ['IRS Health Savings Accounts (HSA)', 'https://www.irs.gov/publications/p969'],
];

async function main() {
  let failed = false;
  for (const [label, url] of sources) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const ok = res.ok || res.status === 405; // some paths disallow HEAD but are live
      console.log(`${ok ? '✓' : '✖'} ${label} → ${res.status}`);
      if (!ok && res.status !== 405) failed = true;
    } catch (e) {
      console.error(`✖ ${label}: ${e.message}`);
      failed = true;
    }
  }
  if (failed) {
    console.error('\nOne or more checks failed (network or HTTP).');
    process.exit(1);
  }
  console.log('\nAll listed IRS pages responded.');
}

main();
