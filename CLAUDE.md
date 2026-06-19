# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, single-page visualization of Taiwan reservoir water levels (台灣水庫即時水情視覺化), served at water.taiwanstat.com. There is no backend at runtime — the page is plain HTML/CSS/JS that fetches a committed `data/data.json` and renders animated liquid-fill gauges. Site copy is in Traditional Chinese.

## Branch model

Everything lives on the `gh-pages` branch — there is no separate `main`/`master`. `gh-pages` is both the development branch and what GitHub Pages serves. Commit work and open PRs against `gh-pages`.

## Build / develop

- **No build step.** `index.html`, `js/*.js`, and `css/*.css` are all edited and served directly; third-party libs are loaded from CDNs in the HTML. Edit `index.html` by hand (there is no longer an `index_edit.html` source or a gulp/minify step — those were removed).
- There are no tests, linters, or a `package.json` in the repo. To preview, serve the directory statically (e.g. `python3 -m http.server`) and open the page.

## Data pipeline

`data/data.json` is the single source of truth the page renders. It is refreshed hourly by `.github/workflows/update-data.yml`:

1. The workflow checks out this repo (`gh-pages`) and runs `update_data.py` directly — no scraper/Node server is involved anymore.
2. `update_data.py` calls the WRA fhyv2 JSON API directly (with an `apikey` header taken from the fhyv2 frontend bundle): `Reservoir/Station` (StationNo ↔ Chinese name), `Reservoir/Info/RealTime` (immediate storage/percentage/time), and `Reservoir/Daily` (daily inflow/outflow → netflow). It merges the new values into each reservoir keyed by Chinese `reservoirName` and writes `data/data.json` back. (The old `chihsuan/TaiwanReservoirAPI` Node scraper, which parsed the retired `ReservoirPage_2011/StorageCapacity.aspx`, is no longer used.)
3. The workflow validates the result (`dict`, ≥10 reservoirs) and commits with `chore: update reservoir data` only if changed.

To run the update manually, just `python3 update_data.py` (it needs network access to `fhy.wra.gov.tw`).

`update_data.py` only updates fields of reservoirs that already exist in `data.json` — adding a new reservoir means adding its entry by hand first. Each entry carries `id`, `percentage`, `volumn`, `updateAt`, `baseAvailable`, daily flow fields, etc.

## Rendering architecture

- `js/index.js` is the core: `d3.json('data/data.json', …)` loads the data, then for each reservoir it reads `percentage` and the daily netflow, picks gauge color/wave count/animation speed by percentage thresholds, and calls `loadLiquidFillGauge(id, percentage, config)` from `js/liquidFillGauge.js` (a D3 v3 liquid-fill gauge).
- **The link between data and DOM is the `id` field.** Each reservoir's `id` (e.g. `reservoir18`) matches an `<svg id="reservoir18">` card in `index.html`; sibling `.state`, `.volumn`, and `.updateAt` elements are filled in via jQuery relative to that svg. A reservoir whose `percentage` is `NaN` has its card removed at render time. So adding/removing a reservoir requires keeping `data.json` ids and the HTML svg ids in sync.
- `js/main.js` is shared site chrome (header bar + Headroom.js show/hide on scroll) and is independent of the gauges.
- Runtime libraries (d3 v3, jQuery, Semantic UI, Material Design Lite, Headroom) are pulled from CDNs / `bower_components`; `bower_components/` is vendored in the repo.
