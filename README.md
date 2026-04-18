# TaxScope — Free 2025 Tax Estimator

> Find out if you're getting money back or writing a check — in 4 minutes.

A free, anonymous, browser-based 2025 income tax estimator. No signup, no data stored, no real numbers needed.

## Features

- ✅ 2025 federal + state tax calculation (all 50 states)
- ✅ W-2 employees, freelancers, gig workers, business owners, retirees
- ✅ 60+ job categories with dynamic deduction suggestions
- ✅ Business entity detection (Sole Prop, LLC, S-Corp, etc.)
- ✅ Child tax credit, CTC, SALT ($40k cap), QBI deduction
- ✅ Live estimate updates as you type
- ✅ Filing path recommendations with product comparisons
- ✅ No data collected or stored — 100% in-browser

## Tech Stack

- React 18 + Vite
- Recharts (bar chart)
- Lucide React (icons)
- Zero backend — fully static

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build & Deploy

```bash
npm run build   # creates dist/ folder
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## Tax Data Sources

All numeric parameters are sourced from official IRS publications and refreshed annually by the
automated workflow in `.github/workflows/update-tax-data.yml`. Current inputs:

- **2026 federal brackets:** IRS Rev. Proc. 2025-32
- **Standard deductions:** $16,100 single / $32,200 MFJ / $24,150 HoH (2026)
- **401(k) / IRA / HSA limits:** IRS Notice 2025-67 and Rev. Proc. 2025-19
- **Child Tax Credit:** $2,200 per child (per 2025 legislation)
- **SALT cap:** $40,000 (per 2025 legislation)
- **SE tax rate:** 15.3% on 92.35% of net SE income
- **QBI deduction:** 20% of qualified business income

See [AUTOMATION.md](./AUTOMATION.md) for how tax data is kept current.

## Legal

TaxScope is an educational estimator, not tax advice. See the footer disclaimer in the app for full legal disclosures. All calculations are estimates only.

---

*Free Tax Estimator · Tax Year 2025 · Not affiliated with the IRS*
