#!/usr/bin/env node
"use strict";

const path = require("node:path");
const manifest = require("../releases.json");
const packageJson = require("../package.json");
const {
  compareVersions,
  getInstallDirectory,
  installRelease,
  readInstalledVersion,
  resolveRelease
} = require("../lib/installer");

const HELP = `
jmoney installer ${packageJson.version}

Usage:
  jmoney install [app-version] [--dry-run] [--keep-temp]
  jmoney update [--force] [--dry-run] [--keep-temp]
  jmoney patch [--force] [--dry-run] [--keep-temp]
  jmoney status
  jmoney versions
  jmoney --version
  jmoney --help

Commands:
  install   Install the latest app version, or the version supplied.
  update    Upgrade an existing installation to the latest app version.
  patch     Alias for update.
  status    Show installed and latest app versions.
  versions  List app versions bundled in this installer package.

Options:
  --app-version <version>  Select an app version explicitly.
  --force                  Reinstall even when the latest version is installed.
  --dry-run                Show what would happen without downloading or running Setup.
  --keep-temp              Keep verified Setup files in the temporary directory.

The downloaded ZIP is verified with SHA-256 before Setup is opened.
Setup currently uses its normal Windows UI; it is not a silent installer.
`.trim();

function parseArguments(argv) {
  const args = [...argv];
  if (args.includes("--help") || args.includes("-h")) return { command: "help" };
  if (args.includes("--version") || args.includes("-V")) return { command: "cli-version" };

  let command = "install";
  if (args[0] && !args[0].startsWith("-")) command = args.shift().toLowerCase();
  if (command === "patch") command = "update";

  const options = {
    command,
    force: false,
    dryRun: false,
    keepTemp: false,
    appVersion: null
  };

  while (args.length) {
    const value = args.shift();
    if (value === "--force") options.force = true;
    else if (value === "--dry-run") options.dryRun = true;
    else if (value === "--keep-temp") options.keepTemp = true;
    else if (value === "--app-version") {
      if (!args.length) throw new Error("--app-version requires a value.");
      options.appVersion = args.shift();
    } else if (!value.startsWith("-") && command === "install" && !options.appVersion) {
      options.appVersion = value;
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }
  return options;
}

async function showStatus() {
  const latest = resolveRelease(manifest);
  const installDirectory = getInstallDirectory();
  const installed = await readInstalledVersion(installDirectory);
  console.log(`Installed: ${installed || "not installed"}`);
  console.log(`Latest:    ${latest.version}`);
  console.log(`Location:  ${installDirectory}`);
}

async function runInstall(options) {
  const release = resolveRelease(manifest, options.appVersion);
  const installDirectory = getInstallDirectory();
  const installedBefore = await readInstalledVersion(installDirectory);

  if (options.command === "update") {
    if (!installedBefore) {
      throw new Error("jmoney is not installed. Run the install command first.");
    }
    const comparison = compareVersions(installedBefore, release.version);
    if (comparison > 0 && !options.force) {
      console.log(
        `Installed jmoney ${installedBefore} is newer than available ${release.version}; no update applied.`
      );
      return;
    }
    if (comparison === 0 && !options.force) {
      console.log(`jmoney ${installedBefore} is already up to date.`);
      return;
    }
  }

  const action = installedBefore ? "upgrade" : "install";
  console.log(`jmoney ${release.version} will ${action} at ${installDirectory}`);
  console.log(`Source: ${release.url}`);
  console.log(`SHA-256: ${release.sha256}`);

  if (options.dryRun) {
    console.log("Dry run complete. Nothing was downloaded or installed.");
    return;
  }

  const tempDirectory = await installRelease(release, {
    keepTemp: options.keepTemp,
    onProgress: (message) => console.log(message)
  });

  const installedAfter = await readInstalledVersion(installDirectory);
  if (installedAfter !== release.version) {
    throw new Error(
      `Setup closed, but installed version is ${installedAfter || "not detected"}; expected ${release.version}.`
    );
  }

  console.log(`jmoney ${installedAfter} is installed successfully.`);
  if (options.keepTemp) console.log(`Temporary Setup files kept at: ${tempDirectory}`);
}

async function main() {
  if (process.platform !== "win32") {
    throw new Error("jmoney installer supports Windows only.");
  }

  const options = parseArguments(process.argv.slice(2));
  if (options.command === "help") {
    console.log(HELP);
    return;
  }
  if (options.command === "cli-version") {
    console.log(packageJson.version);
    return;
  }
  if (options.command === "status") {
    await showStatus();
    return;
  }
  if (options.command === "versions") {
    const latest = manifest.latest;
    Object.keys(manifest.releases)
      .sort(compareVersions)
      .forEach((version) => console.log(`${version}${version === latest ? " (latest)" : ""}`));
    return;
  }
  if (!["install", "update"].includes(options.command)) {
    throw new Error(`Unknown command: ${options.command}\n\n${HELP}`);
  }
  await runInstall(options);
}

main().catch((error) => {
  console.error(`jmoney installer: ${error.message}`);
  process.exitCode = 1;
});
