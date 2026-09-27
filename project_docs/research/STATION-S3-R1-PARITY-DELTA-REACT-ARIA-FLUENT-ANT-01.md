# Station S3-R1 — React Aria / Fluent / Ant parity delta 01

Date: 2026-09-26
Research status: EVIDENCE ONLY — NOT PRODUCT AUTHORITY
Branch predecessor head: `1c49fa57f760630489fdd3c1d97e3c7a630c1932`
Fresh-main observed: `886418e07e218983cb71ce40689d9832ecef6d62`

## Authority revalidation

This delta was produced after re-reading the current authority chain: `docs/DOCUMENT_AUTHORITY.md`, `docs/contracts/001-station-component-grammar/ADDENDUM.md`, `docs/current/NEXT_WORK.md`, `AGENTS.md`, ADR-0017 and `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`.

Fresh repository truth has advanced to `main@886418e07e218983cb71ce40689d9832ecef6d62` via PR #958. `docs/current/NEXT_WORK.md` still embeds `Repository truth base: main@8687854...`, but its semantic execution pointer remains S3-R1 and still forbids Construction before R1→R7+synthesis. Treat the embedded SHA as a documentation-currentness gap, not as permission to ignore fresher repository truth.

Preserved invariants: identity != placement != presentation != action; `ComponentRegistry != AppManifest`; `WindowGeometry != composition grid`; span/discrete authoring; provider independence; Station has no Core/business authority; research does not create product authority.

## Question under test

Do React Aria, Fluent and Ant independently support the emerging Station hypothesis that a small primitive base should be extended through explicit composition/interaction contracts, while responsive projection, accessibility state machines and semantic action scope remain distinct from primitive visual identity?

## React Aria / React Spectrum

Primary-source observations:

- Button exposes one press interaction across mouse, keyboard and touch and requires an accessible label when no visible label exists.
- Menu uses a collection API, typed MenuItem/section/submenu composition and explicitly forbids nested interactive elements inside menu items because they break keyboard/screen-reader navigation.
- Toolbar provides group-level keyboard navigation across heterogeneous interactive children.
- React Spectrum has shipped responsive collapsing for Tabs and ActionGroup when space is constrained.
- Overlay primitives centralize focus management, accessibility, scroll locking and positioning rather than requiring every consumer control to reimplement those behaviors.

Candidate classification: **adopt-pattern**.

Station implication: primitive activation, collection semantics, focus/navigation and overlay behavior are separable proof-owning contracts. A responsive projection may change visible representation without changing semantic command identity. Slot/child compatibility must be able to reject semantically invalid nesting, not merely structurally render it.

Do not adopt React Aria package/API syntax as Station authority.

Primary sources:
- https://react-spectrum.adobe.com/v3/Button.html
- https://react-spectrum.adobe.com/Menu
- https://react-spectrum.adobe.com/v3/releases/2023-11-8.html
- https://react-spectrum.adobe.com/v3/releases/2021-06-15.html
- https://react-spectrum.adobe.com/v3/releases/2022-11-15.html

## Fluent 2

Primary-source observations:

- Fluent defines Button as a single action/event and differentiates Button, Split Button, Menu Button, Compound Button and Toggle Button by interaction/presentation semantics rather than by business-domain command names.
- Toolbar groups related actions, keeps destructive/status-changing actions separated, and uses overflow when actions no longer fit rather than wrapping into an unbounded second line.
- Overflow changes presentation: hidden toolbar actions surface through an overflow menu and gain text labels there.
- Tablist similarly moves excess tabs to overflow and preserves role/selection accessibility semantics.
- Tree distinguishes hierarchy/branch/leaf semantics and warns that hover quick actions are an unexpected accessibility pattern; equivalent actions should remain available through a toolbar or menu.

Candidate classification: **adopt-pattern** for action grouping, responsive projection, alternate accessible projection and compound promotion criteria.

Station implication: the same command can have multiple valid projections (visible toolbar button, overflow menu item, alternate accessible surface) while command identity/target/authority remain invariant. A compound earns separate grammar when it introduces a materially different interaction state machine or semantic relationship, not merely because it has a different business label.

