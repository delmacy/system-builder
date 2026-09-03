# Deep Research — Long-Lived Gate Criteria Evolution 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

When a System Builder saga/process is already in flight and one or more of the following changes — workflow definition, capability-operation contract, Gate/closure policy, authorization policy, authority relationships, schema, trust material, provider binding or validation profile — which revisions should remain pinned to the execution's origin, which must be requalified against newer state before privileged progression, and when is an explicit migration required?

The objective is to avoid two opposite failure modes:

1. **silent semantic upgrade** — an in-flight run inherits new meaning, requirements or implementation behavior without an explicit compatibility/migration decision;
2. **unsafe grandfathering** — a run continues to actuate under stale authority, trust, safety or evidence criteria merely because it started under an older revision.

This is the unresolved evolution problem exposed by the longitudinal Gate model and `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01.md`.

## Why this is architecturally material

Generation 2 already has strong evidence that a workflow run should not silently inherit the latest workflow code/definition. However, the same corpus also says authority, trust and evidence freshness can become stale independently of workflow code. Treating every revision axis identically is therefore unsafe.

Example:

```text
Purchase saga starts under:
  workflow W7
  operation Purchase.Approve@3
  Gate policy G4
  authorization model A10
  relationship snapshot R55
  provider profile P2

while waiting for human approval:
  workflow W8 is published
  authorization model A11 revokes one role path
  provider P2 remains valid
  Gate policy G5 adds required fraud evidence
```

Possible naïve behaviors are all problematic:

- automatically move the run to W8/G5/A11;
- freeze everything at W7/G4/A10/R55 forever;
- reevaluate everything under “latest” without retaining historical interpretation;
- let the workflow provider decide migration semantics.

The architecture needs a portable rule for **historical binding, current actuation qualification and explicit migration**.

This question affects Workflow & Durable Execution, Lifecycle / Versioning / Evolution / Migration, Authorization / Policy, Executable Capability Composition, Transaction/Consistency, AGWS/Station authority, Provider/Binding, qualified evidence, offline/autonomous closure and the longitudinal Gate model.

## SB corpus consumed

This run consumed the mandatory Generation 2 research corpus:

- `RESEARCH_PIPELINE_STATE.json`: phase remains `RESEARCH_ELICITATION`; five full cycles are complete and cycle 6 is active. Workflow & Durable Execution is the next breadth capability, but this deep research does not increment rotation/cycle state.
- `RESEARCH_EVIDENCE_METHOD.md`: requires triangulation across mature systems, standards and scientific literature and preserving contradictions.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: requires version/migration/coexistence, authority/security, evidence/freshness and provider-substitution proofs; explicitly states that in-flight work must not be silently upgraded.
- `CAPABILITY_DISCOVERY_REGISTER.md`: retains revision vectors, evidence-compatibility joins, qualified-local trust/evidence horizons and governed migration as cross-cutting consolidation concerns.
- `FINDING_INDEX.md`: cycle-6 findings strengthen multi-axis revision vectors, evidence compatibility and reconnection requalification; historical Workflow findings require explicit in-flight migration and independent human-authority lineage.
- `REPRESENTATIVE_COVERAGE.md`: current process/application and AGWS revisits already stress multi-axis revisions, migration, effective-vs-attempted state and authority revalidation.
- `CAPABILITY_PROOF_MATRIX.md`: Workflow still has explicit proof debt for in-flight revision, migration/provider replacement and recovery; Authorization and Lifecycle retain policy-revision and revision-vector proof debt.
- `WORKFLOW_DURABLE_EXECUTION_REVISIT_04.md`: run identity is independent from latest definition; migration is explicit; human-task assignment/approval authority has independent revision lineage; stale authority must not authorize completion.
- `PROCESS_APPLICATION_MODELING_REVISIT_05.md`: application revision is a vector, not one bundle version; migration/provider acceptance does not prove semantic postconditions; propagated context is provenance, not authority.
- `SEMANTIC_ASSEMBLY_LINE_PROCESS_MODEL.md`: a Gate is a semantic saga-stage boundary whose progression may depend on authority, invariants and evidence, not just engine state.
- `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01.md`: Gate closure is derived from revision-qualified effect obligations and evidence; provider/task acknowledgement is not business truth.

