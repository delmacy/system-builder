# Generation 2 — Process & Application Modeling Edge-Case Register

Status: ACTIVE — Full Pass 1
Capability: Process & Application Modeling
Paired cluster: Process/Application × Workflow × Data/Schema
Research rule: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. This register catalogues/classifies patterns and detection candidates; it does not authorize remediation or implementation.

## Material local edge cases

### G2-EDGE-PROCESS-001 — stale-base semantic overwrite
A model proposal is syntactically valid but was authored against revision N while N+1 changed semantic ownership, branch meaning or referenced domain concepts.
- Preconditions/trigger: concurrent edit; stale base revision; commit/adoption attempted.
- Expected safe behavior: detect stale lineage and require semantic reconciliation or explicit supersession against the current base.
- Forbidden: last-write-wins adoption merely because the candidate validates structurally.
- Disposition: `INCONCLUSIVE` until conflict is reconciled; no canonical mutation.
- Owners: Process & Application Modeling; Lifecycle for coexistence; affected semantic owners.
- Evidence/currentness: current canonical revision, base revision, diff and affected-owner compatibility evidence.
- Recovery: rebase/reconcile and create a new lineage-preserving revision.
- Blast radius: process/system. Severity HIGH; misuse likelihood plausible.
- Proof: `PROCESS-ADV-PROOF-001` — stale-base candidates cannot silently replace newer canonical semantics.

### G2-EDGE-PROCESS-002 — lossy brownfield normalization promoted as canonical equivalence
Imported/provider-native process structures contain constructs that cannot be faithfully mapped, but normalization marks the result fully adopted.
- Expected safe behavior: preserve origin/transformation lineage and unresolved/lossy constructs as `PARTIAL/INCONCLUSIVE`.
- Forbidden: name/shape matching or successful parse establishing canonical equivalence.
- Owners: Process Modeling + Integration/import realization + affected semantic owner.
- Recovery: explicit mapping/adoption decision; retain external semantics when not portable.
- Blast radius: process/system. Severity HIGH; misuse likely in brownfield onboarding.
- Proof: `PROCESS-ADV-PROOF-002`.

### G2-EDGE-PROCESS-003 — process revision published while downstream realizations are skewed
A new process model references semantics requiring a new schema/workflow realization while old workflow instances and residual schema cohorts remain authoritative.
- Expected safe behavior: model publication remains distinct from downstream convergence; applicability/compatibility evidence stays owner-scoped.
- Forbidden: `model current => workflow/data/runtime converged`.
- Disposition: publication may succeed while realization readiness is PARTIAL/INCONCLUSIVE; activation must not infer convergence.
- Owners: Process Modeling + Workflow + Data/Schema + Lifecycle.
- Recovery: qualify coexistence/migration and residual cohorts before affected activation/cutover.
- Blast radius: process/system. Severity CRITICAL; misuse plausible.
- Proof: `PROCESS-ADV-PROOF-003`.

### G2-EDGE-PROCESS-004 — rollback target exists but semantic environment is no longer eligible
Historical model revision N exists, but schema, provider binding, policy or in-flight workflow state has evolved incompatibly.
- Expected safe behavior: historical availability is not rollback eligibility; affected owners requalify compatibility/currentness.
- Forbidden: restoring revision N solely because its artifact/model is retained.
- Owners: Lifecycle + Process Modeling + affected realization owners.
- Recovery: qualified rollback, forward correction or migration; preserve lineage.
- Blast radius: system. Severity CRITICAL; misuse plausible under incident pressure.
- Proof: `PROCESS-ADV-PROOF-004`.

### G2-EDGE-PROCESS-005 — pathological graph passes local validity but exhausts analysis/materialization
Acyclic or intentionally cyclic composition has extreme fan-out/fan-in/depth or recursive expansion that is semantically valid but computationally pathological.
- Expected safe behavior: bounded analysis/materialization with explicit resource-limit outcome and no unsafe simplified fallback.
- Forbidden: silently dropping branches/constraints, disabling authority checks or accepting partial graph as canonical.
- Owners: Process Modeling + Build/analysis consumers + Technology Economic Governance where cost limits apply.
- Recovery: reject/defer or require explicit bounded decomposition; preserve candidate without canonical adoption.
- Blast radius: station/system. Severity HIGH; misuse plausible.
- Proof: `PROCESS-ADV-PROOF-005`.

