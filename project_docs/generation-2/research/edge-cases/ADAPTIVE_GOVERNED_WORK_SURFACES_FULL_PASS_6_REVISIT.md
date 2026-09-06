# Generation 2 — Adaptive Governed Work Surfaces — Full Pass 6 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Adaptive Governed Work Surfaces (AGWS)
Mandatory cluster exercised: Identity × Authorization × Station × AGWS × AI
Prior authority: `ADAPTIVE_GOVERNED_WORK_SURFACES_EDGE_CASE_REGISTER.md` and Full Pass 2–5 revisit dossiers
Conflict-classification authority: `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
Priority-hypothesis authority: `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`
Reusable ConflictPattern inventory screened: 123

Research only. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, and the default research disposition `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. This revisit authorizes no product code, Work Package, TASK, Construction, target-architecture selection or pre-emptive remediation.

## 1. Full-Pass-6 method

Full Pass 6 starts with a deliberately different attack from Passes 1–5: **projection-bound action validity under concurrent semantic/revision change**. Rather than asking whether the surface was correctly resolved when rendered, this pass treats every visible or assistive interaction as a potentially stale projection and asks whether the later action remains bound to the exact semantic/evidence context the operator actually saw.

The probes were:

1. **render→act revision split** — render a work surface from semantic/build/deployment/policy revisions `R1`, advance one or more authoritative revisions to `R2`, then invoke an action without carrying sufficient projection/evidence revision qualifiers;
2. **strong-precondition mutation differential** — compare a mutation bound to an exact current representation/revision against the same mutation issued from a stale projection with no precondition/currentness proof;
3. **partial-projection asymmetry** — deliberately omit/collapse nodes, evidence, warnings or `UNKNOWN` dimensions while keeping the primary action visible, then test whether omission is mistaken for absence or safety;
4. **assistive-tree divergence** — make visible, DOM and accessibility projections disagree about which interaction exists or is reachable, then verify that presentation differences cannot create or erase canonical authority;
5. **policy-revision braid** — keep a long-running surface open while Role/Station/policy/model revisions evolve, including gradual authorization-model rollout, and test invocation-time requalification rather than render-time authority persistence;
6. **evidence-layer substitution** — substitute runtime/local-journal evidence with sampled/exported/Fleet evidence while keeping the UI conclusion constant, testing whether the surface strengthens incomplete telemetry into runtime truth;
7. **tenant-attribution erasure** — aggregate shared-infrastructure observations, remove explicit client/workspace attribution and test whether concrete payload/action surfaces remain reachable;
8. **provider-degradation projection** — provider evidence becomes stale/partial/unavailable after the surface is resolved; test whether the UI exposes `UNKNOWN/reconcile` rather than converting provider silence into `NOT_APPLIED`, unavailable or safe-to-retry;
9. **resource-pressure truncation** — high-cardinality graph/evidence causes projection truncation, pagination, sampling or summarization; test whether hidden tails weaken mandatory constraints or proof claims;
10. **human-procedure contradiction** — the rendered instruction tells the operator to proceed while current policy/evidence requires requalification, and conversely a stale warning tells the operator to stop after the condition has been resolved;
11. **AI dimension-hiding mutation** — AI personalization/low-code composition keeps the requested workflow goal but hides client, revision, authority, uncertainty or provider dimensions that would make the proposed action ineligible;
12. **AI claim-strengthening mutation** — AI summarizes `PARTIAL/UNKNOWN`, sampled Fleet telemetry, advisory optimization or a proof/integrity claim as a stronger operational conclusion.

The mandatory `Identity × Authorization × Station × AGWS × AI` cluster was materially exercised because probes 5, 10, 11 and 12 jointly changed identity/organizational context, authorization revision, surface projection and AI interpretation at the same invocation boundary. Cluster coverage therefore counts for Full Pass 6, but its already-satisfied no-material streak remains capped at 2.

## 2. Evidence refresh

Portable external evidence was used as adversarial evidence, not as a System Builder architecture prescription.

### 2.1 Conditional mutation and stale projections

RFC 9110 defines `If-Match` using strong entity-tag comparison specifically so a state-changing method is not applied when the representation has changed; the specification explicitly identifies prevention of the lost-update problem as a primary use. This supports the portable research principle that a rendered projection cannot silently authorize mutation of a newer/different semantic state merely because the UI still has a valid object identifier.

Research consequence: G2 need not adopt HTTP ETags as its canonical mechanism, but a mutating surface needs an equivalent qualified currentness/precondition story whenever user intent depends on the state/revision that was rendered.

### 2.2 Authorization is invocation-time authority, not presentation state

OWASP authorization guidance requires permission validation on every request rather than relying on how the request originated. OpenFGA's current immutable-model guidance strongly recommends explicitly targeting a particular authorization-model ID in production; its consistency options also acknowledge that cached reads can temporarily omit permission changes.

