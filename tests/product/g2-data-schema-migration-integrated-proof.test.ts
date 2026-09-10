import assert from "node:assert/strict";
import test from "node:test";
import {
  DATA_SCHEMA_CONTRACT_VERSION,
  claimMatchesExactOperation,
  decideDirectionalSchemaCompatibility,
  normalizeDirectionalSchemaCompatibilityClaim,
} from "../../packages/contracts/data-schema/index.js";
import {
  DATA_TRANSFORMATION_CONTRACT_VERSION,
  normalizeQualifiedFieldTransformation,
} from "../../packages/contracts/data-schema/transformation.js";
import {
  DATA_SCHEMA_COEXISTENCE_CONTRACT_VERSION,
  historicalRecordUsesExactProducingRevision,
  normalizeReaderWriterCoexistence,
} from "../../packages/contracts/data-schema/coexistence.js";
import {
  SOURCE_OF_TRUTH_CUTOVER_CONTRACT_VERSION,
  normalizeSourceOfTruthCutover,
} from "../../packages/contracts/data-schema/source-of-truth-cutover.js";

const revision = (revisionRef: string, semanticKind = "canonical-schema") => ({
  contractVersion: "1.0.0" as const,
  semanticOwner: "data-schema",
  semanticKind,
  canonicalRef: "customer-record",
  definitionRef: "customer-record-definition",
  revisionOwner: "data-schema",
  revisionDimension: "schema",
  revisionRef,
});

const evidence = (id: string) => ({
  extensionVersion: "1.0.0" as const,
  evidenceId: `evidence:${id}`,
  sources: [{ sourceId: `evidence-source:${id}`, sourceType: "integrated-product-proof", capturedAt: "2026-09-10T15:00:00Z" }],
  transformations: [],
  lineage: { predecessorEvidenceIds: [] },
});

const currentness = (
  subject: ReturnType<typeof revision>,
  populationScope: string,
  localityScope: string,
  state: "CURRENT" | "STALE" | "UNKNOWN" | "INSUFFICIENT" = "CURRENT",
  validUntil = "2026-09-10T17:00:00Z",
) => ({
  contractVersion: "1.0.0" as const,
  subject,
  revisionVector: [{ revisionOwner: "data-schema", revisionDimension: "schema", revisionRef: subject.revisionRef }],
  temporal: {
    occurredAt: null,
    observedAt: "2026-09-10T15:00:00Z",
    evaluatedAt: "2026-09-10T15:01:00Z",
    effectiveFrom: null,
    effectiveUntil: null,
    reconciledAt: "2026-09-10T15:01:00Z",
  },
  populationScope,
  localityScope,
  currentnessHorizon: { assessedAt: "2026-09-10T15:00:00Z", validUntil },
  state,
  reason: "integrated product proof",
});

const unit = (unitRef: string, axis = "length") => ({
  state: "KNOWN" as const,
  unitRef,
  unitRevision: `${unitRef}:r1`,
  dimension: { terms: [{ axis, exponent: 1 }] },
});

const precision = (policyRef: string, precisionValue: number, scale: number, roundingMode = "HALF_EVEN") => ({
  policyRef,
  policyRevision: `${policyRef}:r1`,
  precision: precisionValue,
  scale,
  roundingMode,
});

const compatibilityClaim = (overrides: Record<string, unknown> = {}) => {
  const source = revision("r1");
  const target = revision("r2");
  const claimRevision = {
    ...revision("compat-r1-r2-read-v1", "schema-compatibility"),
    canonicalRef: "customer-record-r1-r2-read",
    definitionRef: "customer-record-r1-r2-read-claim",
  };
  return {
    contractVersion: DATA_SCHEMA_CONTRACT_VERSION,
    claimRevision,
    sourceRevision: source,
    targetRevision: target,
    direction: "READ",
    state: "COMPATIBLE",
    population: {
      populationScope: "tenant-a/customer",
      producingRevision: source,
      state: "HISTORICAL",
      completeness: "KNOWN",
    },
    evidence: evidence("compatibility/customer-r1-r2-read"),
    currentness: currentness(claimRevision, "tenant-a/customer", "region-a"),
    ...overrides,
  };
};

