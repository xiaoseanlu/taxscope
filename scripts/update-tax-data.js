/**
 * update-tax-data.js
 *
 * Called by GitHub Actions every October to:
 * 1. Ask Claude to research the latest IRS tax figures for the coming year
 * 2. Ask Claude to check current product pricing
 * 3. Generate a precise diff/patch for App.jsx
 * 4. Write the updated file
 * 5. Write a human-readable summary for the PR description
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 */

const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const TAX_YEAR_OVERRIDE = process.env.TAX_YEAR_OVERRIDE || 'auto';
const UPDATE_PRICING = process.env.UPDATE_PRICING !== 'false';

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY not set. Add it to your GitHub repository secrets.');
  process.exit(1);
}

// ── Determine target tax year ──────────────────────────────────────────────
const currentYear = new Date().getFullYear();
const targetYear = TAX_YEAR_OVERRIDE === 'auto'
  ? currentYear + 1   // Running in Oct 2026 → update for Tax Year 2027
  : parseInt(TAX_YEAR_OVERRIDE);

console.log(`\n🔍 TaxScope Annual Updater`);
console.log(`   Target tax year: ${targetYear}`);
console.log(`   Update pricing: ${UPDATE_PRICING}`);
console.log(`   API key present: ${ANTHROPIC_API_KEY ? 'yes' : 'NO — aborting'}\n`);

// ── Read current App.jsx ───────────────────────────────────────────────────
const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
const currentCode = fs.readFileSync(appPath, 'utf8');

// Extract current TAX_DATA block so Claude knows what to update
const taxDataMatch = currentCode.match(/const TAX_DATA = \{[\s\S]*?\};\n\nfunction calcTax/);
const currentTaxData = taxDataMatch ? taxDataMatch[0].replace('\n\nfunction calcTax', '') : 'NOT FOUND';

// ── Call Claude API ────────────────────────────────────────────────────────
async function callClaude(prompt, useWebSearch = true) {
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  };

  if (useWebSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'interleaved-thinking-2025-05-14',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  // Extract all text blocks
  return data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');
}

// ── Step 1: Research latest tax figures ───────────────────────────────────
async function researchTaxData() {
  console.log(`📚 Step 1: Researching ${targetYear} tax figures from IRS...`);

  const prompt = `You are a tax data researcher. Search the web and find the official IRS figures for Tax Year ${targetYear}.

Search for:
1. IRS Revenue Procedure for ${targetYear} (usually titled "IRS releases tax inflation adjustments for tax year ${targetYear}")
2. The official ${targetYear} 401(k) contribution limits (IRS Notice announcing retirement plan limits for ${targetYear})
3. HSA contribution limits for ${targetYear}

Return ONLY a JSON object (no markdown, no explanation, just raw JSON) with these exact fields:

{
  "year": ${targetYear},
  "source_urls": ["url1", "url2"],
  "brackets_single": [[0, threshold1, 0.10], [threshold1, threshold2, 0.12], ...7 brackets total...],
  "brackets_mfj": [...7 brackets...],
  "brackets_hoh": [...7 brackets...],
  "brackets_mfs": [...7 brackets...],
  "std_ded_single": NUMBER,
  "std_ded_mfj": NUMBER,
  "std_ded_hoh": NUMBER,
  "std_ded_mfs": NUMBER,
  "age65_bonus_single": NUMBER,
  "age65_bonus_mfj": NUMBER,
  "senior_deduction": NUMBER_OR_0,
  "r401k_max": NUMBER,
  "ira_max": NUMBER,
  "hsa_self": NUMBER,
  "hsa_family": NUMBER,
  "student_loan_max": 2500,
  "salt_cap": NUMBER,
  "ctc_per_child": NUMBER,
  "key_changes": [
    {"icon": "emoji", "title": "short title", "detail": "one line detail with numbers"}
  ],
  "confidence": "high|medium|low",
  "notes": "any caveats or pending legislation"
}

IMPORTANT: Use exact numbers from official IRS sources only. If you cannot find official data for a field, use null. Do not guess.`;

  const response = await callClaude(prompt, true);

  // Extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Could not parse tax data JSON from Claude response:\n${response.slice(0, 500)}`);
  }

  const data = JSON.parse(jsonMatch[0]);
  console.log(`   ✓ Tax data retrieved (confidence: ${data.confidence})`);
  console.log(`   Sources: ${(data.source_urls || []).join(', ')}`);
  return data;
}

