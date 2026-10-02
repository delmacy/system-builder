# Station S3 — QA Gates Plan 01

Date: 2026-09-30
Status: PLANNING / MATERIALIZATION — QA GATES
Truth base: main@d2cd9b404501781de90564b2029277efdfcb023f
Research line: R1→R7B + Synthesis Decision Graph 01 + Grammar Sufficiency Coverage Matrix 01

## Purpose

Materialize the mandatory intermediate Test Review/Hardening and pre-closure QA Coverage/Evidence Review gates before S3 Construction is admitted. Component Grammar and Proof Grammar evolve together. Missing evidence is never PASS.

Coverage vocabulary is exactly: `proven | failed | unproven-gap | not-applicable`.

Human acceptance validates whether an expectation is the intended product behavior. Machine conformance establishes only whether implementation satisfies an accepted obligation. QA does not create product/Core/business authority.

## Proof inheritance

A higher grammar level reuses an existing lower-level proof only when the exact contract and its preconditions remain unchanged. A Construction slice must record:
1. inherited proof IDs/contracts;
2. the semantic delta introduced by the slice;
3. the smallest adequate proof for that delta;
4. any explicit `unproven-gap`.

Do not retest primitive keyboard/focus/activation in every composition. Do add a new accessibility proof when responsive ordering, focus routing, active context, restoration, or another higher-level delta changes the relevant precondition.

## C0→C10 proof profile

| Level | Primary delta obligation | Typical inherited proof | Smallest adequate new evidence | Current |
|---|---|---|---|---|
| C0 Token | stable identity/reference; no placement encoded in ID | none | contract/unit identity invariants | unproven-gap |
| C1 Primitive | bounded state/variant + name/role/state + keyboard/focus | C0 identity | component interaction + a11y for interactive primitive | unproven-gap |
| C2 Compound | typed slots, span/local composition, fail-closed admission | C0–C1 | schema/composition admission + zero-mutation rejection | unproven-gap |
| C3 Collection | keyed membership/topology/order; visual != semantic order | C0–C2 | collection invariant tests incl. reorder distinction | unproven-gap |
| C4 Capability | intent/command/target/conditions/authority/effect/result/currentness | C0–C3 control/composition | contract + stale/rejected/partial journey | unproven-gap |
| C5 Pane/Region | role != placement; visibility/focus/restoration/responsive compatibility | C0–C4 | structural + focus/restoration proof | unproven-gap |
| C6 Pattern | reusable semantic arrangement with substitutable participants | C0–C5 | pattern substitution/composition delta | unproven-gap |
| C7 Template/View | definition-instance identity, one canonical revision, projection currentness/round-trip | C0–C6 | projection convergence/stale-write/round-trip journeys | unproven-gap |
| C8 Tool | active-context routing, cross-surface convergence, restoration/multi-view | C0–C7 | Tool journey proving context/routing/restoration deltas | unproven-gap |
| C9 Application | AppManifest integrity, Tool contribution isolation, save/reopen/version/currentness | C0–C8 | manifest/lifecycle/contribution-isolation evidence | unproven-gap |
| C10 Studio | independent coordinated-authoring lifecycle beyond C9 + Tools/config | eligible lower proofs only after discriminator exists | discriminator + shared-artifact lifecycle proof | unproven-gap / deferred |

C10 being unproven blocks C10 promotion, not C0→C9 Construction.

## Gate A — Intermediate Test Review / Hardening

Run after each bounded Construction tranche, before integration/closure claims.

Review each accepted slice for:
- false-positive tests that only assert rendering/pixels while semantic mutation/effect is unproved;
- invalid slot/variant/schema inputs and zero canonical mutation on rejection;
- stale revision, stale target and concurrent update paths;
- accepted/effective/current separation including PARTIAL, UNKNOWN, STALE and REJECTED;
- focus/reading order/keyboard behavior when responsive or structural layout changes;
- one-authority/many-projections convergence and stale projection protection;
- restoration/reopen paths where the level owns lifecycle state;
- provider-independent binding/substitution obligations when applicable;
- Station/Core boundary: Station cannot strengthen authority/result/currentness;
- retry/compensation only where declared by the owning command/capability.

Hardening output per slice: obligations reviewed, evidence IDs, inherited proofs, newly discovered gaps, adversarial cases, and bounded rework. A discovered gap is `unproven-gap` until evidence exists.

## Gate B — QA Coverage / Evidence Review

Run after integration evidence and before S3 closure.

For every promoted level and every Construction slice, produce a coverage row containing:
- obligation ID and owning grammar level;
- accepted source/contract;
- inherited proof references and unchanged preconditions;
- delta proof reference;
- evidence freshness/current revision;
- status: `proven | failed | unproven-gap | not-applicable`;
- human acceptance requirement, if any;
- unresolved gap / bounded follow-up.

Closure rules:
- no missing evidence may be converted to PASS;
- `failed` blocks closure of the owning accepted obligation;
- `unproven-gap` blocks claims that the obligation is proven and must be explicitly dispositioned;
- `not-applicable` requires a reason;
- inherited proof is invalid if its preconditions changed;
- benchmark/research convergence is provenance, not executable proof;
- human approval cannot substitute for required machine conformance, and machine conformance cannot decide product intent.

## Required sufficiency evidence

The six pressure cases remain `unproven-gap` until representative executable evidence exists:
- Document Approval — generic primitive binding + stale target + accepted/effective/current result.
- Ticketing — keyed collection/order distinction + concurrent/currentness behavior.
- CRUD — schema-driven Inspector/admission + invalid mutation rejection + round-trip.
- Operational Dashboard — freshness/currentness + responsive structural/a11y preservation.
- Deployment Configuration — provider-neutral binding + consequence/result + portability/exit evidence without Station authority expansion.
- Work Order Workspace — active-context routing + multi-view convergence + restoration.

These are representative falsification journeys, not invitations to build six products.

## Construction admission consequence

The common gaps may now be materialized as bounded Construction slices:
A. admission/schema contracts;
B. canonical revision + projection convergence;
C. command currentness/result semantics;
D. responsive structural/a11y preservation;
E. C8 active-context/restoration/multi-view;
F. C9 manifest/save-reopen/version/contribution isolation;
G. provider-independence/portability evidence adapters where scope permits.

Each slice must implement behavior plus the smallest adequate proof in the same Construction tranche. Specialized Studios and AI/MCP foundation remain out of scope.

## Exit

This QA plan satisfies the planning requirement for intermediate Test Review/Hardening and QA Coverage/Evidence Review. It does not itself prove any obligation and does not authorize product semantics. Construction still requires explicit bounded materialization with exact-head/file limits and dependencies.
