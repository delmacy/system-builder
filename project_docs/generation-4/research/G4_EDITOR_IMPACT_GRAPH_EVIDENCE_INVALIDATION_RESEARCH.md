# G4 — Editor Impact Graph & Evidence Invalidation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

Continuation of `G4_PROPRIETARY_EDITOR_SHARED_FOUNDATION_RESEARCH.md`. This artifact studies the next cross-app hotspot after DraftGroup / PublishBundle: incremental impact propagation, stale findings/evidence, and environment promotion while preserving autonomous Workflow/View/Form/Component/Rule artifacts.

No implementation, provider selection, WBS, Work Package, Sprint or TASK authority is created here.

## Evidence classes reviewed

- Nx `affected` / project graph: a changed node plus dependency graph can determine the minimum affected project subset rather than recomputing the entire workspace; cached graph analysis reinforces incremental recomputation as a mature pattern.
- Storybook change detection: Git diff plus module import graph identifies stories related to changed files; test tags allow selective proof execution. Pattern evidence only, not a provider decision.
- Camunda 8 resource binding: `latest`, `deployment`, and `versionTag` make resolution policy materially affect compatibility and reproducibility across linked processes/forms/decisions; `versionTag` is recommended for stable shared dependencies.

These sources support incremental impact analysis, but SB needs richer semantic edge types than source-code import graphs.

## F34 — Cross-editor impact must be a typed semantic graph

Candidate:

```text
ArtifactImpactGraph
  nodes[]
    artifactIdentity
    artifactKind
    revision
    semanticDigest
  edges[]
    edgeIdentity
    source
    target
    edgeKind
    resolutionPolicy
    dependencyStrength
    qualificationLayers[]
```

Candidate edge kinds include:

```text
WORKFLOW_FORM_BINDING
WORKFLOW_RULE_BINDING
VIEW_COMPONENT_COMPOSITION
FORM_SCHEMA_BINDING
COMPONENT_COMMAND_BINDING
COMMAND_PERMISSION_BINDING
COMMAND_DOMAIN_EFFECT
VISIBILITY_RULE_BINDING
PREVIEW_FIXTURE_DEPENDENCY
EVIDENCE_PROVES_CLAIM
REQUIREMENT_TRACES_TO_ARTIFACT
DEPLOYMENT/PUBLISH_DEPENDENCY
```

An untyped `dependsOn` graph is insufficient because a schema change and a permission change invalidate different proofs.

## F35 — Change classification should drive affected-proof calculation

Each saved/reconciled revision should expose a semantic change set, not only a text diff.

```text
SemanticChangeSet
  artifact
  fromRevision
  toRevision
  changes[]
    STRUCTURE
    SCHEMA
    BINDING
    COMMAND_CONTRACT
    AUTHORITY_POLICY
    DOMAIN_EFFECT
    WORKFLOW_REACHABILITY
    VISIBILITY_RULE
    RESPONSIVE_RULE
    ACCESSIBILITY_CONTRACT
    PREVIEW_SUBSTITUTION
    EVIDENCE_REFERENCE
```

Impact traversal combines `changeKind x edgeKind x proofKind`. A cosmetic layout change should not automatically invalidate authority evidence; a permission-binding change should.

## F36 — Evidence currentness is claim-relative, not artifact-global

A single artifact revision may have several independent proofs. Therefore `artifact evidence = stale/current` is too coarse.

Candidate:

```text
EvidenceClaim
  claimId
  subjectRef
  claimKind
  evidenceRef
  evidenceBasis[]
    artifactRevision/digest
    bindingResolution
    environmentFacts
    provider/substitution facts
  currentness
    CURRENT
    STALE
    UNKNOWN
    NOT_APPLICABLE
  invalidatedBy[]
```

Example: changing a button label may stale a visual snapshot but leave command-authority proof current. Changing the Command binding may stale interaction, authority, preview and publish-readiness evidence while leaving unrelated responsive proof current.

## F37 — Findings need provenance and invalidation reasons

A finding is not merely open/closed.

```text
Finding
  findingId
  rule/validator identity + version
  subject/binding edge
  basis revisions/digests
  status
    OPEN
    RESOLVED
    WAIVED_WITH_AUTHORITY
    STALE
    UNKNOWN
  invalidationReason?
  supersededBy?
```

If the basis changes, a previous PASS or RESOLVED result can become `STALE`; it must not silently remain green.

`previous PASS != current PASS`.

## F38 — Incremental qualification needs conservative fallback

Affected-set calculation is an optimization over truth, not truth itself. If edge provenance is missing, validator version changed, graph completeness is unknown, or disclosure prevents dependency resolution, the system must widen the affected set or return `UNKNOWN/REQUIRES_FULL_QUALIFICATION`.

