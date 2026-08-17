import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";

function catalogResolver(reverse = false) {
  const records = [
    { capability: "workflow.engine", provider: "provider-b", version: "1.0.0" },
    { capability: "workflow.engine", provider: "provider-a", version: "1.0.0" },
    {
      capability: "auth.basic",
      provider: "provider-auth",
      version: "1.0.0",
      dependencies: ["storage.session"],
      dependencyRequirements: [
        {
          capability: "storage.session",
          versionConstraint: { kind: "minimum" as const, version: "1.0.0" },
          compatibility: { runtime: "node24" },
        },
      ],
    },
    {
      capability: "storage.session",
      provider: "provider-session",
      version: "1.2.0",
      compatibility: { runtime: "node24" },
      dependencyRequirements: [
        {
          capability: "storage.codec",
          versionConstraint: { kind: "exact" as const, version: "2.0.0" },
        },
      ],
    },
    { capability: "storage.codec", provider: "provider-codec", version: "2.0.0" },
  ];
  const catalog = new SoftwareCatalogRegistry();
  for (const record of reverse ? [...records].reverse() : records) catalog.register(record);
  return (request: Parameters<typeof resolveCatalogCandidates>[1]) => resolveCatalogCandidates(catalog, request);
}

const definition = {
  definition: "SystemDefinition" as const,
  analysisRef: "analysis:fixture:1",
  recipeRef: "recipe:fixture:1",
  capabilities: [
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
    { id: "cap-auth", capability: "auth.basic", requirementRefs: ["REQ-1"] },
  ],
};

test("assembly resolves structured dependencies transitively into deterministic AssemblyPlan", () => {
  const first = assembleSystemDefinition(definition, "system-definition:fixture:1", catalogResolver());
  const reversed = assembleSystemDefinition(
    { ...definition, capabilities: [...definition.capabilities].reverse() },
    "system-definition:fixture:1",
    catalogResolver(true),
  );

  assert.equal(first.ok, true);
  assert.equal(reversed.ok, true);
  if (!first.ok || !reversed.ok) return;
  assert.deepEqual(first.plan, reversed.plan);
  assert.match(first.plan.contentHash, /^sha256:[a-f0-9]{64}$/);
  assert.deepEqual(first.plan.components, [
    {
      capability: "auth.basic",
      provider: "provider-auth",
      version: "1.0.0",
      dependencies: ["storage.session"],
    },
    {
      capability: "storage.codec",
      provider: "provider-codec",
      version: "2.0.0",
    },
    {
      capability: "storage.session",
      provider: "provider-session",
      version: "1.2.0",
      dependencies: ["storage.codec"],
    },
    {
      capability: "workflow.engine",
      provider: "provider-a",
      version: "1.0.0",
    },
  ]);
});

test("assembly forwards dependency exact/minimum and compatibility requirements to Catalog resolver", () => {
  const requests: unknown[] = [];
  const catalog = new SoftwareCatalogRegistry();
  catalog.register({
    capability: "root.capability",
    provider: "root-provider",
    version: "1.0.0",
    dependencyRequirements: [
      {
        capability: "storage.session",
        versionConstraint: { kind: "minimum", version: "1.1.0" },
        compatibility: { runtime: "node24" },
      },
    ],
  });
  catalog.register({
    capability: "storage.session",
    provider: "session-provider",
    version: "1.2.0",
    compatibility: { runtime: "node24" },
  });
  const result = assembleSystemDefinition(
    {
      ...definition,
      capabilities: [{ id: "root", capability: "root.capability", requirementRefs: ["REQ-1"] }],
    },
    "system-definition:fixture:forwarding",
    (request) => {
      requests.push(request);
      return resolveCatalogCandidates(catalog, request);
    },
  );
  assert.equal(result.ok, true);
  assert.deepEqual(requests, [
    { capability: "root.capability" },
    {
      capability: "root.capability",
    },
    {
      capability: "storage.session",
      versionConstraint: { kind: "minimum", version: "1.1.0" },
      compatibility: { runtime: "node24" },
    },
  ]);
});

