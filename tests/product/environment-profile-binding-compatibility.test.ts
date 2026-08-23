import assert from "node:assert/strict";
import test from "node:test";
import { environmentProfileSchema, type EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";

type Schema = Readonly<{ properties?: Readonly<Record<string, Schema>>; items?: Schema; enum?: readonly unknown[]; additionalProperties?: boolean }>;

function bindingSchema(): Schema {
  const schema = environmentProfileSchema as Schema;
  return schema.properties?.bindings?.items ?? {};
}

test("EnvironmentProfile keeps historical reference-only bindings compatible", () => {
  const profile: EnvironmentProfile = { kind: "EnvironmentProfile", environmentRef: "env:test", runtimeVersions: ["1"], bindings: [{ name: "DATABASE_URL", kind: "secret-reference", reference: "secret://database" }] };
  assert.equal(profile.bindings[0]?.reference, "secret://database");
  assert.equal(profile.bindings[0]?.requirementKind, undefined);
});

test("EnvironmentProfile exposes only bounded requirementKind classification metadata", () => {
  assert.deepEqual(bindingSchema().properties?.requirementKind?.enum, ["config", "secret-reference", "external-service", "storage", "database"]);
  const storage: EnvironmentProfile = { kind: "EnvironmentProfile", environmentRef: "env:test", runtimeVersions: ["1"], bindings: [{ name: "storage:files", kind: "config", reference: "env://STORAGE_ROOT", requirementKind: "storage" }] };
  const service: EnvironmentProfile = { kind: "EnvironmentProfile", environmentRef: "env:test", runtimeVersions: ["1"], bindings: [{ name: "service:notify", kind: "config", reference: "env://NOTIFY_URL", requirementKind: "external-service" }] };
  assert.equal(storage.bindings[0]?.requirementKind, "storage");
  assert.equal(service.bindings[0]?.requirementKind, "external-service");
});

test("EnvironmentProfile binding shape remains value-free and provider-neutral", () => {
  const properties = bindingSchema().properties ?? {};
  assert.equal(bindingSchema().additionalProperties, false);
  assert.equal("value" in properties, false);
  assert.equal("endpoint" in properties, false);
  assert.equal("token" in properties, false);
  assert.equal("provider" in properties, false);
  assert.deepEqual(properties.kind?.enum, ["config", "secret-reference"]);
});
