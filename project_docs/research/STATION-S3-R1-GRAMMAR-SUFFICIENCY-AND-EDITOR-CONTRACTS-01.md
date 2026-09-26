# Station S3-R1 — Grammar Sufficiency & Editor Contracts 01

Date: 2026-09-26
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY
Companion: `STATION-S3-R1-CENSUS-PARITY-01.md`

## Question

Can Station keep a small reusable visual grammar while expressing a very large interaction space manually, without encoding domain verbs into primitives or creating a new component for every action/context pair?

## Repository starting point

The accepted S3 hierarchy remains `Token -> Primitive -> Compound -> Collection -> Capability -> Pane/Region -> Pattern -> Template/View -> Tool -> Application -> Studio`. Existing M2 evidence already separates component identity, placement, slots and discrete spans, and the S3 addendum requires Layers/Structure, Inspector, declarative source and Preview to remain projections/editors of one canonical composition truth.

## External evidence delta

### Webflow — instance configurability and constrained slots

Current Webflow component documentation distinguishes main component, instance, properties, slots and variants. Instance properties customize bounded values while the main component retains shared structure. Slots are explicit placeholders for nested components; Webflow can restrict a slot to a selected allowed-component set and rejects disallowed insertion attempts. This is useful evidence for Station's contract-driven Inspector and machine-testable slot compatibility, not a provider contract to copy.

Classification: `adopt-pattern`.

Sources:
- https://help.webflow.com/hc/en-us/articles/33961303934611-Components-overview
- https://help.webflow.com/hc/en-us/articles/33961195339923-Slots
- https://help.webflow.com/hc/en-us/articles/33961219350547-Component-properties

### React Aria — behavior separated from visual component identity

React Aria exposes reusable interaction/accessibility behavior independently of styling. Its NumberField documentation composes an input with increment/decrement Buttons while explicitly noting that the Button is independent and reusable elsewhere. This supports Station's candidate rule that Button owns activation/accessibility/presentation state while domain intent/command/effects remain outside the primitive.

Classification: `adopt-pattern` for behavior/presentation separation; no provider authority.

Source:
- https://react-spectrum.adobe.com/react-aria/useNumberField.html

### VS Code — commands/views before unrestricted custom surfaces

VS Code's UX guidance treats Views as movable/reorderable content containers, uses command actions on view toolbars, and recommends Tree Views for data rather than using tree items as buttons. Its Webview guidance says custom surfaces should be used only when necessary and should not repeat existing functionality. This is evidence for Station C5-C8: bounded region/view contracts and command surfaces should be preferred over arbitrary escape hatches.

Classification: `adopt-pattern`.

Sources:
- https://code.visualstudio.com/api/ux-guidelines/views
- https://code.visualstudio.com/api/ux-guidelines/webviews
- https://code.visualstudio.com/api/extension-guides/tree-view

## Candidate Interaction Grammar

The visual component and the semantic operation must remain separate dimensions:

`Component -> ActivationIntent -> CommandBinding -> Capability/Target -> Preconditions/Authority -> Effect graph -> Result -> Presentation consequences`.

A `Button` therefore owns only bounded visual/interaction concerns such as label/icon, focus, disabled/pending/pressed state, activation semantics and accessibility. It must not acquire domain methods such as `approveDocument`, `approveDeploy`, `transferAsset` or `publishSystem`.

`approve` is a semantic intent/command family, not a Button variant. Its required fields and legal consequences are resolved against the selected capability/target contract. `approve + document` and `approve + deployment` may therefore expose different Inspector schemas without creating `ApproveDocumentButton` and `ApproveDeploymentButton` primitives.

### Candidate consequence model

A command binding may reference a typed consequence graph, for example:

`activate -> validate -> authorize -> invoke command -> observe result/effect -> refresh projection -> notify/navigate`.

Important invariant: request acceptance/ACK is not proof that the authoritative effect occurred. Failure, partial effect, stale target, retry, reconciliation and compensation/rollback obligations belong to the command/capability contract where applicable, not to Button.

## Contract-driven Inspector

Candidate rule: Inspector fields are derived from the selected component/command/capability schema rather than hardcoded per feature. Selection progressively narrows legal configuration:

1. component contract defines bounded presentation/interaction properties;
2. intent/command selection filters compatible capabilities/targets;
3. capability/target contract defines required/optional inputs, policies and effects;
4. consequence nodes expose only their own typed configuration;
5. invalid combinations fail validation rather than silently falling back.

This preserves manual authoring while making the same grammar machine-discoverable later. AI/MCP remains deferred: the manual deterministic contract surface must work first.

## One truth, multiple editors

