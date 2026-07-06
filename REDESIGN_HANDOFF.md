# Redesign Handoff: jmoney Distribution Site + GitHub Repo Plan

## 1. Goal Of This Redesign Project

This redesign project is **not** the source-code repo of the Windows app itself.

It is a separate project for:

- building a public-facing landing page / download page
- making the program look trustworthy and easy to understand
- giving users a clear place to download the installer and the Thai README
- giving learners a separate section for source code, handoff, and AI-assisted development ideas

This project should become the new presentation/distribution layer around the existing app.

## 2. The Existing App This Site Refers To

Main app project:

```text
C:\Users\MSI\Documents\App creation
```

Important app artifacts already prepared:

- installer zip:
  - `C:\Users\MSI\Documents\App creation\release\ReimbursementDocApp-Installer.zip`
- source zip:
  - `C:\Users\MSI\Desktop\ReimbursementDocApp-Source.zip`
- Thai user README copied to Desktop:
  - `C:\Users\MSI\Desktop\README-การลงโปรแกรมและการใช้งาน.txt`
- detailed technical handoff:
  - `C:\Users\MSI\Documents\App creation\HANDOFF.md`
- generated app icon:
  - `C:\Users\MSI\Documents\App creation\app-icon.ico`
  - `C:\Users\MSI\Documents\App creation\app-icon.png`

## 3. Current State Of The Redesign Repo

Current redesign workspace:

```text
C:\Users\MSI\Documents\Redesign
```

Current git state when this file was created:

- local git repo exists
- branch = `master`
- no files yet except `.git`
- no remote configured yet

This means the redesign work should start from a clean slate.

## 4. What Has Already Been Drafted

Inside the app project, a first-pass landing page draft was created here:

```text
C:\Users\MSI\Documents\App creation\jmoney-site
```

Files:

- `index.html`
- `styles.css`
- `script.js`

This draft already contains:

- Tailwind CDN usage
- separated HTML / CSS / JS
- a hero section
- download section
- summary under the download buttons
- source code / handoff / AI learning section
- motion / glow / aurora / reveal effects

This draft should be treated as a **starting point**, not final truth.

## 5. Main Redesign Objective

The redesign should produce a site that feels:

- trustworthy
- polished
- easy to use for non-technical users
- inspiring for people who want to study the system further

The site should clearly separate **two audiences**:

### Audience A: General users

They need:

- a clear download button for the installer
- a clear download button for the Thai README
- a short explanation of what the app does
- confidence that the app is local/offline and practical

### Audience B: Learners / developers

They need:

- source code link
- handoff link
- explanation of how the app was built and evolved
- notes about using AI to develop or extend document-generation systems

## 6. Required Site Features

### Feature 1: Download / Usage

The page must include:

- main CTA to download the installer
- nearby CTA to download Thai usage instructions
- short summary below the download area

Suggested summary content:

- this app generates reimbursement documents from Word templates
- user fills data once and generates multiple Word files
- app works offline
- app supports presets / saved templates for repeated monthly workflows
- app does not need Excel during runtime

### Feature 2: Study / Source / AI

The page must include:

- source code link
- handoff link
- a section explaining the development idea
- a section explaining how this system can be a base for other document apps

Suggested explanation topics:

- use Word templates as layout source of truth
- use JSON for master data
- use separate JSON for user presets
- use an offline Windows workflow for practical office use
- use AI for requirement refinement, debugging, handoff writing, and structured iteration

## 7. Design Direction

The user explicitly asked for:

- Tailwind
- visually impressive presentation
- “อลังการสุดๆ”
- effects welcome
- separate `index / css / script`

So the redesign should **not** look like a plain documentation page.

Recommended style:

- cinematic hero
- clear CTA blocks
- strong typography
- layered cards
- background atmosphere
- motion on reveal
- elegant but not childish
- gold / navy / clean white / slate palette fits the app

Do not make it:

