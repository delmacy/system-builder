import assert from "node:assert/strict";
import test from "node:test";
import { createProviderBinding, requestProviderExit, substituteProvider } from "../../packages/station-provider-boundary/index";

const candidates = [
  { ref: "provider.alpha", capability: "documents", revisionRef: "revision.2" },
  { ref: "provider.beta", capability: "documents", revisionRef: "revision.7" },
  { ref: "provider.mail", capability: "mail", revisionRef: "revision.1" },
] as const;

const input = { id: "binding.documents", capability: "documents", providerRef: "provider.alpha", providerRevisionRef: "revision.2", portability: "portable" } as const;

test("C07A binds and substitutes compatible providers deterministically", () => {
  const binding = createProviderBinding(input, candidates);
  const reversed = createProviderBinding(input, [...candidates].reverse());
  assert.deepEqual(reversed, binding);
  const substituted = substituteProvider(binding, { providerRef: "provider.beta", providerRevisionRef: "revision.7" }, candidates);
  assert.deepEqual(substituted, { ...binding, providerRef: "provider.beta", providerRevisionRef: "revision.7" });
  assert.strictEqual(substituteProvider(substituted, { providerRef: "provider.beta", providerRevisionRef: "revision.7" }, [...candidates].reverse()), substituted);
  assert.equal(substituted.id, binding.id);
  assert.equal(substituted.capability, binding.capability);
  assert.ok(Object.isFrozen(binding));
  assert.ok(Object.isFrozen(substituted));
});

test("C07A represents exit intent without changing canonical semantic identity", () => {
  const binding = createProviderBinding(input, candidates);
  const exit = requestProviderExit(binding);
  assert.equal(exit.portability, "exit-requested");
  assert.equal(exit.id, binding.id);
  assert.equal(exit.capability, binding.capability);
  assert.strictEqual(requestProviderExit(exit), exit);
});

test("C07A rejects malformed, unknown, stale, ambiguous, duplicate, and incompatible refs without mutation", () => {
  const binding = createProviderBinding(input, candidates);
  const before = structuredClone(binding);
  for (const next of [
    { providerRef: " ", providerRevisionRef: "revision.7" },
    { providerRef: "provider.unknown", providerRevisionRef: "revision.7" },
    { providerRef: "provider.beta", providerRevisionRef: "revision.stale" },
    { providerRef: "provider.mail", providerRevisionRef: "revision.1" },
  ]) assert.throws(() => substituteProvider(binding, next, candidates));
  assert.throws(() => createProviderBinding(input, [...candidates, candidates[0]]));
  assert.throws(() => createProviderBinding(input, [...candidates, { ...candidates[0], revisionRef: "revision.3" }]));
  assert.deepEqual(binding, before);
});

test("C07A boundary does not strengthen runtime, command, persistence, or business authority", () => {
  const binding = createProviderBinding(input, candidates) as unknown as Record<string, unknown>;
  for (const forbidden of ["applicationId", "toolId", "componentRegistryRef", "commandId", "execute", "authorized", "businessResult", "businessCurrent", "runtime", "deploy", "secret", "storage", "persist", "sdk", "endpoint"]) assert.equal(forbidden in binding, false);
});
