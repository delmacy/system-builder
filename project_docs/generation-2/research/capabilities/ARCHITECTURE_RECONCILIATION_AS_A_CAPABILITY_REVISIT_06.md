# Generation 2 — Architecture Reconciliation as a Capability — Revisit 06

## Scope and research question

How should System Builder Generation 2 reconcile external evidence, current product truth, target architecture, migration intent and observed effective state without allowing a reconciliation mechanism to become the semantic owner of the capabilities it evaluates?

This revisit is research-by-exception. It stress-tests applicability-scoped reconciliation/admission claims, stale evidence, desired-versus-observed state, ambiguous actuation, mixed provider/tool support, dependency closure, residual cohorts, disconnected evidence and delegated authority. It does not implement product code and does not execute Work Packages.

## Representatives and evidence ledger

| Representative | Evidence used | Contribution | Coverage |
|---|---|---|---|
| Kubernetes Deployment/controller status | https://kubernetes.io/docs/reference/kubernetes-api/apps/deployment-v1/ | Separates desired object/spec from controller-observed status; `observedGeneration` identifies which generation the controller actually observed; Conditions represent latest observations. | DEEP |
| HashiCorp Terraform / HCP Terraform saved-plan workflow | https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/cli | Saved plans become stale when the state they were planned against is no longer valid; stale plans are detected/discarded; drift outside the governed pipeline is explicitly hazardous. | DEEP |
| Argo CD reconciliation/diff | https://argo-cd.readthedocs.io/en/stable/faq/ | A successful Sync can still be followed by `OutOfSync`; sync actuation and observed desired/live convergence are distinct facts. | DEEP |
| Crossplane managed resources | https://docs.crossplane.io/latest/managed-resources/managed-resources/ | `managementPolicies` distinguish Observe/Create/Update/Delete authority, including observe-only operation; provider support for management policies is itself conditional. | DEEP |
| Flux Kustomization/Conditions | https://fluxcd.io/flux/components/kustomize/kustomizations/ | Dependency readiness may require `Ready=True` plus `generation == observedGeneration`; reconciliation and dependency closure are revision-sensitive. | DEEP |

The representatives intentionally span controller reconciliation, declarative infrastructure planning, GitOps, provider-backed managed resources and dependency-aware reconciliation rather than repeating one product family.

## Source of truth and typed identity model

Architecture reconciliation must not collapse different facts into a scalar `reconciled=true`. The minimum typed lineage is:

`ArchitectureEvidence → Finding → ProductTruth → Gap → Disposition → ReconciliationPlan → ExecutionAttempt → Acceptance → EffectiveState → Proof`.

Each identity is independently versioned and attributable. A useful qualification key includes at least: semantic owner, subject/resource/system, evidence revision and freshness, product-truth revision, target-architecture revision, provider/runtime/tool realization, policy/authority revision, dependency closure, consumer/population cohort, Station, observation time and evidence replay horizon.

`ProductTruth` means evidence-backed current System Builder reality. `TargetIntent` means an approved desired architecture. `EffectiveState` means the state actually observed after an attempted transition. None substitutes for another.

## Lifecycle

A reconciliation lifecycle should be modeled as:

1. evidence acquired and scoped;
2. evidence freshness/trust checked;
3. product truth established;
4. finding derived;
5. gap qualified against a target revision;
6. disposition selected (`KEEP`, `HARDEN`, `GENERALIZE`, `PROVIDERIZE`, `INTEGRATE`, `REPLACE`, `DEFER`, `DO_NOT_BUILD`);
7. proof obligation attached;
8. dependency/authority admission performed;
9. execution attempt, if later authorized by the executive pipeline;
10. outcome observed/reconciled;
11. effective state and residual cohorts validated;
12. proof closed or marked partial/inconclusive.

This research pipeline stops before step 9. The lifecycle is recorded because later architecture and Work Package planning must preserve these boundaries.

## Versioning and stale evidence

