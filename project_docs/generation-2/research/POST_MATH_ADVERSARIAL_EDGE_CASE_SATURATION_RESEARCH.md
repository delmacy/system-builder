# Generation 2 — Post-Math Adversarial Edge-Case Saturation Research

Status: QUEUED_AFTER_MATHEMATICAL_RESEARCH
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Authority: `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`

## 1. Purpose

This phase exists to reduce the risk that Generation 2 target architecture is designed only for happy paths. It performs repeated adversarial research over every canonical capability and over cross-capability compositions before `PLANNING_C_TARGET_ARCHITECTURE` may begin.

The phase does **not** claim that bugs or misuse can be eliminated. Its purpose is to expose failure modes, dangerous assumptions, ambiguity, authority escalation, unsafe retries, version skew, pathological inputs, partial effects, provider divergence and cross-capability interactions early enough that the target architecture can carry explicit invariants and proof obligations.

## 2. Entry gate

Enter only after:

1. `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` is `CLOSED / PASS` for all canonical capabilities;
2. `RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION` is `CLOSED / PASS`;
3. any bounded synthesis / Planning-A ownership backfill required by the mathematical research is complete.

Do not enter `PLANNING_C_TARGET_ARCHITECTURE` directly from mathematical research.

## 3. Research depth and saturation policy

This is a saturation-driven campaign, not a quota-driven campaign.

- Minimum adversarial full passes: **8**.
- Target reference: **12** full passes.
- There is **no maximum** number of passes.
- The phase must continue beyond 8 or 12 passes whenever material new failure modes, misuse paths, boundary ambiguities, architectural contradictions or proof obligations continue to appear.
- A pass is only a full pass when every current canonical capability has been challenged and the required cross-capability interaction set for that pass has been exercised.
- Specialized deep dives do not count as full passes by themselves.

Saturation requires at minimum:

1. all canonical capabilities have a maintained Edge-Case Register;
2. all material edge cases have a semantic owner or an explicit unresolved-owner blocker;
3. all HIGH/CRITICAL scenarios have expected safe behavior, forbidden behavior and a proof obligation;
4. every canonical capability has at least two consecutive eligible revisits with no material new local edge-case finding;
5. every high-risk cross-capability cluster has at least two consecutive eligible revisits with no material new interaction finding;
6. no unresolved path allows silent authority amplification, silent data corruption, unsafe retry after ambiguous mutation, hidden provider lock-in, false convergence, false rollback safety, or unqualified historical recomputation;
7. remaining unknowns are explicitly classified as repository-validation-, provider-validation-, implementation-proof-, or operational-observation-bound rather than silently treated as safe;
8. a final negative-space adversarial review fails to discover a material unowned failure/misuse category.

A material new finding resets the relevant local or cross-capability saturation streak.

## 4. Per-capability adversarial families

Every capability must be challenged against at least the following families where applicable:

### 4.1 Input and data pathology

- null / missing / empty / malformed;
- duplicate / replayed / stale / contradictory;
- minimum / maximum / zero / negative / extreme magnitude;
- invalid encoding / locale / timezone / unit / currency / precision;
- schema or contract version skew;
- untrusted or provider-native identity presented as canonical;
- partial data population and residual old cohorts.

### 4.2 Time, ordering and concurrency

- simultaneous mutations;
- stale base revision;
- lost update;
- duplicate event;
- out-of-order event;
- delayed event;
- timer drift / clock skew / DST boundary;
- long-running state crossing policy/schema/provider revisions;
- race between cancellation, approval, payment, allocation, release or rollback.

### 4.3 Partial and ambiguous effects

Challenge `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` semantics. A timeout or transport failure must never be assumed to mean `NOT_APPLIED` unless the qualified operation contract proves it. `UNKNOWN` mutating effects require reconciliation before unsafe retry unless operation-specific idempotency is explicitly qualified.

### 4.4 Provider degradation and substitution

- provider unavailable;
- provider accepts but later fails;
- rate limit / quota / partial capacity;
- eventual consistency;
- provider returns incomplete or stale evidence;
- semantic mismatch despite matching feature names;
- old and new providers coexist;
- residual provider cohorts remain authoritative after cutover;
- offline / air-gapped / intermittent operation;
- provider-specific identifiers leak into canonical truth.

### 4.5 Versioning and migration

- current definition with old runtime;
- old workflow with new schema;
- formula revision changes during historical reporting;
- provider replacement while durable instances are in flight;
- rollback target exists but is no longer eligible;
- migration acknowledged but not converged;
- residual old consumers, caches, replicas, schemas, workflows or credentials remain;
- correction/supersession must preserve historical lineage.

### 4.6 Authority and misuse

- user loses authority after starting a long-running action;
- Role/Station change while work is in flight;
- lower scope attempts to weaken inherited constraint;
- AI proposes or materializes a change outside its authority envelope;
- personal automation attempts promotion to team/system semantics;
- UI visibility mistaken for authorization;
- provider credentials or external IDs used to bypass canonical authority;
- approval self-dealing, confused deputy and privilege escalation patterns;
- malicious or careless low-code composition.

### 4.7 Recovery and false safety

- backup exists but restore is unusable;
- process restarted but domain effect remains ambiguous;
- runtime healthy while business state is not converged;
- artifact retained but rollback is unsafe;
- historical evidence exists but is stale for current qualification;
- recovery returns service without reprotection or residual-cohort disposition.