Breadth findings are treated as hypotheses/input corpus, not as independent external evidence.

## External evidence ledger

### E1 — AWS Step Functions versions and redrive
Sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/concepts-state-machine-version.html
- https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html

Step Functions versions are immutable snapshots. A redriven execution uses the same state-machine definition and execution identity as the original attempt; if the execution was associated with a version/alias, it stays associated with that version even after the alias moves.

**Evidence value:** strong production evidence for origin-definition pinning and for treating recovery/redrive as continuation of historical execution semantics rather than automatic adoption of latest definition.

### E2 — Temporal Worker Versioning and patching
Sources:
- https://github.com/temporalio/documentation/blob/main/docs/production-deployment/worker-deployments/worker-versioning.mdx
- https://github.com/temporalio/documentation/blob/main/docs/develop/dotnet/workflows/versioning.mdx
- https://github.com/temporalio/documentation/blob/main/docs/develop/safe-deployments.mdx

Temporal supports pinned workflows that remain on the Worker Deployment Version where they started, plus Auto-Upgrade workflows that require replay-safe patching. Moving a pinned workflow can require compatibility patches or reset-with-move. Replay testing is used to prove code compatibility with historical event histories.

**Evidence value:** strong evidence that “pin vs upgrade” is a declared execution behavior, not a universal latest-version rule. It also demonstrates that technical migration needs compatibility proof against execution history.

### E3 — Camunda 8 process-instance migration
Source: https://docs.camunda.io/docs/components/concepts/process-instance-migration/

Camunda migration is explicit and mapping-based. It does not automatically recreate jobs, re-evaluate expressions or reapply input mappings of active elements; existing jobs/variables can retain values created under the old definition. Migration has structural limitations and can fail when active elements cannot be mapped.

**Evidence value:** strong negative evidence against assuming that changing process-definition identity automatically requalifies all active runtime artifacts. Technical mapping alone does not recreate semantic history.

### E4 — OpenFGA immutable authorization models and migration
Sources:
- https://openfga.dev/docs/getting-started/immutable-models
- https://openfga.dev/docs/getting-started/tuples-api-best-practices
- https://openfga.dev/docs/modeling/migrating/migrating-models

OpenFGA authorization models are immutable and receive new IDs when changed. Production guidance recommends specifying the exact authorization-model ID for consistent behavior until the application deliberately switches. Model migration is staged and application-controlled.

**Evidence value:** supports explicit policy-model revision identity and deliberate cutover. It also demonstrates that schema/model revision can be pinned independently from mutable relationship/authorization data.

### E5 — SpiceDB/Authzed consistency revisions
Sources:
- https://authzed.com/docs/spicedb/concepts/consistency
- https://authzed.com/docs/spicedb/concepts/read-after-write

SpiceDB exposes exact/at-least-as-fresh/fully-consistent consistency modes using `ZedToken` revisions. Permission checks can therefore be qualified against an exact snapshot or a minimum freshness boundary instead of one undifferentiated “current” state.

**Evidence value:** strong evidence that authorization data freshness is a semantic choice per check and that policy/relationship revision is distinct from workflow-definition revision.

### E6 — Open Policy Agent bundles and decision logs
Sources:
- https://www.openpolicyagent.org/docs/management-bundles
- https://www.openpolicyagent.org/docs/management-decision-logs

OPA can hot-load new policy/data bundles; activated bundle policy becomes effective without application restart. Decision logs retain bundle revision metadata for the policy used to produce a decision.

**Evidence value:** supports the distinction between (a) preserving the exact revision that produced a historical decision and (b) allowing newer policy revisions to govern future decisions.

