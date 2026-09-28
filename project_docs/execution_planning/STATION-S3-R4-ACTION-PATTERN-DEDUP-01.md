# Station S3-R4 — Action Pattern Dedup 01

Date: 2026-09-28
Base revalidated: fresh `main@9ac33de132abfd6f946b8f90f5012332d8df31c6`
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Question

R4 currently carries FormActions, ConfirmationActions and DestructiveActions as candidate semantic patterns. Before promoting three C6 nouns, determine whether they introduce independent reusable semantics/proof deltas or are configurations/variants over a smaller contextual-command grammar.

Preserved invariants: `identity != placement != presentation != action`; Button remains a small primitive; command/target/conditions/authority/effects/result remain separated; Station does not gain business authority; research and QA do not create product authority.

Coverage vocabulary is strict: `proven | failed | unproven-gap | not-applicable`. Missing evidence is never PASS.

## Station current state

R3 established the C4 chain:

`intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`

R4 C6 research established contextual action sets, confirmation consequence and form actions as candidate journeys, but no row is generically proven. Lower command/target/currentness/authority proofs may be inherited only when preconditions remain unchanged.

The open dedup question is therefore not visual grouping. It is whether the three nouns require distinct semantic owners/contracts.

## Independent benchmark evidence

### Carbon

Carbon treats primary/secondary/tertiary/ghost/danger primarily as action emphasis/purpose variants. `danger` marks destructive effects, while the same danger semantics can appear at different emphasis levels. Carbon's modal grammar further models `Danger` as a specialization of a transactional modal for destructive/irreversible actions, rather than as a new command authority. Its common-actions guidance scales confirmation by consequence: low-impact deletion can execute directly, while higher-impact deletion adds warning/confirmation.

Extraction: destructiveness changes consequence/risk presentation and may add a confirmation precondition; it does not require a new primitive action identity or business authority.

Classification: `adopt-pattern` for consequence/risk qualifiers; do not adopt Carbon component taxonomy as Station authority.

### PatternFly

PatternFly's Action List is deliberately generic across toolbars, modals, forms, data lists and wizards; context changes spacing/placement rather than action semantics. Its modal guidance distinguishes non-destructive and destructive confirmation by consequence severity and can require an additional typed confirmation before enabling a serious destructive action. Form guidance groups commit/cancel actions around form state, but those remain commands affecting a declared target.

Extraction: action grouping is one reusable presentation grammar; confirmation is an invocation gate/journey; destructiveness is a command consequence/risk qualifier; form submit/reset/cancel are command semantics over editable state rather than a distinct visual primitive family.

Classification: `adapt` the semantic separation, not PatternFly layout rules.

### Fluent 2

Fluent recommends a dialog when a destructive action needs prevention/confirmation rather than encoding destruction into a message surface. This independently supports separating consequence communication/confirmation from the underlying action control.

Extraction: destructive consequence may select a confirmation projection, but that projection remains presentation and cannot establish authority/effect truth.

Classification: `adopt-pattern`.

## Convergence and divergence

Independent convergence:

1. generic action grouping is reusable across surfaces;
2. destructive semantics are consequences/risk, not a new Button identity;
3. confirmation is conditional presentation/invocation flow and is especially justified by irreversible/high-impact consequences;
4. form actions are ordinary semantic commands bound to editable target/state, with validation/dirty/currentness conditions;
5. severity can alter presentation and required confirmation without changing who owns the authoritative command.

Divergence is mostly UX policy: systems differ on when confirmation is required, which button receives danger styling, placement/order, and whether typed confirmation is warranted. Those differences must remain policy/contract inputs, not hardcoded Station grammar.

## Candidate Station grammar

Promote one small **Contextual Action Set** C6 candidate rather than three sibling domain-like patterns.

Participant roles:

- action region / projection;
- semantic command refs;
- target resolver;
- presentation conditions;
- optional validation/dirty-state projection;
- optional consequence/risk descriptor;
- optional confirmation policy/projection;
- owner result/currentness projection.

Qualifiers/configuration:

- `commit | cancel | reset | auxiliary` are command roles, not component types;
- `destructive/irreversible/high-impact` is consequence/risk metadata owned by accepted command/domain contract;
- confirmation is a policy-gated invocation journey, not command authority;
- visual emphasis/order/placement are presentation configuration;
- typed confirmation is an optional condition supplied by policy, not a new pattern class.

`FormActions`, `ConfirmationActions`, and `DestructiveActions` therefore remain named usage profiles/examples unless future evidence demonstrates a proof delta that cannot be represented by Contextual Action Set + qualifiers.

