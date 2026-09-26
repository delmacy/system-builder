# G4 — Proprietary Editor Shared Foundation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

This artifact studies the proprietary applications/editors that do not have a ready one-to-one product analogue: Workflow Designer, Component Editor / Componentes, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation/Requirements, Preview/Sandbox and Revision/Diff.

Current shell hypothesis is preserved:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D is an optional future projection/application, not a mandatory shell. This research does not select providers or authorize implementation.

## Consolidated findings F1–F20

The prior research established the following high-confidence foundation:

- proprietary apps need a `SharedEditorFoundation`, not a shared domain model;
- every editor session carries document identity, base revision/currentness, local draft, authority/disclosure context, canonical selection/focus and operation refs;
- editor undo/redo is draft-intent history, not rollback of publish/runtime/business effects;
- Selection + Outliner + Inspector form a reusable triad over canonical identity;
- Binding Browser and Expression/Rule infrastructure are shared hosts with typed domain adapters;
- validation is layered (`STRUCTURAL`, `TYPE_SCHEMA`, `BINDING`, `REACHABILITY`, `PERMISSION_AUTHORITY`, `CURRENTNESS`, `WORKFLOW_CONFORMANCE`, `ACCESSIBILITY`, `RESPONSIVE`, `RUNTIME_PREVIEW`, `PUBLISH_READINESS`);
- Workflow owns activity/control-flow semantics while Form/View are independently versioned references;
- View/Page owns composition while UI events bind to Commands/Actions rather than becoming commands;
- Form owns capture/local validation, not Workflow or Domain State;
- Componentes needs distinct Definition Editor and State/Evidence Lab roles;
- Decision result, command authorization and effective business state are separate;
- System/Module Designer is an integration/reference editor, not owner of child artifacts;
- Elicitation/Requirements owns traceability/proposals, not authoritative mutation;
- Preview/Sandbox consumes an explicit revision bundle and declares substitutions/unsupported behavior; `Preview != effective runtime`;
- Revision/Diff must be semantic-aware across structure, bindings, state machines, authority, schema, actions, reachability, accessibility and evidence;
- the semantic bridge is typed references: `Workflow Activity -> Form/View -> Component Event -> Command/Action -> Permission/Policy -> Domain State -> Evidence`;
- composition validity should be proactive through compatibility filtering, prerequisites and findings;
- stable command identity may be shared across editors while eligibility/effect remains document/domain specific;
- fatal editor failure must preserve a recoverable draft envelope and offline reconnect must requalify revision/authority/bindings.

Core invariants remain:

`View != Workflow Activity`
`Form != Workflow State`
`Button != Domain Command`
`Component event != authorized action`
`visual transition != business transition`
`Undo edit != rollback publish != compensate business effect`
`Preview != effective runtime`

## Editor-specific ownership matrix

| Editor | Owns | Reuses heavily | Highest-risk semantic boundary |
|---|---|---|---|
| Workflow Designer | activities, transitions, workflow semantics | graph surface, inspector, bindings, validation, revision/diff | form/view reference must not become activity/state ownership |
| Component Editor / Componentes | component definition + state/evidence catalog | inspector, state matrix, preview, validation | visual/interaction state vs domain/authority state |
| View/Page Builder | layout/composition/navigation projection | canvas/outliner, bindings, command registry, responsive tools | UI event vs authorized command |
| Form Builder | capture composition + local validation | component palette, schema bindings, preview | form validity/state vs business state |
| Rules/Decision Editor | decision/rule definition | expression editor, tables/graphs, fixtures, diff | evaluation result vs authorized effect |
| System/Module Designer | integration/reference composition | outliner, graph, inspector, bindings, impact | child artifact reference vs cloned ownership |
| Elicitation/Requirements | requirements, rationale, traceability | editor session, evidence, diff, linking | proposal/trace vs authoritative mutation |
| Preview/Sandbox | bounded behavior projection | preview host, fixtures, evidence, operation registry | simulated behavior vs effective runtime |
| Revision/Diff | comparison/impact projection | history, semantic adapters, evidence | textual/rendering equality vs semantic equality |

## Shared primitive -> infrastructure -> app -> integration decomposition

### P0 — Shared primitives — LOW/MEDIUM
Selection/focus, tree/outliner row, inspector field/group, command presentation, finding marker, revision badge, binding candidate, evidence reference, keyboard reorder/move, diff marker, state chip.

### P1 — Editor infrastructure — MEDIUM/HIGH
EditorDocumentSession, WorkSurfaceHost, OutlinerProjection, InspectorHost, CommandRegistryProjection, UndoRedoCoordinator, Autosave/Conflict/Reconcile, BindingBrowser, ExpressionEditorHost, ValidationFindings, RevisionHistory, DiffProjection, PreviewHost, EvidencePanel.