### E7 — OAuth 2.0 token introspection and revocation
Sources:
- https://www.rfc-editor.org/info/rfc7662/
- https://www.rfc-editor.org/info/rfc7009/

Token introspection defines `active` in terms including revocation and validity windows. RFC 7009 explicitly notes that access-token invalidation may not be immediate in all deployments and that systems must account for revocation propagation windows.

**Evidence value:** standards evidence that authorization/credential validity is time/freshness sensitive. A workflow origin cannot safely freeze an authorization grant forever.

### E8 — Dynamic workflow-change correctness literature
Sources:
- Stefanie Rinderle, Manfred Reichert, Peter Dadam, “Correctness Criteria for Dynamic Changes in Workflow Systems: A Survey,” Data & Knowledge Engineering 50(1), 2004: https://dbis.eprints.uni-ulm.de/id/eprint/166/
- W.M.P. van der Aalst, “Exterminating the Dynamic Change Bug,” Information Systems Frontiers 3(3), 2001: https://research.tue.nl/en/publications/exterminating-the-dynamic-change-bug-a-concrete-approach-to-suppo-2
- Fabio Casati et al., “Workflow Evolution,” Data & Knowledge Engineering, 1998: https://re.public.polimi.it/handle/11311/657855

This literature treats migration of running instances as a correctness problem. A case may be compatible with a changed schema only under explicit criteria based on execution history/current state; naïve dynamic change can duplicate/skip work or introduce deadlocks/livelocks.

**Evidence value:** scientific support for explicit migration/adaptation criteria rather than “always latest” or “graph mapping means safe.”

### E9 — Data-flow correctness in adaptive workflows
Source: Stefanie Rinderle-Ma, “Data Flow Correctness in Adaptive Workflow Systems,” 2009: https://dbis.eprints.uni-ulm.de/494/

The paper shows that control-flow compatibility is insufficient; workflow changes can leave activities with missing/inconsistent data requirements.

**Evidence value:** directly challenges migration models that validate only structural node mapping. Gate migration must account for state/data/evidence compatibility.

## Competing models

### Model A — Freeze every revision at process start

All future actions and Gates use the workflow, policy, trust, provider and evidence criteria that existed when the process started.

**Strength:** deterministic historical behavior and easy replay.

**Failure:** unsafe for revoked authority, expired credentials/trust, emergency safety policy, changed tenant/Station exposure and freshness-sensitive evidence. It can preserve privileges the enterprise intentionally revoked.

**Disposition:** `DO_NOT_BUILD` as universal behavior. Pinning remains valid for selected semantic-definition axes.

### Model B — Always evaluate everything under latest revision

Every new task/Gate automatically uses the latest workflow, operation, schema, policy, provider and closure criteria.

**Strength:** all runs converge rapidly to current desired state.

**Failure:** creates the dynamic-change bug class, non-deterministic replay, duplicated/skipped effects, incompatible data contracts and retroactive reinterpretation of evidence. Provider aliases/latest policy become semantic authority.

**Disposition:** `DO_NOT_BUILD` as canonical behavior.

### Model C — Automatically adopt only “stricter” changes

Runs stay pinned except when a newer rule appears more restrictive; restrictive changes apply automatically.

**Strength:** attractive security intuition.

**Failure:** “stricter” is not universally decidable. A rule can narrow one subject set while broadening another resource/context; a new Gate obligation can change compensation or render prior work unusable; schema changes can be syntactically additive but semantically breaking. Automatic monotonicity inference across arbitrary business policy is unsafe.

**Disposition:** `REJECT` as universal algorithm. Domains may provide proven monotonic/compatibility classifiers.

### Model D — One explicit whole-run migration revision

Any material change creates a new run-wide revision and the entire process migrates atomically.

**Strength:** coherent cutover point.

