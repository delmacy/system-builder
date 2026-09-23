import assert from "node:assert/strict";
import test from "node:test";

import {
  COMPONENT_LAB_APP,
  M1_UTILITY_APPS,
  SETTINGS_APP,
  StationAppRegistry,
  WELCOME_APP,
  normalizeAppManifest,
} from "../../packages/station-app-runtime/index.js";

test("M1 utility registry exposes stable app identity independent from display name", () => {
  const registry = new StationAppRegistry(M1_UTILITY_APPS);
  assert.deepEqual(
    registry.list().map((app) => app.id),
    ["app:component-lab", "app:settings", "app:welcome"],
  );
  assert.equal(WELCOME_APP.id, "app:welcome");
  assert.equal(WELCOME_APP.name, "Welcome");
  assert.notEqual(WELCOME_APP.id, WELCOME_APP.name);
  assert.equal(SETTINGS_APP.windows[0]!.appRef, SETTINGS_APP.id);
});

test("registry rejects duplicate app identity deterministically", () => {
  const registry = new StationAppRegistry([WELCOME_APP]);
  assert.throws(() => registry.register(WELCOME_APP), /duplicate app manifest id: app:welcome/);
});

test("manifest validation rejects unsupported authority-shaped fields", () => {
  assert.throws(
    () => normalizeAppManifest({ ...WELCOME_APP, capabilityAuthority: "workflow.admin" }),
    /app manifest contains unsupported field: capabilityAuthority/,
  );
  assert.throws(
    () => normalizeAppManifest({ ...WELCOME_APP, deploymentState: "ACTIVE" }),
    /app manifest contains unsupported field: deploymentState/,
  );
});

test("window definitions must remain scoped to their owning app identity", () => {
  assert.throws(
    () =>
      normalizeAppManifest({
        ...WELCOME_APP,
        windows: [{ ...WELCOME_APP.windows[0]!, appRef: "app:other" }],
      }),
    /does not match app app:welcome/,
  );
});

test("launch maps manifests into provider-neutral WindowDefinitions", () => {
  const registry = new StationAppRegistry(M1_UTILITY_APPS);
  const launch = registry.launch("app:settings");
  assert.equal(launch.appRef, "app:settings");
  assert.equal(launch.windowDefinitions.length, 1);
  assert.equal(launch.windowDefinitions[0]!.id, "settings");
  assert.equal(launch.windowDefinitions[0]!.title, "Settings");
  assert.equal("deployment" in launch.windowDefinitions[0]!, false);
  assert.equal("capability" in launch.windowDefinitions[0]!, false);
});

test("utility tools are discoverable without granting business authority", () => {
  const registry = new StationAppRegistry(M1_UTILITY_APPS);
  const tools = registry.listTools();
  assert.equal(tools.length, 1);
  assert.equal(tools[0]!.appRef, COMPONENT_LAB_APP.id);
  assert.equal(tools[0]!.tool.id, "tool:component-lab:inspector");
  assert.deepEqual(tools[0]!.tool.supportedSurfaces, ["component-lab"]);
  assert.equal("permissions" in tools[0]!.tool, false);
  assert.equal("authority" in tools[0]!.tool, false);
});

test("launch policy can make app windows multi-instance without changing manifest identity", () => {
  const registry = new StationAppRegistry([
    {
      ...WELCOME_APP,
      id: "app:scratch",
      name: "Scratch",
      launchPolicy: "MULTI_INSTANCE",
      windows: [
        {
          ...WELCOME_APP.windows[0]!,
          id: "scratch",
          appRef: "app:scratch",
          title: "Scratch",
        },
      ],
    },
  ]);

  const launch = registry.launch("app:scratch");
  assert.equal(launch.windowDefinitions[0]!.multiInstance, true);
  assert.equal(launch.appRef, "app:scratch");
});
