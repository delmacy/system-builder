# Planning B — Developer / Operator Experience / Self-hosting — SB Current State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Canonical capability: Developer / Operator Experience / Self-hosting
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact reconciles only evidenced current System Builder state against the Planning A boundary. It does not define target architecture and does not execute product code, Work Packages, executive TASKs, Construction, PR or worker handoff.

## 1. Current-state evidence

### Repository/bootstrap developer surface

The repository is explicitly local-first and declares Node.js `>=24 <25` and npm `>=11`. The root package exposes deterministic engineering/operator commands for task lifecycle, pipeline control, verification, factory E2E and a dedicated `factory:bootstrap` entry point. The root README documents a clone/install/local-bootstrap path and preserves the constitutional rule that published runtimes remain operational without Builder availability.

Disposition: **KEEP + HARDEN**. There is a real maintained developer entry surface, but it is primarily repository-engineering bootstrap rather than a generalized installed-product operational-profile model.

### Versioned operator bootstrap contract

`FactoryOperatorBootstrap` is a first-class versioned contract (`1.0.0`). It requires declared Node/npm/E2E prerequisites, canonical factory input and an explicit input path. Validation is fail-closed, exact-field and canonical-identity aware. It does not itself invoke the factory, read environment state or synthesize domain input.

The operator-visible progress result is derived only after the canonical E2E result exists. Every journey stage must match the canonical stage order and carries identity/provenance references. Rejected or partial journeys therefore cannot manufacture downstream completion progress.

Disposition: **KEEP + GENERALIZE**. This is strong evidence for operator-boundary discipline and truth-preserving progress semantics. It is not yet evidence of the broader bootstrap/install/readiness lifecycle from Planning A.

### Actionable diagnostics

The factory bootstrap command classifies operator-actionable failures into `INVALID_OPERATOR_INPUT`, `MISSING_PREREQUISITE`, `UNAVAILABLE_CAPABILITY` and `CANONICAL_E2E_REJECTED`, each with a bounded corrective action. The command delegates once to the canonical E2E executor after validation and returns canonical progress/result instead of introducing a shadow operational truth.

Disposition: **KEEP + HARDEN**. Current diagnostics are useful and bounded, but there is no generalized typed effect-disposition model here for `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`, no evidence-currentness model and no cross-capability guided-repair framework.

### Runtime materialization and autonomy

Fresh main contains runtime materialization/handoff and product-proof evidence that generated runtimes continue operating while Builder/Observe control-plane URLs are unavailable. Current deployment reconciliation also established provider-neutral environment references, verified local-process realization, explicit startup/health diagnostics, durable deployment records and restart reconciliation.

Disposition: **KEEP + INTEGRATE**. These are strong self-hosting/autonomy foundations owned chiefly by Deployment/Runtime. Developer/Operator Experience should continue presenting them rather than redefining their truth.

## 2. What is evidenced today

Current SB evidences:

- a documented local developer bootstrap path;
- explicit repository runtime prerequisites;
- a versioned, fail-closed operator bootstrap contract;
- canonical identity/provenance references in operator progress;
- progress that is not synthesized before canonical journey success;
- actionable bootstrap failure classification;
- a dedicated CLI entry point rather than hidden internal-only invocation;
- provider-neutral environment/configuration references in adjacent deployment/configuration owners;
- generated-runtime materialization and Builder-off autonomy proofs;
- startup/health diagnostics and durable single-host deployment reconciliation in adjacent Deployment/Runtime state;
- anti-lock-in intent and runtime autonomy as repository-level invariants.

These facts support retaining the current operator/bootstrap seam rather than replacing it.

## 3. Material gaps against Planning A

Fresh-main evidence does **not** establish the following as first-class Developer / Operator Experience semantics:

1. revisioned install/bootstrap workflow identity spanning prerequisite evaluation, authorization/policy checks, preparation, actuation, reconciliation, convergence and validated readiness;
2. explicit Operational Profiles for local, simple self-hosted, multi-node, managed-provider-backed, disconnected/air-gapped and hybrid operation;
3. profile support/dependency/currentness vectors or declared operational burden/availability/durability characteristics;
4. generalized installer/upgrade/maintenance lifecycle distinct from the repository factory bootstrap;
5. an operator-facing model for `PARTIAL / INCONCLUSIVE` evidence or `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` mutation effects;
6. generic reconcile-before-retry behavior for ambiguous remote administrative mutations;
7. support-bundle contracts with provenance, collection coverage, redaction/minimization and partial-completeness semantics;
8. backup/restore runbook UX clearly separated from backup identity, restore eligibility and validated recovered service;
9. explicit disconnected/air-gapped retained-closure vectors and bounded evidence/currentness horizons;
10. reconnection workflows preventing stale local state from becoming enterprise truth without reconciliation;
11. provider/configuration portability assistants that surface semantic support gaps and unresolved mappings;
12. generalized upgrade UX separating release eligibility, deployment actuation, schema/data migration, configuration restoration and recovery qualification;
13. current authorization hierarchy `Enterprise → Station → Role → Person` applied to operator/admin affordances;
14. Station-scoped delegated administration and capability exposure in the operator experience;
15. AI/AGWS operator assistance contracts proving non-amplification of provider/runtime/admin authority;
16. generalized dry-run/preview/impact contracts qualified by underlying capability truth;
17. full self-hosted persistence/topology installation guidance beyond the currently proven local generated-runtime path.

Absence here is an evidence statement, not a target-architecture mandate.

