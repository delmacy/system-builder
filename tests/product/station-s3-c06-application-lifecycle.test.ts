import assert from "node:assert/strict";
import test from "node:test";
import { createApplicationManifest } from "../../packages/station-application/index";
import { reopenApplicationSnapshot, snapshotApplication } from "../../packages/station-application/lifecycle";

const manifest = createApplicationManifest({ id: "application.orders", componentRegistryRef: "registry.station", tools: [{ ref: "tool.orders", toolId: "orders" }], contributions: [{ ref: "contribution.orders", toolRef: "tool.orders", toolId: "orders" }] });
const current = { applicationId: manifest.id, versionRef: "version.1", revisionRef: "revision.3" } as const;

test("C06B snapshot and same-revision reopen round-trip deterministically", () => {
  const snapshot = snapshotApplication(manifest, current);
  const reopened = reopenApplicationSnapshot(snapshot, current);
  assert.deepEqual(reopened, manifest);
  assert.deepEqual(reopenApplicationSnapshot(snapshot, current), reopened);
  assert.deepEqual(snapshotApplication(reopened, current), snapshot);
  assert.ok(Object.isFrozen(snapshot));
  assert.ok(Object.isFrozen(snapshot.lifecycle));
  assert.ok(Object.isFrozen(reopened));
});

test("C06B rejects stale, malformed, ambiguous, unknown, and incompatible lifecycle refs", () => {
  const snapshot = snapshotApplication(manifest, current);
  for (const ref of [{ ...current, versionRef: "version.0" }, { ...current, revisionRef: "revision.2" }, { ...current, revisionRef: "   " }, { ...current, revisionRef: "version.1" }, { ...current, applicationId: "application.unknown" }]) assert.throws(() => reopenApplicationSnapshot(snapshot, ref));
  assert.throws(() => snapshotApplication(manifest, { ...current, applicationId: "application.other" }));
});

test("C06B rejection has zero partial mutation and does not strengthen authority", () => {
  const snapshot = snapshotApplication(manifest, current);
  const before = structuredClone(snapshot);
  assert.throws(() => reopenApplicationSnapshot(snapshot, { ...current, revisionRef: "revision.stale" }));
  assert.deepEqual(snapshot, before);
  const lifecycle = snapshot as unknown as Record<string, unknown>;
  for (const forbidden of ["commandId", "targetRef", "execute", "authorized", "businessResult", "businessCurrent", "provider", "storage", "persist", "effective"]) assert.equal(forbidden in lifecycle, false);
});