**Failure:** over-couples independent axes. Authority relationships can change without workflow migration; provider binding can change compatibly; trust can expire; one active stage may be migratable while another is not. It also makes simple systems unnecessarily ceremonial.

**Disposition:** `SPECIALIZE` as a possible coarse migration profile, not the universal primitive.

### Model E — Multi-axis revision binding + historical evidence + actuation-time requalification + explicit migration

Each run carries a revision vector with per-axis binding/evolution semantics. Historical facts remain attached to the exact revisions that produced them. Future privileged actuation/Gate progression requalifies only the axes whose contract requires freshness/currentness. Structural/semantic changes that alter the meaning or future path of the in-flight run require explicit compatibility/migration evidence.

**Disposition:** strongest model; `KEEP/GENERALIZE` as research recommendation.

## Strongest conclusion

The strongest conclusion is:

> **A long-lived saga must not have one universal “current revision.” It needs typed revision axes with explicit binding semantics. Historical interpretation is pinned to the revisions that produced evidence; future actuation is qualified against the revisions/freshness required at the time of actuation; semantic path changes require explicit migration or an explicitly declared compatible evolution rule.**

This reconciles workflow determinism with live security/authority.

## Candidate revision axes

Exact names are not frozen, but a portable execution may need to identify at least:

```text
RunRevisionVector {
  workflowDefinitionRevision
  operationContractRevision(s)
  gateClosurePolicyRevision(s)
  domain/schemaRevision(s)
  authorityPolicyModelRevision
  authorityRelationship/SnapshotRevision or freshness requirement
  trustEpoch / credential validity
  providerBinding/ProfileRevision(s)
  validationProfileRevision(s)
  executionGeneration / migrationRevision
}
```

Not every simple system needs all axes. The model should permit a collapsed profile where several axes intentionally share one release revision while preserving the ability to separate them later.

## Historical truth vs current qualification

The architecture must distinguish two questions:

1. **What happened, under which rules?**
2. **Does that historical evidence satisfy the requirements for the next actuation now?**

Example:

```text
Historical fact:
  Alice approved Purchase-17 at T1
  using authorization model A10
  relationship snapshot R55
  decision evidence D900

Current Gate question at T2:
  Does D900 satisfy Gate G5 under the current required
  authority/freshness policy?
```

If the answer is no, the old evidence is not rewritten to “never approved.” It remains valid historical evidence, but it does not qualify the newer/current progression requirement. The run may require reapproval, explicit grandfathering, compensation, migration or quarantine.

Candidate invariant:

> **Evolution changes qualification, not history.**

## Per-axis evolution semantics

### Workflow definition / control flow

Default recommendation: **PIN** for an in-flight run. A new definition governs new runs unless an explicit migration/compatible-upgrade path exists.

Reason: Step Functions, Temporal and dynamic-workflow literature converge on the risk of silently changing the execution path of an active history.

### Capability operation contract

An invocation must name the semantic operation revision/profile it expects. A future invocation in the same run may adopt a compatible newer revision only when compatibility is explicitly proven/declaratively permitted. A breaking semantic contract requires migration or remains pinned.

### Domain/schema

Schema evolution can be independently compatible or incompatible. Structural compatibility is insufficient when existing state/evidence no longer satisfies semantic invariants. Migration requires state/data/evidence mapping and postcondition proof.

### Authority policy model

Policy-model revision should be explicit. Whether the Gate requires the origin model, a particular model, or a newer/fresh model is itself part of the Gate/operation requirement.

Default for privileged actuation: **do not inherit authority merely from process origin**.

### Authority relationships/session/Station scope

Subject membership, delegation, assignment and session-effective authority are mutable facts. Privileged actuation should use a declared freshness criterion such as exact snapshot, at-least-as-fresh, bounded-staleness profile or fully current evaluation where supported.

A revoked assignment cannot continue to authorize merely because the workflow instance is old.

### Trust / credential validity

