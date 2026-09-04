# Planning B — Lifecycle / Versioning / Evolution / Migration — SB Current State

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Fresh-main evidence anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Scope: repository archaeology and reconciliation only. No target architecture, product code, WBS, Work Package, TASK, Construction, PR, or worker handoff.

## Planning A owner being validated
Lifecycle / Versioning / Evolution / Migration owns cross-capability change semantics: lifecycle subjects/revision vectors, transition/coexistence state, migration readiness/currentness, cutover/deprecation/withdrawal, correction/supersession lineage, rollback eligibility, and residual authoritative cohort drainage. Domain owners retain their own semantics and realization owners retain actuation.

## Fresh-main evidence

### Process revision identity and immutable lineage are substantive
`packages/contracts/process-versioning/index.ts` defines provider-neutral `ProcessArtifactIdentity` and `ProcessRevisionIdentity` with explicit `artifactRef`, `revisionRef`, positive `revisionNumber`, and `previousRevisionRef`. Successors must identify their predecessor, first revisions cannot, and published revision evidence includes an immutable content reference. `guardImmutablePublishedRevision` rejects overwrite drift and permits only identical idempotent publication.

The same contract defines `active | deprecated | archived` lifecycle state plus `supersedesRevisionRef`. `validateProcessRevisionLineage` orders revisions, rejects cross-artifact histories, gaps, duplicate/conflicting revisions, invalid predecessor links, and invalid supersession while a predecessor remains active. This is real lifecycle identity and lineage, not merely a scalar version string.

`packages/catalog/process-revision-admission.ts` admits revision identity, immutable content reference, and lifecycle state into catalog-facing behavior, preserving the process owner rather than substituting a provider identifier.

### Cross-stage process-to-system lineage exists
Product tests under P18/P19 exercise process revision → analysis → SystemDefinition → release → deployment lineage. The successor/rollback proof builds distinct A/B process revisions and carries their canonical upstream lineage through release and deployment admission. This establishes meaningful correlation across several revision-bearing owners without collapsing their identities.

### Release lifecycle is explicit but owner-local
`packages/release/index.ts` defines `PublishedReleaseStatus = published | deprecated | archived`; persistence preserves those states. This is useful evidence that release evolution is explicit, but Artifact/Release remains the semantic owner of release publication/withdrawal mechanics.

### Deployment successor and retained-history behavior are concrete
`tests/product/p19-successor-historical-rollback.test.ts` proves A can be activated, B can succeed as its successor, and retained A can later be promoted again without regeneration. The proof preserves immutable A/B release/history records and lineage. Separately, hardened activation evidence proves compare-and-promote semantics: a stale expected active deployment is rejected as `stale-active`, while the successful active deployment remains authoritative.

This is stronger than historical availability alone, but it is evidence of deployment actuation over retained compatible fixtures. It does not establish a generalized, current lifecycle-level rollback-eligibility assessment across schema, workflow, provider, trust, contract, authority, privacy, or recovery constraints.

## Maturity assessment

### Evidenced strengths
- canonical process artifact/revision identity with explicit predecessor lineage;
- immutable publication evidence and overwrite-conflict rejection;
- explicit process lifecycle states and supersession linkage;
- deterministic contiguous lineage validation;
- process → analysis → definition → release → deployment correlation;
- release-local published/deprecated/archived lifecycle;
- successor activation with stale-active fencing;
- retained historical artifact/release deployment actuation demonstrated by product proof;
- provider/external IDs are not required as canonical process revision identity.

### Unevidenced or incomplete against the Planning A owner
Fresh main does not evidence a generalized lifecycle subject/revision-vector model spanning independently changing schema, workflow, provider, contract, runtime, trust, policy and other owners. It does not evidence applicability-scoped compatibility/coexistence claims, current migration-readiness records, a generic staged transition state such as prepared/qualified/coexisting/cutover/effective/converged/validated/drained, or explicit PARTIAL/INCONCLUSIVE lifecycle assessments.

No repository evidence found in this archaeology establishes residual authoritative cohort inventory/drainage as a cross-capability closure condition. Release deprecation/archive and process supersession exist, but generalized withdrawal windows, correction lineage across all subjects, consumer-effective adoption, and residual old-client/schema/workflow/runtime/provider cohorts remain unevidenced.

The historical rollback product proof establishes that an exact retained prior realization can be re-promoted in its tested conditions. It does not establish the stronger Planning A invariant that rollback eligibility is a current evidence-qualified claim. No generalized evidence was found that requalifies schema/data compatibility, in-flight workflows, provider bindings, credentials/trust, protocol clients, privacy/legal constraints, recovery state, or other independently changing dimensions before declaring rollback currently safe.

Likewise, no generalized migration-effect record with `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` and reconcile-before-retry semantics was found for cross-owner lifecycle transitions. Domain-specific migration/deployment mechanisms must not be reclassified as lifecycle truth without their owner evidence.

## Dispositions

### KEEP
Keep the canonical process revision identity, immutable publication guard, predecessor/supersession lineage, explicit lifecycle states, cross-stage lineage, release lifecycle, stale-active deployment fencing, and retained-history proofs. They are concrete foundations aligned with the Generation 2 ownership boundary.

### HARDEN
Harden the distinction between historical availability and current rollback eligibility; lifecycle completion must not be inferred from retained artifacts, provider acceptance, release state, or one successful deployment actuation. Preserve explicit insufficient/stale evidence rather than manufacturing readiness.

### GENERALIZE
Generalize lifecycle coordination beyond process/release/deployment-local states only where evidence and later architecture work justify a cross-owner lifecycle subject/revision-vector and transition record. The generalization must consume owner-qualified evidence rather than absorb schema, workflow, provider, runtime, protocol, privacy, security, or governance semantics.

### INTEGRATE
Integrate existing process/release/deployment lineage with owner-specific compatibility, migration, convergence, rollback and drainage evidence in later phases. Integration is required to make cross-capability evolution inspectable while retaining independent semantic owners.

### PROVIDERIZE
No generalized lifecycle provider seam is evidenced on fresh main. Provider-specific migration/cutover mechanics may remain providerized under their realization owners; lifecycle itself should not be classified as provider-owned from current evidence.

### REPLACE
No evidence supports replacing the current process revision, release lifecycle, lineage, or deployment successor foundations.

### DEFER
Target transition-state shape, generalized revision-vector representation, compatibility matrix mechanics, rollback-eligibility computation, and residual-cohort model are deferred to the authorized later architecture/reconciliation phases. Planning B does not invent them.

### DO_NOT_BUILD
Do not build a global scalar version service that collapses independent owner revisions. Do not treat historical retention as rollback eligibility, provider success as cutover completion, or release/process lifecycle state as proof that residual authoritative cohorts are drained.

## Planning B conclusion
`PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED`.

Fresh main has unusually strong lifecycle foundations around process revision identity, immutable publication, lifecycle/supersession lineage, cross-stage process-system history, release lifecycle, successor activation fencing, and retained historical deployment actuation. The missing portion is the generalized cross-capability coordination owner defined in Planning A: independent revision vectors, current compatibility/migration readiness, staged coexistence/cutover/convergence, evidence-qualified rollback eligibility, correction/withdrawal coordination, explicit ambiguous transition effects, and residual authoritative cohort drainage.

No target architecture is asserted by this artifact.