// ── Step 2: Research current product pricing ───────────────────────────────
async function researchPricing() {
  if (!UPDATE_PRICING) {
    console.log('⏭️  Step 2: Skipping pricing update (UPDATE_PRICING=false)');
    return null;
  }

  console.log('💰 Step 2: Researching current software pricing...');

  const prompt = `Search the web and find the CURRENT pricing (as of today) for these tax filing software products for individual filers. Check each product's official pricing page.

Products to check:
1. TurboTax (turbotax.intuit.com) - Free, Deluxe, Premium, Self-Employed, Live Assisted, Full Service
2. H&R Block (hrblock.com) - Free, Deluxe, Premium, Self-Employed, Expert Filing
3. FreeTaxUSA (freetaxusa.com) - Free federal + state price
4. TaxSlayer (taxslayer.com) - Classic, Self-Employed
5. TaxAct (taxact.com) - Self-Employed

Return ONLY a JSON object (raw JSON, no markdown):

{
  "retrieved_date": "YYYY-MM-DD",
  "notes": "any pricing caveats",
  "products": {
    "diy_low": [
      {"n": "TurboTax", "price": "$X", "sub": "brief description", "badge": "badge text or null"},
      ...
    ],
    "diy_med": [...],
    "diy_high": [...],
    "assist": [...],
    "pro": [...]
  },
  "general_filing_cost": {
    "diy_low": "$0–$30",
    "diy_med": "$0–$100",
    "diy_high": "$50–$150",
    "assist": "$50–$300",
    "pro": "$150–$500+"
  }
}

IMPORTANT: Use prices from official websites only. If a price isn't publicly listed, use the last known range in quotes. Always put TurboTax first in each category.`;

  const response = await callClaude(prompt, true);

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn('   ⚠️  Could not parse pricing JSON — skipping pricing update');
    return null;
  }

  const data = JSON.parse(jsonMatch[0]);
  console.log(`   ✓ Pricing data retrieved (as of ${data.retrieved_date})`);
  return data;
}

// ── Step 3: Generate updated App.jsx code ──────────────────────────────────
async function generateUpdate(taxData, pricingData) {
  console.log('⚙️  Step 3: Generating code update...');

  const pricingSection = pricingData
    ? `\n\nUpdated pricing data:\n${JSON.stringify(pricingData, null, 2)}`
    : '';

  const prompt = `You are a React developer maintaining a tax estimator app. You need to update the TAX_DATA constant in App.jsx with new tax figures.

CURRENT TAX_DATA block:
\`\`\`javascript
${currentTaxData}
\`\`\`

NEW TAX DATA for ${targetYear}:
${JSON.stringify(taxData, null, 2)}${pricingSection}

Your task:
1. Add a new entry to TAX_DATA for year ${targetYear} using the exact numbers provided
2. Update the "changes" array to reflect what's new for ${targetYear} vs the previous year
3. If pricing data was provided, update the mkProds() function with current prices
4. Update any hardcoded year references in comments

Return ONLY the complete updated TAX_DATA block (from "const TAX_DATA = {" through the closing "};")
and, if applicable, the complete updated mkProds function.

Format: Return each updated block separated by this exact delimiter:
===TAXDATA===
[updated TAX_DATA block here]
===MKPRODS===
[updated mkProds function here, or UNCHANGED if no pricing update]

IMPORTANT:
- Preserve ALL existing year entries (don't remove 2025 or 2026)
- Use exact numbers from the research data, not approximations
- Keep all the same structure and field names
- The bracket arrays must have exactly 7 entries each`;

  const response = await callClaude(prompt, false);

  const taxDataSection = response.split('===TAXDATA===')[1]?.split('===MKPRODS===')[0]?.trim();
  const mkProdsSection = response.split('===MKPRODS===')[1]?.trim();

  if (!taxDataSection) {
    throw new Error('Could not extract TAX_DATA update from Claude response');
  }

  return { taxDataSection, mkProdsSection };
}

