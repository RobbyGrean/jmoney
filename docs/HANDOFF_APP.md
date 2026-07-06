# Handoff: ReimbursementDocApp

## 1. Project Summary

Project path:

```text
C:\Users\MSI\Documents\App creation
```

This is a local Windows WinForms app for generating reimbursement `.docx` documents from Word templates.

Core idea:

- user fills one form once
- app computes related values
- app can load/save reusable presets
- app generates 5 Word files
- Word template remains the layout source of truth
- code is responsible for safe tag replacement, not redesigning document layout

Current product status:

- app is working
- user has already tested real output flow
- preset system is now built into the app
- fiscal-month data now supports pay-date lookup by fiscal year
- installer has been rebuilt with latest packaging + preset-compatible behavior

## 2. Current Source Of Truth

### Main working template folder

```text
C:\Users\MSI\Documents\App creation\dist\Template
```

This is the most important operational rule in the project:

- if templates are edited, edit `dist\Template`
- do not treat `release\Payload` as the master copy
- do not assume root `Template\` is the latest copy

### Final installer artifact

```text
C:\Users\MSI\Documents\App creation\release\ReimbursementDocApp-Installer.zip
```

### Installer package staging area

```text
C:\Users\MSI\Documents\App creation\release\Payload
```

Important packaging rule:

- `release\Payload` must contain a real `Template\` subfolder
- templates must be packed into `release\Payload\Template`
- this preserves correct runtime behavior when installed

## 3. What The App Generates

The system generates these 5 documents:

1. `1. หนังสือส่งเบิกจ้างเหมา.docx`
2. `3. ใบส่งมอบงาน.docx`
3. `4. ใบตรวจรับ.docx`
4. `5. บันทึกอนุมัติเบิกจ่าย.docx`
5. `8. ใบสำคัญรับเงิน.docx`

High-level flow:

1. app loads `app_database.json`
2. app loads template/tag expectations from `template_tags.json`
3. app loads user presets from `saved_templates.json` if present
4. user fills or loads the WinForms UI
5. code computes fiscal/order/date/salary/helper values
6. selected `.docx` files are generated to the output folder
7. app offers to open the output folder

## 4. Main Runtime Paths

### Development runtime

Dev exe:

```text
C:\Users\MSI\Documents\App creation\dist\ReimbursementDocApp.exe
```

Dev templates:

```text
C:\Users\MSI\Documents\App creation\dist\Template
```

Dev output:

```text
C:\Users\MSI\Documents\App creation\dist\output
```

Dev preset storage:

```text
C:\Users\MSI\Documents\App creation\dist\saved_templates.json
```

### Installed runtime

Installed app location:

```text
%LOCALAPPDATA%\ReimbursementDocApp
```

Typical real path:

```text
C:\Users\<WindowsUser>\AppData\Local\ReimbursementDocApp
```

Installed structure:

```text
%LOCALAPPDATA%\ReimbursementDocApp\
  ReimbursementDocApp.exe
  app_database.json
  template_tags.json
  saved_templates.json
  Template\
    1. หนังสือส่งเบิกจ้างเหมา.docx
    3. ใบส่งมอบงาน.docx
    4. ใบตรวจรับ.docx
    5. บันทึกอนุมัติเบิกจ่าย.docx
    8. ใบสำคัญรับเงิน.docx
  output\
  Uninstall ReimbursementDocApp.exe
