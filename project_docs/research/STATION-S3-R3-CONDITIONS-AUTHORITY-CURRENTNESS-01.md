# Station S3-R3 — Conditions, Authority & Target Currentness 01

Date: 2026-09-27
Base: fresh `main@c09b291ee13cc846fbdab717cee31377bf6cc085`
Status: RESEARCH — NOT PRODUCT AUTHORITY

## Station current -> open question

R3 already separates `intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`, but the remaining blocker is whether contextual command availability may be treated as authority/currentness and whether the existing Station/Core boundary already provides a target-currentness guard.

The answer is asymmetric: presentation availability is a bounded condition gate; it is not business authority. The Station/Core protocol already carries revision-qualified target intent and executable stale-revision rejection evidence at the authoritative boundary.

## Repository evidence

`packages/station-interaction/types.ts` defines `PresentationCommandDefinition.availability(context)` over `StationInteractionContext` containing focus, selection and surface. `PresentationCommandRegistry.invoke()` recomputes availability immediately before `execute()`. This proves invocation-time revalidation for presentation-local conditions, not authorization for Core/domain effects.

`CoreCommandIntent` remains deliberately non-executable by `PresentationCommandRegistry`; its comment states that authority remains with Core/domain owners. Therefore a visible/enabled presentation projection cannot be promoted into business authorization.

`packages/contracts/station-core/index.ts` already defines a stronger cross-boundary command shape: `StationCommand` carries actor + actor revision, action, target, and `expectedRevisionRef`. The protocol separately models projection source authority/revision/currentness and command receipts; projection identity is explicitly distinct from canonical source identity.

Most importantly, `tests/product/station-core-e2e.test.ts` provides executable evidence. The in-memory Core port compares `command.expectedRevisionRef` against its current canonical revision and rejects a mismatch with `STATION_CORE_REJECTED` and `reconcileRequired: true`. The product test `stale command revision is rejected by Core and no Station layer strengthens it into success` verifies that a stale command leaves canonical revision/name unchanged.

This closes a bounded part of the target-currentness question: revision-qualified stale-target rejection at the Station/Core boundary is already **proven** for the protocol/e2e path. It does not prove every future capability supplies the correct expected revision, nor that every domain authority uses the same revision semantics.

## Convergence / divergence

Convergence with the existing R3 command-registry finding:
- conditions used for presentation availability are re-evaluated at invocation;
- target identity is explicit and independent of focus/selection;
- cross-boundary commands can carry expected target revision;
- authoritative stale rejection occurs beyond Station presentation authority;
- rejection/reconcile-required is preserved instead of strengthened into success.

Divergence is intentional:
- presentation `availability(context)` is local applicability/UX gating;
- Core/domain authority decides whether an authoritative effect may occur;
- `expectedRevisionRef` is one currentness mechanism, not a universal schema for every owner;
- a command can be presentation-available and still be authoritatively rejected after currentness/permission/business checks.

## Candidate finding / classification

1. **own — presentation conditions:** Station may own local conditions required to render/enable/invoke presentation commands, and must re-evaluate them at invocation.
2. **adopt-pattern/reuse — revision-qualified target intent:** where a Core-bound command is derived from a revision-qualified projection, preserve source target identity/revision into the authoritative request rather than inventing a Station-local stale flag.
3. **forbid-by-default — availability != authority:** no `available=true`, focus, selection, visible control, Inspector state or human acceptance may be treated as business authorization.
4. **defer — universal condition/authority schema:** owner-specific permission, policy and business preconditions remain outside Station authority; R3 should not flatten them into a generic boolean.

## Proof obligations and inheritance

### Proven / inherited

- Presentation command availability is re-evaluated at invocation.
- `CoreCommandIntent` is not executable through presentation command authority.
- Station/Core projection carries source identity, source revision, source authority and currentness distinctly from projection identity/revision.
- Station/Core command can carry target + expected revision.
- The existing e2e authoritative boundary rejects a stale expected revision and leaves canonical state unchanged.
- Station preserves that rejection and `reconcileRequired` instead of converting it to success.

### Delta proofs required for future concrete C4 bindings

- target resolution uses semantic target identity, never incidental focus/placement;
- if the command derives from revision-qualified source state, the binding preserves the relevant expected revision/currentness qualifier without reinterpretation;
- local availability is revalidated immediately before dispatch;
- authoritative owner revalidates permission/policy/business/currentness at execution boundary;
- an authority rejection cannot be strengthened by Station into accepted/effective success;
- a stale/rejected result invalidates or refreshes affected presentation consequences rather than leaving a misleading enabled/success state;
- when the owner does not use revision equality as its currentness model, the binding preserves that owner's declared currentness/evidence semantics instead of manufacturing `expectedRevisionRef` equivalence.

### Remaining `unproven-gap`

- generic mapping from selected/focused artifact to authoritative target across arbitrary capabilities;
- generic conditions-vs-authority contract beyond the bounded presentation/Core examples;
- actor permission/policy revalidation for arbitrary domain commands;
- async accepted-vs-effective projection binding;
- partial-effect/retry/compensation projection binding;
- Inspector/Layers/Graph/source round-trip over one artifact authority;
- cycle/reachability proof for semantic composition reparent;
- semantic sibling ordering.

No absence above is PASS. Async effect obligations remain `not-applicable` only for a capability whose declared contract is genuinely synchronous/presentation-local.

## Dedup consequence

Do not create `AuthorizedButton`, `CurrentTargetButton`, `StaleCommand`, `ApproveDocumentButton` or feature-specific condition components. Button remains visual/interaction primitive. Binding resolves command + semantic target + condition projection; authoritative owner remains responsible for permission/currentness/effect. Revision/currentness is carried as contract evidence, not promoted into component identity.

## C4 handoff impact

R3 now has enough evidence to state a bounded C4 rule for conditions/currentness without claiming universal authority:

`presentation condition -> invocation-time revalidation -> semantic target/revision projection -> authoritative revalidation -> owner result -> non-strengthening presentation consequence`

This is a research finding only. It should feed the R3 Exit Matrix and synthesis. R4 remains blocked until the complete R3 handoff is reconciled against fresh main and all R3 promoted findings carry explicit proof coverage/gaps.