Primary sources:
- https://fluent2.microsoft.design/components/web/react/core/button/usage
- https://fluent2.microsoft.design/components/web/react/core/toolbar/usage
- https://fluent2.microsoft.design/components/web/react/core/tablist/usage
- https://fluent2.microsoft.design/components/web/react/core/tree/usage

## Ant Design

Primary-source observations:

- Ant distinguishes AutoComplete (free input aided by suggestions) from Select (choice among options), despite their superficial visual similarity. This is useful evidence that promotion/classification should follow semantic/interaction contract rather than appearance.
- Tabs exposes explicit item identity/state such as key, disabled, closeability and content plus a separate overflow popup projection.
- Breadcrumb exposes semantic internal structures through `classNames`/`styles`, separating named anatomy from the component's overall identity.
- Ant's own FAQ explicitly cautions against depending on undocumented internal APIs and notes that adding insufficiently abstract APIs creates long-term compatibility debt.
- Ant CLI packages version-accurate component metadata and can emit structured JSON. This is evidence that a component catalog can be machine-queryable without making the tooling itself runtime authority.

Candidate classification: **adopt-pattern** for semantic differentiation, stable public contracts, structured metadata and explicit internal anatomy; **defer** Ant-specific APIs/provider semantics.

Station implication: the future Inspector/catalog should be generated from stable Station-owned schemas/contracts, not introspection of undocumented provider internals. Machine-readable metadata is useful for manual tooling now and later AI/MCP acceleration, but it remains projection of accepted contracts rather than authority of its own.

Primary sources:
- https://ant.design/components/auto-complete/
- https://ant.design/components/tabs/
- https://ant.design/components/breadcrumb/
- https://ant.design/docs/react/faq/
- https://ant.design/docs/react/cli/

## Cross-benchmark convergence / divergence

### Convergence

1. **Primitive identity stays small.** React Aria Button and Fluent Button own activation/accessibility behavior, not arbitrary business command semantics.
2. **Compounds are justified by interaction deltas.** Menu, Toolbar, Tabs, Split/Menu Button and collection controls add state/focus/selection/navigation obligations beyond primitive activation.
3. **Responsive overflow is projection, not command duplication.** React Spectrum, Fluent and Ant independently move items into overflow representations under space pressure.
4. **Accessibility is structural behavior.** Invalid child composition, focus movement, keyboard navigation and accessible naming are contract obligations rather than optional styling.
5. **Named anatomy is bounded.** Menu items/sections, Fluent structures and Ant semantic DOM support explicit parts rather than arbitrary untyped descendants.
6. **Stable public contracts matter.** Ant's warning against internal APIs reinforces Station provider independence and schema-owned Inspector behavior.

### Divergence worth preserving

- React Aria emphasizes headless interaction/accessibility primitives; Fluent includes stronger product/design guidance; Ant exposes a broad integrated component API. Station should extract convergent grammar, not select one ecosystem as semantic authority.
- Ecosystems differ in whether overflow, menu and slots are component APIs, utilities or design guidance. Station synthesis must choose its own ownership boundary based on existing `station-composition` contracts.

## Dedup / promotion findings

- Do **not** create `ApproveButton`, `ApproveDocumentButton`, `DeployButton`, `OverflowApproveButton` or similar primitives. Candidate model remains `Button + activation + CommandBinding + capability/target + projection`.
- Do **not** create a second command when responsive layout moves an action into overflow. Projection changes; command identity/target/authority/evidence do not.
- Do **not** classify controls by visual resemblance alone. AutoComplete-vs-Select and Button-vs-MenuButton show that materially different interaction semantics can justify different compounds/capabilities.
- Do **not** let provider-specific slot/style APIs become Station structural authority. Station-owned descriptors/schemas remain canonical.
- A new C2/C4 concept is justified when it adds a reusable state machine, compatibility rule or semantic relationship with independent proof obligations; a label/theme/domain noun alone is insufficient.

## Proof Grammar delta

Candidate obligations added/refined by this parity pass:

1. **Activation inheritance proof** — compounds that reuse Button inherit primitive role/name/disabled/keyboard activation proof; they do not re-prove business-specific copies.
2. **Collection-child semantic proof** — collection/slot schemas reject child structures known to invalidate navigation/accessibility (e.g. nested interactive descendants where the collection contract forbids them).
3. **Roving/group navigation delta proof** — Toolbar/Menu/Tabs-like compounds prove arrow/roving focus, entry/exit and disabled-item behavior in addition to inherited child proofs.
4. **Responsive representation invariance proof** — visible→overflow projection preserves semantic command id, target, authority requirements, ordering constraints where relevant, and evidence linkage.
5. **Alternate-access proof** — actions hidden behind hover/space-constrained projections remain available through an accessible keyboard/screen-reader surface when the accepted pattern requires it.
6. **Semantic-distinction proof** — superficially similar controls with different accepted semantics (free entry vs bounded selection, toggle vs command, menu trigger vs direct action) cannot be substituted without schema/interaction validation.
7. **Public-contract/currentness proof** — Inspector/catalog generation consumes accepted Station schema versions; undocumented provider internals cannot silently alter available fields or compatibility.
8. **Machine-readable catalog proof** — generated metadata must round-trip to the same canonical descriptor/contracts and cannot become a second authority.

Current coverage status: `unproven-gap` unless an existing Station executable proof is explicitly mapped during the repository-wide proof census. No absence-of-failure is promoted to PASS.

## C0→C10 proof inheritance impact

- **C0 Token:** no new proof from these benchmarks; token census remains open.
- **C1 Primitive:** role/name/activation/disabled/state semantics are owning proofs.
- **C2 Compound:** inherits C1; proves composition, focus/state-machine delta and child restrictions.
- **C3 Collection:** inherits item primitives/compounds; proves identity, ordering/selection, keyboard traversal and collection-child compatibility.
- **C4 Capability:** proves reusable behavior/state transitions independently of the visual projection hosting it.
- **C5 Pane/Region:** inherits contained contracts; proves region scope, focus/overflow containment and placement invariants.
- **C6 Pattern:** proves semantic relationships/action scope and representative journeys, not primitive activation again.
- **C7 Template/View:** proves structural/responsive projection and convergence across editor projections.
- **C8 Tool:** proves critical multi-pattern journeys and tool-specific state boundaries.
- **C9 Application:** proves application composition/integration and inherited tool contracts.
- **C10 Studio:** remains research-only; future proof must cover specialization/integration deltas without acquiring Core authority.

## Grammar Sufficiency impact

The five candidate sufficiency fixtures remain: document approval, ticketing, CRUD/master-detail, operational dashboard and deployment configuration. This pass adds explicit observations to record for each fixture:

- whether one command requires multiple responsive/accessibility projections;
- whether any new component request is only a domain-name duplicate;
- whether interaction semantics genuinely require a new C2/C4 contract;
- whether Inspector fields can be derived from accepted schemas without provider-specific hardcode;
- whether inherited proofs can be referenced rather than repeated.

A fixture remains a gap if it needs an untyped escape hatch, arbitrary handler/code injection, provider-internal API, duplicated command authority or an unexplained new component class.

## R1 disposition

R1 remains **IN PROGRESS**, but the named design-system parity gap is substantially reduced: Radix, shadcn/ui, MUI, PatternFly, Base UI, Carbon, Chakra, React Aria/React Spectrum, Fluent and Ant now all have primary-source evidence in the R1 research set.

Remaining closure work is no longer mainly "add more libraries". The dependency-safe priorities are:

1. repository-wide Station/ui-core primitive and wrapper census;
2. token ownership census;
3. map existing executable proofs to C0→C4 obligations so inherited proofs are distinguished from gaps;
4. deduplicate the R1 research artifacts and reconcile this branch against fresh `main@886418e...`;
5. correct/reconcile the stale embedded truth-base SHA in `NEXT_WORK.md` through the normal governance path if it remains stale after branch reconciliation;
6. close R1 only when the resulting census can feed R2 without provider lock-in.

No Construction, Studio implementation, Core authority expansion or IA/MCP foundation work is authorized by this delta.