Evidence, product truth, target intent, decisions, plans and proofs need separate revisions. Terraform demonstrates that a plan can be valid when produced and stale later because its backing state changed. Kubernetes/Flux demonstrate why an observed status needs a generation qualifier. Therefore an old `PASS`, approval or disposition cannot silently migrate to a materially different product truth, target, provider, policy, dependency graph or Station context.

A disposition is reopenable when its assumptions change. Reopening does not invalidate the historical decision; it invalidates using that historical decision as current authority without requalification.

## Failure semantics

Reconciliation must distinguish at least `NOT_EVALUATED`, `APPLICABLE`, `INAPPLICABLE`, `PASS`, `FAIL`, `PARTIAL`, `INCONCLUSIVE`, `STALE`, `OUTCOME_UNKNOWN` and `CONVERGED_WITH_RESIDUALS`.

If an actuation or remote apply later loses acknowledgement, the safe state is `OUTCOME_UNKNOWN`; the next operation is observe/reconcile-before-retry. A blind retry can duplicate, overwrite or destroy external effects.

Successful command completion is not convergence. Argo CD explicitly allows successful Sync followed by `OutOfSync`. Likewise, observed desired-generation equality alone does not prove that old sessions, caches, routes, bindings, controller versions or consumer cohorts have drained.

## Extensibility and provider boundaries

Architecture Reconciliation owns the reconciliation grammar, lineage and proof lifecycle, not domain semantics. Domain capability owners define what evidence and effective-state predicates mean for identity, workflow, data, deployment, security, AGWS, etc.

Provider/tool portability is a mixed support vector rather than a boolean. Independent axes include observation fidelity, diff semantics, plan reproducibility, dry-run/admission, apply semantics, drift detection, rollback/recovery, ownership/fencing, dependency expression, evidence export, offline operation and consumer-effective verification.

Crossplane is a strong boundary example: reconciliation authority can be narrowed to Observe/Create/Update/Delete, and support for those controls depends on the provider. The System Builder must not infer mutation authority from mere provider reachability.

## Governance and delegated authority

`Enterprise → Station → Role → Person` is attenuation, never amplification. A Station may receive bounded reconciliation or deployment authority for capabilities exposed to it, but cannot gain provider-admin, canonical-domain or enterprise-policy authority merely because it can observe drift or request reconciliation.

Manual/provider-native/escape-hatch changes are not forbidden by architecture, but must produce bounded evidence or mark affected guarantees drifted/unqualified until reconciled.

## Observability and proof

A proof must identify: claim; applicability; semantic owner; source evidence; evidence revision/freshness; product truth revision; target revision; disposition; dependencies; decision authority; observed postcondition; residual cohort disposition; and replay/retention horizon.

Evidence loss does not retroactively make a historically valid fact false. It can make current requalification `INCONCLUSIVE` or `HISTORICALLY_UNVERIFIABLE`.

## Portability, offline and lock-in

Offline/self-hosted closure requires a bounded evidence package: exact artifact/config/spec revisions, local observations, trust roots/signatures where applicable, dependency closure and observation timestamp/horizon. Reconnect must requalify assumptions that could have changed centrally.

Lock-in risk occurs when reconciliation semantics depend on a provider's opaque plan/diff/state without exportable identity, evidence or effective-state verification. Provider-native mechanisms can be used, but the portable architecture contract must remain provider-neutral.

## Product-specific mechanisms versus universal primitives

Product-specific mechanisms include Kubernetes `observedGeneration`, Terraform saved plans/state, Argo CD Sync/OutOfSync, Crossplane `managementPolicies`, and Flux Conditions/dependency expressions.

Universal primitives extracted from them are: desired revision; observed revision; effective-state observation; evidence freshness; stale-plan invalidation; bounded actuation authority; dependency closure; drift; typed outcome; mixed support vector; residual cohort drainage; and replayable proof lineage.

## Convergent and divergent patterns

Convergent: desired and observed state are distinct; reconciliation is iterative; revision/freshness matter; apply/sync is not identical to convergence; authority can be narrower than observation; dependencies influence readiness.