// ── Step 4: Apply updates to App.jsx ──────────────────────────────────────
function applyUpdates(updates) {
  console.log('✏️  Step 4: Applying updates to App.jsx...');

  let updatedCode = currentCode;
  let changeLog = [];

  // Replace TAX_DATA block
  if (updates.taxDataSection && updates.taxDataSection !== 'UNCHANGED') {
    const taxDataRegex = /const TAX_DATA = \{[\s\S]*?\};\n/;
    if (taxDataRegex.test(updatedCode)) {
      updatedCode = updatedCode.replace(taxDataRegex, updates.taxDataSection + '\n');
      changeLog.push(`✅ Updated TAX_DATA with ${targetYear} tax figures`);
    } else {
      console.warn('   ⚠️  Could not find TAX_DATA block to replace — manual update required');
      changeLog.push('⚠️  TAX_DATA block not found — manual update required');
    }
  }

  // Replace mkProds function if updated
  if (updates.mkProdsSection && updates.mkProdsSection !== 'UNCHANGED') {
    const mkProdsRegex = /const mkProds=\(lvl\)=>\{[\s\S]*?\};\n/;
    if (mkProdsRegex.test(updatedCode)) {
      updatedCode = updatedCode.replace(mkProdsRegex, updates.mkProdsSection + '\n');
      changeLog.push('✅ Updated product pricing in mkProds()');
    } else {
      console.warn('   ⚠️  Could not find mkProds to replace — manual update required');
      changeLog.push('⚠️  mkProds not found — manual update required');
    }
  }

  fs.writeFileSync(appPath, updatedCode, 'utf8');
  console.log('   ✓ App.jsx updated');
  return changeLog;
}

// ── Step 5: Write PR summary ───────────────────────────────────────────────
function writeSummary(taxData, pricingData, changeLog) {
  const lines = [
    `## What Was Updated`,
    '',
    changeLog.map(c => `- ${c}`).join('\n'),
    '',
    `## Tax Year ${targetYear} Key Figures`,
    '',
    `| Figure | Value |`,
    `|---|---|`,
    `| Standard deduction (Single) | $${taxData.std_ded_single?.toLocaleString() ?? 'N/A'} |`,
    `| Standard deduction (MFJ) | $${taxData.std_ded_mfj?.toLocaleString() ?? 'N/A'} |`,
    `| 401(k) limit | $${taxData.r401k_max?.toLocaleString() ?? 'N/A'} |`,
    `| IRA limit | $${taxData.ira_max?.toLocaleString() ?? 'N/A'} |`,
    `| HSA (family) | $${taxData.hsa_family?.toLocaleString() ?? 'N/A'} |`,
    `| SALT cap | $${taxData.salt_cap?.toLocaleString() ?? 'N/A'} |`,
    `| Child Tax Credit | $${taxData.ctc_per_child?.toLocaleString() ?? 'N/A'} per child |`,
    '',
    `**Confidence level:** ${taxData.confidence}`,
    taxData.notes ? `**Notes:** ${taxData.notes}` : '',
    '',
    pricingData ? `## Pricing Update\nPricing updated as of ${pricingData.retrieved_date}.` : '## Pricing\nNo pricing update in this run.',
    '',
    `## ⚠️ Required Manual Verification`,
    '',
    `Before merging, please verify these numbers against:`,
    `- https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-${targetYear}`,
    `- https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits`,
    taxData.source_urls?.length ? `\nSources used by automation:\n${taxData.source_urls.map(u => `- ${u}`).join('\n')}` : '',
  ].filter(l => l !== undefined).join('\n');

  fs.writeFileSync('/tmp/update-summary.md', lines, 'utf8');
  console.log('   ✓ PR summary written to /tmp/update-summary.md');
}

// ── MAIN ───────────────────────────────────────────────────────────────────
async function main() {
  try {
    const taxData = await researchTaxData();

    if (taxData.confidence === 'low') {
      console.warn('\n⚠️  Low confidence in tax data — IRS may not have published yet.');
      console.warn('   The workflow will still create a PR, but review carefully.\n');
    }

    const pricingData = await researchPricing();
    const updates = await generateUpdate(taxData, pricingData);
    const changeLog = applyUpdates(updates);
    writeSummary(taxData, pricingData, changeLog);

    console.log('\n✅ Update complete!');
    console.log('   Changes written to src/App.jsx');
    console.log('   GitHub Actions will now open a PR for your review.\n');

  } catch (err) {
    console.error('\n❌ Update failed:', err.message);
    // Write failure summary so the PR still gets created with context
    fs.writeFileSync('/tmp/update-summary.md',
      `## ❌ Automation Failed\n\n**Error:** ${err.message}\n\nManual update required. Check the workflow logs for details.`
    );
    process.exit(1);
  }
}

main();