```

Runtime defaults in the app:

- template path defaults to `AppDomain.CurrentDomain.BaseDirectory\Template`
- output path defaults to `AppDomain.CurrentDomain.BaseDirectory\output`
- preset file path defaults to `AppDomain.CurrentDomain.BaseDirectory\saved_templates.json`

Meaning:

- installed users automatically use the installed `Template` folder
- installed users automatically write output into the installed `output` folder
- installed users automatically keep their saved presets next to the installed exe

## 5. Main Code Files

Core maintained files:

- `ReimbursementDocApp.cs`
- `Installer.cs`
- `Uninstaller.cs`
- `build-exe.ps1`
- `build-installer.ps1`
- `template_tags.json`
- `app_database.json`
- `USER_README_TH.txt`
- `HANDOFF.md`

Historical / secondary files exist, but the real maintained product path is the C# WinForms app.

## 6. Packaging And Installer Behavior

### Build commands

Build exe:

```powershell
cd "C:\Users\MSI\Documents\App creation"
powershell -ExecutionPolicy Bypass -File .\build-exe.ps1
```

Build installer:

```powershell
cd "C:\Users\MSI\Documents\App creation"
powershell -ExecutionPolicy Bypass -File .\build-installer.ps1
```

### Current template source order used by `build-installer.ps1`

1. `dist\Template`
2. `Template`
3. desktop folders matching `Template*`
4. `Downloads`

This priority was intentionally changed so that the user's tested templates in `dist\Template` win first.

### Current package layout

When installer package is built, it creates:

```text
release\
  ReimbursementDocApp-Setup.exe
  README-TH.txt
  Payload\
    ReimbursementDocApp.exe
    template_tags.json
    app_database.json
    Uninstall ReimbursementDocApp.exe
    Template\
      1. หนังสือส่งเบิกจ้างเหมา.docx
      3. ใบส่งมอบงาน.docx
      4. ใบตรวจรับ.docx
      5. บันทึกอนุมัติเบิกจ่าย.docx
      8. ใบสำคัญรับเงิน.docx