### P2 — Proprietary app semantics — HIGH/VERY HIGH
Workflow graph semantics, Component state/variant model, Page/View composition grammar, Form/schema grammar, Rule/Decision semantics, Module integration model, Requirement trace model, Preview interpreter, semantic diff adapters.

### P3 — Cross-app semantic integration — VERY HIGH/EXTREME
Typed versioned bindings across Workflow <-> View/Form <-> Component <-> Command/Action <-> Permission <-> Domain State <-> Evidence; impact propagation; cross-editor currentness/conflict; publish/revision bundle qualification; preview equivalence evidence.

Complexity hotspot: P3 must not be hidden inside generic React components.

---

## Deep-research continuation — publish bundles, revision pinning and multi-document draft semantics

### Additional evidence reviewed

- Camunda 8 resource-binding guidance distinguishes `latest`, `deployment`, and `versionTag` bindings for linked forms/processes/decisions. Its guidance explicitly warns that `latest` can resolve an incompatible future resource and recommends stable version binding for predictable behavior. Linked forms are independently deployed, which is direct evidence that reference integration does not require lifecycle collapse.
- GitHub pull requests and compare views treat a proposed change as a reviewable set of commits/files while preserving the individual file identities and history; merge strategies show that grouping changes for review/integration does not require treating the files as one document.
- Yjs `UndoManager` supports selective undo scoped to shared types and transaction origins, evidence that undo can be origin/scope-aware rather than a single global stack. This is pattern evidence only; it is not a provider decision.

### F21 — Publish Bundle is a qualified release manifest, not a mega-document

A publish candidate spanning Workflow, View, Form, Component and Rule artifacts should preserve each artifact's independent identity/revision and bind them through an immutable candidate manifest.

Candidate:

```text
PublishBundleCandidate
  bundleId
  purpose / target environment
  createdFromDraftGroup?
  members[]
    artifactIdentity
    artifactKind
    candidateRevision
    baseRevision
    currentnessAtQualification
    content/evidence digest
  bindings[]
    bindingIdentity
    sourceMember/ref
    targetMember/ref
    resolutionPolicy
    resolvedTargetRevision
  qualificationSnapshot
  validationFindingRefs[]
  previewEvidenceRefs[]
  authorityQualificationRefs[]
  dependencyClosure
  unresolvedExternalDependencies[]
  generatedAt
```

The bundle is a **manifest over autonomous artifacts**. Publishing the bundle must not rewrite child ownership into bundle ownership.

`PublishBundle != EditorDocument != DomainAggregate`.

### F22 — Reference policy and release resolution must be separate concepts

A design-time binding may express a policy such as `LATEST_COMPATIBLE`, `PINNED_REVISION`, `RELEASE_TAG`, or `SAME_RELEASE_BUNDLE`, but a publish candidate needs to record the concrete target revision resolved during qualification.

This avoids a critical ambiguity:

```text
design-time policy: latest compatible Form A
qualification result: Form A @ revision 41
published evidence: bundle resolved Form A @ revision 41
future Form A @ revision 42 does not rewrite historical evidence
```

Camunda's `latest`/`deployment`/`versionTag` trade-off is strong external evidence for this separation: runtime resolution policy affects predictability and compatibility.

### F23 — Qualification should freeze evidence, not necessarily freeze all future authoring

Once a candidate bundle is qualified, its member revisions and dependency resolutions should be immutable for that candidate. Editors may continue producing later revisions, but those later revisions belong to a new candidate or require explicit requalification.

Candidate state machine:

```text
DRAFT_BUNDLE
  -> RESOLVING_DEPENDENCIES
  -> QUALIFYING
  -> QUALIFIED
  -> AUTHORIZATION_PENDING
  -> AUTHORIZED
  -> PUBLISHING
  -> ACKNOWLEDGED
  -> VERIFICATION_PENDING
  -> EFFECTIVE | PARTIAL | FAILED | UNKNOWN

Any member/dependency mutation after QUALIFIED
  -> STALE_CANDIDATE / REQUALIFICATION_REQUIRED
```

`ACKNOWLEDGED != EFFECTIVE` remains mandatory.

### F24 — Dependency closure must distinguish bundled, external-pinned and dynamic dependencies

A publish candidate should classify every dependency edge:

```text
BUNDLED_EXACT
EXTERNAL_PINNED
EXTERNAL_POLICY_RESOLVED
DYNAMIC_RUNTIME
OPTIONAL
UNRESOLVED
DISCLOSURE_LIMITED
```

This allows a Workflow + Form + Rule bundle to be self-consistent while still referring to a shared Command contract or provider outside the bundle. `UNRESOLVED`, `UNKNOWN`, and `DISCLOSURE_LIMITED` cannot be silently converted to success.

