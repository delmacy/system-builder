import assert from "node:assert/strict";
import test from "node:test";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";

function makeCatalog(order: "ab" | "ba"): SoftwareCatalogRegistry {
  const catalog = new SoftwareCatalogRegistry();
  const records = [
    {
      capability: "workflow.engine",
      provider: "provider-a",
      version: "1.0.0",
      compatibility: { runtime: "node24" },
    },
    {
      capability: "workflow.engine",
      provider: "provider-b",
      version: "1.0.0",
      compatibility: { runtime: "node24" },
    },
  ] as const;
  for (const index of order === "ab" ? [0, 1] : [1, 0]) catalog.register(records[index]!);
  return catalog;
}

function makeVersionCatalog(order: "forward" | "reverse"): SoftwareCatalogRegistry {
  const catalog = new SoftwareCatalogRegistry();
  const records = [
    {
      capability: "workflow.engine",
      provider: "provider-a",
      version: "1.0.0",
      compatibility: { runtime: "node24" },
    },
    {
      capability: "workflow.engine",
      provider: "provider-b",
      version: "1.5.0",
      compatibility: { runtime: "node24" },
    },
    {
      capability: "workflow.engine",
      provider: "provider-c",
      version: "2.0.0",
      compatibility: { runtime: "node24", tier: "pro" },
    },
  ] as const;
  const indices = order === "forward" ? [0, 1, 2] : [2, 1, 0];
  for (const index of indices) catalog.register(records[index]!);
  return catalog;
}