- generic SaaS purple template
- too dark and unreadable
- overloaded with effects that reduce clarity

## 8. Recommended File Structure For This Repo

Suggested structure:

```text
Redesign/
  index.html
  styles.css
  script.js
  assets/
    icon/
    screenshots/
  README.md
  REDESIGN_HANDOFF.md
```

Optional later:

```text
  docs/
  source-links.md
```

## 9. Recommended First Implementation Steps

1. Copy or adapt the draft from:

```text
C:\Users\MSI\Documents\App creation\jmoney-site
```

2. Make the page work as a standalone static site.

3. Replace placeholder links with real GitHub / release / file links.

4. Add screenshots if available.

5. Make sure the mobile layout is good.

6. Commit the redesign repo.

7. Connect GitHub remote.

8. Push.

## 10. GitHub Repo Plan

The user wants a separate GitHub repo for the distribution page.

Recommended structure across GitHub:

### Repo A: Source repo

Purpose:

- actual Windows app source
- technical history
- handoff
- scripts
- JSON data
- templates or references to templates

Contents should include:

- `ReimbursementDocApp.cs`
- `Installer.cs`
- `Uninstaller.cs`
- `build-exe.ps1`
- `build-installer.ps1`
- `app_database.json`
- `template_tags.json`
- `HANDOFF.md`
- `dist/Template`
- `USER_README_TH.txt`

### Repo B: Distribution / landing page repo

Purpose:

- public-facing download page
- overview for users
- source/handoff/AI learning section

This redesign repo is intended to become Repo B.

## 11. Download Strategy

There are two practical ways to wire downloads:

### Option A: GitHub Releases

Best for:

- installer zip
- versioned downloads

Recommended links:

- installer button -> latest release asset
- readme button -> a file in repo or release asset

### Option B: Repo file links

Best for:

- source code links
- handoff links
- public documentation

Use this for:

- source code section
- handoff section
- AI workflow explanation

## 12. What To Put In The Site README

The redesign repo `README.md` should explain:

- what this repo is
- that it is the landing page / distribution site
- where the actual Windows app source repo lives
- where releases are published
- how to preview the static site

Suggested sections:

- Project purpose
- Local preview
- Deployment
- Related repos

## 13. Assets To Reuse

From the app project, these are reusable:

- app icon:
  - `app-icon.png`
  - `app-icon.ico`
- Thai README content
- installer zip name and terminology
- handoff language around source of truth and offline workflow

If the redesign wants screenshots:

- capture the real app UI from the current build
- prefer real screenshots over invented mockups when possible

## 14. Important Messaging Rules

Do say:

- offline
- Windows
- Word template based
- reusable preset system
- JSON-driven
- can be extended into other document-generation systems

Do not overclaim:

- do not imply cloud sync if none exists
- do not imply web app if it is not one
- do not imply Excel dependency during runtime

## 15. AI Learning Section Guidance

The “study with AI” section should explain the real workflow honestly.

Suggested talking points:

- AI helped refine requirements
- AI helped isolate business logic changes
- AI helped write/update handoff
- AI helped maintain packaging logic
- AI is best used as a structured collaborator, not as the source of business truth
- official or user-confirmed business data should still be stored explicitly in JSON

This section should make the project useful to learners who want to build:

- other Word-template automation tools
- office workflow apps
- local/offline document systems

## 16. Concrete Next Task For The Next Chat

If another chat picks this up, start here:

1. open `C:\Users\MSI\Documents\Redesign`
2. create `index.html`, `styles.css`, `script.js`
3. use the draft in `C:\Users\MSI\Documents\App creation\jmoney-site` as the base
4. refine copy for users vs learners
5. wire real links
6. create `README.md`
7. connect GitHub remote
8. commit and push

## 17. One-Sentence Summary

This redesign repo should become a polished static landing page for downloading the jmoney app and learning from its source/handoff/AI-assisted development process, while the actual Windows source code remains in a separate dedicated repo.