## 4. Current-state truth boundaries

The fresh-main evidence is consistent with the Planning A constitutional boundary:

`operator workflow state != underlying capability truth != provider acknowledgement != runtime-effective truth`.

The current bootstrap contract is particularly strong because it derives visible completion only from canonical E2E output and preserves identity/provenance. This should be retained as evidence that convenience need not become a second source of truth.

However, the broader current operator surface does not yet evidence typed `INCONCLUSIVE`/currentness behavior. Therefore a command success, bootstrap completion, health probe or local process existence must not be generalized into claims of security, recoverability, compliance, portability or enterprise-wide convergence.

## 5. Self-hosting and portability interpretation

Fresh main proves a meaningful subset of self-hosting: local materialization of generated runtimes plus continued operation with Builder/Observe control-plane endpoints unavailable. This is stronger than a mere packaging claim.

It does **not** prove a generalized self-hosted operational-profile family, indefinite offline validity, air-gap maintenance, multi-node topology, backup/recovery closure or provider substitution. Those remain unevidenced.

Provider/runtime IDs remain realization identities unless a governed canonical transition explicitly adopts them. Nothing in the inspected bootstrap surface requires provider IDs to become canonical identity.

## 6. Failure and ambiguity semantics

Current bootstrap failure semantics are fail-closed and actionable for declared prerequisites/input/capability availability. This is a useful current-state primitive.

No generalized evidence was found that operator mutations across providers/runtime systems expose `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` or reconcile an `UNKNOWN` result before retry. Therefore Planning A's `UNKNOWN → reconcile-before-retry` rule remains a Generation 2 gap, not an implemented-current-state claim.

Likewise, stale or partial operational evidence is not yet represented generically as `PARTIAL / INCONCLUSIVE`; positive current-state claims must stay bounded to the specific proofs that exist.

## 7. Authority, Station, AGWS and AI

No inspected fresh-main operator/bootstrap contract establishes the complete `Enterprise → Station → Role → Person` administrative hierarchy or Station capability-exposure semantics. Do not infer them from CLI availability, process ownership or authenticated access.

No inspected current-state evidence grants AI or Adaptive Governed Work Surfaces independent operator authority. They therefore remain non-amplifying: future assistance may explain/propose/compose only within current authority and cannot manufacture readiness/evidence, retry ambiguous effects automatically, extend offline horizons or canonize provider IDs.

Disposition: **INTEGRATE** with Authorization/Policy and AGWS boundaries later; do not place authority truth inside Operator Experience.

## 8. Capability-boundary reconciliation

- **Deployment / Environment / Runtime** owns runtime generation, actuation, convergence, health and retained runtime closure. Operator Experience presents/invokes those facts.
- **Secrets / Configuration / Environment Portability** owns config/secret references, values, revisions/currentness and provider realizations. Operator Experience owns editing/import/export ergonomics only where evidenced.
- **Observability / Operations / Incident** owns telemetry/evidence freshness/coverage and incident truth. Operator Experience may compose diagnostics without redefining evidence.
- **Security / Resilience / Failure Recovery** owns recovery qualification and degraded-mode safety. Operator runbooks do not prove recovery.
- **Provider / Binding / Capability Negotiation** owns provider discovery, support vectors, qualification, binding and substitution semantics.
- **Lifecycle / Versioning / Evolution / Migration** owns revision/coexistence/migration/withdrawal semantics behind upgrade UX.
- **Universal Capability Architecture** remains the intended cross-cutting home for typed identity/revision/evidence/effect/currentness primitives rather than turning the operator layer into a god-object.

## 9. Evidenced dispositions

| Disposition | Current-state decision |
|---|---|
| KEEP | root developer/bootstrap commands; versioned operator bootstrap contract; exact fail-closed prerequisite/input validation; canonical identity/provenance progress; actionable bootstrap diagnostics; runtime autonomy proofs |
| HARDEN | prerequisite/readiness semantics; diagnostics with evidence/currentness; explicit distinction between command success and effective operational outcome |
| GENERALIZE | operator bootstrap/runbook identity; progress/effect presentation; operational profile ergonomics; support/diagnostic export semantics |
| PROVIDERIZE | provider-specific installation, diagnostics, backup, restore, migration and offline mechanics only behind qualified provider boundaries |
| INTEGRATE | Deployment/Runtime, Secrets/Configuration, Observability, Security/Recovery, Provider/Binding, Lifecycle, Authorization and UCA owners |
| REPLACE | none evidenced |
| DEFER | mature multi-node/air-gap/profile variants whose applicability and provider support are not yet evidenced in current SB |
| DO_NOT_BUILD | a shadow operator truth store; provider-specific self-hosting universe; UX that equates completion with authorization/readiness/recovery/compliance |

## 10. Planning B result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main has a substantive and disciplined operator bootstrap seam plus local generated-runtime autonomy. The seam should be retained and generalized, not replaced. The broad Generation 2 Developer / Operator Experience / Self-hosting capability remains only partially represented: operational profiles, generalized install/upgrade/runbook semantics, support bundles, offline-currentness, backup/recovery UX, ambiguous-effect reconciliation, full authority hierarchy and provider-portability ergonomics remain unevidenced gaps.

No new research finding or capability candidate is created by this reconciliation. Planning B must continue in canonical order with **Provider / Binding / Capability Negotiation**. Planning C remains blocked; when Planning B reaches 28/28, the mandatory next phase is `RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION`.
