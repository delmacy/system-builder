# G4 — Editor Impact Graph & Evidence Invalidation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

Continuation of `G4_PROPRIETARY_EDITOR_SHARED_FOUNDATION_RESEARCH.md`. This artifact studies cross-app incremental impact propagation, evidence currentness, safe qualification reuse, environment promotion, and post-publish runtime effect lineage while preserving autonomous Workflow/View/Form/Component/Rule artifacts.

No implementation, provider selection, WBS, Work Package, Sprint or TASK authority is created here.

## Consolidated findings F34–F48

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
- Componentes catalogs invalidation behavior.

## Evidence classes reviewed in this continuation

- SLSA Provenance: reproducibility depends on explicit materials/digests and completeness of environment/material declarations. This supports content-addressed qualification basis and explicit completeness rather than cache reuse from artifact bytes alone.
- OpenTelemetry Trace API/overview: immutable propagated context, causal parent/child relationships and Links across separate/asynchronous traces provide mature pattern evidence for joining authoring/publish/runtime/reconciliation lineage without forcing all events into one transaction or one trace.
- Existing G4 contracts: `ACK != EFFECTIVE`, claim-relative evidence currentness, immutable PublishBundleCandidate, exact revision resolution, environment-bound qualification and partial/unknown outcomes remain authoritative research constraints.

These are pattern sources only; no provider adoption is implied.

## F49 — Qualification reuse requires a semantic proof key, not a file/content cache key

Candidate:

```text
QualificationCacheKey
  claimKind
  subjectSemanticDigest
  resolvedDependencyClosureDigest
  validatorIdentity
  validatorVersion
  validatorConfigDigest
  authorityPolicyDigest
  disclosureContextClass
  environmentFactDigest?       // required for environment-bound/hybrid proof
  previewSubstitutionDigest?   // when preview participates in claim
  qualificationContractVersion
```

A byte-identical Form under a different permission policy, validator version, resolved dynamic dependency or target environment is not the same proof input.

`same artifact bytes != same qualification basis`.

## F50 — Cache-key completeness must itself be qualified

SLSA distinguishes declared materials/environment from claims that those sets are complete. Apply the same principle to editor qualification.

Candidate:

```text
QualificationBasisCompleteness
  dependencyClosure = COMPLETE | PARTIAL | UNKNOWN
  environmentFacts = COMPLETE | PARTIAL | UNKNOWN | NOT_APPLICABLE
  authorityFacts = COMPLETE | PARTIAL | UNKNOWN
  disclosureImpact = NONE | BOUNDED | UNKNOWN
  validatorInputs = COMPLETE | UNKNOWN
```

A cache hit is reusable only if every dimension required by the claim is complete enough for that claim. Missing provenance cannot be encoded as an empty digest and accidentally collide with a genuinely empty dependency set.

## F51 — Proof reuse should return a disposition, not boolean hit/miss

Candidate:

```text
ProofReuseDisposition
  EXACT_REUSE
  REUSE_WITH_ENVIRONMENT_REQUALIFICATION
  REUSE_WITH_AUTHORITY_REQUALIFICATION
  REUSE_AS_HISTORICAL_ONLY
  REQUIRES_PARTIAL_REQUALIFICATION
  REQUIRES_FULL_REQUALIFICATION
  UNKNOWN
```

This supports promotion and cross-editor workflows without converting every change into global recomputation or every cache hit into current truth.

## F52 — Validator compatibility is a declared contract

Validator version changes do not automatically imply either safe reuse or total invalidation.

Candidate:

```text
ValidatorCompatibility
  validatorIdentity
  fromVersion
  toVersion
  compatibleClaimKinds[]
  invalidatedClaimKinds[]
  requiresMigration/requalification
  compatibilityEvidenceRef
```

Absent a qualified compatibility declaration, prior PASS remains historical evidence and the current claim is requalified.

## F53 — Runtime effect lineage starts from the immutable publish candidate

Authoring history and runtime execution must join without becoming one ownership domain.

Candidate:

```text
EffectLineageRoot
  publishBundleManifestDigest
  authorizationRef
  publishOperationRef
  targetEnvironmentRef
  exactArtifactResolutions[]
  qualificationBasisRef
```

Runtime occurrences link back to this root. They do not mutate the historical PublishBundle or authoring revisions.

## F54 — Runtime occurrence identity is separate from semantic command identity

One Command/Action definition can execute many times.

```text
EffectOccurrence
  occurrenceId
  command/action identity
  lineageRootRef
  invocationRef
  actor/authorityEvidenceRef
  inputDigest/redactedEvidenceRef
  startedAt
  ackAt?
  verificationEvents[]
  effectStatus
    PENDING
    EFFECTIVE
    PARTIAL
    FAILED
    UNKNOWN
  runtimeEvidenceRefs[]
```

