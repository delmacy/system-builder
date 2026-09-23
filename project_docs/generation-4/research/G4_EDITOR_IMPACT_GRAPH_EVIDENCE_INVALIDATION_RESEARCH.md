# G4 — Editor Impact Graph & Evidence Invalidation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

Continuation of `G4_PROPRIETARY_EDITOR_SHARED_FOUNDATION_RESEARCH.md`. This artifact studies cross-app incremental impact propagation, evidence currentness, safe qualification reuse, environment promotion, and post-publish runtime effect lineage while preserving autonomous Workflow/View/Form/Component/Rule artifacts.

No implementation, provider selection, WBS, Work Package, Sprint or TASK authority is created here.

## Consolidated findings F34–F64

Prior rounds established:

- cross-editor impact is a typed semantic graph, not generic `dependsOn`;
- saved/reconciled revisions emit semantic change sets;
- evidence currentness is claim-relative rather than artifact-global;
- findings carry validator identity/version, basis revisions/digests and invalidation reasons;
- incremental qualification is an optimization over truth and widens to UNKNOWN/full qualification when completeness is not provable;
- propagation is directional and qualification-layer aware;
- affected slices must be explainable;
- selective Preview rerun is safe only with complete scenario dependency provenance;
- PublishBundle qualification snapshots dependency/evidence/validator basis;
- promotion preserves exact artifact identity but requalifies environment-bound facts;
- evidence is PORTABLE_ARTIFACT_PROOF, ENVIRONMENT_BOUND_PROOF or HYBRID_PROOF;
- dynamic bindings create continuing currentness obligations;
- Revision/Diff exposes impact delta;
- Elicitation consumes impact evidence without becoming mutation authority;
- Componentes catalogs invalidation behavior;
- qualification reuse uses semantic/contextual proof keys with completeness qualification;
- runtime effect lineage is rooted in immutable publish identity while occurrences remain independent;
- retry, compensation and reconciliation are distinct operations;
- asynchronous causal links do not imply one synchronous transaction;
- runtime evidence can stale current claims without rewriting historical design evidence;
- editor/session lifetime does not bound durable operation/evidence lifetime.

## Evidence classes reviewed in this continuation

- OpenTelemetry sampling: traces may intentionally not be processed/exported. Therefore absence of trace evidence cannot prove absence of a business effect.
- OpenTelemetry signals/observability model: traces, metrics and logs are observation signals. They are valuable supporting evidence but are not automatically canonical business truth.
- Camunda BPMN compensation documentation/workflow patterns: compensation is modeled as an explicit activity/handler associated with completed work, including service tasks, human tasks and subprocesses. This reinforces compensation as a new business action rather than history erasure or technical rollback.
- Process Mining conformance literature/tooling: conformance checking compares observed behavior/event logs with an expected process model; mapping between model tasks and observed events is explicit, and alignments distinguish observed/model-only moves. This supports a revision-pinned designed-vs-observed projection rather than treating telemetry labels as workflow identity.
- Existing G4 contracts: `ACK != EFFECTIVE`, `Trace/correlation != business causation != authority`, `Compensation != rollback/time reversal`, claim-relative evidence currentness, immutable PublishBundleCandidate, exact revision resolution, environment-bound qualification and partial/unknown outcomes remain constraints.

These are pattern sources only; no provider adoption is implied.

## F49–F64 — prior continuation summary

F49–F64 established semantic proof cache keys/completeness, proof reuse dispositions, validator compatibility, immutable publish-to-runtime lineage, occurrence identity, typed causal links, retry/compensation/reconciliation separation, Effect Lineage projection, promotion/runtime distinction, disclosure-safe lineage, runtime invalidation of design assumptions and durable operation/evidence identity.

## F65 — Effect verification authority is claim-specific, not a universal source priority

A fixed hierarchy such as `provider response > read model > telemetry` is unsafe because authority depends on the effect contract. Instead define a claim-specific verification contract.

Candidate:

```text
EffectVerificationContract
  effectKind
  successPredicate
  failurePredicate
  authoritativeEvidenceKinds[]
  corroboratingEvidenceKinds[]
  inadmissibleAsProofKinds[]
  requiredFreshness/currentness
  requiredIdentity/correlation dimensions
  quorum/combination rule?
  contradictionPolicy
  timeoutDisposition
  reconciliationPolicyRef
```

