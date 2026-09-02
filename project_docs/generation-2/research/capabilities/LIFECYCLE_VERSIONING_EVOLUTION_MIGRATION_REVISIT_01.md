# Lifecycle / Versioning / Evolution / Migration — Revisit 01

## Research question
What universal primitives let Generation 2 evolve semantic objects, contracts, data, providers and runtimes while preserving identity, compatibility windows, migration evidence, rollback/forward-fix choices and autonomous/offline operation without Lifecycle taking ownership of domain semantics?

## Representatives and evidence/source ledger
1. Kubernetes API deprecation/version-skew policy — API versions can coexist; deprecation is distinct from removal; round-trip compatibility and supported skew constrain safe transitions; storage/preferred versions have staged advancement. Source of truth: Kubernetes official API deprecation and version-skew documentation.
2. Kubernetes deprecated API migration guidance — migration requires locating usage, converting consumers/objects, and validating replacement behavior; warnings/metrics/audit can provide transition evidence. Source of truth: Kubernetes official migration guide.
3. Flyway — versioned migration history and target selection separate desired target from applied migration sequence; undo is a distinct reverse procedure and is not universally available (e.g. repeatable migrations). Source of truth: Redgate Flyway official documentation.
4. PostgreSQL — transactional database semantics provide a representative for atomic versus non-atomic migration boundaries; database state remains distinct from migration intent/procedure identity. Source of truth: PostgreSQL official documentation.
5. Terraform/OpenTofu evolution patterns — configuration/state/provider linkage and explicit movement/rebinding show that semantic resource continuity is not equivalent to physical/provider realization continuity. Source of truth: HashiCorp/OpenTofu official lifecycle/state documentation carried from Provider revisit.
6. Temporal workflow evolution/versioning — long-lived executions force coexistence between code generations and require explicit compatibility/routing/versioning strategy rather than assuming instantaneous fleet migration. Source of truth: Temporal official documentation carried from Workflow research.

## Universal primitives
- SemanticObjectIdentity
- RevisionIdentity
- EffectiveRealizationIdentity
- CompatibilityPolicyRevision
- CompatibilityObservationEvidence
- MigrationIntent
- MigrationPlanRevision
- MigrationAttempt
- MigrationResult
- MigrationCheckpoint / PartialProgressEvidence
- CoexistenceWindow
- ConsumerCompatibilityWindow
- DeprecationNotice
- DisablementDecision
- RemovalDecision
- RollbackAttempt / ForwardFixAttempt
- PostMigrationConformanceEvidence

## Identity, lifecycle and versioning
A semantic object must retain identity independently from its revisions and provider/runtime realizations. Migration is not a mutation flag: intent, plan, attempt, checkpoint and result need separate lineage. Deprecation announces lifecycle intent while disablement and removal change availability and therefore require separate decisions/evidence.

## Failure semantics
Migration can fail before mutation, partially apply, commit atomically, or complete while downstream consumers remain incompatible. Rollback may be impossible or unsafe after irreversible data/semantic changes; forward-fix is therefore a first-class recovery path. A successful procedure execution does not prove target conformance or consumer compatibility.

## Extensibility and provider boundaries
Lifecycle owns transition orchestration/evidence, not domain conversion semantics. Capability owners define valid source/target semantics and migration procedures; provider plane realizes provider-specific transitions. Provider replacement must preserve semantic/state/trust continuity evidence rather than merely rewrite a locator.

## Governance, observability and portability
Transitions need explicit authority, scope, preconditions, postconditions, audit evidence and freshness. Coexistence/skew windows must be observable. Offline/self-hosted operation requires migration plans, validators and rollback/forward-fix procedures to remain executable without a SaaS control plane.

## Lock-in
Lock-in increases when migration history, conversion logic, compatibility knowledge or state identity exist only inside a provider. Portable migration intent/procedure metadata plus exportable evidence reduces this without pretending provider-specific mechanics are universal.

## Product-specific mechanism vs universal primitive
Kubernetes conversion/storage-version rules, Flyway SQL migration files, Terraform state moves and Temporal worker routing are product mechanisms. The universal layer is source revision + target revision + compatibility policy + migration procedure + attempt/result/checkpoint lineage + post-transition conformance.

