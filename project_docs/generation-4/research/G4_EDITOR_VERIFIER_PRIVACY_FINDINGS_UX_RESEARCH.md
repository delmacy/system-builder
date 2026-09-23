# G4 — Editor Verifier Lifecycle, Evidence Privacy & Findings UX Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of `G4_EDITOR_IMPACT_GRAPH_EVIDENCE_INVALIDATION_RESEARCH.md`, focused on three remaining cross-app gaps: verifier qualification/replacement, evidence retention/privacy, and scalable findings/contradiction/conformance UX. This is P&D documentation only. It creates no implementation, provider, WBS, Work Package, Sprint or TASK authority.

The findings preserve the current Builder UX hierarchy `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`, with 3D as an optional future projection/application rather than a mandatory shell.

## Evidence classes reviewed

- OpenTelemetry guidance on sensitive data: telemetry can contain PII, credentials, tokens, financial, health and behavior data; collection should be purpose-limited and minimized, with filtering/redaction/transformation where needed.
- W3C WCAG/WAI status-message guidance: `role=status` is polite/advisory, errors may use alert/live-region mechanisms, and excessive live-region use can make applications too chatty. Dynamic status should be programmatically determinable without forcing focus changes.
- Privacy-preserving process-mining literature: event logs and case attributes can expose sensitive information; privacy-preserving transformations are an active research area. This reinforces that conformance evidence is not a retention exemption.
- Existing G4 invariants: `Verifier installed != verifier qualified`, verifier replacement is a trust transition; `Evidence sufficient != payload retained`; `Proof verification != re-solving`; `UNKNOWN` is not permission to guess; effect truth, observation completeness and path conformance remain separate.

These sources are pattern evidence only; no technology/provider adoption is implied.

## F79 — Verifier identity is a qualified semantic dependency, not an implementation detail

A validator/verifier that can turn evidence into `PASS`, `EFFECTIVE`, `CONFORMANT` or another authoritative disposition belongs to the trusted qualification basis.

Candidate:

```text
VerifierQualification
  verifierSemanticId
  implementationDigest
  contractVersion
  supportedClaimKinds[]
  acceptedInputEvidenceKinds[]
  outputDispositionKinds[]
  trustDomain
  qualificationBasisRefs[]
  qualificationScope
  effectiveFrom
  effectiveUntil?
  status = CANDIDATE | QUALIFIED | RESTRICTED | SUSPENDED | RETIRED | UNKNOWN
```

`verifier executable != verifier qualified`.

The editor infrastructure may discover/install an implementation, but that event cannot silently authorize its outputs as proof.

## F80 — Verifier replacement is a trust transition with explicit proof-compatibility semantics

Replacing V1 with V2 does not automatically stale every historical proof, nor may V2 silently reinterpret V1 results.

Candidate compatibility:

```text
VerifierTransition
  fromVerifierRef
  toVerifierRef
  relation = OUTPUT_EQUIVALENT_FOR_SCOPE |
             STRICTER |
             WEAKER |
             INCOMPARABLE |
             BUGFIX_REQUIRES_REQUALIFICATION |
             UNKNOWN
  claimScope
  evidenceMigrationPolicy
  historicalInterpretationPolicy
  newAdmissionPolicy
```

Historical evidence remains bound to the verifier that produced it. New qualification may require V2 without rewriting history. If equivalence cannot be proven, disposition widens to requalification/UNKNOWN rather than assumed compatibility.

## F81 — Verifier qualification itself requires evidence and currentness

A verifier can become inadmissible because trust material expires, a vulnerability is discovered, policy changes, its semantic contract is superseded, or a defect is found.

Candidate:

```text
VerifierCurrentness
  qualificationRef
  securityCurrentness
  semanticCurrentness
  policyCurrentness
  trustMaterialCurrentness
  defectAdvisories[]
  disposition = CURRENT | STALE | REVOKED | UNKNOWN
```

