# Station S3 — Grammar Sufficiency Coverage Matrix 01

Date: 2026-09-30
Status: RESEARCH / SYNTHESIS — NON-AUTHORITATIVE
Truth base: main@d2cd9b404501781de90564b2029277efdfcb023f
Depends on: STATION-S3-SYNTHESIS-DECISION-GRAPH-01.md

## Purpose

Falsify the synthesized C0→C10 grammar against distinct system classes without introducing domain primitives, semantic visual variants, duplicated state authority, provider lock-in, or escape hatches. This is coverage/gap analysis, not a score.

Coverage vocabulary: `proven | failed | unproven-gap | not-applicable`. Research plausibility never becomes `proven`; executable SB-owned evidence is required.

## Reusable expression kit under test

- C0–C3: identity, primitive controls, typed slots/compounds, keyed collections.
- C4: `intent -> command/capability -> target -> conditions/currentness -> authority -> effects -> result/evidence -> presentation consequences`.
- C5–C7: regions/patterns/templates/views with discrete spans and one canonical revision projected through Layers/Inspector/Graph/source/Preview.
- C8–C9: Tools and Applications compose the same contracts; AppManifest remains distinct from ComponentRegistry.
- C10: deliberately excluded as a required escape hatch; Studio remains UNPROVEN.

A domain label, command binding, schema field, provider binding, icon, style, placement or presentation variant is configuration unless it introduces a reusable invariant not expressible by the kit.

## Sufficiency matrix

| Pressure case | Expression through existing grammar | Required delta proofs | Inherited proofs | Coverage / gap |
|---|---|---|---|---|
| Document approval | Form/detail View + action Pattern + generic Button bound to `approve/reject` command + document target + authority/currentness conditions + owner result | same-intent surface convergence; stale target rejection; accepted!=effective; partial/unknown presentation | C1 activation/a11y; C2 slots; C4 command identity/result contract; C7 projection identity | **unproven-gap** — expressible without `ApproveDocumentButton`; executable stale/result evidence absent |
| Ticketing | keyed Collection + detail Pane + status/assignment capabilities + filters + history/result projections | keyed order vs semantic workflow order; concurrent/stale update; owner authority; projection convergence | C1–C5 local interaction/composition; C7 canonical revision rules | **unproven-gap** — no new primitive/invariant required; concurrency/currentness evidence absent |
| CRUD | schema-driven Form/Table/View + generic create/read/update/delete commands + validation/conditions + result evidence | schema/Inspector admission; invalid mutation fail-closed; stale edit protection; round-trip | C1 form controls/a11y; C2/C3 composition; C4 command/result; C7 revision | **unproven-gap** — schema-driven expression is sufficient in model; executable admission/round-trip absent |
| Operational dashboard | read projections + collections/cards/charts as presentation + drill/filter commands + explicit freshness/currentness | stale/current indicator; filter/drill target identity; responsive structural/a11y preservation | C0 identity; C3 collections; C5 regions; C7 projection rules | **unproven-gap** — presentation diversity does not require semantic primitives; freshness/responsive evidence absent |
| Deployment configuration | schema-driven configuration View + provider-neutral capability/command bindings + dependency/result/currentness projections | provider substitution; dependency consequence; accepted!=effective; partial effect/retry; exit/rebuild portability | C1–C7 UI/composition; C4 result semantics; producer-independence research obligations | **unproven-gap** — grammar can present/author intent, but Station must not acquire deployment authority; provider/exit proofs absent |
| Work Order Workspace | list/board/detail Views + action/assignment capabilities + multiple Tool surfaces over one work-order context | active-context routing; multi-view convergence; restoration; structural consequence/currentness | C0–C7 identity/composition/projection; C8 Tool contracts where preconditions unchanged | **unproven-gap** — C8 composition appears sufficient; multi-view/restoration evidence absent |

## Cross-case findings

### SF-01 — Domain-specific controls are not required
All six cases can be described using generic primitives plus schema, command/capability, target, conditions, authority and result bindings. `ApproveDocumentButton`, `TicketCloseButton`, `DeployButton` and similar domain-named controls would duplicate configuration rather than introduce a reusable invariant.

