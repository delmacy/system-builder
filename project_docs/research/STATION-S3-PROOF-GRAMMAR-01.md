# Station S3 — Proof Grammar 01

Date: 2026-09-26
Research status: EVIDENCE — NOT PRODUCT AUTHORITY
Companion: `STATION-S3-R1-CENSUS-PARITY-01.md`

## Rule

Component Grammar and Proof Grammar evolve together. Every promotable finding must state what must be proved, what lower-level evidence may be inherited, and what remains an explicit gap. Missing evidence is `unproven-gap`, never PASS. QA/test evidence does not create product authority. Human acceptance validates expectation/fitness and remains distinct from machine conformance.

Coverage states: `proven | failed | unproven-gap | not-applicable`.

Proof reuse rule: a higher level inherits stable lower-level conformance and proves only its new composition/interaction/ownership obligations. A Template does not re-prove a Button's primitive keyboard semantics unless it changes or constrains them.

## C0-C10 proof ladder

| Level | Grammar object | New proof obligations | Inherited proof | Typical evidence | Current gap |
|---|---|---|---|---|---|
| C0 | Token | canonical identity; type/domain validity; theme mapping; contrast/motion constraints where applicable | none | schema/static checks + theme matrices | token census incomplete |
| C1 | Primitive | semantic role/name; states; keyboard/focus where interactive; token-only presentation; provider substitution contract | C0 tokens | component/unit + accessibility automation; targeted manual AT | primitive catalog incomplete |
| C2 | Compound | slot/child compatibility; ordering; state projection; no identity/action conflation | C0-C1 | composition contract tests + adversarial invalid-slot tests | generalized compound grammar incomplete |
| C3 | Collection | item identity/key stability; selection/focus model; empty/loading/error; ordering/virtualization boundaries | C0-C2 | model/property tests + keyboard collection conformance | List/Table/Tree/Grid ownership unresolved |
| C4 | Capability | behavior independent of visual provider; focus/keyboard/dismissal/modality/command semantics; composable state transitions | relevant C1-C3 | state-machine/interaction tests + accessibility conformance | capability vocabulary not first-class |
| C5 | Pane/Region | landmark/region semantics; bounded layout ownership; responsive/discrete spans; containment and overflow | C0-C4 | structural/a11y/layout contract tests | region taxonomy pending R4 |
| C6 | Pattern | goal-level composition invariants; capability wiring; failure/empty/loading paths; no hidden business authority | C0-C5 | scenario/model tests; pattern accessibility review | pattern census pending R4 |
| C7 | Template/View | required regions/slots; responsive projection; substitution constraints; route/view semantics without AppManifest conflation | C0-C6 | template contract + representative viewport checks | pending R5 |
| C8 | Tool | command surface and view composition; action boundary projection; permission/business decisions remain external | C0-C7 | integration contract tests with mocked authority boundaries | pending R6 |
| C9 | Application | AppManifest separation; tool/navigation composition; lifecycle boundaries; provider independence | C0-C8 | application integration/e2e boundary proofs | research only; no Construction |
| C10 | Studio | specialized authoring workflow composition; domain projection without Station owning domain truth; cross-tool coherence | C0-C9 | end-to-end workflow + authority-boundary evidence + human acceptance | readiness only in R7; do not build |

## R1 parity findings with proof consequences

1. **Accessibility must be evidence-bearing, not a catalog adjective.** Carbon publishes component accessibility status across default state, advanced states, keyboard navigation and manual screen-reader testing. Station should adopt the *proof-status pattern*, not Carbon as authority/provider. Source: https://carbondesignsystem.com/components/overview/accessibility-status/
2. **Composition inherits component proofs.** PatternFly states demos compose components/layouts and should not add accessibility tags absent from components; accessibility belongs at component level. This supports proof inheritance rather than repeated primitive retesting. Source: https://pf5.patternfly.org/guidelines/
3. **Region/page proofs add structural obligations.** PatternFly Page requires one `main`, uniquely labelled multiple `nav` regions and skip-to-content handling when repetitive content exists. These are C5/C7 obligations above primitive conformance. Source: https://www.patternfly.org/components/page/accessibility/
4. **Patterns are goal-level combinations, not renamed components.** Carbon defines patterns as reusable combinations of components/templates addressing user objectives and flows. This supports C6 scenario proofs distinct from C1-C3 conformance. Source: https://carbondesignsystem.com/patterns/overview/
5. **Complex interactions require capability proofs.** React Aria's Tree drag/drop release explicitly covers keyboard and screen-reader accessibility and interoperability across collection components. This supports C4 behavior contracts reused by C3 collections rather than bespoke per-widget logic. Source: https://react-spectrum.adobe.com/v3/releases/2025-06-05.html

## Promotion checklist for every S3 finding

A finding is synthesis-ready only when it records: proposed ladder level; identity/placement/presentation/action ownership; dependencies; provider stance (`own|adapt|adopt-pattern|defer`); new proof obligations; inherited proofs; evidence class; negative/adversarial cases; accessibility obligations; coverage state; human-acceptance question if subjective; and explicit authority boundary.

`unproven-gap` blocks claims of conformance but does not automatically block research progression when the gap is deliberately carried to a later R-phase. `failed` requires blocker-first correction or a documented rejection/defer decision.

## QA gates forecast for future Construction materialization

Future Construction planning must not place testing only at milestone end. Each vertical slice implements behavior plus the smallest adequate proof at the same head. Milestones must include an intermediate **Test Review / Hardening** checkpoint after representative lower/mid-level composition is available, and a **QA Coverage / Evidence Review** before closure. Closure requires a coverage ledger using the four states above, exact-head machine evidence for applicable gates, explicit unresolved gaps, and separate human acceptance where expectation/visual fitness cannot be machine-conformed.

This forecast is research guidance only. It creates no Construction TASK, Studio authority, Core/business authority, or provider dependency.