This creates a recursive-looking problem, but not an infinite regress: the trust root/qualification authority must be explicit and bounded by policy. UI must show the basis rather than pretending that every verifier proves itself.

## F82 — Historical interpretation, current admissibility and requalification are three separate questions

For an old proof produced by V1:

1. **Historical interpretation:** what did V1 claim under the then-current contract?
2. **Current admissibility:** may that proof still satisfy today's gate/policy?
3. **Requalification:** can retained evidence be evaluated by V2 without recollecting sensitive/raw payload?

`historically valid != currently admissible`.

This matters to Revision/Diff, Publish qualification, Effect Lineage and Designed-vs-Observed.

## F83 — Evidence retention is claim/purpose-scoped; evidence sufficiency does not imply raw-payload retention

Introduce a retention contract separate from truth semantics.

```text
EvidenceRetentionContract
  evidenceKind
  purpose/claimKinds[]
  classification
  retentionHorizon
  minimumRequiredFields[]
  prohibitedFields[]
  redaction/pseudonymizationPolicy
  aggregationPolicy?
  legalHoldPolicy?
  deletion/tombstoneSemantics
  disclosurePolicy
  requalificationRequirements
```

A conformance proof may need semantic activity identity, ordering and timestamps without retaining free-text human-task notes. An effect proof may retain receipt identity/digest and authoritative disposition without retaining an entire provider payload.

`proof continuity != payload continuity`.

## F84 — Evidence projections use disclosure views rather than mutating canonical historical facts

Revision/Diff, Effect Lineage, Designed-vs-Observed, Inspector and Elicitation may expose different disclosure-safe projections of the same evidence reference.

Candidate:

```text
EvidenceDisclosureView
  evidenceRef
  viewerContext
  allowedClaims[]
  disclosedFields[]
  redactedFields[]
  aggregateOnlyFields[]
  reasonCodes[]
```

Redaction does not mean the hidden value is null/absent. UI must distinguish `REDACTED`, `NOT_RETAINED`, `UNKNOWN`, `NOT_APPLICABLE` and `NOT_AUTHORIZED_TO_VIEW`.

## F85 — Deletion can preserve a proof envelope without preserving sensitive payload

Where policy permits, deletion may leave a minimal tombstone/proof envelope:

```text
EvidenceTombstone
  formerEvidenceSemanticId
  claimKinds[]
  retainedDigest?
  dispositionAtDeletion?
  verifierRef?
  deletionReason
  deletedAt
  retentionPolicyRef
  requalificationPossible = YES | NO | PARTIAL | UNKNOWN
```

This supports auditability of why a historical decision existed without claiming the deleted payload remains available. If a future validator needs fields that were legitimately deleted, requalification becomes `IMPOSSIBLE_FROM_RETAINED_EVIDENCE` rather than fabricating currentness.

## F86 — Human-task evidence requires field-level minimization and purpose separation

Human tasks are especially likely to contain free text, identity, attachments and sensitive context. The Workflow Designer should declare required evidence fields separately from optional operator notes and UI convenience metadata.

Candidate classes:

```text
DECISION_FACT
AUTHORITY_ATTESTATION
REQUIRED_JUSTIFICATION
OPTIONAL_NOTE
ATTACHMENT
IDENTITY_REFERENCE
TIMING_EVIDENCE
```

Only claim-required classes should automatically enter durable proof lineage. `human task completed != retain every UI field forever`.

## F87 — Process-mining/conformance datasets are derived evidence products with their own privacy basis

`event log != raw runtime exhaust`.

A `ConformanceDataset` should declare extraction basis, mapping revision, included fields, case/correlation strategy, pseudonymization/aggregation, observation completeness and retention horizon. This prevents a convenient process-mining export from becoming an unbounded secondary archive of production data.

## F88 — Findings UX needs an attention model independent of finding count

Thousands of stale claims or conformance deviations cannot become thousands of toasts/live announcements.

Candidate:

```text
AttentionDisposition
  SILENT_INDEXED
  SUMMARY_STATUS
  REVIEW_REQUIRED
  BLOCKING_ACTION_REQUIRED
  IMMEDIATE_CRITICAL
```