const transformation = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: DATA_TRANSFORMATION_CONTRACT_VERSION,
  transformationRevision: {
    ...revision("transform-r1-r2-v1", "schema-transformation"),
    canonicalRef: "customer-record-r1-r2-transform",
    definitionRef: "customer-record-r1-r2-transform-definition",
  },
  sourceSchemaRevision: revision("r1"),
  targetSchemaRevision: revision("r2"),
  fieldRef: "customer.height",
  sourcePresence: "ABSENT",
  targetPresence: "DEFAULT",
  defaultDefinitionRevision: revision("r2-default-v3"),
  unitConversion: { sourceUnit: unit("unit:centimeter"), targetUnit: unit("unit:meter") },
  precision: {
    sourcePolicy: precision("precision:source", 12, 4),
    targetPolicy: precision("precision:target", 12, 4),
  },
  lossiness: "LOSSLESS",
  compatibility: "FULLY_COMPATIBLE",
  evidence: evidence("transformation/customer-r1-r2"),
  ...overrides,
});

const coexistenceRevision = () => ({
  ...revision("coexist-r1", "schema-coexistence"),
  canonicalRef: "customer-record-coexistence",
  definitionRef: "customer-record-coexistence-definition",
});

const cohort = (
  role: "READER" | "WRITER",
  schemaRevision: ReturnType<typeof revision>,
  overrides: Record<string, unknown> = {},
) => ({
  role,
  cohortRef: `${role.toLowerCase()}-${schemaRevision.revisionRef}`,
  schemaRevision,
  populationScope: "tenant-a/customer",
  localityScope: "region-a",
  populationCount: 10,
  completeness: "KNOWN",
  compatibility: "COMPATIBLE",
  currentness: currentness(schemaRevision, "tenant-a/customer", "region-a"),
  ...overrides,
});

const coexistence = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: DATA_SCHEMA_COEXISTENCE_CONTRACT_VERSION,
  coexistenceRevision: coexistenceRevision(),
  evaluatedAt: "2026-09-10T15:30:00Z",
  historicalRecords: [{ recordRef: "record-001", producingSchemaRevision: revision("r1"), sourceRevision: revision("source-r1", "source-schema") }],
  readerCohorts: [cohort("READER", revision("r1")), cohort("READER", revision("r2"))],
  writerCohorts: [cohort("WRITER", revision("r2"))],
  ...overrides,
});

const cutoverRevision = () => ({
  ...revision("cutover-r1", "source-cutover"),
  canonicalRef: "customer-cutover",
  definitionRef: "customer-cutover-definition",
});

const residual = (
  kind: "SOURCE" | "READER" | "WRITER" | "REPLICATION",
  overrides: Record<string, unknown> = {},
) => ({
  cohortRef: `${kind.toLowerCase()}-residual`,
  cohortKind: kind,
  populationScope: "tenant-a/customer",
  localityScope: "region-a",
  populationCount: "UNKNOWN",
  completeness: "UNKNOWN",
  drained: false,
  currentness: currentness(cutoverRevision(), "tenant-a/customer", "region-a"),
  ...overrides,
});

const cutover = (overrides: Record<string, unknown> = {}) => ({
  contractVersion: SOURCE_OF_TRUTH_CUTOVER_CONTRACT_VERSION,
  cutoverRevision: cutoverRevision(),
  scopeRef: "tenant-a/customer",
  evaluatedAt: "2026-09-10T15:30:00Z",
  authorities: [
    { sourceRef: "source-old", scopeRef: "tenant-a/customer", epoch: 1, fencingToken: "fence-1-old", canonical: false },
    { sourceRef: "source-new", scopeRef: "tenant-a/customer", epoch: 2, fencingToken: "fence-2-new", canonical: true },
  ],
  lineage: [{
    lineageRef: "lineage-1",
    mode: "DUAL_WRITE",
    sourceRef: "source-old",
    targetRef: "source-new",
    sourceSchemaRevision: revision("r1"),
    producingSchemaRevision: revision("r1"),
    targetSchemaRevision: revision("r2"),
    executedAt: "2026-09-10T15:10:00Z",
    acknowledgedAt: "2026-09-10T15:11:00Z",
    executionSucceeded: true,
    adoption: "PARTIAL",
    convergence: "PARTIAL",
  }],
  residualCohorts: [residual("SOURCE"), residual("READER"), residual("WRITER"), residual("REPLICATION")],
  ...overrides,
});

