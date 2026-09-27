# Station S3-R1 — Proof Coverage Matrix 01

Date: 2026-09-27
Fresh-main observation: `main@8a6ec550e954a81c9200f2f993ed347410b1383d`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Purpose

Map current repository evidence to emerging C0-C4 Component Grammar / Proof Grammar obligations. Coverage states are deliberately limited to `proven`, `failed`, `unproven-gap`, and `not-applicable`. Implementation existence alone is not PASS.

Preserve: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; span/discrete authoring; provider independence; Station has no Core/business authority.

## Currentness note

Fresh main advanced through PR #959 to `8a6ec550...`. `docs/current/NEXT_WORK.md` still embeds `Repository truth base: main@8687854...`, but its semantic execution pointer remains S3-R1 and still blocks Construction until R1→R7→synthesis. Treat the embedded SHA as a currentness gap, not as authority to skip gates.

The active R1 PR remains based on older history; integration/currentness proof is therefore `unproven-gap` until reconciled against fresh main.

## C0-C4 coverage matrix

| Tier / subject | Obligation | Repository evidence | Status | Inheritance / delta |
|---|---|---|---|---|
| C0 semantic/surface tokens | bounded canonical vocabulary exists | `UI_SEMANTIC_TOKENS`, `STATION_SURFACE_TOKENS`; product test checks representative tokens and CSS-variable projection | proven | baseline vocabulary only |
| C0 token breadth | typography/spacing/radius/elevation/motion/density/responsive ownership is explicit | no bounded canonical taxonomy identified in R1 census | unproven-gap | do not infer from Tailwind/local classes |
| C1 Button | safe default button type and stable source-owned slot | `station-ui-core.test.ts` asserts `type="button"`, slot, focus class | proven | reusable lower-tier evidence |
| C1 Button | accessible name and keyboard activation semantics are explicitly tested | native element implementation exists, but no focused executable proof found for name/keyboard activation | unproven-gap | higher compounds must not manufacture PASS |
| C1 Input/Select | source-owned stable primitive projection | product test renders slots and representative native select | proven | existence/projection only |
| C1 Select | distinction from future Combobox is contractually/proof enforced | no generalized semantic-distinction proof identified | unproven-gap | native Select must not silently become Combobox |
| C2 IconButton | Button semantics inherited + non-empty accessible label delta | implementation composes Button and requires label, but no direct product proof found | unproven-gap | should inherit Button; test label delta only |
| C2 ButtonGroup | grouping projection exists without acquiring command authority | source wrapper uses group semantics; composition descriptor exists separately | unproven-gap | dedup/authority relation still needs explicit proof |
| C2 Toggle | pressed state projection is synchronized | product test asserts `aria-pressed="true"` and `data-state="on"` | proven | inherits button-like activation surface; proves state projection delta |
| C2 Toggle | prevented activation does not mutate state | implementation checks `defaultPrevented`; no direct executable proof found | unproven-gap | delta proof only |
| C3 Tree collection | tree/treeitem roles, level, selection, expanded state and roving tabIndex are represented | `packages/ui-core/tree.tsx` | unproven-gap | implementation evidence, not executable conformance proof |
| C3 Tree navigation | Up/Down/Home/End traversal and Left/Right expansion behavior are correct | implementation explicitly handles keys; no Tree product test found | unproven-gap | collection delta; should inherit selection validity |
| C3 selection validity | presentation selection is normalized/fails closed for inconsistent primary ref | `station-interaction.test.ts` exercises normalized selection and invalid primary rejection | proven | reusable interaction proof |
| C4 presentation command availability | availability is rechecked at invocation and unavailable execution fails closed | `station-interaction.test.ts` | proven | reusable command capability proof |
| C4 command identity/projection | multiple controls may resolve to one semantic command | toolbar/menu references resolve to `settings.open` in product test | proven | supports responsive/alternate projection invariance |
| C4 shortcut semantics | normalization/conflict handling deterministic | product test | proven | reusable command binding proof |
| C4 Station/Core boundary | Core intent cannot register as executable presentation command | product test explicitly rejects it | proven | authority-boundary proof |
| C4 duplicate identity | duplicate presentation command IDs fail closed | product test | proven | registry identity proof |
| C4 Menu capability | item collection, active item, roving focus, activation, dismissal/restoration, trigger relation | `MenuSurface` is surface-only | unproven-gap | cannot inherit a full Menu PASS from Button/Tree |
| C4 Tooltip capability | trigger modalities, relationship, timing/dismissal/focus behavior | CSS/role implementation only | unproven-gap | implementation != mature capability |

