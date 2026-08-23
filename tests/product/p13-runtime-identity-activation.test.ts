import assert from "node:assert/strict";
import test from "node:test";
import type { EnvironmentProfile } from "../../packages/contracts/environment-profile/index.js";
import { InMemorySecretResolver, resolveRuntimeSecretEnvironment } from "../../packages/deploy/secret-resolver.js";

const profile: EnvironmentProfile = Object.freeze({
  kind: "EnvironmentProfile",
  environmentRef: "environment:p13-auth",
  runtimeVersions: Object.freeze(["0.1.0"]),
  bindings: Object.freeze([
    Object.freeze({ name: "AUTH_PROVIDER", kind: "secret-reference", reference: "secret://AUTH_PROVIDER" }),
  ]),
});

test("authentication provider binding is resolved only at activation boundary", () => {
  const secretValue = "runtime-auth-verifier-value";
  const resolved = resolveRuntimeSecretEnvironment(profile, new InMemorySecretResolver({ "secret://AUTH_PROVIDER": secretValue }));
  assert.deepEqual(resolved, { AUTH_PROVIDER: secretValue });
  assert.equal(JSON.stringify(profile).includes(secretValue), false);
});

test("missing authentication provider binding fails closed without value leakage", () => {
  assert.throws(
    () => resolveRuntimeSecretEnvironment(profile, new InMemorySecretResolver({})),
    (error: unknown) => error instanceof Error
      && error.message === "SECRET_REFERENCE_NOT_FOUND:secret://AUTH_PROVIDER"
      && !error.message.includes("runtime-auth-verifier-value"),
  );
});

test("authentication binding remains an existing secret-reference contract", () => {
  const binding = profile.bindings[0];
  assert.ok(binding);
  assert.equal(binding.name, "AUTH_PROVIDER");
  assert.equal(binding.kind, "secret-reference");
  assert.equal(binding.reference, "secret://AUTH_PROVIDER");
});
