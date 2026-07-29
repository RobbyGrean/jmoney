# @robbygrean/jmoney-installer

Windows command-line wrapper for the existing jmoney Setup. It downloads the
same Installer ZIP as the manual installation path, verifies its size and
SHA-256 checksum, extracts it to a temporary directory, and opens Setup.

The wrapper does not bypass Windows SmartScreen or Defender. jmoney Setup
currently shows its normal user interface and requires user interaction.

## Requirements

- Windows 10 or later
- Node.js 18 or later, including `npm`/`npx`

The examples below use `npx.cmd` because it works in Windows PowerShell even
when that machine's execution policy blocks `npx.ps1`. In Command Prompt, both
`npx` and `npx.cmd` work.

## Commands

Install the latest stable app:

```powershell
npx.cmd --yes @robbygrean/jmoney-installer@latest install
```

Upgrade an existing installation:

```powershell
npx.cmd --yes @robbygrean/jmoney-installer@latest update
```

`patch` is an alias for `update`:

```powershell
npx.cmd --yes @robbygrean/jmoney-installer@latest patch
```

Install a version listed by the package:

```powershell
npx.cmd --yes @robbygrean/jmoney-installer@latest install 2.0.0
```

Check versions without changing the installation:

```powershell
npx.cmd --yes @robbygrean/jmoney-installer@latest status
npx.cmd --yes @robbygrean/jmoney-installer@latest versions
```

Add `--dry-run` to `install`, `update`, or `patch` to show the selected
artifact, version, checksum, and destination without downloading or running
Setup.

## How updates work

The npm package contains a small release manifest. Each app version maps to an
immutable HTTPS URL, expected byte size, SHA-256 checksum, and Setup path. The
`@latest` npm tag selects the newest wrapper and therefore its newest verified
app manifest.

`update` is a verified full-installer upgrade, not a binary delta patch. The
existing jmoney Setup preserves user data and creates an upgrade backup.

For release 2.0.0 the artifact is pinned to Git commit
`b935ab2e54ff57051e5fc28daf926a9d08eddc34`. Future stable versions should use
immutable GitHub Release assets and be added to `releases.json` before the npm
package is published.

## Maintainer checks

From this directory:

```powershell
npm test
npm pack --dry-run
```

Publishing the npm package and creating GitHub Releases are separate,
intentional release operations. Neither happens during the checks above.