## Convergent patterns
- coexistence is normal and must be bounded explicitly;
- deprecation precedes removal and is evidence-bearing;
- target declaration is distinct from effective realized target;
- migration execution and post-migration conformance are distinct proofs;
- rollback is a new transition, not erasure of history;
- provider/runtime/data transitions compose but retain separate owners.

## Divergent patterns
- some transitions can be transactional; others are inherently staged;
- some systems support reverse procedures, others require forward-fix;
- compatibility may be round-trip, backward-only, forward-only or bounded by skew windows;
- state conversion may be automatic, declarative, imperative or operator-assisted.

## Subcapabilities
Compatibility policy; coexistence/skew management; deprecation lifecycle; migration planning; migration execution/checkpointing; rollback/forward-fix; post-migration conformance; provider/state rebinding; consumer transition evidence; offline migration tooling.

## SB comparison
No broad repository-archaeology claim is made in this revisit. Existing research evidence indicates Generation 2 already needs explicit provider rebind continuity and negotiated-contract/conformance evidence; full SB implementation truth remains reserved for PLANNING_B.

## Reconciliation hypotheses
- GENERALIZE migration lineage across capability families.
- HARDEN deprecation/disablement/removal as distinct decisions.
- INTEGRATE compatibility/conformance evidence from Standards and Provider planes.
- PROVIDERIZE provider-specific realization/conversion mechanics.
- KEEP domain migration semantics with capability owners.
- DO_NOT_BUILD a universal reversible-migration promise.

## Repo-validation questions
1. Which current SB contracts distinguish semantic identity from revision and realized/provider identity?
2. Where are migration intent, attempt, partial progress and result represented separately?
3. Are deprecation, disablement and removal separate lifecycle states/decisions?
4. Which generated-runtime contracts support coexistence/version skew?
5. Can provider replacement preserve resource identity and state lineage?
6. Is post-migration conformance independently evidenced?
7. Can migrations execute and be verified self-hosted/offline?

## Symbiotic Proof
A portable definition at revision A can coexist with revision B; an external provider/runtime can be migrated or rebound without changing semantic object identity; the system records source/target, procedure revision, authority, attempts/checkpoints/results and post-transition conformance; provider-specific mechanics remain replaceable; rollback or forward-fix is explicit; proof remains inspectable offline.

## Stable findings
- **G2-FINDING-LVEM-11 — Semantic Object Identity, Revision Identity and Effective Realization Identity Are Distinct.** Evolution must not conflate a logical object with a schema/configuration revision or provider/runtime realization.
- **G2-FINDING-LVEM-12 — Compatibility Policy and Observed Compatibility Are Separate Evidence.** Declared support/skew rules constrain transitions but successful interoperability/conformance must be observed or tested.
- **G2-FINDING-LVEM-13 — Migration Intent, Plan, Attempt, Checkpoint and Result Require Independent Lineage.** A target version or migration file does not prove execution, atomicity or completion.
- **G2-FINDING-LVEM-14 — Deprecation, Disablement and Removal Are Distinct Lifecycle Decisions.** Warning users, stopping new use and making an interface unavailable have different authority, timing and recovery implications.
- **G2-FINDING-LVEM-15 — Rollback Is a New Governed Transition and Cannot Be Assumed Universally Reversible.** Irreversible or partially applied changes require forward-fix as a first-class recovery strategy.
- **G2-FINDING-LVEM-16 — Migration Completion Does Not Prove Post-Transition Conformance or Consumer Readiness.** Target realization, consumer/profile compatibility and runtime behavior require independent evidence after transition.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-MIGRATION-ATTEMPT-CHECKPOINT-RESULT-LINEAGE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-COMPATIBILITY-COEXISTENCE-WINDOW-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-POST-MIGRATION-CONFORMANCE-EVIDENCE` — CROSS_CUTTING.

Promotion remains deferred to synthesis and requires cross-capability confirmation.

## Value / risk / priority / next question
Value: very high because every providerized and portable capability eventually evolves. Risk: very high if revision, realization and migration evidence collapse into one status. Priority: foundational cross-cutting. Next question belongs to Security / Resilience / Failure Recovery: how failure domains, retries, recovery points and degraded modes compose with irreversible/partial migrations without granting Security ownership of domain evolution semantics.
