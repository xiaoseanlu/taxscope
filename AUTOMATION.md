# TaxScope Automation Guide

## How Updates Stay Current Automatically

TaxScope uses two GitHub Actions to keep tax data and pricing accurate without manual work.

---

## Workflow 1: Annual Tax Data Update

**File:** `.github/workflows/update-tax-data.yml`
**Runs:** Automatically every **October 15** + manually anytime

### What it does

The IRS publishes next year's tax figures every October (usually Oct 8–15). This workflow:

1. **Asks Claude to research** the new figures from IRS.gov — brackets, standard deductions, contribution limits, SALT cap, credits
2. **Asks Claude to check current pricing** for TurboTax, H&R Block, FreeTaxUSA, TaxSlayer, TaxAct
3. **Generates the exact code changes** needed in `App.jsx`
4. **Opens a Pull Request** for your review with a full summary table

**You never ship blindly.** The PR always requires your approval before anything goes live.

### Setup (one time)

1. Go to your GitHub repo → **Settings → Secrets → Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

That's it. The workflow handles everything else.

### Running it manually

Go to **GitHub → Actions → Annual Tax Data Update → Run workflow**

You can specify:
- A specific tax year (e.g. `2027`)
- Whether to also update pricing

### What to review in the PR

The PR will show you a diff of `App.jsx`. Before merging, verify:

| Check | Where to verify |
|---|---|
| New bracket thresholds | [IRS newsroom](https://www.irs.gov/newsroom) → search "inflation adjustments [year]" |
| 401k / IRA limits | [IRS retirement topics](https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits) |
| Standard deductions | Same IRS newsroom link |
| Product pricing | Visit each product's pricing page |

Usually takes 5–10 minutes to verify and merge.

---

## Workflow 2: Monthly Tax Law Monitor

**File:** `.github/workflows/monitor-tax-changes.yml`  
**Script:** `scripts/monitor-irs-signals.mjs`  
**Runs:** Automatically on the **1st of every month** (+ manual dispatch)

### What it does

1. Runs **`npm run verify:irs-sources`** — HEAD-checks key pages on irs.gov so broken links are caught early.
2. Queries the **[Federal Register API](https://www.federalregister.gov/reader-aids/developer-resources)** for recent documents where the agency is the IRS, and filters titles/abstracts with a **keyword regex** (brackets, Rev. Proc., credits, HSA, 401(k), etc.).
3. If anything matches, **opens one GitHub Issue** with links. **No Anthropic API** — Node 20 native `fetch` only.

**Nothing in the app changes automatically.** Triaging the issue (ignore vs. run the annual updater vs. manual `TAX_DATA` edit) is up to you.

---

## Staying current: official sources and optional alerts

**Rule:** Ship numbers and copy only after they appear on **irs.gov** (or official Treasury / Federal Register text). Third-party articles are for discovery, not as the source of truth.

### Layer 1 — Already in this repo

| Mechanism | Purpose |
|---|---|
| Monthly Federal Register scan (Workflow 2) | Early signal when IRS publishes notices or rules that match the script’s keywords |
| Annual tax-data workflow (Workflow 1) | Bulk inflation brackets, limits, and related copy once the IRS posts the yearly Rev. Proc. / notices |
| `verify:irs-sources` | Confirms listed IRS URLs still respond |

### Layer 2 — IRS email (low effort, high value)

Subscribe via **[IRS e-News](https://www.irs.gov/newsroom/e-news-subscriptions)** (GovDelivery):

- **IRS Guidewire** — Technical guidance (notices, revenue procedures, regulations). Best for “do we need to change the estimator?”
- **IRS Newswire** — Broader releases (still useful for timing and filing-season news)

### Layer 3 — Optional alerts and legislation

| Tool | Suggestion |
|---|---|
| **Google Alerts** | One or two high-signal queries, e.g. `"Revenue Procedure" site:irs.gov` or `"inflation adjustments" site:irs.gov` — fewer false positives than a generic “IRS” news alert. |
| **[Congress.gov API](https://api.congress.gov/)** | Optional: track tax bills when Congress is active; IRS guidance often lags enacted law. |
| **Interpretive sites** (e.g. Tax Foundation, Tax Policy Center) | Use for plain-English context; **always** verify figures on irs.gov before updating `TAX_DATA`. |

### Cadence

- **Monthly:** Rely on GitHub notifications from Workflow 2 + skim Guidewire/Newswire subjects.
- **Each fall:** Run or wait for Workflow 1 when the IRS publishes next-year inflation figures (typically October).
- **Quarterly:** Search [IRS Newsroom](https://www.irs.gov/newsroom) for `inflation` or your tax year if you want a manual sanity check.

---

## Automation Scope: What It Can and Cannot Do

### ✅ Automated safely
- Inflation-adjusted bracket thresholds (predictable, IRS-published annually)
- Standard deduction amounts
- Contribution limits (401k, IRA, HSA)
- SALT cap adjustments
- CTC amounts (when stable)
- Software product pricing

### ⚠️ Flags for human review, does not change automatically
- New deductions or credits that require new UI inputs
- Structural tax changes (new filing categories, eliminated deductions)
- Significant legislation with retroactive effects
- Anything the monitor rates as low-confidence

### ❌ Out of scope for automation
- State tax rate changes (would need per-state monitoring — possible but not built)
- Changes to SE tax, QBI, or Medicare surtax rates (extremely rare)
- New tax forms or filing requirements

---

## Cost

Each annual update run calls the Claude API twice (research + code generation).

Estimated cost per run: **$0.10–0.40** at current API pricing.

Monthly monitors: **~$0.02–0.05** per check (most return "no-action").

Annual total: well under **$5/year** in API costs.

---

## Editing the Automation

All logic lives in `scripts/update-tax-data.js`. The prompts Claude uses are clearly labeled sections — you can edit them to change what gets researched, how the PR is formatted, or what triggers an issue vs. a PR.