Classification uses materiality, actionability, authority, currentness, novelty and scope. Count alone does not determine urgency.

`many findings != many interruptions`.

W3C guidance supports polite status updates for advisory state and warns against overly chatty live-region usage. Critical errors can use assertive/error mechanisms; ordinary background recomputation should be summarized.

## F89 — Finding aggregation preserves minority-critical truth

Aggregation dimensions may include claim kind, root cause, semantic owner, revision, workspace/app, affected scope, remediation kind and currentness.

Rules:

- `999 PASS + 1 BLOCKING != PASS`;
- `1000 stale findings caused by one schema revision` should surface the root cause plus affected-set drill-down;
- aggregation may compress presentation, never semantic disposition;
- hidden/redacted affected members contribute to aggregate severity without disclosing identities;
- deduplication uses semantic finding identity/basis, not message text.

This extends `Aggregation != silent omission` from scene rendering into validation/conformance UX.

## F90 — Status/Activity is the durable attention surface; toast/live region is a transient projection

Cross-app operations, qualification runs and conformance analyses should project into a durable Status/Activity model. Toasts and ARIA announcements are derived delivery channels.

Candidate announcement policy:

```text
AnnouncementPolicy
  SILENT
  POLITE_SUMMARY
  ASSERTIVE_FAILURE
  PERSISTENT_REVIEW_REQUIRED
```

Progress can update visually at high frequency while assistive announcements are rate-limited/coalesced to semantically meaningful transitions. Focus should not be stolen merely because a background qualification changed state.

## F91 — Findings carry lifecycle and supersession, not only open/closed

Candidate:

```text
FindingLifecycle
  OPEN
  ACKNOWLEDGED
  REMEDIATING
  RESOLVED
  SUPERSEDED
  ACCEPTED_EXCEPTION
  STALE_BASIS
  UNKNOWN
```

Resolution evidence is retained separately from finding identity. A later validator revision may supersede a finding without erasing that it affected a prior publish decision.

## F92 — Counterfactual conformance must never overwrite historical conformance

Comparing cases executed under Workflow rev 41 against rev 42 is a new analytical product:

```text
CounterfactualConformanceRun
  historicalRunRef
  targetWorkflowRevisionRef
  targetObservationMappingRevisionRef
  purpose
  assumptions[]
  comparabilityQualification
  findings[]
```

It answers “how would these historical observations align with rev 42?” rather than “what was true when they ran?”. This may support Elicitation, but does not rewrite original Effect Lineage or conformance truth.

## Cross-app semantic bridge impact

The bridge becomes:

```text
Artifact revisions
  -> typed bindings
  -> PublishBundle qualification
  -> qualified verifier set
  -> Preview/authorization evidence
  -> publish/effect occurrences
  -> runtime authoritative verification
  -> retention/disclosure-safe evidence
  -> Designed-vs-Observed / conformance
  -> findings/attention projections
  -> Elicitation proposals
```

Ownership remains separated:

- Workflow owns designed process semantics;
- View/Form/Component own interaction artifacts;
- Command/Action owns effect intent/contract;
- Permission/Policy owns authority semantics;
- verifier qualification governs which verifier outputs are admissible for which claims;
- Evidence stores/projections preserve proof lineage subject to retention/disclosure policy;
- Revision/Diff projects history/impact/effect/conformance;
- Elicitation may consume findings but does not mutate owners automatically.

## Complete-task/adversarial scenarios

