# Station S3 — Synthesis Decision Graph 01

Date: 2026-09-30
Status: RESEARCH / SYNTHESIS — NON-AUTHORITATIVE
Truth base: main@d2cd9b404501781de90564b2029277efdfcb023f
Evidence line: R1→R7 + R7B Matrices 01–05 + Closure Audit/Handoff 06

## Guardrail
This document synthesizes research evidence. It does not materialize Construction, create product semantics, or create Core/business authority. Missing executable evidence remains UNPROVEN.

## Decision Graph

| ID | Decision | Disposition | Proof consequence |
|---|---|---|---|
| DG-01 | Promote grammar levels only when an independent reusable invariant appears | ADOPT | labels/styles/icons/provider bindings/domain names cannot create primitives |
| DG-02 | Semantic identity is independent from placement, span and responsive representation | ADOPT | move/reparent/resize must preserve identity unless an explicit identity mutation exists |
| DG-03 | Semantic intent is not a visual variant | ADOPT | approve/reject/delete/run are capability/action semantics, not Button variants |
| DG-04 | Slot/variant compatibility is admitted before canonical mutation | ADOPT | incompatible composition fails closed |
| DG-05 | Visual order is not semantic order by default | ADOPT | drag/reorder cannot silently change workflow/business semantics |
| DG-06 | YAML, Layers, Inspector and Preview are projections over one canonical revision | ADOPT | no private projection may become a second state authority |
| DG-07 | Responsive execution may change arrangement, not semantic identity/order/command/a11y | ADOPT | span/breakpoint deformation requires structural + accessibility proof |
| DG-08 | accepted != effective != current/complete | ADOPT | presentation cannot strengthen PARTIAL/UNKNOWN/STALE/REJECTED into success |
| DG-09 | Tool/Application preserve C8/C9 boundaries; ComponentRegistry != AppManifest | ADOPT | rich workspace or many Tools do not imply Studio |
| DG-10 | Studio promotion requires a reusable semantic delta beyond C9 + Tools/config | DEFER / UNPROVEN | candidate delta: shared working artifact/context + coordinated structural authoring + revision/history/currentness + materialization/reopen |
| DG-11 | Provider, tenant and deployment topology are bindings/topology, not grammar primitives | ADOPT | producer independence is tested separately from UI grammar |
| DG-12 | Station remains presentation/composition; existing Core/business authority is not duplicated | ADOPT | Station requests/projects outcomes and preserves owner semantics |

## C0→C10 proof obligations

- C0 — stable semantic identity and deterministic references; IDs must not encode location.
- C1 — primitive semantics, bounded visual variants/states, keyboard/focus/name-role-state.
- C2 — typed slots, span/local composition, incompatible slot/variant fail closed.
- C3 — keyed membership/topology/order; visual order does not imply semantic order.
- C4 — intent → capability/command → target → currentness/conditions → authority → effect → result/evidence; accepted does not imply effective.
- C5 — Pane/Region role independent from placement; visibility/focus/restoration and responsive compatibility.
- C6 — reusable semantic arrangements with substitutable participants and lower-level authority preserved.
- C7 — Template/View definition-instance identity, canonical revision, projection currentness, source/YAML round-trip and responsive semantic preservation.
- C8 — Tool identity, participant roles, active-context routing, cross-surface command convergence, restoration/multi-view consequence consistency.
- C9 — Application identity, manifest/reference integrity, compatible Tool contributions, deterministic entry/context, lifecycle/currentness, contribution isolation; AppManifest != ComponentRegistry.
- C10 — only if coordinated structural authoring over one shared working artifact/context proves an independent lifecycle/authority-neutral semantic delta. UNPROVEN.

## Seven-axis test matrix

1. Contract/unit — identity invariance, variant bounds, command identity, result qualifiers, revision/currentness.
2. Schema/composition invariants — slot compatibility, invalid variants, cycles/reachability, keyed order, span rules, serialization/round-trip.
3. Component interaction — Layers/Inspector/YAML/Preview resolve the same canonical node/revision; command surfaces converge.
4. Playwright journeys — execute action → expected state transition, including stale/rejected/partial paths.
5. Visual/structural regression — detect placement/span/order/responsive deformation; never use pixels as semantic/effect proof.
6. Accessibility — keyboard equivalence, landmarks/names/roles/states, reading/focus order and responsive preservation.
7. Station/Core integration — Station cannot strengthen authority/result/currentness; accepted != effective; retry/compensation remain owner-controlled.

## Acceptance journeys

- Move component → placement changes → semantic ID remains unchanged.
- Reparent component → compatibility/currentness is checked → canonical parent changes once or operation fails closed; ID remains stable.
- Apply invalid variant → validation rejects → zero canonical mutation.
- Insert incompatible child → slot admission rejects → zero canonical mutation.
- Reorder visually → presentation order changes → semantic sibling/business order remains unchanged unless an explicit semantic-order command is admitted.
- Edit Inspector → one canonical mutation/revision → Layers/YAML/Preview converge or become explicitly stale.
- Edit stale YAML → currentness check rejects/reconciles → zero overwrite.
- Desktop → compact → span/placement changes → ID/role/command/semantic order/focus/a11y remain preserved.
- Invoke same intent from toolbar/menu/palette → same command identity/target/owner → at most one owning canonical mutation.
- Owner returns PARTIAL/UNKNOWN → Station displays PARTIAL/UNKNOWN → no false success/currentness.
- Open confirmation → zero effect; confirm after target becomes stale → authoritative revalidation rejects/reconciles; cancel → zero effect.
- Restore workspace → presentation state returns → canonical currentness is revalidated before use.
- Resolve AppManifest → compatible Tools/windows project → ComponentRegistry remains unchanged.
- Structural edit in Tool A → one accepted revision → Tool B/Layers/Inspector/Preview invalidate/regenerate from that revision.
- Export/import tenant/application → declared scope/omissions/dependencies are checked → semantic equivalence is verified or restore remains explicitly incomplete.

## Grammar Sufficiency falsifier

Before synthesis can close, model each pressure case without domain primitives or semantic variants:
Approval; Ticketing; CRUD; Operational Dashboard; Deployment Configuration; Work Order Workspace.

Failure criterion: if a case cannot be expressed with C0→C9 composition/capability/context contracts, identify the missing reusable invariant. Do not promote a domain-named primitive merely because a screen needs it.

## Remaining gaps

UNPROVEN: invalid slot/variant executable admission; semantic reparent/order/cycle/reachability; responsive deformation + focus/a11y; YAML/Layers/Inspector/Preview round-trip/currentness; C8 restoration/multi-view; C9 save/reopen/version/contribution isolation; provider substitution/exit; tenant isolation/portability; C10 delta proof.

## Next eligible work

Run Grammar Sufficiency over the six pressure cases; reconcile any genuinely new reusable invariant into this graph; then produce Test Review/Hardening and QA Coverage/Evidence Review plans. Construction remains ineligible until those planning gates and explicit Construction materialization are satisfied.
