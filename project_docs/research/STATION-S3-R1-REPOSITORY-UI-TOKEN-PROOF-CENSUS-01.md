# Station S3-R1 — Repository UI, Token & Proof Census 01

Date: 2026-09-26
Fresh-main observation: `main@886418e07e218983cb71ce40689d9832ecef6d62`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Purpose

Close a major R1 gap by inspecting current source-owned Station/UI surfaces, token ownership and existing proof surfaces before proposing more catalog breadth. This is census evidence only; it does not authorize Construction.

Preserve: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; discrete spans; provider independence; Station has no Core/business authority.

## Source-owned UI census

`packages/ui-core/components.ts` currently provides source-owned presentation components: `Button`, `IconButton`, `ButtonGroup`, `Input`, native `Select`, `Toggle`, `Separator`, `Badge`, `Panel`, `ScrollArea`, `Tooltip`, and `MenuSurface`.

This materially refines the earlier parity table: several candidates previously described as having no explicit catalog descriptor already exist as UI implementations even though they are not yet canonical `ComponentDescriptor` catalog entries. Therefore **UI implementation existence != grammar/catalog identity**.

Key observations:

- `Button` uses native `<button>`, bounded visual variants/sizes, focus-visible ring and disabled presentation. Business command identity is absent: good separation evidence.
- `IconButton` composes `Button` and requires an accessible label. This is a strong local example of proof inheritance rather than a new domain primitive.
- `ButtonGroup` is a presentation grouping with `role=group`; this is distinct from `station-composition`'s canonical ButtonGroup descriptor and must not become a second composition authority.
- `Input` and native `Select` are thin source-owned controls; `Toggle` adds pressed state/`aria-pressed`, therefore it already introduces a small interaction state machine requiring delta proof.
- `Separator` carries separator semantics/orientation; `Badge` and `Panel` are primarily presentation surfaces.
- `ScrollArea` is native overflow enhancement, not evidence for a custom scrolling capability.
- `Tooltip` is currently CSS hover/focus-within projection with `role=tooltip`; it is implementation evidence but **not sufficient proof** for full tooltip accessibility/dismissal/timing/portal behavior.
- `MenuSurface` supplies only a menu surface role/presentation. It does not prove menu item collection semantics, roving focus, keyboard navigation, dismissal or trigger relationship. Do not promote it to a complete Menu capability.

## Inspector census

`PropertyInspector` consumes caller-created `PropertyGroupDefinition[]` / rows. It already supports stable property IDs, known/unknown state and read-only state, but the schema is assembled by the caller rather than derived from a canonical component/capability/command contract.

The current Component Lab builds groups manually from selected layer payload plus descriptor fields. This is useful proof of the projection shape, but it is **not yet a schema-driven Inspector**. R1/R3 synthesis should preserve the UI shell while moving field availability/validation to canonical contracts rather than feature-specific group builders.

Proof consequence: Inspector rendering can inherit `PropertyInspector` presentation proof; future schema-driven behavior must separately prove schema selection, field typing, unknown-field handling, mutation validation and round-trip convergence.

## Token census

`packages/ui-core/tokens.ts` explicitly owns two bounded sets:

1. UI semantic tokens: background/foreground, card, popover, primary, secondary, muted, accent, destructive, border, input and ring pairs.
2. Station surface/status tokens: desktop, window, titlebar, taskbar, toolbar, selection, current, stale and unknown.

This corrects the earlier statement that token vocabulary was absent: tokens exist, but the current canonical list is primarily **semantic color/surface vocabulary**. R1 still has gaps for explicit typography, spacing, radius, elevation, motion, density and breakpoint/responsive token ownership.

Dedup rule: CSS utility values and component-local classes are implementation/presentation evidence; they must not silently become canonical grammar tokens. Conversely, canonical tokens must not gain placement/action authority.

## Existing proof surfaces

The Component Lab demonstrates one local canonical composition draft projected into Layers, preview, inspector and status surfaces. It exercises bounded contract mutation, invalid slot rejection, invalid component-reference rejection, graph discard/reset, selection and validation.