Examples:

- a provider-generated immutable settlement receipt may be authoritative for provider settlement but not for downstream domain projection;
- a domain aggregate committed state may be authoritative for local business state but not for an external payment effect;
- a read model may be eventually consistent and therefore corroborating only;
- a trace/span is normally observational evidence and may be sampled.

`source type != universal authority`.

## F66 — Verification must distinguish effect truth from observation completeness

Candidate dimensions:

```text
EffectVerificationResult
  effectDisposition = EFFECTIVE | FAILED | PARTIAL | UNKNOWN
  observationCompleteness = COMPLETE | PARTIAL | UNKNOWN
  evidenceCurrentness = CURRENT | STALE | UNKNOWN
  contradictions[]
  verifiedAt
  verifierIdentity/version
  basisRefs[]
```

An EFFECTIVE result can be supported by an authoritative receipt even when telemetry is partial. Conversely, complete telemetry cannot manufacture business effect truth if the effect contract requires another authority.

## F67 — Telemetry absence is explicitly non-negative evidence unless the contract says otherwise

OpenTelemetry supports sampling in which non-sampled traces are not processed/exported. Therefore:

`no trace != no invocation != no effect`.

Negative proof requires a source/contract capable of proving non-occurrence within a declared scope and horizon. A sampled trace store cannot silently become that source.

This turns adversarial obligation 21 into a formal verification rule.

## F68 — Contradictory evidence produces a contradiction state, not majority voting

When provider receipt, domain state, read model and telemetry disagree, the UI/engine should preserve contradiction explicitly.

Candidate:

```text
EvidenceContradiction
  claimRef
  evidenceRefs[]
  contradictionKind
  materiality
  authorityComparison
  currentnessComparison
  resolutionStatus = OPEN | RECONCILING | RESOLVED | ACCEPTED_WITH_AUTHORITY
  resolutionEvidenceRef?
```

Two weak sources agreeing do not automatically defeat one authoritative contradictory source. `evidence count != semantic truth`.

## F69 — Reconciliation is selected by uncertainty class

Candidate taxonomy:

```text
ReconciliationPolicy
  QUERY_AUTHORITATIVE_STATE
  REPLAY_VERIFICATION_ONLY
  WAIT_FOR_SETTLEMENT
  CORRELATE_EXTERNAL_RECEIPT
  HUMAN_ATTESTATION
  MANUAL_INVESTIGATION
  DOMAIN_SPECIFIC_RECONSTRUCTION
```

The policy must declare whether it is observation-only or may issue a new business effect. Observation-only reconciliation cannot silently mutate domain state merely to make projections agree.

## F70 — Compensation capability is declared per effect; reversibility is not assumed

Candidate:

```text
CompensationPolicy
  effectKind
  compensationMode = AUTOMATIC | AUTHORIZED | HUMAN_REQUIRED | EXTERNAL_PROCEDURE | NONE
  reversibility = REVERSIBLE | SEMANTICALLY_COMPENSABLE | MITIGATABLE_ONLY | IRREVERSIBLE | UNKNOWN
  compensationCommandRef?
  authorityRequirement
  preconditions[]
  deadline/horizon?
  downstreamObligations[]
  verificationContractRef
```

A refund is not time reversal of a charge; a notification cannot be unsent; a human decision may require correction/supersession rather than reversal. The UI must not render a generic Undo for these cases.

## F71 — Human tasks require explicit correction/attestation semantics

For human work, compensation may be impossible or semantically misleading. Candidate remediation kinds:

```text
HUMAN_REVIEW
CORRECTIVE_TASK
SUPERSEDING_DECISION
ATTESTATION
EXCEPTION_ACCEPTANCE
EXTERNAL_REMEDIATION
```

A completed human approval that later proves wrong remains a historical fact. A new decision may supersede it, but must not rewrite the original occurrence.

## F72 — Designed Workflow and observed execution join through a versioned Observation Mapping

Process-mining evidence requires explicit mapping between observed event classes and model activities. SB should preserve this mapping as a qualified artifact rather than infer identity from labels.

Candidate:

```text
ObservationMapping
  workflowRevisionRef
  mappingRevision
  activityMappings[]
    activitySemanticId
    observableEventPredicate
    lifecycleMapping
    correlation/case identity rule
    confidence/qualification
  invisibleActivities[]
  intentionallyUnobservedActivities[]
  unmappedObservedEventPolicy
```

