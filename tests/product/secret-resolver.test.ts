import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import {
  FileBackedSecretResolver,
  InMemorySecretResolver,
  ProcessEnvironmentSecretResolver,
  resolveRuntimeSecretEnvironment,
  type SecretResolver,
} from "../../packages/deploy/secret-resolver.js";

const environment: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "environment:secret-resolver-test",
  runtimeVersions: Object.freeze(["0.1.0"]),
  bindings: Object.freeze([
    Object.freeze({ name: "Z_SECRET", kind: "secret-reference", reference: "secret://z" }),
    Object.freeze({ name: "LOG_LEVEL", kind: "config", reference: "config://log-level" }),
    Object.freeze({ name: "A_SECRET", kind: "secret-reference", reference: "secret://a" }),
  ]),
});

test("external SecretResolver resolves only symbolic secret references into deterministic runtime-only environment", () => {
  const before = JSON.stringify(environment);
  const resolver = new InMemorySecretResolver({
    "secret://z": "runtime-secret-z",
    "secret://a": "runtime-secret-a",
  });

  const resolved = resolveRuntimeSecretEnvironment(environment, resolver);

  assert.deepEqual(resolved, {
    A_SECRET: "runtime-secret-a",
    Z_SECRET: "runtime-secret-z",
  });
  assert.deepEqual(Object.keys(resolved), ["A_SECRET", "Z_SECRET"]);
  assert.equal("LOG_LEVEL" in resolved, false);
  assert.equal(JSON.stringify(environment), before);
});

test("in-memory SecretResolver serialization exposes references but never stored values", () => {
  const secretValue = "postgres://runtime-user:runtime-password@localhost/runtime";
  const resolver = new InMemorySecretResolver({ "secret://database-url": secretValue });
  const serialized = JSON.stringify(resolver);

  assert.equal(serialized.includes("secret://database-url"), true);
  assert.equal(serialized.includes(secretValue), false);
});

test("secret resolution fails closed for missing, empty and duplicate bindings without leaking a resolved value", () => {
  const secretValue = "must-not-leak";
  const missing = new InMemorySecretResolver({});
  assert.throws(
    () => resolveRuntimeSecretEnvironment(environment, missing),
    (error: unknown) => error instanceof Error && error.message === "SECRET_REFERENCE_NOT_FOUND:secret://a" && !error.message.includes(secretValue),
  );

  const emptyResolver: SecretResolver = Object.freeze({ resolve: () => "" });
  assert.throws(
    () => resolveRuntimeSecretEnvironment(environment, emptyResolver),
    /SECRET_RESOLUTION_EMPTY:secret:\/\/a/,
  );

  const duplicateEnvironment: EnvironmentProfile = {
    ...environment,
    bindings: [
      { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://database-a" },
      { name: "DATABASE_URL", kind: "secret-reference", reference: "secret://database-b" },
    ],
  };
  const duplicateResolver = new InMemorySecretResolver({
    "secret://database-a": secretValue,
    "secret://database-b": secretValue,
  });
  assert.throws(
    () => resolveRuntimeSecretEnvironment(duplicateEnvironment, duplicateResolver),
    (error: unknown) => error instanceof Error && error.message === "SECRET_BINDING_DUPLICATE:DATABASE_URL" && !error.message.includes(secretValue),
  );
});

test("process-environment provider resolves references from the running process environment", () => {
  const provider = new ProcessEnvironmentSecretResolver({
    DATABASE_URL: "postgres://process-user:process-password@localhost/runtime",
    LOG_LEVEL: "debug",
  });

  const resolved = provider.resolve("secret://DATABASE_URL");
  assert.equal(resolved, "postgres://process-user:process-password@localhost/runtime");
  assert.equal(JSON.stringify(provider).includes("postgres://process-user:process-password@localhost/runtime"), false);
});

test("file-backed provider reads references from a store file without serializing stored values", () => {
  const secretValue = "postgres://file-user:file-password@localhost/runtime";
  const content = [
    "# generated store",
    "DATABASE_URL=" + secretValue,
    "API_TOKEN=token-file-value",
    "",
  ].join("\n");

  const provider = new FileBackedSecretResolver("secret://store.env", content);

  assert.equal(provider.resolve("secret://DATABASE_URL"), secretValue);
  assert.equal(provider.resolve("secret://API_TOKEN"), "token-file-value");

  const serialized = JSON.stringify(provider);
  assert.equal(serialized.includes(secretValue), false);
  assert.equal(serialized.includes("token-file-value"), false);
  assert.equal(serialized.includes("DATABASE_URL"), true);
  assert.equal(serialized.includes("API_TOKEN"), true);
});

test("file-backed store rejects malformed and duplicate entries without leaking values", () => {
  assert.throws(() => new FileBackedSecretResolver("secret://bad", "=no-name"), /SECRET_STORE_INVALID_LINE/);
  assert.throws(
    () => new FileBackedSecretResolver("secret://bad", "DATABASE_URL=one\nDATABASE_URL=two"),
    /SECRET_BINDING_DUPLICATE:DATABASE_URL/,
  );
});

test("production providers resolve only symbolic secret-reference bindings through resolveRuntimeSecretEnvironment", () => {
  const provider = new ProcessEnvironmentSecretResolver({
    RUNTIME_SECRET: "runtime-env-value",
  });
  const fileProvider = new FileBackedSecretResolver("secret://store.env", "RUNTIME_SECRET=file-backed-value");

  const profile: EnvironmentProfile = Object.freeze({
    kind: "EnvironmentProfile",
    environmentRef: "environment:production-provider-test",
    runtimeVersions: Object.freeze(["0.1.0"]),
    bindings: Object.freeze([
      Object.freeze({ name: "RUNTIME_SECRET", kind: "secret-reference", reference: "secret://RUNTIME_SECRET" }),
      Object.freeze({ name: "LOG_LEVEL", kind: "config", reference: "config://log-level" }),
    ]),
  });

  assert.deepEqual(resolveRuntimeSecretEnvironment(profile, provider), { RUNTIME_SECRET: "runtime-env-value" });
  assert.deepEqual(resolveRuntimeSecretEnvironment(profile, fileProvider), { RUNTIME_SECRET: "file-backed-value" });
});