Research consequence: surface presence, disabled state, cached policy graph, AI recommendation or earlier authorization result is evidence about a prior projection, not continuing mutation authority. Long-running work surfaces must preserve model/revision/currentness distinctions rather than silently following `latest` or treating the render-time decision as perpetual.

### 2.3 Presentation trees are projections with independent failure modes

WAI-ARIA 1.3 distinguishes the accessibility tree from the DOM/rendered representation and documents cases where hidden/focusable semantics can diverge. This is not itself an authorization mechanism; it is evidence that one UI can have multiple projections whose visibility/reachability properties are not interchangeable.

Research consequence: AGWS must not derive canonical capability exposure or authority from any one renderer/accessibility-tree state. Accessibility defects can create serious human-procedure or interaction ambiguity even when server-side authority remains correct; therefore the diagnostic expectation is to treat projection divergence explicitly rather than infer semantic absence/presence from one presentation tree.

### 2.4 Fleet evidence is deliberately incomplete

OpenTelemetry sampling intentionally restricts the traces generated/exported. Therefore Fleet/telemetry absence is not proof that an invocation, error or state transition did not occur.

Research consequence: `runtime truth != local evidence != exported telemetry != Fleet aggregate` remains a necessary boundary. AGWS may render observational confidence/coverage, but sampled or missing global telemetry cannot be promoted into runtime truth or mutation authority.

Evidence currentness: refreshed 2026-09-05 from RFC 9110, OWASP Authorization Cheat Sheet, OpenFGA immutable-model/consistency guidance, WAI-ARIA 1.3 and OpenTelemetry sampling guidance.

## 3. Candidate findings and duplicate-screen

All candidates were screened against the complete 123-pattern reusable catalogue, including the four Full-Pass-5 proof/federation/analytical patterns.

### 3.1 Projection-bound action targets a different revision than the operator saw

Candidate: the operator sees resource/process state `R1`, a concurrent actor changes it to `R2`, and the surface submits the action against `R2` without an explicit precondition or re-presentation even though the intent depended on `R1`.

Disposition: no new reusable class. This reduces to existing stale-read destructive mutation/currentness, temporal ordering/TOCTOU, revision coexistence and semantic-ownership families. `G2-EDGE-AGWS-001` already makes stale context/actionability material, while the broader catalogue covers concurrent write/currentness qualification. The stronger Pass-6 diagnostic expectation is that the action must either prove its intent is revision-independent or fail/requalify/re-present when the relevant semantic base changed.

### 3.2 Hidden/collapsed uncertainty is interpreted as safe absence

Candidate: a graph explorer or generated surface collapses `UNKNOWN`, stale evidence, hidden nodes or omitted tail data; user/AI sees only the remaining positive path and concludes that no blocker exists.

Disposition: covered by presence-semantics, partial/unknown evidence, projection-versus-truth, proof-claim-conflation and resource-boundedness families. Hidden/collapsed is a presentation state, not proof of semantic absence. No 124th pattern.

### 3.3 Accessibility-tree divergence changes reachable actions

Candidate: an interaction is visually absent but keyboard/focus/accessibility semantics still expose it, or the inverse, causing a user to take an action inconsistent with the visible instruction/projection.

Disposition: no new cross-cutting conflict family. The authority hazard is already covered by presentation-authority/current authorization; the human/procedure aspect reduces to presentation semantic drift and conflicting instruction/reachability. Expected safe behavior is still server-side/current canonical authorization plus UI diagnostics/testing for divergent presentation trees. No authorization may be inferred from either visibility or invisibility.

### 3.4 Authorization-model rollout crosses a long-running work surface

Candidate: a surface was resolved under authorization model `M1`; a gradual rollout introduces `M2`; different services or workspaces evaluate against different models while the same user workflow remains open.

Disposition: existing compatibility-direction, currentness/revision-vector, residual-cohort and authority-federation families. OpenFGA's explicit model-ID guidance strengthens the evidence for pinning/qualifying the model used for a decision but does not create a new semantic class. The surface must not silently treat `latest` as equivalent to the model under which prior evidence was generated.

### 3.5 Shared-infrastructure aggregate loses client attribution

Candidate: Fleet/global operational projection aggregates identical semantic capabilities from several clients on shared infrastructure, then exposes a concrete payload or mutation affordance without explicit client/workspace selection.

Disposition: covered by multitenant isolation, trust-namespace-collapse, presentation-authority and Fleet non-authority families. Shared realization does not imply shared truth. No new material finding.

### 3.6 Provider degradation after render turns `UNKNOWN` into retryable failure

Candidate: a provider-backed action was shown as available, provider evidence becomes partial/unavailable, and UI offers retry/failover while original effect disposition is unknown.

Disposition: duplicate of `G2-EDGE-AGWS-005` plus provider-degradation and `UNKNOWN → reconcile-before-retry` families. No new class or remediation.

### 3.7 Resource-pressure truncation silently removes a mandatory dimension

Candidate: high-cardinality graph/evidence is truncated or summarized; policy, tenant attribution, uncertainty, child proof, or provider cohort is omitted and the remaining projection is presented as complete.