test("assembly coalesces duplicate compatible dependency paths into one component", () => {
  const catalog = new SoftwareCatalogRegistry();
  for (const root of ["root.a", "root.b"]) {
    catalog.register({
      capability: root,
      provider: `${root}.provider`,
      version: "1.0.0",
      dependencyRequirements: [{ capability: "shared.dep" }],
    });
  }
  catalog.register({ capability: "shared.dep", provider: "shared-provider", version: "1.0.0" });
  const resolver = (request: Parameters<typeof resolveCatalogCandidates>[1]) => resolveCatalogCandidates(catalog, request);
  const result = assembleSystemDefinition(
    {
      ...definition,
      capabilities: [
        { id: "b", capability: "root.b", requirementRefs: [] },
        { id: "a", capability: "root.a", requirementRefs: [] },
      ],
    },
    "system-definition:fixture:duplicate",
    resolver,
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.plan.components.filter((component) => component.capability === "shared.dep").length, 1);
});

test("assembly preserves root-only no-dependency predecessor behavior", () => {
  const catalog = new SoftwareCatalogRegistry();
  catalog.register({ capability: "workflow.engine", provider: "provider-b", version: "1.0.0" });
  catalog.register({ capability: "workflow.engine", provider: "provider-a", version: "1.0.0" });
  const result = assembleSystemDefinition(
    {
      ...definition,
      capabilities: [{ id: "workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] }],
    },
    "system-definition:fixture:root-only",
    (request) => resolveCatalogCandidates(catalog, request),
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.plan.components, [
    { capability: "workflow.engine", provider: "provider-a", version: "1.0.0" },
  ]);
});

test("assembly returns explicit diagnostic and no plan when a capability is missing", () => {
  const result = assembleSystemDefinition(
    {
      ...definition,
      capabilities: [{ id: "cap-missing", capability: "storage.blob", requirementRefs: ["REQ-3"] }],
    },
    "system-definition:fixture:missing",
    catalogResolver(),
  );

  assert.deepEqual(result, {
    ok: false,
    diagnostics: [
      {
        code: "ASSEMBLY_CAPABILITY_UNRESOLVED",
        capability: "storage.blob",
        reason: "CAPABILITY_NOT_FOUND",
        requirements: ["storage.blob|any|*|"],
      },
    ],
  });
});

test("assembly propagates incompatible provider diagnostics deterministically", () => {
  const result = assembleSystemDefinition(
    definition,
    "system-definition:fixture:incompatible",
    ({ capability }) => ({
      ok: false,
      diagnostic: { code: "NO_COMPATIBLE_PROVIDER", capability },
    }),
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(
    result.diagnostics.map((diagnostic) => [diagnostic.capability, diagnostic.reason]),
    [
      ["auth.basic", "NO_COMPATIBLE_PROVIDER"],
      ["workflow.engine", "NO_COMPATIBLE_PROVIDER"],
    ],
  );
});

function resolveGraph(records: readonly Parameters<SoftwareCatalogRegistry["register"]>[0][], roots: readonly string[]) {
  const catalog = new SoftwareCatalogRegistry();
  for (const record of records) catalog.register(record);
  return assembleSystemDefinition(
    {
      ...definition,
      capabilities: roots.map((capability, index) => ({ id: `root-${index}`, capability, requirementRefs: [] })),
    },
    "system-definition:fixture:graph-diagnostic",
    (request) => resolveCatalogCandidates(catalog, request),
  );
}

test("assembly fails closed on a dependency cycle with deterministic cycle path", () => {
  const records = [
    {
      capability: "cycle.a",
      provider: "a-provider",
      version: "1.0.0",
      dependencyRequirements: [{ capability: "cycle.b" }],
    },
    {
      capability: "cycle.b",
      provider: "b-provider",
      version: "1.0.0",
      dependencyRequirements: [{ capability: "cycle.a" }],
    },
  ] as const;
  const first = resolveGraph(records, ["cycle.a"]);
  const reversed = resolveGraph([...records].reverse(), ["cycle.a"]);
  assert.deepEqual(first, reversed);
  assert.deepEqual(first, {
    ok: false,
    diagnostics: [
      {
        code: "ASSEMBLY_DEPENDENCY_CYCLE",
        capability: "cycle.a",
        reason: "DEPENDENCY_CYCLE",
        path: ["cycle.a", "cycle.b", "cycle.a"],
      },
    ],
  });
});

test("assembly fails closed when a transitive dependency cannot resolve", () => {
  const result = resolveGraph(
    [
      {
        capability: "root.capability",
        provider: "root-provider",
        version: "1.0.0",
        dependencyRequirements: [
          { capability: "missing.dep", versionConstraint: { kind: "minimum", version: "2.0.0" } },
        ],
      },
    ],
    ["root.capability"],
  );
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.diagnostics, [
    {
      code: "ASSEMBLY_CAPABILITY_UNRESOLVED",
      capability: "missing.dep",
      reason: "CAPABILITY_NOT_FOUND",
      requirements: ["missing.dep|minimum|2.0.0|"],
    },
  ]);
});

test("assembly diagnoses incompatible multi-path exact requirements independent of ordering", () => {
  const records = [
    {
      capability: "root.a",
      provider: "root-a-provider",
      version: "1.0.0",
      dependencyRequirements: [
        { capability: "shared.dep", versionConstraint: { kind: "exact" as const, version: "1.0.0" } },
      ],
    },
    {
      capability: "root.b",
      provider: "root-b-provider",
      version: "1.0.0",
      dependencyRequirements: [
        { capability: "shared.dep", versionConstraint: { kind: "exact" as const, version: "2.0.0" } },
      ],
    },
    { capability: "shared.dep", provider: "shared-provider", version: "1.0.0" },
    { capability: "shared.dep", provider: "shared-provider", version: "2.0.0" },
  ];
  const first = resolveGraph(records, ["root.a", "root.b"]);
  const reversed = resolveGraph([...records].reverse(), ["root.b", "root.a"]);
  assert.deepEqual(first, reversed);
  assert.equal(first.ok, false);
  if (first.ok) return;
  assert.deepEqual(first.diagnostics, [
    {
      code: "ASSEMBLY_REQUIREMENT_CONFLICT",
      capability: "shared.dep",
      reason: "INCOMPATIBLE_EXACT_VERSIONS",
      requirements: ["shared.dep|exact|1.0.0|", "shared.dep|exact|2.0.0|"],
    },
  ]);
});

test("assembly diagnoses incompatible compatibility requirements deterministically", () => {
  const result = resolveGraph(
    [
      {
        capability: "root.a",
        provider: "root-a-provider",
        version: "1.0.0",
        dependencyRequirements: [{ capability: "shared.dep", compatibility: { runtime: "node22" } }],
      },
      {
        capability: "root.b",
        provider: "root-b-provider",
        version: "1.0.0",
        dependencyRequirements: [{ capability: "shared.dep", compatibility: { runtime: "node24" } }],
      },
      { capability: "shared.dep", provider: "shared-provider", version: "1.0.0", compatibility: { runtime: "node24" } },
    ],
    ["root.b", "root.a"],
  );
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.diagnostics, [
    {
      code: "ASSEMBLY_REQUIREMENT_CONFLICT",
      capability: "shared.dep",
      reason: "INCOMPATIBLE_COMPATIBILITY:runtime",
      requirements: ["shared.dep|any|*|runtime=node22", "shared.dep|any|*|runtime=node24"],
    },
  ]);
});

test("assembly intersects compatible minimum and exact requirements before selection", () => {
  const result = resolveGraph(
    [
      {
        capability: "root.a",
        provider: "root-a-provider",
        version: "1.0.0",
        dependencyRequirements: [
          { capability: "shared.dep", versionConstraint: { kind: "minimum", version: "1.0.0" } },
        ],
      },
      {
        capability: "root.b",
        provider: "root-b-provider",
        version: "1.0.0",
        dependencyRequirements: [
          { capability: "shared.dep", versionConstraint: { kind: "exact", version: "2.0.0" } },
        ],
      },
      { capability: "shared.dep", provider: "a-provider", version: "1.0.0" },
      { capability: "shared.dep", provider: "b-provider", version: "2.0.0" },
    ],
    ["root.a", "root.b"],
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.plan.components.find((item) => item.capability === "shared.dep"), {
    capability: "shared.dep",
    provider: "b-provider",
    version: "2.0.0",
  });
});
