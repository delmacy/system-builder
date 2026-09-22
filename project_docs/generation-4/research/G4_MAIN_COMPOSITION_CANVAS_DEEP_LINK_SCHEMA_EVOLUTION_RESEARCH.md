# G4 — Main Composition Canvas Portable Deep Links & View Schema Evolution Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no product implementation authority
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Purpose

Research how the semantic Main Composition Canvas can expose portable links/bookmarks that survive renderer changes, 2D/3D projection changes and bounded model evolution without turning URL state into canonical authority, an authorization bearer, or a fragile serialization of camera geometry.

This extends the saved-view/navigation research and the cumulative `G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md` direction. It does not select routing, renderer, storage or serialization providers.

## Fixed boundaries

- `Deep link != canonical system state`.
- `Deep link != authorization bearer`.
- `Deep link != permission snapshot`.
- `Deep link != currentness proof`.
- `Deep link != evidence snapshot`.
- `Semantic intent != renderer state`.
- `Projection identity != canonical semantic identity`.
- `Camera coordinates != portable semantic location`.
- `Old link resolvable != old link still admissible`.
- `Schema migration != semantic reinterpretation permission`.
- `Renderer replacement != semantic-link breakage by definition`.
- `3D mode != mandatory interaction mode`.

The repository remains authoritative. Canvas/UI state is a projection over canonical identity and current qualification.

## Evidence

### Web platform URL semantics

The URI fragment is client-side state: browsers process it after retrieval and do not send it in the HTTP request. This is useful for non-authoritative local navigation hints, but is not a security boundary: fragments remain visible to the user/browser, can be copied, stored in history and exposed to client code. Therefore protected identity, secret capability, credentials or authorization evidence must never rely on fragment confidentiality.

The URL Standard defines fragment parsing/percent-encoding rather than application semantics. The Builder must own and version any semantic payload it places in a URL.

### Next.js routing

Current Next.js supports dynamic route parameters and query/search parameters as explicit URL-derived inputs. `useSearchParams` is a client hook and Page `searchParams` can participate in server-side data loading. This confirms that URL state can be a normal React/Next.js navigation input, but it also means search parameters may cross server/request/logging/cache boundaries. Therefore routing convenience must not be confused with safe storage for sensitive Canvas context.

No routing mechanism is selected here.

## Core model: semantic locator, not scene serialization

Candidate provider-neutral contract:

```text
SemanticViewLocator {
  schemaVersion
  systemRef
  semanticAnchorRef?
  projectionIntent
  scopeIntent?
  floorIntent?
  moduleIntent?
  capabilityIntent?
  corridorIntent?
  lensRefs[]
  filterIntent[]
  semanticZoomIntent?
  manifestationIntent?
  revisionQualifier?
  currentnessExpectation?
  savedViewRef?
  reviewEvidenceRef?
  representationHints?      // optional, disposable
}
```

`representationHints` may contain non-authoritative preferences such as desired guided camera mode or panel emphasis. Raw camera matrices, renderer object IDs, Three.js `instanceId`, transient cluster IDs and pixel coordinates are not portable identity.

A link should preferably say:

```text
open semantic object X
under floor F + lens L
prefer MODULE/TOP projection
qualify against current revision/currentness/disclosure
```

not:

```text
restore camera=(...), objectIndex=4187, cluster=23
```

## URL exposure classes

Every candidate field requires an exposure class before URL encoding:

```text
PUBLIC_NAVIGATION
AUTHENTICATED_NON_SENSITIVE
DISCLOSURE_QUALIFIED_REFERENCE
SERVER_RESOLVED_OPAQUE_REFERENCE
NEVER_IN_URL
```

Examples:

- projection mode may normally be `PUBLIC_NAVIGATION`;
- a semantic object identifier may require `DISCLOSURE_QUALIFIED_REFERENCE`;
- a saved private workspace may use a `SERVER_RESOLVED_OPAQUE_REFERENCE`;
- credentials, bearer tokens, authorization grants, hidden membership, evidence payloads and sensitive filter values are `NEVER_IN_URL`.

Opaque does not mean authorized. Resolution always re-evaluates the current subject/context.

## Restore / resolve pipeline

A deep link is a request to resolve intent under present conditions:

```text
PARSED
-> SCHEMA_RECOGNIZED | SCHEMA_UNSUPPORTED
-> REFERENCE_RESOLUTION
-> IDENTITY_QUALIFICATION
-> AUTHORIZATION / DISCLOSURE_REQUALIFICATION
-> REVISION / CURRENTNESS_QUALIFICATION
-> PROJECTION_ELIGIBILITY
-> REPRESENTATION_MATERIALIZATION
-> FOCUS/SELECTION RESTORE IF ADMISSIBLE
-> READY
```

Material branches:

