import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const navbar = readFileSync(
  resolve(process.cwd(), "packages/station-shell/navbar.tsx"),
  "utf8",
);
const host = readFileSync(
  resolve(process.cwd(), "apps/station/web/app/station-foundation-client.tsx"),
  "utf8",
);
const taskbar = readFileSync(
  resolve(process.cwd(), "packages/station-shell/taskbar.tsx"),
  "utf8",
);

test("Station Navbar is source-owned shell chrome with truthful context", () => {
  assert.match(navbar, /data-slot="station-navbar"/);
  assert.match(navbar, /data-slot="station-current-context"/);
  assert.match(navbar, /data-slot="station-core-status"/);
  assert.match(navbar, /System Builder/);
  assert.match(navbar, /Core: Disconnected/);
  assert.match(navbar, /shell\.home/);
  assert.match(navbar, /shell\.search/);
  assert.match(navbar, /shell\.command/);
  assert.match(navbar, /token="settings"/);
});

test("Station composition root derives Navbar context from window runtime only", () => {
  assert.match(host, /<StationNavbar/);
  assert.match(host, /presentation\.shell\.navbarVisible/);
  assert.match(host, /activeDefinition\?\.title \?\? "Desktop"/);
  assert.match(host, /connection="disconnected"/);
  assert.match(host, /onHome=\{\(\) => openApp\("app:welcome"\)\}/);
  assert.match(host, /onSettings=\{\(\) => openApp\("app:settings"\)\}/);
});

test("Station Navbar does not import canonical or execution authorities", () => {
  assert.doesNotMatch(navbar, /station-gateway/);
  assert.doesNotMatch(navbar, /runtime-core/);
  assert.doesNotMatch(navbar, /provider/i);
  assert.doesNotMatch(navbar, /deploy/i);
});


test("Station Taskbar and Launcher project manifests and window runtime only", () => {
  assert.match(taskbar, /data-slot="station-taskbar"/);
  assert.match(taskbar, /data-slot="station-launcher"/);
  assert.match(taskbar, /data-slot="launcher-trigger"/);
  assert.match(taskbar, /data-slot="taskbar-windows"/);
  assert.match(taskbar, /apps\.map/);
  assert.match(taskbar, /windows\.map/);
  assert.match(taskbar, /data-app-ref=\{app\.id\}/);
  assert.match(taskbar, /data-window-active=\{active \? "true" : "false"\}/);
  assert.match(taskbar, /onLaunchApp\(app\.id\)/);
  assert.doesNotMatch(taskbar, /station-gateway|runtime-core|filesystem|process authority|deploy/i);
});

test("Station composition uses desktop-familiar taskbar activation semantics", () => {
  assert.match(host, /<StationTaskbar/);
  assert.match(host, /instance\.lifecycle === "MINIMIZED"/);
  assert.match(host, /isActive\s*\? "MINIMIZE"/);
  assert.match(host, /\? "RESTORE"/);
  assert.match(host, /: "FOCUS"/);
});