## Proof Grammar

### Inherited proofs

Where preconditions remain unchanged, inherit:

- C1 activation/focus/accessibility for Button/control primitives;
- C3 action grouping/composition;
- C4 semantic command identity, target/currentness transport, `availability != authority`, owner revalidation and result non-strengthening;
- C5 named action-region anatomy.

Do not retest those mechanics merely because a command is destructive or appears in a form/modal.

### Smallest C6 delta proofs

Contextual Action Set remains `unproven-gap` until focused executable evidence establishes:

1. changing canonical selection/context changes admitted commands without feature-name hardcode;
2. the same semantic command projected in two admitted action surfaces resolves the same command identity/target and preserves owner result;
3. presentation qualifiers cannot change command identity, target, authority owner or effect semantics;
4. owner rejection/stale/partial/unknown/reconcile-required cannot be strengthened by the action set;
5. stale bindings are invalidated before invocation.

Confirmation-profile delta, when applicable:

1. opening confirmation produces no authoritative effect;
2. target/currentness/authority are revalidated at confirm-time;
3. cancel/close produces no authoritative effect and is not rollback;
4. changed/stale target between open and confirm rejects or reconciles according to owner contract;
5. focus entry/exit/restoration satisfies the applicable accessibility contract.

Form-profile delta, when applicable:

1. validation/dirty state controls presentation availability but does not establish business authority;
2. submit crosses one owning mutation/command boundary against the current target/revision;
3. reset/cancel semantics are contract-declared and do not imply rollback unless the owner exposes rollback;
4. invalid/stale input fails closed.

Destructive-profile delta, when applicable:

1. risk/consequence metadata is projected from an accepted owner/command contract, not inferred from button color/label;
2. confirmation policy is selected from current consequence/policy state and revalidated at invocation;
3. irreversible/high-impact presentation cannot imply that the effect occurred;
4. retry/compensation/rollback affordances appear only when owner-qualified current evidence permits them.

No profile is generically `proven` today. These are future Construction obligations, not present PASS claims.

## Dedup decisions

Reject by default:

- `ApproveDocumentButton`;
- `DeleteButton` as semantic authority rather than a styled Button binding;
- `DestructiveActionSet` as a separate owner;
- `FormActionEngine`;
- `ConfirmationAuthority`;
- `DeploymentRetryToolbar`;
- feature-specific action panes whose only distinction is command names/labels/domain.

A new pattern is promotable only if a materially different reusable cross-participant invariant survives substitution across at least two domains and requires an independent delta proof.

## Grammar Sufficiency impact

The five-system exercise remains expressible without three action-pattern classes:

- document approval: Contextual Action Set + optional confirmation + owner result;
- ticketing: Contextual Action Set + target/currentness + result/status;
- CRUD: Contextual Action Set + editable/validation qualifiers + optional destructive confirmation;
- operational dashboard: Contextual Action Set, often read/navigation-oriented;
- deployment configuration: Contextual Action Set + stale/currentness + high-impact confirmation where owner policy requires it + accepted/effective/partial result projection.

No new domain-specific component is required by this slice. Remaining sufficiency pressure is contract/schema -> Inspector, canonical graph -> Layers, broad multi-projection synchronization, and inherited semantic reparent/order gaps.

## Human acceptance — separate from machine conformance

Representative human journeys should validate that users can understand the current target, available actions, destructive consequence and confirmation context; that cancel feels non-destructive; and that stale/rejected/partial outcomes do not appear successful. Human acceptance cannot prove authority, currentness or effect truth.

## R4 disposition

Action-family dedup blocker: **resolved as research classification**.

- `Contextual Action Set`: retain as C6 candidate (`own/adapt`), still `unproven-gap` generically.
- `FormActions`: usage profile/configuration unless future independent delta disproves dedup.
- `ConfirmationActions`: confirmation journey/profile over a semantic command; not separate authority.
- `DestructiveActions`: consequence/risk qualifier/profile; not separate semantic owner.

This resolution narrows rather than expands the catalog. It does not authorize Construction.

## Remaining R4 blockers

1. contract/schema -> Inspector projection proof direction;
2. canonical graph -> Layers derivation proof direction;
3. broad one-canonical-artifact / multi-projection synchronization proof direction;
4. C5/C6 Exit/Proof Matrix reconciliation using this dedup result;
5. inherited R3 cycle/reachability and sibling-order gaps remain explicit and must not be hidden in Layers/drag UX.

Source/YAML serialization/round-trip remains R5 input. R5 remains ineligible until R4 handoff is integrated/recorded; Construction, Studios and AI/MCP remain blocked.
