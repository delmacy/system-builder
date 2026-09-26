# Palantir Ontology / Semantic System Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`

## Public model

Palantir documents Ontology as a system integrating **data, logic, action and security**, conceptually grouped into Language, Engine and Toolchain. Objects/properties/links represent operational nouns/relations; functions/actions/automations provide logic and verbs; security governs interaction.

This is closer to an operational semantic substrate than to a conventional read-only semantic layer.

## Findings

### P-O01 — Nouns plus verbs
**Primitive:** semantic identity + relationships + executable/authorized operations.

**SB relation:** supports keeping Entity/Domain semantics connected to Commands/Actions without collapsing `Button != Domain Command` or `Action definition != execution authority`.

**Classification:** `ALREADY COVERED / ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O02 — Interface as polymorphic contract
Ontology Interfaces can require properties, link constraints and action-type constraints. Concrete object types map implementations to interface requirements. Interfaces may extend multiple interfaces.

**Primitive:** structural/behavioral contract with explicit implementation mapping.

**SB relation:** useful evidence for capability-facing contracts and provider/object substitution, but SB must preserve its stronger rule that interface/schema compatibility alone is not full contract compatibility.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O03 — Interface action constraint does not fabricate semantic uniformity
Palantir documentation explicitly warns that satisfying concrete actions can have distinct rules, permissions and side effects and should be reviewed for semantic match. Some interface-action surfaces also have current product limitations.

**Primitive:** contract-shape satisfaction != behavioral equivalence.

**SB relation:** strongly reinforces `Adapter normalization != fabricated semantic equivalence` and multidimensional compatibility.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O04 — Interface evolution can break implementations/consumers
Adding required properties/link/action constraints can require coordinated implementation updates; docs recommend new interface versions when downstream consumers cannot update simultaneously.

**Primitive:** explicit contract evolution and coexistence.

**SB relation:** supports immutable/versioned semantic contracts and compatibility proofs instead of mutable-latest assumptions.

**Classification:** `ALREADY COVERED`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O05 — Operational write loops create effect ambiguity
Ontology Actions can invoke external webhooks/writeback. Public webhook/action docs expose the need to reason about external request success/failure separately from local semantic mutation.

**Primitive:** external effect acknowledgement != canonical state transition completion.

**SB relation:** direct fit with existing `Provider ACK != effective state`, `AUTHORIZED != EXECUTED != EFFECTIVE != OBSERVED`, `UNKNOWN -> reconcile` research.

**Classification:** `ALREADY COVERED`, high-value validation. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O07 — Local ACID boundary explicitly excludes external effects
**Source/date:** Palantir Action Types — Consistency and isolation; Webhooks; accessed 2026-09-23.

**Mechanism:** Ontology edits performed by one Action are a single ACID transaction, but that atomicity explicitly does not extend to notifications, webhooks or external calls made by backing functions. A writeback webhook runs before Ontology edits and blocks them when the external request fails, but the documented inverse remains possible: the external request succeeds and the subsequent Ontology mutation fails. Side-effect webhooks run after object edits; their failure is not surfaced to the end user and may occur after the user has already seen success.

**Problem solved:** provides selectable ordering depending on whether the external system or Ontology should be changed first, while making the distributed transaction boundary explicit.

**Universal primitive:** `local transaction != distributed transaction`; ordering can choose which divergence is preferable but cannot remove the divergence state.

**Preconditions:** an operation spans at least one canonical/local state mutation and one non-transactional external system.

**Trade-offs:** writeback avoids local mutation when the external call definitely fails, but permits `external succeeded / local failed`; post-commit side effects preserve local commit first but permit `local succeeded / external failed`. Multiple side effects have no guaranteed order.

**Failure modes:** lost/ambiguous acknowledgement; external success followed by local validation/conflict failure; local success followed by side-effect failure; duplicate external invocation if an unsafe caller retries; user-visible success preceding external failure.

**Lock-in-specific aspect:** Palantir provides platform-native ordering, action transaction and webhook integration. The transferable requirement is the failure algebra, not dependency on Foundry Actions/Webhooks.

**SB relation:** materially strengthens the existing effect/reconciliation model. A provider call needs a durable effect identity and evidence state so `UNKNOWN` can be reconciled without assuming retry is safe. `Provider ACK`, canonical commit and later observation remain separate evidence dimensions.

**Classification:** `ALREADY COVERED / ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O08 — Retry policy is an effect-safety decision, not generic resilience
**Source/date:** Palantir Action Types — Consistency and isolation; Automate — Effect settings; accessed 2026-09-23.