```

### Important latest packaging behavior

- `Installer.cs` installs to `%LOCALAPPDATA%\ReimbursementDocApp`
- files are copied with overwrite behavior into the same folder
- this matches the product requirement that newer versions install over the same location
- installer creates `Template`
- installer creates `output`
- installer copies exe/json/uninstaller
- installer copies `.docx` templates into installed `Template`
- installer creates Desktop shortcut
- installer creates Start Menu app shortcut
- installer creates Start Menu uninstall shortcut
- installer auto-launches the app after install

### Uninstaller behavior

Current uninstaller:

- removes `%LOCALAPPDATA%\ReimbursementDocApp`
- removes Desktop shortcut
- removes Start Menu shortcuts
- is intentionally conservative

## 7. Database Model

Main database file:

```text
C:\Users\MSI\Documents\App creation\app_database.json
```

Preset file:

```text
saved_templates.json
```

This file is user-created and user-owned runtime data, not shipping master data.

### Main sections in `app_database.json`

- `prefixes`
- `months`
- `khetPositions`
- `schoolPositions`

Usage summary:

`prefixes`

- drives prefix dropdowns
- UI later reorders them for usability

`months`

- drives delivery month dropdown
- drives short month text
- drives pay date autofill
- now supports `payDatesByFiscalYear`
- participates in fiscal logic

`schoolPositions`

- drives school position dropdown
- drives salary autofill
- drives salary text autofill

`khetPositions`

- exists in DB
- not central to the current main workflow

## 8. Preset System

The app now has a built-in preset system for repeated monthly work.

### Main user-facing actions

- `บันทึกเป็น Template`
- `เหมือนเดิม! แค่เปลี่ยนเดือน!`
- `จัดการ Template`

### Preset file behavior

- file name is `saved_templates.json`
- file is created automatically on first save
- app reads it on startup
- app writes it on save / overwrite / rename / delete

### What presets are for

Mental model:

- save current form as a reusable starting point
- load it later as a prefill
- edit whatever changed this month
- generate documents normally

### Current supported preset operations

- save new preset from current form
- overwrite existing preset with current form
- load preset into current form
- rename preset
- edit preset note
- delete preset

### Important preset rule

Loading a preset is copy, not binding:

- values are copied into current controls
- user can still edit all fields
- editing after load does not mutate the preset automatically
- preset changes only when user explicitly saves or overwrites

### What is persisted vs recomputed

Presets mainly store input state, not derived output tags.

They do persist:

- order number (`{ใบสั่งจ้าง}`)
- selected order-date controls (`day / month / year`)
- selected fiscal month
- selected fiscal year base value
- head-finance checkbox state
- all editable names / roles / school / committee / signer inputs

They do not persist final derived tags directly:

- `{เดือนที่ส่งมอบ}`
- `{ย่อเดือนที่ส่งมอบ}`
- `{วันที่ส่งเบิก}`
- `{ปีใบสั่งจ้าง}`
- `{หัวหน้าการเงิน}`
- `{วันที่สั่งจ้าง}`

Reason:

- these are recomputed from source inputs after load

### Important quick-load behavior

`เหมือนเดิม! แค่เปลี่ยนเดือน!` currently means:

1. load saved preset
2. auto-advance month by +1
3. auto-adjust fiscal-year-dependent values
4. highlight the month area for user verification
5. if pay date for the resulting fiscal year is missing in DB, warn user instead of guessing

This behavior should be preserved unless the user explicitly requests a different workflow.

## 9. Important Business Logic

### Fiscal logic

Implemented logic:

```text
month >= 10 => fiscalYear = buddhistYear + 1
month < 10  => fiscalYear = buddhistYear
period = month >= 10 ? month - 9 : month + 3
```

Meaning:

- October is fiscal period 1
- September is fiscal period 12
- Oct-Dec belong to the next fiscal year

Main methods to inspect:

- `BuildFiscalControls()`
- `ApplyFiscalValues()`
- `GetPayDateForFiscalYear()`

### Pay-date mapping by fiscal year

This is one of the most important recent changes.

Old behavior:

- month data had only one `payDate`
- this was not enough once the app had to support different pay dates for the same month across fiscal years

Current behavior:

- each month record may contain `payDatesByFiscalYear`
- app computes fiscal year first
- app then resolves `วันที่ส่งเบิก` from `payDatesByFiscalYear[fiscalYear]`
- if not found, app falls back to old `payDate` if present
- if neither exists, app leaves the field blank

Design rule:

- do not let the app invent Thai government reimbursement dates
- use confirmed business data only

### School name normalization

Method:

- `NormalizeSchoolName()`

Current intended behavior:

- trims input
- removes accidental `โรงเรียนโรงเรียน...`
- ensures final value begins with `โรงเรียน`

This was explicitly confirmed by the user and should not be changed casually.

### Output naming logic

Current pattern:

```text
ชื่อผู้รับจ้าง_ชื่อเอกสาร_ddMMyyBuddhist.docx
```

Example concept:

```text
สมแสก_ใบตรวจรับ_030769.docx
```

Important behavior:

- no blind overwrite
- if file already exists, app creates `_2`, `_3`, etc.

Main methods:

- `BuildOutputFileName()`
- `BuildOutputDatePart()`
- `EnsureUniqueOutputPath()`

### Order date behavior

There are two layers:

1. UI controls for order date (`day / month / year`)
2. final derived tag `{วันที่สั่งจ้าง}`

Important current behavior:

- preset stores the selected `day / month / year`
- app recomputes `{วันที่สั่งจ้าง}` from those controls
- if selected order year is not `2569`, current implementation leaves derived order-date text blank

This behavior was explicitly requested by the user and is intentional.

### Order date formatting

Method:

- `SmartFormatThaiDate()`

Supported input formats include:

- `dd/MM/yyyy`
- `d/M/yyyy`
- `yyyy-MM-dd`
- `dd-MM-yyyy`

It converts to Thai textual date output.

## 10. UI And UX State

Important current UI behaviors:

- template path is auto-fixed to installed `Template`
- output path defaults to installed `output`
- output path is editable by user
- delivery month defaults to current month
- fiscal preview updates live
- month guide/highlight appears in quick-load flow
- order date uses separate day/month/year dropdowns
- prefix dropdown order was improved
- long school-position labels show shortened display text
- app can open output folder after generation
- app uses double buffering to reduce drag/render jank

Prefix order is intentionally biased toward easy lookup:

1. `--`
2. `นาย`
3. `นาง`
4. `นางสาว`
5. `ว่าที่ร้อยตรี`
6. `ดร.`
7. `........`
8. remaining DB values

Long school-position display shortening is done in `PositionOption.ToString()`.

## 11. Template And Tag System

### Main tag registry

File:

```text
C:\Users\MSI\Documents\App creation\template_tags.json
```

Important:

- this defines which templates exist
- packaging also uses this file to know which `.docx` files must be included
- if a new template is added, `template_tags.json` normally must be updated too

### Current important tags

Core fields:

- `{ชื่อโรงเรียน}`
- `{ตำแหน่ง}`
- `{เงินเดือน}`
- `{เงินเดือนTEXT}`
- `{เดือนที่ส่งมอบ}`
- `{ย่อเดือนที่ส่งมอบ}`
- `{วันที่ส่งเบิก}`
- `{ปีใบสั่งจ้าง}`
- `{ใบสั่งจ้าง}`
- `{วันที่สั่งจ้าง}`

Employee:

- `{คำนำหน้าลูกจ้าง}`
- `{ชื่อลูกจ้าง}`
- `{นามสกุลลูกจ้าง}`

Director:

- `{คำนำหน้าผอ}`
- `{ชื่อผอ}`
- `{นามสกุลผอ}`

Procurement officer:

- `{คำนำหน้าพัสดุ}`
- `{ชื่อพัสดุ}`
- `{นามสกุลพัสดุ}`

Head procurement officer:

- `{คำนำหน้าหพัสดุ}`
- `{ชื่อหพัสดุ}`
- `{นามสกุลหพัสดุ}`

Finance officer:

- `{คำนำหน้าการเงิน}`
- `{ชื่อการเงิน}`
- `{นามสกุลการเงิน}`

Committee:

- `{กรรมการA}`
- `{กรรมการB}`
- `{กรรมการC}`

Optional head finance:

- `{โซนหัวหน้าการเงิน}`
- `{หัวหน้าการเงิน}`

### Important head-finance behavior

Current logic:

- `{โซนหัวหน้าการเงิน}` = combined full name from prefix + name + surname
- `{หัวหน้าการเงิน}` = static text `หัวหน้าเจ้าหน้าที่การเงิน`
- if head finance is absent, both tags become empty

This supports showing/hiding title lines in templates.

Relevant code:

- `TagHeadFinanceZone`
- `TagHeadFinanceTitle`
- `NormalizeValues()`

### Current aliases

Added aliases:

- `{คำนำหน้าชื่อ}` -> value of `{คำนำหน้าลูกจ้าง}`
- `{กรรมการ B}` -> value of `{กรรมการB}`
- `{กรรมการ C}` -> value of `{กรรมการC}`

This exists to make templates more forgiving.

### Template editing rules

When editing templates in Word:

1. keep placeholders inside `{...}`
2. try not to split tags in weird ways unless necessary
3. avoid fixed text that duplicates code-normalized values
4. close Word before rebuilding/overwriting files if file lock issues appear

### Important school-name warning

Because code already ensures the school value begins with `โรงเรียน`,
templates should usually use:

```text
{ชื่อโรงเรียน}
```

and not:

```text
โรงเรียน{ชื่อโรงเรียน}
```

otherwise duplication can happen.

## 12. Word Generation Engine

Main implementation lives in:

- `RenderDocx()`
- `ReplaceTagsInXml()`
- `CenterSignatureParagraphs()`
- `ShouldCenterSignatureLine()`
- `SetParagraphAlignment()`

How it works:

1. opens `.docx` as zip
2. scans only Word XML files:
   - `word/document.xml`
   - `word/header*.xml`
   - `word/footer*.xml`
3. reads all `<w:t>` nodes into one logical string
4. replaces tags even if Word split them across runs
5. writes back while preserving surrounding text
6. recenters certain signature-related paragraphs

This is the most reusable technical asset in the project.

If the user later wants another document automation system based on `.docx`, this engine is the base pattern to reuse.

## 13. Things Added / Changed In This Project

Important implemented changes include:

- output filename changed to user-friendly Thai pattern
- repeated generation no longer overwrites blindly
- output folder open-after-generate flow added
- installed `output` folder is auto-created
- app uses installed `Template` folder by default
- app uses installed `output` folder by default
- README for users was rewritten
- installer now prioritizes `dist\Template`
- package layout bug was fixed by introducing `Payload\Template`
- head-finance optional tag pair was added:
  - `{โซนหัวหน้าการเงิน}`
  - `{หัวหน้าการเงิน}`
- preset system was added
- user presets are stored in `saved_templates.json`
- quick-load flow was added:
  - load preset
  - advance month
  - recompute fiscal data
  - warn if pay date is missing
- month DB was expanded to 12 months
- pay date lookup was upgraded to fiscal-year-aware mapping
- order-date derived text now intentionally blanks when selected year is not `2569`

## 14. Practical Warnings

### Template layout dominates output quality

If output looks visually wrong, the most likely cause is:

- Word template spacing
- paragraph alignment
- manual text around tags
- page layout choices in Word

not necessarily the code.

### Do not bulk-rebuild templates through raw XML casually

During this project, one attempt to reconstruct a template at XML level caused Thai corruption.

Safe rule:

- edit templates in Word whenever possible
- use code/XML editing for tag replacement behavior, not for large visual redesign

### Terminal mojibake does not always mean the file is broken

PowerShell may display Thai badly even when:

- source file is okay
- Word output is okay
- runtime strings are okay

Always separate:

- shell display encoding
- source encoding
- actual Word rendering

### If rebuild fails unexpectedly

A common cause is file lock:

- app or template still open
- file in `dist` or `release` is currently running

This happened multiple times during development.

### Do not let the app guess official reimbursement dates

For future fiscal years:

- update `app_database.json`
- do not auto-calculate government workday shifts unless that is a deliberate future project
- future holiday-aware automation is possible, but is a separate project

## 15. How To Change Things Safely

### If only year/month/fiscal behavior changes

Check:

- `app_database.json`
- `BuildFiscalControls()`
- `ApplyFiscalValues()`
- `GetPayDateForFiscalYear()`
- `AdvanceMonthForQuickLoad()`
- `AddOrderDateInputs()`

### If preset behavior changes

Check:

- `LoadSavedTemplates()`
- `SaveSavedTemplates()`
- `CaptureFormData()`
- `ApplyTemplateData()`
- `QuickLoadTemplateFlow()`
- `TemplateSaveModeDialog`
- `TemplateManagerDialog`

### If salary/position options change

Edit:

- `app_database.json` -> `schoolPositions`

Then verify:

- position dropdown
- salary autofill
- salary text autofill

### If prefixes change

Edit:

- `app_database.json` -> `prefixes`

Also review:

- `GetOrderedPrefixes()`

### If document wording/layout changes

Edit:

- files in `dist\Template`

Then rebuild installer:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-installer.ps1
```