No `failed` row was established by this bounded census. This means no observed executable evidence contradicted an obligation; it does **not** mean uncovered obligations pass.

## Tree / collection finding

The repository already contains a meaningful C3 candidate rather than a blank collection layer. `Tree` projects a `CollectionIndex`/`SelectionState` through tree/treeitem roles, `aria-level`, `aria-selected`, conditional `aria-expanded`, roving `tabIndex`, click selection, double-click expansion and Arrow/Home/End navigation.

This is strong implementation evidence, but search did not identify a direct product test executing Tree keyboard/focus behavior. Therefore Tree remains `unproven-gap` at grammar conformance level. Future proof should target only the collection delta: visible-order traversal, expansion/collapse, focus/selection convergence, unknown-ref fail-closed behavior and accessible tree relationships. It should inherit the already-proven station-interaction selection invariants rather than re-test selection normalization wholesale.

## Interaction Grammar evidence strengthened

Current product tests already prove two important S3 hypotheses:

1. multiple controls can resolve to one semantic presentation command;
2. Core command intents are explicitly distinct from executable presentation commands.

This is local evidence for the candidate chain:

`visual activation surface -> command binding -> context/target -> availability/authority boundary -> execution/result -> presentation consequence`

It argues against domain-specific visual primitives such as `ApproveDocumentButton`. A visual Button may project activation; command identity and authority remain separate contracts.

## Proof inheritance refinement

- C0 proof establishes bounded token vocabulary/projection; component tests need not re-prove token array existence.
- C1 primitive proof establishes native semantics/safe defaults/stable slots.
- C2 compounds inherit C1 and prove only added relation/state (IconButton label, Toggle pressed state, group semantics).
- C3 collections inherit primitive activation/selection contracts and prove traversal, ordering, active/focus/selection and expansion deltas.
- C4 capabilities inherit their projection primitives/collections and prove command identity, availability, binding, authority boundary, failure/recovery and projection invariance.

A missing inherited proof propagates as an explicit gap; inheritance never upgrades `unproven-gap` to PASS.

## Dedup consequences

1. `Tree` should not be rediscovered as a missing component; the gap is executable collection conformance evidence and eventual catalog authority.
2. `PresentationCommandRegistry` already proves semantic command reuse across controls. Responsive overflow should reuse the same command identity rather than create overflow-specific commands.
3. `CoreCommandIntent` separation is already product-tested; S3 should extend that boundary, not create a second command authority inside Component Grammar.
4. `MenuSurface` must remain a surface primitive until collection/dismissal/focus deltas are proven.
5. IconButton/Toggle are ideal proof-inheritance cases; do not duplicate all Button tests at their tier.

## R1 sufficiency gaps now

High-value blockers before R1 closure are narrower:

- add/locate executable evidence for Tree collection keyboard/focus behavior;
- locate any existing IconButton accessible-name and Toggle prevented-activation tests; otherwise retain gaps for future materialization rather than silently writing product tests during research;
- classify token breadth as bounded defer vs synthesis requirement;
- deduplicate the multiple R1 research artifacts into one exit matrix/finding set;
- reconcile the R1 branch with fresh main and revalidate all paths after PR #959 documentation normalization;
- produce R1 exit evidence with every obligation explicitly `proven`, `failed`, `unproven-gap`, or `not-applicable`.

## Gate disposition

S3-R1 remains `IN_PROGRESS`. The repository has more reusable proof than the initial census suggested, especially around presentation commands and Station/Core separation, while Tree exposes a concrete C3 proof gap. No Construction task or specialized Studio is authorized by this matrix.