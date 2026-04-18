#!/usr/bin/env node
/**
 * Monthly IRS / Treasury signal check (no LLM, no node-fetch).
 *
 * Pulls the newest Federal Register documents where the IRS is an agency,
 * then flags items from the last LOOKBACK_DAYS whose title or abstract
 * suggests individual income tax, brackets, deductions, credits, or
 * major notices — i.e. things that might require updating TAX_DATA in App.jsx.
 *
 * If any are found, opens one GitHub issue (when GITHUB_TOKEN + GITHUB_REPOSITORY exist).
 */

const LOOKBACK_DAYS = 21;
const PER_PAGE = 25;

const SIGNAL =
  /inflation|bracket|standard deduction|1040|individual income|withholding|estimated tax|tax credit|child tax|earned income|HSA|401\s*\(?k\)?|IRA|IRA\b|SALT|AMT|alternative minimum|Rev\.?\s*Proc|Revenue Procedure|Treasury decision|\bTD\s*\d|Notice\s+20\d{2}-\d+|tax rate|marginal rate|deduction limit|filing threshold|gross income/i;

function daysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function fetchRecentIrsDocuments() {
  const u = new URL('https://www.federalregister.gov/api/v1/documents.json');
  u.searchParams.set('per_page', String(PER_PAGE));
  u.searchParams.set('order', 'newest');
  u.searchParams.append('conditions[agencies][]', 'internal-revenue-service');

  const res = await fetch(u, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Federal Register API ${res.status}`);
  return res.json();
}

function isRecent(pubDateStr, cutoff) {
  const d = new Date(pubDateStr + 'T12:00:00Z');
  return d >= cutoff;
}

async function maybeCreateIssue(matches) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) {
    console.log('GITHUB_TOKEN or GITHUB_REPOSITORY missing — printing matches only.');
    for (const m of matches) console.log(`- ${m.publication_date}: ${m.title}`);
    return;
  }

  const title = `IRS / Federal Register review — ${new Date().toISOString().slice(0, 10)} (${matches.length} signal${matches.length === 1 ? '' : 's'})`;
  const body = [
    'The monthly monitor found recent Federal Register items from the IRS that may warrant a **manual review** of `TAX_DATA` / copy in TaxScope.',
    '',
    '### Documents (newest first)',
    '',
    ...matches.map(
      (m) => `- **${m.title}** (${m.type}, ${m.publication_date})\n  - ${m.html_url}`,
    ),
    '',
    '---',
    '*Automated signal only — not legal advice. Verify each link and update the app only after confirming numbers against irs.gov.*',
  ].join('\n');

  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ title, body }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub issues API ${res.status}: ${t}`);
  }
  const data = await res.json();
  console.log(`Created issue: ${data.html_url}`);
}

async function main() {
  const cutoff = daysAgo(LOOKBACK_DAYS);
  const data = await fetchRecentIrsDocuments();
  const results = data.results || [];

  const matches = results.filter((doc) => {
    if (!doc.publication_date || !isRecent(doc.publication_date, cutoff)) return false;
    const blob = `${doc.title || ''} ${doc.abstract || ''}`;
    return SIGNAL.test(blob);
  });

  console.log(`Checked ${results.length} newest IRS-tagged Federal Register documents.`);
  console.log(`Cutoff (UTC): ${cutoff.toISOString().slice(0, 10)} (${LOOKBACK_DAYS} day lookback)`);
  console.log(`Signal matches in window: ${matches.length}`);

  if (matches.length === 0) {
    console.log('No high-signal items — no GitHub issue.');
    return;
  }

  await maybeCreateIssue(matches);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