`cannot prove unaffected != unaffected`.

This prevents an optimization bug from becoming a conformance bug.

## F39 — Impact propagation should be directional and layer-aware

Not every dependency invalidates in both directions.

Examples:

- Form schema change can invalidate Workflow mappings that consume it.
- Workflow control-flow change does not necessarily invalidate the Form's local accessibility proof.
- Permission-policy change can invalidate a View/Component action eligibility proof without changing visual composition.
- Component accessibility-contract change can affect every View/Form composing it even if the component API is otherwise compatible.

The graph therefore needs edge direction plus qualification-layer semantics.

## F40 — Requalification should produce an explainable affected slice

The editor should answer:

```text
Changed: Form CustomerEdit@42
Affected:
  Workflow Onboarding@17
    because OUTPUT_MAPPING consumes removed field customer.taxId
  View CustomerReview@9
    because ComponentBinding references changed Form section
Unaffected proof examples:
  Command authority proof C-17
  Deployment placement proof D-4
```

This is crucial for guided UX: the user sees what must be repaired and why rather than receiving a global `bundle invalid` state.

## F41 — Preview should rerun only impacted scenarios when completeness is provable

Preview/Evidence Lab may maintain scenario-to-semantic-dependency links. A changed Command binding should rerun scenarios exercising that binding; unrelated visual-state stories can remain current if their evidence basis excludes it.

Storybook's change-detection and selective test patterns provide evidence for affected-test UX, but SB requires semantic dependency provenance beyond file imports.

If scenario dependency coverage is incomplete, selective rerun is not enough; qualification must mark coverage `UNKNOWN` or widen execution.

## F42 — PublishBundle qualification should snapshot the impact graph slice

The immutable candidate manifest should include or digest the relevant dependency closure and validator/evidence versions. Otherwise later graph changes can make it impossible to explain why candidate A was qualified.

Candidate addition:

```text
qualificationBasis
  dependencyClosureDigest
  validatorSetDigest
  evidenceBasisDigest
  environmentQualificationRef
  affectedSliceRef
```

Historical qualification remains reproducible without pretending it is current for candidate B.

## F43 — Environment promotion must preserve artifact identity while requalifying environment facts

Promotion should not mean `copy whatever is latest`.

Candidate:

```text
PromotionCandidate
  sourceEnvironment
  targetEnvironment
  publishBundleManifestDigest
  exact member revisions/resolutions
  portableEvidenceRefs[]
  environmentBoundEvidenceRefs[]
  targetQualification
```

Artifact revisions can remain exact across DEV -> TEST -> PROD while environment-bound facts (provider availability, secrets/config presence, authority policy, topology, runtime compatibility) require target requalification.

`same artifact bundle != same environment qualification`.

## F44 — Evidence portability needs an explicit class

Candidate:

```text
PORTABLE_ARTIFACT_PROOF
  schema/type/static accessibility/semantic reachability where basis is environment-independent

ENVIRONMENT_BOUND_PROOF
  provider reachability/runtime integration/deployment/topology/secret presence

HYBRID_PROOF
  artifact behavior plus environment-specific adapter/provider facts
```

Promotion may reuse portable evidence only when its exact basis/digest remains unchanged. Environment-bound evidence cannot be inherited merely because the source environment passed.

## F45 — Dynamic runtime bindings create a continuing currentness obligation

A `latest`-style binding intentionally resolves after publish and may change without a new authoring revision. Camunda's documentation demonstrates the compatibility risk of this policy. Therefore a dynamic binding must be represented as a runtime currentness obligation, not frozen evidence.

Candidate:

```text
DynamicBindingObligation
  bindingRef
  compatibilityContract
  lastResolvedTarget
  lastVerifiedAt
  monitoring/reverification policy
  currentness = CURRENT | STALE | UNKNOWN
```

A publish candidate may be valid while explicitly carrying such an obligation; it cannot claim immutable behavioral equivalence.

## F46 — Revision/Diff should expose impact delta, not only artifact delta

Add an `Impact Diff` projection:

```text
newly affected artifacts
no-longer affected artifacts
new stale evidence
revalidated evidence
new unresolved dependencies
changed qualification scope
changed environment-bound obligations
```

This is especially valuable when the changed artifact itself looks small but its semantic blast radius is large.

## F47 — Elicitation/Requirements can consume impact evidence without becoming authority

Requirements may trace from a requirement to artifact/binding/evidence nodes and surface that a requirement's proof became stale after a semantic change. It must not mutate authoritative Workflow/Form/Command state merely to clear the trace finding.

