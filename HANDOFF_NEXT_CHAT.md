# Handoff For Next Chat: jmoney Landing Page Repo

## 1. Repo Identity

This repo is the public-facing static site for `jmoney`.

It is **not** the WinForms source-code repo in the original sense anymore from the user's perspective. The repo now functions as:

- landing page
- download page
- public guide page
- source/handoff discovery page
- GitHub Pages host

Primary live URL:

- `https://robbygrean.github.io/jmoney/`

Primary repo URL:

- `https://github.com/RobbyGrean/jmoney`

GitHub Pages is intended to deploy from:

- branch: `main`
- folder: `/(root)`

## 2. Current Narrative We Must Preserve

This product must be described as:

- an **offline Windows app**
- a local document-generation tool
- something that runs on the user's machine
- not a web app
- not a cloud app
- not SaaS

This distinction is important and has been reinforced repeatedly by the user.

## 3. Audience Split

The site is intentionally split into 2 audiences:

### Audience A: General users

They should be able to:

- understand what the app does quickly
- download the installer easily
- open a clear Thai guide
- understand Windows SmartScreen warning without fear

### Audience B: Learners / builders

They should be able to:

- download source code
- read technical handoff
- understand the AI-assisted workflow and design ideas
- continue the system or reuse the approach

## 4. Current File Layout In Repo

Main files in `C:\Users\MSI\Documents\Redesign`:

- `index.html`
- `guide.html`
- `styles.css`
- `script.js`
- `README.md`
- `REDESIGN_HANDOFF.md`
- `HANDOFF_NEXT_CHAT.md`

Assets:

- `assets/icon/app-icon.png`
- `assets/downloads/ReimbursementDocApp-Installer.zip`
- `assets/downloads/ReimbursementDocApp-Source.zip`
- `assets/downloads/README-การลงโปรแกรมและการใช้งาน.txt`

Supporting docs:

- `docs/HANDOFF_APP.md`

## 5. What The Site Currently Contains

### `index.html`

Main landing page with:

- hero section
- clear offline Windows narrative
- general-user messaging
- download installer card
- guide/readme card
- summary section under the buttons
- source code / handoff / AI workflow study section

Recent wording changes already applied:

- `AUDIENCE A · ผู้ใช้งานทั่วไป` was changed to `ยินดีต้อนรับ ผู้ใช้งาน!`
- summary heading was changed to `ภาพรวมสั้นๆ ของโปรแกรมนี้`

Recent visual changes already applied:

- download card label changed from `FEATURE 1` to `DOWNLOAD`
- guide card label changed from `FEATURE 1` to `README`
- both labels now have glow/effect styling

### `guide.html`

Thai guide page converted from plain text into a styled HTML guide.

Important behavior:

- guide should open as a normal page navigation, not a new tab
- user wants people to press browser Back if needed

Guide content includes:

- installation steps
- explanation of generated files
- SmartScreen warning explanation
- what to click when Windows shows the protection dialog

Recent guide navigation changes already applied:

- stronger top-right `กลับหน้าแรก` button
- floating left-side buttons:
  - `กลับด้านบน`
  - `กลับหน้าแรก`

### `styles.css`

Contains:

- page theme
- glow and motion styling
- CTA card effects
- guide page layout
- floating guide nav styles
- responsive adjustments

### `script.js`

Contains lightweight client-side behavior and presentation effects for the static site.

## 6. Windows SmartScreen Requirement

The user explicitly requested that the guide explain this clearly for non-technical people:

- Windows may show `Windows protected your PC`
- this is expected for lesser-known apps or unsigned apps
- it does not automatically mean the app is malware
- user guidance should be simple and calm

The current guide includes this concept and the steps:

1. click `More info`
2. then click `Run anyway`

Keep this explanation beginner-friendly.

## 7. Git / Branch / Deploy History You Should Know

There was earlier confusion between:

- `main`
- `codex/redesign-landing-page`

The user decided clearly that:

- this repo exists for this landing-page work
- `main` should be the real branch
- no separate branch should remain as the public source of truth

Current intent:

- work directly on `main`
- GitHub Pages deploys from `main`

The branch `codex/redesign-landing-page` had been a source of confusion and was meant to be removed from the publishing story.

## 8. GitHub Pages Issues Already Encountered

There was a deployment incident where:

- build succeeded
- artifact was created
- deploy failed with `Deployment failed, try again later.`

There was also a period where jobs stayed `Queued` for a long time.

The working assumption was:

- GitHub Pages / Actions had a temporary platform-side issue

Later, the user reported deployment succeeded.

This means if a future deployment looks stale:

- first check GitHub Actions
- confirm Pages source is `main / (root)`
- confirm the latest commit is on `main`
- allow for GitHub-side delay before assuming broken code

## 9. Most Recent Commit Status

Latest completed push at the time of this handoff:

- commit: `6b37771`
- message: `Polish guide navigation and CTA labels`

This commit includes:

- stronger guide navigation
- floating guide controls
- `DOWNLOAD` CTA label effect
- `README` CTA label effect

## 10. User Preferences To Respect

The user prefers:

- practical Thai copy
- less corporate / less generic SaaS wording
- strong visual polish
- easy downloads for non-technical users
- no confusing branching/deploy workflow
- simple explanations when something is technical

The user does **not** want:

- wording that suggests web/cloud runtime
- confusing audience labels
- manual pages opening in a new tab
- stale placeholder branches causing deployment confusion

## 11. Likely Next Improvements

Reasonable next tasks in the next chat may include:

- verifying the live Pages site matches latest commit
- refining the floating guide buttons visually
- tightening mobile spacing on `guide.html`
- improving Thai copy in the guide for absolute beginners
- adding screenshots to installation / SmartScreen steps
- replacing any remaining weak labels or filler copy
- checking whether the plain `.txt` download is still needed now that `guide.html` exists

## 12. If The Next Chat Starts Cold

Use this short briefing:

`This repo is the static GitHub Pages landing/download site for jmoney, an offline Windows app. Main files are index.html, guide.html, styles.css, and script.js. The site is already live from main. Keep the narrative strictly offline/local, keep downloads easy for general users, and keep a second path for source/handoff/AI-study users. Latest pushed commit is 6b37771 (Polish guide navigation and CTA labels).`

## 13. Suggested First Checks In Next Chat

1. Open `index.html`, `guide.html`, and `styles.css`.
2. Check `git log -1 --oneline`.
3. If the user reports mismatch on the live site, check GitHub Pages source and latest deploy.
4. Test both pages on desktop and mobile width.
5. Preserve the offline Windows app narrative in every copy edit.
