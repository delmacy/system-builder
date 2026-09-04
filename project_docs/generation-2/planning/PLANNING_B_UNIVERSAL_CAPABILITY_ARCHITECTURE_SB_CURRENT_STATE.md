# Generation 2 — Planning B: Universal Capability Architecture — SB Current-State Reconciliation

Status: COMPLETE_FOR_CAPABILITY — PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Capability: Universal Capability Architecture (UCA)
Fresh-main evidence anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Planning A authority: `project_docs/generation-2/planning/PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`

This document performs repository archaeology only. It does not change product code, choose target modules, materialize WBS/TASKs, execute Construction, or enter Planning C.

## 1. Reconciliation question

Which reusable cross-capability structures already exist in the authoritative System Builder, which are only domain-scoped predecessors, and which Planning A UCA contracts remain absent without turning UCA into a semantic god-object?

## 2. Fresh-main evidence inspected

Authoritative `main` was inspected at commit `d8760c7f08757bb164a758ae0c3f0a4a1752464b`.

Primary implementation/contracts/evidence:

- `specs/contracts/artifact-envelope/artifact-envelope.schema.json`
- `packages/contracts/factory-boundary/journey.ts`
- `packages/contracts/factory-boundary/validation-evidence.schema.json`
- `packages/contracts/process-versioning/lineage.ts`
- `packages/catalog/index.ts`
- `packages/runtime-core/authority-resolution.ts`
- existing contract families under `packages/contracts/**` and their explicit contract/schema versions.

## 3. Current SB truth

### 3.1 Provider-neutral durable artifact identity/provenance already exists — KEEP / HARDEN

The public artifact envelope is explicitly provider-neutral. It separates a logical artifact identity (`artifactId`) from artifact version, payload schema identity/version, producer metadata and input-artifact provenance; its own description explicitly excludes provider, registry, database and storage identifiers from the core contract. Input lineage can carry algorithm-qualified digests without assuming a storage system.

This is a strong predecessor for UCA's canonical-vs-realization boundary and evidence/provenance shape. It is nevertheless an artifact-envelope contract, not a universal semantic-identity or qualified-evidence contract: it has no applicability, coverage, uncertainty, currentness horizon, replay horizon, semantic-owner predicate or `INCONCLUSIVE` outcome.

Disposition: **KEEP** provider-neutral logical identity, schema/version and provenance separation; **HARDEN/GENERALIZE** only where multi-capability use requires common qualification structure. Do not reinterpret artifact identity as universal domain identity.

### 3.2 Exact factory/process lineage is explicit but remains scalar/domain-scoped — KEEP / GENERALIZE

`factory-boundary/journey.ts` defines ordered, versioned factory stages with distinct `identityRef` and `provenanceRef`, validates exact predecessor chains, and refuses mismatched canonical process/system-definition/release/deployment references. `process-versioning/lineage.ts` likewise models typed lineage endpoints and ordered hops while requiring distinct identities across process revision, analysis, definition, release and deployment.

These are strong predecessors for lineage-preserving composition and for the rule that one stage does not silently become another stage's identity. They do not implement a multidimensional `RevisionVector`, correction/supersession lineage across arbitrary owners, applicability/currentness qualification or the full attempted→accepted→effective→converged→validated relation.

Disposition: **KEEP** explicit typed lineage and exact predecessor validation; **GENERALIZE** only as architecture-level reusable structure while preserving each owner's domain lifecycle semantics.

### 3.3 Capability/provider resolution is explicit but too coarse for UCA support-vector semantics — KEEP / HARDEN / INTEGRATE

`packages/catalog/index.ts` models capability, provider, version, dependencies, version constraints and an open string-keyed compatibility map. Candidate resolution is deterministic and distinguishes `CAPABILITY_NOT_FOUND` from `NO_COMPATIBLE_PROVIDER`. Factory capability resolution validates canonical journey lineage before resolving providers and explicitly states that resolution creates no new identity or execution authority.

This is meaningful predecessor evidence for `CapabilityRequirement`, provider-qualified realization and non-amplification. It is not yet a `CapabilitySupportVector`: support dimensions have no standard meaning, evidence/currentness, applicability, failure semantics, limits, ordering, isolation or partial/inconclusive qualification. A candidate either matches the requested compatibility keys or does not.

Disposition: **KEEP** capability/provider/version separation and deterministic failure; **HARDEN/GENERALIZE** multidimensional qualification later through UCA + Provider/Binding; **DO_NOT** treat catalog resolution as canonical identity, authority or semantic equivalence.

### 3.4 Runtime authority resolution is fail-closed but not the universal delegation contract — KEEP BOUNDARY / INTEGRATE

`packages/runtime-core/authority-resolution.ts` separates identity, membership, role binding, permission and policy descriptors. It fails on missing, unknown, disabled or ambiguous identity/membership/role state, and returns a resolved authority only after explicit binding resolution.