### If a new tag is added

Typical checklist:

1. add field or computed value in code
2. store it in the values dictionary
3. ensure `NormalizeValues()` handles it correctly if needed
4. add the tag to template(s)
5. update `template_tags.json`

### If a new document type is added

Typical checklist:

1. create new `.docx`
2. place it in `dist\Template`
3. update `template_tags.json`
4. confirm checklist UI includes it
5. generate once and inspect result
6. rebuild installer

## 16. If Reusing This Project For Other DOCX Systems

This project is a good base for other offline document-generation apps.

### Reusable assets

- local WinForms + JSON architecture
- installer pattern
- output naming strategy
- unique output file generation
- `.docx` zip/XML replacement engine
- preset system pattern
- post-generation open-folder flow

### Reuse-with-care areas

- reimbursement-specific tag names
- school/fiscal assumptions
- signer/committee structure
- pay-date-by-fiscal-year business rules

### Best reuse recipe

1. keep layout in Word
2. place `{tag}` placeholders
3. load local form data
4. store reference/master data in JSON
5. optionally store user presets in a separate JSON
6. replace tags in XML
7. preserve Word layout
8. package with a local installer for offline workflow

### Recommended architecture if making another document app

Keep these boundaries:

- `master data` JSON
- `user preset` JSON
- `template registry` JSON
- `WinForms UI`
- `docx render engine`
- `installer / packaging`

That separation is the main reason this codebase stayed workable.

## 17. Suggested First Steps For The Next Chat

If continuing work in a new chat, do this first:

1. read this `HANDOFF.md`
2. inspect `ReimbursementDocApp.cs`
3. inspect `template_tags.json`
4. inspect `app_database.json`
5. inspect `dist\Template`
6. inspect `saved_templates.json` if the task involves presets
7. build installer once
8. test one real generation flow

If the next task is template-only:

1. edit `dist\Template`
2. test generation
3. rebuild installer

If the next task is data-only:

1. edit `app_database.json`
2. test autofill behavior
3. rebuild installer if distributing

If the next task is preset-only:

1. inspect `saved_templates.json`
2. inspect capture/apply logic in `ReimbursementDocApp.cs`
3. test save new / overwrite / quick load
4. verify empty-field behavior intentionally matches product expectation

## 18. One-Sentence Summary

This is now a working local WinForms + installer system that uses Word templates as the layout source of truth, stores business data in JSON, stores user presets in a separate runtime JSON, generates 5 `.docx` reimbursement files safely, and is a strong base for future offline Word-template document apps.