Trust material has validity/epoch semantics and must be requalified when required. An old signature/evidence can remain historically valid while the credential/trust chain may be unacceptable for new actuation after expiry/revocation or policy change.

### Provider binding / realization

Provider change may be transparent to the semantic run only if the replacement satisfies the same required semantic/profile obligations and in-flight state/effect correlations are representable. Otherwise it is migration.

### Gate / composite closure policy

Gate criteria are the hardest axis because changing them can alter whether prior work is sufficient.

Recommended dispositions for a Gate-policy change (names not frozen):

- `PROSPECTIVE_ONLY` — new runs/new stages use the new Gate policy; an already activated stage keeps its admitted policy.
- `REQUALIFY_BEFORE_ADVANCE` — active stages retain history but must satisfy the newer/current criteria before crossing the Gate.
- `MIGRATION_REQUIRED` — state/evidence/control mapping is necessary before the stage can continue.
- `EMERGENCY_INVALIDATE_OR_QUARANTINE` — privileged/safety progression is stopped until current conditions are proven.
- `EXPLICIT_GRANDFATHER` — old criteria remain acceptable for identified runs by an authority-bearing policy decision with scope, expiry and evidence.

There must be no implicit grandfathering and no implicit latest-policy adoption.

## Why “latest” and “origin” are both insufficient

A long-lived process can legitimately need both at once:

```text
Pinned:
  workflow structure W7
  already-produced operation result semantics O3

Fresh/requalified:
  actor still authorized now
  Station still exposes the action
  trust/credential still valid
  required evidence not expired

Explicit migration:
  Gate G4 → G5 adds a new constitutive obligation
  operation O3 → O4 changes output semantics
  provider P2 → P3 cannot represent active correlation state
```

This is a revision vector with mixed binding policies, not inconsistency.

## Migration admission

An in-flight migration should not be considered valid merely because the workflow engine accepted a node mapping.

Candidate migration admission requires, as applicable:

1. source run identity, origin definition and current execution generation;
2. target revision vector;
3. mapping of active stages/nodes and outstanding work;
4. state/data/schema compatibility;
5. already-produced effect/evidence interpretation under source revisions;
6. unresolved external-effect correlations;
7. human-task assignment and authority disposition;
8. Gate/closure-policy delta and whether prior evidence qualifies the target;
9. compensation/replay/retry semantics;
10. provider/state representability;
11. explicit migration authority;
12. target postcondition validation.

If required compatibility evidence is unavailable, migration is `INCONCLUSIVE`/unsupported, not “best effort success.”

## Authorization is not workflow versioning

The deep-research corpus falsifies a common coupling:

```text
run started while Alice could approve
→ Alice may always approve this run
```

That rule is unsafe unless the business policy explicitly grants a durable grandfathered authority.

The portable distinction should be:

```text
TaskAssignmentEvidence
  says who/what was assigned under revision X

AuthorizationDecisionEvidence
  says whether a subject was allowed to perform the semantic action
  under policy/snapshot/freshness Y

WorkflowDefinitionRevision
  says which orchestration semantics govern the run
```

These can evolve independently.

## Offline / autonomous closure consequence

An offline Station cannot promise “use latest policy” while disconnected. Therefore each privileged local Gate must declare a local authority/trust/evidence horizon.

Possible profiles:

- exact locally retained snapshot/epoch acceptable until expiry;
- bounded-staleness acceptable;
- operation forbidden offline because current central authority is required;
- preallocated rights plus local authority snapshot sufficient for a defined interval.

On reconnection, if relevant policy/trust/authority/schema epochs advanced, further privileged actuation requires requalification. Local historical evidence remains preserved.

## Failure and adversarial analysis

### Silent workflow upgrade
A waiting run receives W8 automatically; W8 moved/removed a task that W7 already partially executed. Risk: duplicate/skipped work or replay divergence.

**Required behavior:** stay pinned or require migration compatibility proof.

### Revoked approver on old workflow
A human task was assigned under A10; membership is revoked under A11 before completion.