`CommandDefinition != EffectOccurrence` and `ACK != EFFECTIVE`.

## F55 — Causal links are preferable to fake transaction ancestry for asynchronous reconciliation

OpenTelemetry distinguishes parent/child from Links and explicitly supports linking causally related asynchronous work across separate traces. SB should similarly permit a later verification, reconciliation or compensation operation to link to the originating effect occurrence without pretending it was a synchronous child transaction.

Candidate relation kinds:

```text
INITIATED_BY
VERIFIES
RETRIES
COMPENSATES
RECONCILES
SUPERSEDES
CAUSED_BY_DRIFT
```

Each relation is typed and evidence-bearing.

## F56 — Retry creates a new occurrence with lineage; it does not rewrite history

A retry must preserve the failed/unknown original occurrence.

```text
Occurrence A -> FAILED
Occurrence B --RETRIES--> A -> EFFECTIVE
```

Revision/Diff and Evidence can therefore answer both “what is effective now?” and “what actually happened?”. Replacing A with B would destroy audit/conformance evidence.

## F57 — Compensation is a new authorized business effect, not undo

`Undo editor != rollback publish != compensation`.

Candidate:

```text
CompensationOccurrence
  compensatesOccurrenceRef
  compensationCommandRef
  authorityEvidenceRef
  preconditionEvidenceRef
  resultStatus
  effectVerificationRef
```

Compensation may itself fail, be partial or become UNKNOWN. A successful compensation does not erase the original effect; it changes effective state through another evidenced action.

## F58 — Reconciliation resolves knowledge/currentness; it need not create a business effect

A reconciliation operation may inspect external state and convert an `UNKNOWN` occurrence into `EFFECTIVE` or `FAILED` without issuing a compensating or repeated command.

This distinction prevents the UI from offering “Retry” when the correct action is “Verify/Reconcile”.

## F59 — Revision/Diff needs an Effect Lineage projection

Alongside Artifact Diff and Impact Diff, expose:

```text
Effect Lineage
  bundle/revision basis
  publish/authorization
  occurrences
  ACK/verification/effect transitions
  retries
  compensations
  reconciliations
  runtime drift
  evidence currentness
```

This is a projection over linked records, not ownership transfer from runtime into Revision/Diff.

## F60 — Elicitation/Requirements can trace runtime proof back to requirement claims

A requirement may be supported by design-time proof and later runtime evidence. Runtime drift or failed effects may stale the requirement's evidence claim, but Elicitation remains traceability/proposal authority only.

`runtime finding != permission for Elicitation to mutate Workflow/Command`.

## F61 — Promotion must distinguish reusable proof from inherited runtime truth

Promoting an exact bundle from TEST to PROD may reuse portable artifact proofs, but TEST runtime effects are not evidence that PROD effects occurred. PROD receives a new `EffectLineageRoot`/environment qualification and new occurrences.

`same bundle != same runtime occurrence`.

## F62 — Disclosure-safe lineage may preserve causality without exposing payload/identity

Cross-app Evidence/Revision views may be allowed to know that a dependency/effect exists while lacking permission to reveal its subject or payload. Candidate projection states:

```text
VISIBLE
REDACTED_IDENTITY
REDACTED_PAYLOAD
AGGREGATED
DISCLOSURE_LIMITED
UNKNOWN
```

A disclosure-limited edge must not become “no dependency/no effect”. Cache keys include disclosure context class when disclosure changes what can be qualified.

## F63 — Runtime evidence can invalidate design-time assumptions without rewriting design history

Examples:

- provider drift invalidates an environment compatibility claim;
- repeated permission denial may expose policy/config drift;
- runtime schema rejection can stale a compatibility proof;
- observed workflow bypass can create a conformance finding against the designed path.

Historical design evidence remains explainable for its original basis, while currentness changes.

## F64 — Long-lived lineage needs retention/reference stability independent of editor session lifetime

Closing Workspace/Application/Desktop Sphere cannot orphan a pending publish/effect/reconciliation. The durable identity belongs to the operation/evidence layer; editor windows merely project it.

This extends the earlier `OperationRegistry` principle into post-publish runtime evidence.

## Complete-task scenarios added

### Safe proof reuse

`Component revision unchanged -> validator/config/dependency/authority/environment digests equal -> completeness sufficient -> EXACT_REUSE -> evidence remains CURRENT`.

### Unsafe apparent cache hit

`Form bytes unchanged -> Permission policy changed -> authorityPolicyDigest differs -> authority proof requalified while unrelated portable proof may reuse`.

### Validator upgrade

