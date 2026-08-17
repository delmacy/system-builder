import assert from "node:assert/strict";
import test from "node:test";
import { assembleSystemDefinition } from "../../packages/assembly/index.js";
import { SoftwareCatalogRegistry, resolveCatalogCandidates } from "../../packages/catalog/index.js";
import { PostgresCatalogRecordStorage } from "../../packages/catalog/postgres.js";

const postgresUrl = process.env.SYSTEM_BUILDER_TEST_POSTGRES_URL;

test(
  "postgres catalog provider persists normalized records across provider reconstruction",
  { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false },
  async () => {
    assert.ok(postgresUrl);
    const firstStorage = await PostgresCatalogRecordStorage.open(postgresUrl, "task092");
    const firstCatalog = new SoftwareCatalogRegistry(firstStorage);
    const record = firstCatalog.register({
      capability: "workflow.engine",
      provider: "provider-a",
      version: "1.5.0",
      dependencies: ["auth.basic", "storage.session"],
      dependencyRequirements: [
        {
          capability: "storage.session",
          versionConstraint: { kind: "minimum", version: "1.2.0" },
          compatibility: { runtime: "node24", database: "postgres" },
        },
        {
          capability: "auth.basic",
          versionConstraint: { kind: "exact", version: "1.0.0" },
        },
      ],
      compatibility: { runtime: "node24", database: "postgres" },
    });
    await firstStorage.flush();

    const reconstructedStorage = await PostgresCatalogRecordStorage.open(postgresUrl, "task092");
    const reconstructedCatalog = new SoftwareCatalogRegistry(reconstructedStorage);

    assert.deepEqual(reconstructedCatalog.list(), [record]);
    assert.equal(Object.isFrozen(reconstructedCatalog.list()[0]), true);
    assert.deepEqual(reconstructedCatalog.list()[0]?.dependencyRequirements, record.dependencyRequirements);
    assert.throws(
      () =>
        reconstructedCatalog.register({
          capability: "workflow.engine",
          provider: "provider-a",
          version: "1.5.0",
        }),
      /CATALOG_DUPLICATE_IDENTITY:workflow\.engine::provider-a::1\.5\.0/,
    );

    await reconstructedStorage.close();
    await firstStorage.close();
  },
);

test("postgres catalog provider rejects invalid connection configuration without leaking credentials", async () => {
  const connectionString = "postgres://secret-user:super-secret@127.0.0.1:0/system_builder";
  await assert.rejects(
    () => PostgresCatalogRecordStorage.open(connectionString, "task092_failure"),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /^CATALOG_POSTGRES_URL_INVALID$/);
      assert.equal(error.message.includes("secret-user"), false);
      assert.equal(error.message.includes("super-secret"), false);
      assert.equal(error.message.includes(connectionString), false);
      return true;
    },
  );
});

