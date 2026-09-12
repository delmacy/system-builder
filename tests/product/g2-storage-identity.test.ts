import assert from "node:assert/strict";
import test from "node:test";
import {
  STORAGE_IDENTITY_CONTRACT_VERSION,
  assessCanonicalAvailability,
  identitiesShareIntegrityEvidence,
  normalizeCanonicalStorageIdentity,
} from "../../packages/contracts/storage/storage-identity.js";

const copy = (copyRef: string, overrides: Record<string, unknown> = {}) => ({
  copyRef,
  providerRef: "provider-a",
  providerKey: `bucket/${copyRef}`,
  copyRevisionRef: `${copyRef}:r1`,
  transportAttemptRef: `attempt:${copyRef}:1`,
  integrity: { algorithm: "sha256", digest: "same-content-digest" },
  lifecycle: "ACTIVE",
  availability: "AVAILABLE",
  completeness: "KNOWN",
  currentness: { state: "CURRENT", assessedAt: "2026-09-11T20:00:00Z", validUntil: "2026-09-11T22:00:00Z" },
  ...overrides,
});

const identity = (canonicalObjectRef: string, overrides: Record<string, unknown> = {}) => ({
  contractVersion: STORAGE_IDENTITY_CONTRACT_VERSION,
  canonicalObjectRef,
  canonicalRevisionRef: `${canonicalObjectRef}:r7`,
  objectKind: "DOCUMENT",
  sourceOfTruth: { authorityRef: `authority:${canonicalObjectRef}`, authorityRevisionRef: "authority:r3", providerCopyRef: "copy-primary" },
  providerCopies: [
    copy("copy-primary"),
    copy("copy-replica", { providerRef: "provider-b", providerKey: "replica/shared-key", copyRevisionRef: "copy-replica:r4" }),
  ],
  ...overrides,
});

test("TASK-523 keeps canonical identity independent from provider key, copy and transport identity", () => {
  const normalized = normalizeCanonicalStorageIdentity(identity("document:invoice-001"));
  assert.equal(normalized.canonicalObjectRef, "document:invoice-001");
  assert.equal(normalized.providerCopies.length, 2);
  assert.notEqual(normalized.canonicalObjectRef, normalized.providerCopies[0]!.providerKey);
  assert.notEqual(normalized.canonicalObjectRef, normalized.providerCopies[0]!.copyRef);
  assert.notEqual(normalized.canonicalObjectRef, normalized.providerCopies[0]!.transportAttemptRef);
  assert.equal(assessCanonicalAvailability(normalized, "2026-09-11T21:00:00Z"), "AVAILABLE");
});

test("TASK-523 permits multiple provider copies without collapsing their lifecycle", () => {
  const normalized = normalizeCanonicalStorageIdentity(identity("media:asset-7", {
    providerCopies: [
      copy("copy-primary"),
      copy("copy-residual", { providerRef: "provider-old", lifecycle: "RESIDUAL", availability: "AVAILABLE" }),
      copy("copy-disposed", { providerRef: "provider-retired", lifecycle: "DISPOSED", availability: "UNAVAILABLE" }),
    ],
  }));
  assert.deepEqual(normalized.providerCopies.map((entry) => entry.lifecycle), ["ACTIVE", "RESIDUAL", "DISPOSED"]);
});

test("TASK-523 treats equal provider keys or hashes as evidence, never canonical identity authority", () => {
  const first = normalizeCanonicalStorageIdentity(identity("object:a", {
    providerCopies: [copy("copy-primary", { providerKey: "shared/key" })],
  }));
  const second = normalizeCanonicalStorageIdentity(identity("object:b", {
    sourceOfTruth: { authorityRef: "authority:object:b", authorityRevisionRef: "authority:r9", providerCopyRef: "copy-other" },
    providerCopies: [copy("copy-other", { providerKey: "shared/key" })],
  }));
  assert.equal(identitiesShareIntegrityEvidence(first, second), true);
  assert.equal(first.providerCopies[0]!.providerKey, second.providerCopies[0]!.providerKey);
  assert.notEqual(first.canonicalObjectRef, second.canonicalObjectRef);
  assert.notEqual(first.sourceOfTruth.authorityRef, second.sourceOfTruth.authorityRef);
});

test("TASK-523 refuses to infer source of truth from an arbitrary provider copy", () => {
  assert.throws(() => normalizeCanonicalStorageIdentity(identity("document:no-source", {
    sourceOfTruth: { authorityRef: "authority:document:no-source", authorityRevisionRef: "authority:r1", providerCopyRef: "copy-not-listed" },
  })), /declared provider source of truth/);

  const externalAuthority = normalizeCanonicalStorageIdentity(identity("document:external-source", {
    sourceOfTruth: { authorityRef: "authority:external", authorityRevisionRef: "authority:r2", providerCopyRef: null },
  }));
  assert.equal(assessCanonicalAvailability(externalAuthority, "2026-09-11T21:00:00Z"), "UNKNOWN");
});

test("TASK-523 blocks stale, PARTIAL and UNKNOWN provider evidence from strengthening canonical availability", () => {
  for (const primary of [
    copy("copy-primary", { currentness: { state: "STALE", assessedAt: "2026-09-11T20:00:00Z", validUntil: "2026-09-11T22:00:00Z" } }),
    copy("copy-primary", { completeness: "PARTIAL" }),
    copy("copy-primary", { completeness: "UNKNOWN", availability: "UNKNOWN" }),
    copy("copy-primary", { currentness: { state: "CURRENT", assessedAt: "2026-09-11T18:00:00Z", validUntil: "2026-09-11T19:00:00Z" } }),
  ]) {
    const normalized = normalizeCanonicalStorageIdentity(identity("document:qualified", { providerCopies: [primary, copy("copy-replica")] }));
    assert.notEqual(assessCanonicalAvailability(normalized, "2026-09-11T21:00:00Z"), "AVAILABLE");
  }
});

test("TASK-523 keeps residual copy state explicit even when a current source copy is available", () => {
  const normalized = normalizeCanonicalStorageIdentity(identity("document:residual", {
    providerCopies: [copy("copy-primary"), copy("copy-old", { lifecycle: "RESIDUAL", completeness: "UNKNOWN", availability: "UNKNOWN" })],
  }));
  assert.equal(assessCanonicalAvailability(normalized, "2026-09-11T21:00:00Z"), "AVAILABLE");
  assert.equal(normalized.providerCopies.find((entry) => entry.copyRef === "copy-old")!.lifecycle, "RESIDUAL");
  assert.equal(normalized.providerCopies.find((entry) => entry.copyRef === "copy-old")!.completeness, "UNKNOWN");
});