Disposition: **ADOPT-PATTERN / dedup**.
Proof obligation: registry/schema validation must demonstrate that domain bindings do not mutate primitive identity or variant taxonomy.
Status: **unproven-gap**.

### SF-02 — Inspector must be contract/schema-driven
CRUD, deployment configuration, ticketing and work-order cases independently require contextual fields to derive from the selected component/capability/command schema. Hardcoded per-feature Inspector panels would fail reuse and dedup.

Disposition: **ADAPT into Station contract projection**.
Proof obligation: selecting different registered contracts deterministically changes available Inspector fields; unsupported fields fail closed; editing produces one admitted canonical revision.
Inherited: C2 slot compatibility and C7 projection identity/currentness.
Status: **unproven-gap**.

### SF-03 — One artifact, multiple projections is cross-domain
Approval, CRUD, ticketing and work-order cases require source/YAML, Layers, Inspector, Graph or rendered Views to refer to the same node/revision rather than maintain private authorities.

Disposition: **ADOPT**.
Delta proof: edit in any admitted editor produces one revision; all other projections converge or explicitly report stale; stale writes cannot overwrite silently.
Inherited: C0 identity, C4 admission/result, C7 projection contract.
Status: **unproven-gap**.

### SF-04 — Failure/recovery belongs to command/capability contracts
Approval and deployment expose the same distinction between request acceptance and effective outcome. Ticketing/CRUD expose stale/conflict variants. These are not Button states.

Disposition: **ADOPT**.
Delta proof: `accepted != effective != current`; PARTIAL/UNKNOWN/STALE remain visible; retry/compensation eligibility comes from owning authority; Station cannot invent rollback.
Status: **unproven-gap**.

### SF-05 — C10 is not required for sufficiency
None of the six cases requires Studio merely to express its UI/system definition. Work Order Workspace exercises C8; deployment configuration can remain C7/C8/C9 presentation/configuration over external authority. Therefore complexity or many Tools does not justify C10.

Disposition: **DEFER C10**.
Delta proof before future promotion: coordinated structural authoring over a shared working artifact/context must demonstrate a reusable lifecycle semantic not reducible to C9 + Tools/config.
Status: **unproven-gap**, intentionally blocking promotion rather than blocking C0→C9 sufficiency work.

## Proof inheritance rule applied

Higher cases inherit a lower-level proof only when the exact contract and its preconditions remain unchanged. Example: a Button's keyboard activation proof is inherited by approval/ticket/deploy bindings; each case proves only binding, target/currentness, authority/result and composition deltas. Responsive rearrangement inherits semantic identity but adds focus/reading-order/structural proof. Provider substitution never inherits from a visual control proof.

## Sufficiency gaps that block a PASS claim

No pressure case is `proven` yet because this phase has research/documentation evidence, not executable SB-owned conformance for the deltas. The common implementation gaps are:

1. executable slot/variant/schema admission and zero-mutation rejection;
2. canonical revision + projection convergence/currentness across Inspector/Layers/Graph/source/Preview;
3. stale/concurrent command admission and accepted/effective/current result semantics;
4. responsive structural + focus/reading-order/a11y preservation;
5. C8 active-context, restoration and multi-view convergence;
6. C9 save/reopen/version/contribution isolation where Application lifecycle is exercised;
7. provider substitution, dependency consequence, portability and exit/rebuild for deployment configuration.

These gaps should become bounded Construction slices with the smallest proof that establishes each delta; they are not reasons to invent new grammar levels.

## Grammar Sufficiency conclusion

**No falsifier currently requires a new domain primitive, semantic visual variant, duplicated authority, provider-specific grammar type, escape hatch, or C11.** The synthesized C0→C9 grammar is therefore *sufficient as a Construction hypothesis*, not proven implementation truth. All six pressure cases remain `unproven-gap` until executable evidence exists.

Human acceptance later validates whether the modeled expectations match intended product behavior. Machine conformance proves only the accepted obligations and cannot create product authority.

## Next gate

Materialize the Test Review/Hardening plan and QA Coverage/Evidence Review plan against the obligations above. Only after those plans exist should an explicit Construction materialization decompose the common gaps into dependency-safe behavior + proof slices. Construction must not build a specialized Studio and must not introduce IA/MCP as foundation.