### G2-EDGE-PROCESS-006 — AI/low-code composition smuggles semantic-owner mutation
AI or low-code authoring composes a valid process change whose referenced action/form implies a new domain invariant, schema field, authority rule or provider identity adoption.
- Expected safe behavior: proposal is partitioned by semantic owner and escalated; AI remains proposer.
- Forbidden: successful process validation granting authority to mutate another owner's canonical truth.
- Owners: Process Modeling + Authorization + referenced semantic owner + AI/AGWS/UI authoring surface.
- Recovery: owner-scoped proposal/review; reject unauthorized portion.
- Blast radius: system/enterprise. Severity CRITICAL; misuse plausible.
- Proof: `PROCESS-ADV-PROOF-006`.

## Cross-capability material edge cases

### G2-XEDGE-PROCESS-WORKFLOW-DATA-001 — long-running instance crosses incompatible process/schema revisions
An instance started under process P1/schema S1 continues after P2/S2 become current; a later task interprets old state with new semantics.
- Safe: pin or explicitly qualify compatible revision vectors per instance/step; preserve historical applicability.
- Forbidden: resolving every step against latest process/schema by default.
- Effect: `INCONCLUSIVE` when applicability cannot be proven; do not destructively advance.
- Owners: Workflow + Process Modeling + Data/Schema + Lifecycle.
- Recovery: migrate instance with qualified transformation, continue pinned, or route human reconciliation.
- Severity CRITICAL; blast radius workflow instance→process; proof `XPROCESS-ADV-PROOF-001`.

### G2-XEDGE-PROCESS-WORKFLOW-DATA-002 — partial schema migration creates split semantic population
Process P2 assumes field/invariant S2, but only part of the authoritative population is migrated/backfilled; old and new cohorts coexist.
- Safe: cohort/applicability evidence gates process behavior; residual cohorts remain explicit.
- Forbidden: migration acknowledgement or new schema publication treated as population convergence.
- Effect: PARTIAL until qualified convergence.
- Owners: Data/Schema + Process Modeling + Workflow + Lifecycle.
- Recovery: reconcile cohorts/backfill and only then widen applicability.
- Severity CRITICAL; blast radius system; proof `XPROCESS-ADV-PROOF-002`.

### G2-XEDGE-PROCESS-WORKFLOW-DATA-003 — retry after ambiguous data mutation replays a process transition
Workflow times out after requesting a data mutation; transport evidence cannot prove whether the mutation applied, and the process retries the transition.
- Safe: `UNKNOWN -> reconcile-before-retry` unless operation-specific idempotency is qualified.
- Forbidden: timeout => NOT_APPLIED.
- Owners: Workflow + Data/Schema + Integration/provider realization.
- Recovery: reconcile authoritative data/effect identity, then continue/compensate.
- Severity CRITICAL; blast radius record→process; proof `XPROCESS-ADV-PROOF-003`.

### G2-XEDGE-PROCESS-WORKFLOW-DATA-004 — two individually valid process paths claim incompatible canonical postconditions
Concurrent branches/processes each pass local validation but write mutually incompatible states for the same domain fact.
- Safe: semantic owner defines compatibility/coordination; conflict remains explicit until authoritative ordering/selection exists.
- Forbidden: arbitrary event arrival, workflow completion order or provider acknowledgement selecting business truth.
- Owners: domain/data semantic owner + Process Modeling + Workflow.
- Recovery: serialize/coordinate, reconcile owner decision, or bounded compensation where qualified.
- Severity CRITICAL; blast radius record→process/system; proof `XPROCESS-ADV-PROOF-004`.