`same label != same activity`; `event correlation != workflow ownership`.

## F73 — Conformance evidence is revision-pinned and cannot silently compare against latest Workflow

Candidate:

```text
ConformanceRun
  workflowRevisionRef
  observationMappingRevisionRef
  eventLogBasisRef
  caseScope
  algorithm/validator identity+version
  completeness/currentness
  findings[]
```

If Workflow revision 42 changes after cases executed under revision 41, those historical cases remain evaluated against 41 unless an explicit counterfactual/requalification analysis is requested.

`latest workflow != historical execution semantics`.

## F74 — Conformance findings distinguish model-only, observed-only and ordering/guard/effect deviations

Candidate finding classes:

```text
EXPECTED_ACTIVITY_MISSING
UNEXPECTED_OBSERVED_ACTIVITY
ORDER_DEVIATION
REQUIRED_GATE_BYPASSED
HANDOFF_MISMATCH
AUTHORITY_DEVIATION
EFFECT_VERIFICATION_MISSING
TIMEOUT/SLA_DEVIATION
MAPPING_AMBIGUITY
OBSERVATION_INCOMPLETE
```

This is richer than a binary conformant/non-conformant badge and prevents observation gaps from being mislabeled as business violations.

## F75 — Conformance does not become mutation authority

Observed deviations may create findings, proposals or Elicitation inputs, but cannot automatically rewrite Workflow, Rule, Permission or Command definitions.

`frequent observed path != approved designed path`.

A process-mining recommendation can suggest change; authorization/publish remains under the existing editor/revision contracts.

## F76 — Conformance and effect verification meet at gates/handoffs without collapsing

A workflow may appear structurally conformant while an external effect remains UNKNOWN. Conversely, an effect may be verified even if the path violated a required gate.

Therefore preserve two axes:

```text
PathConformance = CONFORMANT | DEVIATED | UNKNOWN
EffectDisposition = EFFECTIVE | FAILED | PARTIAL | UNKNOWN
```

Never derive one from the other. A case can be `DEVIATED + EFFECTIVE` and still require remediation/audit.

## F77 — Preview/Sandbox evidence cannot satisfy runtime verification by resemblance

Preview may validate binding, state transitions and simulated effect contracts, but runtime effect verification requires runtime-authoritative evidence according to the effect contract.

`preview success != runtime effect evidence`.

This closes a cross-app semantic bridge between Preview, Workflow, Command and Evidence while preserving ownership.

## F78 — Revision/Diff gains a designed-vs-observed projection alongside Effect Lineage

Candidate projections now become:

```text
Artifact Diff
Impact Diff
Effect Lineage
Designed vs Observed
```

Designed vs Observed pins Workflow revision, mapping revision, observation basis and conformance findings. It may link to Effect Lineage for a selected occurrence/case, but neither projection owns the other's truth.

## Complete-task scenarios added

### Provider ACK but no authoritative effect proof

`Command -> provider ACK -> trace success -> effect contract requires settlement receipt -> receipt absent -> EffectDisposition UNKNOWN -> Reconcile/Wait for settlement; UI must not show EFFECTIVE`.

### Authoritative receipt with sampled telemetry

`Command -> authoritative settlement receipt EFFECTIVE -> trace absent because unsampled -> effect EFFECTIVE + observationCompleteness PARTIAL; missing trace is not contradiction`.

### Read-model disagreement

`authoritative domain state EFFECTIVE -> read model still old -> contradiction classified as projection lag -> effect remains EFFECTIVE while read-model currentness is STALE/UNKNOWN -> reconciliation waits/rebuilds projection`.

### Irreversible effect

`notification delivered -> later rule violation found -> CompensationPolicy IRREVERSIBLE/MITIGATABLE_ONLY -> no Undo -> corrective notification or human remediation creates a new occurrence`.

### Human approval corrected

`approval A completed -> audit finds invalid basis -> corrective human task B -> B supersedes decision semantics where authorized -> A remains historical evidence`.

### Designed-vs-observed gate bypass

`case executes under Workflow rev 41 -> observed mapping shows required gate G absent -> REQUIRED_GATE_BYPASSED -> effect nevertheless verified EFFECTIVE -> case = DEVIATED + EFFECTIVE -> finding/audit, no automatic Workflow mutation`.

