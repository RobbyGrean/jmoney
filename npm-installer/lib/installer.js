"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { pipeline } = require("node:stream/promises");

const APP_DIRECTORY = "ReimbursementDocApp";
const VERSION_FILE = "VERSION.txt";

function normalizeVersion(value) {
  const match = String(value || "").trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid app version: ${value}`);
  }
  return `${Number(match[1])}.${Number(match[2])}.${Number(match[3])}`;
}

function compareVersions(left, right) {
  const a = normalizeVersion(left).split(".").map(Number);
  const b = normalizeVersion(right).split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] < b[index] ? -1 : 1;
  }
  return 0;
}

function resolveRelease(manifest, requestedVersion) {
  if (!manifest || manifest.schemaVersion !== 1 || !manifest.releases) {
    throw new Error("Unsupported or invalid release manifest.");
  }
  const version = normalizeVersion(requestedVersion || manifest.latest);
  const release = manifest.releases[version];
  if (!release) {
    const available = Object.keys(manifest.releases).sort(compareVersions).join(", ");
    throw new Error(`App version ${version} is not available. Available: ${available}`);
  }
  if (!/^https:\/\//i.test(release.url)) {
    throw new Error(`Release ${version} does not use HTTPS.`);
  }
  if (!/^[a-f0-9]{64}$/i.test(release.sha256)) {
    throw new Error(`Release ${version} has an invalid SHA-256 value.`);
  }
  return { version, ...release };
}

function getInstallDirectory(environment = process.env) {
  if (!environment.LOCALAPPDATA) {
    throw new Error("LOCALAPPDATA is not available. jmoney can only be installed on Windows.");
  }
  return path.join(environment.LOCALAPPDATA, APP_DIRECTORY);
}

async function readInstalledVersion(installDirectory) {
  try {
    const value = await fsp.readFile(path.join(installDirectory, VERSION_FILE), "utf8");
    return normalizeVersion(value);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`Could not read the installed version: ${error.message}`);
  }
}

function openHttps(url, redirectsRemaining = 5) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "@robbygrean/jmoney-installer",
          Accept: "application/octet-stream"
        }
      },
      (response) => {
        const status = response.statusCode || 0;
        if (status >= 300 && status < 400 && response.headers.location) {
          response.resume();
          if (redirectsRemaining <= 0) {
            reject(new Error("Too many download redirects."));
            return;
          }
          const redirected = new URL(response.headers.location, url);
          if (redirected.protocol !== "https:") {
            reject(new Error("Download redirect did not use HTTPS."));
            return;
          }
          resolve(openHttps(redirected.href, redirectsRemaining - 1));
          return;
        }
        if (status !== 200) {
          response.resume();
          reject(new Error(`Download failed with HTTP ${status}.`));
          return;
        }
        resolve(response);
      }
    );
    request.setTimeout(30_000, () => request.destroy(new Error("Download timed out.")));
    request.on("error", reject);
  });
}

async function sha256(filePath) {
  const hash = crypto.createHash("sha256");
  await pipeline(fs.createReadStream(filePath), hash);
  return hash.digest("hex");
}

async function downloadAndVerify(release, destination) {
  const response = await openHttps(release.url);
  await pipeline(response, fs.createWriteStream(destination, { flags: "wx" }));

  const stat = await fsp.stat(destination);
  if (Number.isInteger(release.size) && stat.size !== release.size) {
    throw new Error(
      `Downloaded size mismatch: expected ${release.size} bytes, received ${stat.size} bytes.`
    );
  }

  const actualHash = await sha256(destination);
  if (actualHash.toLowerCase() !== release.sha256.toLowerCase()) {
    throw new Error(
      `SHA-256 mismatch. Expected ${release.sha256.toLowerCase()}, received ${actualHash.toLowerCase()}.`
    );
  }
}

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      windowsHide: false,
      shell: false,
      ...options
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${path.basename(command)} stopped with signal ${signal}.`));
      } else if (code !== 0) {
        reject(new Error(`${path.basename(command)} exited with code ${code}.`));
      } else {
        resolve();
      }
    });
  });
}

async function extractInstaller(zipPath, destination) {
  await fsp.mkdir(destination, { recursive: true });
  await runProcess(
    "powershell.exe",
    [
      "-NoLogo",
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "Expand-Archive -LiteralPath $env:JMONEY_INSTALLER_ZIP -DestinationPath $env:JMONEY_INSTALLER_DIR -Force"
    ],
    {
      env: {
        ...process.env,
        JMONEY_INSTALLER_ZIP: zipPath,
        JMONEY_INSTALLER_DIR: destination
      },
      windowsHide: true
    }
  );
}

function resolveSetupPath(extractDirectory, relativeSetupPath) {
  if (!relativeSetupPath || path.isAbsolute(relativeSetupPath)) {
    throw new Error("Release manifest contains an invalid Setup path.");
  }
  const root = path.resolve(extractDirectory);
  const setup = path.resolve(root, relativeSetupPath);
  const relative = path.relative(root, setup);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Release manifest Setup path escapes the extraction directory.");
  }
  return setup;
}

async function launchSetup(setupPath) {
  await fsp.access(setupPath, fs.constants.R_OK);
  await runProcess(setupPath, [], { cwd: path.dirname(setupPath) });
}

async function installRelease(release, options = {}) {
  const tempDirectory = await fsp.mkdtemp(path.join(os.tmpdir(), "jmoney-installer-"));
  const zipPath = path.join(tempDirectory, `jmoney-${release.version}.zip`);
  const extractDirectory = path.join(tempDirectory, "setup");
  try {
    options.onProgress?.(`Downloading jmoney ${release.version}...`);
    await downloadAndVerify(release, zipPath);
    options.onProgress?.("SHA-256 verified.");
    await extractInstaller(zipPath, extractDirectory);
    const setupPath = resolveSetupPath(extractDirectory, release.setupPath);
    options.onProgress?.("Opening jmoney Setup...");
    await launchSetup(setupPath);
    return tempDirectory;
  } finally {
    if (!options.keepTemp) {
      await fsp.rm(tempDirectory, { recursive: true, force: true }).catch(() => {});
    }
  }
}

module.exports = {
  compareVersions,
  downloadAndVerify,
  getInstallDirectory,
  installRelease,
  normalizeVersion,
  readInstalledVersion,
  resolveRelease,
  resolveSetupPath,
  sha256
};
