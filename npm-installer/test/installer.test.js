"use strict";

const assert = require("node:assert/strict");
const fsp = require("node:fs/promises");
const path = require("node:path");
const test = require("node:test");
const manifest = require("../releases.json");
const {
  compareVersions,
  getInstallDirectory,
  normalizeVersion,
  resolveRelease,
  resolveSetupPath,
  sha256
} = require("../lib/installer");

test("normalizes semantic app versions", () => {
  assert.equal(normalizeVersion("v2.0.0\n"), "2.0.0");
  assert.throws(() => normalizeVersion("2.0"), /Invalid app version/);
});

test("compares semantic app versions numerically", () => {
  assert.equal(compareVersions("2.0.0", "2.0.0"), 0);
  assert.equal(compareVersions("2.0.1", "2.0.0"), 1);
  assert.equal(compareVersions("2.10.0", "2.9.9"), 1);
  assert.equal(compareVersions("1.9.9", "2.0.0"), -1);
});

test("resolves latest and explicit releases", () => {
  const manifest = {
    schemaVersion: 1,
    latest: "2.0.1",
    releases: {
      "2.0.0": {
        url: "https://example.test/2.0.0.zip",
        sha256: "a".repeat(64)
      },
      "2.0.1": {
        url: "https://example.test/2.0.1.zip",
        sha256: "b".repeat(64)
      }
    }
  };
  assert.equal(resolveRelease(manifest).version, "2.0.1");
  assert.equal(resolveRelease(manifest, "v2.0.0").version, "2.0.0");
  assert.throws(() => resolveRelease(manifest, "3.0.0"), /not available/);
});

test("rejects insecure release URLs and invalid hashes", () => {
  assert.throws(
    () =>
      resolveRelease({
        schemaVersion: 1,
        latest: "2.0.0",
        releases: {
          "2.0.0": { url: "http://example.test/app.zip", sha256: "a".repeat(64) }
        }
      }),
    /does not use HTTPS/
  );
});

test("builds the local app data install directory", () => {
  assert.equal(
    getInstallDirectory({ LOCALAPPDATA: "C:\\Users\\Test\\AppData\\Local" }),
    path.join("C:\\Users\\Test\\AppData\\Local", "ReimbursementDocApp")
  );
  assert.throws(() => getInstallDirectory({}), /LOCALAPPDATA/);
});

test("keeps Setup inside the extraction directory", () => {
  const root = path.resolve("C:\\temp\\jmoney");
  assert.equal(
    resolveSetupPath(root, "bundle/ReimbursementDocApp-Setup.exe"),
    path.resolve(root, "bundle/ReimbursementDocApp-Setup.exe")
  );
  assert.throws(() => resolveSetupPath(root, "../outside.exe"), /escapes/);
  assert.throws(() => resolveSetupPath(root, "C:\\outside.exe"), /invalid Setup path/);
});

test("release 2.0.0 matches the manual Installer ZIP byte for byte", async () => {
  const release = resolveRelease(manifest, "2.0.0");
  const manualInstaller = path.resolve(
    __dirname,
    "../../assets/downloads/ReimbursementDocApp-Installer.zip"
  );
  const stat = await fsp.stat(manualInstaller);
  assert.equal(stat.size, release.size);
  assert.equal(await sha256(manualInstaller), release.sha256);
});
