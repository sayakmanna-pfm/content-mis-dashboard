# Content Production MIS Dashboard — Project Memory

## What This Project Is
A single-file interactive HTML dashboard (`Content Dashboard.html`) that auto-loads live data from a Google Sheet and renders charts, tables, KPIs, and red-flag insights for a show production team.

---

## Live Data Source
- **Google Sheet URL:** https://docs.google.com/spreadsheets/d/1BdZ-izEgRkWcBiaCTSxnXXxxkS0nyhFB-yOmRE-3zuY/edit?gid=0#gid=0
- **CSV Export URL (used in code):** `https://docs.google.com/spreadsheets/d/1BdZ-izEgRkWcBiaCTSxnXXxxkS0nyhFB-yOmRE-3zuY/export?format=csv&gid=0`
- Sheet must remain shared as **"Anyone with the link — Viewer"**
- Dashboard auto-fetches on open; **↺ Refresh Data** button re-fetches

---

## Dashboard File
- **Main file:** `Content Dashboard.html`
- **Local preview server:** `server.js` (Node.js, port 3456) — run via `.claude/launch.json`
- **Local URL:** http://localhost:3456
- All charts use **Chart.js 4.x** (CDN) and CSV parsing uses **PapaParse 5.x** (CDN)
- Currency is **USD ($)** throughout — never use ₹

---

## Data Structure — Column Mapping (0-indexed)
| Index | Column | Field in Code | Notes |
|-------|--------|---------------|-------|
| 0 | A | `ym` | YearMonth — stored as "202,502" in CSV, parsed to "202502" |
| 2 | C | `title` | Show Title |
| 3 | D | `tag` | Tag — "Regular" or "Growth Test" |
| 4 | E | `category` | Genre — "Fantasy", "Romance" — **sole source of truth for genre; column BE (New Genre Tagging) is ignored** |
| 5 | F | `showType` | Type of Show — use RAW value, never bucket/classify |
| 6 | G | — | AI/PGC |
| 7 | H | `prodStatus` | Production Status — >0 means show is currently in creation |
| 10 | K | `writingType` | Type of Writing — AI, ER, PGC India, PGC US |
| 11 | L | `voaType` | Type of VOA — VOA, AIVO |
| 13 | N | `soundType` | Type of Sound — In-house, PH, NA (post production type) |
| 14 | O | `underRevEps` | Under Review episodes |
| 16 | Q | `approvedEps` | Approved episodes |
| 18 | S | `prodEps` | Production episodes |
| 19 | T | `prodHr` | Production hours |
| 20 | U | `finalMastEps` | Final Master episodes |
| 21 | V | `finalMastHr` | Final Master hours |
| 28 | AC | `editCost` | Editorial Total Cost |
| 29 | AD | `editCPH` | Editorial CPH |
| 36 | AK | `voaCost` | VOA Total Cost |
| 37 | AL | `voaCPH` | VOA CPH |
| 43 | AR | `postCost` | Post Production Total Cost |
| 44 | AS | `postCPH` | Post Production CPH |
| 46 | AU | `totalCost` | Overall Total Cost |
| 47 | AV | `segCPH` | Segmental CPH |
| 56 | BE | `newLaunch` | New launch Y/N |

---

## Permanent Data Rules (always apply)
1. **Exclude Growth Test shows** — filter out any row where `tag === 'Growth Test'` (column D)
2. **Exclude March 2026 (202603)** — this month's data is incomplete
3. **Never bucket/classify column F (showType)** — always use raw values; `classifyType()` just returns the raw string. There are 30+ distinct values; grouping them causes "Other" to appear
4. **Currency is USD ($)** — the `cFmt()` function uses `$` prefix, never ₹
5. **Active Shows** = unique shows where `prodStatus > 0` in the latest selected month (not all-time unique titles)

---

## KPI Header Cards (top of dashboard)
1. **Total Spend** — with MoM % trend (amber = up, green = down)
2. **Editorial Cost** — sum of `editCost` + % of total
3. **VOA / Production Cost** — sum of `voaCost` + % of total
4. **Post Production Cost** — sum of `postCost` + % of total
5. **Active Shows (In Creation)** — unique shows with `prodStatus > 0` in latest month

Below the cards: **Spend Share by Show Type** — full-width panel showing every raw column F value as a horizontal bar (sorted by spend descending). Uses `typeColor(t)` for colours.

---

## Colour System
- **Never hardcode a colour per show type** — use the `typeColor(t)` function which assigns consistent colours from a palette dynamically
- Category colours: Fantasy = `#3b82f6` (blue), Romance = `#ec4899` (pink)
- Segment colours: Editorial = blue, VOA = green, Post Production = amber

---

## Dashboard Sections (in order)
1. Header (KPI cards + Spend Share by Show Type)
2. Highlights row (peak month, top type, AI share, most efficient)
3. Spend Trends — Monthly Total Spend + Cost by Segment
4. Efficiency & Volume — CPH Trends + Monthly Episode Volume
5. MoM Production Trend — % change vs prior month
6. Show Type Insights — table + CPH trend + spend bar (all raw col F values)
7. Genre Insights — Fantasy/Romance breakdown table + charts
8. Content Mix — Show Type % share + Genre Split donut
9. Show Performance — Top 15 shows by cost + Writing Type mix
10. Show-Level CPH Insights — KPIs, red flags, top 20 CPH chart, CPH bands, trend, full sortable table
11. Overall Production Insights — by Editorial Type (col F) / VOA Type (col L) / Post Prod Type (col N), each with red flags + table + chart
12. Genre-Level Insights — same 3 dimensions filtered by selected genre tab

---

## Red Flag Logic
Flags are generated automatically in multiple sections:
- 🔴 **Critical** — 3+ consecutive months of rising cost, OR >30% MoM spike
- ⚠️ **Warning** — 2 consecutive months rising, OR >15% MoM increase
- 🔵 **Watch** — CPH rising >20% MoM

---

## Tech Stack
- Pure HTML/CSS/JS — no build step, no npm, no framework
- Chart.js 4.4.0 (CDN)
- PapaParse 5.4.1 (CDN)
- Node.js static server (`server.js`) for local preview only

---

## Things NOT to Do
- Do not re-introduce any `return 'Other'` logic in `classifyType()`
- Do not hardcode a `TYPE_COLORS` array for show types
- Do not add ₹ symbol anywhere — currency is always $
- Do not include Growth Test shows or 202603 (March 2026) data
- Do not use `file-input` or drag-and-drop CSV upload — data comes from Google Sheets only
- Do not read or use column BE (New Genre Tagging / "Romantasy" label) — column E is the only genre source