This is compatible with UCA's non-amplification principle, but it is a runtime Authorization realization. It does not model the constitutional `Enterprise → Station → Role → Person` delegation path, Station exposure, inherited restriction/intersection proofs, revision/currentness-qualified authority envelopes, offline authority horizons or cross-capability delegation lineage.

Disposition: **KEEP** fail-closed explicit authority resolution; **INTEGRATE** with future reusable authority-envelope/delegation structures without moving permission truth into UCA. Station and the constitutional hierarchy must not be inferred from current `organizationRef`, membership or role data.

### 3.5 Validation evidence currently collapses absence/uncertainty to binary PASS/FAIL — HARDEN / GENERALIZE

`validation-evidence.schema.json` has a deterministic `ValidationEvidence` contract tied to an assembly plan and evidence hash, but both overall `decision` and individual check `status` are restricted to `PASS | FAIL`.

For its current bounded factory validation purpose this is valid product truth. It does not satisfy UCA's cross-capability qualified-evidence semantics because there is no explicit `INCONCLUSIVE`, `PARTIAL`, applicability population, freshness/currentness, coverage, uncertainty or replay horizon.

Disposition: **KEEP** the bounded current factory contract; **DO_NOT** retroactively reinterpret `FAIL` as evidence insufficiency. **GENERALIZE** separate qualification structures later where a consumer must distinguish negative evidence from insufficient evidence.

### 3.6 UCA is not implemented as a centralized shared semantic package — PRESERVE / DEFER TARGET DESIGN

No inspected current-main contract defines the Planning A cross-cutting set as a centralized UCA layer. In particular, no authoritative implementation was evidenced for `QualifiedClaim`, `QualifiedEvidenceEnvelope`, `EvidenceCurrentnessHorizon`, generic `RevisionVector`, `EffectDisposition`, `AttemptEffectValidationLineage`, typed canonical-vs-realization identity binding, `ResidualCohortDrainageStatus`, generic `AuthorityEnvelope`/`DelegationPath`, `QualifiedLocalClosure`, `RollbackEligibility`, generic correction/supersession lineage, `EvaluationProfileRef` or `ImmutableQualifiedAssessment`.

This absence is not a defect claim against current SB; those are Generation 2 architecture contracts. Existing useful semantics are intentionally distributed among artifact, process-versioning, catalog/provider and runtime-authority owners.

Disposition: **DEFER** package/module/topology choice to Planning C. **DO_NOT_BUILD** a catch-all common/core semantic god-object merely to centralize names.

## 4. Planning A contract-by-contract current-state matrix

| Planning A UCA contract | Current SB evidence | Maturity / disposition |
| --- | --- | --- |
| `CanonicalSemanticIdentityRef` | logical artifact IDs and typed domain identity refs exist | PARTIAL — KEEP domain identities; no universal semantic ref |
| `RealizationIdentityRef` | provider/version/catalog identities exist | PARTIAL — explicit realization evidence, not uniformly typed |
| `TypedIdentityBinding` | lineage/bindings exist in domain contracts | PARTIAL — no generic canonical↔realization binding |
| `RevisionVector` | scalar contract/artifact/process versions | PARTIAL — GENERALIZE; no independent multi-owner vector |
| `QualifiedClaim` | bounded decisions/diagnostics exist | GAP |
| `QualifiedEvidenceEnvelope` | artifact provenance + ValidationEvidence | PARTIAL STRONG PREDECESSOR |
| `EvidenceCurrentnessHorizon` | no generic currentness/replay horizon evidenced | GAP |
| `EffectDisposition` | no reusable `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` contract evidenced | GAP |
| `AttemptEffectValidationLineage` | ordered factory journey exists, but models factory stages rather than remote effect semantics | PARTIAL ADJACENT |
| `CapabilityRequirement` | catalog resolution request/dependency requirements | PARTIAL STRONG PREDECESSOR |
| `CapabilitySupportVector` | compatibility map + provider/version matching | PARTIAL — too coarse/unqualified |
| `ProviderBindingRef` | provider-bearing catalog records and candidate resolution | PARTIAL ADJACENT |
| `ResidualCohortDrainageStatus` | none evidenced as reusable contract | GAP |
| `AuthorityEnvelope` | runtime resolved authority | PARTIAL ADJACENT — Authorization-owned truth |
| `DelegationPath` | role/membership bindings only | GAP for constitutional hierarchy |
| `QualifiedLocalClosure` | no generic local/offline closure declaration evidenced | GAP |
| `RollbackEligibility` | no reusable current-qualified rollback claim evidenced | GAP |
| `CorrectionSupersessionLineage` | exact lineage exists; generic correction/supersession not evidenced | PARTIAL |
| `EvaluationProfileRef` | no reusable consumer-owned evaluation profile evidenced | GAP |
| `ImmutableQualifiedAssessment` | bounded validation evidence exists; no qualified assessment contract | PARTIAL ADJACENT |

## 5. Mandatory UCA proofs vs current SB

