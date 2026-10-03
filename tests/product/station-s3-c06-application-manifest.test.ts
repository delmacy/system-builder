import assert from "node:assert/strict";
import test from "node:test";

import { createApplicationManifest } from "../../packages/station-application/index";

const base = {
  id: "application.orders",
  componentRegistryRef: "registry.station",
  tools: [
    { ref: "tool.orders", toolId: "orders" },
    { ref: "tool.inventory", toolId: "inventory" },
  ],
  contributions: [
    { ref: "contribution.orders", toolRef: "tool.orders", toolId: "orders" },
    { ref: "contribution.inventory", toolRef: "tool.inventory", toolId: "inventory" },
  ],
} as const;

test("C06A composes a stable isolated AppManifest deterministically", () => {
  const manifest = createApplicationManifest(base);
  const reordered = createApplicationManifest({ ...base, tools: [...base.tools].reverse(), contributions: [...base.contributions].reverse() });

  assert.deepEqual(manifest, reordered);
  assert.notEqual(manifest.id, manifest.componentRegistryRef);
  assert.ok(manifest.tools.every((tool) => tool.toolId !== manifest.id));
  assert.deepEqual(createApplicationManifest(base), manifest);
  assert.ok(Object.isFrozen(manifest));
  assert.ok(Object.isFrozen(manifest.tools));
  assert.ok(Object.isFrozen(manifest.contributions));
});

test("C06A rejects malformed, duplicate, ambiguous, stale, incompatible, and impersonating refs", () => {
  const rejected = [
    { ...base, id: "   " },
    { ...base, componentRegistryRef: "application.orders" },
    { ...base, tools: [...base.tools, { ref: " tool.orders ", toolId: "other" }] },
    { ...base, tools: [...base.tools, { ref: "tool.other", toolId: " orders " }] },
    { ...base, contributions: [...base.contributions, { ref: " contribution.orders ", toolRef: "tool.orders", toolId: "orders" }] },
    { ...base, contributions: [{ ref: "stale", toolRef: "tool.missing", toolId: "missing" }] },
    { ...base, contributions: [{ ref: "incompatible", toolRef: "tool.orders", toolId: "inventory" }] },
    { ...base, contributions: [{ ref: "application.orders", toolRef: "tool.orders", toolId: "orders" }] },
  ];

  for (const definition of rejected) assert.throws(() => createApplicationManifest(definition));
});

test("C06A rejection cannot partially mutate input and does not strengthen authority", () => {
  const definition = structuredClone(base);
  const before = structuredClone(definition);
  assert.throws(() => createApplicationManifest({ ...definition, contributions: [...definition.contributions, { ref: "bad", toolRef: "missing", toolId: "missing" }] }));
  assert.deepEqual(definition, before);

  const manifest = createApplicationManifest(base) as unknown as Record<string, unknown>;
  for (const forbidden of ["commandId", "targetRef", "execute", "authorized", "businessResult", "currentness", "provider", "storage", "persist", "version"]) {
    assert.equal(forbidden in manifest, false);
  }
});