### Workflow changes after execution

`cases ran under rev 41 -> designer publishes rev 42 -> historical ConformanceRun stays pinned to 41 -> optional explicit counterfactual comparison to 42 is separately labeled`.

## Adversarial proof obligations added

25. Provider ACK and successful trace but no authoritative effect evidence: remain UNKNOWN.
26. Trace missing due to sampling but authoritative receipt exists: do not downgrade verified effect merely because observability is incomplete.
27. Two telemetry signals disagree with authoritative domain state: do not majority-vote truth.
28. Read model lags authoritative aggregate: classify projection currentness separately from effect truth.
29. Compensation unavailable for irreversible effect: UI must not expose generic Undo.
30. Human task corrected later: original completion remains immutable historical evidence.
31. Event label matches activity name but mapping revision differs: do not infer semantic identity from text.
32. Observed log is incomplete: missing activity cannot automatically become business violation without observation-completeness qualification.
33. Workflow latest revision differs from execution revision: conformance remains pinned to execution semantics.
34. Required gate bypassed but downstream effect succeeded: path remains deviated; success cannot erase bypass.
35. Structurally conformant path with UNKNOWN external effect: conformance cannot manufacture EFFECTIVE.
36. Preview passes simulated provider effect: runtime verification remains required.

## Componentization impact

- **P0 LOW/MEDIUM — shared primitives:** effect-verification disposition, observation-completeness marker, contradiction badge, compensation/reconciliation policy marker, conformance deviation marker.
- **P1 MEDIUM/HIGH — editor infrastructure:** EffectVerificationContract browser, EvidenceContradiction projection, reconciliation action resolver, ObservationMapping editor/viewer, revision-pinned ConformanceRun viewer.
- **P2 HIGH/VERY HIGH — proprietary apps:** Workflow Designer exposes observability mapping/gate semantics; Rules/Decision and Command surfaces expose effect/compensation policies; Preview declares simulation boundaries; Revision/Diff exposes Designed-vs-Observed; Evidence joins effect/conformance without taking ownership.
- **P3 EXTREME — cross-app integration:** claim-specific authoritative verification, contradiction resolution, non-reversible/human remediation, revision-pinned observed-vs-designed alignment and dual-axis path/effect truth.

Dependency hotspot: no universal verifier hierarchy is safe. Authority belongs to the effect contract/claim and may require different sources for different dimensions. Likewise conformance quality depends on mapping and observation completeness, not merely event-log availability.

## Componentes metadata impact

Add candidates:

```text
effectVerificationContractRef?
authoritativeEvidenceKinds[]
corroboratingEvidenceKinds[]
negativeEvidencePolicy
contradictionPolicy
reconciliationPolicyRef?
compensationPolicyRef?
observationMappingKinds[]
conformanceFindingKinds[]
pathConformanceProjection?
runtimeVerificationRequired?
```

## Research maturity / saturation

`EDITOR_IMPACT_GRAPH_EVIDENCE_INVALIDATION = ADVANCED / MATERIAL_DELTA`.

High-confidence additions from this round:

- authoritative effect verification is claim/effect-contract specific rather than one global source hierarchy;
- observability completeness and effect truth are independent dimensions;
- sampled telemetry absence cannot prove effect absence;
- contradictions remain explicit and are not resolved by source-count majority;
- compensation is effect-specific and may be semantic mitigation rather than reversal;
- human-task correction preserves original history;
- designed-vs-observed conformance requires versioned activity/event mapping and workflow-revision pinning;
- path conformance and effect disposition are orthogonal;
- Preview evidence never substitutes for runtime-authoritative effect verification.

Remaining gaps:

1. empirical fan-out/cycle budgets and incremental graph storage/index strategy at large scale;
2. exact UX summarization for thousands of contradictions/stale claims/conformance findings without alert fatigue;
3. retention/privacy policy for runtime evidence, human-task evidence and redacted lineage;
4. domain-specific authoritative verifier discovery/qualification lifecycle and verifier replacement;
5. counterfactual conformance semantics when intentionally comparing historical cases to a newer Workflow revision;
6. quantitative thresholds for when conformance alignment becomes too expensive for interactive use and must become asynchronous/background analysis.

Next research vector: **verifier qualification/replacement lifecycle + evidence retention/privacy + scalable conformance/impact UX**, then empirical graph-scale budgets.