### 4.8 Scale and resource exhaustion

- extremely large graphs;
- fan-out / fan-in explosions;
- high concurrency;
- unbounded retries;
- recursive or cyclic definitions;
- queue/backlog pressure;
- very large documents/media;
- excessive formula dependency chains;
- high-cardinality telemetry;
- provider limits and quota exhaustion;
- cost blowups caused by valid but pathological composition.

## 5. Mathematical / formula edge cases

The preceding mathematical research is an input, but this phase must adversarially challenge it again, including:

- divide by zero;
- decimal precision loss;
- rounding mode disagreement;
- currency mismatch;
- unit mismatch;
- overflow / underflow;
- invalid rate / negative rate / percentage outside expected domain;
- time-duration and timezone boundary errors;
- missing dependent values;
- formula dependency cycles;
- live recomputation changing historical financial or operational truth;
- stale FormulaRevision;
- provider/engine disagreement for the same canonical FormulaDefinition;
- AI-generated formula that is syntactically valid but semantically unauthorized.

Preserve `StoredFact != DerivedValue`, `FormulaDefinition != FormulaEvaluation`, `FormulaRevision != CalculationResult`, `live recomputation != historical snapshot`.

## 6. Cross-capability interaction research

Local correctness is insufficient. Maintain a `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` and repeatedly test high-risk combinations.

Minimum clusters include:

1. Process/Application × Workflow × Data/Schema;
2. Workflow × Integration × Messaging × external mutation;
3. Identity × Authorization × Station × AGWS × AI;
4. Data/Schema × Privacy × Storage × Lifecycle;
5. Build × Artifact/Release × Deployment × Runtime;
6. Provider/Binding × every capability with external realization;
7. Secrets/Config × Runtime × Provider substitution;
8. Mathematical Expressions × Workflow × Data × UI/Form × Commercial Metering/FinOps;
9. Observability × Security/Recovery × runtime truth;
10. Extension/Plugin × authority × provider trust × lifecycle;
11. Commercial Metering × Entitlements × Rating × Billing × Payment;
12. Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution.

Add new clusters whenever findings reveal a material interaction.

## 7. Scenario format

Maintain stable IDs such as:

`G2-EDGE-<CAPABILITY>-NNN`

and cross-capability IDs:

`G2-XEDGE-<CLUSTER>-NNN`.

Each material scenario records:

- scenario;
- preconditions;
- trigger;
- affected canonical subjects/revisions;
- expected safe behavior;
- explicitly forbidden behavior;
- failure/effect disposition;
- semantic owner(s);
- provider-specific versus portable semantics;
- authority boundary;
- evidence/currentness requirement;
- recovery/reconciliation path;
- blast radius;
- severity and exploitability/misuse likelihood;
- proof obligation;
- architecture consequence candidate;
- saturation status.

## 8. Required adversarial techniques

Rotate techniques instead of repeating the same questions:

- boundary-value analysis;
- state-transition and lifecycle abuse;
- concurrency/race analysis;
- fault injection thought experiments;
- partial-failure analysis;
- retry/idempotency analysis;
- version-skew matrix;
- provider-differential analysis;
- negative permission/authority analysis;
- misuse/abuse-case analysis;
- threat-inspired but architecture-focused review;
- property/invariant reasoning;
- model-checking candidates for critical state machines;
- mutation/property-based testing candidates;
- chaos/failure-recovery proof candidates;
- combinatorial/pairwise and targeted N-wise cross-capability analysis;
- negative-space review.

Use papers, standards/specifications, mature systems, provider documentation, engineering incident reports/postmortems and strong industrial design material. Extract portable principles; do not copy product-specific mechanisms as universal architecture.

## 9. Required artifacts

Create and maintain at minimum:

- `project_docs/generation-2/research/edge-cases/EDGE_CASE_INDEX.md`;
- `project_docs/generation-2/research/edge-cases/CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`;
- per-capability edge-case registers or clearly indexed dossiers;
- `project_docs/generation-2/research/edge-cases/ADVERSARIAL_SATURATION_STATE.json`;
- `project_docs/generation-2/research/edge-cases/ADVERSARIAL_NEGATIVE_SPACE_REVIEW.md`;
- `project_docs/generation-2/research/edge-cases/ADVERSARIAL_SATURATION_REPORT.md`.

## 10. Architecture handoff rule

Do not solve every finding during research by inventing target modules. Produce architecture consequences and proof obligations. When a finding reveals a clear missing universal primitive or semantic owner, record it and perform only the bounded synthesis/Planning-A backfill necessary before Planning C.

`PLANNING_C_TARGET_ARCHITECTURE` remains blocked until this phase is `CLOSED / SATURATED / PASS`.

Planning C must consume the Edge-Case Index, cross-capability matrix, unresolved-risk register and proof obligations as first-class inputs.

## 11. Safety principle

The desired result is not a claim of “no bugs”. The desired result is that known classes of failure and misuse become explicit, ownered, bounded and testable, and that the architecture does not silently convert insufficient evidence into success.

Canonical principle:

> Every capability must define not only what it does when assumptions hold, but what it does when those assumptions fail — and cross-capability composition must preserve that safety property.