**Required behavior:** task possession/old assignment cannot by itself authorize the semantic decision. Requalify authority according to Gate freshness policy.

### New Gate obligation after partial completion
G5 adds fraud evidence after payment authorization under G4.

**Required behavior:** policy disposition determines prospective-only vs requalify/migrate/quarantine. Do not retroactively erase payment evidence or silently pass using G4 if current policy requires G5.

### Provider substitution mid-attempt
P2 times out after an ambiguous external effect; binding switches to P3.

**Required behavior:** reconcile P2 outcome before new actuation unless semantic idempotency/correlation and migration policy prove safe continuation.

### Policy rollback
A11 is rolled back to A10 while some decisions were evaluated under A11.

**Required behavior:** retain exact policy revision for historical decisions. Rollback changes future evaluation; it does not rewrite A11 decision history.

### Offline stale authority
Station continues after enterprise role revocation while disconnected.

**Required behavior:** only allowed if declared bounded-staleness/local-closure policy still qualifies. Otherwise deny/quarantine. Reconnection triggers requalification.

### “Stricter” change misclassification
A new rule appears narrower in one dimension but broadens another.

**Required behavior:** no universal automatic stricter/safer inference. Require domain-owned compatibility classifier or explicit disposition.

## Provider-specific vs portable semantics

### Portable candidates

- typed revision axes rather than one global version;
- origin-definition binding for in-flight semantic execution by default;
- exact revision/provenance on historical evidence;
- freshness requirements for authority/trust/evidence;
- explicit Gate evolution disposition;
- migration plan + compatibility/postcondition evidence;
- independently revisioned assignment vs authorization decision vs workflow definition;
- explicit `INCONCLUSIVE` when required migration/requalification evidence is missing;
- provider substitution cannot silently weaken semantic/Gate proof thresholds.

### Provider/runtime realization

- Temporal pinned/auto-upgrade/patch markers/reset-with-move;
- Step Functions version/alias/redrive ARNs;
- Camunda element migration mapping and runtime keys;
- OpenFGA model IDs;
- SpiceDB ZedTokens/consistency options;
- OPA bundle revisions;
- OAuth token/introspection mechanics.

### Do not universalize

- one provider's “latest alias” as semantic currentness;
- one engine's migration map as proof of business compatibility;
- Temporal replay markers as universal workflow-evolution IR;
- `ZedToken` as universal revision primitive;
- OPA bundle revision as workflow revision;
- OAuth token expiry as business authority lifetime;
- a syntactic “breaking/non-breaking” schema diff as sufficient Gate migration proof.

## Consequences for existing findings/candidates/hypotheses

1. **KEEP/HARDEN — WDE origin revision independence.** Existing `G2-FINDING-WDE-29` is strengthened: origin workflow semantics are pinned by default, but that does not pin authority/trust forever.
2. **GENERALIZE — multi-axis revision vector.** Cycle-6 UCA/PAM/UIGX/AGWS revision-vector findings should include execution-time binding policy per axis, not only identity of each revision.
3. **KEEP/HARDEN — human authority independent from workflow evolution.** Existing WDE and AGWS findings are strengthened by OpenFGA/SpiceDB/OAuth evidence.
4. **MERGE — evidence compatibility + Gate closure.** Composite Gate closure should evaluate whether evidence revision/snapshot/freshness is compatible with the Gate policy currently governing progression.
5. **GENERALIZE — migration is more than control-flow mapping.** It must include state/data/effect/evidence/authority/Gate compatibility and postcondition proof.
6. **SPECIALIZE — Gate evolution disposition.** Keep under Workflow/Lifecycle unless synthesis proves a broader universal governed-transition owner.
7. **PROVIDERIZE — concrete versioning/migration mechanics.** Step Functions, Temporal, Camunda, OpenFGA, SpiceDB and OPA mechanisms remain realization-specific.
8. **DO_NOT_BUILD — universal automatic latest or universal permanent origin pinning.** Neither can satisfy both durable correctness and live security.
9. **DEFER — exact final IR.** Do not freeze a universal `RunRevisionVector` schema or Gate-disposition enum during research.