test("TASK-509 proves the integrated migration chain preserves revision, direction, presence, coexistence and authority boundaries", () => {
  const claim = normalizeDirectionalSchemaCompatibilityClaim(compatibilityClaim());
  assert.equal(claimMatchesExactOperation(claim, revision("r1"), revision("r2"), "READ"), true);
  assert.equal(claimMatchesExactOperation(claim, revision("r1"), revision("r2"), "WRITE"), false);
  assert.deepEqual(decideDirectionalSchemaCompatibility(claim), { compatible: true, reason: "EXPLICIT_CURRENT_COMPATIBILITY" });

  const transformed = normalizeQualifiedFieldTransformation(transformation());
  assert.equal(transformed.sourcePresence, "ABSENT");
  assert.equal(transformed.targetPresence, "DEFAULT");
  assert.equal(transformed.defaultDefinitionRevision?.revisionRef, "r2-default-v3");
  assert.equal(transformed.sourceSchemaRevision.revisionRef, "r1");
  assert.equal(transformed.targetSchemaRevision.revisionRef, "r2");

  const coexist = normalizeReaderWriterCoexistence(coexistence());
  assert.equal(historicalRecordUsesExactProducingRevision(coexist.historicalRecords[0]!, revision("r1")), true);
  assert.equal(historicalRecordUsesExactProducingRevision(coexist.historicalRecords[0]!, revision("r2")), false);
  assert.equal(coexist.readerCohorts.some((entry) => entry.schemaRevision.revisionRef === "r1"), true);
  assert.equal(coexist.readerCohorts.some((entry) => entry.schemaRevision.revisionRef === "r2"), true);

  const moved = normalizeSourceOfTruthCutover(cutover());
  assert.equal(moved.authorities.filter((entry) => entry.canonical).length, 1);
  assert.equal(moved.authorities.find((entry) => entry.canonical)?.sourceRef, "source-new");
  assert.equal(moved.lineage[0]?.producingSchemaRevision.revisionRef, "r1");
  assert.equal(moved.lineage[0]?.targetSchemaRevision.revisionRef, "r2");
  assert.equal(moved.lineage[0]?.executionSucceeded, true);
  assert.equal(moved.lineage[0]?.convergence, "PARTIAL");
  assert.equal(moved.residualCohorts.every((entry) => entry.populationCount === "UNKNOWN"), true);
});

test("TASK-509 proves adversarial strengthening fails across the integrated migration boundary", () => {
  const baseClaim = compatibilityClaim();
  const reverse = normalizeDirectionalSchemaCompatibilityClaim(baseClaim);
  assert.equal(claimMatchesExactOperation(reverse, revision("r2"), revision("r1"), "READ"), false);
  assert.equal(claimMatchesExactOperation(reverse, revision("r1"), revision("r2"), "WRITE"), false);

  assert.throws(
    () => normalizeDirectionalSchemaCompatibilityClaim(compatibilityClaim({
      population: { populationScope: "tenant-a/customer", producingRevision: revision("r0"), state: "HISTORICAL", completeness: "KNOWN" },
    })),
    /producing revision must exactly match/,
  );

  assert.throws(
    () => normalizeQualifiedFieldTransformation(transformation({
      sourcePresence: "NULL",
      targetPresence: "DEFAULT",
      defaultDefinitionRevision: revision("r2-default-v3"),
    })),
    /presence intent transition/,
  );

  assert.throws(
    () => normalizeQualifiedFieldTransformation(transformation({
      precision: { sourcePolicy: precision("precision:source", 12, 4), targetPolicy: precision("precision:target", 10, 2) },
      lossiness: "LOSSLESS",
      compatibility: "FULLY_COMPATIBLE",
    })),
    /precision reduction cannot be qualified as LOSSLESS/,
  );

  assert.throws(
    () => normalizeReaderWriterCoexistence(coexistence({
      readerCohorts: [cohort("READER", revision("r1"), { populationCount: 0, completeness: "UNKNOWN", compatibility: "UNKNOWN" })],
    })),
    /preserve populationCount as UNKNOWN/,
  );

  assert.throws(
    () => normalizeSourceOfTruthCutover(cutover({
      authorities: [
        { sourceRef: "source-old", scopeRef: "tenant-a/customer", epoch: 2, fencingToken: "old-token", canonical: false },
        { sourceRef: "source-new", scopeRef: "tenant-a/customer", epoch: 2, fencingToken: "new-token", canonical: true },
      ],
    })),
    /fencing epoch cannot be reused/,
  );

  assert.throws(
    () => normalizeSourceOfTruthCutover(cutover({ residualCohorts: [residual("SOURCE"), residual("READER"), residual("WRITER")] })),
    /residual cohort class REPLICATION must remain explicit/,
  );

  assert.throws(
    () => normalizeSourceOfTruthCutover(cutover({
      lineage: [{
        ...(cutover().lineage[0] as Record<string, unknown>),
        convergence: "CONVERGED",
        adoption: "ADOPTED",
        acknowledgedAt: null,
      }],
    })),
    /drainage/,
  );
});