Divergent: products differ substantially in diff semantics, ownership/fencing, admission, provider support, health semantics, rollback, offline behavior and what constitutes readiness. Generation 2 must preserve these as support-vector axes instead of flattening them into one generic `reconcile` capability claim.

## Subcapabilities

- Evidence qualification and freshness.
- Product-truth establishment.
- Gap/disposition decision records.
- Revision-qualified proof obligations.
- Desired/observed/effective-state comparison.
- Drift and manual-change qualification.
- Ambiguous-effect reconciliation.
- Dependency and ownership/fencing validation.
- Residual cohort drainage closure.
- Offline/local evidence closure and reconnect requalification.
- Architecture decision/ADR/spec/test/evidence lineage.

## Fresh-main System Builder comparison — evidence only

A bounded search on fresh `main` at commit `d8760c7f08757bb164a758ae0c3f0a4a1752464b` found concrete product evidence for a typed `AssemblyPlan`, `validationEvidence`, compiler/runtime revisions and capability/provider/version identities. `packages/compiler/index.ts` models components with explicit `capability`, `provider`, `version` and dependencies; product tests pass an `assemblyPlan` plus `validationEvidence` into compilation. This is positive evidence for lineage-bearing planning/validation primitives, but it is not evidence that the current product already implements the Generation-2 architecture-reconciliation lifecycle, stale-evidence handling, mixed support vectors or residual-cohort closure.

Hypothesis: `KEEP` the explicit assembly/validation lineage; `HARDEN` revision and applicability qualification; `GENERALIZE` evidence→finding→product-truth→gap→disposition→proof semantics; `INTEGRATE` with domain owners and lifecycle/deployment proofs; `PROVIDERIZE` observation/actuation adapters where provider-specific; do not `REPLACE` current compiler contracts merely to create a reconciliation abstraction.

## Reconciliation hypotheses

- **KEEP** explicit immutable references, assembly lineage and validation evidence already demonstrated in fresh main.
- **HARDEN** applicability, revision/freshness, outcome and postcondition semantics.
- **GENERALIZE** the cross-capability reconciliation/proof grammar without centralizing domain semantics.
- **PROVIDERIZE** provider/tool-specific observation, diff, plan and actuation behavior behind qualified support vectors.
- **INTEGRATE** dependency graph, ADRs, specs, tests, evidence and consumer-effective closure.
- **REPLACE** only mechanisms later proven unable to preserve identity, evidence or non-amplifying authority; no such replacement is justified by this revisit alone.
- **DEFER** product-specific optimizers until target architecture and repository archaeology establish need.
- **DO_NOT_BUILD** a universal reconciler that owns every domain's semantics or treats `apply succeeded` as universal convergence.

## Repo-validation questions

1. Which current contracts distinguish analysis/validation/assembly intent from deployed/effective state?
2. Where are manual/provider-native mutations detectable today, and can they invalidate prior evidence?
3. Can current validation evidence identify exact source/target revisions and consumer population?
4. Which provider bindings have observable postconditions versus acknowledgement-only outcomes?
5. Where can dependency closure, old-version drainage and reconnect requalification be proven in current tests?
6. Is there any current path where an AI/AGWS request can obtain mutation authority from context rather than explicit authorization?

## Adaptive Governed Work Surfaces boundary

AGWS remains a separate capability from generic UI and from Architecture Reconciliation. A work surface can expose reconciliation status, request a bounded action, or help an authorized user review evidence. Its effective authority remains constrained by `Enterprise → Station → Role → Person` and the Station capability boundary.

AI is the sole materializer of permitted surface composition, but this does not grant canonical architecture, domain, provider-admin, deployment or recovery authority. If a surface request requires schema/process/provider/canonical change, AI emits a proposal/escalation. Mandatory inherited components, lineage, version/diff/reset/rollback/promotion proofs remain AGWS-owned concerns; Architecture Reconciliation only consumes their evidence when evaluating a broader architecture claim.