No new top-level capability is recommended from this deep dive.

## Invariants

Candidate invariants for synthesis:

1. **Historical evidence is immutable with respect to its producing revisions.** New policy cannot rewrite what revision produced a past decision/effect.
2. **Workflow origin does not confer perpetual actuation authority.** Privileged action requires independently qualified authority/trust according to declared freshness.
3. **In-flight semantic path changes are explicit.** Breaking workflow/operation/Gate changes require migration or a proven compatible evolution rule.
4. **Missing compatibility evidence cannot become migration success.** Required uncertainty propagates `INCONCLUSIVE`.
5. **Provider migration does not redefine semantic identity.** Provider mechanisms are evidence/realization, not canonical process meaning.
6. **Evolution changes qualification, not history.** Old evidence can remain true yet no longer satisfy a new/current Gate.
7. **Grandfathering is an explicit authority-bearing policy, not the default side effect of long-lived execution.**
8. **Simple systems may collapse revision axes operationally, but the architecture must not prevent later separation.**

## Proof obligations

### DR-LGCE-01 — Definition pinning
Start a run on W7, publish W8 with materially changed control flow, then resume the run. It must remain on W7 unless an explicit migration/compatible-upgrade disposition exists.

### DR-LGCE-02 — Redrive/recovery does not upgrade
Fail a run, publish a new definition, redrive/recover. Recovery must preserve the revision semantics declared for the original execution.

### DR-LGCE-03 — Authority revocation on pinned run
Assign a human task while subject S is authorized; revoke S before completion while keeping the workflow definition unchanged. S must not create the effective semantic decision if current/fresh authority is required.

### DR-LGCE-04 — Historical evidence preservation
Produce approval evidence under A10, then migrate to A11. Evidence must still state A10 and remain auditable; target Gate qualification must be evaluated separately.

### DR-LGCE-05 — Gate tightening / requalification
Activate a stage under G4; before crossing, publish G5 with an additional constitutive requirement and disposition `REQUALIFY_BEFORE_ADVANCE`. The run must not cross until G5's requirement is qualified.

### DR-LGCE-06 — Prospective-only Gate change
Publish G5 as `PROSPECTIVE_ONLY`; an already admitted G4 stage may complete under G4 while new stages/runs use G5, with both revision lineages observable.

### DR-LGCE-07 — Explicit grandfathering
Allow identified in-flight runs to continue under G4 after G5 via a scoped, authorized grandfather policy. Expiry/scope/reason/evidence must be retained; unrelated runs cannot inherit it.

### DR-LGCE-08 — Structural migration acceptance vs semantic failure
Perform an engine-accepted node mapping to W8 while target data/Gate evidence is incompatible. Migration must be rejected/`INCONCLUSIVE`/quarantined rather than semantically validated.

### DR-LGCE-09 — Provider-compatible substitution
Replace workflow/provider realization while preserving semantic operation/Gate requirements. Historical provider IDs may change, but semantic run identity and required proof thresholds remain stable.

### DR-LGCE-10 — Provider-incompatible substitution
Select a provider that cannot satisfy the old run's in-flight correlation/evidence profile. Admission must fail or require explicit migration/degraded approval; requirements cannot silently weaken.

### DR-LGCE-11 — Policy rollback lineage
Evaluate one decision under A11, roll back future evaluation to A10. Historical A11 evidence remains A11; rollback must not rewrite it.

### DR-LGCE-12 — Multi-axis mixed binding
Keep workflow W7 pinned while requiring authority snapshot >= R60 and trust epoch T9 at the next Gate. Demonstrate that mixed revision policies are coherent and auditable.

