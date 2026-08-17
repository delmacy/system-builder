import assert from "node:assert/strict";
import test from "node:test";
import { SoftwareCatalogRegistry } from "../../packages/catalog/index.js";
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
