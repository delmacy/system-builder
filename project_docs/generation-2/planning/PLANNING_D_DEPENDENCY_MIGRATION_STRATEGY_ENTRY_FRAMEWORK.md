# Generation 2 — Planning D Dependency & Migration Strategy Entry Framework

Status: **ACTIVE / ENTRY FRAMEWORK ESTABLISHED**  
Phase: `PLANNING_D_DEPENDENCY_MIGRATION_STRATEGY`  
Scope: dependency/migration planning only. No Planning E, Architecture Reconciliation phase, WBS, Work Packages, executive TASKs, Construction, remediation or product code.

## 1. Authority and inherited constraints

Planning C is `CLOSED / PASS` with C0/C1/C2 and C3.1–C3.28 reconciled. Planning D therefore plans how the current System Builder can move toward that target without treating target architecture as current implementation truth and without converting inherited research findings into remediations.

The inherited adversarial inventory remains 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings. `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict` remain constitutional.

Planning D MUST preserve:

- typed semantic ownership and owner-preserving references;
- `ExecutionEnvelope`, `ExecutionState`, append-oriented `ExecutionJournal`, and `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN` effect qualification;
- `UNKNOWN -> reconcile-before-retry` for ambiguous harmful external mutations unless operation-specific duplicate safety is proven;
- provenance, evidence, currentness and authority as distinct predicates;
- immutable producing revisions, `RevisionVector`, history and residual cohorts;
- provider/binding support vectors and staged qualification/substitution;
- Brownfield/Legacy Mirroring as evidence-first assimilation;
- local/Station/Fleet autonomy and currentness boundaries;
- queue/backpressure/capacity where convergence depends on work drainage;
- bounded Physical/Peripheral integration/governance only, with no generic direct physical actuation capability;
- C1 Elicitation/System Understanding no-false-complete rules and dimensional coverage.

## 2. Planning D question

Planning D answers:

> In what dependency order, coexistence envelopes and governed migration transitions can the current SB evolve toward the closed Planning C target while preserving historical truth, current service, authority boundaries, recoverability and evidence?

It does **not** answer implementation task decomposition, acceptance/product proof execution, or construction sequencing.

## 3. Migration unit and dependency graph

The migration unit is not merely a package or database table. Each migration record MUST identify, when applicable:

1. semantic owner/predicate being introduced, generalized or transferred;
2. current source(s) of truth and target source of truth;
3. current and target revisions plus relevant `RevisionVector` dimensions;
4. readers, writers, external effectors and evidence producers;
5. provider/binding realizations and support-vector requirements;
6. in-flight work pinned to older definitions/revisions;
7. historical populations that must remain interpretable;
8. residual cohorts that can continue producing effects after nominal cutover;
9. queue/backlog/reconciliation populations and drain conditions;
10. rollback/abort/reconciliation semantics;
11. elicitation/evidence gaps whose unresolved state prevents safe migration;
12. Planning E proof routes required before a migration may be considered complete.

Dependencies are typed rather than reduced to one total ordering. Planning D uses at least:

- `SEMANTIC_PREREQUISITE` — target predicate/reference cannot be expressed safely before predecessor semantics exist;
- `AUTHORITY_PREREQUISITE` — migration cannot proceed before canonical authority/source-of-truth ownership is explicit;
- `REVISION_PREREQUISITE` — producing/consuming revision identity must exist before coexistence or conversion;
- `EVIDENCE_PREREQUISITE` — cutover requires observable evidence/reconciliation capability first;
- `PROVIDER_PREREQUISITE` — realization must be qualified before substitution/admission;
- `DATA_PREREQUISITE` — target representation/translation must exist before writer movement;
- `OPERABILITY_PREREQUISITE` — queues, telemetry, rollback/abort or recovery must be available before risky cutover;
- `TRUST_PREREQUISITE` — identity/authorization/trust/secrets constraints must be satisfied before exposure;
- `LOCALITY_PREREQUISITE` — Station/Fleet/offline behavior must be qualified before central/local ownership movement.