### DR-LGCE-13 — Offline revalidation horizon
Allow a Station to continue under declared local policy/trust horizon, advance enterprise revisions while disconnected, then reconnect. Further privileged actuation must requalify as required without discarding valid local history.

### DR-LGCE-14 — Ambiguous effect during migration
Lose acknowledgement for provider P2 effect, then propose W8/P3 migration. The system must reconcile/quarantine the ambiguous P2 effect before unsafe duplicate actuation.

### DR-LGCE-15 — “Stricter” classifier adversarial proof
Provide a policy change that narrows one subject set while broadening a contextual path. A generic automatic “stricter therefore safe to adopt” classifier must not authorize migration without domain-specific proof.

### DR-LGCE-16 — Simple-system ergonomics
Demonstrate a small system where workflow, Gate, schema and policy ship as one release revision and require no multi-axis operational ceremony, while evidence still records enough typed revision information to support later separation/migration.

## Falsification paths

This recommendation should be weakened or rejected if evidence demonstrates that:

- a single universal revision can preserve deterministic long-running execution **and** timely authority/trust revocation across heterogeneous providers without hidden coupling;
- automatic latest-definition adoption is proven safe across arbitrary workflow/data/effect histories;
- workflow migration correctness can be established solely from structural mapping without state/data/effect/evidence compatibility;
- freezing origin authorization is sufficient for revocation-sensitive enterprise workflows without explicit grandfather policy.

Current evidence strongly contradicts all four propositions.

## Unresolved questions

1. Which revision axes deserve universal names versus capability-specific extension fields?
2. Is Gate evolution disposition Workflow-owned, Lifecycle-owned, or a specialization of a broader governed-transition primitive?
3. Can a portable compatibility language safely express limited monotonic evolution classes without domain-specific code?
4. What minimum historical closure must be retained so a years-long run remains interpretable after old policy/schema/provider versions are retired?
5. How should regulatory/emergency policy changes force quarantine versus automatic requalification, especially offline?
6. How should compensation behave when target Gate policy changes after an irreversible source-revision effect?
7. What is the correct migration boundary for subworkflows that independently pin/upgrade their own revisions?
8. How should commercial entitlements/quotas changing mid-saga interact with origin contracts and current enforcement?

## Confidence

**High** confidence in the core separation:

- workflow/control semantics pin by origin unless explicitly evolved;
- authority/trust/freshness cannot be universally pinned to process origin;
- historical evidence retains producing revisions;
- migration requires explicit compatibility/postcondition proof.

**Medium** confidence in the exact Gate evolution disposition vocabulary and ownership. Existing systems expose mechanisms, but no reviewed standard provides a complete provider-neutral taxonomy for business Gate evolution across workflow, policy, authority and external-effect evidence.

## Proposed dispositions

- `KEEP/HARDEN`: origin-bound workflow/run semantic revision and explicit in-flight migration.
- `GENERALIZE`: multi-axis revision vector with per-axis binding/freshness/evolution semantics.
- `GENERALIZE`: “evolution changes qualification, not history.”
- `MERGE`: Gate closure with revision-compatible evidence joins and trust/freshness horizon.
- `SPECIALIZE`: Gate evolution disposition under Workflow/Lifecycle pending synthesis ownership.
- `PROVIDERIZE`: Temporal/Step Functions/Camunda/OpenFGA/SpiceDB/OPA/OAuth concrete mechanisms.
- `DEFER`: exact IR/enums and automatic compatibility language.
- `DO_NOT_BUILD`: universal always-latest, universal forever-origin-pinned, or generic “stricter change auto-adopts” semantics.

## Recommended next deep question

**Historical Interpretation Closure / Revision Retention:** for workflows that may run for months or years, what minimum portable closure of workflow definitions, operation contracts, schemas, policy semantics, trust metadata, provider-adapter interpretation and validators must be retained so old evidence and in-flight runs remain interpretable/auditable after source revisions/providers are retired — without requiring the Builder control plane or retaining every provider system forever?
