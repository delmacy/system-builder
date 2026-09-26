# Station Composition Identity and Executable Acceptance Guidelines

Status: Proposed durable guidance for M2 and successor Station composition/editor work  
Scope: Station presentation/composition and its test/evidence process  
Authority: subordinate to accepted ADRs, public contracts, TASK boundaries, and Core/business authority

## Purpose

Keep a growing component hierarchy understandable to humans, deterministic for machines, open to novel valid composition, and auditable through reproducible evidence.

This guidance does not expand a running TASK. Product implementation adopts these rules only when its materialized scope permits the relevant paths and change level.

## 1. Separate identity, meaning, presentation, and placement

A component instance MUST NOT require a globally meaningful mega-ID such as `purchaseApprovalWindowFooterApproveButton`.

Treat these concerns independently:

- **Technical instance identity** — opaque, stable, machine-owned identifier, e.g. `cmp_01...`. It answers *which exact instance?*
- **Human label** — editable/localized presentation such as `Approve`. It answers *what should a person see?*
- **Semantic reference** — domain-neutral or capability/action reference such as `approval.approve` when the owning contract permits it. It answers *what role/action is referenced?*
- **Placement context** — composition parent + named slot/path such as `footer.actions`. It answers *where is the instance composed?*
- **Component type/family** — registry identity and compatibility metadata. It answers *what kind of composable thing is this?*

Opaque IDs are not user-facing names and MUST NOT become implicit business authority. Human-facing editors SHOULD hide technical IDs under advanced/developer inspection unless identity is directly relevant.

Moving an instance between valid placements SHOULD NOT require changing its technical identity merely because its path changed.

## 2. Hierarchical composition grammar

Station composition evolves through increasingly expressive levels without collapsing their contracts:

`primitive -> primitive component -> component -> composition -> pattern -> specialized tool -> application -> system`

Each level SHOULD consume validated contracts from the level below rather than reimplementing their invariants. Shared primitives provide a common interaction, spacing, focus, accessibility, sizing, and semantic vocabulary so independently built tools remain visually and behaviorally related.

Compatibility is contract-driven, not a hardcoded catalog of every previously known pair.

## 3. Compatibility classification

Validators and authoring UX SHOULD distinguish:

- **valid** — known or ordinary combination satisfying all contracts;
- **valid-novel** — previously unseen combination that still satisfies all required contracts;
- **warning** — technically valid but unusual, risky, ambiguous, or ergonomically suspect; warnings do not silently become hard prohibitions;
- **invalid** — violates a required contract/invariant and MUST fail closed.

The system MUST preserve room for novel valid composition. `not previously catalogued` is not equivalent to `invalid`.

## 4. Human acceptance versus machine invariants

Human product authority is primarily responsible for intent and subjective UX decisions: expected journey, wording, modal versus panel, navigation result, visual hierarchy, and whether the interaction feels correct.

Repository contracts and engineering evidence are responsible for deterministic invariants: no invalid graph persistence, no dangling references, no corruption after rejected mutation, deterministic selection/reference behavior, accessibility contracts, transaction/publication invariants where owned by the appropriate bounded context, and other non-subjective safety properties.

A human SHOULD be able to approve a concise journey without auditing every low-level assertion.

## 5. Acceptance Journey specification

Important user-facing behavior SHOULD be representable as an executable journey:

`S0 -- user action --> S1 -- user action --> S2 ...`

Each checkpoint MAY declare:

- preconditions;
- user action;
- expected semantic state;
- expected visible state;
- invariants that must remain true;
- accessibility expectations;
- optional visual baseline;
- evidence to retain on failure or closure.

Example:

```text
S0 editor clean
  -> select component
S1 selected + inspector synchronized
  -> mutate variant
S2 draft dirty + preview synchronized
  -> attempt invalid mutation
S3 rejection visible + previous draft/preview preserved
  -> discard
S4 original clean state restored
```

Tests SHOULD verify the relevant whole checkpoint, not merely that the clicked element changed.

## 6. Layered evidence

Use complementary evidence rather than treating one test class as complete proof:

- unit/contract tests for local deterministic rules;
- component tests for rendered interaction and state;
- state-machine/model-based tests for legal and illegal transitions when valuable;
- browser/E2E journeys for real integration behavior;
- accessibility checks for semantic/keyboard contracts;
- visual regression for approved appearance checkpoints;
- adversarial/negative cases for fail-closed behavior;
- integration tests for cross-boundary contracts under the authority that owns them.

A green suite demonstrates the declared coverage for the tested revision; it is not a claim of absolute correctness.

## 7. Expected versus observed visual evidence

For approved visual checkpoints, retain or derive the useful trio:

- `expected` — accepted baseline;
- `actual` — rendered result from the exact tested revision;
- `diff` — machine comparison highlighting divergence.

For temporal failures, prefer diagnostic order:

`logs/assertion -> trace/DOM snapshot -> screenshot/diff -> video/selected frames`

Video is supporting evidence, not the primary semantic oracle when a deterministic state/DOM assertion can express the requirement more precisely.

## 8. Evidence organization

Large suites SHOULD organize durable or uploaded evidence by domain and suite before execution date:

```text
test-evidence/
  station/
    component-editor/
      mutation/
        <date>/
          <run-id>/
  core/
  integration/
```

An execution directory may contain summary/report metadata, expected/actual/diff images, trace, and failure video.

Routine PR artifacts MAY use short retention to control storage. Milestone/release closure SHOULD retain a compact permanent verification record in repository/release memory when materialized by the closure scope.

## 9. Test cadence

Prefer proportional execution:

- **commit/local** — affected fast unit/component tests;
- **PR** — affected integration, browser journey, accessibility, and visual checks;
- **main** — broader regression appropriate to changed surfaces;
- **nightly/periodic** — expensive full/adversarial combinations when introduced;
- **milestone/release closure** — full declared verification plus selected durable evidence.

Test-impact selection may optimize execution, but MUST NOT silently omit a declared required gate for an exact head.

## 10. Auditability and exact-head evidence

Every material claim of automated verification SHOULD identify the exact revision tested. Open-source reviewers must be able to inspect the test definition and reproduce it where environment/dependencies permit.

Reports SHOULD prefer precise claims such as:

`commit X passed journeys A/B/C, invariants D/E, browser F, environment G`

rather than `fully validated` or `bug free`.

## 11. Boundary preservation

These guidelines do not merge separate authorities:

- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-oriented;
- Core/business authority is not recreated in frontend state;
- semantic action references do not themselves implement business commands;
- opaque technical IDs do not encode mutable hierarchy or business semantics;
- a test harness may observe cross-boundary behavior but does not acquire authority over the bounded contexts it tests.

## 12. Adoption rule

When a future TASK introduces or changes component identity, composition compatibility, user-facing journeys, visual baselines, or milestone verification records, its materialization SHOULD cite this document and select only the applicable clauses. If adoption requires a public contract or architecture boundary change, materialize the appropriate L3/L4 work and ADR rather than smuggling it through an L1/L2 implementation TASK.
