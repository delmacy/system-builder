# G4 — Main Composition Canvas Semantic View Persistence & Saved Viewpoints Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Purpose

Research persistence boundaries for semantic 3D Canvas navigation after the navigation/recovery model introduced `SemanticViewCheckpoint`. The problem is not merely saving a camera pose. The product needs to distinguish ephemeral navigation history, personal saved viewpoints, shared workspace views and review/audit evidence without allowing any saved representation to restore obsolete authority, disclosure or currentness.

This artifact extends `G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md` and `G4_MAIN_COMPOSITION_CANVAS_NAVIGATION_RECOVERY_RESEARCH.md`.

Core rules:

```text
Saved view != canonical system state.
Saved view != permission snapshot.
Saved view != currentness proof.
Saved view != review evidence unless explicitly captured as evidence.
Camera pose != semantic identity.
Restoring representation != restoring authority.
History restore != time travel.
```

## Evidence basis

Primary-source evidence used in this round:

- Autodesk Model Coordination viewer/views documentation: saved views can retain selected models and view customizations such as filters, object table/coloring, levels/section boxes/model-browser visibility; views have public/private visibility; some view-related state is intentionally not saved in every context.
- Microsoft Power BI bookmark documentation: bookmarks can selectively capture page, filters, slicers, selection, sort/drill, visibility and focus/spotlight; capture can be scoped; personal bookmarks are distinct from report-author bookmarks; bookmarks may fail or degrade after report/schema changes.
- Existing SB constitutional and G4 research rules: Canvas is projection, disclosure is re-evaluated, identity survives projection changes, Builder != Runtime, and `UNKNOWN` cannot be strengthened by representation.

Portable finding: mature products already distinguish current exploration state from explicitly persisted views, allow selective capture, distinguish personal from shared/author state, and acknowledge that saved views can become incompatible with later model changes. The SB needs a stricter version because its view may expose authority/currentness/evidence-sensitive engineering state.

Primary references:

- https://help.autodesk.com/cloudhelp/ENG/Coord-Views/files/get-started-with-views/Model_Coord_Views_Create.html
- https://help.autodesk.com/cloudhelp/ENG/Coord-Models/files/get-started-with-models/Model_Coord_Models_In_Viewer.html
- https://learn.microsoft.com/en-us/power-bi/consumer/end-user-bookmarks
- https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-bookmarks
- https://learn.microsoft.com/en-us/javascript/api/overview/powerbi/report-bookmarks

No cited product is selected as a provider or UI template.

## 1. Persistence must be typed

A single generic `savedView` abstraction would collapse different ownership, lifetime, sharing and proof semantics. Candidate persistence classes:

```text
EPHEMERAL_NAVIGATION_HISTORY
  session-local recovery checkpoints
  short-lived
  not shareable by default
  may be discarded without semantic loss

PERSONAL_VIEWPOINT
  user-owned convenience state
  persistent across sessions
  private by default
  never changes shared workspace defaults

SHARED_WORKSPACE_VIEW
  named collaborative projection preset
  shared according to explicit workspace access
  versioned as a UI artifact
  never grants access to identities it references

TASK_REVIEW_VIEW
  named view attached to a review/task context
  binds a semantic anchor and review context
  may carry revision references
  still requalifies live disclosure when reopened

EVIDENCE_VIEW_SNAPSHOT
  immutable evidence artifact when explicitly captured
  records what qualified projection/evidence was presented at capture time
  not silently updated to current state
  must remain distinguishable from a live view
```

`PERSONAL_VIEWPOINT != SHARED_WORKSPACE_VIEW != EVIDENCE_VIEW_SNAPSHOT`.

## 2. Separate semantic intent from disposable representation hints

A persisted view should prefer semantic intent over renderer coordinates.

Candidate live-view record:

```text
SemanticSavedView {
  viewId
  ownerScope
  title
  description?
  persistenceClass
  semanticAnchorRefs[]
  projectionMode
  floorContext?
  moduleContext?
  capabilityContext?
  corridorContext?
  activeLensRefs[]
  filterIntent[]
  semanticZoomBand
  isolateIntent?
  selectedIdentityRefs[]?
  representationHints {
    cameraMode?
    poseHint?
    panelLayoutHint?
  }
  captureRevisionRefs[]
  createdAt
  updatedAt
  sourceViewRevision
}
```

The following are deliberately not restorable authority:

```text
captured permissions
captured authorization result
captured disclosure grant
captured currentness disposition
captured effective authority
captured runtime health as if current
```

Those may appear only as historical evidence inside an explicit evidence snapshot with capture time/provenance.