`validator v3 PASS -> v4 installed -> no compatibility declaration -> historical PASS retained -> current claim REQUIRES_REQUALIFICATION`.

### Publish then asynchronous verification

`qualified bundle -> authorization -> publish ACK -> editor closes -> runtime verification later links to EffectLineageRoot -> EFFECTIVE -> Revision/Diff and Evidence projections update without reopening original editor`.

### Unknown then reconcile

`command ACK -> transport lost -> effect UNKNOWN -> Reconcile queries authoritative external state -> links to occurrence -> EFFECTIVE; no retry was issued`.

### Failed then compensate

`effect A EFFECTIVE -> later unacceptable downstream state -> authorized compensation B COMPENSATES A -> B EFFECTIVE -> both occurrences preserved`.

### Promotion

`TEST exact bundle + portable proof -> PROD environment requalification -> new lineage root -> publish/verify in PROD; TEST occurrence IDs never become PROD occurrence evidence`.

## Adversarial proof obligations added

13. Same artifact digest, different authority policy: cache must not reuse authority proof.
14. Missing dependency provenance encoded as empty set: cache reuse must be rejected.
15. Same bundle, different target environment: environment-bound proof must requalify.
16. Validator upgraded with no compatibility contract: old PASS cannot become current PASS.
17. Retry succeeds: original failure remains visible and auditable.
18. Compensation succeeds: original effect is not deleted/relabelled as never happened.
19. Reconciliation confirms effect after timeout: UI must not claim a retry caused it.
20. Workspace closes after ACK: later verification still resolves durable occurrence.
21. Runtime trace sampled/partial: absence of telemetry cannot prove absence of effect; effect remains UNKNOWN unless authoritative verification exists.
22. Disclosure hides target identity: causality remains represented as disclosure-limited rather than deleted.
23. TEST execution passed: PROD publish cannot inherit TEST effect truth.
24. Runtime observed path bypasses required gate: design history remains intact while conformance evidence records deviation.

## Componentization impact

- **P0 LOW/MEDIUM — shared primitives:** proof-currentness marker, reuse-disposition badge, effect-status marker, lineage relation marker, disclosure-safe evidence reference.
- **P1 MEDIUM/HIGH — editor infrastructure:** QualificationBasis builder, cache/reuse registry, validator compatibility registry, EffectLineage viewer, durable operation/evidence projection.
- **P2 HIGH/VERY HIGH — proprietary apps:** editors emit exact semantic digests/change kinds and domain validators; Revision/Diff adds Effect Lineage; Preview/Evidence distinguishes historical/current/runtime proof; Elicitation consumes traced claims.
- **P3 EXTREME — cross-app integration:** safe cache-key completeness, environment/authority/disclosure-sensitive reuse, immutable publish-to-runtime lineage, compensation/reconciliation semantics and long-lived evidence currentness.

Dependency hotspot: content-addressing is insufficient unless semantic dependency closure, validator inputs and context completeness are trustworthy. Runtime observability is supporting evidence, not automatically authoritative effect verification.

## Componentes metadata impact

Add candidates:

```text
qualificationInputKinds[]
qualificationKeyDimensions[]
requiredCompletenessDimensions[]
proofReusePolicy
validatorCompatibilityPolicy
runtimeEvidenceKinds[]
effectLineageRelationKinds[]
compensationSemantics?
reconciliationSemantics?
disclosureProjectionPolicy
historicalVsCurrentProofBehavior
```

## Research maturity / saturation

`EDITOR_IMPACT_GRAPH_EVIDENCE_INVALIDATION = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence additions:

- proof cache keys must include semantic/contextual qualification basis, not only artifact digest;
- completeness of the cache basis is itself a proof obligation;
- proof reuse needs qualified dispositions rather than boolean cache hit;
- runtime effect lineage is rooted in an immutable publish candidate but owns separate occurrence identities;
- retry, compensation and reconciliation are distinct operations;
- asynchronous causal links should not be forced into fake synchronous ancestry;
- runtime evidence may change currentness without rewriting historical design evidence;
- editor/session lifetime must not bound long-lived operation/evidence lifetime.

Remaining gaps:

1. empirical fan-out/cycle budgets and incremental graph storage/index strategy at large scale;
2. exact authoritative-verification hierarchy when telemetry, provider response and domain read-model disagree;
3. UX summarization for thousands of stale claims/lineage occurrences without alert fatigue;
4. retention/privacy policy for runtime evidence and redacted lineage;
5. compensation policy discovery for non-reversible effects and human tasks;
6. formal relationship between observed conformance/process-mining evidence and designed Workflow revision.

Next research vector: **authoritative effect verification hierarchy + compensation/reconciliation policy taxonomy + designed-vs-observed conformance linkage**, then empirical graph-scale budgets.