```text
RESTORED_EXACT
RESTORED_REPROJECTED
RESTORED_WITH_REVISION_DRIFT
RESTORED_WITH_CURRENTNESS_CHANGE
RESTORED_WITH_REDACTION
RESTORED_TO_AGGREGATE
RESTORED_TO_TEXTUAL_EQUIVALENT
MISSING_REFERENCE
SUPERSEDED_REFERENCE
AMBIGUOUS_IDENTITY
INCOMPATIBLE_PROJECTION
UNSUPPORTED_SCHEMA
PERMISSION_LIMITED
FAILED_RECOVERABLE
FAILED_FATAL
```

A permission-limited restore must not reveal whether a protected target exists unless the disclosure policy permits that distinction.

## Schema evolution

### Versioning dimensions

Do not collapse these into one version:

```text
linkSchemaVersion
semanticIdentityVersion/namespace
projectionVocabularyVersion
savedViewSchemaVersion
optional evidence/review reference version
rendererVersion                 // diagnostic only; not semantic identity
```

A renderer change should normally leave a semantic link valid. A semantic identity migration may require an explicit resolver/supersession mapping.

### Evolution dispositions

```text
EXACT
FORWARD_IGNORABLE_EXTENSION
MIGRATABLE_LOSSLESS
MIGRATABLE_WITH_DEGRADATION
SUPERSEDED_TARGET
AMBIGUOUS_MIGRATION
UNSUPPORTED_MAJOR
SECURITY_REJECTED
```

Rules:

1. Unknown optional representation hints may be ignored.
2. Unknown semantic fields that could change target, disclosure or action meaning cannot be silently ignored.
3. Migration may map syntax and known semantic aliases; it cannot invent equivalence.
4. One old identity mapping to multiple current candidates yields `AMBIGUOUS_MIGRATION`, not first-match selection.
5. Deleted/retired identity is not rewritten to a visually nearby object.
6. Historical/review links may retain an explicit historical qualifier, but opening them must visibly distinguish historical evidence from current state.
7. A migration resolver never restores historical permissions.

`Parseable != semantically resolvable != currently admissible`.

## Deep links versus saved views versus evidence snapshots

Three contracts remain distinct:

```text
DeepLink
  lightweight semantic navigation intent

SavedView
  persisted semantic workspace/view intent with ownership/scope/lifecycle

EvidenceSnapshot
  historical evidence-bearing representation bound to capture context
```

A deep link may reference a SavedView or EvidenceSnapshot, but must not inline their full protected state by default. Opening a live SavedView requalifies against present authority/currentness. Opening an EvidenceSnapshot presents historical evidence as historical and offers a separate action to resolve the corresponding current semantic identity.

## Cross-projection continuity

Deep links target semantic identity first. Requested projection is a preference/qualification, not identity.

Examples:

```text
3D unavailable -> TOP/2D semantic projection
3D renderer failed -> textual/tree/table/graph equivalent
MODULE projection no longer applicable -> nearest qualified semantic context
selected manifestation gone -> retain logical anchor and expose current manifestations
cluster membership changed -> resolve selected semantic member independently of cluster ID
```

`Fallback projection != target substitution`.

Selection and focus remain separate. Link resolution may establish semantic selection/context; keyboard focus moves predictably to the WorkSurface heading/selected equivalent/Inspector according to the eventual accessibility contract rather than being encoded as stale DOM coordinates.

## Guided 3D interaction implications

The link vocabulary may express guided intents such as:

```text
ISOMETRIC
TOP
FRONT
FLOOR
MODULE
CAPABILITY
CORRIDOR
```

It should not require free-camera expertise. `Frame Selected`, `Frame Context`, floor selection and semantic zoom are reconstructible from current geometry. Reduced-motion restoration resolves directly or with minimal non-essential motion.

A link to a corridor does not prove that the corridor remains semantically compatible. A link to a relation candidate does not turn it into a compatible/effective relation. `submitted != accepted != effective` remains intact after navigation.

## Security and disclosure adversarials

### URL leaks hidden structure

Failure: query/fragment contains hidden entity name, exact count, relation membership or sensitive filter.

Obligation: field-level URL exposure classification plus disclosure-aware link generation. Redacted links must not encode the secret and merely hide it visually.

### Link becomes bearer capability

Failure: possession of URL grants access.

Obligation: URL reference alone never grants authority. Any intentionally shareable capability-link mechanism would be a separate security design, not this Canvas deep-link contract.

### Old link resurrects revoked access

Failure: saved URL opens cached geometry after permission revocation.

Obligation: current authorization/disclosure qualification precedes materialization.

### Schema migration fabricates identity

Failure: retired object silently maps to a similarly named replacement.

Obligation: explicit supersession/migration evidence or `AMBIGUOUS/MISSING_REFERENCE`.