Disposition: covered by `G2-EDGE-AGWS-006`, resource-boundedness, proof-claim-conflation, certificate-composition and partial-evidence families. Truncation must weaken the claim or be explicitly surfaced; it cannot strengthen the projection. No new pattern.

### 3.8 AI converts sampled/advisory evidence into stronger operational truth

Candidate: AI summarizes sampled Fleet telemetry, an optimization score, or an integrity/proof artifact as "the runtime is healthy", "this action is safe", or "the workflow is proven complete" without the missing runtime/effect/authority evidence.

Disposition: duplicate of AI non-amplification plus `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001`, `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001`, currentness and observability-qualification families. AI may explain or propose; it cannot strengthen evidence kind or authority.

### 3.9 Human instruction and current eligibility disagree

Candidate: instruction rendered earlier says "approve now" after the operator loses authority, or a stale warning says "do not proceed" after a qualified recovery changes the state.

Disposition: covered by human-procedure conflict, stale currentness and authority-revision families. The appropriate research outcome is a detection/requalification route, not automatic remediation or arbitrary instruction precedence.

## 4. Conflict-assessment disposition

No candidate survived duplicate-screen as a distinct reusable `G2-CONFLICT-PATTERN-*` family. Existing patterns already carry activation conditions, incompatible claims/actions/states, static/pre-execution/runtime/post-effect detection candidates, owner sets, severity/confidence/detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence-currentness requirements, false-positive risks and future remediation dispositions.

Result:

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new preventive invariants: **0**;
- ConflictInstances asserted: **0**;
- HIGH/CRITICAL without owner/proof/detection route introduced: **0**;
- bounded synthesis / Planning-A backfill required: **no**;
- implementation/remediation work opened: **0**.

## 5. Priority-hypothesis disposition

Typed Semantic Graph + Federation + Workflow formal assurance + ExecutionEnvelope + Autonomous Builds/Fleet remains **ARCHITECTURE HYPOTHESIS / NOT DECIDED**.

This revisit strengthens, without adopting, the following carry-forward constraints:

- Canvas/Graph Explorer/work surfaces are projections and cannot become source of truth merely by being interactive;
- a surface action that semantically depends on a rendered state needs qualified currentness/precondition evidence at invocation time;
- `CapabilityDefinition != CapabilityUse/Invocation`, `WorkflowDefinition != WorkflowInstance`, `GraphDefinition != runtime state`, and `ExecutionState != ExecutionJournal` remain useful distinctions under UI mutation races;
- `runtime truth != local evidence != exported telemetry != Fleet aggregate`; sampling/truncation/outage weakens evidence rather than rewrites runtime truth;
- `CanonicalCapabilityRef -> CapabilityUse -> Build/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt` lineage remains necessary for qualified cross-build analysis, but does not itself prove metric comparability;
- Fleet/global surfaces remain aggregate/evidence views by default; concrete payload or mutation requires explicit client/workspace context and separate current authority;
- GraphDB remains optional/provider-level. Nothing in this pass establishes a GraphDB requirement.

## 6. Saturation disposition

This is an eligible no-new-material AGWS revisit in Full Pass 6 and a material exercise of the mandatory `Identity × Authorization × Station × AGWS × AI` cluster.

- AGWS local no-material streak remains capped at **2**; do not inflate it.
- `Identity × Authorization × Station × AGWS × AI` cluster no-material streak remains capped at **2**; do not inflate it.
- Full Pass 6 capability coverage becomes **1/28**.
- Full Pass 6 mandatory-cluster coverage becomes **1/12**.
- Material inventory remains **284 edge scenarios + 123 ConflictPatterns = 407**.
- HIGH/CRITICAL without owner/proof/detection route remains **0**.
- Negative-space remains `NOT_STARTED`.
- Saturation remains `NOT_SATURATED`.
- Planning C remains **BLOCKED**: 5/8 minimum full passes are complete, target reference is 12, and Full Pass 6 has only begun.

## 7. Next rotation

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, Full Pass 6, with **Process & Application Modeling** and explicitly exercise **Process/Application × Workflow × Data/Schema** using techniques materially different from Passes 1–5.

Carry Typed Semantic Graph/Federation/Workflow formal assurance plus Autonomous Builds/Fleet into definition/use/runtime separation; graph-revision versus workflow-instance pinning; unreachable/deadlocked composition under data-dependent predicates; nested sync/async subworkflow contracts; bounded recursion/termination; fan-out/fan-in joins under partial child completion; parent↔child context/data mappings; concurrent canonical writes and stale-read actuation; schema/presence-semantics revision skew; business truth versus journal/proof; external/federated handoff responsibility; resource/capacity bounds; human-procedure contradictions; and AI/low-code graph composition that hides `UNKNOWN`, changes analytical kind or strengthens proof/completion claims. Duplicate-screen all 123 ConflictPatterns. Process local streak and the cluster streak are already 2 and must not be inflated. Do not enter Planning C.