This is evidence toward manual-first editing and projection convergence, but it is not complete convergence proof because Layers/Inspector/Preview are not all independently editable projections and source/YAML/Graph round-trip is not shown here.

### Proof status by emerging tier

| Tier | Local evidence observed | Status for S3 grammar |
|---|---|---|
| C0 Token | bounded semantic/surface token arrays | partial/proven-as-existence; ownership breadth gap |
| C1 Primitive | source-owned Button/Input/Select/etc. | implementation evidence; semantic/a11y proof incomplete |
| C2 Compound | IconButton/ButtonGroup presentation + composition ButtonGroup descriptor | partial; authority/dedup distinction required |
| C3 Collection | Tree exists elsewhere in ui-core; MenuSurface is not collection proof | unproven-gap for generalized collection grammar |
| C4 Capability | Toggle has bounded pressed behavior; full menu/overlay contracts absent | unproven-gap beyond local behavior |
| C5+ | editor shell/projections exist, but S3 promotion criteria not yet proven | unproven-gap |

No row above converts missing evidence into PASS.

## New dedup findings

1. **Implementation != descriptor != capability.** A UI component can exist without being a canonical catalog component; a descriptor can exist without owning rendering; a capability can project through either.
2. **Presentation ButtonGroup != composition ButtonGroup authority.** Keep the UI wrapper and composition descriptor connected by projection/adaptation, not duplicated identity/state.
3. **MenuSurface != Menu.** Surface role/styling must not be mistaken for collection/focus/command semantics.
4. **Tooltip implementation != complete tooltip capability.** CSS visibility is not proof of the mature interaction contract.
5. **Native Select != Combobox.** Current native select implementation should not force a future combobox into the same primitive identity merely because both choose values.
6. **IconButton is proof-inheritance evidence.** Accessible-name delta plus Button inheritance is preferable to retesting Button semantics as a new primitive.
7. **Token ownership is real but narrow.** Extend only through synthesis evidence; do not infer a full design-token system from Tailwind classes.
8. **Current Inspector is projection infrastructure, not contract authority.** Preserve it while making future fields contract/schema-driven.

## Proof obligations refined by repository evidence

- `Button`: native role/type, accessible name, keyboard activation, disabled semantics and focus indication. Reused by IconButton and higher compounds.
- `IconButton` delta: non-empty accessible label and preserved Button semantics.
- `Toggle` delta: `aria-pressed` and state transition remain synchronized; prevented activation must not mutate state.
- `Select` distinction: native select semantics are preserved; any future Combobox must prove its separate text-entry/listbox state machine.
- `MenuSurface`: no capability PASS until item collection, active item/focus movement, keyboard activation, dismissal/restoration and trigger relationship are proven.
- `Tooltip`: no capability PASS until trigger modalities, accessible relationship, timing/dismissal and focus behavior are evidenced.
- `Token projection`: semantic token substitution may change presentation but cannot alter component identity, placement, command or authority.
- `Inspector schema`: canonical contract selects legal fields; unknown fields stay explicit; mutations validate before canonical commit.
- `Projection convergence`: future editable Inspector/Layers/Graph/source must round-trip to one canonical artifact; current lab is only partial evidence.

## R1 sufficiency gaps after this census

Before R1 closure, remaining high-value work is now narrower:

- map repository tests/proofs to the C0-C4 obligations above instead of merely listing implementations;
- inspect Tree/interaction collection evidence and composition tests for inherited proofs;
- reconcile/deduplicate the R1 branch against fresh main and other R1 artifacts;
- resolve whether token breadth is intentionally deferred or requires a bounded R1 taxonomy finding;
- produce an R1 exit matrix distinguishing `proven`, `failed`, `unproven-gap`, `not-applicable`.

Benchmark breadth is no longer the main blocker. Repository proof mapping and dedup/currentness are.

## Disposition

R1 remains IN PROGRESS. This census reduces false gaps (source-owned controls and semantic tokens already exist) while exposing the more important distinction between implementation surfaces and canonical grammar authority. No Construction slice or specialized Studio is authorized.