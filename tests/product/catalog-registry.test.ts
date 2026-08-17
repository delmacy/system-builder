import assert from "node:assert/strict";
import test from "node:test";
import { SoftwareCatalogRegistry, catalogIdentity } from "../../packages/catalog/index.js";
import { InMemoryCatalogRecordStorage } from "../../packages/catalog/storage.js";

test("software catalog registers immutable records and lists them deterministically", () => {
  const catalog = new SoftwareCatalogRegistry();
  const second = catalog.register({
    capability: "workflow.engine",
    provider: "provider-b",
    version: "1.0.0",
    dependencies: ["storage.blob", "auth.basic"],
    compatibility: { runtime: "node24", database: "postgres" },
  });
  const first = catalog.register({
    capability: "auth.basic",
    provider: "provider-a",
    version: "1.0.0",
  });

  assert.equal(catalogIdentity(first), "auth.basic::provider-a::1.0.0");
  assert.deepEqual(catalog.list().map((record) => record.capability), ["auth.basic", "workflow.engine"]);
  assert.deepEqual(second.dependencies, ["auth.basic", "storage.blob"]);
  assert.deepEqual(second.compatibility, { database: "postgres", runtime: "node24" });
  assert.equal(Object.isFrozen(second), true);
});

test("software catalog rejects duplicate capability/provider/version identity", () => {
  const catalog = new SoftwareCatalogRegistry();
  const record = { capability: "auth.basic", provider: "provider-a", version: "1.0.0" };
  catalog.register(record);

  assert.throws(() => catalog.register(record), /CATALOG_DUPLICATE_IDENTITY/);
});

test("software catalog preserves registry semantics through replaceable in-memory storage", () => {
  const storage = new InMemoryCatalogRecordStorage();
  const catalog = new SoftwareCatalogRegistry(storage);
  const registered = catalog.register({
    capability: "workflow.engine",
    provider: "provider-a",
    version: "1.2.0",
    dependencies: ["storage.session"],
    dependencyRequirements: [
      {
        capability: "storage.session",
        versionConstraint: { kind: "minimum", version: "1.0.0" },
        compatibility: { runtime: "node24" },
      },
    ],
    compatibility: { runtime: "node24", database: "postgres" },
  });

  assert.equal(storage.has(catalogIdentity(registered)), true);
  assert.deepEqual(storage.values(), catalog.list());
  assert.equal(Object.isFrozen(storage.values()), true);
  assert.equal(Object.isFrozen(catalog.list()), true);
  assert.deepEqual(catalog.list()[0]?.dependencyRequirements, [
    {
      capability: "storage.session",
      versionConstraint: { kind: "minimum", version: "1.0.0" },
      compatibility: { runtime: "node24" },
    },
  ]);

  assert.throws(
    () => catalog.register({ capability: "workflow.engine", provider: "provider-a", version: "1.2.0" }),
    /CATALOG_DUPLICATE_IDENTITY:workflow\.engine::provider-a::1\.2\.0/,
  );
});