### Renderer-local ID escapes

Failure: `instanceId`, cluster ID or scene-node key enters a shared URL.

Obligation: portable links contain semantic/projection references only; renderer IDs are transient diagnostics.

### Revision drift is invisible

Failure: reviewer follows a link created at revision R1 and believes R4 is the reviewed state.

Obligation: if a revision qualifier exists, show `CURRENT`, `DRIFTED`, `SUPERSEDED`, `HISTORICAL`, `UNKNOWN` or equivalent qualification; never silently strengthen currentness.

## Accessibility

Every semantic link target needs a non-3D landing path. A link must be resolvable into DOM-accessible context such as Tree/List/Table/Graph/Inspector even when the specialized WorkSurface is unavailable.

Requirements:

- keyboard-reachable selected target/equivalent;
- predictable focus after restore;
- no drag/free-camera requirement;
- target identity/currentness conveyed non-visually;
- reduced-motion restoration without mandatory camera travel;
- projection fallback retains the same semantic anchor;
- error/redaction state announced without leaking protected existence.

## Performance

Deep-link restore is semantic-first and bounded:

```text
parse locator
-> resolve/qualify anchor
-> acknowledge semantic context
-> materialize bounded projection around anchor
-> progressively materialize labels/relations/details
```

Do not render the complete scene before acknowledging the target.

Candidate benchmark spans:

```text
T_LINK_OPEN_TO_PARSE
T_PARSE_TO_SEMANTIC_ACK
T_ACK_TO_SELECTION_CONTEXT
T_SELECTION_TO_QUALIFIED_PROJECTION
T_PROJECTION_TO_INSPECTOR_SYNC
T_RESTORE_TO_SETTLED
T_FAILED_3D_TO_2D_FALLBACK_READY
```

NORMAL-A/B and STRESS-A must verify that semantic resolution remains bounded even when the surrounding scene has thousands of primitives. Clustering/LOD may alter representation but never link identity.

## Componentes impact

Candidate inventory additions:

- `SemanticDeepLink`;
- `DeepLinkCopyAction`;
- `DeepLinkScopeIndicator`;
- `DeepLinkRestoreBoundary`;
- `LinkRevisionBadge`;
- `LinkCurrentnessNotice`;
- `LinkRedactionNotice`;
- `LinkMigrationNotice`;
- `AmbiguousLinkResolver`;
- `ProjectionFallbackNotice`;
- `OpenHistoricalEvidenceAction`;
- `OpenCurrentSemanticTargetAction`.

State/scenario matrix must include at least:

1. exact same-revision restore;
2. 3D link opened in 2D-only environment;
3. renderer replacement with same semantic identity;
4. target superseded one-to-one;
5. old target maps ambiguously to N candidates;
6. target deleted without successor;
7. authorization revoked after link creation;
8. disclosure allows container but not member identity;
9. stale/currentness drift after link creation;
10. selected manifestation disappeared but logical identity remains;
11. reduced-motion restore;
12. renderer failure during restore -> textual/2D fallback;
13. unknown optional hint ignored safely;
14. unknown semantic field rejected/degraded explicitly;
15. copied link contains no renderer-local ID;
16. STRESS scene resolves anchor before full materialization.

Each scenario records `visual variant != interaction state != semantic state != operational state` and distinguishes selected/focused/current/stale/permission-limited states.

## Proof obligations

Before maturity can advance:

1. copied links contain no authorization secret or renderer-local identity;
2. current disclosure is re-evaluated before target materialization;
3. one semantic target survives 2D/3D/renderer substitution without identity mutation;
4. ambiguous schema/identity migration never auto-selects a candidate;
5. historical revision and current state cannot be visually conflated;
6. reduced-motion and keyboard-only users can resolve the same semantic target;
7. 3D failure has a bounded non-3D recovery path;
8. link resolution does not require render-all under STRESS;
9. unsupported semantic schema never degrades by silently discarding meaning-bearing fields;
10. link copying respects disclosure of labels, filters, counts and relation membership.

## Maturity

`MAIN_COMPOSITION_CANVAS_DEEP_LINK_SCHEMA_EVOLUTION = EMERGING / MATERIAL_DELTA`.

Material delta: the Canvas now has a provider-neutral distinction between semantic locator, SavedView and EvidenceSnapshot; a URL exposure classification; explicit restore/schema-evolution dispositions; and proof obligations preventing deep links from becoming authority, currentness proof or renderer serialization.

## Next gap

Highest-value next research gap: **cross-user/shared-link collaboration under concurrent revision drift**. Research how two users following the same semantic link can hold different disclosure envelopes, revisions and currentness without the UI fabricating a shared synchronized truth; include presence/follow mode, presenter/follower camera hints, selection independence, review anchors, and conflict/recovery when the semantic target changes during a collaborative session.