1. **Reuse across different semantic owners without leakage:** PARTIAL PASS predecessor. Provider-neutral artifact envelopes and contract families demonstrate reusable structural discipline, but no common UCA proof suite exists.
2. **Stable canonical identity across provider substitution:** PARTIAL. Artifact contract explicitly excludes provider IDs from core identity and catalog separates provider from capability, but no generic typed identity-binding/substitution proof exists.
3. **Evidence qualification and stale-evidence invalidation:** NOT IMPLEMENTED / NOT PROVEN generically. Provenance exists; currentness/applicability/coverage/replay qualification does not.
4. **Authority separation/non-amplification:** PARTIAL PASS predecessor. Catalog resolution explicitly grants neither identity nor execution authority, and runtime authority is explicit/fail-closed; constitutional hierarchy/delegation contracts are absent.
5. **Provider-neutrality without false equivalence:** PARTIAL. Provider-neutral envelope and provider-aware catalog are strong predecessors; multidimensional support qualification and `PARTIAL/INCONCLUSIVE` are absent.

Negative proofs remain unproven where the relevant Generation 2 contract does not yet exist; Planning B records the gap rather than synthesizing target implementation.

## 6. Repository contradictions / non-contradictions

No inspected repository evidence contradicts the Planning A anti-god-object requirement. Current contracts are mostly directional and domain-scoped rather than centralized in one universal mutable model.

No inspected evidence justifies treating provider/catalog identities as canonical semantic identity. The artifact envelope explicitly excludes provider/registry/storage IDs, and catalog identity contains capability+provider+version while factory capability resolution says it creates no new identity or authority.

Current binary factory `PASS/FAIL` evidence is a bounded contract, not evidence that all system-wide qualification is safely binary. Planning C must not globalize that binary vocabulary where `INCONCLUSIVE/PARTIAL` is semantically required.

Current role/membership/organization structures do not prove `Enterprise → Station → Role → Person`; inferring Station from them would be invented.

## 7. Evidenced architectural dispositions

- **KEEP**: provider-neutral durable artifact identity; explicit schema/contract versions; provenance/input lineage; typed process/factory lineage; exact predecessor validation; deterministic catalog resolution; provider/version separation; explicit failure diagnostics; fail-closed runtime authority resolution.
- **HARDEN**: evidence qualification boundaries so currentness/applicability/coverage are not inferred from provenance alone; capability qualification so compatibility does not imply full semantic support; canonical-vs-realization identity separation across additional owners.
- **GENERALIZE**: only reusable structures proven cross-capability — revision vectors, qualified evidence/claims, effect ambiguity, support vectors, authority-envelope shape, drainage, local closure, rollback eligibility and correction lineage — while domain predicates remain with owners.
- **INTEGRATE**: UCA structures with Provider/Binding, Lifecycle, Authorization, Architecture Reconciliation, Observability and other semantic owners through minimal directional contracts.
- **PROVIDERIZE**: provider-specific compatibility/failure/identity mechanisms remain behind Provider/Binding; none should be promoted into UCA merely for convenience.
- **REPLACE**: no current subsystem is evidenced as requiring replacement.
- **DEFER**: concrete package/module topology, migration/storage shape and rollout to Planning C/D.
- **DO_NOT_BUILD**: universal domain entity model, universal policy/evaluator, scalar support/health abstraction, authority broker, implicit orchestration engine or provider abstraction that erases material divergence.

## 8. Migration questions carried forward

1. Which existing provider-neutral artifact/provenance structures can be reused without making artifact semantics the universal identity/evidence model?
2. Can existing domain lineage contracts consume a small revision/evidence vocabulary without creating reverse dependencies or a common-package dependency magnet?
3. Where are provider/external IDs persisted outside catalog/artifact boundaries, and which require explicit typed binding rather than implicit equivalence?
4. How should existing binary validation evidence coexist with future qualified `PARTIAL/INCONCLUSIVE` consumers without breaking current factory contracts?
5. Which existing retry/reconciliation paths need explicit `EffectDisposition.UNKNOWN` before any generic contract can be adopted?
6. Which lifecycle/deployment/provider stores can evidence residual cohorts and current rollback prerequisites instead of historical flags?
7. How can `Enterprise → Station → Role → Person` be represented structurally while Authorization remains sole owner of permission/delegation truth and AGWS retains Station surface-exposure semantics?
8. What dependency direction prevents UCA from becoming a generic `common/core` semantic god-object?

These are Planning C/D inputs, not implementation decisions.

## 9. Capability reconciliation result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB already demonstrates strong architectural predecessors in provider-neutral artifact identity/provenance, explicit versioned lineage, deterministic provider-aware capability resolution and fail-closed authority separation. Those mechanisms are distributed and domain-scoped; current main does **not** implement the full UCA contract set defined by Generation 2.

The evidence therefore supports additive, boundary-preserving evolution rather than replacement: reuse/harden proven structural patterns, generalize only genuinely universal shapes, keep semantic predicates with owners, and never turn UCA into a universal domain model, policy engine, provider facade, evaluator or mutable source of truth.

No product code changed. No Planning C work was performed.