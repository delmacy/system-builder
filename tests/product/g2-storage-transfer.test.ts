import assert from "node:assert/strict";
import test from "node:test";
import { STORAGE_TRANSFER_CONTRACT_VERSION, assertTransferContinuation, assessQualifiedProviderCopyAvailability, normalizeStorageTransferEvidence, retryDisposition } from "../../packages/contracts/storage/storage-transfer.js";

const base = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: STORAGE_TRANSFER_CONTRACT_VERSION,
  transferRef: "transfer:1", attemptRef: "attempt:1", lineageRootRef: "lineage:object-1", predecessorAttemptRef: null,
  canonicalObjectRef: "object:1", canonicalRevisionRef: "object:1:r7", providerCopyRef: "copy:1", providerRef: "provider:a",
  mode: "COMPLETE", state: "COMPLETED", acknowledgedAt: "2026-09-12T01:00:00Z", integrityVerified: true, durabilityEvidenceRef: "durability:1", resumeCheckpointRef: null,
  completeness: "KNOWN", currentness: { state: "CURRENT", assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-12T03:00:00Z" },
  providerQualification: { providerRef: "provider:a", qualificationRevisionRef: "qualification:r3", state: "QUALIFIED", currentness: { state: "CURRENT", assessedAt: "2026-09-12T00:00:00Z", validUntil: "2026-09-12T03:00:00Z" } },
  ...overrides,
});

test("TASK-524 keeps transfer identity distinct from canonical object and provider copy", () => {
  const e = normalizeStorageTransferEvidence(base());
  assert.notEqual(e.transferRef, e.canonicalObjectRef); assert.notEqual(e.attemptRef, e.providerCopyRef);
  assert.equal(assessQualifiedProviderCopyAvailability(e, "2026-09-12T02:00:00Z"), "AVAILABLE");
});

test("TASK-524 provider ACK cannot manufacture durable integrity-qualified availability", () => {
  for (const overrides of [
    { state: "ACKNOWLEDGED", integrityVerified: null, durabilityEvidenceRef: null },
    { state: "COMPLETED", integrityVerified: false },
    { state: "COMPLETED", durabilityEvidenceRef: null },
  ]) assert.notEqual(assessQualifiedProviderCopyAvailability(normalizeStorageTransferEvidence(base(overrides)), "2026-09-12T02:00:00Z"), "AVAILABLE");
});

test("TASK-524 requires current qualified provider evidence", () => {
  const stale = normalizeStorageTransferEvidence(base({ providerQualification: { providerRef: "provider:a", qualificationRevisionRef: "qualification:r1", state: "QUALIFIED", currentness: { state: "STALE", assessedAt: "2026-09-11T20:00:00Z", validUntil: "2026-09-12T03:00:00Z" } } }));
  assert.equal(assessQualifiedProviderCopyAvailability(stale, "2026-09-12T02:00:00Z"), "UNKNOWN");
});

test("TASK-524 preserves resume/replay lineage and rejects mismatches", () => {
  const first = normalizeStorageTransferEvidence(base());
  const resumed = normalizeStorageTransferEvidence(base({ transferRef: "transfer:2", attemptRef: "attempt:2", predecessorAttemptRef: "attempt:1", mode: "RESUMED", resumeCheckpointRef: "checkpoint:9" }));
  assert.doesNotThrow(() => assertTransferContinuation(first, resumed));
  const mismatched = normalizeStorageTransferEvidence(base({ transferRef: "transfer:3", attemptRef: "attempt:3", predecessorAttemptRef: "attempt:1", mode: "REPLAY", lineageRootRef: "other-lineage" }));
  assert.throws(() => assertTransferContinuation(first, mismatched), /lineageRootRef mismatch/);
});

test("TASK-524 treats PARTIAL and UNKNOWN as reconcile-before-retry", () => {
  for (const overrides of [{ completeness: "PARTIAL", state: "PARTIAL" }, { completeness: "UNKNOWN", state: "UNKNOWN" }]) {
    const e = normalizeStorageTransferEvidence(base(overrides));
    assert.equal(assessQualifiedProviderCopyAvailability(e, "2026-09-12T02:00:00Z"), "UNKNOWN");
    assert.equal(retryDisposition(e, "2026-09-12T02:00:00Z"), "RECONCILE_REQUIRED");
  }
});

test("TASK-524 failed known current transfer may retry while available copy may not", () => {
  assert.equal(retryDisposition(normalizeStorageTransferEvidence(base({ state: "FAILED", integrityVerified: null, durabilityEvidenceRef: null })), "2026-09-12T02:00:00Z"), "SAFE_TO_RETRY");
  assert.equal(retryDisposition(normalizeStorageTransferEvidence(base()), "2026-09-12T02:00:00Z"), "DO_NOT_RETRY");
});