Inspector, Layers/Structure, consequence Graph, declarative YAML/JSON and Preview are candidate projections/editors of one canonical artifact. None is an independent source of composition/action truth.

Proof obligation: perform an authorized edit through each surface and demonstrate one canonical version transition plus convergence of all other projections. A local UI selection/focus state may remain ephemeral, but composition identity/order/properties/command bindings may not fork per surface.

## Promotion / dedup rule

Before promoting a new grammar object, ask:

1. Does it introduce a stable semantic contract not expressible as configuration of lower levels?
2. Does it own new invariants/state/proof obligations?
3. Is it reused across materially different contexts?
4. Would representing it only as configuration create ambiguity or invalid combinations that cannot be bounded by schema?

If the answer is no, prefer configuration/binding over a new component type. This is the primary defense against `ApproveButton`, `ApproveDocumentButton`, `ApproveDeployButton` proliferation.

## Grammar Sufficiency Test — candidate

S3 synthesis should not claim sufficiency from catalog size. Use heterogeneous reference compositions and measure explicit gaps.

Reference classes:
- document approval;
- ticketing/triage;
- conventional CRUD/master-detail;
- operational dashboard/monitoring;
- deployment configuration/control.

For each reference class, attempt a manual composition using only promoted grammar objects. Record:
- reused primitives/compounds/capabilities/patterns;
- new configuration only;
- genuine missing semantic contract;
- escape hatch required;
- duplicate abstraction temptation;
- proof obligations inherited versus newly introduced;
- authority boundary crossed;
- unresolved gap.

Candidate sufficiency criterion: the set is promising when materially different systems reuse the same lower/mid-level grammar and new domain behavior is primarily expressed through typed bindings/projections rather than new visual primitives. No scalar completeness score; gaps remain named and typed.

## Proof consequences

| Concern | New proof obligation | Inherited proof | Current state |
|---|---|---|---|
| Button primitive | activation/focus/keyboard/disabled/pending/accessibility; no domain intent encoded as variant | C0 token proofs | partial; catalog evidence exists, full contract census pending |
| Command binding | compatible intent/capability/target; typed inputs; deterministic invalid-combination rejection | C1 activation proof | unproven-gap; R3 owns promotion |
| Capability-specific Inspector | schema-driven field projection; required/optional field correctness; no feature-hardcoded authority | C1-C4 contract/schema proofs | unproven-gap |
| Consequence graph | ordering/dependency semantics; failure/partial/retry/reconciliation representation where applicable | command/capability proofs | unproven-gap; must not become workflow/Core authority silently |
| Multi-editor projection | one canonical mutation/version; Layers/Inspector/Graph/source/Preview convergence | M2 composition truth invariants | partial; Graph/action projection not yet promoted |
| Promotion/dedup | configuration does not create unnecessary component identity | lower-level grammar proofs | research rule only |
| Grammar sufficiency | five heterogeneous reference classes expressible with bounded gaps and without routine escape hatches | all applicable lower-level proofs | unproven-gap; synthesis gate candidate |

## Adversarial cases

- Add `approve`, `save`, `cancel`, `deploy` as Button variants -> reject semantic leakage.
- Select `approve` against a capability that has no approval contract -> incompatible combination must be absent or rejected deterministically.
- Change capability after configuring command inputs -> stale incompatible fields must be surfaced/invalidated, never silently retained as effective configuration.
- ACK command while authoritative effect later fails -> UI must not report completed effect solely from ACK.
- Edit consequence graph while source/YAML remains stale -> projection-convergence proof fails.
- Add a custom arbitrary surface because a bounded View/command contract exists -> require explicit justification; avoid escape-hatch-first design.
- Complete all five reference systems only by inventing domain-specific buttons -> Grammar Sufficiency Test fails despite visual success.

## Feed-forward

- R1: continue primitive/token/provider census; this artifact adds evidence and candidate rules only.
- R2: test action groups/field assemblies against promotion/dedup rule.
- R3: own Interaction Grammar, command binding, capability compatibility, failure/recovery semantics and typed state transitions.
- R4: own semantic action/consequence patterns and named region compatibility without domain authority leakage.
- R5: prove canonical truth across Inspector/Layers/Graph/source/Preview and responsive projections.
- R6: exercise the Grammar Sufficiency Test across Tool families.
- R7: perform Core Contract Reuse & Station Projection Census before any consequence/command model crosses into business authority.
- Synthesis: decide whether these candidates become accepted grammar/promotion rules and whether Grammar Sufficiency Test becomes an exit gate.

## Disposition

`R1 = IN_PROGRESS`. These findings strengthen the case for a small primitive base plus typed interaction/capability contracts and contract-driven authoring. They do not authorize Construction, AI/MCP integration, new Core contracts or Studio implementation.