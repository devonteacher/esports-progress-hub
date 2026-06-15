# Esports Progress Hub

An interactive study and progression hub for **BTEC Level 3 Nationals in Esports** students at Exeter College (Faculty of IT, Digital & Data).

It helps students aim beyond the minimum grade by making the qualification structure, their own progress, and their next steps clear and tangible. Everything runs **entirely in the browser with no server and no internet connection required** — ideal for hosting on Teams/SharePoint, a college intranet, GitHub Pages, or even a USB stick.

## What's inside

**Progress**
- **Grade Calculator** — work out the overall qualification grade exactly as Pearson calculates it (Year 1 Foundation and Year 2 Extended), with Year 1 grades carried forward, the next-grade-up gap, and UCAS/A‑Level equivalents.
- **UCAS Calculator** — converts grades to UCAS tariff points, lets students add other qualifications, and compares against typical offers.
- **Target Tracker** — set a target grade per unit, log actuals, and see at a glance whether they're on, above or below target.
- **Study Planner** — a guided, colour-coded assignment planner with deadlines, draft dates and progress status; downloadable as **Excel, Word or PDF**, and saveable via on-device auto-save plus a portable **save code**.

**Your course**
- **Units Overview** and a detail page per unit (learning aims, assignment guidance, grade-band breakdowns, curated resources, linked careers).
- **How Grading Works**, **Assessment Rules**, and **Study & Revision Skills**.

**Your future**
- **Careers Hub**, **LinkedIn & CV**, **University & UCAS**, and **Apprenticeships & Work**.

## Project structure

```
esports-progress-hub/
├── index.html               # Page shell; links the CSS and JS below
├── assets/
│   ├── css/
│   │   └── styles.css        # All styling
│   └── js/
│       ├── data.js           # Unit & qualification data (from the Pearson spec)
│       ├── filegen.js        # Offline .xlsx/.docx generation (no libraries)
│       └── app.js            # Router, pages, calculators, planner, init
├── dist/
│   └── esports-progress-hub.html   # Single-file build (run anywhere offline)
├── build.py                 # Regenerates the single-file build
├── LICENSE
└── README.md
```

The three JavaScript files are plain scripts loaded in order (`data.js` → `filegen.js` → `app.js`); there is **no build step or framework** required to run the site.

## Running it locally

Just open `index.html` in a browser. Because it loads separate JS files, some browsers are stricter about `file://` access — if anything doesn't load, serve the folder over a tiny local web server instead:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing on GitHub Pages

1. Push this repository to GitHub (see below).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, then **Save**.
4. After a minute, your site is live at `https://<your-username>.github.io/<repo-name>/`.

## Single-file version

If you'd rather hand out one file (e.g. on Teams or a USB stick), use `dist/esports-progress-hub.html`. Regenerate it after any edit with:

```bash
python3 build.py
```

## A note on data accuracy

Unit learning aims, points and grade thresholds are taken from the **Pearson BTEC Level 3 Nationals in Esports specification (Issue 3, May 2021)**. The optional units shown reflect a production/business-focused delivery; confirm your own optional selection with the teaching team. UCAS tariff values were correct at the time of writing — always confirm current values at [ucas.com](https://www.ucas.com). Salary ranges in the Careers Hub are broad indicative UK figures, not guarantees.

## Licence

Released under the [MIT Licence](LICENSE).