test("catalog normalizes structured dependency requirements deterministically", () => {
  const first = new SoftwareCatalogRegistry().register({
    capability: "auth.basic",
    provider: "provider-auth",
    version: "1.0.0",
    dependencies: ["storage.session"],
    dependencyRequirements: [
      {
        capability: "storage.session",
        versionConstraint: { kind: "minimum", version: "1.2.0" },
        compatibility: { runtime: "node24", region: "any" },
      },
      {
        capability: "auth.token",
        versionConstraint: { kind: "exact", version: "2.0.0" },
      },
    ],
  });
  const second = new SoftwareCatalogRegistry().register({
    capability: "auth.basic",
    provider: "provider-auth",
    version: "1.0.0",
    dependencies: ["storage.session"],
    dependencyRequirements: [
      {
        capability: "auth.token",
        versionConstraint: { kind: "exact", version: "2.0.0" },
      },
      {
        capability: "storage.session",
        compatibility: { region: "any", runtime: "node24" },
        versionConstraint: { kind: "minimum", version: "1.2.0" },
      },
    ],
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first.dependencies, ["storage.session"]);
  assert.deepEqual(first.dependencyRequirements, [
    {
      capability: "auth.token",
      versionConstraint: { kind: "exact", version: "2.0.0" },
      compatibility: {},
    },
    {
      capability: "storage.session",
      versionConstraint: { kind: "minimum", version: "1.2.0" },
      compatibility: { region: "any", runtime: "node24" },
    },
  ]);
  assert.equal(Object.isFrozen(first.dependencyRequirements), true);
  assert.equal(Object.isFrozen(first.dependencyRequirements[0]), true);
  assert.equal(Object.isFrozen(first.dependencyRequirements[1]?.compatibility), true);
});

test("catalog rejects invalid structured dependency tokens explicitly", () => {
  assert.throws(
    () =>
      new SoftwareCatalogRegistry().register({
        capability: "auth.basic",
        provider: "provider-auth",
        version: "1.0.0",
        dependencyRequirements: [{ capability: "   " }],
      }),
    /CATALOG_INVALID_DEPENDENCY_CAPABILITY/,
  );
  assert.throws(
    () =>
      new SoftwareCatalogRegistry().register({
        capability: "auth.basic",
        provider: "provider-auth",
        version: "1.0.0",
        dependencyRequirements: [
          { capability: "storage.session", versionConstraint: { kind: "minimum", version: " " } },
        ],
      }),
    /CATALOG_INVALID_DEPENDENCY_VERSION/,
  );
  assert.throws(
    () =>
      new SoftwareCatalogRegistry().register({
        capability: "auth.basic",
        provider: "provider-auth",
        version: "1.0.0",
        dependencyRequirements: [{ capability: "storage.session", compatibility: { " ": "node24" } }],
      }),
    /CATALOG_INVALID_COMPATIBILITY_KEY/,
  );
});

test("catalog resolution is provider-neutral and deterministic across registration order", () => {
  const first = resolveCatalogCandidates(makeCatalog("ab"), {
    capability: "workflow.engine",
    version: "1.0.0",
    compatibility: { runtime: "node24" },
  });
  const second = resolveCatalogCandidates(makeCatalog("ba"), {
    capability: "workflow.engine",
    version: "1.0.0",
    compatibility: { runtime: "node24" },
  });

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;
  assert.deepEqual(first.candidates.map((candidate) => candidate.provider), ["provider-a", "provider-b"]);
  assert.deepEqual(first, second);
});

test("catalog exact version constraint returns only the exact normalized version", () => {
  const result = resolveCatalogCandidates(makeVersionCatalog("forward"), {
    capability: "workflow.engine",
    versionConstraint: { kind: "exact", version: "1.5.0" },
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.candidates.map((candidate) => candidate.provider), ["provider-b"]);
});

test("catalog minimum version constraint composes with compatibility deterministically", () => {
  const first = resolveCatalogCandidates(makeVersionCatalog("forward"), {
    capability: "workflow.engine",
    versionConstraint: { kind: "minimum", version: "1.5.0" },
  });
  const reversed = resolveCatalogCandidates(makeVersionCatalog("reverse"), {
    capability: "workflow.engine",
    versionConstraint: { kind: "minimum", version: "1.5.0" },
  });
  assert.equal(first.ok, true);
  assert.equal(reversed.ok, true);
  if (!first.ok || !reversed.ok) return;
  assert.deepEqual(first.candidates.map((candidate) => candidate.provider), ["provider-b", "provider-c"]);
  assert.deepEqual(first, reversed);

  const compatible = resolveCatalogCandidates(makeVersionCatalog("reverse"), {
    capability: "workflow.engine",
    versionConstraint: { kind: "minimum", version: "1.5.0" },
    compatibility: { tier: "pro" },
  });
  assert.equal(compatible.ok, true);
  if (!compatible.ok) return;
  assert.deepEqual(compatible.candidates.map((candidate) => candidate.provider), ["provider-c"]);
});

test("catalog reports an unsatisfied bounded version constraint reproducibly", () => {
  const result = resolveCatalogCandidates(makeVersionCatalog("forward"), {
    capability: "workflow.engine",
    versionConstraint: { kind: "minimum", version: "3.0.0" },
  });
  assert.deepEqual(result, {
    ok: false,
    diagnostic: {
      code: "NO_COMPATIBLE_PROVIDER",
      capability: "workflow.engine",
      requestedConstraint: "minimum:3.0.0",
    },
  });
});

test("catalog version constraints reject malformed requested and candidate versions", () => {
  assert.throws(
    () =>
      resolveCatalogCandidates(makeVersionCatalog("forward"), {
        capability: "workflow.engine",
        versionConstraint: { kind: "minimum", version: "1.2" },
      }),
    /CATALOG_INVALID_CONSTRAINT_VERSION:1\.2/,
  );

  const malformed = new SoftwareCatalogRegistry();
  malformed.register({ capability: "workflow.engine", provider: "provider-malformed", version: "v1" });
  assert.throws(
    () =>
      resolveCatalogCandidates(malformed, {
        capability: "workflow.engine",
        versionConstraint: { kind: "minimum", version: "1.0.0" },
      }),
    /CATALOG_INVALID_CANDIDATE_VERSION:v1/,
  );
});

test("catalog rejects simultaneous legacy exact version and bounded constraint", () => {
  assert.throws(
    () =>
      resolveCatalogCandidates(makeVersionCatalog("forward"), {
        capability: "workflow.engine",
        version: "1.5.0",
        versionConstraint: { kind: "exact", version: "1.5.0" },
      }),
    /CATALOG_CONFLICTING_VERSION_REQUEST/,
  );
});

test("catalog resolution reports missing capability explicitly", () => {
  const result = resolveCatalogCandidates(makeCatalog("ab"), { capability: "storage.blob" });
  assert.deepEqual(result, {
    ok: false,
    diagnostic: { code: "CAPABILITY_NOT_FOUND", capability: "storage.blob" },
  });
});

test("catalog resolution reports incompatible constraints explicitly", () => {
  const result = resolveCatalogCandidates(makeCatalog("ab"), {
    capability: "workflow.engine",
    version: "2.0.0",
  });
  assert.deepEqual(result, {
    ok: false,
    diagnostic: {
      code: "NO_COMPATIBLE_PROVIDER",
      capability: "workflow.engine",
      requestedVersion: "2.0.0",
    },
  });
});
