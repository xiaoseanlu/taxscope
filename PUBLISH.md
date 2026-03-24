# 🚀 TaxScope — Publish to GitHub in 3 Steps

## Before you start
Install Node.js if you don't have it: https://nodejs.org → click the LTS button → install it.

---

## Step 1 — Set up the project (one time, ~2 min)

Open Terminal (Mac) or Command Prompt (Windows), then run:

```
cd taxscope
npm install
```

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

---

## Step 2 — Push to GitHub (~2 min)

Run these commands one by one:

```
git init
git add .
git commit -m "Launch TaxScope"
```

Then go to **github.com → click + → New repository**
- Name it: `taxscope`
- Leave everything else blank
- Click **Create repository**

GitHub will show you two commands. Copy and run them. They look like:

```
git remote add origin https://github.com/YOUR-USERNAME/taxscope.git
git push -u origin main
```

---

## Step 3 — Deploy on Vercel (~2 min, no commands needed)

1. Go to **vercel.com** → Sign up with GitHub (one click)
2. Click **Add New Project**
3. Find `taxscope` in the list → click **Import**
4. Click **Deploy** — that's it

Vercel gives you a live URL like `taxscope-abc.vercel.app` in about 60 seconds.

---

## Connect your domain (taxscope.app)

1. Buy `taxscope.app` at **namecheap.com** (~$14/yr)
2. In Vercel: your project → **Settings → Domains** → type `taxscope.app` → Add
3. Vercel shows you DNS records — copy them into Namecheap
4. Wait 10–30 min for DNS to propagate

---

## Every future update

Make your changes, then just run:
```
git add . && git commit -m "update" && git push
```
Vercel auto-redeploys. You're live in ~60 seconds.

---

## Add analytics (optional)

Open `index.html` and uncomment ONE of the three analytics options at the bottom of `<head>`.
- **Google Analytics** — most data, free
- **Plausible** — privacy-first, no cookie banner needed, $9/mo
- **Umami** — open source, self-host free

---

## Enable auto-updates (optional but recommended)

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY` · Value: your key from console.anthropic.com
4. Done — every October 15, a workflow opens a PR with next year's tax data

---

That's everything. You're done.