## Symbiotic Proof

A valid Symbiotic Proof for this capability must demonstrate both native and external-provider paths without semantic ownership collapse:

- the same architecture claim can be evaluated against native and external realizations;
- evidence identifies provider/tool and revision;
- stale evidence is rejected or explicitly downgraded;
- observe-only authority cannot mutate;
- ambiguous apply produces `OUTCOME_UNKNOWN` and reconciliation before retry;
- dependency readiness is revision-qualified;
- provider replacement requires target-effective proof plus residual cohort disposition;
- disconnected evidence can close locally only within declared trust/freshness bounds and is requalified after reconnect;
- AGWS/AI cannot amplify authority.

## Stable findings

- **G2-FINDING-ARC-47** — Architecture reconciliation is an applicability-scoped qualification, not a scalar state. Subject, semantic owner, evidence/product/target revisions, provider/runtime/tool realization, policy/authority, dependency closure, consumer cohort, Station and evidence horizon qualify every material claim.
- **G2-FINDING-ARC-48** — `ArchitectureEvidence → Finding → ProductTruth → Gap → Disposition → Plan → ExecutionAttempt → Acceptance → EffectiveState → Proof` are distinct typed facts. Acceptance or command success cannot substitute for observed effective convergence.
- **G2-FINDING-ARC-49** — SB-current product truth, target architectural intent and migrated effective state must remain separate. Plans/diffs are revision-bound observations and become stale when their backing state or assumptions change.
- **G2-FINDING-ARC-50** — `KEEP/HARDEN/GENERALIZE/PROVIDERIZE/INTEGRATE/REPLACE/DEFER/DO_NOT_BUILD` decisions are revision- and evidence-qualified, reopenable records rather than permanent labels; domain semantic ownership remains with the originating capability.
- **G2-FINDING-ARC-51** — Ambiguous reconciliation/apply outcomes require `OUTCOME_UNKNOWN → observe/reconcile-before-retry`; blind replay is unsafe where the external effect may already have occurred.
- **G2-FINDING-ARC-52** — Reconciliation portability is a mixed support vector across observation, diff, planning, admission, actuation, drift, rollback/recovery, ownership/fencing, dependencies, evidence export and offline behavior; protocol/tool compatibility alone is insufficient.
- **G2-FINDING-ARC-53** — Convergence closure requires dependency closure plus drainage or explicit disposition of residual controller/version/session/cache/config/binding/route/consumer cohorts; desired-versus-observed revision agreement alone is insufficient for enterprise migration closure.
- **G2-FINDING-ARC-54** — Reconciliation evidence has a replay/retention horizon independent of historical validity. Offline/local proofs require bounded trust/freshness closure and reconnect requalification; delegated Station, AI or AGWS context never amplifies canonical or provider-admin authority.

## Candidate register additions

- `G2-CAPABILITY-CANDIDATE-ARC-APPLICABILITY-SCOPED-RECONCILIATION-QUALIFICATION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-RECONCILIATION-EVIDENCE-REPLAY-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-MIXED-RECONCILIATION-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-ARC-RESIDUAL-RECONCILIATION-COHORT-DRAINAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

None is promoted in this revisit; synthesis must reconcile them with Universal Capability Architecture, Lifecycle, Provider/Binding, Deployment, Observability and domain owners.

## Value, risk, priority and next question

**Value:** prevents planning evidence, provider acknowledgements and AI-generated intent from being mistaken for product truth or enterprise convergence.

**Risk:** a central reconciliation layer can become an accidental meta-domain, absorb semantic ownership, or generate false confidence from stale evidence.

**Priority:** constitutional/cross-cutting; required before architecture synthesis.

**Next question:** cycle 7 is now eligible to close. Before any `CAPABILITY_SYNTHESIS`, execute the mandatory Enterprise Completeness / Negative-Space Review and attempt to falsify both the taxonomy and workload-driven runtime-realization hypotheses across the required enterprise archetypes and concern list.