### F25 — Cross-artifact validation is a qualification graph, not a global boolean

Qualification should preserve per-member and per-edge findings:

```text
Workflow@17
  HumanInteractionBinding -> Form@41      PASS
  RuleBinding -> Decision@9               PASS
Form@41
  ComponentBinding -> Component@12        PASS
Component@12
  InteractionBinding -> Command@7         PASS
Command@7
  AuthorityPolicy -> Policy@5             UNKNOWN
```

The bundle can therefore be `BLOCKED_BY_UNKNOWN_AUTHORITY` without pretending all other checks failed. This is important for review UX and targeted remediation.

### F26 — Multi-document Draft Group coordinates intent without merging documents

Some authoring actions legitimately span artifacts: creating a Workflow human task may create a Form, bind it, and add a View route. The reusable foundation needs a coordination object, not a merged document.

Candidate:

```text
DraftGroup
  groupId
  semanticIntent
  participants[]
    EditorDocumentSessionRef
    baseRevision
    localDraftRevision
  crossArtifactMutations[]
  dependency/binding mutations[]
  validationImpact
  savePolicy
  conflictState
  recoveryEnvelope
```

Each participant retains its own dirty/save/conflict state. Group state is derived from participants plus cross-artifact constraints.

`DraftGroup != shared revision number`.

### F27 — Cross-document Undo should be semantic-intent scoped and best-effort only while reversible

Yjs demonstrates selective undo by scope/origin. For SB, a multi-document editor gesture may create several local mutations sharing one `intentId`.

Candidate:

```text
CrossArtifactEditorIntent
  intentId
  participantMutations[]
  reversibleUntil
  inversePlan[]
  conflictPreconditions[]
  externalEffects = NONE
```

Undo can reverse the group only while all participant mutations remain locally reversible against their expected bases. If one participant has been independently reconciled/published or its inverse precondition no longer holds, the UI must not claim atomic undo. It should offer a qualified remediation/revert proposal.

`grouped undo != distributed transaction`.

### F28 — Save semantics should permit partial persistence without pretending group success

A Draft Group may save Form@draft while Workflow save fails. This must produce a durable partial result:

```text
DraftGroupSaveResult
  participantResults[]
    SAVED | SAVE_FAILED | CONFLICTED | STALE | PERMISSION_DENIED | UNKNOWN
  bindingResults[]
  overall = COMPLETE | PARTIAL | FAILED | UNKNOWN
  recoveryActions[]
```

The group remains recoverable and can retry only failed participants after requalification. Silent rollback of already-saved autonomous documents is unsafe unless the domain explicitly supports it.

### F29 — Reconcile is three-way and participant-aware

For each conflicting artifact, reconciliation needs at least:

`base revision -> local draft -> current remote revision`.

Cross-artifact reconciliation then re-runs impacted binding/schema/authority/reachability checks. A visually clean merge can still invalidate a Form binding or permission reference.

Therefore:

`text merge success != semantic reconciliation success`.

### F30 — Publish authorization must bind to the qualified manifest

An approval should identify the exact bundle candidate/digests/revisions it authorized. If any member or resolved dependency changes afterward, the prior authorization cannot automatically cover the new candidate unless policy explicitly permits that class of change.

Candidate:

```text
PublishAuthorization
  authorizationId
  bundleId
  qualifiedManifestDigest
  scope
  actor/authority evidence
  constraints
  expiresAt?
```

This prevents a dangerous UX where a reviewer approves Workflow@17 + Form@41 and the system later publishes Workflow@17 + Form@42 under the old approval.

### F31 — Preview evidence must be attached to the same resolved candidate

A Preview/Sandbox run should reference the candidate bundle manifest/digest and report provider substitutions/unsupported behaviors. If the bundle changes, preview evidence becomes stale for publish qualification.

`Preview passed for candidate A != Preview passed for candidate B`.

This creates a clean chain:

`DraftGroup -> PublishBundleCandidate -> qualification -> preview/evidence -> authorization -> publish -> effect verification`.

### F32 — Revision/Diff needs a bundle-level impact projection without losing per-document diffs

Bundle diff should answer both:

1. **What changed inside each artifact?**
2. **What changed in cross-artifact behavior because references resolved differently?**

Candidate layers:

```text
MEMBER_ADDED_REMOVED
MEMBER_REVISION_CHANGED
BINDING_TARGET_CHANGED
RESOLUTION_POLICY_CHANGED
SCHEMA_COMPATIBILITY_CHANGED
AUTHORITY_POLICY_CHANGED
WORKFLOW_REACHABILITY_CHANGED
PREVIEW_COVERAGE_CHANGED
EVIDENCE_CURRENTNESS_CHANGED
```

