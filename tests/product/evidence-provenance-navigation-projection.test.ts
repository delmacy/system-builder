import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeEvidenceNavigationProjection,
  type EvidenceNavigationProjection,
} from "../../packages/contracts/evidence-provenance/navigation-projection.js";

test("evidence navigation projection normalizes explicit portable identifiers deterministically", () => {
  const first = normalizeEvidenceNavigationProjection({
    evidenceId: "urn:evidence:current",
    sourceIds: ["urn:source:z", "urn:source:a"],
    predecessorEvidenceIds: ["urn:evidence:prior-z", "urn:evidence:prior-a"],
  });
  const second = normalizeEvidenceNavigationProjection({
    predecessorEvidenceIds: ["urn:evidence:prior-a", "urn:evidence:prior-z"],
    sourceIds: ["urn:source:a", "urn:source:z"],
    evidenceId: "urn:evidence:current",
  });

  const typed: EvidenceNavigationProjection = first;
  assert.deepEqual(second, typed);
  assert.deepEqual(first.sourceIds, ["urn:source:a", "urn:source:z"]);
  assert.deepEqual(first.predecessorEvidenceIds, ["urn:evidence:prior-a", "urn:evidence:prior-z"]);
});

test("evidence navigation projection rejects malformed, duplicate, and non-portable shape", () => {
  assert.throws(
    () => normalizeEvidenceNavigationProjection({ evidenceId: "bad id", sourceIds: [], predecessorEvidenceIds: [] }),
    /evidenceId: malformed identifier/,
  );
  assert.throws(
    () => normalizeEvidenceNavigationProjection({ evidenceId: "urn:evidence:1", sourceIds: ["urn:source:1", "urn:source:1"], predecessorEvidenceIds: [] }),
    /sourceIds: duplicate identifier/,
  );
  assert.throws(
    () => normalizeEvidenceNavigationProjection({ evidenceId: "urn:evidence:1", sourceIds: [], predecessorEvidenceIds: [], storageLocator: "s3://bucket/key" }),
    /unexpected field storageLocator/,
  );
});

test("evidence navigation projection remains evidence-only and provider-neutral", () => {
  const projection = normalizeEvidenceNavigationProjection({
    evidenceId: "urn:evidence:1",
    sourceIds: ["urn:source:1"],
    predecessorEvidenceIds: [],
  });

  assert.deepEqual(Object.keys(projection), ["evidenceId", "sourceIds", "predecessorEvidenceIds"]);
  const serialized = JSON.stringify(projection);
  assert.equal(serialized.includes("provider"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("credential"), false);
  assert.equal(serialized.includes("storage"), false);
});
