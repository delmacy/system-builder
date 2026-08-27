import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
  normalizeProviderSecretReferenceDescriptor,
} from "../../packages/contracts/ai-gateway/provider-secret-reference.js";

test("provider secret reference remains portable and reference-only", () => {
  assert.deepEqual(normalizeProviderSecretReferenceDescriptor({
    contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
    secretRef: "secret-ref:model-provider-primary",
  }), {
    contractVersion: "1.0.0",
    secretRef: "secret-ref:model-provider-primary",
  });
});

test("provider secret reference rejects embedded credential-like value fields fail closed", () => {
  for (const [field, value] of [
    ["value", "sk-example"],
    ["secret", "sk-example"],
    ["token", "token-example"],
    ["apiKey", "key-example"],
    ["credential", "credential-example"],
  ] as const) {
    assert.throws(() => normalizeProviderSecretReferenceDescriptor({
      contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
      secretRef: "secret-ref:model-provider-primary",
      [field]: value,
    }), new RegExp(`unexpected field ${field}`));
  }
});

test("provider secret reference rejects malformed or value-shaped references", () => {
  assert.throws(() => normalizeProviderSecretReferenceDescriptor(null), /must be an object/);
  assert.throws(() => normalizeProviderSecretReferenceDescriptor({
    contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
    secretRef: "",
  }), /non-empty string/);
  assert.throws(() => normalizeProviderSecretReferenceDescriptor({
    contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
    secretRef: "sk-this-is-not-a-reference",
  }), /must use the secret-ref:/);
  assert.throws(() => normalizeProviderSecretReferenceDescriptor({
    contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
    secretRef: "secret-ref:contains whitespace",
  }), /must not contain whitespace/);
  assert.throws(() => normalizeProviderSecretReferenceDescriptor({
    contractVersion: "2.0.0",
    secretRef: "secret-ref:model-provider-primary",
  }), /unsupported AI Gateway provider secret reference contract version/);
});

test("provider secret reference defines no lookup, lifecycle, provider selection or authority semantics", () => {
  const descriptor = normalizeProviderSecretReferenceDescriptor({
    contractVersion: AI_GATEWAY_PROVIDER_SECRET_REFERENCE_VERSION,
    secretRef: "secret-ref:model-provider-primary",
  });
  for (const forbidden of [
    "value",
    "secret",
    "token",
    "apiKey",
    "credential",
    "providerId",
    "store",
    "lookup",
    "rotation",
    "revocation",
    "approved",
    "authorized",
  ]) {
    assert.equal(forbidden in descriptor, false);
  }
});