A dependency edge does not itself authorize migration.

## 4. Migration state machine

Planning D adopts the following planning-level state vocabulary for a migration slice:

`DISCOVERED -> QUALIFIED -> COEXISTENCE_READY -> SHADOWING -> PARTIAL_CUTOVER -> CUTOVER -> RESIDUAL_DRAIN -> RECONCILED -> CLOSED`

Exceptional dispositions are first-class:

`BLOCKED | CONFLICTED | ABORTED | ROLLED_FORWARD | ROLLED_BACK_WHERE_REVERSIBLE | MANUAL_RECONCILIATION_REQUIRED`.

No state transition may silently erase `PARTIAL`, `UNKNOWN`, contradictory evidence or residual populations.

`rollback available != rollback semantically reversible`.

Where external effects, schema evolution, irreversible provider operations, physical/peripheral side effects or historical observations cannot be undone, the strategy MUST use roll-forward/reconciliation rather than pretending inverse execution exists.

## 5. Source-of-truth movement protocol

Source-of-truth movement is a governed decision, not an emergent consequence of dual writes or provider availability. Every ownership-changing migration must plan these checkpoints:

1. identify current authoritative writer(s) and readers;
2. establish target semantic identity/revision and translation boundaries;
3. establish shadow/read comparison without promoting observations to authority;
4. qualify divergence, lossiness, `UNKNOWN` and historical interpretation;
5. admit target writers only after authority and reconciliation prerequisites are satisfied;
6. fence or explicitly coexist with old writers;
7. move canonical authority by explicit disposition;
8. drain residual writers, callbacks, queues, sessions, grants, caches, providers and offline populations;
9. verify currentness/convergence without rewriting historical producing truth;
10. close only when residual-cohort and evidence obligations are dispositioned.

Dual write is therefore a temporary migration mechanism, never two simultaneous canonical truths by default.

## 6. Elicitation/System Understanding migration constraints

C1 remains a migration prerequisite, not merely an authoring UX concern. Planning D must preserve free-form and structured evidence while progressively introducing the versioned Elicitation Knowledge Base.

Migration MUST NOT:

- turn stakeholder claims, imported documents or AI summaries into canonical facts merely because they were normalized;
- treat answered questions as understood dimensions;
- convert `Deferred` into `Resolved` or `OutOfScope` into `NotApplicable`;
- hide contradictions through merge/summarization;
- close a HIGH/CRITICAL migration dimension while owner, source-of-truth, currentness, failure/recovery, authority, evidence or cross-capability dependency is unresolved;
- discard source/respondent/time/evidence/supersession provenance when transforming legacy/free-form material;
- infer publish/operation readiness from implementation or migration progress.

Coverage remains dimensional using `UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`. No scalar migration/completeness score may mask critical gaps.

## 7. Initial dependency strata

The following strata are a partial order for Planning D elaboration, not Work Packages and not Construction waves.

### D0 — Migration constitution and observability prerequisites

Establish the migration record schema, typed dependency edges, source-of-truth movement protocol, revision/residual-cohort vocabulary, reconciliation evidence, queue/backpressure visibility, rollback/abort dispositions and no-false-complete rules.

### D1 — Semantic substrate and elicitation coexistence

Plan coexistence for canonical identity/revision/reference semantics, typed information kinds, Elicitation Knowledge Base, free-form evidence, contradictions, adaptive routing and owner-preserving question/capability linkage.

### D2 — Authority, identity, trust and secrets prerequisites

Plan identity/authentication/federation, authorization/organization/multitenancy, enterprise trust/PKI, secrets/config and security/resilience dependencies before downstream surfaces may rely on stronger authority/trust claims.

### D3 — Data, workflow and external-effect semantics

Plan data/schema migration, workflow in-flight revisions, durable execution/effect journals, integration/automation and messaging semantics with `UNKNOWN`, idempotency horizons, replay/reconciliation and historical producer revision preservation.