A Form can be byte-identical while a Workflow's binding policy changes from pinned to latest; bundle semantic diff must still flag the behavioral risk.

### F33 — Componentes should catalog editor transaction/release behavior explicitly

New metadata candidates for shared editor infrastructure and proprietary app components:

```text
editorMutationScope = SINGLE_DOCUMENT | CROSS_DOCUMENT
undoScope
saveAtomicity = SINGLE_DOCUMENT | GROUP_PARTIAL_AWARE
publishParticipation
revisionPinningSupport
bindingResolutionPolicies[]
qualificationLayers[]
reconciliationStrategy
previewEvidenceCoupling
recoveryEnvelope
```

This prevents a generic `Undo` or `Publish` affordance from implying semantics the underlying editor/app cannot guarantee.

## New adversarial scenarios / proof obligations

16. Workflow@17 is reviewed with Form@41; Form@42 appears before publish -> candidate remains pinned to 41 or becomes stale; never silently substitutes 42.
17. Binding policy is `latest`; qualification resolves revision 41; revision 42 appears before effect -> runtime policy and evidence must expose whether late resolution is intentionally dynamic or publish must requalify.
18. Multi-document gesture creates Form + Workflow binding; Form saves but Workflow conflicts -> overall PARTIAL, Form is not silently deleted, and recovery targets the failed participant.
19. User invokes Undo after one participant was externally reconciled -> no fake atomic undo; show qualified inverse/remediation plan.
20. Preview passed for bundle digest A; one Rule revision changes -> preview evidence becomes STALE for candidate B.
21. Reviewer authorizes candidate digest A; dependency resolution changes -> authorization is not reused silently.
22. Text merge succeeds in Form but removed schema field makes Workflow output mapping invalid -> semantic reconciliation remains BLOCKED.
23. Bundle contains a disclosure-limited external policy dependency -> UI must preserve `DISCLOSURE_LIMITED/UNKNOWN` rather than reporting all-green qualification.
24. One bundle member is READ_ONLY while others are editable -> Draft Group may coordinate inspection but cannot infer write authority from editable peers.
25. Bundle publish ACK succeeds for all members but verification finds one unavailable resource -> result is PARTIAL/verification finding, not EFFECTIVE.
26. Reverting a published Form revision does not imply compensation of workflow instances that already consumed the newer Form.
27. A bundle-level diff with identical rendered UI but changed permission/binding resolution must surface semantic risk.

## Componentization complexity impact

The new findings sharpen the earlier P0–P3 ladder:

- **P0 LOW/MEDIUM:** revision badges, candidate/member markers, partial-result chips, stale-evidence markers.
- **P1 MEDIUM/HIGH:** DraftGroupCoordinator, qualification graph projection, bundle diff host, recovery/reconcile surfaces, scoped undo coordinator.
- **P2 HIGH/VERY HIGH:** each proprietary app supplies artifact-specific validation, semantic diff, binding and preview adapters.
- **P3 EXTREME:** immutable publish manifest, cross-artifact dependency closure, authorization binding, candidate/evidence currentness, partial publish/effect verification.

Important dependency hotspot: do not freeze a global Undo/Redo, Save All, Preview All or Publish UX before P3 semantics are understood. These apparently simple shell commands are projections over different atomicity/currentness/effect guarantees.

## Research maturity / saturation

`PROPRIETARY_EDITOR_SHARED_FOUNDATION = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence after this continuation:

- Shared Editor Foundation should coordinate autonomous documents, never create a hidden mega-document.
- Publish Bundle should be an immutable qualified manifest over exact member revisions/resolutions.
- Design-time reference policy and concrete release resolution are distinct.
- Multi-document draft grouping is useful, but save/undo/reconcile must be partial-aware rather than pretending distributed ACID semantics.
- Preview evidence and authorization must bind to the exact candidate they justify.
- Semantic bundle diff is required in addition to per-document diff.

Remaining material gaps:

1. incremental semantic impact-graph recomputation and invalidation of stale findings/evidence;
2. expression/rule capability security, sandboxing and explainability;
3. preview equivalence taxonomy and proof thresholds by behavior class;
4. detailed Revision/Diff UX for very large dependency cuts;
5. empirical keyboard/drag parity for graph/page/form composition;
6. shared editor performance budgets for large outliners, graphs, binding browsers and diff sets;
7. lifecycle/retention policy for abandoned Draft Groups and recovery envelopes;
8. whether environment promotion should reuse an immutable qualified bundle or require environment-specific requalification of authority/providers.

Next research vector: **incremental impact graph + stale finding/evidence invalidation + environment promotion semantics**, because publish qualification now has a bounded candidate model and the next risk is keeping its proofs/currentness truthful as independently versioned artifacts continue evolving.