## Processual / semantic conflict catalogue

Default disposition for every pattern below: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

### G2-CONFLICT-PATTERN-STRUCTURAL-001 — incompatible terminal claims after valid branch composition
- Activation: reachable branches can terminate with mutually exclusive canonical postconditions or fan-in prerequisites that cannot coexist.
- Incompatible claims: each branch is locally valid; their terminal claims cannot jointly hold.
- Detection candidate: static graph/postcondition constraint analysis plus targeted N-wise branch composition; signal is not confirmation when domain predicates are data-dependent.
- Owners: Process Modeling + semantic owner of postconditions. Severity HIGH–CRITICAL; confidence supported; detectability static/pre-execution; blast process; reversibility bounded compensation→migration; time-to-harm immediate; misuse accidental/plausible; currentness requires current model and owner invariants; false-positive risk medium for intentionally exclusive branches.
- Future route: require owner reconciliation/explicit exclusivity semantics when observed. Preventive invariant candidate only for provably impossible fan-in/terminal conjunctions.
- Proof: `PROCESS-CONFLICT-PROOF-001`.

### G2-CONFLICT-PATTERN-VERSION-001 — individually valid revision set is composition-incompatible
- Activation: process P2, workflow W1 and schema S1/S2 cohorts coexist without a qualified compatibility relation.
- Incompatible claims: each revision is valid in isolation but their joint applicability is unproven or contradictory.
- Detection candidate: revision-vector compatibility/currentness check at admission and execution boundaries.
- Owners: Process Modeling + Workflow + Data/Schema + Lifecycle. Severity CRITICAL; confidence strongly supported by owner boundaries; detectability pre-execution/runtime; blast workflow→system; reversibility migration required; harm immediate/delayed; misuse plausible; false-positive risk low if compatibility evidence is explicit.
- Future route: pin, migrate, reconcile or block only the incompatible composition; never globally forbid coexistence.
- Proof: `PROCESS-CONFLICT-PROOF-002`.

### G2-CONFLICT-PATTERN-SEMANTIC-001 — duplicate ownership of one canonical fact/postcondition
- Activation: process/workflow/data definitions independently claim authority to determine the same business fact.
- Incompatible claims: local owners disagree on transition/postcondition semantics or provider evidence is elevated as canonical.
- Detection candidate: ownership-reference analysis plus runtime detection of competing authoritative mutations.
- Owners: canonical domain/data semantic owner; Process/Workflow are consumers unless explicitly delegated. Severity CRITICAL; confidence supported; detectability static+runtime; blast record→enterprise; reversibility potentially migration required; harm immediate/cumulative; misuse plausible; false-positive risk medium where delegated ownership is legitimate.
- Future route: require explicit owner/delegation selection and lineage; catalogue signal until ownership evidence confirms conflict.
- Proof: `PROCESS-CONFLICT-PROOF-003`.

### G2-CONFLICT-PATTERN-AI-LOWCODE-001 — safe primitives compose into unauthorized semantic mutation
- Activation: AI/low-code author combines individually admitted actions/fields/transitions so aggregate behavior changes another owner's invariant or authority envelope.
- Incompatible claims: component admission says each primitive is valid; composition semantics exceed delegated authority.
- Detection candidate: design-time semantic-owner/authority dependency analysis and commit-time authority revalidation.
- Owners: Process Modeling + Authorization + affected semantic owner. Severity CRITICAL; confidence strongly supported by non-amplification principle; detectability static/pre-execution; blast station→enterprise; reversibility migration/compensation; harm immediate; misuse accidental/adversarial; false-positive risk medium for explicitly delegated compositions.
- Future route: split/escalate proposal; do not treat AI confidence or UI visibility as authority.
- Proof: `PROCESS-CONFLICT-PROOF-004`.

## Saturation result

First adversarial visit produced material local, cross-capability and conflict-pattern findings. Local and paired-cluster no-material streaks remain `0`. No ConflictInstance is asserted. No implementation or preventive architecture was created.