### D4 — Provider/binding and physical/peripheral realization

Plan provider qualification/substitution, support vectors, coexistence/cutover, residual provider cohorts and bounded Physical/Peripheral realization without introducing generic actuation authority.

### D5 — Build, artifact, deployment and lifecycle supply path

Plan dependency/material identity, reproducibility, artifact/release/provenance, deployment/runtime, lifecycle/version evolution and rollback/roll-forward relationships with revision-qualified evidence.

### D6 — Experience, documents, observability and operations

Plan generated UI/low-code projections, storage/documents/media, observability/incident semantics and developer/operator/self-hosting paths after their semantic and authority prerequisites are expressible.

### D7 — Governance, economics and analytical derivations

Plan governance/compliance/privacy, commercial/entitlements, FinOps and analytical/temporal/transformation semantics while preserving units, currencies, vectors, uncertainty, correction lineage and non-amplifying derived claims.

### D8 — Architecture reconciliation capability migration

Plan how desired/declared/reference architecture and observed/effective/runtime evidence can coexist and reconcile across all migrated strata without making reconciliation itself a silent authority transfer.

These strata may overlap under explicit prerequisites; they are not permission for big-bang migration.

## 8. Brownfield / Legacy Mirroring

Brownfield migration uses:

`discover -> source/revision -> extract -> map -> fidelity classification -> unresolved semantics -> proposal -> owner adoption -> canonical revision`.

Observed behavior, spreadsheets, scripts, workarounds, verbal approvals, copy/paste paths, off-channel communication, emergency/manual procedures, key-person knowledge and unofficial exceptions remain evidence/candidates until owner disposition. Lossy/ambiguous/unsupported mappings remain explicit and can block migration of affected semantics.

## 9. Local / Station / Fleet and Physical/Peripheral

A migration cannot infer central truth from Fleet visibility or local truth from connectivity. Offline/local populations retain producing revision/currentness information; reconnect is a reconciliation boundary.

Physical/Peripheral planning is restricted to integration/governance: device/provider identity, topology, permissions, observation, command/effect correlation, safety/currentness evidence and lifecycle. No Planning D record may create a generic direct physical actuation capability. Ambiguous physical effect remains `UNKNOWN` until domain-qualified reconciliation.

## 10. Capacity and convergence

Migration readiness is not just semantic correctness. Any transition depending on queues, replication, callbacks, replay, provider propagation, reconciliation, certificate rotation, revocation, metering, indexing or residual cohort drainage must declare:

- population/backlog scope;
- admission and processing capacity assumptions;
- retry/replay horizon;
- convergence/currentness objective;
- overload/backpressure behavior;
- evidence that closure is drainable rather than indefinitely accumulating debt.

`accepted != processed != converged` remains explicit.

## 11. Planning D record template

Each subsequent Planning D decision should include:

- capability/cross-cutting slice and semantic owner;
- current-state anchor from Planning B;
- target-state anchor from Planning C;
- typed incoming/outgoing dependencies;
- current/target source-of-truth and writer/read paths;
- coexistence strategy;
- revision/history/in-flight treatment;
- provider/binding and residual cohorts;
- migration states and transition guards;
- rollback/abort/roll-forward/reconciliation semantics;
- queue/capacity/currentness conditions;
- Brownfield/Legacy Mirroring path where applicable;
- Elicitation/System Understanding coverage lens;
- bounded Physical/Peripheral impact where applicable;
- Planning E proof obligations;
- blockers and next ordered Planning D action.

## 12. Entry gate result

**Result: PASS_FOR_ENTRY_FRAMEWORK.**

Planning D is now `ACTIVE / OPEN`. This artifact establishes its migration constitution and initial dependency strata only. It does not claim that any capability migration strategy is complete and does not authorize Planning E or later phases.

The next Planning D action must elaborate **D0 — Migration Constitution / Cross-Cutting Dependency Graph** into an authoritative dependency/migration matrix before capability-specific migration records are advanced.