const durableGraphRecords = [
  { capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" },
  {
    capability: "auth.graph",
    provider: "provider-auth-graph",
    version: "1.0.0",
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
    version: "1.1.0",
    compatibility: { runtime: "node24" },
    dependencyRequirements: [
      { capability: "storage.codec", versionConstraint: { kind: "exact" as const, version: "2.0.0" } },
    ],
  },
  { capability: "storage.codec", provider: "provider-codec", version: "2.0.0" },
] as const;

const durableGraphDefinition = {
  definition: "SystemDefinition" as const,
  analysisRef: "analysis:durable-catalog:1",
  recipeRef: "recipe:durable-catalog:1",
  capabilities: [
    { id: "cap-auth-graph", capability: "auth.graph", requirementRefs: ["REQ-1"] },
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
  ],
};

test(
  "reconstructed durable catalog drives unchanged transitive Assembly deterministically",
  { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false },
  async () => {
    assert.ok(postgresUrl);
    const persistedStorage = await PostgresCatalogRecordStorage.open(postgresUrl, "task093_graph");
    const persistedCatalog = new SoftwareCatalogRegistry(persistedStorage);
    for (const record of [...durableGraphRecords].reverse()) persistedCatalog.register(record);
    await persistedStorage.flush();

    const reconstructedStorage = await PostgresCatalogRecordStorage.open(postgresUrl, "task093_graph");
    const reconstructedCatalog = new SoftwareCatalogRegistry(reconstructedStorage);
    const controlCatalog = new SoftwareCatalogRegistry();
    for (const record of durableGraphRecords) controlCatalog.register(record);

    const request = {
      capability: "storage.session",
      versionConstraint: { kind: "minimum" as const, version: "1.0.0" },
      compatibility: { runtime: "node24" },
    };
    assert.deepEqual(
      resolveCatalogCandidates(reconstructedCatalog, request),
      resolveCatalogCandidates(controlCatalog, request),
    );

    const durableAssembly = assembleSystemDefinition(
      durableGraphDefinition,
      "system-definition:durable-catalog:1",
      (resolutionRequest) => resolveCatalogCandidates(reconstructedCatalog, resolutionRequest),
    );
    const controlAssembly = assembleSystemDefinition(
      { ...durableGraphDefinition, capabilities: [...durableGraphDefinition.capabilities].reverse() },
      "system-definition:durable-catalog:1",
      (resolutionRequest) => resolveCatalogCandidates(controlCatalog, resolutionRequest),
    );

    assert.equal(durableAssembly.ok, true);
    assert.equal(controlAssembly.ok, true);
    if (!durableAssembly.ok || !controlAssembly.ok) return;
    assert.deepEqual(durableAssembly.plan, controlAssembly.plan);
    assert.deepEqual(
      durableAssembly.plan.components.map(({ capability, provider, version }) => ({ capability, provider, version })),
      [
        { capability: "auth.graph", provider: "provider-auth-graph", version: "1.0.0" },
        { capability: "storage.codec", provider: "provider-codec", version: "2.0.0" },
        { capability: "storage.session", provider: "provider-session", version: "1.1.0" },
        { capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" },
      ],
    );
    assert.equal(JSON.stringify(reconstructedCatalog.list()).includes(postgresUrl), false);
    assert.equal(JSON.stringify(durableAssembly.plan).includes(postgresUrl), false);

    await reconstructedStorage.close();
    await persistedStorage.close();
  },
);

test(
  "reconstructed durable catalog preserves explicit unresolved transitive Assembly failure",
  { skip: postgresUrl === undefined ? "SYSTEM_BUILDER_TEST_POSTGRES_URL not configured" : false },
  async () => {
    assert.ok(postgresUrl);
    const persistedStorage = await PostgresCatalogRecordStorage.open(postgresUrl, "task093_failure");
    const persistedCatalog = new SoftwareCatalogRegistry(persistedStorage);
    persistedCatalog.register({
      capability: "durable.root",
      provider: "durable-root-provider",
      version: "1.0.0",
      dependencyRequirements: [
        { capability: "missing.dep", versionConstraint: { kind: "minimum", version: "2.0.0" } },
      ],
    });
    await persistedStorage.flush();

    const reconstructedStorage = await PostgresCatalogRecordStorage.open(postgresUrl, "task093_failure");
    const reconstructedCatalog = new SoftwareCatalogRegistry(reconstructedStorage);
    const result = assembleSystemDefinition(
      {
        definition: "SystemDefinition",
        analysisRef: "analysis:durable-catalog:failure",
        recipeRef: "recipe:durable-catalog:failure",
        capabilities: [{ id: "root", capability: "durable.root", requirementRefs: [] }],
      },
      "system-definition:durable-catalog:failure",
      (resolutionRequest) => resolveCatalogCandidates(reconstructedCatalog, resolutionRequest),
    );

    assert.deepEqual(result, {
      ok: false,
      diagnostics: [
        {
          code: "ASSEMBLY_CAPABILITY_UNRESOLVED",
          capability: "missing.dep",
          reason: "CAPABILITY_NOT_FOUND",
          requirements: ["missing.dep|minimum|2.0.0|"],
        },
      ],
    });
    assert.equal(JSON.stringify(result).includes(postgresUrl), false);

    await reconstructedStorage.close();
    await persistedStorage.close();
  },
);