**Mechanism:** Actions can retry transient local conflicts by re-executing from scratch up to five attempts, but automatic retries are disabled by default when an Action contains external system calls because replay could repeat side effects. Separately, Automate documents **at-least-once** effect execution and explicitly warns that an effect may execute multiple times for one trigger, recommending idempotency, conditional duplicate checks, or duplicate-tolerant data models.

**Problem solved:** recovers from distributed/transient failures without falsely promising exactly-once effects.

**Universal primitive:** `retryability is part of an effect contract`; `at-least-once delivery != exactly-once business effect`.

**Preconditions:** effect execution may be retried, redelivered, time out after remote success, or be resumed after infrastructure failure.

**Trade-offs:** suppressing retries reduces duplication but can leave incomplete work; enabling retries improves liveness but requires idempotency/deduplication/reconciliation. Exactly-once presentation in UI is unsafe without stronger proof.

**Failure modes:** duplicated payment/ticket/provisioning request; stale conditional check; retry against changed canonical state; manual retry using newer configuration; fallback compensates one effect while downstream sequence remains stopped.

**Lock-in-specific aspect:** Foundry supplies retry/fallback/event-history mechanisms. SB should preserve portable effect identity/idempotency/reconciliation semantics in its own contracts rather than require a platform scheduler.

**SB relation:** reinforces workflow/action/provider contracts, autonomous runtime and Host Agent restart semantics. Effect identity should survive transport/process boundaries; retries must be admitted by capability/provider semantics rather than globally assumed safe.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O09 — Branch/test isolation should suppress real-world effects by default
**Source/date:** Palantir Action Types — Branching action types; accessed 2026-09-23.

**Mechanism:** webhooks do not execute by default when Actions run on a branch, specifically to prevent test changes from writing to external systems; execution can be explicitly enabled.

**Problem solved:** separates speculative/test semantic mutations from production side effects.

**Universal primitive:** `projection/branch execution authority != production effect authority`.

**Preconditions:** the platform supports preview, branch, simulation, draft, or alternate-environment execution of actions that could otherwise reach real providers.

**Trade-offs:** suppression makes tests safer but can hide integration defects; explicit opt-in testing needs destination scoping and visible authority.

**Failure modes:** preview accidentally mutates production; a branch appears fully validated despite suppressed integration; test credentials target production; UI fails to distinguish simulated/suppressed from effective external execution.

**Lock-in-specific aspect:** branch-aware webhook suppression is a Foundry mechanism; the portable principle is environment/effect authority separation.

**SB relation:** directly supports `projection != canonical truth`, Station preview/application-building, provider separation and future generated-app testing. A preview surface must not imply that an external effect was executed merely because local projected state changed.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-O06 — Semantic model is a platform backend
OSDK generated bindings expose Ontology entities/actions/functions to applications. This gives strong developer ergonomics and type coupling, but application compatibility becomes sensitive to Ontology API identity/evolution.

**Primitive:** generated semantic client contract.

**SB relation:** attractive for generated typed clients, but SB should bind stable semantic identities/revisions rather than let mutable human-readable/provider names become canonical identity.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

## SB boundary

Do not collapse:

```text
BusinessRecipe -> Palantir Ontology analogy
```

BusinessRecipe is explicitly technology-independent approved business knowledge. A Palantir Ontology is an operational platform model combining data, logic, actions and security. The closer SB comparison is some future composition across SystemDefinition + semantic registry + action/authority contracts, not BusinessRecipe itself.

Likewise, Foundry's Action transaction does not change the SB constitutional requirement that a published runtime remain autonomous from Builder/Core. The transferable material is effect ordering, identity, retry safety and evidence semantics; not a requirement that generated applications call a central semantic platform at runtime.

## Open research

- Exact Ontology provenance/lineage semantics across edits/actions/data sync.
- Permission inheritance and classification propagation through AI/output/log surfaces.
- Branch merge/conflict semantics for Ontology plus dependent apps.
- Idempotency/effect identity support exposed by public webhook/provider APIs beyond caller-designed idempotency.
- Interface version coexistence and runtime resolution in large fleets.

## Sources

Official Palantir docs accessed 2026-09-23: Architecture Center — Ontology system; Interfaces — create/implement/extend/edit/interface action constraints; Action types — actions on interfaces/webhooks, Consistency and isolation, Branching action types; Automate — Effect settings / execution guarantees; OSDK overview.