## 3. Capture policy must be selective

Power BI bookmarks are useful evidence that mature bookmark systems benefit from choosing which state dimensions are captured rather than blindly serializing the entire UI. The SB should make capture policy explicit.

Candidate dimensions:

```text
CAPTURE_SEMANTIC_CONTEXT
CAPTURE_PROJECTION_MODE
CAPTURE_LENSES
CAPTURE_FILTER_INTENT
CAPTURE_ISOLATION_INTENT
CAPTURE_SELECTION
CAPTURE_PANEL_LAYOUT
CAPTURE_CAMERA_HINT
CAPTURE_REVISION_REFERENCE
CAPTURE_REVIEW_CONTEXT
```

Default candidate policies:

- ephemeral history: semantic context + projection + selection + bounded camera hint;
- personal viewpoint: semantic context + projection + lenses/filters + optional panel/camera hints;
- shared workspace view: semantic context + projection + declared shared filters/lenses; personal panel arrangement should not leak by default;
- review view: semantic context + revision/review anchor + projection intent;
- evidence snapshot: explicit immutable capture of qualified evidence presentation plus provenance, never a live bookmark masquerading as evidence.

A user should be able to save `show this capability across floors with Evidence + Currentness lenses` without freezing today's permissions or health.

## 4. Restore is resolution, not deserialization

Restoring a live saved view must re-resolve the current system.

```text
saved view requested
-> load saved semantic intent
-> resolve referenced identities against current model/revision lineage
-> re-evaluate disclosure/authorization
-> re-evaluate currentness
-> qualify lens/filter compatibility
-> qualify projection/floor availability
-> resolve current representations
-> apply admissible layout/camera hints
-> disclose restore differences
-> settle
```

Candidate restore outcomes:

```text
RESTORED_EXACT
RESTORED_REPROJECTED
RESTORED_WITH_CURRENTNESS_CHANGE
RESTORED_WITH_REVISION_DRIFT
RESTORED_WITH_REDACTION
RESTORED_WITH_FILTER_DEGRADATION
RESTORED_WITH_LENS_DEGRADATION
RESTORED_WITH_MISSING_REFERENCES
RESTORED_TO_AGGREGATE
RESTORED_TO_TEXTUAL_FALLBACK
AMBIGUOUS_IDENTITY_MAPPING
SUPERSEDED_REFERENCE
INCOMPATIBLE_VIEW_SCHEMA
FAILED_RESTORE
```

A degraded restore is not necessarily failure. It must be explainable and must not silently substitute a nearby semantic object.

## 5. Revision drift and supersession

Power BI documents a concrete failure class: bookmarks can stop reproducing their original state when fields used by the bookmark are removed or renamed. The SB has a stronger semantic version of this problem.

Candidate resolution rules:

```text
same canonical identity + new revision
  -> reproject current identity; mark revision drift when material

explicit supersession relation
  -> offer successor; do not silently replace

identity deleted/retired with historical resolvability
  -> historical/reference notice; current live view may not materialize it

one old identity -> multiple successor candidates
  -> AMBIGUOUS_IDENTITY_MAPPING

saved lens/filter predicate no longer supported
  -> preserve remainder + FILTER/LENS_DEGRADATION

floor/projection removed or no longer applicable
  -> preserve semantic anchor + nearest qualified peer projection
```

`Same label != same identity` and `successor available != successor selected`.

## 6. Disclosure and privacy on restore/share

Saved views are a potential disclosure side channel. A view title, selected identity, filter, count, floor membership, thumbnail or camera framing can reveal protected structure even if the current user cannot open the underlying object.

Proof obligations:

- opening a shared view re-evaluates disclosure for the opener;
- saved exact counts do not bypass current aggregate/count policy;
- thumbnails/previews obey current or capture-specific disclosure rules;
- autocomplete/search for saved views does not leak hidden identity names through metadata;
- a personal view becoming shared requires explicit share intent and metadata requalification;
- sharing a view never grants permission to referenced objects;
- revoked disclosure produces `RESTORED_WITH_REDACTION`, not a stale cached scene;
- renderer/client caches are not authorization enforcement.

`Share view != share object access`.

## 7. Shared views need ownership and change semantics

Autodesk's public/private saved views provide evidence for ownership/visibility distinction. The SB additionally needs revision semantics for collaborative views.

Candidate shared-view lifecycle:

```text
DRAFT
ACTIVE
SUPERSEDED
DEPRECATED
RETIRED
```

Candidate update behavior:

- `Save as new view` creates a new identity;
- `Update shared view` requires explicit edit authority on the view artifact;
- updating a view changes representation intent, not canonical system architecture;
- concurrent edits produce view-level conflict/merge behavior rather than last-writer silently changing everyone else's workspace;
- personal forks can derive from a shared view without mutating it;
- a shared workspace default may reference a view revision but never become a permission grant.

## 8. Evidence snapshots are intentionally different

A live saved view answers: `show me this semantic context again under current qualification`.

An evidence snapshot answers: `what qualified representation/evidence was captured at a particular review point?`.

Candidate evidence snapshot fields:

```text
EvidenceViewSnapshot {
  snapshotId
  sourceViewId?
  capturedAt
  capturedBy
  semanticAnchorRefs[]
  referencedRevisionIds[]
  evidenceRefs[]
  projectionDescriptor
  disclosureClassAtCapture
  currentnessAtCapture
  representationDigest?
  provenance
}
```

It must never be displayed as current without an explicit historical badge/context. Reopening a snapshot may provide `Open current live view` as a separate action.

`Evidence snapshot valid-at-capture != current system truth`.

## 9. Camera pose is a hint with bounded validity

Raw camera matrices are fragile across layout changes, renderer changes, clustering, responsive viewport changes and semantic rearrangement.

Candidate restore priority:

```text
semantic anchor
-> semantic context
-> projection/floor
-> semantic zoom
-> representation resolver
-> camera mode
-> pose hint if still useful
```

If the pose hint points at empty/invalid space after a layout change, discard the pose and Frame Context/Selected. Never preserve a stale matrix at the cost of semantic orientation.

Responsive/device transfer can therefore produce `RESTORED_REPROJECTED` rather than attempting pixel-identical restoration.

## 10. Navigation history vs saved viewpoints

History is optimized for recovery; saved viewpoints are optimized for intentional return/share.

History rules:

- semantic checkpoints are bounded and session-oriented;
- wheel/pan microsteps are not history entries;
- browser/app reload may restore the last safe semantic context as a convenience, but this is not equivalent to a named saved view;
- history may expire aggressively;
- history is not shared.

Saved-view rules:

- creation is explicit;
- title/owner/scope are explicit;
- capture policy is inspectable;
- persistence survives sessions according to lifecycle;
- sharing is explicit;
- restore differences are visible.

`Autosave navigation history != create shared bookmark`.

## 11. Workspace persistence boundaries

Candidate separation:

```text
Personal UI Preference
  density, panel sizes, preferred reduced motion, last tool positions

Personal Viewpoint
  named semantic exploration state

Shared Workspace Preset
  collaborative panel/tool/surface arrangement and default view intent

Task/Review View
  task-scoped semantic/revision context

Canonical Model
  system architecture/business/deployment truth
```

A workspace preset can restore panel arrangement and nominate a default semantic view. It cannot restore permissions, approval state, effective authority or business truth.

`Workspace preset != permission grant` remains a hard invariant.

## 12. Cross-projection continuity

A saved view may be opened where its original renderer is unavailable, degraded or intentionally disabled.

Required behavior:

```text
3D view saved
-> 3D unavailable
-> resolve semantic anchors
-> open TOP/2D/list/table/graph equivalent
-> preserve selection/currentness/revision qualification
-> report representation degradation
```

This also applies to reduced-motion or accessibility preference changes. The semantic view remains useful without reproducing the original animation or 3D camera.

## 13. Performance implications

Persistence must not force scene rehydration before semantic recovery.

Candidate performance requirements:

- resolve saved semantic anchors before materializing full geometry;
- restore selected/critical identities first;
- apply label/LOD/clustering budgets after semantic qualification;
- shared-view thumbnails must not require synchronous render-all;
- stale pose hints should be cheap to reject;
- opening a saved STRESS view may initially land on a qualified aggregate while exact selected identity remains available in Inspector;
- fallback to 2D/textual representation remains valid if renderer recovery is too expensive.

Candidate measures:

```text
T_SAVED_VIEW_OPEN_TO_SEMANTIC_ACK
T_SAVED_VIEW_OPEN_TO_SELECTION_RESTORED
T_SAVED_VIEW_OPEN_TO_QUALIFIED_REPRESENTATION
T_SAVED_VIEW_OPEN_TO_SETTLED
T_DEGRADED_RESTORE_TO_FALLBACK_READY
```

## 14. State model

Candidate saved-view states:

```text
UNSAVED
SAVING
SAVED
DIRTY_VIEW_STATE
UPDATING
SAVE_FAILED
SYNCING
CONFLICTED
STALE_REFERENCE
REVISION_DRIFT
PARTIALLY_RESTORABLE
RESTORING
RESTORED
RESTORED_DEGRADED
REDACTED_ON_RESTORE
SUPERSEDED
DEPRECATED
RETIRED
UNKNOWN
```

These are view-artifact states. They do not redefine the semantic/operational states of referenced system objects.

## 15. Componentes impact

Candidate inventory records:

```text
SemanticSavedView
SavedViewPicker
SaveViewAction
SaveViewAsAction
UpdateSharedViewAction
SavedViewScopeBadge
SavedViewRestoreNotice
RestoreDifferencePanel
ViewRevisionBadge
ViewDisclosureNotice
EvidenceViewSnapshotCard
OpenCurrentFromSnapshotAction
SavedViewConflictResolver
SavedViewFallbackBoundary
```

Material scenarios:

```text
VIEW-01 personal view -> reopen same revision -> exact/reprojected restore
VIEW-02 shared view -> opener lacks one referenced identity -> redacted restore, no leak
VIEW-03 saved selected module -> module revision changes -> identity preserved + revision drift
VIEW-04 referenced identity superseded -> successor offered, never silently substituted
VIEW-05 one old identity -> multiple successors -> ambiguous restore
VIEW-06 saved 3D view -> renderer unavailable -> 2D/text fallback preserves semantic anchor
VIEW-07 camera pose invalid after layout change -> discard pose, Frame Context
VIEW-08 saved filter removed -> partial restore + filter degradation notice
VIEW-09 shared view concurrently updated -> view-level conflict, no canonical-model conflict fabricated
VIEW-10 evidence snapshot opened later -> historical context remains explicit
VIEW-11 disclosure revoked after save -> no cached geometry/count/name leak
VIEW-12 reduced-motion enabled after save -> semantic restore without camera flight
VIEW-13 stress scene saved view -> semantic ACK before full materialization
VIEW-14 personal view forked from shared view -> shared original unchanged
VIEW-15 workspace preset restored -> panel/layout returns; permission/currentness requalified
```

## 16. Adversarial findings and proof obligations

| Adversarial | Required proof |
| --- | --- |
| bookmark restores obsolete permissions | disclosure/authorization always re-evaluated |
| stale health looks current after restore | currentness requalified; capture-time state only historical |
| camera matrix points to empty scene | semantic anchor wins; pose discarded |
| renamed/replaced identity maps by label | identity/supersession resolution, never label equality |
| shared view leaks protected membership | metadata, counts, preview and scene all obey disclosure |
| saved 3D view unusable without 3D | peer 2D/textual restore |
| bookmark becomes architecture authority | view mutations remain projection-only |
| review screenshot treated as current | evidence snapshot explicitly historical |
| personal layout pollutes team workspace | personal/shared persistence scopes separate |
| concurrent shared-view edits overwrite silently | view revision/conflict semantics |
| old filter/lens silently disappears | degraded restore reports missing/unsupported dimensions |
| restoring stress view freezes UI | semantic-first bounded materialization |

## 17. Candidate maturity gate

This research direction may move from `EMERGING` toward `CANDIDATE` only when prototype evidence demonstrates:

1. semantic identity survives save/restore across 3D, TOP, 2D and textual projections;
2. permission/disclosure changes cannot be bypassed through saved state or preview metadata;
3. revision drift, supersession and ambiguity remain explicit;
4. live saved views and immutable evidence snapshots cannot be confused visually or semantically;
5. camera/layout hints can be discarded without losing task context;
6. personal/shared/task/evidence persistence scopes remain distinct;
7. reduced-motion/accessibility changes do not invalidate semantic restore;
8. NORMAL/STRESS fixtures restore semantic anchors before full scene materialization;
9. workspace presets do not restore authority/business state;
10. view schema evolution has a migration/degradation path rather than silent failure.

## Maturity

`MAIN_COMPOSITION_CANVAS_VIEW_PERSISTENCE = EMERGING / MATERIAL_DELTA`.

The material delta is the separation of navigation history, personal viewpoint, shared workspace view, task/review view and evidence snapshot, plus the rule that restore is a fresh semantic resolution under current disclosure/currentness rather than deserialization of an old UI state.

## Next highest-value gap

Research **saved-view schema evolution and portable deep-link semantics** across application versions, generated-system/runtime boundaries and renderer/provider changes. The key question is how a link can name semantic intent without embedding unstable renderer coordinates or becoming an authorization token. After that, run the persistence model through NORMAL-A/B and STRESS-A with revision drift, redaction and renderer fallback injected during restore.