1. **Verifier security retirement:** V1 produced historical PASS; V1 later revoked for new admission. Historical record stays attributable to V1; current publish gate requires V2/requalification.
2. **Verifier semantic change:** V2 changes a rule and finds a former PASS invalid. The old decision remains historical; affected current claims become stale/requalified rather than history being rewritten.
3. **Evidence deleted before new verifier:** V2 requires a field legitimately removed by retention policy. Result is `IMPOSSIBLE_FROM_RETAINED_EVIDENCE`/UNKNOWN, not reconstructed fiction.
4. **Human approval with sensitive note:** approval identity/time/authority are durable evidence; optional free-text note expires earlier. Effect lineage remains interpretable without retaining the note indefinitely.
5. **Conformance export:** process-mining dataset includes only declared case/activity/lifecycle/timing fields; raw form payload and unrelated identity attributes are excluded.
6. **10,000 stale claims from one schema change:** UI shows one root-cause summary with exact/qualified affected scope and drill-down, not 10,000 notifications.
7. **One blocking contradiction among 999 informational findings:** aggregate remains blocking/review-required; minority critical state is not averaged away.
8. **Background qualification completes while editing:** Status/Activity updates and polite summary may announce completion; editor focus/draft remain untouched.
9. **Disclosure-limited affected set:** reviewer sees `37 affected / 5 identities restricted`; restricted members still influence severity and qualification.
10. **Counterfactual workflow comparison:** historical cases from rev 41 are compared to rev 42 only in a separately labeled counterfactual run; original conformance remains pinned to 41.

## Componentization / complexity impact

- **P0 LOW/MEDIUM — shared primitives:** verifier/currentness badges, redacted/not-retained/unknown distinctions, finding severity/lifecycle, attention disposition.
- **P1 MEDIUM/HIGH — editor infrastructure:** VerifierQualification browser, retention/disclosure projection, findings aggregation/index, Status/Activity announcement policy, counterfactual-run viewer.
- **P2 HIGH/VERY HIGH — proprietary apps:** Workflow declares evidence requirements/observation mappings; Componentes catalogs proof/test refs without retaining unnecessary payload; Preview exposes verifier/basis; Revision/Diff projects verifier transition, retention gaps and counterfactual conformance.
- **P3 EXTREME — cross-app semantic integration:** verifier trust transition, selective requalification after verifier change, proof continuity across deletion/redaction, privacy-safe process mining, minority-critical aggregation and current admissibility of historical evidence.

Hotspots for future WBS (not executable planning): verifier trust-root boundaries; compatibility proof between verifier versions; requalification when source evidence has expired; privacy-safe correlation; aggregation semantics under disclosure restrictions; high-cardinality finding indexes.

## Componentes metadata candidates

```text
verifierRequirementRefs[]
verifierCompatibilityPolicy?
evidenceRetentionContractRef?
evidenceDisclosurePolicyRef?
requiredEvidenceFieldClasses[]
attentionDispositionPolicy?
findingAggregationDimensions[]
announcementPolicy?
counterfactualAnalysisSupported?
```

## Research maturity / saturation

`EDITOR_VERIFIER_PRIVACY_FINDINGS_UX = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence findings:

- verifier replacement is a trust transition, not a package upgrade;
- historical proof interpretation and current admissibility are independent;
- evidence retention is claim/purpose scoped and raw payload is not automatically durable proof;
- redacted, not-retained, unknown and unauthorized-to-view are distinct states;
- conformance datasets are derived evidence products with explicit privacy/retention basis;
- findings need durable aggregation/attention semantics separate from notification delivery;
- aggregation preserves minority-critical truth;
- counterfactual conformance is a separate analysis and never rewrites historical conformance.

Remaining gaps:

1. empirical graph/finding cardinality budgets and index strategy for 10^3–10^6 claims/findings;
2. formal verifier trust-root/bootstrap and cross-trust-domain qualification;
3. retention-policy conflict resolution across legal hold, privacy deletion and proof obligations;
4. privacy-safe case correlation/linkability boundaries for process mining;
5. quantitative announcement/coalescing thresholds validated with assistive-technology user testing;
6. exact semantics for qualification when evidence exists only as a cryptographic digest/tombstone;
7. editor UX for explaining why a proof is historically valid but no longer currently admissible.

Next research vector: **privacy-safe correlation + retention-policy conflicts + verifier trust-root/bootstrap**, followed by empirical scale budgets for impact/conformance/findings indexes.