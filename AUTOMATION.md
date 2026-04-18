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
**Runs:** Automatically on the **1st of every month**

### What it does

Congress occasionally passes mid-year tax legislation that changes brackets, credits, or deductions with little notice. This workflow:

1. Asks Claude to search for any significant tax law changes in the last 60 days
2. If something significant is found, **automatically opens a GitHub Issue** with details and a recommended action
3. You get notified via your normal GitHub notifications

**Nothing changes automatically.** You only get an issue to review.

### Recommended actions the monitor may suggest

| Action | Meaning |
|---|---|
| `no-action` | Nothing significant — no issue opened |
| `update-data` | Run the annual updater manually to get new numbers |
| `review-required` | Significant legislation — may need UI changes, not just number updates |

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