`traceability finding != authoritative repair`.

## F48 — Componentes should catalog invalidation behavior

Additional metadata candidates:

```text
semanticDependencyKinds[]
emittedChangeKinds[]
proofKinds[]
evidencePortability
impactPropagationRules[]
fullRequalificationTriggers[]
dynamicCurrentnessObligations[]
validatorIdentity/version requirements
```

This lets Componentes prove that an editor component participates correctly in impact/currentness semantics rather than only rendering its states.

## Complete-task implications

### Schema change breaking Form/Workflow

`edit schema -> semantic change set -> affected graph -> Form binding finding STALE/OPEN -> Workflow mapping finding STALE/OPEN -> targeted repair -> rerun impacted validation/preview -> new evidence -> publish candidate`.

### Permission change affecting View

`Policy revision -> permission edge affected -> Component/View action eligibility evidence stale -> UI remains inspectable but action state requalified -> no visual-only PASS`.

### Preview mismatch

`preview evidence CURRENT for bundle A -> provider/runtime fact changes in target environment -> environment-bound proof STALE/UNKNOWN -> artifact proof may remain CURRENT -> publish/effect status not inferred from preview`.

### Promotion

`qualified bundle in TEST -> exact manifest promoted -> portable evidence checked for identical basis -> PROD environment facts qualified -> authorization bound to PROD candidate -> publish ACK -> effect verification`.

## Adversarial proof obligations

1. A one-line schema rename invalidates only relevant mappings, but missing provenance forces conservative wider qualification.
2. A permission change leaves pixels identical; authority evidence still becomes stale.
3. A component visual variant changes; unrelated domain-effect evidence remains current.
4. Validator implementation/version changes; cached PASS cannot be reused without policy-qualified compatibility.
5. Dependency graph edge is disclosure-limited; system reports UNKNOWN/widens scope rather than unaffected.
6. Preview scenario dependency metadata omits a binding; selective rerun cannot claim complete coverage.
7. TEST passed provider integration; PROD provider is absent; promotion is blocked/unknown despite identical artifact digest.
8. Dynamic `latest` binding resolves a newer incompatible Form after publish; obligation surfaces drift/currentness rather than preserving historical green state.
9. Requirement proof references stale evidence; Elicitation surfaces it but cannot mutate Workflow to clear it.
10. Bundle A was qualified yesterday; graph evolved today; historical qualification remains explainable but is not reused as current proof for bundle B.
11. Impact traversal cycles through Workflow/View/Command references; traversal terminates by identity/revision while preserving all affected proof layers.
12. Cached result exists for same artifact bytes but different environment or authority context; cache key mismatch prevents unsafe reuse.

## Componentization complexity

- **P0 LOW/MEDIUM — shared primitives:** currentness marker, impact badge, evidence portability marker, provenance link, affected-count summary.
- **P1 MEDIUM/HIGH — editor infrastructure:** ImpactGraph projection, affected-slice browser, EvidenceCurrentness registry, selective validation coordinator, provenance inspector, stale-finding reconciliation.
- **P2 HIGH/VERY HIGH — proprietary apps:** each editor emits typed semantic changes and dependency edges and supplies domain-specific validators/semantic diff adapters.
- **P3 EXTREME — cross-app integration:** graph completeness, cross-artifact invalidation, qualification-basis digests, dynamic-binding obligations, environment promotion and evidence portability.

Dependency hotspot: incremental recomputation is safe only after dependency provenance and conservative fallback semantics are trustworthy. Performance optimization must not precede correctness of invalidation.

## Research maturity / saturation

`EDITOR_IMPACT_GRAPH_EVIDENCE_INVALIDATION = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence:

- affected-subgraph qualification is preferable to global recomputation when dependency provenance is complete;
- evidence currentness is claim-relative;
- finding status needs basis/provenance;
- environment promotion preserves exact artifact identity but requalifies environment-bound facts;
- dynamic runtime bindings create ongoing currentness obligations;
- inability to prove `unaffected` must widen scope or remain UNKNOWN.

Remaining gaps:

1. exact cache-key semantics for qualification/evidence reuse across revision, validator version, authority/disclosure and environment;
2. cycles and fan-out budgets in very large cross-editor impact graphs;
3. promotion policy for partial/unknown environment qualification;
4. UX for thousands of affected claims without alert fatigue;
5. how compensation/reconciliation lineage joins post-publish runtime evidence back into Revision/Diff and Elicitation.

Next research vector: **qualification/evidence cache keys + runtime effect lineage/compensation/reconciliation**, then empirical impact-graph scale budgets.